USE employee_manager;

INSERT INTO departments VALUES 
(1,'Sales'),
(2,'Engineering'),
(3,'Legal'),
(4,'Finance');

INSERT INTO roles VALUES
(1,'Sales Lead', 100000,1),
(2,'Sales Person', 80000,1),
(3,'Lead Engineer', 150000,2),
(4,'Software Engineer', 120000,2),
(5,'Accountant',125000,4),
(6,'Legal Team Lead',250000,3),
(7,'Lawyer',190000,3);

INSERT INTO employees VALUES 
(1,'John','Doe', 1, NULL),
(2,'Mike','Chan', 2, 1),
(3,'Ashley','Rodriguez', 3, NULL),
(4,'Kevin','Tupik', 4, 3),
(6,'Malia','Brown',5,NULL),
(7,'Sarah','Lourd',6,NULL),
(8,'Tom','Allen',7,7);

UPDATE employees SET manager_id = 3 WHERE id = 1;
