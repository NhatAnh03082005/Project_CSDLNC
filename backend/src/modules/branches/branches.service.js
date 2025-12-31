const { sql, poolPromise } = require("../../config/database");

/**
 * Lấy danh sách chi nhánh với phân trang và filter
 * @param {object} options - 
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function getBranches(options = {}) {
  const { page = 1, limit = 6, search, service } = options;
  const offset = (page - 1) * limit;

  try {
    const pool = await poolPromise;

    let whereClause = "WHERE 1=1";
    const conditions = [];

    if (service) {
      const serviceValue = service.trim();
      conditions.push(`
        EXISTS (
          SELECT 1 
          FROM dbo.DichVu_ChiNhanh dvcn
          WHERE dvcn.MaChiNhanh = cn.MaChiNhanh 
            AND dvcn.LoaiDichVu = @Service
        )
      `);
    }

    if (search) {
      conditions.push(`(
        cn.TenChiNhanh LIKE @Search 
        OR CONCAT(cn.SoNha, ' ', cn.TenDuong, ', ', cn.Phuong, ', ', cn.ThanhPho) LIKE @Search
        OR cn.TenDuong LIKE @Search
        OR cn.Phuong LIKE @Search
        OR cn.ThanhPho LIKE @Search
      )`);
    }

    if (conditions.length > 0) {
      whereClause += " AND " + conditions.join(" AND ");
    }

    const countRequest = pool.request();
    if (service) {
      const serviceValue = service.trim();
      countRequest.input("Service", sql.NVarChar(50), serviceValue);
    }
    if (search) {
      countRequest.input("Search", sql.NVarChar(255), `%${search}%`);
    }

    const countQuery = `
      SELECT COUNT(*) AS Total
      FROM dbo.ChiNhanh cn
      ${whereClause}
    `;

    const countResult = await countRequest.query(countQuery);
    const total = countResult.recordset[0].Total;
    const totalPages = Math.ceil(total / limit); 

    // Tạo request cho data query
    const dataRequest = pool.request();
    if (service) {
      const serviceValue = service.trim();
      dataRequest.input("Service", sql.NVarChar(50), serviceValue);
    }
    if (search) {
      dataRequest.input("Search", sql.NVarChar(255), `%${search}%`);
    }
    dataRequest.input("Offset", sql.Int, offset);
    dataRequest.input("Limit", sql.Int, limit);

    const dataQuery = `
      SELECT 
        cn.MaChiNhanh,
        cn.TenChiNhanh,
        CONCAT(cn.SoNha, ' ', cn.TenDuong, ', ', cn.Phuong, ', ', cn.ThanhPho) AS DiaChi,
        cn.SDT,
        cn.TGMoCua,
        cn.TGDongCua,
        -- Kiểm tra trạng thái mở cửa (dựa trên giờ hiện tại)
        CASE 
          WHEN CAST(GETDATE() AS TIME) BETWEEN cn.TGMoCua AND cn.TGDongCua THEN 1
          ELSE 0
        END AS DangMoCua
      FROM dbo.ChiNhanh cn
      ${whereClause}
      ORDER BY cn.TenChiNhanh ASC
      OFFSET @Offset ROWS
      FETCH NEXT @Limit ROWS ONLY
    `;

    const dataResult = await dataRequest.query(dataQuery);

    const branches = dataResult.recordset.map((branch) => {
      const formatTime = (timeValue) => {
        if (!timeValue) return null;
        if (timeValue instanceof Date) {
          const hours = timeValue.getUTCHours();
          const minutes = timeValue.getUTCMinutes();
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
        if (timeValue.hours !== undefined) {
          return `${String(timeValue.hours).padStart(2, '0')}:${String(timeValue.minutes || 0).padStart(2, '0')}`;
        }
        if (typeof timeValue === 'string') {
          return timeValue.substring(0, 5);
        }
        return timeValue.toString().substring(0, 5);
      };
      
      return {
        MaChiNhanh: branch.MaChiNhanh,
        TenChiNhanh: branch.TenChiNhanh,
        DiaChi: branch.DiaChi,
        SDT: branch.SDT,
        TGMoCua: formatTime(branch.TGMoCua),
        TGDongCua: formatTime(branch.TGDongCua),
        DangMoCua: branch.DangMoCua === 1,
      };
    });

    for (const branch of branches) {
      const servicesResult = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), branch.MaChiNhanh)
        .query(
          `
          SELECT LoaiDichVu
          FROM dbo.DichVu_ChiNhanh
          WHERE MaChiNhanh = @MaChiNhanh
        `
        );
      branch.DichVu = servicesResult.recordset.map((s) => s.LoaiDichVu);
    }

    return {
      success: true,
      status: 200,
      data: {
        branches,
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
    console.error("Error fetching branches:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy danh sách chi nhánh",
      error: error.message,
    };
  }
}

/**
 * Lấy chi tiết chi nhánh
 * @param {string} branchId 
 * @returns {Promise<{success: boolean, status?: number, message?: string, data?: object, error?: string}>}
 */
async function getBranchById(branchId) {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), branchId)
      .query(
        `
        SELECT 
          cn.MaChiNhanh,
          cn.TenChiNhanh,
          CONCAT(cn.SoNha, ' ', cn.TenDuong, ', ', cn.Phuong, ', ', cn.ThanhPho) AS DiaChi,
          cn.SDT,
          cn.TGMoCua,
          cn.TGDongCua,
          CASE 
            WHEN CAST(GETDATE() AS TIME) BETWEEN cn.TGMoCua AND cn.TGDongCua THEN 1
            ELSE 0
          END AS DangMoCua
        FROM dbo.ChiNhanh cn
        WHERE cn.MaChiNhanh = @MaChiNhanh
      `
      );

    if (result.recordset.length === 0) {
      return {
        success: false,
        status: 404,
        message: "Không tìm thấy chi nhánh",
      };
    }

    const branch = result.recordset[0];

    const servicesResult = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), branchId)
      .query(
        `
        SELECT LoaiDichVu
        FROM dbo.DichVu_ChiNhanh
        WHERE MaChiNhanh = @MaChiNhanh
      `
      );

    const formatTime = (timeValue) => {
      if (!timeValue) return null;
      if (timeValue instanceof Date) {
        const hours = timeValue.getUTCHours();
        const minutes = timeValue.getUTCMinutes();
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
      if (timeValue.hours !== undefined) {
        return `${String(timeValue.hours).padStart(2, '0')}:${String(timeValue.minutes || 0).padStart(2, '0')}`;
      }
      if (typeof timeValue === 'string') {
        return timeValue.substring(0, 5);
      }
      return timeValue.toString().substring(0, 5);
    };

    return {
      success: true,
      status: 200,
      data: {
        ...branch,
        TGMoCua: formatTime(branch.TGMoCua),
        TGDongCua: formatTime(branch.TGDongCua),
        DangMoCua: branch.DangMoCua === 1,
        DichVu: servicesResult.recordset.map((s) => s.LoaiDichVu),
      },
    };
  } catch (error) {
    console.error("Error fetching branch details:", error);
    return {
      success: false,
      status: 500,
      message: "Lỗi khi lấy thông tin chi nhánh",
      error: error.message,
    };
  }
}

module.exports = {
  getBranches,
  getBranchById,
};

