const { sql, poolPromise } = require("../../config/database");

/**
 * Đặt lịch hẹn dịch vụ cho khách hàng (khám bệnh hoặc tiêm phòng)
 * @param {string} customerId - Mã khách hàng
 * @param {object} appointmentData - Dữ liệu đặt lịch { MaChiNhanh, LoaiDichVu, ThoiGianHen, BacSiPhuTrach? }
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function createAppointment(customerId, appointmentData) {
  const { MaChiNhanh, LoaiDichVu, ThoiGianHen, BacSiPhuTrach } = appointmentData;

  // Validation: Kiểm tra các trường bắt buộc
  if (!MaChiNhanh || !LoaiDichVu || !ThoiGianHen) {
    return {
      success: false,
      status: 400,
      message: "Thiếu thông tin bắt buộc: MaChiNhanh, LoaiDichVu, ThoiGianHen",
    };
  }

  // Validation: LoaiDichVu phải là 'Khám bệnh' hoặc 'Tiêm phòng'
  if (LoaiDichVu !== "Khám bệnh" && LoaiDichVu !== "Tiêm phòng") {
    return {
      success: false,
      status: 400,
      message: "LoaiDichVu phải là 'Khám bệnh' hoặc 'Tiêm phòng'",
    };
  }

  // Validation: ThoiGianHen phải >= ngày hiện tại
  const appointmentDate = new Date(ThoiGianHen);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  appointmentDate.setHours(0, 0, 0, 0);

  if (appointmentDate < today) {
    return {
      success: false,
      status: 400,
      message: "Thời gian hẹn không được nhỏ hơn ngày hiện tại",
    };
  }

  try {
    const pool = await poolPromise;

    // 1. Kiểm tra chi nhánh có tồn tại không
    const branchCheck = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
      .query(
        `
        SELECT TOP 1 MaChiNhanh, TenChiNhanh
        FROM dbo.ChiNhanh
        WHERE MaChiNhanh = @MaChiNhanh
      `
      );

    if (branchCheck.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy chi nhánh",
      };
    }

    // 2. Kiểm tra chi nhánh có cung cấp dịch vụ này không
    const serviceCheck = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
      .input("LoaiDichVu", sql.NVarChar(20), LoaiDichVu)
      .query(
        `
        SELECT TOP 1 1
        FROM dbo.DichVu_ChiNhanh
        WHERE MaChiNhanh = @MaChiNhanh AND LoaiDichVu = @LoaiDichVu
      `
      );

    if (serviceCheck.recordset.length === 0) {
      return {
        success: false,
        status: 400,
        message: `Chi nhánh này không cung cấp dịch vụ ${LoaiDichVu}`,
      };
    }

    // 3. Kiểm tra bác sĩ (nếu có)
    if (BacSiPhuTrach) {
      const doctorCheck = await pool
        .request()
        .input("BacSi", sql.Char(5), BacSiPhuTrach)
        .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
        .query(
          `
          SELECT TOP 1 MaNhanVien, HoTen, ViTri, MaChiNhanh, TrangThai
          FROM dbo.NhanVien
          WHERE MaNhanVien = @BacSi 
            AND ViTri = N'Bác sĩ thú y'
            AND MaChiNhanh = @MaChiNhanh
            AND TrangThai = 0
        `
        );

      if (doctorCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy bác sĩ hoặc bác sĩ không thuộc chi nhánh này",
        };
      }

      // Kiểm tra bác sĩ có rảnh vào thời gian hẹn không (có thể kiểm tra LichLamViec)
      // Tạm thời bỏ qua, có thể implement sau
    }

    // 4. Ngày lập là ngày hiện tại
    const ngayLap = new Date();
    ngayLap.setHours(0, 0, 0, 0);

    // 5. Trạng thái mặc định là 'Đã lên lịch'
    const trangThai = "Đã lên lịch";

    // 6. Insert lịch hẹn (MaLichHen sẽ được trigger tự động sinh)
    await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
      .input("LoaiDichVu", sql.NVarChar(20), LoaiDichVu)
      .input("BacSiPhuTrach", sql.Char(5), BacSiPhuTrach || null)
      .input("ThoiGianHen", sql.Date, appointmentDate)
      .input("NgayLap", sql.Date, ngayLap)
      .input("TrangThai", sql.NVarChar(20), trangThai)
      .query(
        `
        INSERT INTO dbo.LichHen
          (MaKhachHang, MaChiNhanh, LoaiDichVu, BacSiPhuTrach, ThoiGianHen, NgayLap, TrangThai)
        VALUES
          (@MaKhachHang, @MaChiNhanh, @LoaiDichVu, @BacSiPhuTrach, @ThoiGianHen, @NgayLap, @TrangThai)
      `
      );

    // 7. Lấy thông tin lịch hẹn vừa tạo (bao gồm MaLichHen được trigger sinh)
    const newAppointment = await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .input("ThoiGianHen", sql.Date, appointmentDate)
      .input("NgayLap", sql.Date, ngayLap)
      .query(
        `
        SELECT TOP 1
          lh.MaLichHen,
          lh.MaKhachHang,
          lh.MaChiNhanh,
          lh.LoaiDichVu,
          lh.BacSiPhuTrach,
          lh.ThoiGianHen,
          lh.NgayLap,
          lh.TrangThai,
          cn.TenChiNhanh,
          nvBs.HoTen AS TenBacSiPhuTrach
        FROM dbo.LichHen lh
        LEFT JOIN dbo.ChiNhanh cn ON lh.MaChiNhanh = cn.MaChiNhanh
        LEFT JOIN dbo.NhanVien nvBs ON lh.BacSiPhuTrach = nvBs.MaNhanVien
        WHERE lh.MaKhachHang = @MaKhachHang
          AND lh.ThoiGianHen = @ThoiGianHen
          AND lh.NgayLap = @NgayLap
        ORDER BY lh.MaLichHen DESC
      `
      );

    if (newAppointment.recordset.length === 0) {
      return {
        success: false,
        status: 500,
        message: "Không thể lấy thông tin lịch hẹn sau khi tạo",
      };
    }

    const appointmentInfo = newAppointment.recordset[0];

    return {
      success: true,
      status: 201,
      message: "Đặt lịch hẹn thành công",
      data: appointmentInfo,
    };
  } catch (error) {
    console.error("Error creating appointment:", error);

    // Xử lý lỗi constraint
    if (error.number === 547 || error.message.includes("FOREIGN KEY")) {
      return {
        success: false,
        status: 400,
        message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin đặt lịch.",
        error: error.message,
      };
    }

    // Xử lý lỗi check constraint (ThoiGianHen >= NgayLap)
    if (error.number === 547 || error.message.includes("CHECK")) {
      return {
        success: false,
        status: 400,
        message: "Thời gian hẹn không hợp lệ. Thời gian hẹn phải lớn hơn hoặc bằng ngày lập.",
        error: error.message,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Lỗi khi đặt lịch hẹn",
      error: error.message,
    };
  }
}

/**
 * Hủy lịch hẹn của khách hàng
 * @param {string} customerId - Mã khách hàng
 * @param {string} maLichHen - Mã lịch hẹn
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function cancelAppointment(customerId, maLichHen) {
  try {
    const pool = await poolPromise;

    // 1. Kiểm tra lịch hẹn có thuộc về khách hàng này không
    const appointmentCheck = await pool
      .request()
      .input("MaLichHen", sql.Char(8), maLichHen)
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        SELECT TOP 1
          MaLichHen,
          MaKhachHang,
          ThoiGianHen,
          TrangThai
        FROM dbo.LichHen
        WHERE MaLichHen = @MaLichHen AND MaKhachHang = @MaKhachHang
      `
      );

    if (appointmentCheck.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy lịch hẹn hoặc bạn không có quyền hủy lịch hẹn này",
      };
    }

    const appointment = appointmentCheck.recordset[0];

    // 2. Kiểm tra trạng thái - chỉ hủy được nếu chưa hoàn thành
    if (appointment.TrangThai === "Hoàn thành") {
      return {
        success: false,
        status: 400,
        message: "Không thể hủy lịch hẹn đã hoàn thành",
      };
    }

    // 3. Kiểm tra thời gian hẹn - không cho hủy nếu đã qua thời gian hẹn (tùy nghiệp vụ)
    const appointmentDate = new Date(appointment.ThoiGianHen);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return {
        success: false,
        status: 400,
        message: "Không thể hủy lịch hẹn đã qua ngày hẹn",
      };
    }

    // 4. Cập nhật trạng thái thành "Đã hủy"
    await pool
      .request()
      .input("MaLichHen", sql.Char(8), maLichHen)
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        UPDATE dbo.LichHen
        SET TrangThai = N'Đã hủy'
        WHERE MaLichHen = @MaLichHen AND MaKhachHang = @MaKhachHang
      `
      );

    // 5. Lấy thông tin lịch hẹn đã hủy
    const cancelledAppointment = await pool
      .request()
      .input("MaLichHen", sql.Char(8), maLichHen)
      .query(
        `
        SELECT TOP 1
          lh.MaLichHen,
          lh.MaKhachHang,
          lh.MaChiNhanh,
          lh.LoaiDichVu,
          lh.BacSiPhuTrach,
          lh.ThoiGianHen,
          lh.NgayLap,
          lh.TrangThai,
          cn.TenChiNhanh,
          nvBs.HoTen AS TenBacSiPhuTrach
        FROM dbo.LichHen lh
        LEFT JOIN dbo.ChiNhanh cn ON lh.MaChiNhanh = cn.MaChiNhanh
        LEFT JOIN dbo.NhanVien nvBs ON lh.BacSiPhuTrach = nvBs.MaNhanVien
        WHERE lh.MaLichHen = @MaLichHen
      `
      );

    return {
      success: true,
      status: 200,
      message: "Hủy lịch hẹn thành công",
      data: cancelledAppointment.recordset[0],
    };
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi hủy lịch hẹn",
      error: error.message,
    };
  }
}

/**
 * Lấy danh sách khung giờ còn trống để đặt lịch
 * @param {object} queryParams - { MaChiNhanh, LoaiDichVu, ThoiGianHen, BacSiPhuTrach? }
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: array, error?: string}>}
 */
