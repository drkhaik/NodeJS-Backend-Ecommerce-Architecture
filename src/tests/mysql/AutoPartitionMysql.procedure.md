CREATE DEFINER=`root`@`%` PROCEDURE `create_table_auto_month`()
BEGIN
    -- Dùng để ghi lại tháng tiếp theo dài bao nhiêu
    DECLARE nextMonth varchar(20);
    -- Câu lệnh SQL dùng để ghi lại việc tạo bảng
    DECLARE createTableSQL varchar(5210);
    -- Sau khi thực hiện câu lệnh SQL tạo bảng, lấy số lượng bảng
    DECLARE tableCount int;
    -- Dùng để ghi tên bảng cần tạo
    DECLARE tableName varchar(20);
    -- Tiền tố được sử dụng cho bảng ghi
    DECLARE table_prefix varchar(20);

  -- Lấy ngày của tháng tiếp theo và gán nó cho biến nextMonth
  SELECT SUBSTR(
    replace(
        DATE_ADD(CURDATE(), INTERVAL 1 MONTH),
    '-', ''),
  1, 6) INTO @nextMonth;

  -- Đặt giá trị biến tiền tố bảng thành like this
  set @table_prefix = 'orders_';

  -- Xác định tên bảng = tiền tố bảng + tháng, tức là orders_202310, orders_202311 Định dạng này
  SET @tableName = CONCAT(@table_prefix, @nextMonth);
  -- Xác định câu lệnh SQL để tạo bảng
  set @createTableSQL=concat("create table if not exists ",@tableName,"
(
order_id INT, -- id hoá đơn
order_date DATE NOT NULL,
total_amount DECIMAL(10, 2),
PRIMARY KEY (order_id, order_date)
)");
 
  -- Sử dụng từ khóa PREPARE để tạo phần thân SQL được chuẩn bị sẵn sàng để thực thi
  PREPARE create_stmt from @createTableSQL;
  -- Sử dụng từ khóa EXECUTE để thực thi phần thân SQL đã chuẩn bị ở trên：create_stmt
  EXECUTE create_stmt;
  -- Giải phóng phần thân SQL đã tạo trước đó (giảm mức sử dụng bộ nhớ)
  DEALLOCATE PREPARE create_stmt;

  -- Sau khi thực hiện câu lệnh tạo bảng, hãy truy vấn số lượng bảng và lưu nó vào biến tableCount.
  SELECT
    COUNT(1) INTO @tableCount
  FROM
    information_schema.`TABLES`
  WHERE TABLE_NAME = @tableName;
 
  -- Kiểm tra xem bảng tương ứng đã tồn tại chưa
  SELECT @tableCount 'tableCount';

END