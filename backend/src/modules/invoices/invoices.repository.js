const { sql, poolPromise } = require('../../config/database');
const { SERVICE_TYPES } = require('../../config/constants');

// Hằng số local cho repository
const TYPE_MUA_HANG = 'Mua hàng';
// SERVICE_TYPES.MEDICAL là 'Khám bệnh', VACCINATION là 'Tiêm phòng'

/**
 * Xử lý Transaction tạo hóa đơn phức tạp
 */
const createInvoiceTransaction = async (data) => {
  const pool = await poolPromise;

  // --- BƯỚC 1: KIỂM TRA DỮ LIỆU ĐẦU VÀO (QUAN TRỌNG) ---
  // Trước khi Transaction, ta kiểm tra xem Nhân Viên có tồn tại không.
  // Đây là nguyên nhân chính khiến Trigger thất bại âm thầm.
  const checkStaffReq = new sql.Request(pool); // Dùng pool ngoài transaction để check nhanh
  const checkStaffResult = await checkStaffReq
    .input('MaNhanVien', sql.Char(5), data.NhanVienLap)
    .query('SELECT MaNhanVien, HoTen, MaChiNhanh FROM NhanVien WHERE MaNhanVien = @MaNhanVien');

  if (checkStaffResult.recordset.length === 0) {
    throw new Error(`Lỗi: Mã nhân viên lập hóa đơn '${data.NhanVienLap}' không tồn tại trong hệ thống. Vui lòng kiểm tra lại Token hoặc dữ liệu seed.`);
  }

  // Log để debug xem data truyền vào có đúng không
  console.log("--- DEBUG CREATE INVOICE ---");
  console.log("NhanVienLap:", data.NhanVienLap);
  console.log("MaChiNhanh (NV):", checkStaffResult.recordset[0].MaChiNhanh);
  console.log("Data Detail Length:", data.details.length);
  // -----------------------------------------------------
  
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // 1. Insert Header HoaDon
    // Lưu ý: MaHoaDon được sinh tự động bởi Trigger TRG_AUTO_MaHoaDon
    // Trigger này là INSTEAD OF INSERT, nên việc lấy ID trả về hơi phức tạp (SCOPE_IDENTITY không chạy).
    // Vậy nên tui sẽ insert, sau đó query lấy MaHoaDon mới nhất của User này tại thời điểm này.
    
    const requestHeader = new sql.Request(transaction);
    const insertResult= await requestHeader // Lưu kết quả vào inserResult để tiện debug
      .input('MaKhachHang', sql.Char(7), data.MaKhachHang)
      .input('NgayLap', sql.Date, data.NgayLap)
      .input('HinhThucThanhToan', sql.NVarChar(20), data.HinhThucThanhToan)
      .input('NhanVienLap', sql.Char(5), data.NhanVienLap)
      .query(`
        INSERT INTO HoaDon (MaKhachHang, NgayLap, HinhThucThanhToan, NhanVienLap)
        VALUES (@MaKhachHang, @NgayLap, @HinhThucThanhToan, @NhanVienLap)
      `);
    // --- KHẮC PHỤC: Kiểm tra xem có dòng nào được insert không ---
    // Vì dùng Trigger INSTEAD OF, rowsAffected trả về mảng [số dòng trigger tác động, số dòng insert thật...]
    // Ta kiểm tra tổng thể, nếu tất cả là 0 nghĩa là insert thất bại.
    if (!insertResult.rowsAffected || insertResult.rowsAffected.every(count => count === 0)) {
        throw new Error(`Không thể tạo hóa đơn. Kiểm tra lại mã nhân viên lập: ${data.NhanVienLap} có tồn tại và thuộc chi nhánh hợp lệ không?`);
    }
    // Lấy MaHoaDon vừa tạo. Do Trigger INSTEAD OF, phải tìm record mới nhất.
    // Cách an toàn nhất trong context này là select TOP 1 theo NhanVienLap vừa insert.
    const getIdReq = new sql.Request(transaction);
    const idResult = await getIdReq
      .input('NhanVienLap', sql.Char(5), data.NhanVienLap)
      .query(`
        SELECT TOP 1 MaHoaDon 
        FROM HoaDon 
        WHERE NhanVienLap = @NhanVienLap 
        ORDER BY CAST(SUBSTRING(MaHoaDon, 3, 6) AS INT) DESC
      `);
    
    const maHoaDon = idResult.recordset[0]?.MaHoaDon;
    if (!maHoaDon) throw new Error('Lỗi không lấy được mã hóa đơn vừa tạo');

    // 2. Loop insert Details (CTHD + SubTable)
    // Trigger TRG_AUTO_STT_CTHD sẽ tự sinh STT, ta không cần truyền STT
    // Tuy nhiên, để insert vào bảng con (MuaHang, KhamBenh...), ta CẦN STT.
    // => Ta phải tự quản lý STT trong code JS để đảm bảo tính đồng bộ (vì Transaction chưa commit, trigger chưa chắc đã chạy xong để ta select lại).
    // => QUYẾT ĐỊNH: Ta sẽ TỰ TÍNH STT trong JS và Insert thủ công vào CTHD (Trigger DB nên sửa lại để handle trường hợp có STT truyền vào, hoặc ta insert bảng con dựa trên logic STT = Loop Index + 1).
    
    // *Dựa trên Trigger TRG_AUTO_STT_CTHD trong DB schema: Nó là INSTEAD OF INSERT. Nó sẽ tự tính toán và Insert.*
    // *Điều này CỰC KỲ KHÓ cho Transaction bên ngoài vì ta không biết STT là bao nhiêu để insert vào CTHD_MuaHang.*
    // --> GIẢI PHÁP: Insert từng dòng CTHD, sau đó Select lại lấy Max STT để insert vào bảng con.
    
    for (const item of data.details) {
      // 2a. Insert CTHD gốc
      const reqCTHD = new sql.Request(transaction);
      await reqCTHD
        .input('MaHoaDon', sql.Char(8), maHoaDon)
        .input('LoaiDichVu', sql.NVarChar(20), item.LoaiDichVu)
        .query(`
          INSERT INTO CTHD (MaHoaDon, LoaiDichVu) VALUES (@MaHoaDon, @LoaiDichVu)
        `);

      // 2b. Lấy STT vừa sinh ra (Trong cùng transaction)
      const reqGetSTT = new sql.Request(transaction);
      const sttResult = await reqGetSTT
        .input('MaHoaDon', sql.Char(8), maHoaDon)
        .query(`SELECT MAX(STT) as NewSTT FROM CTHD WHERE MaHoaDon = @MaHoaDon`);
      const currentSTT = sttResult.recordset[0].NewSTT;

      // 2c. Insert vào bảng con tương ứng
      if (item.LoaiDichVu === TYPE_MUA_HANG) {
        const reqSub = new sql.Request(transaction);
        await reqSub
          .input('MaHoaDon', sql.Char(8), maHoaDon)
          .input('STT', sql.Int, currentSTT)
          .input('MaSanPham', sql.Char(5), item.MaSanPham)
          .input('SoLuong', sql.Int, item.SoLuong)
          .query(`
            INSERT INTO CTHD_MuaHang (MaHoaDon, STT, MaSanPham, SoLuong)
            VALUES (@MaHoaDon, @STT, @MaSanPham, @SoLuong)
          `);
      } 
      //MEDICAL: 'Khám bệnh', VACCINATION: 'Tiêm phòng'
      else if (item.LoaiDichVu === SERVICE_TYPES.MEDICAL || item.LoaiDichVu === SERVICE_TYPES.VACCINATION) {
        // Cả 2 cái này đều cần vào CTHD_DVSucKhoe trước
        const reqHealth = new sql.Request(transaction);
        await reqHealth
          .input('MaHoaDon', sql.Char(8), maHoaDon)
          .input('STT', sql.Int, currentSTT)
          .input('MaKhachHang', sql.Char(7), data.MaKhachHang) // KH của HĐ
          .input('MaThuCung', sql.Int, item.MaThuCung)
          .input('BacSi', sql.Char(5), item.BacSi)
          .input('LoaiDichVuSK', sql.NVarChar(20), item.LoaiDichVu)
          .query(`
            INSERT INTO CTHD_DVSucKhoe (MaHoaDon, STT, MaKhachHang, MaThuCung, BacSi, LoaiDichVuSK)
            VALUES (@MaHoaDon, @STT, @MaKhachHang, @MaThuCung, @BacSi, @LoaiDichVuSK)
          `);

        // Sau đó vào bảng chi tiết hơn
        if (item.LoaiDichVu === SERVICE_TYPES.MEDICAL) {
           const reqKham = new sql.Request(transaction);
           await reqKham
             .input('MaHoaDon', sql.Char(8), maHoaDon)
             .input('STT', sql.Int, currentSTT)
             .input('TrieuChung', sql.NVarChar(50), item.TrieuChung)
             .input('ChanDoan', sql.NVarChar(50), item.ChanDoan || null)
             .input('ToaThuoc', sql.NVarChar(30), item.ToaThuoc || null)
             .input('NgayTaiKham', sql.Date, item.NgayTaiKham || null)
             .query(`
               INSERT INTO CTHD_KhamBenh (MaHoaDon, STT, TrieuChung, ChanDoan, ToaThuoc, NgayTaiKham)
               VALUES (@MaHoaDon, @STT, @TrieuChung, @ChanDoan, @ToaThuoc, @NgayTaiKham)
             `);
        } 
        else if (item.LoaiDichVu === SERVICE_TYPES.VACCINATION) {
           const reqTiem = new sql.Request(transaction);
           await reqTiem
             .input('MaHoaDon', sql.Char(8), maHoaDon)
             .input('STT', sql.Int, currentSTT)
             .input('MaVacXin', sql.Char(4), item.MaVacXin)
             .input('MaGoiDK', sql.Char(6), item.MaGoiDK || null)
             .query(`
               INSERT INTO CTHD_TiemPhong (MaHoaDon, STT, MaVacXin, MaGoiDK)
               VALUES (@MaHoaDon, @STT, @MaVacXin, @MaGoiDK)
             `);
        }
      }
    }

    await transaction.commit();
    return maHoaDon;

  } catch (err) {
    await transaction.rollback();
    // Log lỗi chi tiết để debug vì logic transaction phức tạp
    console.error("Transaction Error in createInvoice:", err);
    throw err;
  }
};

