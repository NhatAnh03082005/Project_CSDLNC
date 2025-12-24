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

  // Validation: TenThuCung là bắt buộc
  if (!TenThuCung || TenThuCung.trim() === "") {
    return {
      success: false,
      status: 400,
      message: "Tên thú cưng là bắt buộc",
    };
  }

  // Validation: GioiTinh phải là 'Đực' hoặc 'Cái' nếu có
  if (GioiTinh && GioiTinh !== "Đực" && GioiTinh !== "Cái") {
    return {
      success: false,
      status: 400,
      message: "Giới tính phải là 'Đực' hoặc 'Cái'",
    };
  }

  // Validation: NgaySinh không được lớn hơn ngày hiện tại
  if (NgaySinh) {
    const birthDate = new Date(NgaySinh);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (birthDate > today) {
      return {
        success: false,
        status: 400,
        message: "Ngày sinh không được lớn hơn ngày hiện tại",
      };
    }
  }

  try {
    const pool = await poolPromise;

    // Tìm MaThuCung lớn nhất của khách hàng này để tạo mã mới
    const maxPetResult = await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        SELECT TOP 1 MaThuCung
        FROM dbo.ThuCung
        WHERE MaKhachHang = @MaKhachHang
        ORDER BY MaThuCung DESC
      `
      );

    let nextPetId = 1;
    if (maxPetResult.recordset.length > 0) {
      nextPetId = maxPetResult.recordset[0].MaThuCung + 1;
    }

    // Insert thú cưng mới
    const insertResult = await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .input("MaThuCung", sql.Int, nextPetId)
      .input("TenThuCung", sql.NVarChar(50), TenThuCung.trim())
      .input("GioiTinh", sql.NVarChar(3), GioiTinh || null)
      .input("Loai", sql.NVarChar(20), Loai || null)
      .input("Giong", sql.NVarChar(20), Giong || null)
      .input("NgaySinh", sql.Date, NgaySinh || null)
      .input("TinhTrangSucKhoe", sql.NVarChar(50), TinhTrangSucKhoe || null)
      .query(
        `
        INSERT INTO dbo.ThuCung
          (MaKhachHang, MaThuCung, TenThuCung, GioiTinh, Loai, Giong, NgaySinh, TinhTrangSucKhoe)
        VALUES
          (@MaKhachHang, @MaThuCung, @TenThuCung, @GioiTinh, @Loai, @Giong, @NgaySinh, @TinhTrangSucKhoe);
        
        SELECT TOP 1 *
        FROM dbo.ThuCung
        WHERE MaKhachHang = @MaKhachHang AND MaThuCung = @MaThuCung;
      `
      );

    if (insertResult.recordset.length === 0) {
      return {
        success: false,
        status: 500,
        message: "Không thể tạo thú cưng mới",
      };
    }

    return {
      success: true,
      status: 201,
      message: "Thêm thú cưng mới thành công",
      data: insertResult.recordset[0],
    };
  } catch (error) {
    console.error("Error creating pet:", error);

    // Xử lý lỗi duplicate key (nếu có)
    if (error.number === 2627 || error.message.includes("PRIMARY KEY")) {
      return {
        success: false,
        status: 409,
        message: "Thú cưng đã tồn tại",
        error: error.message,
      };
    }

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

  // Kiểm tra thú cưng có thuộc về khách hàng này không
  const petCheck = await verifyPetOwnership(customerId, petId);
  if (!petCheck.success) {
    return {
      success: false,
      status: 404,
      message: "Không tìm thấy thú cưng hoặc bạn không có quyền cập nhật thú cưng này",
    };
  }

  // Validation: Nếu có TenThuCung thì không được rỗng
  if (TenThuCung !== undefined && (!TenThuCung || TenThuCung.trim() === "")) {
    return {
      success: false,
      status: 400,
      message: "Tên thú cưng không được để trống",
    };
  }

  // Validation: GioiTinh phải là 'Đực' hoặc 'Cái' nếu có
  if (GioiTinh !== undefined && GioiTinh !== "Đực" && GioiTinh !== "Cái") {
    return {
      success: false,
      status: 400,
      message: "Giới tính phải là 'Đực' hoặc 'Cái'",
    };
  }

  // Validation: NgaySinh không được lớn hơn ngày hiện tại
  if (NgaySinh !== undefined) {
    const birthDate = new Date(NgaySinh);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (birthDate > today) {
      return {
        success: false,
        status: 400,
        message: "Ngày sinh không được lớn hơn ngày hiện tại",
      };
    }
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
    const request = pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .input("MaThuCung", sql.Int, parseInt(petId));

    // Xây dựng phần SET động, chỉ cập nhật field được gửi lên
    const setClauses = [];

    if (TenThuCung !== undefined) {
      setClauses.push("TenThuCung = @TenThuCung");
      request.input("TenThuCung", sql.NVarChar(50), TenThuCung.trim());
    }

    if (GioiTinh !== undefined) {
      setClauses.push("GioiTinh = @GioiTinh");
      request.input("GioiTinh", sql.NVarChar(3), GioiTinh || null);
    }

    if (Loai !== undefined) {
      setClauses.push("Loai = @Loai");
      request.input("Loai", sql.NVarChar(20), Loai || null);
    }

    if (Giong !== undefined) {
      setClauses.push("Giong = @Giong");
      request.input("Giong", sql.NVarChar(20), Giong || null);
    }

    if (NgaySinh !== undefined) {
      setClauses.push("NgaySinh = @NgaySinh");
      request.input("NgaySinh", sql.Date, NgaySinh || null);
    }

    if (TinhTrangSucKhoe !== undefined) {
      setClauses.push("TinhTrangSucKhoe = @TinhTrangSucKhoe");
      request.input("TinhTrangSucKhoe", sql.NVarChar(50), TinhTrangSucKhoe || null);
    }

    const updateQuery = `
      UPDATE dbo.ThuCung
      SET ${setClauses.join(", ")}
      WHERE MaKhachHang = @MaKhachHang AND MaThuCung = @MaThuCung;

      SELECT TOP 1 *
      FROM dbo.ThuCung
      WHERE MaKhachHang = @MaKhachHang AND MaThuCung = @MaThuCung;
    `;

    const result = await request.query(updateQuery);

    if (result.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy thú cưng để cập nhật",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Cập nhật thông tin thú cưng thành công",
      data: result.recordset[0],
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
    // Kiểm tra thú cưng có thuộc về khách hàng này không
    // const petCheck = await verifyPetOwnership(customerId, petId);
    // if (!petCheck.success) {
    //   return {
    //     success: false,
    //     status: 404,
    //     message: "Không tìm thấy thú cưng hoặc bạn không có quyền xóa thú cưng này",
    //   };
    // }

    const pool = await poolPromise;

    // Kiểm tra xem thú cưng có đang được sử dụng trong lịch sử dịch vụ sức khỏe không
    const checkUsage = await pool
      .request()
      .input("MaThuCung", sql.Int, parseInt(petId))
      .input("MaKhachHang", sql.Char(7), customerId)
      .query(
        `
        SELECT TOP 1 1
        FROM dbo.CTHD_DVSucKhoe
        WHERE MaThuCung = @MaThuCung AND MaKhachHang = @MaKhachHang
      `
      );

    if (checkUsage.recordset.length > 0) {
      return {
        success: false,
        status: 409,
        message:
          "Không thể xóa thú cưng vì thú cưng này đã có lịch sử khám bệnh hoặc tiêm phòng. Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.",
      };
    }

    // Thực hiện xóa thú cưng
    const deleteResult = await pool
      .request()
      .input("MaKhachHang", sql.Char(7), customerId)
      .input("MaThuCung", sql.Int, parseInt(petId))
      .query(
        `
        DELETE FROM dbo.ThuCung
        WHERE MaKhachHang = @MaKhachHang AND MaThuCung = @MaThuCung
      `
      );

    return {
      success: true,
      status: 200,
      message: "Xóa thú cưng thành công",
    };
  } catch (error) {
    console.error("Error deleting pet:", error);

    // Xử lý lỗi foreign key constraint
    if (
      error.number === 547 ||
      error.message.includes("FOREIGN KEY") ||
      error.message.includes("constraint")
    ) {
      return {
        success: false,
        status: 409,
        message:
          "Không thể xóa thú cưng vì thú cưng này đang được sử dụng trong hệ thống. Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.",
        error: error.message,
      };
    }

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
    // Kiểm tra thú cưng có thuộc về khách hàng này không
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

    // Lấy lịch sử khám bệnh của thú cưng (chỉ lấy của khách hàng này)
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
    // Kiểm tra thú cưng có thuộc về khách hàng này không
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

    // Lấy lịch sử tiêm phòng của thú cưng (chỉ lấy của khách hàng này)
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
