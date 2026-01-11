-- =============================================
-- Stored Procedure: sp_NV15_GetProductsByBranch
-- Mô tả: Lấy danh sách sản phẩm có tồn kho > 0 tại chi nhánh (khớp với API)
-- Tham số: @MaChiNhanh
-- Output: 2 recordsets - [0] branch info, [1] products list
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV15_GetProductsByBranch
    @MaChiNhanh CHAR(4)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- 1. Kiểm tra chi nhánh tồn tại và trả về thông tin
    DECLARE @TenChiNhanh NVARCHAR(100);
    
    SELECT @TenChiNhanh = TenChiNhanh
    FROM dbo.ChiNhanh
    WHERE MaChiNhanh = @MaChiNhanh;
    
    IF @TenChiNhanh IS NULL
    BEGIN
        -- Trả về recordset rỗng cho branch
        SELECT NULL AS MaChiNhanh, NULL AS TenChiNhanh WHERE 1=0;
        -- Trả về recordset rỗng cho products
        SELECT NULL AS MaSanPham, NULL AS TenSanPham, NULL AS LoaiSanPham, 
               NULL AS DonGia, NULL AS SoLuongTonKho WHERE 1=0;
        RETURN;
    END
    
    -- 2. Trả về thông tin chi nhánh (recordset 0)
    SELECT @MaChiNhanh AS MaChiNhanh, @TenChiNhanh AS TenChiNhanh;
    
    -- 3. Trả về danh sách sản phẩm có tồn kho > 0 (recordset 1)
    SELECT 
        sp.MaSanPham,
        sp.TenSanPham,
        sp.LoaiSanPham,
        sp.DonGia,
        tk.SoLuongTon AS SoLuongTonKho
    FROM dbo.SanPham sp
    INNER JOIN dbo.SanPham_TonKho tk 
        ON sp.MaSanPham = tk.MaSanPham AND tk.MaChiNhanh = @MaChiNhanh
    WHERE tk.SoLuongTon > 0
    ORDER BY sp.LoaiSanPham, sp.TenSanPham;
END
GO
