-- =============================================
-- Stored Procedure: sp_NV2_ConfirmOrder
-- Mô tả: Xác nhận đơn hàng, trừ tồn kho, cộng điểm loyalty
-- =============================================
CREATE OR ALTER PROCEDURE sp_NV2_ConfirmOrder
    @MaHoaDon CHAR(8),
    @MaNhanVien CHAR(5),
    @HinhThucThanhToan NVARCHAR(20) = N'Tiền mặt',
    @DiemLoyalty INT OUTPUT,
    @ErrorMessage NVARCHAR(500) OUTPUT,
    @StatusCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @MaKhachHang CHAR(7);
    DECLARE @MaChiNhanh CHAR(4);
    DECLARE @TongTien INT;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- 1. Kiểm tra hóa đơn tồn tại và chưa được xác nhận
        SELECT 
            @MaKhachHang = MaKhachHang,
            @MaChiNhanh = MaChiNhanh,
            @TongTien = TongTien
        FROM dbo.HoaDon
        WHERE MaHoaDon = @MaHoaDon;
        
        IF @MaKhachHang IS NULL
        BEGIN
            SET @ErrorMessage = N'Không tìm thấy hóa đơn';
            SET @StatusCode = 404;
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- 2. Kiểm tra hóa đơn đã được xác nhận chưa
        IF EXISTS (
            SELECT 1 FROM dbo.HoaDon 
            WHERE MaHoaDon = @MaHoaDon AND NhanVienLap IS NOT NULL
        )
        BEGIN
            SET @ErrorMessage = N'Hóa đơn đã được xác nhận';
            SET @StatusCode = 400;
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- 3. Kiểm tra nhân viên tồn tại và thuộc chi nhánh
        IF NOT EXISTS (
            SELECT 1 FROM dbo.NhanVien
            WHERE MaNhanVien = @MaNhanVien
              AND MaChiNhanh = @MaChiNhanh
              AND TrangThai = 0
        )
        BEGIN
            SET @ErrorMessage = N'Nhân viên không thuộc chi nhánh này hoặc không tồn tại';
            SET @StatusCode = 403;
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- 4. Kiểm tra và trừ tồn kho cho từng sản phẩm
        DECLARE @MaSanPham CHAR(5), @SoLuong INT, @SoLuongTon INT;
        
        DECLARE product_cursor CURSOR FOR
        SELECT mh.MaSanPham, mh.SoLuong
        FROM dbo.CTHD cthd
        INNER JOIN dbo.CTHD_MuaHang mh ON cthd.MaHoaDon = mh.MaHoaDon AND cthd.STT = mh.STT
        WHERE cthd.MaHoaDon = @MaHoaDon
          AND cthd.LoaiDichVu = N'Mua hàng';
        
        OPEN product_cursor;
        FETCH NEXT FROM product_cursor INTO @MaSanPham, @SoLuong;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Kiểm tra tồn kho
            SELECT @SoLuongTon = SoLuongTon
            FROM dbo.SanPham_TonKho
            WHERE MaSanPham = @MaSanPham AND MaChiNhanh = @MaChiNhanh;
            
            IF @SoLuongTon IS NULL OR @SoLuongTon < @SoLuong
            BEGIN
                SET @ErrorMessage = N'Sản phẩm ' + @MaSanPham + N' không đủ tồn kho (hiện có: ' + CAST(ISNULL(@SoLuongTon, 0) AS NVARCHAR(10)) + N', cần: ' + CAST(@SoLuong AS NVARCHAR(10)) + N')';
                SET @StatusCode = 400;
                CLOSE product_cursor;
                DEALLOCATE product_cursor;
                ROLLBACK TRANSACTION;
                RETURN;
            END
            
            -- Trừ tồn kho
            UPDATE dbo.SanPham_TonKho
            SET SoLuongTon = SoLuongTon - @SoLuong
            WHERE MaSanPham = @MaSanPham AND MaChiNhanh = @MaChiNhanh;
            
            FETCH NEXT FROM product_cursor INTO @MaSanPham, @SoLuong;
        END
        
        CLOSE product_cursor;
        DEALLOCATE product_cursor;
        
        -- 5. Tính điểm loyalty (1 điểm / 50000 VND theo trigger DB)
        SET @DiemLoyalty = FLOOR(@TongTien / 50000);
        
        -- 6. Cập nhật NhanVienLap và HinhThucThanhToan
        UPDATE dbo.HoaDon
        SET NhanVienLap = @MaNhanVien,
            HinhThucThanhToan = @HinhThucThanhToan
        WHERE MaHoaDon = @MaHoaDon;
        
        -- Trigger TRG_Update_LoyaltyPoints sẽ tự động cộng điểm
        
        SET @StatusCode = 200;
        SET @ErrorMessage = N'Xác nhận hóa đơn thành công';
        
        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @ErrorMessage = ERROR_MESSAGE();
        SET @StatusCode = 500;
        SET @DiemLoyalty = 0;
    END CATCH
END
GO
