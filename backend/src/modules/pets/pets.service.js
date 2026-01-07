const { sql, poolPromise } = require("../../config/database");

/**
 * Lấy danh sách thú cưng của khách hàng
 * @param {string} customerId
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: array, count?: number, error?: string}>}
 */
async function getCustomerPets(customerId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        SELECT
          MaThuCung,
          TenThuCung,
          GioiTinh,
          Loai,
          Giong,
          NgaySinh,
          TinhTrangSucKhoe
        FROM dbo.ThuCung
        WHERE MaKhachHang = @MaKhachHang
        ORDER BY MaThuCung ASC
      `
      );

    return {
      success: true,
      status: 200,
      count: result.recordset.length,
      data: result.recordset,
    };
  } catch (error) {
    console.error("Error fetching customer pets:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy danh sách thú cưng",
      error: error.message,
    };
  }
}

/**
 * Tạo thú cưng mới cho khách hàng
 * @param {string} customerId
 * @param {object} petData
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function createPet(customerId, petData) {
  const { TenThuCung, GioiTinh, Loai, Giong, NgaySinh, TinhTrangSucKhoe } = petData;

  // Validation cơ bản: TenThuCung là bắt buộc
  if (!TenThuCung || TenThuCung.trim() === "") {
    return {
      success: false,
      status: 400,
      message: "Tên thú cưng là bắt buộc",
    };
  }

  try {
    const pool = await poolPromise;

    // GỌI STORED PROCEDURE sp_TV5_AddPet
    const result = await pool
      .request()
      .input('MaKhachHang', sql.Char(7), customerId)
      .input('TenThuCung', sql.NVarChar(50), TenThuCung.trim())
      .input('GioiTinh', sql.NVarChar(3), GioiTinh || null)
      .input('Loai', sql.NVarChar(20), Loai || null)
      .input('Giong', sql.NVarChar(20), Giong || null)
      .input('NgaySinh', sql.Date, NgaySinh || null)
      .input('TinhTrangSucKhoe', sql.NVarChar(50), TinhTrangSucKhoe || null)
      .output('MaThuCung', sql.Int)
      .output('ErrorMessage', sql.NVarChar(500))
      .output('StatusCode', sql.Int)
      .execute('sp_TV5_AddPet');

    const { MaThuCung, ErrorMessage, StatusCode } = result.output;

    if (StatusCode !== 201) {
      return {
        success: false,
        status: StatusCode,
        message: ErrorMessage,
      };
    }

    // Query để lấy thông tin thú cưng vừa tạo
    const petInfo = await pool
      .request()
      .input('MaKhachHang', sql.Char(7), customerId)
      .input('MaThuCung', sql.Int, MaThuCung)
      .query(`
        SELECT * FROM dbo.ThuCung
        WHERE MaKhachHang = @MaKhachHang AND MaThuCung = @MaThuCung
      `);

    return {
      success: true,
      status: 201,
      message: ErrorMessage,
      data: petInfo.recordset[0],
    };
  } catch (error) {
    console.error("Error creating pet:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi thêm thú cưng mới",
      error: error.message,
    };
  }
}

/**
 * Cập nhật thông tin thú cưng
 * @param {string} customerId
 * @param {string} petId
 * @param {object} petData
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function updatePet(customerId, petId, petData) {
  const { TenThuCung, GioiTinh, Loai, Giong, NgaySinh, TinhTrangSucKhoe } = petData;

  // Validation cơ bản: Nếu có TenThuCung thì không được rỗng
  if (TenThuCung !== undefined && (!TenThuCung || TenThuCung.trim() === "")) {
    return {
      success: false,
      status: 400,
      message: "Tên thú cưng không được để trống",
    };
  }

  // Kiểm tra có dữ liệu để cập nhật không
  if (
    TenThuCung === undefined &&
    GioiTinh === undefined &&
    Loai === undefined &&
    Giong === undefined &&
    NgaySinh === undefined &&
    TinhTrangSucKhoe === undefined
  ) {
    return {
      success: false,
      status: 400,
      message: "Không có dữ liệu để cập nhật",
    };
  }

  try {
    const pool = await poolPromise;

    // GỌI STORED PROCEDURE sp_TV5_UpdatePet
    const result = await pool
      .request()
      .input('MaKhachHang', sql.Char(7), customerId)
      .input('MaThuCung', sql.Int, parseInt(petId))
      .input('TenThuCung', sql.NVarChar(50), TenThuCung !== undefined ? TenThuCung?.trim() : null)
      .input('GioiTinh', sql.NVarChar(3), GioiTinh !== undefined ? GioiTinh : null)
      .input('Loai', sql.NVarChar(20), Loai !== undefined ? Loai : null)
      .input('Giong', sql.NVarChar(20), Giong !== undefined ? Giong : null)
      .input('NgaySinh', sql.Date, NgaySinh !== undefined ? NgaySinh : null)
      .input('TinhTrangSucKhoe', sql.NVarChar(50), TinhTrangSucKhoe !== undefined ? TinhTrangSucKhoe : null)
      .output('ErrorMessage', sql.NVarChar(500))
      .output('StatusCode', sql.Int)
      .execute('sp_TV5_UpdatePet');

    const { ErrorMessage, StatusCode } = result.output;

    if (StatusCode !== 200) {
      return {
        success: false,
        status: StatusCode,
        message: ErrorMessage,
      };
    }

    // Query để lấy thông tin thú cưng sau khi update
    const petInfo = await pool
      .request()
      .input('MaKhachHang', sql.Char(7), customerId)
      .input('MaThuCung', sql.Int, parseInt(petId))
      .query(`
        SELECT * FROM dbo.ThuCung
        WHERE MaKhachHang = @MaKhachHang AND MaThuCung = @MaThuCung
      `);

    return {
      success: true,
      status: 200,
      message: ErrorMessage,
      data: petInfo.recordset[0],
    };
  } catch (error) {
    console.error("Error updating pet:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi cập nhật thông tin thú cưng",
      error: error.message,
    };
  }
}

/**
 * Xóa thú cưng của khách hàng
 * @param {string} customerId
 * @param {string} petId
 * @returns {Promise<{success: boolean, status?: number, message?: string, error?: string}>}
 */
async function deletePet(customerId, petId) {
  try {
    const pool = await poolPromise;

    // GỌI STORED PROCEDURE sp_TV5_DeletePet
    const result = await pool
      .request()
      .input('MaKhachHang', sql.Char(7), customerId)
      .input('MaThuCung', sql.Int, parseInt(petId))
      .output('ErrorMessage', sql.NVarChar(500))
      .output('StatusCode', sql.Int)
      .execute('sp_TV5_DeletePet');

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
    };
  } catch (error) {
    console.error("Error deleting pet:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi xóa thú cưng",
      error: error.message,
    };
  }
}

/**
 * Lấy chi tiết thú cưng của khách hàng
 * @param {string} customerId
 * @param {string} petId
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function getPetDetails(customerId, petId) {
  try {
    // Kiểm tra thú cưng có thuộc về khách hàng này không
    const petCheck = await verifyPetOwnership(customerId, petId);
    if (!petCheck.success) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy thú cưng hoặc bạn không có quyền xem thông tin thú cưng này",
      };
    }

    const pool = await poolPromise;
    
    // Lấy thông tin chi tiết đầy đủ của thú cưng
    const result = await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .input("MaThuCung", sql.Int, parseInt(petId))
      .query(
        `
        SELECT
          MaKhachHang,
          MaThuCung,
          TenThuCung,
          GioiTinh,
          Loai,
          Giong,
          NgaySinh,
          TinhTrangSucKhoe
        FROM dbo.ThuCung
        WHERE MaKhachHang = @MaKhachHang AND MaThuCung = @MaThuCung
      `
      );

    if (result.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy thú cưng",
      };
    }

    return {
      success: true,
      status: 200,
      data: result.recordset[0],
    };
  } catch (error) {
    console.error("Error fetching pet details:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy thông tin chi tiết thú cưng",
      error: error.message,
    };
  }
}

/**
 * Helper: Kiểm tra thú cưng có thuộc về khách hàng không
 * @param {string} customerId
 * @param {string} petId
 * @returns {Promise<{success: boolean, petInfo?: object, message?: string}>}
 */
async function verifyPetOwnership(customerId, petId) {
  const pool = await poolPromise;
  const checkPet = await pool
    .request()
    .input("MaThuCung", sql.Int, parseInt(petId))
    .input("MaKhachHang", sql.Char(7), customerId)
    .query(
      `
      SELECT TOP 1 MaThuCung, TenThuCung
      FROM dbo.ThuCung
      WHERE MaThuCung = @MaThuCung AND MaKhachHang = @MaKhachHang
    `
    );

  if (checkPet.recordset.length === 0) {
    return {
      success: false,
      message: "Không tìm thấy thú cưng hoặc bạn không có quyền truy cập",
    };
  }

  return {
    success: true,
    petInfo: checkPet.recordset[0],
  };
}

/**
 * Lấy lịch sử khám bệnh của thú cưng (chỉ khách hàng sở hữu thú cưng mới xem được)
 * @param {string} customerId
 * @param {string} petId
 */
async function getPetMedicalHistory(customerId, petId) {
  try {
    const petCheck = await verifyPetOwnership(customerId, petId);
    if (!petCheck.success) {
      return {
        success: false,
        status: 404,
        message:
          "Không tìm thấy thú cưng hoặc bạn không có quyền xem lịch sử khám bệnh của thú cưng này",
      };
    }

    const petInfo = petCheck.petInfo;
    const pool = await poolPromise;

    const medicalHistory = await pool
      .request()
      .input("MaThuCung", sql.Int, parseInt(petId))
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        SELECT
          hd.MaHoaDon,
          hd.NgayLap AS NgayKham,
          hd.MaChiNhanh,
          cn.TenChiNhanh,
          cthd.STT,
          cthd.ThanhTien,
          dvsk.BacSi AS MaBacSi,
          nvBs.HoTen AS TenBacSi,
          kb.TrieuChung,
          kb.ChanDoan,
          kb.ToaThuoc,
          kb.NgayTaiKham
        FROM dbo.CTHD_DVSucKhoe dvsk
        INNER JOIN dbo.CTHD cthd
          ON dvsk.MaHoaDon = cthd.MaHoaDon AND dvsk.STT = cthd.STT
        INNER JOIN dbo.CTHD_KhamBenh kb
          ON dvsk.MaHoaDon = kb.MaHoaDon AND dvsk.STT = kb.STT
        INNER JOIN dbo.HoaDon hd
          ON cthd.MaHoaDon = hd.MaHoaDon
        LEFT JOIN dbo.NhanVien nvBs
          ON dvsk.BacSi = nvBs.MaNhanVien
        LEFT JOIN dbo.ChiNhanh cn
          ON hd.MaChiNhanh = cn.MaChiNhanh
        WHERE dvsk.MaThuCung = @MaThuCung
          AND dvsk.MaKhachHang = @MaKhachHang
          AND dvsk.LoaiDichVuSK = N'Khám bệnh'
        ORDER BY hd.NgayLap DESC, cthd.STT ASC
      `
      );

    if (medicalHistory.recordset.length === 0) {
      return {
        success: true,
        status: 200,
        message: "Không có lịch sử khám bệnh thú cưng",
        data: {
          petInfo: {
            MaThuCung: petInfo.MaThuCung,
            TenThuCung: petInfo.TenThuCung,
          },
          medicalRecords: [],
        },
      };
    }

    return {
      success: true,
      status: 200,
      data: {
        petInfo: {
          MaThuCung: petInfo.MaThuCung,
          TenThuCung: petInfo.TenThuCung,
        },
        medicalRecords: medicalHistory.recordset,
      },
    };
  } catch (error) {
    console.error("Error fetching pet medical history:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy lịch sử khám bệnh của thú cưng",
      error: error.message,
    };
  }
}

