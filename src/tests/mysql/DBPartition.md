CREATE TABLE orders (
	order_id INT,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2),
	PRIMARY KEY (order_id, order_date)
)

partition by RANGE COLUMNS (order_date)(
	partition p0 values less than ('2022-01-01'),
	partition p2023 values less than ('2023-01-01'),
    partition p2024 values less than ('2024-01-01'),
    partition pmax values less than (MAXVALUE)
);

-- select data
explain select * from orders;

-- insert data
insert into orders (order_id, order_date, total_amount) values (1, '2021-10-10',100.99);
insert into orders (order_id, order_date, total_amount) values (1, '2022-10-10',100.99);
insert into orders (order_id, order_date, total_amount) values (1, '2023-10-10',100.99);
insert into orders (order_id, order_date, total_amount) values (1, '2024-10-10',100.99);

-- select by range
explain select * from orders partition (p2023);

-- select by range
explain select * from orders where order_date >= '2022-01-01' and order_date <= '2025-01-01';

