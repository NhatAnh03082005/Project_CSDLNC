const { sql, poolPromise } = require("../../config/database");

class EmployeesService {
  /**
   * Lấy danh sách tất cả nhân viên
   */
  async getAllEmployees() {
    try {
      const pool = await poolPromise;

      // Get all employees with full information
      const query = `
        SELECT nv.MaNhanVien, nv.HoTen, nv.GioiTinh, nv.NgaySinh, nv.NgayVaoLam, nv.ViTri, nv.LuongCoBan, cn.TenChiNhanh
        FROM NhanVien nv
        JOIN ChiNhanh cn ON nv.MaChiNhanh = cn.MaChiNhanh
        Where nv.TrangThai = 0
        ORDER BY cn.MaChiNhanh, nv.MaNhanVien
      `;

      const result = await pool.request().query(query);

      return result.recordset;
    } catch (error) {
      console.error("Error in getAllEmployees:", error);
      throw error;
    }
  }

  /**
   * Lấy thông tin chi tiết nhân viên theo MaNhanVien
   */
  async getEmployeeById(maNhanVien) {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT nv.HoTen, nv.GioiTinh, nv.NgaySinh, nv.NgayVaoLam, nv.ViTri, nv.LuongCoBan, cn.TenChiNhanh
        FROM NhanVien nv
        JOIN ChiNhanh cn ON nv.MaChiNhanh = cn.MaChiNhanh
        WHERE nv.MaNhanVien = @maNhanVien
          AND nv.TrangThai = 0
      `;

      const result = await pool
        .request()
        .input("maNhanVien", sql.NVarChar, maNhanVien)
        .query(query);

      return result.recordset[0];
    } catch (error) {
      console.error("Error in getEmployeeById:", error);
      throw error;
    }
  }

  /**
   * Tạo nhân viên mới
   */
  async createEmployee(employeeData) {
    try {
      const pool = await poolPromise;
      const {
        HoTen,
        GioiTinh,
        NgaySinh,
        NgayVaoLam,
        ViTri,
        LuongCoBan,
        TenChiNhanh,
      } = employeeData;

      if (
        !HoTen ||
        !GioiTinh ||
        !NgaySinh ||
        !NgayVaoLam ||
        !ViTri ||
        LuongCoBan == null ||
        !TenChiNhanh
      ) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      // Lấy MaChiNhanh từ TenChiNhanh
      const branchResult = await pool
        .request()
        .input("TenChiNhanh", sql.NVarChar, TenChiNhanh)
        .query(
          `SELECT MaChiNhanh FROM ChiNhanh WHERE TenChiNhanh = @TenChiNhanh`
        );

      if (branchResult.recordset.length === 0)
        throw new Error("Tên chi nhánh không tồn tại");

      const MaChiNhanh = branchResult.recordset[0].MaChiNhanh;

      const insertResult = await pool
        .request()
        .input("HoTen", sql.NVarChar, HoTen)
        .input("GioiTinh", sql.NVarChar, GioiTinh)
        .input("NgaySinh", sql.Date, NgaySinh)
        .input("NgayVaoLam", sql.Date, NgayVaoLam)
        .input("ViTri", sql.NVarChar, ViTri)
        .input("LuongCoBan", sql.Int, LuongCoBan)
        .input("MaChiNhanh", sql.NVarChar, MaChiNhanh).query(`
        DECLARE @NewId TABLE (MaNhanVien INT);

        INSERT INTO NhanVien (HoTen, GioiTinh, NgaySinh, NgayVaoLam, ViTri, LuongCoBan, MaChiNhanh)
        OUTPUT INSERTED.MaNhanVien INTO @NewId(MaNhanVien)
        VALUES (@HoTen, @GioiTinh, @NgaySinh, @NgayVaoLam, @ViTri, @LuongCoBan, @MaChiNhanh);

        SELECT MaNhanVien FROM @NewId;
      `);

      return { success: true };
    } catch (error) {
      console.error("Error in createEmployee:", error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin nhân viên
   */
  async updateEmployee(maNhanVien, employeeData) {
    try {
      const pool = await poolPromise;

      // 1) Lấy nhân viên hiện tại
      const employee = await this.getEmployeeById(maNhanVien);
      if (!employee) return null;

      const {
        HoTen,
        NgaySinh,
        GioiTinh,
        NgayVaoLam,
        ViTri,
        LuongCoBan,
        TenChiNhanh, // FE gửi tên CN (optional)
      } = employeeData;

      // 2) Xác định có đổi chi nhánh không
      const currentTenCN = employee.TenChiNhanh; // lấy từ JOIN ở getEmployeeById
      const hasBranchChange =
        TenChiNhanh &&
        (!currentTenCN || TenChiNhanh.trim() !== String(currentTenCN).trim());

      // 3) Update các field cơ bản (KHÔNG đụng MaChiNhanh ở đây)
      const queryUpdateFields = `
      UPDATE NhanVien
      SET 
        HoTen = @HoTen,
        NgaySinh = @NgaySinh,
        GioiTinh = @GioiTinh,
        NgayVaoLam = @NgayVaoLam,
        ViTri = @ViTri,
        LuongCoBan = @LuongCoBan
      WHERE MaNhanVien = @MaNhanVien
    `;

      await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .input("HoTen", sql.NVarChar, HoTen ?? employee.HoTen)
        .input("NgaySinh", sql.Date, NgaySinh ?? employee.NgaySinh)
        .input("GioiTinh", sql.NVarChar, GioiTinh ?? employee.GioiTinh)
        .input("NgayVaoLam", sql.Date, NgayVaoLam ?? employee.NgayVaoLam)
        .input("ViTri", sql.NVarChar, ViTri ?? employee.ViTri)
        .input("LuongCoBan", sql.Int, LuongCoBan ?? employee.LuongCoBan)
        .query(queryUpdateFields);

      // 4) Nếu không đổi chi nhánh -> xong
      if (!hasBranchChange) {
        return await this.getEmployeeById(maNhanVien);
      }

      // 5) Có đổi chi nhánh: map TenChiNhanh -> MaChiNhanh
      const branchResult = await pool
        .request()
        .input("TenChiNhanh", sql.NVarChar, TenChiNhanh.trim()).query(`
        SELECT TOP 1 MaChiNhanh
        FROM ChiNhanh
        WHERE TenChiNhanh = @TenChiNhanh
      `);

      if (branchResult.recordset.length === 0) {
        throw new Error("Tên chi nhánh không tồn tại");
      }

      const maChiNhanhMoi = String(branchResult.recordset[0].MaChiNhanh).trim();

      // 6) Gọi SP để đổi chi nhánh + cập nhật lịch sử điều động
      // SP của bạn nhận CHAR(4) -> truyền đúng kiểu CHAR(4)
      await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .input("MaChiNhanhMoi", sql.Char(4), maChiNhanhMoi)
        .execute("dbo.sp_NV_ChangeBranch_UpdateLSDD");

      // 7) Trả về nhân viên mới nhất
      return await this.getEmployeeById(maNhanVien);
    } catch (error) {
      console.error("Error in updateEmployee:", error);
      throw error;
    }
  }

  async deleteEmployee(maNhanVien) {
    try {
      const pool = await poolPromise;

      // Check if employee exists
      const employee = await this.getEmployeeById(maNhanVien);
      if (!employee) {
        return null;
      }

      // Nếu nhân viên đang là quản lý chi nhánh, set QuanLy = null
      await pool.request().input("maNhanVien", sql.NVarChar, maNhanVien).query(`
          UPDATE ChiNhanh
          SET QuanLy = NULL
          WHERE QuanLy = @maNhanVien
        `);

      // Sau đó mới xóa nhân viên (soft delete)
      await pool.request().input("maNhanVien", sql.NVarChar, maNhanVien).query(`
          UPDATE NhanVien
          SET TrangThai = 1
          WHERE MaNhanVien = @maNhanVien
        `);

      return true;
    } catch (error) {
      console.error("Error in deleteEmployee:", error);
      throw error;
    }
  }

  /**
   * Lấy danh sách toàn bộ khách hàng hệ thống (có phân trang)
   * @param {object} options - { page, limit, search? }
   */
  async getAllCustomers(options = {}) {
    const { page = 1, limit = 20, search } = options;
    const offset = (page - 1) * limit;

    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Xây dựng WHERE clause nếu có search
      let whereClause = "";
      if (search) {
        whereClause = `
          WHERE kh.HoTen LIKE @Search 
            OR kh.SDT LIKE @Search 
            OR kh.CCCD LIKE @Search 
            OR kh.Email LIKE @Search
            OR kh.MaKhachHang LIKE @Search
        `;
        request.input("Search", sql.NVarChar(255), `%${search}%`);
      }

      // Đếm tổng số khách hàng
      const countQuery = `
        SELECT COUNT(*) AS Total
        FROM dbo.KhachHang kh
        ${whereClause}
      `;
      const countResult = await request.query(countQuery);
      const total = countResult.recordset[0].Total;
      const totalPages = Math.ceil(total / limit);

      // Lấy danh sách khách hàng với phân trang
      const dataQuery = `
        SELECT 
          kh.MaKhachHang,
          kh.HoTen,
          kh.GioiTinh,
          kh.SDT,
          kh.CCCD,
          kh.Email,
          kh.NgaySinh,
          kh.DiemLoyalty,
          kh.CapHoiVien,
          (SELECT COUNT(*) FROM dbo.ThuCung tc WHERE tc.MaKhachHang = kh.MaKhachHang) AS SoLuongThuCung
        FROM dbo.KhachHang kh
        ${whereClause}
        ORDER BY kh.MaKhachHang ASC
        OFFSET @Offset ROWS
        FETCH NEXT @Limit ROWS ONLY
      `;

      request.input("Offset", sql.Int, offset);
      request.input("Limit", sql.Int, limit);

      const dataResult = await request.query(dataQuery);

      const customers = dataResult.recordset.map((customer) => ({
        maKhachHang: customer.MaKhachHang,
        hoTen: customer.HoTen,
        gioiTinh: customer.GioiTinh,
        sdt: customer.SDT,
        cccd: customer.CCCD,
        email: customer.Email,
        ngaySinh: customer.NgaySinh
          ? customer.NgaySinh.toISOString().split("T")[0]
          : null,
        diemLoyalty: customer.DiemLoyalty || 0,
        capHoiVien: customer.CapHoiVien || "Cơ bản",
        soLuongThuCung: customer.SoLuongThuCung || 0,
      }));

      return {
        success: true,
        status: 200,
        data: {
          customers,
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
      console.error("Error fetching customers:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách khách hàng",
        error: error.message,
      };
    }
  }

  /**
   * Tìm kiếm khách hàng theo tên, SĐT, CCCD
   * @param {object} searchParams - { name?, phone?, cccd? }
   */
  async searchCustomers(searchParams = {}) {
    const { name, phone, cccd } = searchParams;

    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Xây dựng WHERE clause động
      const conditions = [];
      if (name) {
        conditions.push("kh.HoTen LIKE @Name");
        request.input("Name", sql.NVarChar(255), `%${name.trim()}%`);
      }
      if (phone) {
        conditions.push("kh.SDT LIKE @Phone");
        request.input("Phone", sql.Char(10), `%${phone.trim()}%`);
      }
      if (cccd) {
        conditions.push("kh.CCCD LIKE @CCCD");
        request.input("CCCD", sql.Char(12), `%${cccd.trim()}%`);
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      // Nếu không có điều kiện nào, trả về danh sách rỗng hoặc lỗi
      if (conditions.length === 0) {
        return {
          success: false,
          status: 400,
          message: "Vui lòng nhập ít nhất một thông tin để tìm kiếm",
        };
      }

      const query = `
        SELECT 
          kh.MaKhachHang,
          kh.HoTen,
          kh.GioiTinh,
          kh.SDT,
          kh.CCCD,
          kh.Email,
          kh.NgaySinh,
          kh.DiemLoyalty,
          kh.CapHoiVien,
          (SELECT COUNT(*) FROM dbo.ThuCung tc WHERE tc.MaKhachHang = kh.MaKhachHang) AS SoLuongThuCung
        FROM dbo.KhachHang kh
        ${whereClause}
        ORDER BY kh.MaKhachHang ASC
      `;

      const result = await request.query(query);

      const customers = result.recordset.map((customer) => ({
        maKhachHang: customer.MaKhachHang,
        hoTen: customer.HoTen,
        gioiTinh: customer.GioiTinh,
        sdt: customer.SDT,
        cccd: customer.CCCD,
        email: customer.Email,
        ngaySinh: customer.NgaySinh
          ? customer.NgaySinh.toISOString().split("T")[0]
          : null,
        diemLoyalty: customer.DiemLoyalty || 0,
        capHoiVien: customer.CapHoiVien || "Cơ bản",
        soLuongThuCung: customer.SoLuongThuCung || 0,
      }));

      return {
        success: true,
        status: 200,
        count: customers.length,
        data: customers,
      };
    } catch (error) {
      console.error("Error searching customers:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi tìm kiếm khách hàng",
        error: error.message,
      };
    }
  }

  /**
   * Lấy danh sách thú cưng của khách hàng
   * @param {string} maKhachHang
   */
  async getCustomerPets(maKhachHang) {
    try {
      const pool = await poolPromise;

      // Kiểm tra khách hàng tồn tại
      const customerCheck = await pool
        .request()
        .input("MaKhachHang", sql.Char(7), maKhachHang)
        .query(
          `SELECT TOP 1 MaKhachHang, HoTen FROM dbo.KhachHang WHERE MaKhachHang = @MaKhachHang`
        );

      if (customerCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy khách hàng",
        };
      }

      const result = await pool
        .request()
        .input("MaKhachHang", sql.Char(7), maKhachHang)
        .query(
          `
          SELECT 
            tc.MaKhachHang,
            tc.MaThuCung,
            tc.TenThuCung,
            tc.GioiTinh,
            tc.Loai,
            tc.Giong,
            tc.NgaySinh,
            tc.TinhTrangSucKhoe
          FROM dbo.ThuCung tc
          WHERE tc.MaKhachHang = @MaKhachHang
          ORDER BY tc.MaThuCung ASC
        `
        );

      const pets = result.recordset.map((pet) => ({
        maKhachHang: pet.MaKhachHang,
        maThuCung: pet.MaThuCung,
        tenThuCung: pet.TenThuCung,
        gioiTinh: pet.GioiTinh,
        loai: pet.Loai,
        giong: pet.Giong,
        ngaySinh: pet.NgaySinh
          ? pet.NgaySinh.toISOString().split("T")[0]
          : null,
        tinhTrangSucKhoe: pet.TinhTrangSucKhoe,
      }));

      return {
        success: true,
        status: 200,
        data: {
          customer: {
            maKhachHang: customerCheck.recordset[0].MaKhachHang,
            hoTen: customerCheck.recordset[0].HoTen,
          },
          pets,
          count: pets.length,
        },
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
   * Lấy danh sách sản phẩm có tồn kho > 0 tại chi nhánh
   * @param {string} maChiNhanh
   */
  async getProductsByBranch(maChiNhanh) {
    try {
      const pool = await poolPromise;

      if (!maChiNhanh) {
        return {
          success: false,
          status: 400,
          message: "Mã chi nhánh không được để trống",
        };
      }

      const maChiNhanhFormatted = String(maChiNhanh).trim();

      const branchCheck = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), maChiNhanhFormatted)
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
          message: `Không tìm thấy chi nhánh với mã: ${maChiNhanh}`,
        };
      }

      const result = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), maChiNhanhFormatted)
        .query(
          `
          SELECT 
            sp.MaSanPham,
            sp.TenSanPham,
            sp.LoaiSanPham,
            sp.DonGia,
            tk.SoLuongTon AS SoLuongTonKho
          FROM dbo.SanPham sp
          INNER JOIN dbo.SanPham_TonKho tk 
            ON sp.MaSanPham = tk.MaSanPham AND tk.MaChiNhanh = @MaChiNhanh
          WHERE tk.SoLuongTon > 0
          ORDER BY sp.LoaiSanPham, sp.TenSanPham
        `
        );

      const products = result.recordset.map((item) => ({
        maSanPham: item.MaSanPham,
        tenSanPham: item.TenSanPham,
        loaiSanPham: item.LoaiSanPham,
        donGia: parseFloat(item.DonGia),
        soLuongTonKho: item.SoLuongTonKho || 0,
      }));

      return {
        success: true,
        status: 200,
        data: {
          chiNhanh: {
            maChiNhanh: branchCheck.recordset[0].MaChiNhanh,
            tenChiNhanh: branchCheck.recordset[0].TenChiNhanh,
          },
          products,
        },
      };
    } catch (error) {
      console.error("Error fetching products by branch:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách sản phẩm",
        error: error.message,
      };
    }
  }

  /**
   * Lấy thông tin nhân viên hiện tại (từ token)
   * @param {string} maNhanVien
   */
  async getEmployeeProfile(maNhanVien) {
    try {
      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .query(
          `
          SELECT 
            nv.MaNhanVien,
            nv.HoTen,
            nv.GioiTinh,
            nv.NgaySinh,
            nv.NgayVaoLam,
            nv.ViTri,
            nv.LuongCoBan,
            nv.MaChiNhanh,
            cn.TenChiNhanh,
            cn.DiaChi,
            cn.SDT AS SDTChiNhanh
          FROM dbo.NhanVien nv
          INNER JOIN dbo.ChiNhanh cn ON nv.MaChiNhanh = cn.MaChiNhanh
          WHERE nv.MaNhanVien = @MaNhanVien
            AND nv.TrangThai = 0
        `
        );

      if (result.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy nhân viên",
        };
      }

      const employee = result.recordset[0];

      return {
        success: true,
        status: 200,
        data: {
          maNhanVien: employee.MaNhanVien,
          hoTen: employee.HoTen,
          gioiTinh: employee.GioiTinh,
          ngaySinh: employee.NgaySinh
            ? employee.NgaySinh.toISOString().split("T")[0]
            : null,
          ngayVaoLam: employee.NgayVaoLam
            ? employee.NgayVaoLam.toISOString().split("T")[0]
            : null,
          viTri: employee.ViTri,
          luongCoBan: employee.LuongCoBan,
          chiNhanh: {
            maChiNhanh: employee.MaChiNhanh,
            tenChiNhanh: employee.TenChiNhanh,
            diaChi: employee.DiaChi,
            sdt: employee.SDTChiNhanh,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching employee profile:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy thông tin nhân viên",
        error: error.message,
      };
    }
  }

  /**
   * Lấy thông tin chi nhánh của nhân viên hiện tại
   * @param {string} maNhanVien
   */
  async getEmployeeBranch(maNhanVien) {
    try {
      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .query(
          `
          SELECT 
            cn.MaChiNhanh,
            cn.TenChiNhanh,
            cn.DiaChi,
            cn.SDT,
            cn.Email
          FROM dbo.NhanVien nv
          INNER JOIN dbo.ChiNhanh cn ON nv.MaChiNhanh = cn.MaChiNhanh
          WHERE nv.MaNhanVien = @MaNhanVien
            AND nv.TrangThai = 0
        `
        );

      if (result.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy nhân viên hoặc chi nhánh",
        };
      }

      const branch = result.recordset[0];

      return {
        success: true,
        status: 200,
        data: {
          maChiNhanh: branch.MaChiNhanh,
          tenChiNhanh: branch.TenChiNhanh,
          diaChi: branch.DiaChi,
          sdt: branch.SDT,
          email: branch.Email,
        },
      };
    } catch (error) {
      console.error("Error fetching employee branch:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy thông tin chi nhánh",
        error: error.message,
      };
    }
  }

  /**
   * Lấy lịch làm việc của nhân viên
   * @param {string} maNhanVien
   */
  async getWorkSchedule(maNhanVien) {
    try {
      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .query(
          `
          SELECT 
            llv.MaLichLamViec,
            llv.BacSi AS MaNhanVien,
            llv.NgayLamViec,
            llv.GioBatDau,
            llv.GioKetThuc
          FROM dbo.LichLamViec llv
          WHERE llv.BacSi = @MaNhanVien
          ORDER BY llv.NgayLamViec DESC, llv.GioBatDau ASC
        `
        );

      const schedules = result.recordset.map((schedule) => ({
        maLichLamViec: schedule.MaLichLamViec,
        maNhanVien: schedule.MaNhanVien,
        ngayLamViec: schedule.NgayLamViec
          ? schedule.NgayLamViec.toISOString().split("T")[0]
          : null,
        gioBatDau: schedule.GioBatDau,
        gioKetThuc: schedule.GioKetThuc,
      }));

      return {
        success: true,
        status: 200,
        count: schedules.length,
        data: schedules,
      };
    } catch (error) {
      console.error("Error fetching work schedule:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy lịch làm việc",
        error: error.message,
      };
    }
  }

  /**
   * Đăng ký lịch làm việc mới
   * @param {string} maNhanVien
   * @param {object} scheduleData - { NgayLamViec, GioBatDau, GioKetThuc }
   */
  async createWorkSchedule(maNhanVien, scheduleData) {
    const { NgayLamViec, GioBatDau, GioKetThuc } = scheduleData;

    if (!NgayLamViec || !GioBatDau || !GioKetThuc) {
      return {
        success: false,
        status: 400,
        message: "Thiếu thông tin bắt buộc: NgayLamViec, GioBatDau, GioKetThuc",
      };
    }

    try {
      const pool = await poolPromise;

      // Kiểm tra nhân viên có phải bác sĩ không
      const employeeCheck = await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .query(
          `
          SELECT TOP 1 MaNhanVien, ViTri
          FROM dbo.NhanVien
          WHERE MaNhanVien = @MaNhanVien
            AND TrangThai = 0
        `
        );

      if (employeeCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy nhân viên",
        };
      }

      if (employeeCheck.recordset[0].ViTri !== "Bác sĩ thú y") {
        return {
          success: false,
          status: 403,
          message: "Chỉ bác sĩ thú y mới có thể đăng ký lịch làm việc",
        };
      }

      // Kiểm tra xung đột lịch
      const conflictCheck = await pool
        .request()
        .input("BacSi", sql.Char(5), maNhanVien)
        .input("NgayLamViec", sql.Date, NgayLamViec)
        .input("GioBatDau", sql.Time, GioBatDau)
        .input("GioKetThuc", sql.Time, GioKetThuc)
        .query(
          `
          SELECT TOP 1 MaLichLamViec
          FROM dbo.LichLamViec
          WHERE BacSi = @BacSi
            AND NgayLamViec = @NgayLamViec
            AND (
              (@GioBatDau >= GioBatDau AND @GioBatDau < GioKetThuc)
              OR (@GioKetThuc > GioBatDau AND @GioKetThuc <= GioKetThuc)
              OR (@GioBatDau <= GioBatDau AND @GioKetThuc >= GioKetThuc)
            )
        `
        );

      if (conflictCheck.recordset.length > 0) {
        return {
          success: false,
          status: 400,
          message: "Lịch làm việc bị trùng với lịch đã đăng ký",
        };
      }

      // Thêm lịch làm việc mới
      await pool
        .request()
        .input("BacSi", sql.Char(5), maNhanVien)
        .input("NgayLamViec", sql.Date, NgayLamViec)
        .input("GioBatDau", sql.Time, GioBatDau)
        .input("GioKetThuc", sql.Time, GioKetThuc)
        .query(
          `
          INSERT INTO dbo.LichLamViec (BacSi, NgayLamViec, GioBatDau, GioKetThuc)
          VALUES (@BacSi, @NgayLamViec, @GioBatDau, @GioKetThuc)
        `
        );

      return {
        success: true,
        status: 201,
        message: "Đăng ký lịch làm việc thành công",
      };
    } catch (error) {
      console.error("Error creating work schedule:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi đăng ký lịch làm việc",
        error: error.message,
      };
    }
  }

  /**
   * Xóa lịch làm việc
   * @param {string} maNhanVien
   * @param {string} maLichLamViec
   */
  async deleteWorkSchedule(maNhanVien, maLichLamViec) {
    try {
      const pool = await poolPromise;

      // Kiểm tra lịch làm việc có thuộc về nhân viên này không
      const scheduleCheck = await pool
        .request()
        .input("MaLichLamViec", sql.Int, maLichLamViec)
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .query(
          `
          SELECT TOP 1 MaLichLamViec
          FROM dbo.LichLamViec
          WHERE MaLichLamViec = @MaLichLamViec
            AND BacSi = @MaNhanVien
        `
        );

      if (scheduleCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy lịch làm việc hoặc không có quyền xóa",
        };
      }

      // Xóa lịch làm việc
      await pool
        .request()
        .input("MaLichLamViec", sql.Int, maLichLamViec)
        .query(
          `
          DELETE FROM dbo.LichLamViec
          WHERE MaLichLamViec = @MaLichLamViec
        `
        );

      return {
        success: true,
        status: 200,
        message: "Xóa lịch làm việc thành công",
      };
    } catch (error) {
      console.error("Error deleting work schedule:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi xóa lịch làm việc",
        error: error.message,
      };
    }
  }
}

module.exports = new EmployeesService();
