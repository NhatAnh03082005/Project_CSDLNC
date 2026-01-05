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

  // Validation cơ bản
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

  // Parse date
  let appointmentDate;
  if (typeof ThoiGianHen === 'string') {
    const dateParts = ThoiGianHen.split('-');
    if (dateParts.length === 3) {
      appointmentDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    } else {
      appointmentDate = new Date(ThoiGianHen);
    }
  } else {
    appointmentDate = new Date(ThoiGianHen);
  }

  // Client-side validation: check if date is in the past
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

    // GỌI STORED PROCEDURE sp_TV2_CreateAppointment
    const result = await pool
      .request()
      .input('MaKhachHang', sql.Char(7), customerId)
      .input('MaChiNhanh', sql.Char(4), MaChiNhanh)
      .input('LoaiDichVu', sql.NVarChar(20), LoaiDichVu)
      .input('ThoiGianHen', sql.Date, appointmentDate)
      .input('BacSiPhuTrach', sql.Char(5), BacSiPhuTrach || null)
      .output('MaLichHen', sql.Char(8))
      .output('ErrorMessage', sql.NVarChar(500))
      .output('StatusCode', sql.Int)
      .execute('sp_TV2_CreateAppointment');

    const { MaLichHen, ErrorMessage, StatusCode } = result.output;

    if (StatusCode !== 201) {
      return {
        success: false,
        status: StatusCode,
        message: ErrorMessage,
      };
    }

    // Query để lấy thông tin chi tiết lịch hẹn vừa tạo
    const appointmentInfo = await pool
      .request()
      .input('MaLichHen', sql.Char(8), MaLichHen)
      .query(`
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
          nvBs.HoTen AS TenBacSiPhuTrach
        FROM dbo.LichHen lh
        LEFT JOIN dbo.ChiNhanh cn ON lh.MaChiNhanh = cn.MaChiNhanh
        LEFT JOIN dbo.NhanVien nvBs ON lh.BacSiPhuTrach = nvBs.MaNhanVien
        WHERE lh.MaLichHen = @MaLichHen
      `);

    if (appointmentInfo.recordset.length === 0) {
      return {
        success: false,
        status: 500,
        message: "Không thể lấy thông tin lịch hẹn sau khi tạo",
      };
    }

    return {
      success: true,
      status: 201,
      message: ErrorMessage,
      data: {
        ...appointmentInfo.recordset[0],
        ThoiGianHen: formatDateForResponse(appointmentInfo.recordset[0].ThoiGianHen),
        NgayLap: formatDateForResponse(appointmentInfo.recordset[0].NgayLap),
      },
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
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

    // GỌI STORED PROCEDURE sp_CancelAppointment
    const result = await pool
      .request()
      .input('MaKhachHang', sql.Char(7), customerId)
      .input('MaLichHen', sql.Char(8), maLichHen)
      .output('ErrorMessage', sql.NVarChar(500))
      .output('StatusCode', sql.Int)
      .execute('sp_TV9_CancelAppointment');

    const { ErrorMessage, StatusCode } = result.output;

    if (StatusCode !== 200) {
      return {
        success: false,
        status: StatusCode,
        message: ErrorMessage,
      };
    }

    return {
      success: true,
      status: 200,
      message: ErrorMessage,
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

module.exports = {
  createAppointment,
  cancelAppointment,
  getAvailableSlots,
  getCustomerAppointments,
  getAvailableDoctors,
};