const getInvoiceById = async (id) => {
  const pool = await poolPromise;
  // Query này khá dài vì phải JOIN hết các bảng để lấy full chi tiết
  // Ta lấy Header + List Details
  const headerResult = await pool.request()
    .input('Id', sql.Char(8), id)
    .query(`
      SELECT HD.*, KH.HoTen as TenKhachHang, NV.HoTen as TenNhanVien, CN.TenChiNhanh
      FROM HoaDon HD
      LEFT JOIN KhachHang KH ON HD.MaKhachHang = KH.MaKhachHang
      LEFT JOIN NhanVien NV ON HD.NhanVienLap = NV.MaNhanVien
      LEFT JOIN ChiNhanh CN ON HD.MaChiNhanh = CN.MaChiNhanh
      WHERE HD.MaHoaDon = @Id
    `);
    
  if (headerResult.recordset.length === 0) return null;

  // Lấy chi tiết (union hoặc query riêng lẻ). Ở đây query riêng lẻ cho dễ mapping
  const detailsResult = await pool.request()
    .input('Id', sql.Char(8), id)
    .query(`
      SELECT C.*, 
        MH.MaSanPham, MH.SoLuong, SP.TenSanPham,
        SK.MaThuCung, TC.TenThuCung, SK.BacSi, BS.HoTen as TenBacSi,
        KB.TrieuChung, KB.ChanDoan,
        TP.MaVacXin, VX.TenVacXin
      FROM CTHD C
      LEFT JOIN CTHD_MuaHang MH ON C.MaHoaDon = MH.MaHoaDon AND C.STT = MH.STT
      LEFT JOIN SanPham SP ON MH.MaSanPham = SP.MaSanPham
      LEFT JOIN CTHD_DVSucKhoe SK ON C.MaHoaDon = SK.MaHoaDon AND C.STT = SK.STT
      LEFT JOIN ThuCung TC ON SK.MaKhachHang = TC.MaKhachHang AND SK.MaThuCung = TC.MaThuCung
      LEFT JOIN NhanVien BS ON SK.BacSi = BS.MaNhanVien
      LEFT JOIN CTHD_KhamBenh KB ON C.MaHoaDon = KB.MaHoaDon AND C.STT = KB.STT
      LEFT JOIN CTHD_TiemPhong TP ON C.MaHoaDon = TP.MaHoaDon AND C.STT = TP.STT
      LEFT JOIN VacXin VX ON TP.MaVacXin = VX.MaVacXin
      WHERE C.MaHoaDon = @Id
      ORDER BY C.STT
    `);

  return {
    ...headerResult.recordset[0],
    details: detailsResult.recordset
  };
};

