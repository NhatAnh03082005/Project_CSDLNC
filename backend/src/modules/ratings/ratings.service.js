const { sql, poolPromise } = require("../../config/database");

/**
 * Tạo hoặc cập nhật đánh giá dịch vụ của khách hàng
 * @param {string} customerId - Mã khách hàng
 * @param {object} ratingData - Dữ liệu đánh giá { MaHoaDon, STT, DiemChatLuongDV, DiemThaiDoNV, DiemTongThe, BinhLuan? }
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function createOrUpdateRating(customerId, ratingData) {
  const { MaHoaDon, STT, DiemChatLuongDV, DiemThaiDoNV, DiemTongThe, BinhLuan } = ratingData;

  if (!MaHoaDon || STT === undefined || DiemChatLuongDV === undefined || DiemThaiDoNV === undefined || DiemTongThe === undefined) {
    return {
      success: false,
      status: 400,
      message: "Thiếu thông tin bắt buộc: MaHoaDon, STT, DiemChatLuongDV, DiemThaiDoNV, DiemTongThe",
    };
  }

  if (
    DiemChatLuongDV < 0 || DiemChatLuongDV > 10 ||
    DiemThaiDoNV < 0 || DiemThaiDoNV > 10 ||
    DiemTongThe < 0 || DiemTongThe > 10
  ) {
    return {
      success: false,
      status: 400,
      message: "Điểm đánh giá phải từ 0 đến 10",
    };
  }

  try {
    const pool = await poolPromise;

    const invoiceCheck = await pool
      .request()
      .input("MaHoaDon", sql.Char(8), MaHoaDon)
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        SELECT TOP 1 MaHoaDon
        FROM dbo.HoaDon
        WHERE MaHoaDon = @MaHoaDon AND MaKhachHang = @MaKhachHang
      `
      );

    if (invoiceCheck.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy hóa đơn hoặc bạn không có quyền đánh giá dịch vụ này",
      };
    }

    const serviceCheck = await pool
      .request()
      .input("MaHoaDon", sql.Char(8), MaHoaDon)
      .input("STT", sql.Int, STT)
      .query(
        `
        SELECT TOP 1
          cthd.MaHoaDon,
          cthd.STT,
          cthd.LoaiDichVu,
          dvsk.MaThuCung,
          dvsk.BacSi,
          nvBs.HoTen AS TenBacSi
        FROM dbo.CTHD cthd
        INNER JOIN dbo.CTHD_DVSucKhoe dvsk
          ON cthd.MaHoaDon = dvsk.MaHoaDon AND cthd.STT = dvsk.STT
        LEFT JOIN dbo.NhanVien nvBs
          ON dvsk.BacSi = nvBs.MaNhanVien
        WHERE cthd.MaHoaDon = @MaHoaDon AND cthd.STT = @STT
      `
      );

    if (serviceCheck.recordset.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Chỉ có thể đánh giá dịch vụ sức khỏe (khám bệnh hoặc tiêm phòng)",
      };
    }

    const serviceInfo = serviceCheck.recordset[0];
    const existingRating = await pool
      .request()
      .input("MaHoaDon", sql.Char(8), MaHoaDon)
      .input("STT", sql.Int, STT)
      .query(
        `
        SELECT TOP 1 *
        FROM dbo.DanhGia
        WHERE MaHoaDon = @MaHoaDon AND STT = @STT
      `
      );

    if (existingRating.recordset.length > 0) {
      await pool
        .request()
        .input("MaHoaDon", sql.Char(8), MaHoaDon)
        .input("STT", sql.Int, STT)
        .input("DiemChatLuongDV", sql.Int, DiemChatLuongDV)
        .input("DiemThaiDoNV", sql.Int, DiemThaiDoNV)
        .input("DiemTongThe", sql.Int, DiemTongThe)
        .input("BinhLuan", sql.NVarChar(100), BinhLuan || null)
        .query(
          `
          UPDATE dbo.DanhGia
          SET DiemChatLuongDV = @DiemChatLuongDV,
              DiemThaiDoNV = @DiemThaiDoNV,
              DiemTongThe = @DiemTongThe,
              BinhLuan = @BinhLuan
          WHERE MaHoaDon = @MaHoaDon AND STT = @STT
        `
        );
    } else {
      await pool
        .request()
        .input("MaHoaDon", sql.Char(8), MaHoaDon)
        .input("STT", sql.Int, STT)
        .input("DiemChatLuongDV", sql.Int, DiemChatLuongDV)
        .input("DiemThaiDoNV", sql.Int, DiemThaiDoNV)
        .input("DiemTongThe", sql.Int, DiemTongThe)
        .input("BinhLuan", sql.NVarChar(100), BinhLuan || null)
        .query(
          `
          INSERT INTO dbo.DanhGia
            (MaHoaDon, STT, DiemChatLuongDV, DiemThaiDoNV, DiemTongThe, BinhLuan)
          VALUES
            (@MaHoaDon, @STT, @DiemChatLuongDV, @DiemThaiDoNV, @DiemTongThe, @BinhLuan)
        `
        );
    }

    const ratingResult = await pool
      .request()
      .input("MaHoaDon", sql.Char(8), MaHoaDon)
      .input("STT", sql.Int, STT)
      .query(
        `
        SELECT 
          dg.MaHoaDon,
          dg.STT,
          dg.DiemChatLuongDV,
          dg.DiemThaiDoNV,
          dg.DiemTongThe,
          dg.BinhLuan,
          cthd.LoaiDichVu,
          dvsk.BacSi AS MaBacSi,
          nvBs.HoTen AS TenBacSi,
          hd.MaChiNhanh,
          cn.TenChiNhanh
        FROM dbo.DanhGia dg
        INNER JOIN dbo.CTHD cthd
          ON dg.MaHoaDon = cthd.MaHoaDon AND dg.STT = cthd.STT
        INNER JOIN dbo.CTHD_DVSucKhoe dvsk
          ON dg.MaHoaDon = dvsk.MaHoaDon AND dg.STT = dvsk.STT
        LEFT JOIN dbo.NhanVien nvBs
          ON dvsk.BacSi = nvBs.MaNhanVien
        LEFT JOIN dbo.HoaDon hd
          ON dg.MaHoaDon = hd.MaHoaDon
        LEFT JOIN dbo.ChiNhanh cn
          ON hd.MaChiNhanh = cn.MaChiNhanh
        WHERE dg.MaHoaDon = @MaHoaDon AND dg.STT = @STT
      `
      );

    return {
      success: true,
      status: existingRating.recordset.length > 0 ? 200 : 201,
      message: existingRating.recordset.length > 0 ? "Cập nhật đánh giá thành công" : "Tạo đánh giá thành công",
      data: ratingResult.recordset[0],
    };
  } catch (error) {
    console.error("Error creating/updating rating:", error);

    if (error.number === 547 || error.message.includes("FOREIGN KEY")) {
      return {
        success: false,
        status: 400,
        message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin đánh giá.",
        error: error.message,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Lỗi khi tạo/cập nhật đánh giá",
      error: error.message,
    };
  }
}

/**
 * Lấy danh sách dịch vụ sức khỏe đã sử dụng của khách hàng để đánh giá
 * @param {string} customerId - Mã khách hàng
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: array, count?: number, error?: string}>}
 */
