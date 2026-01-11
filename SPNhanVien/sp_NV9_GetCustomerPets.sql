-- =============================================
-- Stored Procedure: sp_NV9_GetCustomerPets
-- Mô tả: Lấy danh sách thú cưng của khách hàng (khớp với API)
-- Tham số: @MaKhachHang
-- Output: 2 recordsets - [0] customer info, [1] pets list
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV9_GetCustomerPets
    @MaKhachHang CHAR(7)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- 1. Kiểm tra khách hàng tồn tại và trả về thông tin
    DECLARE @HoTen NVARCHAR(50);
    
    SELECT @HoTen = HoTen
    FROM dbo.KhachHang
    WHERE MaKhachHang = @MaKhachHang;
    
    IF @HoTen IS NULL
    BEGIN
        -- Trả về recordset rỗng cho customer
        SELECT NULL AS MaKhachHang, NULL AS HoTen WHERE 1=0;
        -- Trả về recordset rỗng cho pets
        SELECT NULL AS MaKhachHang, NULL AS MaThuCung, NULL AS TenThuCung, 
               NULL AS GioiTinh, NULL AS Loai, NULL AS Giong, 
               NULL AS NgaySinh, NULL AS TinhTrangSucKhoe WHERE 1=0;
        RETURN;
    END
    
    -- 2. Trả về thông tin khách hàng (recordset 0)
    SELECT @MaKhachHang AS MaKhachHang, @HoTen AS HoTen;
    
    -- 3. Trả về danh sách thú cưng (recordset 1)
    SELECT 
        tc.MaKhachHang,
        tc.MaThuCung,
        tc.TenThuCung,
        tc.GioiTinh,
        tc.Loai,
        tc.Giong,
        tc.NgaySinh,
        tc.TinhTrangSucKhoe
    FROM dbo.ThuCung tc
    WHERE tc.MaKhachHang = @MaKhachHang
    ORDER BY tc.MaThuCung ASC;
END
GO