/**
 * Lấy lịch sử tiêm phòng của thú cưng (chỉ khách hàng sở hữu thú cưng mới xem được)
 * @param {string} customerId
 * @param {string} petId
 */
async function getPetVaccinationHistory(customerId, petId) {
  try {
    const petCheck = await verifyPetOwnership(customerId, petId);
    if (!petCheck.success) {
      return {
        success: false,
        status: 404,
        message:
          "Không tìm thấy thú cưng hoặc bạn không có quyền xem lịch sử tiêm phòng của thú cưng này",
      };
    }

    const petInfo = petCheck.petInfo;
    const pool = await poolPromise;

    const vaccinationHistory = await pool
      .request()
      .input("MaThuCung", sql.Int, parseInt(petId))
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        SELECT
          hd.MaHoaDon,
          hd.NgayLap AS NgayTiem,
          hd.MaChiNhanh,
          cn.TenChiNhanh,
          cthd.STT,
          cthd.ThanhTien,
          dvsk.BacSi AS MaBacSi,
          nvBs.HoTen AS TenBacSi,
          tp.MaVacXin,
          vx.TenVacXin,
          tp.MaGoiDK,
          gtp.LoaiGoi AS TenGoiDK
        FROM dbo.CTHD_DVSucKhoe dvsk
        INNER JOIN dbo.CTHD cthd
          ON dvsk.MaHoaDon = cthd.MaHoaDon AND dvsk.STT = cthd.STT
        INNER JOIN dbo.CTHD_TiemPhong tp
          ON dvsk.MaHoaDon = tp.MaHoaDon AND dvsk.STT = tp.STT
        INNER JOIN dbo.HoaDon hd
          ON cthd.MaHoaDon = hd.MaHoaDon
        LEFT JOIN dbo.NhanVien nvBs
          ON dvsk.BacSi = nvBs.MaNhanVien
        LEFT JOIN dbo.ChiNhanh cn
          ON hd.MaChiNhanh = cn.MaChiNhanh
        LEFT JOIN dbo.VacXin vx
          ON tp.MaVacXin = vx.MaVacXin
        LEFT JOIN dbo.DK_GoiTiemPhong gd
          ON tp.MaGoiDK = gd.MaGoiDK
        LEFT JOIN dbo.GoiTiemPhong gtp
          ON gd.LoaiGoi = gtp.LoaiGoi
        WHERE dvsk.MaThuCung = @MaThuCung
          AND dvsk.MaKhachHang = @MaKhachHang
          AND dvsk.LoaiDichVuSK = N'Tiêm phòng'
        ORDER BY hd.NgayLap DESC, cthd.STT ASC
      `
      );

    if (vaccinationHistory.recordset.length === 0) {
      return {
        success: true,
        status: 200,
        message: "Không có lịch sử tiêm phòng thú cưng",
        data: {
          petInfo: {
            MaThuCung: petInfo.MaThuCung,
            TenThuCung: petInfo.TenThuCung,
          },
          vaccinationRecords: [],
        },
      };
    }

    return {
      success: true,
      status: 200,
      data: {
        petInfo: {
          MaThuCung: petInfo.MaThuCung,
          TenThuCung: petInfo.TenThuCung,
        },
        vaccinationRecords: vaccinationHistory.recordset,
      },
    };
  } catch (error) {
    console.error("Error fetching pet vaccination history:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy lịch sử tiêm phòng của thú cưng",
      error: error.message,
    };
  }
}

module.exports = {
  getCustomerPets,
  getPetDetails,
  createPet,
  updatePet,
  deletePet,
  getPetMedicalHistory,
  getPetVaccinationHistory,
};
