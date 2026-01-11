-- =============================================
-- Stored Procedure: sp_NV14_GetAppointmentsSchedule
-- Mô tả: Lấy lịch hẹn theo chi nhánh/ngày/trạng thái (cho nhân viên)
-- Cần Index: LichHen(MaChiNhanh, ThoiGianHen, TrangThai)
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV14_GetAppointmentsSchedule
    @MaChiNhanh CHAR(4) = NULL,
    @NgayHen DATE = NULL,
    @TrangThai NVARCHAR(20) = NULL,
    @Page INT = 1,
    @Limit INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@Page - 1) * @Limit;
    
    -- Đếm tổng số bản ghi
    SELECT COUNT(*) AS Total
    FROM dbo.LichHen lh
    WHERE (@MaChiNhanh IS NULL OR lh.MaChiNhanh = @MaChiNhanh)
      AND (@NgayHen IS NULL OR CAST(lh.ThoiGianHen AS DATE) = @NgayHen)
      AND (@TrangThai IS NULL OR lh.TrangThai = @TrangThai);
    
    -- Lấy danh sách lịch hẹn với phân trang
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
    WHERE (@MaChiNhanh IS NULL OR lh.MaChiNhanh = @MaChiNhanh)
      AND (@NgayHen IS NULL OR CAST(lh.ThoiGianHen AS DATE) = @NgayHen)
      AND (@TrangThai IS NULL OR lh.TrangThai = @TrangThai)
    ORDER BY lh.ThoiGianHen DESC, lh.MaLichHen DESC
    OFFSET @Offset ROWS
    FETCH NEXT @Limit ROWS ONLY;
END
GO
