-- =============================================
-- Stored Procedure: sp_NV7_GetWorkSchedule
-- Mô tả: Lấy lịch làm việc của nhân viên (khớp với API)
-- Tham số: @MaNhanVien
-- Output: Danh sách lịch làm việc
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV7_GetWorkSchedule
    @MaNhanVien CHAR(5)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        llv.BacSi AS MaNhanVien,
        llv.NgayLam,
        llv.GioBatDau,
        llv.GioKetThuc
    FROM dbo.LichLamViec llv
    WHERE llv.BacSi = @MaNhanVien
    ORDER BY llv.NgayLam DESC, llv.GioBatDau ASC;
END
GO
