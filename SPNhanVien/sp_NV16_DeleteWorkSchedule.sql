-- =============================================
-- Stored Procedure: sp_NV16_DeleteWorkSchedule
-- Mô tả: Xóa lịch làm việc của nhân viên (khớp với API)
-- Tham số: @MaNhanVien, @NgayLam, @GioBatDau
-- Output: @ErrorMessage, @StatusCode
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV16_DeleteWorkSchedule
    @MaNhanVien CHAR(5),
    @NgayLam DATE,
    @GioBatDau TIME,
    @ErrorMessage NVARCHAR(500) OUTPUT,
    @StatusCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- 1. Kiểm tra lịch làm việc có thuộc về nhân viên này không
        IF NOT EXISTS (
            SELECT 1 FROM dbo.LichLamViec
            WHERE BacSi = @MaNhanVien
              AND NgayLam = @NgayLam
              AND GioBatDau = @GioBatDau
        )
        BEGIN
            SET @ErrorMessage = N'Không tìm thấy lịch làm việc hoặc không có quyền xóa';
            SET @StatusCode = 404;
            RETURN;
        END
        
        -- 2. Xóa lịch làm việc
        DELETE FROM dbo.LichLamViec
        WHERE BacSi = @MaNhanVien
          AND NgayLam = @NgayLam
          AND GioBatDau = @GioBatDau;
        
        SET @StatusCode = 200;
        SET @ErrorMessage = N'Xóa lịch làm việc thành công';
        
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        SET @StatusCode = 500;
    END CATCH
END
GO
