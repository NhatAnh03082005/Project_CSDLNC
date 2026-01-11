-- =============================================
-- Stored Procedure: sp_NV4_UpdateMedicalRecord
-- Mô tả: Cập nhật hồ sơ khám bệnh (triệu chứng, chẩn đoán, toa thuốc)
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV4_UpdateMedicalRecord
    @MaHoaDon CHAR(8),
    @STT INT,
    @MaNhanVien CHAR(5),
    @TrieuChung NVARCHAR(50) = NULL,
    @ChanDoan NVARCHAR(50) = NULL,
    @ToaThuoc NVARCHAR(30) = NULL,
    @NgayTaiKham DATE = NULL,
    @ErrorMessage NVARCHAR(500) OUTPUT,
    @StatusCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- 1. Kiểm tra nhân viên có phải bác sĩ thú y không
        IF NOT EXISTS (
            SELECT 1 FROM dbo.NhanVien
            WHERE MaNhanVien = @MaNhanVien
              AND ViTri = N'Bác sĩ thú y'
              AND TrangThai = 0
        )
        BEGIN
            SET @ErrorMessage = N'Chỉ bác sĩ thú y mới được cập nhật hồ sơ khám bệnh';
            SET @StatusCode = 403;
            RETURN;
        END
        
        -- 2. Kiểm tra hồ sơ tồn tại
        IF NOT EXISTS (
            SELECT 1 FROM dbo.CTHD_KhamBenh
            WHERE MaHoaDon = @MaHoaDon AND STT = @STT
        )
        BEGIN
            SET @ErrorMessage = N'Không tìm thấy hồ sơ khám bệnh';
            SET @StatusCode = 404;
            RETURN;
        END
        
        -- 3. Kiểm tra có thông tin nào để cập nhật không
        IF @TrieuChung IS NULL AND @ChanDoan IS NULL AND @ToaThuoc IS NULL AND @NgayTaiKham IS NULL
        BEGIN
            SET @ErrorMessage = N'Không có thông tin nào để cập nhật';
            SET @StatusCode = 400;
            RETURN;
        END
        
        BEGIN TRANSACTION;
        
        -- 4. Cập nhật CTHD_KhamBenh
        UPDATE dbo.CTHD_KhamBenh
        SET 
            TrieuChung = ISNULL(@TrieuChung, TrieuChung),
            ChanDoan = ISNULL(@ChanDoan, ChanDoan),
            ToaThuoc = ISNULL(@ToaThuoc, ToaThuoc),
            NgayTaiKham = ISNULL(@NgayTaiKham, NgayTaiKham)
        WHERE MaHoaDon = @MaHoaDon AND STT = @STT;
        
        -- 5. Cập nhật BacSi trong CTHD_DVSucKhoe
        UPDATE dbo.CTHD_DVSucKhoe
        SET BacSi = @MaNhanVien
        WHERE MaHoaDon = @MaHoaDon AND STT = @STT;
        
        SET @StatusCode = 200;
        SET @ErrorMessage = N'Cập nhật hồ sơ khám bệnh thành công';
        
        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @ErrorMessage = ERROR_MESSAGE();
        SET @StatusCode = 500;
    END CATCH
END
GO