const getAll = async (filters) => {
  const pool = await poolPromise;
  // Implement dynamic SQL for filtering if needed
  // Demo simple getAll
  const result = await pool.request().query(`
    SELECT HD.*, KH.HoTen as TenKhachHang
    FROM HoaDon HD
    JOIN KhachHang KH ON HD.MaKhachHang = KH.MaKhachHang
    ORDER BY HD.NgayLap DESC
  `);
  return result.recordset;
};

const getByCustomerId = async (customerId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('CustomerId', sql.Char(7), customerId)
    .query(`
      SELECT * FROM HoaDon WHERE MaKhachHang = @CustomerId ORDER BY NgayLap DESC
    `);
  return result.recordset;
};

const update = async (id, data) => {
  const pool = await poolPromise;
  // Chỉ update 3 trường theo yêu cầu
  const result = await pool.request()
    .input('Id', sql.Char(8), id)
    .input('NgayLap', sql.Date, data.NgayLap)
    .input('HinhThuc', sql.NVarChar(20), data.HinhThucThanhToan) // Thực chất chỉ đc cập nhật HinhThucThanhToan - Nhật Anh đã nói vậy
    .input('NhanVien', sql.Char(5), data.NhanVienLap)
    .query(`
      UPDATE HoaDon
      SET 
        NgayLap = ISNULL(@NgayLap, NgayLap),
        HinhThucThanhToan = ISNULL(@HinhThuc, HinhThucThanhToan),
        NhanVienLap = ISNULL(@NhanVien, NhanVienLap)
      WHERE MaHoaDon = @Id
    `);
    if (result.rowsAffected[0] === 0) {
     throw new Error('Hóa đơn không tồn tại hoặc không có thay đổi');
  }
  return { success: true, rowsAffected: result.rowsAffected[0] };
};

