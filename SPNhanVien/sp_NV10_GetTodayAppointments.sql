-- =============================================
-- Stored Procedure: sp_NV10_GetTodayAppointments
-- Mô tả: Lấy lịch hẹn trong ngày tại chi nhánh
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV10_GetTodayAppointments
    @MaChiNhanh CHAR(4),
    @Date DATE = NULL -- Nếu NULL thì lấy ngày hôm nay
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @Date IS NULL
        SET @Date = CAST(GETDATE() AS DATE);
    
    SELECT 
        lh.MaLichHen,
        lh.MaKhachHang,
        kh.HoTen AS TenKhachHang,
        kh.SDT,
        lh.MaChiNhanh,
        cn.TenChiNhanh,
        lh.LoaiDichVu,
        lh.ThoiGianHen,
        lh.NgayLap,
        lh.TrangThai,
        lh.BacSiPhuTrach,
        nv.HoTen AS TenBacSiPhuTrach
    FROM dbo.LichHen lh
    INNER JOIN dbo.KhachHang kh ON lh.MaKhachHang = kh.MaKhachHang
    INNER JOIN dbo.ChiNhanh cn ON lh.MaChiNhanh = cn.MaChiNhanh
    LEFT JOIN dbo.NhanVien nv ON lh.BacSiPhuTrach = nv.MaNhanVien
    WHERE lh.MaChiNhanh = @MaChiNhanh
      AND CAST(lh.ThoiGianHen AS DATE) = @Date
    ORDER BY lh.ThoiGianHen ASC, lh.MaLichHen ASC;
END
GO
