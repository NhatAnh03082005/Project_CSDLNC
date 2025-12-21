const { sql, poolPromise } = require("../../config/database");

/**
 * Đăng ký gói tiêm phòng cho khách hàng
 * @param {string} customerId - Mã khách hàng
 * @param {object} subscriptionData - Dữ liệu đăng ký { LoaiGoi }
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function subscribeToPackage(customerId, subscriptionData) {
  const { LoaiGoi } = subscriptionData;

  // Validation: Kiểm tra các trường bắt buộc
  if (!LoaiGoi) {
    return {
      success: false,
      status: 400,
      message: "Thiếu thông tin bắt buộc: LoaiGoi",
    };
  }

  try {
    const pool = await poolPromise;

    // 1. Kiểm tra gói tiêm có tồn tại không
    const packageCheck = await pool
      .request()
      .input("LoaiGoi", sql.Char(7), LoaiGoi)
      .query(
        `
        SELECT TOP 1 LoaiGoi, ThoiHan, UuDai
        FROM dbo.GoiTiemPhong
        WHERE LoaiGoi = @LoaiGoi
      `
      );

    if (packageCheck.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy gói tiêm phòng",
      };
    }

    const packageInfo = packageCheck.recordset[0];
    const thoiHan = packageInfo.ThoiHan; // Thời hạn tính bằng tháng

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + thoiHan);

    await pool
      .request()
      .input("ThoiGianBatDau", sql.Date, today)
      .input("ThoiGianKetThuc", sql.Date, endDate)
      .input("LoaiGoi", sql.Char(7), LoaiGoi)
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        INSERT INTO dbo.DK_GoiTiemPhong
          (ThoiGianBatDau, ThoiGianKetThuc, LoaiGoi, MaKhachHang)
        VALUES
          (@ThoiGianBatDau, @ThoiGianKetThuc, @LoaiGoi, @MaKhachHang)
      `
      );

    // 4. Lấy thông tin gói đăng ký vừa tạo (bao gồm MaGoiDK được trigger sinh)
    const newSubscription = await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .input("LoaiGoi", sql.Char(7), LoaiGoi)
      .input("ThoiGianBatDau", sql.Date, today)
      .query(
        `
        SELECT TOP 1
          dk.MaGoiDK,
          dk.MaKhachHang,
          dk.LoaiGoi,
          dk.ThoiGianBatDau,
          dk.ThoiGianKetThuc,
          gtp.ThoiHan,
          gtp.UuDai
        FROM dbo.DK_GoiTiemPhong dk
        INNER JOIN dbo.GoiTiemPhong gtp ON dk.LoaiGoi = gtp.LoaiGoi
        WHERE dk.MaKhachHang = @MaKhachHang
          AND dk.LoaiGoi = @LoaiGoi
          AND dk.ThoiGianBatDau = @ThoiGianBatDau
        ORDER BY dk.ThoiGianBatDau DESC
      `
      );

    if (newSubscription.recordset.length === 0) {
      return {
        success: false,
        status: 500,
        message: "Không thể lấy thông tin gói đăng ký sau khi tạo",
      };
    }

    const subscriptionInfo = newSubscription.recordset[0];

    return {
      success: true,
      status: 201,
      message: "Đăng ký gói tiêm phòng thành công",
      data: subscriptionInfo,
    };
  } catch (error) {
    console.error("Error subscribing to vaccination package:", error);

    // Xử lý lỗi constraint
    if (error.number === 547 || error.message.includes("FOREIGN KEY")) {
      return {
        success: false,
        status: 400,
        message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin gói tiêm.",
        error: error.message,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Lỗi khi đăng ký gói tiêm phòng",
      error: error.message,
    };
  }
}

module.exports = {
  subscribeToPackage,
};
