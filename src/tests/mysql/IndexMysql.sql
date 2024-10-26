CREATE TABLE `users` (
	`user_id` int NOT NULL AUTO_INCREMENT,
    `user_age` INT DEFAULT '0',
    `user_status` INT DEFAULT '0',
    `user_name` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL, -- so sánh dựa trên giá trị nhị phân của chuỗi, phân biệt chữ hoa chữ thường
    `user_email` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL,
    `user_address` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL,
    -- KEY INDEX
    PRIMARY KEY (`user_id`),
    KEY `idx_email_age_name` (`user_email`, `user_age`, `user_name`),
    KEY `idx_status` (`user_status`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_bin;

-- insert user (messi, ronaldo, drkhaik)
INSERT INTO `users` (`user_id`,`user_age`, `user_status`, `user_name`, `user_email`, `user_address`) 
VALUES (1, 39, 1, 'Messi', 'messi@example.com', '123 Phố A, Quận 1');

INSERT INTO `users` (`user_id`,`user_age`, `user_status`, `user_name`, `user_email`, `user_address`) 
VALUES (2, 41, 1, 'Ronaldo', 'ronaldo@example.com', '456 Phố B, Quận 2');

INSERT INTO `users` (`user_id`,`user_age`, `user_status`, `user_name`, `user_email`, `user_address`) 
VALUES (3, 24, 1, 'Drkhaik', 'drkhaik@example.com', '789 Phố C, Quận 3');

-- anonystick@gmail.com
select version();

explain select * from users where user_id = 1;

-- index = idx_email_age_name
explain select * from users where user_email = 'messi@example.com';  -- key = idx_email_age_name
explain select * from users where user_email = 'messi@example.com' and user_age = 39;  -- key = idx_email_age_name
explain select * from users where user_email = 'messi@example.com' and user_age = 39 and user_name = "Messi";  -- key = idx_email_age_name

explain select * from users where user_age = 39; -- key = null
explain select * from users where user_age = 39 and user_name = "Messi"; -- key = null

-- ko nen su dung select * va nen su dung email hay trường bên trái ngoài cùng để lấy index
-- select *
-- nen truy van cac cot co index vi cac cot đánh index sẽ đc truy vấn nhanh hơn các cột ko đc đánh index
explain select user_email, user_name from users where user_name = "Messi"; -- key = idx_email_age_name
explain select user_address from users where user_name = "Messi"; -- key = null

-- không tính toán trên khoá chính của mình
explain select * from users where user_id+1=2;


-- index = idx_status
explain select * from users where user_status = 1; -- key = idx_status
explain select * from users where substr(user_status, 1, 4) = 1;  -- key = null
explain select * from users where user_status = '1'; -- key = idx_status


-- LIKE %
-- giống như từ điển, sắp xếp các tiền tố hay các chỉ mục thường nằm bên trái, vậy nên sử dụng like cũng nên để các từ mẫu bên trái và % tìm các từ còn lại
explain select * from users where user_email like 'messi@%'; -- key = idx_email_age_name
explain select * from users where user_email like '%messi@%'; -- key = null

-- OR
explain select * from users where user_id = 2 and user_status = 1; -- key = Primary
explain select * from users where user_id = 2 OR user_status = 1; -- key = Primary, idx_status
explain select * from users where user_id = 2 or user_status = 1 or user_address = 'abc'; -- key = Primary, idx_status