async function getRateableServices(customerId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        SELECT 
          cthd.MaHoaDon,
          cthd.STT,
          cthd.LoaiDichVu,
          cthd.ThanhTien,
          hd.NgayLap,
          hd.MaChiNhanh,
          cn.TenChiNhanh,
          dvsk.MaThuCung,
          dvsk.MaKhachHang,
          tc.TenThuCung,
          tc.Loai AS LoaiThuCung,
          dvsk.BacSi AS MaBacSi,
          nvBs.HoTen AS TenBacSi,
          dvsk.LoaiDichVuSK,
          -- Thông tin khám bệnh (nếu có)
          kb.TrieuChung,
          kb.ChanDoan,
          kb.ToaThuoc,
          kb.NgayTaiKham,
          -- Thông tin tiêm phòng (nếu có)
          tp.MaVacXin,
          vx.TenVacXin,
          tp.MaGoiDK,
          -- Thông tin đánh giá (nếu có)
          dg.DiemChatLuongDV,
          dg.DiemThaiDoNV,
          dg.DiemTongThe,
          dg.BinhLuan,
          CASE 
            WHEN dg.MaHoaDon IS NOT NULL THEN 1
            ELSE 0
          END AS DaDanhGia
        FROM dbo.CTHD cthd
        INNER JOIN dbo.CTHD_DVSucKhoe dvsk
          ON cthd.MaHoaDon = dvsk.MaHoaDon AND cthd.STT = dvsk.STT
        INNER JOIN dbo.HoaDon hd
          ON cthd.MaHoaDon = hd.MaHoaDon
        LEFT JOIN dbo.ChiNhanh cn
          ON hd.MaChiNhanh = cn.MaChiNhanh
        LEFT JOIN dbo.ThuCung tc
          ON dvsk.MaKhachHang = tc.MaKhachHang AND dvsk.MaThuCung = tc.MaThuCung
        LEFT JOIN dbo.NhanVien nvBs
          ON dvsk.BacSi = nvBs.MaNhanVien
        LEFT JOIN dbo.CTHD_KhamBenh kb
          ON dvsk.MaHoaDon = kb.MaHoaDon AND dvsk.STT = kb.STT
        LEFT JOIN dbo.CTHD_TiemPhong tp
          ON dvsk.MaHoaDon = tp.MaHoaDon AND dvsk.STT = tp.STT
        LEFT JOIN dbo.VacXin vx
          ON tp.MaVacXin = vx.MaVacXin
        LEFT JOIN dbo.DanhGia dg
          ON cthd.MaHoaDon = dg.MaHoaDon AND cthd.STT = dg.STT
        WHERE hd.MaKhachHang = @MaKhachHang
        ORDER BY hd.NgayLap DESC, cthd.MaHoaDon DESC, cthd.STT ASC
      `
      );

    if (result.recordset.length === 0) {
      return {
        success: true,
        status: 200,
        message: "Bạn chưa sử dụng dịch vụ sức khỏe nào",
        count: 0,
        data: [],
      };
    }

    const services = result.recordset.map((item) => {
      const service = {
        MaHoaDon: item.MaHoaDon,
        STT: item.STT,
        LoaiDichVu: item.LoaiDichVu,
        LoaiDichVuSK: item.LoaiDichVuSK, // "Khám bệnh" hoặc "Tiêm phòng"
        ThanhTien: item.ThanhTien,
        NgayLap: item.NgayLap,
        MaChiNhanh: item.MaChiNhanh,
        TenChiNhanh: item.TenChiNhanh,
        MaThuCung: item.MaThuCung,
        TenThuCung: item.TenThuCung,
        LoaiThuCung: item.LoaiThuCung,
        MaBacSi: item.MaBacSi,
        TenBacSi: item.TenBacSi,
        DaDanhGia: item.DaDanhGia === 1,
        DanhGia: null,
        ChiTiet: {},
      };

      if (item.DaDanhGia === 1) {
        service.DanhGia = {
          DiemChatLuongDV: item.DiemChatLuongDV,
          DiemThaiDoNV: item.DiemThaiDoNV,
          DiemTongThe: item.DiemTongThe,
          BinhLuan: item.BinhLuan,
        };
      }

      if (item.LoaiDichVuSK === "Khám bệnh") {
        service.ChiTiet = {
          TrieuChung: item.TrieuChung,
          ChanDoan: item.ChanDoan,
          ToaThuoc: item.ToaThuoc,
          NgayTaiKham: item.NgayTaiKham,
        };
      } else if (item.LoaiDichVuSK === "Tiêm phòng") {
        service.ChiTiet = {
          MaVacXin: item.MaVacXin,
          TenVacXin: item.TenVacXin,
          MaGoiDK: item.MaGoiDK,
        };
      }

      return service;
    });

    return {
      success: true,
      status: 200,
      count: services.length,
      data: services,
    };
  } catch (error) {
    console.error("Error fetching rateable services:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy danh sách dịch vụ để đánh giá",
      error: error.message,
    };
  }
}

/**
 * Cập nhật đánh giá của khách hàng
 * @param {string} customerId - Mã khách hàng
 * @param {string} maHoaDon - Mã hóa đơn
 * @param {number} stt - Số thứ tự chi tiết hóa đơn
 * @param {object} ratingData - Dữ liệu đánh giá { DiemChatLuongDV, DiemThaiDoNV, DiemTongThe, BinhLuan? }
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function updateRating(customerId, maHoaDon, stt, ratingData) {
  const { DiemChatLuongDV, DiemThaiDoNV, DiemTongThe, BinhLuan } = ratingData;

  if (DiemChatLuongDV === undefined || DiemThaiDoNV === undefined || DiemTongThe === undefined) {
    return {
      success: false,
      status: 400,
      message: "Thiếu thông tin bắt buộc: DiemChatLuongDV, DiemThaiDoNV, DiemTongThe",
    };
  }

  if (
    DiemChatLuongDV < 0 || DiemChatLuongDV > 10 ||
    DiemThaiDoNV < 0 || DiemThaiDoNV > 10 ||
    DiemTongThe < 0 || DiemTongThe > 10
  ) {
    return {
      success: false,
      status: 400,
      message: "Điểm đánh giá phải từ 0 đến 10",
    };
  }

  try {
    const pool = await poolPromise;

    const invoiceCheck = await pool
      .request()
      .input("MaHoaDon", sql.Char(8), maHoaDon)
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        SELECT TOP 1 MaHoaDon
        FROM dbo.HoaDon
        WHERE MaHoaDon = @MaHoaDon AND MaKhachHang = @MaKhachHang
      `
      );

    if (invoiceCheck.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy hóa đơn hoặc bạn không có quyền cập nhật đánh giá này",
      };
    }

    const existingRating = await pool
      .request()
      .input("MaHoaDon", sql.Char(8), maHoaDon)
      .input("STT", sql.Int, stt)
      .query(
        `
        SELECT TOP 1 *
        FROM dbo.DanhGia
        WHERE MaHoaDon = @MaHoaDon AND STT = @STT
      `
      );

    if (existingRating.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy đánh giá để cập nhật",
      };
    }

    const serviceCheck = await pool
      .request()
      .input("MaHoaDon", sql.Char(8), maHoaDon)
      .input("STT", sql.Int, stt)
      .query(
        `
        SELECT TOP 1 1
        FROM dbo.CTHD cthd
        INNER JOIN dbo.CTHD_DVSucKhoe dvsk
          ON cthd.MaHoaDon = dvsk.MaHoaDon AND cthd.STT = dvsk.STT
        WHERE cthd.MaHoaDon = @MaHoaDon AND cthd.STT = @STT
      `
      );

    if (serviceCheck.recordset.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Chỉ có thể cập nhật đánh giá cho dịch vụ sức khỏe",
      };
    }

    await pool
      .request()
      .input("MaHoaDon", sql.Char(8), maHoaDon)
      .input("STT", sql.Int, stt)
      .input("DiemChatLuongDV", sql.Int, DiemChatLuongDV)
      .input("DiemThaiDoNV", sql.Int, DiemThaiDoNV)
      .input("DiemTongThe", sql.Int, DiemTongThe)
      .input("BinhLuan", sql.NVarChar(100), BinhLuan || null)
      .query(
        `
        UPDATE dbo.DanhGia
        SET DiemChatLuongDV = @DiemChatLuongDV,
            DiemThaiDoNV = @DiemThaiDoNV,
            DiemTongThe = @DiemTongThe,
            BinhLuan = @BinhLuan
        WHERE MaHoaDon = @MaHoaDon AND STT = @STT
      `
      );

    const ratingResult = await pool
      .request()
      .input("MaHoaDon", sql.Char(8), maHoaDon)
      .input("STT", sql.Int, stt)
      .query(
        `
        SELECT 
          dg.MaHoaDon,
          dg.STT,
          dg.DiemChatLuongDV,
          dg.DiemThaiDoNV,
          dg.DiemTongThe,
          dg.BinhLuan,
          cthd.LoaiDichVu,
          dvsk.BacSi AS MaBacSi,
          nvBs.HoTen AS TenBacSi,
          hd.MaChiNhanh,
          cn.TenChiNhanh
        FROM dbo.DanhGia dg
        INNER JOIN dbo.CTHD cthd
          ON dg.MaHoaDon = cthd.MaHoaDon AND dg.STT = cthd.STT
        INNER JOIN dbo.CTHD_DVSucKhoe dvsk
          ON dg.MaHoaDon = dvsk.MaHoaDon AND dg.STT = dvsk.STT
        LEFT JOIN dbo.NhanVien nvBs
          ON dvsk.BacSi = nvBs.MaNhanVien
        LEFT JOIN dbo.HoaDon hd
          ON dg.MaHoaDon = hd.MaHoaDon
        LEFT JOIN dbo.ChiNhanh cn
          ON hd.MaChiNhanh = cn.MaChiNhanh
        WHERE dg.MaHoaDon = @MaHoaDon AND dg.STT = @STT
      `
      );

    return {
      success: true,
      status: 200,
      message: "Cập nhật đánh giá thành công",
      data: ratingResult.recordset[0],
    };
  } catch (error) {
    console.error("Error updating rating:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi cập nhật đánh giá",
      error: error.message,
    };
  }
}

