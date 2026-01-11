-- =============================================
-- Stored Procedure: sp_NV13_GetAvailableVaccines
-- Mô tả: Lấy danh sách vaccine có tồn kho > 0 tại chi nhánh
-- Cần Index: VacXin_TonKho(MaChiNhanh)
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV13_GetAvailableVaccines
    @MaChiNhanh CHAR(4)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        vx.MaVacXin,
        vx.TenVacXin,
        vx.GiaTien,
        tk.SoLuongTon AS SoLuongTonKho
    FROM dbo.VacXin vx
    INNER JOIN dbo.VacXin_TonKho tk 
        ON vx.MaVacXin = tk.MaVacXin 
        AND tk.MaChiNhanh = @MaChiNhanh
    WHERE tk.SoLuongTon > 0
    ORDER BY vx.TenVacXin;
END
GO
