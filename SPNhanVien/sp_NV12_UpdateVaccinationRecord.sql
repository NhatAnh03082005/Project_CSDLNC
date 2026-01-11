-- =============================================
-- Stored Procedure: sp_NV12_UpdateVaccinationRecord
-- Mô tả: Cập nhật hồ sơ tiêm phòng (chọn vaccine, bác sĩ)
-- Cần Index: CTHD_TiemPhong(MaHoaDon, STT)
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV12_UpdateVaccinationRecord
    @MaHoaDon CHAR(8),
    @STT INT,
    @MaNhanVien CHAR(5),
    @MaVacXin NVARCHAR(10),
    @MaGoiDK CHAR(6) = NULL,
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
            SET @ErrorMessage = N'Chỉ bác sĩ thú y mới được cập nhật hồ sơ tiêm phòng';
            SET @StatusCode = 403;
            RETURN;
        END
        
        -- 2. Kiểm tra vaccine tồn tại
        IF NOT EXISTS (
            SELECT 1 FROM dbo.VacXin WHERE MaVacXin = @MaVacXin
        )
        BEGIN
            SET @ErrorMessage = N'Không tìm thấy vaccine';
            SET @StatusCode = 404;
            RETURN;
        END
        
        -- 3. Kiểm tra hồ sơ tồn tại
        IF NOT EXISTS (
            SELECT 1 FROM dbo.CTHD_TiemPhong
            WHERE MaHoaDon = @MaHoaDon AND STT = @STT
        )
        BEGIN
            SET @ErrorMessage = N'Không tìm thấy hồ sơ tiêm phòng';
            SET @StatusCode = 404;
            RETURN;
        END
        
        BEGIN TRANSACTION;
        
        -- 4. Cập nhật CTHD_TiemPhong
        UPDATE dbo.CTHD_TiemPhong
        SET 
            MaVacXin = @MaVacXin,
            MaGoiDK = ISNULL(@MaGoiDK, MaGoiDK)
        WHERE MaHoaDon = @MaHoaDon AND STT = @STT;
        
        -- 5. Cập nhật BacSi trong CTHD_DVSucKhoe
        UPDATE dbo.CTHD_DVSucKhoe
        SET BacSi = @MaNhanVien
        WHERE MaHoaDon = @MaHoaDon AND STT = @STT;
        
        SET @StatusCode = 200;
        SET @ErrorMessage = N'Cập nhật hồ sơ tiêm phòng thành công';
        
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
