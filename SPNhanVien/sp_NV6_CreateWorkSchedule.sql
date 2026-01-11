-- =============================================
-- Stored Procedure: sp_NV6_CreateWorkSchedule
-- Mô tả: Đăng ký lịch làm việc cho nhân viên (khớp với API)
-- Tham số: @MaNhanVien, @NgayLam, @GioBatDau, @GioKetThuc
-- Output: @ErrorMessage, @StatusCode
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV6_CreateWorkSchedule
    @MaNhanVien CHAR(5),
    @NgayLam DATE,
    @GioBatDau TIME,
    @GioKetThuc TIME,
    @ErrorMessage NVARCHAR(500) OUTPUT,
    @StatusCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- 1. Kiểm tra xung đột lịch (trùng ngày và giờ)
        IF EXISTS (
            SELECT 1 FROM dbo.LichLamViec llv
            WHERE llv.BacSi = @MaNhanVien
              AND CAST(llv.NgayLam AS DATE) = CAST(@NgayLam AS DATE)
              AND (
                  (@GioBatDau >= llv.GioBatDau AND @GioBatDau < llv.GioKetThuc)
                  OR (@GioKetThuc > llv.GioBatDau AND @GioKetThuc <= llv.GioKetThuc)
                  OR (@GioBatDau <= llv.GioBatDau AND @GioKetThuc >= llv.GioKetThuc)
              )
        )
        BEGIN
            SET @ErrorMessage = N'Lịch làm việc bị trùng với lịch đã đăng ký';
            SET @StatusCode = 400;
            RETURN;
        END
        
        -- 2. Thêm lịch làm việc mới
        INSERT INTO dbo.LichLamViec (BacSi, NgayLam, GioBatDau, GioKetThuc)
        VALUES (@MaNhanVien, @NgayLam, @GioBatDau, @GioKetThuc);
        
        SET @StatusCode = 201;
        SET @ErrorMessage = N'Đăng ký lịch làm việc thành công';
        
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        SET @StatusCode = 500;
    END CATCH
END
GO
