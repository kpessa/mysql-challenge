const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const cTable = require('console.table');
// IMPORT DATA
const password = require('./config');
// IMPORT UTILS
const displayHeader = require('./assets/utils/displayHeader');
// IMPORT CRUD OPERATIONS
const { viewAllEmployees, addAnEmployee, deleteEmployee, updateRole, updateManager, viewAllEmployeesByManager, viewAllEmployeesByDepartment } = require('./assets/db/EmployeeCRUD');
const { viewAllDepartments, addADepartment, deleteDepartment } = require('./assets/db/DepartmentCRUD');
const { viewAllRoles, addARole, deleteRole, viewBudgetByDepartment } = require('./assets/db/RoleCRUD');

const connectToDatabase = async () => {
  // create the connection to database
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password,
    database: 'employee_manager',
  });
  return connection;
};

async function main() {
  console.clear();

  const connection = await connectToDatabase();

  displayHeader('EMPLOYEE DATABASE MANAGER');

  let choice;
  // MAIN EVENT LOOP
  do {
    try {
      let answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'What would you like to do?',
          choices: [
            new inquirer.Separator(),
            'View All Departments',
            'View All Roles',
            'View All Employees',
            new inquirer.Separator(),
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            new inquirer.Separator(),
            'Delete a Department',
            'Delete a Role',
            'Delete an Employee',
            new inquirer.Separator(),
            'Update Employee Role',
            'Update Employee Manager',
            new inquirer.Separator(),
            'View All Employees By Manager',
            'View All Employees By Department',
            'View Budget by Department',
            new inquirer.Separator(),
            'Initialize Database',
            'Quit',
          ],
          pageSize: 23,
        },
      ]);
      choice = answers.choice;

      // prettier-ignore
      switch (choice) { 
        //! DEPARTMENTS CRUD
        case 'View All Departments': await viewAllDepartments(connection); break;
        case 'Add a Department': await addADepartment(connection); break;
        case 'Delete a Department': await deleteDepartment(connection); break;
        //! ROLES CRUD
        case 'View All Roles': await viewAllRoles(connection); break;
        case 'Add a Role': await addARole(connection); break;
        case 'Delete a Role': await deleteRole(connection); break;
        //! EMPLOYEES CRUD
        case 'View All Employees': await viewAllEmployees(connection); break;
        case 'Add an Employee': await addAnEmployee(connection); break;
        case 'Delete an Employee': await deleteEmployee(connection); break;
        case 'Update Employee Role': await updateRole(connection); break;
        case 'Update Employee Manager': await updateManager(connection); break;
        //! BONUS
        case 'View All Employees By Manager': await viewAllEmployeesByManager(connection); break;
        case 'View All Employees By Department': await viewAllEmployeesByDepartment(connection); break;
        case 'View Budget by Department': await viewBudgetByDepartment(connection); break;
        //! BONUS
        case 'Initialize Database': await initializeDatabase(connection); break;
      } // prettier-ignore
    } catch (err) {
      console.log(err);
    }
  } while (choice != 'Quit');

  connection.end();
}

main();
