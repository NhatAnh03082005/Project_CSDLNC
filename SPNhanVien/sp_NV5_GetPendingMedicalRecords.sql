-- =============================================
-- Stored Procedure: sp_NV5_GetPendingMedicalRecords
-- Mô tả: Lấy danh sách hồ sơ khám bệnh chờ cập nhật tại chi nhánh
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV5_GetPendingMedicalRecords
    @MaChiNhanh CHAR(4)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT
        kb.MaHoaDon,
        kb.STT,
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
    FROM dbo.CTHD_KhamBenh kb
    INNER JOIN dbo.CTHD_DVSucKhoe dvsk 
        ON kb.MaHoaDon = dvsk.MaHoaDon AND kb.STT = dvsk.STT
    INNER JOIN dbo.ThuCung tc 
        ON dvsk.MaKhachHang = tc.MaKhachHang AND dvsk.MaThuCung = tc.MaThuCung
    INNER JOIN dbo.KhachHang kh 
        ON dvsk.MaKhachHang = kh.MaKhachHang
    INNER JOIN dbo.HoaDon hd 
        ON kb.MaHoaDon = hd.MaHoaDon
    WHERE hd.MaChiNhanh = @MaChiNhanh
      AND (kb.TrieuChung IS NULL OR kb.ChanDoan IS NULL)
    ORDER BY hd.NgayLap DESC;
END
GO