/**
 * Xóa đánh giá của khách hàng
 * @param {string} customerId - Mã khách hàng
 * @param {string} maHoaDon - Mã hóa đơn
 * @param {number} stt - Số thứ tự chi tiết hóa đơn
 * @returns {Promise<{success: boolean, status?: number, message?: string, error?: string}>}
 */
async function deleteRating(customerId, maHoaDon, stt) {
  try {
    const pool = await poolPromise;

    const invoiceCheck = await pool
      .request()
      .input("MaHoaDon", sql.Char(8), maHoaDon)
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        SELECT TOP 1 MaHoaDon
        FROM dbo.HoaDon
        WHERE MaHoaDon = @MaHoaDon AND MaKhachHang = @MaKhachHang
      `
      );

    if (invoiceCheck.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy hóa đơn hoặc bạn không có quyền xóa đánh giá này",
      };
    }

    const existingRating = await pool
      .request()
      .input("MaHoaDon", sql.Char(8), maHoaDon)
      .input("STT", sql.Int, stt)
      .query(
        `
        SELECT TOP 1 *
        FROM dbo.DanhGia
        WHERE MaHoaDon = @MaHoaDon AND STT = @STT
      `
      );

    if (existingRating.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy đánh giá để xóa",
      };
    }

    const deleteResult = await pool
      .request()
      .input("MaHoaDon", sql.Char(8), maHoaDon)
      .input("STT", sql.Int, stt)
      .query(
        `
        DELETE FROM dbo.DanhGia
        WHERE MaHoaDon = @MaHoaDon AND STT = @STT
      `
      );

    if (deleteResult.rowsAffected[0] === 0) {
      return {
        success: false,
        status: 500,
        message: "Không thể xóa đánh giá",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Xóa đánh giá thành công",
    };
  } catch (error) {
    console.error("Error deleting rating:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi xóa đánh giá",
      error: error.message,
    };
  }
}

module.exports = {
  createOrUpdateRating,
  getRateableServices,
  updateRating,
  deleteRating,
};

