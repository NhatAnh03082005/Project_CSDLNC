-- =============================================
-- Stored Procedure: sp_NV1_GetPendingOrders
-- Mô tả: Lấy danh sách đơn hàng chờ xác nhận tại chi nhánh
-- (NhanVienLap = NULL nghĩa là chờ xác nhận)
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV1_GetPendingOrders
    @MaChiNhanh CHAR(4)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        hd.MaHoaDon,
        hd.MaKhachHang,
        kh.HoTen AS TenKhachHang,
        kh.SDT,
        hd.NgayLap,
        hd.TongTien,
        hd.HinhThucThanhToan,
        hd.MaKhuyenMai,
        km.TiLeGiamGia,
        cn.TenChiNhanh
    FROM dbo.HoaDon hd
    INNER JOIN dbo.KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
    INNER JOIN dbo.ChiNhanh cn ON hd.MaChiNhanh = cn.MaChiNhanh
    LEFT JOIN dbo.KhuyenMai km ON hd.MaKhuyenMai = km.MaKhuyenMai
    WHERE hd.NhanVienLap IS NULL
      AND hd.MaChiNhanh = @MaChiNhanh
      AND EXISTS (
          SELECT 1 FROM dbo.CTHD cthd 
          WHERE cthd.MaHoaDon = hd.MaHoaDon 
          AND cthd.LoaiDichVu = N'Mua hàng'
      )
    ORDER BY hd.NgayLap ASC, hd.MaHoaDon ASC;
END
GO
