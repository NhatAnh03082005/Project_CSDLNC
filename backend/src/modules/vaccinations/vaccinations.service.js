const { sql, poolPromise } = require("../../config/database");

/**
 * Lấy danh sách tất cả các loại gói tiêm phòng
 * Lưu ý: Danh sách này chỉ chứa thông tin các loại gói.
 * Sau khi khách hàng đăng ký gói, họ sẽ được chọn các vaccine muốn tiêm.
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: array, count?: number, error?: string}>}
 */
async function getVaccinationPackages() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      `
      SELECT 
        LoaiGoi,
        ThoiHan,
        UuDai
      FROM dbo.GoiTiemPhong
      ORDER BY ThoiHan ASC, LoaiGoi ASC
    `
    );

    const packages = result.recordset.map((pkg) => ({
      LoaiGoi: pkg.LoaiGoi,
      ThoiHan: pkg.ThoiHan, 
      UuDai: pkg.UuDai,
    }));

    return {
      success: true,
      status: 200,
      count: packages.length,
      data: packages,
    };
  } catch (error) {
    console.error("Error fetching vaccination packages:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy danh sách gói tiêm phòng",
      error: error.message,
    };
  }
}

/**
 * Đăng ký gói tiêm phòng cho khách hàng
 * @param {string} customerId - Mã khách hàng
 * @param {object} subscriptionData - Dữ liệu đăng ký { LoaiGoi }
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function subscribeToPackage(customerId, subscriptionData) {
  const { LoaiGoi } = subscriptionData;

  if (!LoaiGoi) {
    return {
      success: false,
      status: 400,
      message: "Thiếu thông tin bắt buộc: LoaiGoi",
    };
  }

  try {
    const pool = await poolPromise;
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
    const thoiHan = packageInfo.ThoiHan; 

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

/**
 * Lấy danh sách gói tiêm đang đăng ký của khách hàng
 * Lưu ý: Chỉ trả về thông tin gói đăng ký, không bao gồm danh sách vaccine.
 * Chi tiết vaccine sẽ được lấy ở endpoint riêng.
 * @param {string} customerId - Mã khách hàng
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: array, count?: number, error?: string}>}
 */
async function getCustomerSubscriptions(customerId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        SELECT 
          dk.MaGoiDK,
          dk.MaKhachHang,
          dk.LoaiGoi,
          dk.ThoiGianBatDau,
          dk.ThoiGianKetThuc,
          gtp.ThoiHan,
          gtp.UuDai,
          CASE 
            WHEN dk.ThoiGianKetThuc >= CAST(GETDATE() AS DATE) THEN N'Đang hoạt động'
            ELSE N'Đã hết hạn'
          END AS TrangThai
        FROM dbo.DK_GoiTiemPhong dk
        INNER JOIN dbo.GoiTiemPhong gtp ON dk.LoaiGoi = gtp.LoaiGoi
        WHERE dk.MaKhachHang = @MaKhachHang
        ORDER BY dk.ThoiGianBatDau DESC, dk.MaGoiDK DESC
      `
      );

    if (result.recordset.length === 0) {
      return {
        success: true,
        status: 200,
        message: "Khách hàng chưa đăng ký gói tiêm phòng nào",
        count: 0,
        data: [],
      };
    }

    const subscriptions = result.recordset.map((sub) => ({
      MaGoiDK: sub.MaGoiDK,
      LoaiGoi: sub.LoaiGoi,
      ThoiHan: sub.ThoiHan, 
      UuDai: sub.UuDai, 
      ThoiGianBatDau: sub.ThoiGianBatDau,
      ThoiGianKetThuc: sub.ThoiGianKetThuc,
      TrangThai: sub.TrangThai,
    }));

    return {
      success: true,
      status: 200,
      count: subscriptions.length,
      data: subscriptions,
    };
  } catch (error) {
    console.error("Error fetching customer subscriptions:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy danh sách gói đăng ký của khách hàng",
      error: error.message,
    };
  }
}

/**
 * Lấy chi tiết gói tiêm đã đăng ký của khách hàng (bao gồm danh sách vaccine)
 * @param {string} customerId - Mã khách hàng
 * @param {string} maGoiDK - Mã gói đăng ký
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function getSubscriptionDetails(customerId, maGoiDK) {
  try {
    const pool = await poolPromise;
    const subscriptionCheck = await pool
      .request()
      .input("MaGoiDK", sql.Char(6), maGoiDK)
      .input("MaKhachHang", sql.Char(7), customerId)
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
        WHERE dk.MaGoiDK = @MaGoiDK AND dk.MaKhachHang = @MaKhachHang
      `
      );

    if (subscriptionCheck.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy gói đăng ký hoặc bạn không có quyền xem gói đăng ký này",
      };
    }

    const subscriptionInfo = subscriptionCheck.recordset[0];
    const vaccinesResult = await pool
      .request()
      .input("MaGoiDK", sql.Char(6), maGoiDK)
      .query(
        `
        SELECT 
          vxgd.MaVacXin,
          vx.TenVacXin,
          vx.GiaTien AS GiaGoc,
          vxgd.GiaSauUuDai
        FROM dbo.VacXin_GoiDK vxgd
        INNER JOIN dbo.VacXin vx ON vxgd.MaVacXin = vx.MaVacXin
        WHERE vxgd.MaGoiDK = @MaGoiDK
        ORDER BY vx.MaVacXin ASC
      `
      );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thoiGianKetThuc = new Date(subscriptionInfo.ThoiGianKetThuc);
    const trangThai =
      thoiGianKetThuc >= today ? "Đang hoạt động" : "Đã hết hạn";

    const subscriptionDetails = {
      MaGoiDK: subscriptionInfo.MaGoiDK,
      LoaiGoi: subscriptionInfo.LoaiGoi,
      ThoiHan: subscriptionInfo.ThoiHan, 
      UuDai: subscriptionInfo.UuDai, 
      ThoiGianBatDau: subscriptionInfo.ThoiGianBatDau,
      ThoiGianKetThuc: subscriptionInfo.ThoiGianKetThuc,
      TrangThai: trangThai,
      SoLuongVacXin: vaccinesResult.recordset.length,
      VacXin: vaccinesResult.recordset.map((vx) => ({
        MaVacXin: vx.MaVacXin,
        TenVacXin: vx.TenVacXin,
        GiaGoc: vx.GiaGoc,
        GiaSauUuDai: vx.GiaSauUuDai,
      })),
    };

    return {
      success: true,
      status: 200,
      data: subscriptionDetails,
    };
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy chi tiết gói đăng ký",
      error: error.message,
    };
  }
}

module.exports = {
  getVaccinationPackages,
  subscribeToPackage,
  getCustomerSubscriptions,
  getSubscriptionDetails,
};
