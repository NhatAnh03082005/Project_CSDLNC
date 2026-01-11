-- =============================================
-- Stored Procedure: sp_NV8_SearchCustomers
-- Mô tả: Tìm kiếm khách hàng theo tên/SĐT/CCCD (khớp với API)
-- Tham số: @Name, @Phone, @CCCD (tất cả optional)
-- Output: Danh sách khách hàng
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV8_SearchCustomers
    @Name NVARCHAR(255) = NULL,
    @Phone NVARCHAR(20) = NULL,
    @CCCD NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Nếu không có điều kiện nào thì trả về rỗng
    IF @Name IS NULL AND @Phone IS NULL AND @CCCD IS NULL
    BEGIN
        SELECT 
            NULL AS MaKhachHang,
            NULL AS HoTen,
            NULL AS GioiTinh,
            NULL AS SDT,
            NULL AS CCCD,
            NULL AS Email,
            NULL AS NgaySinh,
            NULL AS DiemLoyalty,
            NULL AS CapHoiVien,
            NULL AS SoLuongThuCung
        WHERE 1 = 0;
        RETURN;
    END
    
    SELECT 
        kh.MaKhachHang,
        kh.HoTen,
        kh.GioiTinh,
        kh.SDT,
        kh.CCCD,
        kh.Email,
        kh.NgaySinh,
        kh.DiemLoyalty,
        kh.CapHoiVien,
        (SELECT COUNT(*) FROM dbo.ThuCung tc WHERE tc.MaKhachHang = kh.MaKhachHang) AS SoLuongThuCung
    FROM dbo.KhachHang kh
    WHERE 
        (@Name IS NULL OR kh.HoTen LIKE '%' + @Name + '%')
        AND (@Phone IS NULL OR kh.SDT LIKE '%' + @Phone + '%')
        AND (@CCCD IS NULL OR kh.CCCD LIKE '%' + @CCCD + '%')
    ORDER BY kh.MaKhachHang ASC;
END
GO