async function getAvailableSlots(queryParams) {
  const { MaChiNhanh, LoaiDichVu, ThoiGianHen, BacSiPhuTrach } = queryParams;

  // Validation: Kiểm tra các trường bắt buộc
  if (!MaChiNhanh || !LoaiDichVu || !ThoiGianHen) {
    return {
      success: false,
      status: 400,
      message: "Thiếu thông tin bắt buộc: MaChiNhanh, LoaiDichVu, ThoiGianHen",
    };
  }

  // Validation: LoaiDichVu phải là 'Khám bệnh' hoặc 'Tiêm phòng'
  if (LoaiDichVu !== "Khám bệnh" && LoaiDichVu !== "Tiêm phòng") {
    return {
      success: false,
      status: 400,
      message: "LoaiDichVu phải là 'Khám bệnh' hoặc 'Tiêm phòng'",
    };
  }

  try {
    const pool = await poolPromise;
    const appointmentDate = new Date(ThoiGianHen);
    appointmentDate.setHours(0, 0, 0, 0);

    // 1. Kiểm tra chi nhánh có tồn tại không
    const branchCheck = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
      .query(
        `
        SELECT TOP 1 MaChiNhanh, TenChiNhanh, TGMoCua, TGDongCua
        FROM dbo.ChiNhanh
        WHERE MaChiNhanh = @MaChiNhanh
      `
      );

    if (branchCheck.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy chi nhánh",
      };
    }

    const branchInfo = branchCheck.recordset[0];

    // 2. Kiểm tra chi nhánh có cung cấp dịch vụ này không
    const serviceCheck = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
      .input("LoaiDichVu", sql.NVarChar(20), LoaiDichVu)
      .query(
        `
        SELECT TOP 1 1
        FROM dbo.DichVu_ChiNhanh
        WHERE MaChiNhanh = @MaChiNhanh AND LoaiDichVu = @LoaiDichVu
      `
      );

    if (serviceCheck.recordset.length === 0) {
      return {
        success: false,
        status: 400,
        message: `Chi nhánh này không cung cấp dịch vụ ${LoaiDichVu}`,
      };
    }

    // 3. Lấy danh sách bác sĩ của chi nhánh (nếu không chỉ định bác sĩ cụ thể)
    let doctors = [];
    if (BacSiPhuTrach) {
      // Kiểm tra bác sĩ có tồn tại và thuộc chi nhánh không
      const doctorCheck = await pool
        .request()
        .input("BacSi", sql.Char(5), BacSiPhuTrach)
        .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
        .query(
          `
          SELECT TOP 1 MaNhanVien, HoTen
          FROM dbo.NhanVien
          WHERE MaNhanVien = @BacSi
            AND ViTri = N'Bác sĩ thú y'
            AND MaChiNhanh = @MaChiNhanh
            AND TrangThai = 0
        `
        );

      if (doctorCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy bác sĩ hoặc bác sĩ không thuộc chi nhánh này",
        };
      }

      doctors = doctorCheck.recordset;
    } else {
      // Lấy tất cả bác sĩ của chi nhánh
      const doctorsResult = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
        .query(
          `
          SELECT MaNhanVien, HoTen
          FROM dbo.NhanVien
          WHERE MaChiNhanh = @MaChiNhanh
            AND ViTri = N'Bác sĩ thú y'
            AND TrangThai = 0
          ORDER BY MaNhanVien ASC
        `
        );

      doctors = doctorsResult.recordset;
    }

    if (doctors.length === 0) {
      return {
        success: true,
        status: 200,
        message: "Chi nhánh này chưa có bác sĩ",
        data: [],
      };
    }

    // 4. Lấy lịch làm việc của các bác sĩ trong ngày
    const doctorIds = doctors.map((d) => d.MaNhanVien);
    
    // Thêm parameters cho IN clause
    const request = pool.request().input("NgayLam", sql.Date, appointmentDate);
    doctorIds.forEach((id, i) => {
      request.input(`BacSi${i}`, sql.Char(5), id);
    });

    const workSchedulesResult = await request.query(
      `
      SELECT BacSi, GioBatDau, GioKetThuc
      FROM dbo.LichLamViec
      WHERE NgayLam = @NgayLam
        AND BacSi IN (${doctorIds.map((_, i) => `@BacSi${i}`).join(", ")})
    `
    );

    // 5. Lấy các lịch hẹn đã có trong ngày
    const existingAppointments = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
      .input("ThoiGianHen", sql.Date, appointmentDate)
      .query(
        `
        SELECT BacSiPhuTrach, COUNT(*) AS SoLuong
        FROM dbo.LichHen
        WHERE MaChiNhanh = @MaChiNhanh
          AND ThoiGianHen = @ThoiGianHen
          AND TrangThai NOT IN (N'Đã hủy')
        GROUP BY BacSiPhuTrach
      `
      );

    // 6. Tính toán khung giờ còn trống
    // Giả sử mỗi ca khám/tiêm mất 30 phút, và giờ làm việc từ TGMoCua đến TGDongCua
    const availableSlots = [];

    doctors.forEach((doctor) => {
      const doctorSchedule = workSchedulesResult.recordset.find(
        (s) => s.BacSi === doctor.MaNhanVien
      );

      if (!doctorSchedule) {
        // Bác sĩ không có lịch làm việc trong ngày này
        return;
      }

      const existingCount =
        existingAppointments.recordset.find(
          (a) => a.BacSiPhuTrach === doctor.MaNhanVien
        )?.SoLuong || 0;

      // Giả sử mỗi bác sĩ có thể tiếp tối đa 10 ca/ngày (có thể điều chỉnh)
      const maxSlots = 10;
      const availableCount = maxSlots - existingCount;

      if (availableCount > 0) {
        availableSlots.push({
          BacSiPhuTrach: doctor.MaNhanVien,
          TenBacSi: doctor.HoTen,
          GioLamViec: {
            BatDau: doctorSchedule.GioBatDau,
            KetThuc: doctorSchedule.GioKetThuc,
          },
          SoLuongConLai: availableCount,
        });
      }
    });

    return {
      success: true,
      status: 200,
      count: availableSlots.length,
      data: {
        NgayHen: ThoiGianHen,
        MaChiNhanh: MaChiNhanh,
        TenChiNhanh: branchInfo.TenChiNhanh,
        LoaiDichVu: LoaiDichVu,
        GioMoCua: branchInfo.TGMoCua,
        GioDongCua: branchInfo.TGDongCua,
        BacSi: availableSlots,
      },
    };
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy khung giờ còn trống",
      error: error.message,
    };
  }
}

module.exports = {
  createAppointment,
  cancelAppointment,
  getAvailableSlots,
};

