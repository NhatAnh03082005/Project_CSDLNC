-- =============================================
-- Stored Procedure: sp_NV11_GetPendingVaccinationRecords
-- Mô tả: Lấy danh sách hồ sơ tiêm phòng chờ cập nhật tại chi nhánh
-- (MaVacXin = NULL nghĩa là chưa chọn vaccine)
-- Cần Index: HoaDon(MaChiNhanh), CTHD_TiemPhong(MaHoaDon)
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV11_GetPendingVaccinationRecords
    @MaChiNhanh CHAR(4)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT
        tp.MaHoaDon,
        tp.STT,
        dvsk.MaKhachHang,
        dvsk.MaThuCung,
        tc.TenThuCung,
        tc.Loai AS LoaiThuCung,
        tc.Giong AS GiongThuCung,
        kh.HoTen AS TenKhachHang,
        kh.SDT AS SDTKhachHang,
        hd.NgayLap,
        dvsk.LoaiDichVuSK AS LoaiDichVu,
        N'Chờ cập nhật' AS TrangThai
    FROM dbo.CTHD_TiemPhong tp
    INNER JOIN dbo.CTHD_DVSucKhoe dvsk 
        ON tp.MaHoaDon = dvsk.MaHoaDon AND tp.STT = dvsk.STT
    INNER JOIN dbo.ThuCung tc 
        ON dvsk.MaKhachHang = tc.MaKhachHang AND dvsk.MaThuCung = tc.MaThuCung
    INNER JOIN dbo.KhachHang kh 
        ON dvsk.MaKhachHang = kh.MaKhachHang
    INNER JOIN dbo.HoaDon hd 
        ON tp.MaHoaDon = hd.MaHoaDon
    WHERE hd.MaChiNhanh = @MaChiNhanh
      AND tp.MaVacXin IS NULL
    ORDER BY hd.NgayLap DESC;
END
GO
