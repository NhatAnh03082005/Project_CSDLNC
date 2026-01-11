-- =============================================
-- Stored Procedure: sp_NV3_CreateMultiServiceRecord
-- Mô tả: Tạo hồ sơ đa dịch vụ (HoaDon + CTHD + CTHD_DVSucKhoe + CTHD_KhamBenh/CTHD_TiemPhong)
-- Tham số: @MaKhachHang, @MaChiNhanh, @PetsJSON (JSON array)
-- Output: @MaHoaDon, @ErrorMessage, @StatusCode
-- Format PetsJSON: [{"MaThuCung": 1, "services": ["Khám bệnh", "Tiêm phòng"]}, ...]
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV3_CreateMultiServiceRecord
    @MaKhachHang CHAR(7),
    @MaChiNhanh CHAR(4),
    @PetsJSON NVARCHAR(MAX),
    @MaHoaDon CHAR(8) OUTPUT,
    @ErrorMessage NVARCHAR(500) OUTPUT,
    @StatusCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    
    DECLARE @NewMaHoaDon CHAR(8);
    DECLARE @MaxID INT;
    DECLARE @TotalPets INT = 0;
    DECLARE @TotalServices INT = 0;
    DECLARE @STT INT = 1;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- 1. Kiểm tra khách hàng tồn tại
        IF NOT EXISTS (SELECT 1 FROM dbo.KhachHang WHERE MaKhachHang = @MaKhachHang)
        BEGIN
            SET @ErrorMessage = N'Không tìm thấy khách hàng';
            SET @StatusCode = 404;
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- 2. Parse JSON và kiểm tra thú cưng
        DECLARE @PetsTable TABLE (
            MaThuCung INT,
            TenThuCung NVARCHAR(50)
        );
        
        DECLARE @ServicesTable TABLE (
            PetIndex INT,
            MaThuCung INT,
            LoaiDichVu NVARCHAR(20)
        );
        
        -- Parse pets từ JSON
        INSERT INTO @PetsTable (MaThuCung)
        SELECT DISTINCT CAST(JSON_VALUE(value, '$.MaThuCung') AS INT)
        FROM OPENJSON(@PetsJSON);
        
        -- Kiểm tra tất cả thú cưng thuộc về khách hàng
        DECLARE @InvalidPet INT;
        SELECT TOP 1 @InvalidPet = pt.MaThuCung
        FROM @PetsTable pt
        LEFT JOIN dbo.ThuCung tc ON pt.MaThuCung = tc.MaThuCung AND tc.MaKhachHang = @MaKhachHang
        WHERE tc.MaThuCung IS NULL;
        
        IF @InvalidPet IS NOT NULL
        BEGIN
            SET @ErrorMessage = N'Không tìm thấy thú cưng ' + CAST(@InvalidPet AS NVARCHAR(10)) + N' hoặc thú cưng không thuộc khách hàng này';
            SET @StatusCode = 404;
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Cập nhật tên thú cưng
        UPDATE pt
        SET pt.TenThuCung = tc.TenThuCung
        FROM @PetsTable pt
        INNER JOIN dbo.ThuCung tc ON pt.MaThuCung = tc.MaThuCung;
        
        -- Parse services cho từng pet
        DECLARE @PetIndex INT = 0;
        DECLARE @CurrentMaThuCung INT;
        DECLARE @CurrentServices NVARCHAR(MAX);
        
        DECLARE pet_cursor CURSOR FOR
            SELECT CAST(JSON_VALUE(value, '$.MaThuCung') AS INT),
                   JSON_QUERY(value, '$.services')
            FROM OPENJSON(@PetsJSON);
        
        OPEN pet_cursor;
        FETCH NEXT FROM pet_cursor INTO @CurrentMaThuCung, @CurrentServices;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            SET @PetIndex = @PetIndex + 1;
            
            INSERT INTO @ServicesTable (PetIndex, MaThuCung, LoaiDichVu)
            SELECT @PetIndex, @CurrentMaThuCung, value
            FROM OPENJSON(@CurrentServices);
            
            FETCH NEXT FROM pet_cursor INTO @CurrentMaThuCung, @CurrentServices;
        END
        
        CLOSE pet_cursor;
        DEALLOCATE pet_cursor;
        
        -- 3. Tạo MaHoaDon mới
        SELECT @MaxID = ISNULL(MAX(CAST(RIGHT(MaHoaDon, 6) AS INT)), 0) FROM HoaDon;
        SET @NewMaHoaDon = 'HD' + RIGHT('000000' + CAST(@MaxID + 1 AS VARCHAR(6)), 6);
        
        -- 4. Insert HoaDon
        INSERT INTO dbo.HoaDon (MaHoaDon, MaKhachHang, NgayLap, TongTien, HinhThucThanhToan, MaKhuyenMai, NhanVienLap, MaChiNhanh)
        VALUES (@NewMaHoaDon, @MaKhachHang, GETDATE(), 0, NULL, NULL, NULL, @MaChiNhanh);
        
        -- 5. Insert CTHD, CTHD_DVSucKhoe, và bảng chi tiết cho từng dịch vụ
        DECLARE @LoaiDichVu NVARCHAR(20);
        
        DECLARE service_cursor CURSOR FOR
            SELECT MaThuCung, LoaiDichVu
            FROM @ServicesTable
            ORDER BY PetIndex, MaThuCung;
        
        OPEN service_cursor;
        FETCH NEXT FROM service_cursor INTO @CurrentMaThuCung, @LoaiDichVu;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Insert CTHD
            INSERT INTO dbo.CTHD (MaHoaDon, STT, LoaiDichVu, ThanhTien)
            VALUES (@NewMaHoaDon, @STT, @LoaiDichVu, 0);
            
            -- Insert CTHD_DVSucKhoe
            INSERT INTO dbo.CTHD_DVSucKhoe (MaHoaDon, STT, MaKhachHang, MaThuCung, BacSi, LoaiDichVuSK)
            VALUES (@NewMaHoaDon, @STT, @MaKhachHang, @CurrentMaThuCung, NULL, @LoaiDichVu);
            
            -- Insert bảng chi tiết tùy loại dịch vụ
            IF @LoaiDichVu = N'Khám bệnh'
            BEGIN
                INSERT INTO dbo.CTHD_KhamBenh (MaHoaDon, STT, TrieuChung, ChanDoan, ToaThuoc, NgayTaiKham)
                VALUES (@NewMaHoaDon, @STT, NULL, NULL, NULL, NULL);
            END
            ELSE IF @LoaiDichVu = N'Tiêm phòng'
            BEGIN
                INSERT INTO dbo.CTHD_TiemPhong (MaHoaDon, STT, MaVacXin, MaGoiDK)
                VALUES (@NewMaHoaDon, @STT, NULL, NULL);
            END
            
            SET @STT = @STT + 1;
            SET @TotalServices = @TotalServices + 1;
            
            FETCH NEXT FROM service_cursor INTO @CurrentMaThuCung, @LoaiDichVu;
        END
        
        CLOSE service_cursor;
        DEALLOCATE service_cursor;
        
        -- Đếm số thú cưng unique
        SELECT @TotalPets = COUNT(DISTINCT MaThuCung) FROM @PetsTable;
        
        COMMIT TRANSACTION;
        
        SET @MaHoaDon = @NewMaHoaDon;
        SET @StatusCode = 201;
        SET @ErrorMessage = N'Tạo hồ sơ thành công với ' + CAST(@TotalPets AS NVARCHAR(10)) + N' thú cưng và ' + CAST(@TotalServices AS NVARCHAR(10)) + N' dịch vụ';
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SET @MaHoaDon = NULL;
        SET @ErrorMessage = ERROR_MESSAGE();
        SET @StatusCode = 500;
    END CATCH
END
GO
