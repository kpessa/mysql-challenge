const fs = require('fs');

const setupDatabases = async connection => {
  //! ------------------------------
  //!      1.) SCHEMA SETUP
  //! ------------------------------
  connection.execute(`SET FOREIGN_KEY_CHECKS = 0;`);
  connection.execute(`DROP TABLE departments;`);
  connection.execute(`DROP TABLE roles;`);
  connection.execute(`DROP TABLE employees;`);
  connection.execute(`SET FOREIGN_KEY_CHECKS = 1;`);
  connection.execute(`
  CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR (30)
);`);

  connection.execute(`
  CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR (30),
    salary DECIMAL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments (id)
);
`);

  connection.execute(`
  CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR (30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles (id),
    FOREIGN KEY (manager_id) REFERENCES employees (id)
);`);

  //! ------------------------------
  //!      2.) SEED SETUP
  //! ------------------------------
  connection.execute(`INSERT INTO departments VALUES (1,'Sales'),(2,'Engineering'),(3,'Legal');`);
  connection.execute(`
  INSERT INTO roles VALUES
(1,'Sales Lead', 100000,1),
(2,'Sales Person', 80000,1),
(3,'Lead Engineer', 150000,2),
(4,'Software Engineer', 120000,2);`);
  connection.execute(`
  INSERT INTO employees VALUES 
(1,'John','Doe', 1, NULL),
(2,'Mike','Chan', 2, 1),
(3,'Ashley','Rodriguez', 3, NULL),
(4,'Kevin','Tupik', 4, 3);`);
  connection.execute(`
  UPDATE employees SET manager_id = 3 WHERE id = 1;`);
};
module.exports = setupDatabases;