//QUAN TRỌNG: Hàm này c Yến không cần quan tâm để làm index nha, tui chỉ tạo ra để xài khi cần thôi -- chứ nó ko đc dùng đến trong web
const remove = async (id) => {
  const pool = await poolPromise;
  // Trigger TRG_DeleteHoaDon_NoCTHD sẽ hoạt động khi xóa hết CTHD
  // Tuy nhiên, ta có thể xóa thẳng HoaDon nếu không có constraint FK chặn ngược lại (thường là có ON DELETE CASCADE ở bảng con CTHD_...)
  // Trong DB: CTHD_MuaHang FK cascade delete theo CTHD. Nhưng CTHD có cascade theo HoaDon không?
  // CTHD referencing HoaDon: "REFERENCES HoaDon(MaHoaDon)". Không thấy ON DELETE CASCADE ở bảng CTHD.
  // => Phải xóa CTHD trước, sau đó xóa HoaDon.
  // Nhưng Trigger TRG_DeleteHoaDon_NoCTHD nói: "Khi tất cả CTHD bị xóa... tự động xóa luôn hóa đơn".
  // => Vậy logic là: Xóa tất cả CTHD của hóa đơn đó.
  
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    
    // Xóa CTHD, trigger DB sẽ tự động xóa HoaDon khi CTHD cuối cùng bị xóa
    await new sql.Request(transaction)
      .input('Id', sql.Char(8), id)
      .query(`DELETE FROM CTHD WHERE MaHoaDon = @Id`);
      
    await transaction.commit();
    return { success: true, message: 'Deleted invoice successfully' };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

module.exports = {
  createInvoiceTransaction,
  getInvoiceById,
  getAll,
  getByCustomerId,
  update,
  remove
};