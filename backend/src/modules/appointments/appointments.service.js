const { sql, poolPromise } = require("../../config/database");

const formatDateForResponse = (dateValue) => {
  if (!dateValue) return null;
  if (dateValue instanceof Date) {
    const year = dateValue.getUTCFullYear();
    const month = String(dateValue.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (typeof dateValue === 'string') {
    if (dateValue.includes('T')) {
      return dateValue.split('T')[0];
    }
    if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateValue;
    }
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  return dateValue;
};

/**
 * Đặt lịch hẹn dịch vụ cho khách hàng (khám bệnh hoặc tiêm phòng)
 * @param {string} customerId - Mã khách hàng
 * @param {object} appointmentData - Dữ liệu đặt lịch { MaChiNhanh, LoaiDichVu, ThoiGianHen, BacSiPhuTrach? }
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function createAppointment(customerId, appointmentData) {
  const { MaChiNhanh, LoaiDichVu, ThoiGianHen, BacSiPhuTrach } =
    appointmentData;

  if (!MaChiNhanh || !LoaiDichVu || !ThoiGianHen) {
    return {
      success: false,
      status: 400,
      message: "Thiếu thông tin bắt buộc: MaChiNhanh, LoaiDichVu, ThoiGianHen",
    };
  }

  if (LoaiDichVu !== "Khám bệnh" && LoaiDichVu !== "Tiêm phòng") {
    return {
      success: false,
      status: 400,
      message: "LoaiDichVu phải là 'Khám bệnh' hoặc 'Tiêm phòng'",
    };
  }

  let appointmentDateStr;
  let appointmentDate;

  if (typeof ThoiGianHen === 'string') {
    const dateParts = ThoiGianHen.split('-');
    if (dateParts.length === 3) {
      appointmentDateStr = ThoiGianHen;
      appointmentDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    } else {
      appointmentDateStr = ThoiGianHen.split('T')[0];
      appointmentDate = new Date(ThoiGianHen);
    }
  } else {
    appointmentDate = new Date(ThoiGianHen);
    const year = appointmentDate.getFullYear();
    const month = String(appointmentDate.getMonth() + 1).padStart(2, '0');
    const day = String(appointmentDate.getDate()).padStart(2, '0');
    appointmentDateStr = `${year}-${month}-${day}`;
  }

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

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const ngayLapStr = todayStr;

  try {
    const pool = await poolPromise;

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
          message:
            "Không tìm thấy bác sĩ hoặc bác sĩ không thuộc chi nhánh này",
        };
      }
    }

    const trangThai = "Đã lên lịch";

    await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
      .input("LoaiDichVu", sql.NVarChar(20), LoaiDichVu)
      .input("BacSiPhuTrach", sql.Char(5), BacSiPhuTrach || null)
      .input("ThoiGianHen", sql.NVarChar(10), appointmentDateStr)
      .input("NgayLap", sql.NVarChar(10), ngayLapStr)
      .input("TrangThai", sql.NVarChar(20), trangThai)
      .query(
        `
        INSERT INTO dbo.LichHen
          (MaKhachHang, MaChiNhanh, LoaiDichVu, BacSiPhuTrach, ThoiGianHen, NgayLap, TrangThai)
        VALUES
          (@MaKhachHang, @MaChiNhanh, @LoaiDichVu, @BacSiPhuTrach, CAST(@ThoiGianHen AS DATE), CAST(@NgayLap AS DATE), @TrangThai)
      `
      );

    const newAppointment = await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .input("ThoiGianHen", sql.NVarChar(10), appointmentDateStr)
      .input("NgayLap", sql.NVarChar(10), ngayLapStr)
      .query(
        `
        SELECT TOP 1
          lh.MaLichHen,
          lh.MaKhachHang,
          lh.MaChiNhanh,
          lh.LoaiDichVu,
          lh.BacSiPhuTrach,
          CONVERT(VARCHAR(10), lh.ThoiGianHen, 120) AS ThoiGianHen,
          CONVERT(VARCHAR(10), lh.NgayLap, 120) AS NgayLap,
          lh.TrangThai,
          cn.TenChiNhanh,
          nvBs.HoTen AS TenBacSiPhuTrach
        FROM dbo.LichHen lh
        LEFT JOIN dbo.ChiNhanh cn ON lh.MaChiNhanh = cn.MaChiNhanh
        LEFT JOIN dbo.NhanVien nvBs ON lh.BacSiPhuTrach = nvBs.MaNhanVien
        WHERE lh.MaKhachHang = @MaKhachHang
          AND CAST(lh.ThoiGianHen AS DATE) = CAST(@ThoiGianHen AS DATE)
          AND CAST(lh.NgayLap AS DATE) = CAST(@NgayLap AS DATE)
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
      data: {
        ...appointmentInfo,
        ThoiGianHen: formatDateForResponse(appointmentInfo.ThoiGianHen),
        NgayLap: formatDateForResponse(appointmentInfo.NgayLap),
      },
    };
  } catch (error) {
    console.error("Error creating appointment:", error);

    if (error.number === 547 || error.message.includes("FOREIGN KEY")) {
      return {
        success: false,
        status: 400,
        message:
          "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin đặt lịch.",
        error: error.message,
      };
    }

    if (error.number === 547 || error.message.includes("CHECK")) {
      return {
        success: false,
        status: 400,
        message:
          "Thời gian hẹn không hợp lệ. Thời gian hẹn phải lớn hơn hoặc bằng ngày lập.",
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
        message:
          "Không tìm thấy lịch hẹn hoặc bạn không có quyền hủy lịch hẹn này",
      };
    }

    const appointment = appointmentCheck.recordset[0];

    if (appointment.TrangThai === "Hoàn thành") {
      return {
        success: false,
        status: 400,
        message: "Không thể hủy lịch hẹn đã hoàn thành",
      };
    }

    if (appointment.TrangThai !== "Đã lên lịch") {
      return {
        success: false,
        status: 400,
        message: "Chỉ có thể hủy lịch hẹn ở trạng thái 'Đã lên lịch'",
      };
    }

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

    const deleteResult = await pool
      .request()
      .input("MaLichHen", sql.Char(8), maLichHen)
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        DELETE FROM dbo.LichHen
        WHERE MaLichHen = @MaLichHen AND MaKhachHang = @MaKhachHang
      `
      );

    if (deleteResult.rowsAffected[0] === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy lịch hẹn để hủy",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Hủy lịch hẹn thành công",
      data: null,
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

  if (!MaChiNhanh || !LoaiDichVu || !ThoiGianHen) {
    return {
      success: false,
      status: 400,
      message: "Thiếu thông tin bắt buộc: MaChiNhanh, LoaiDichVu, ThoiGianHen",
    };
  }

  if (LoaiDichVu !== "Khám bệnh" && LoaiDichVu !== "Tiêm phòng") {
    return {
      success: false,
      status: 400,
      message: "LoaiDichVu phải là 'Khám bệnh' hoặc 'Tiêm phòng'",
    };
  }

  try {
    const pool = await poolPromise;

    let appointmentDateStr;
    let appointmentDate;
    if (typeof ThoiGianHen === 'string') {
      const dateParts = ThoiGianHen.split('-');
      if (dateParts.length === 3) {
        appointmentDateStr = ThoiGianHen;
        appointmentDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
      } else {
        appointmentDateStr = ThoiGianHen.split('T')[0];
        appointmentDate = new Date(ThoiGianHen);
      }
    } else {
      appointmentDate = new Date(ThoiGianHen);
      const year = appointmentDate.getFullYear();
      const month = String(appointmentDate.getMonth() + 1).padStart(2, '0');
      const day = String(appointmentDate.getDate()).padStart(2, '0');
      appointmentDateStr = `${year}-${month}-${day}`;
    }
    appointmentDate.setHours(0, 0, 0, 0);

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

    let doctors = [];
    if (BacSiPhuTrach) {
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
          message:
            "Không tìm thấy bác sĩ hoặc bác sĩ không thuộc chi nhánh này",
        };
      }

      doctors = doctorCheck.recordset;
    } else {
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

    const doctorIds = doctors.map((d) => d.MaNhanVien);

    const request = pool.request().input("NgayLam", sql.NVarChar(10), appointmentDateStr);
    doctorIds.forEach((id, i) => {
      request.input(`BacSi${i}`, sql.Char(5), id);
    });

    const workSchedulesResult = await request.query(
      `
      SELECT BacSi, GioBatDau, GioKetThuc
      FROM dbo.LichLamViec
      WHERE CAST(NgayLam AS DATE) = CAST(@NgayLam AS DATE)
        AND BacSi IN (${doctorIds.map((_, i) => `@BacSi${i}`).join(", ")})
    `
    );

    const existingAppointments = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
      .input("ThoiGianHen", sql.NVarChar(10), appointmentDateStr)
      .query(
        `
        SELECT BacSiPhuTrach, COUNT(*) AS SoLuong
        FROM dbo.LichHen
        WHERE MaChiNhanh = @MaChiNhanh
          AND CAST(ThoiGianHen AS DATE) = CAST(@ThoiGianHen AS DATE)
          AND TrangThai = N'Đã lên lịch'
        GROUP BY BacSiPhuTrach
      `
      );

    const availableSlots = [];

    doctors.forEach((doctor) => {
      const doctorSchedule = workSchedulesResult.recordset.find(
        (s) => s.BacSi === doctor.MaNhanVien
      );

      if (!doctorSchedule) {
        return;
      }

      const existingCount =
        existingAppointments.recordset.find(
          (a) => a.BacSiPhuTrach === doctor.MaNhanVien
        )?.SoLuong || 0;

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

/**
 * Lấy danh sách lịch hẹn của khách hàng
 * @param {string} customerId - Mã khách hàng
 * @param {object} options - { page?, limit?, status? }
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function getCustomerAppointments(customerId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  const offset = (page - 1) * limit;

  try {
    const pool = await poolPromise;

    // Tự động cập nhật trạng thái lịch hẹn đã quá hạn
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    await pool
      .request()
      .input("TodayDate", sql.NVarChar(10), todayStr)
      .query(`
        UPDATE dbo.LichHen
        SET TrangThai = N'Hoàn thành'
        WHERE TrangThai = N'Đã lên lịch'
          AND CAST(ThoiGianHen AS DATE) < CAST(@TodayDate AS DATE)
      `);

    const request = pool.request();

    let whereClause = "WHERE lh.MaKhachHang = @MaKhachHang";
    request.input("MaKhachHang", sql.Char(7), customerId);

    if (status) {
      whereClause += " AND lh.TrangThai = @TrangThai";
      request.input("TrangThai", sql.NVarChar(20), status);
    }

    const countQuery = `
      SELECT COUNT(*) AS Total
      FROM dbo.LichHen lh
      ${whereClause}
    `;

    const countResult = await request.query(countQuery);
    const total = countResult.recordset[0].Total;
    const totalPages = Math.ceil(total / limit);

    const dataQuery = `
      SELECT 
        lh.MaLichHen,
        lh.MaKhachHang,
        lh.MaChiNhanh,
        lh.LoaiDichVu,
        lh.BacSiPhuTrach,
        CONVERT(VARCHAR(10), lh.ThoiGianHen, 120) AS ThoiGianHen,
        CONVERT(VARCHAR(10), lh.NgayLap, 120) AS NgayLap,
        lh.TrangThai,
        cn.TenChiNhanh,
        CONCAT(cn.SoNha, ' ', cn.TenDuong, ', ', cn.Phuong, ', ', cn.ThanhPho) AS DiaChiChiNhanh,
        cn.SDT AS SDTChiNhanh,
        nvBs.HoTen AS TenBacSiPhuTrach
      FROM dbo.LichHen lh
      LEFT JOIN dbo.ChiNhanh cn ON lh.MaChiNhanh = cn.MaChiNhanh
      LEFT JOIN dbo.NhanVien nvBs ON lh.BacSiPhuTrach = nvBs.MaNhanVien
      ${whereClause}
      ORDER BY lh.ThoiGianHen DESC, lh.NgayLap DESC
      OFFSET @Offset ROWS
      FETCH NEXT @Limit ROWS ONLY
    `;

    request.input("Offset", sql.Int, offset);
    request.input("Limit", sql.Int, limit);

    const dataResult = await request.query(dataQuery);

    const appointments = dataResult.recordset.map((apt) => ({
      MaLichHen: apt.MaLichHen,
      MaChiNhanh: apt.MaChiNhanh,
      TenChiNhanh: apt.TenChiNhanh,
      DiaChiChiNhanh: apt.DiaChiChiNhanh,
      SDTChiNhanh: apt.SDTChiNhanh,
      LoaiDichVu: apt.LoaiDichVu,
      BacSiPhuTrach: apt.BacSiPhuTrach,
      TenBacSiPhuTrach: apt.TenBacSiPhuTrach,
      ThoiGianHen: formatDateForResponse(apt.ThoiGianHen),
      NgayLap: formatDateForResponse(apt.NgayLap),
      TrangThai: apt.TrangThai,
    }));

    return {
      success: true,
      status: 200,
      data: {
        appointments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching customer appointments:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy danh sách lịch hẹn",
      error: error.message,
    };
  }
}

/**
 * Lấy danh sách bác sĩ rảnh theo chi nhánh, ngày, và loại dịch vụ
 * @param {object} params - { MaChiNhanh, ThoiGianHen, LoaiDichVu? }
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function getAvailableDoctors(params) {
  const { MaChiNhanh, ThoiGianHen, LoaiDichVu } = params;

  if (!MaChiNhanh || !ThoiGianHen) {
    return {
      success: false,
      status: 400,
      message: "Thiếu thông tin bắt buộc: MaChiNhanh, ThoiGianHen",
    };
  }

  try {
    const pool = await poolPromise;

    let dateString;
    if (typeof ThoiGianHen === "string") {
      if (ThoiGianHen.includes('T')) {
        dateString = ThoiGianHen.split('T')[0];
      } else {
        dateString = ThoiGianHen;
      }
    } else {
      const date = new Date(ThoiGianHen);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      dateString = `${year}-${month}-${day}`;
    }

    const branchCheck = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), MaChiNhanh).query(`
        SELECT TOP 1 MaChiNhanh, TenChiNhanh
        FROM dbo.ChiNhanh
        WHERE MaChiNhanh = @MaChiNhanh
      `);

    if (branchCheck.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy chi nhánh",
      };
    }

    const branchInfo = branchCheck.recordset[0];

    let doctorsQuery = `
      SELECT 
        nv.MaNhanVien,
        nv.HoTen,
        nv.ViTri,
        nv.MaChiNhanh,
        nv.TrangThai,
        llv.GioBatDau,
        llv.GioKetThuc
      FROM dbo.NhanVien nv
      INNER JOIN dbo.LichLamViec llv ON llv.BacSi = nv.MaNhanVien
      WHERE nv.MaChiNhanh = @MaChiNhanh
        AND nv.ViTri = N'Bác sĩ thú y'
        AND nv.TrangThai = 0
        AND CAST(llv.NgayLam AS DATE) = CAST(@NgayLam AS DATE)
    `;

    const doctorsResult = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
      .input("NgayLam", sql.NVarChar(10), dateString)
      .query(doctorsQuery);

    const doctors = doctorsResult.recordset;

    if (doctors.length === 0) {
      return {
        success: true,
        status: 200,
        message: "Không có bác sĩ có lịch làm việc vào ngày này",
        data: {
          doctors: [],
          branchInfo: {
            MaChiNhanh: branchInfo.MaChiNhanh,
            TenChiNhanh: branchInfo.TenChiNhanh,
          },
        },
      };
    }

    const doctorIds = doctors.map((d) => d.MaNhanVien);

    const appointmentsRequest = pool
      .request()
      .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
      .input("ThoiGianHen", sql.NVarChar(10), dateString);

    doctorIds.forEach((id, i) => {
      appointmentsRequest.input(`BacSi${i}`, sql.Char(5), id);
    });

    const existingAppointments = await appointmentsRequest.query(`
      SELECT 
        BacSiPhuTrach,
        COUNT(*) AS SoLuong
      FROM dbo.LichHen
      WHERE MaChiNhanh = @MaChiNhanh
        AND CAST(ThoiGianHen AS DATE) = CAST(@ThoiGianHen AS DATE)
          AND TrangThai = N'Đã lên lịch'
        AND BacSiPhuTrach IN (${doctorIds
        .map((_, i) => `@BacSi${i}`)
        .join(", ")})
      GROUP BY BacSiPhuTrach
    `);

    const availableDoctors = doctors.map((doctor) => {
      const appointmentCount =
        existingAppointments.recordset.find(
          (a) => a.BacSiPhuTrach === doctor.MaNhanVien
        )?.SoLuong || 0;

      const maxSlots = 10;
      const availableSlots = maxSlots - appointmentCount;

      const hasSchedule = !!doctor.GioBatDau && !!doctor.GioKetThuc;

      const formatTime = (timeValue) => {
        if (!timeValue) return null;

        if (timeValue instanceof Date) {
          const hours = timeValue.getUTCHours();
          const minutes = timeValue.getUTCMinutes();
          return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        }
        if (timeValue.hours !== undefined) {
          return `${String(timeValue.hours).padStart(2, "0")}:${String(timeValue.minutes || 0).padStart(2, "0")}`;
        }
        if (typeof timeValue === "string") {
          return timeValue.substring(0, 5);
        }
        return timeValue.toString().substring(0, 5);
      };

      const formattedBatDau = formatTime(doctor.GioBatDau);
      const formattedKetThuc = formatTime(doctor.GioKetThuc);

      const doctorInfo = {
        MaNhanVien: doctor.MaNhanVien,
        HoTen: doctor.HoTen,
        CoLichLamViec: hasSchedule,
        GioLamViec: hasSchedule
          ? {
            BatDau: formattedBatDau,
            KetThuc: formattedKetThuc,
          }
          : null,
        SoLuongConLai: availableSlots,
        TrangThai:
          hasSchedule && availableSlots > 0
            ? "Rảnh"
            : hasSchedule
              ? "Đã đầy"
              : "Không có lịch",
      };

      return doctorInfo;
    });

    return {
      success: true,
      status: 200,
      data: {
        doctors: availableDoctors,
        branchInfo: {
          MaChiNhanh: branchInfo.MaChiNhanh,
          TenChiNhanh: branchInfo.TenChiNhanh,
        },
        NgayHen: ThoiGianHen,
      },
    };
  } catch (error) {
    console.error("Error fetching available doctors:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy danh sách bác sĩ",
      error: error.message,
    };
  }
}
// --- CÁC HÀM DÀNH CHO NHÂN VIÊN / ADMIN --- DƯƠNG

/**
 * Lấy lịch hẹn theo filter (Chi nhánh, Bác sĩ, Ngày)
 */
async function getStaffSchedule({ branchId, doctorId, date, status }) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Query cơ bản join với Khách hàng và Bác sĩ để lấy tên
    let query = `
      SELECT 
        lh.MaLichHen,
        lh.ThoiGianHen,
        lh.LoaiDichVu,
        lh.TrangThai,
        lh.MaChiNhanh,
        kh.MaKhachHang,
        kh.HoTen AS TenKhachHang,
        kh.SDT AS SDTKhachHang,
        nv.HoTen AS TenBacSi
      FROM dbo.LichHen lh
      LEFT JOIN dbo.KhachHang kh ON lh.MaKhachHang = kh.MaKhachHang
      LEFT JOIN dbo.NhanVien nv ON lh.BacSiPhuTrach = nv.MaNhanVien
      WHERE 1=1
    `;

    // Filter theo Chi nhánh
    if (branchId) {
      query += ` AND lh.MaChiNhanh = @MaChiNhanh`;
      request.input('MaChiNhanh', sql.Char(4), branchId);
    }

    // Filter theo Bác sĩ
    if (doctorId) {
      query += ` AND lh.BacSiPhuTrach = @BacSiPhuTrach`;
      request.input('BacSiPhuTrach', sql.Char(5), doctorId);
    }

    // Filter theo Ngày
    if (date) {
      query += ` AND lh.ThoiGianHen = @ThoiGianHen`;
      request.input('ThoiGianHen', sql.Date, date);
    }

    // Filter theo Trạng thái (nếu cần)
    if (status) {
      query += ` AND lh.TrangThai = @TrangThai`;
      request.input('TrangThai', sql.NVarChar(20), status);
    }

    query += ` ORDER BY lh.ThoiGianHen ASC`;

    const result = await request.query(query);
    
    // Format lại ngày tháng trước khi trả về
    const data = result.recordset.map(item => ({
        ...item,
        ThoiGianHen: formatDateForResponse(item.ThoiGianHen)
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Error getStaffSchedule:", error);
    throw error;
  }
}

/**
 * Lấy chi tiết lịch hẹn
 */
async function getAppointmentDetail(id) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('MaLichHen', sql.Char(8), id)
      .query(`
        SELECT 
          lh.*,
          kh.HoTen AS TenKhachHang,
          kh.SDT AS SDTKhachHang,
          nv.HoTen AS TenBacSi,
       -- nl.HoTen AS TenNhanVienLap, đang bị sai ở đây
          cn.TenChiNhanh
        FROM dbo.LichHen lh
        LEFT JOIN dbo.KhachHang kh ON lh.MaKhachHang = kh.MaKhachHang
        LEFT JOIN dbo.NhanVien nv ON lh.BacSiPhuTrach = nv.MaNhanVien
     --LEFT JOIN dbo.NhanVien nl ON lh.NhanVienLap = nl.MaNhanVien câu query này bị sai vì lịch hẹn không có nhân viên lập
        LEFT JOIN dbo.ChiNhanh cn ON lh.MaChiNhanh = cn.MaChiNhanh
        WHERE lh.MaLichHen = @MaLichHen
      `);

    if (result.recordset.length === 0) {
      return { success: false, message: "Lịch hẹn không tồn tại" };
    }

    const data = result.recordset[0];
    data.ThoiGianHen = formatDateForResponse(data.ThoiGianHen);
    data.NgayLap = formatDateForResponse(data.NgayLap);

    return { success: true, data };
  } catch (error) {
    console.error("Error getAppointmentDetail:", error);
    throw error;
  }
}

/**
 * Cập nhật thông tin lịch hẹn (Dời lịch, đổi bác sĩ)
 */
async function updateAppointment(id, data) {
  try {
    const pool = await poolPromise;
    
    // Kiểm tra tồn tại
    const check = await pool.request()
        .input('MaLichHen', sql.Char(8), id)
        .query("SELECT TrangThai FROM dbo.LichHen WHERE MaLichHen = @MaLichHen");
    
    if(check.recordset.length === 0) return { success: false, message: "Không tìm thấy lịch hẹn" };
    if(check.recordset[0].TrangThai === 'Hoàn thành') return { success: false, message: "Không thể cập nhật lịch hẹn đã hoàn thành" };

    const request = pool.request()
      .input('MaLichHen', sql.Char(8), id);

    let query = `UPDATE dbo.LichHen SET `;
    const updates = [];

    if (data.ThoiGianHen) {
      updates.push(`ThoiGianHen = @ThoiGianHen`);
      request.input('ThoiGianHen', sql.Date, data.ThoiGianHen);
    }
    if (data.BacSiPhuTrach) {
      updates.push(`BacSiPhuTrach = @BacSiPhuTrach`);
      request.input('BacSiPhuTrach', sql.Char(5), data.BacSiPhuTrach);
    }
    if (data.LoaiDichVu) {
      updates.push(`LoaiDichVu = @LoaiDichVu`);
      request.input('LoaiDichVu', sql.NVarChar(20), data.LoaiDichVu);
    }

    if (updates.length === 0) return { success: false, message: "Không có dữ liệu cập nhật" };

    query += updates.join(", ");
    query += ` WHERE MaLichHen = @MaLichHen`;

    await request.query(query);
    return { success: true, message: "Cập nhật thành công" };
  } catch (error) {
    console.error("Error updateAppointment:", error);
    throw error;
  }
}

/**
 * Xác nhận lịch hẹn (Chuyển trạng thái 'Đã lên lịch')
 */
async function confirmAppointment(id) {
  try {
    const pool = await poolPromise;
    // Vì DB chỉ có 'Đã lên lịch' và 'Hoàn thành', ta đảm bảo trạng thái là 'Đã lên lịch'
    await pool.request()
      .input('MaLichHen', sql.Char(8), id)
      .query(`UPDATE dbo.LichHen SET TrangThai = N'Đã xác nhận' WHERE MaLichHen = @MaLichHen`);
      
    return { success: true, message: "Đã xác nhận lịch hẹn" };
  } catch (error) {
    console.error("Error confirmAppointment:", error);
    throw error;
  }
}

/**
 * Hoàn thành lịch hẹn
 */
async function completeAppointment(id) {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('MaLichHen', sql.Char(8), id)
      .query(`UPDATE dbo.LichHen SET TrangThai = N'Hoàn thành' WHERE MaLichHen = @MaLichHen`);

    return { success: true, message: "Lịch hẹn đã hoàn thành" };
  } catch (error) {
    console.error("Error completeAppointment:", error);
    throw error;
  }
}

module.exports = {
  createAppointment,
  cancelAppointment,
  getAvailableSlots,
  getCustomerAppointments,
  getAvailableDoctors,

  // Hàm của Nhân viên/Admin (Mới thêm)
  getStaffSchedule,
  getAppointmentDetail,
  updateAppointment,
  confirmAppointment,
  completeAppointment
};
