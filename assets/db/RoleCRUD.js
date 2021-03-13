const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const cTable = require('console.table');
const colors = require('colors');
const displayHeader = require('../utils/displayHeader');

//! --------------------------------
//!  1.) SELECT * FROM roles
//! --------------------------------
async function viewAllRoles(connection) {
  let rows = await connection.execute('SELECT id, title, concat("$", FORMAT(salary,0)) as salary, department_id FROM roles;');
  displayHeader('ROLES DATABASE');
  if (!rows[0].length) {
    console.log('   roles database is empty!'.red + '\n');
  } else {
    console.table(rows[0]);
  }
}

//! --------------------------------
//!  2.) INSERT INTO roles (...)
//!      VALUES (...)
//! --------------------------------
async function addARole(connection) {
  let rows = await connection.execute('SELECT * FROM departments;');
  let departments = rows[0].map(({ id, name }) => `ID#${id} - ${name}`);
  if (!departments.length) {
    console.log('You must first add a department!'.red);
    return;
  }
  answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'department',
      message: 'Which department does the job role land under?',
      choices: departments,
    },
    {
      type: 'input',
      name: 'title',
      message: 'What is the job title of the role?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'And the salary for the role?',
    },
  ]);
  let { department, title, salary } = answers;

  let d_id = department.match(/ID#(\d+)/)[1];
  connection.execute(`INSERT INTO roles (title, department_id, salary) VALUES (?,?,?);`, [title, d_id, salary]);
  console.log(
    '\n> ' + `${title} `.magenta + 'successfully'.green + ` added under ` + `${department.match(/- (.*)$/)[1]}`.brightWhite + ` with salary ` + `${salary}`.brightWhite + ` to roles database\n`
  );
}

//! --------------------------------
//!  3.) DELETE FROM roles
//!      WHERE ..
//! --------------------------------
async function deleteRole(connection) {
  let roles = (await connection.execute('SELECT * FROM roles;'))[0].map(d => `ID#${d.id} - ${d.title}`);
  answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'role',
      choices: roles,
    },
  ]);
  let { role } = answers;
  let id = role.match(/ID#(\d+)/)[1];
  await connection.execute('DELETE FROM roles WHERE id = ?;', [id]);
  console.log(`\n${role} `.magenta + 'successfully '.green + 'deleted'.red + ' from roles database.\n');
}

// //! --------------------------------
// //!  4.) BUDGET BY DEPARTMENT
// //! --------------------------------
async function viewBudgetByDepartment(connection) {
  let rows = await connection.execute(`
  SELECT d.id, d.name as department, concat("$", FORMAT(SUM(salary),0)) as budget FROM roles as r
JOIN departments as d on d.id = r.department_id
GROUP BY d.name;`);
  displayHeader('BUDGET BY DEPARTMENT');
  if (!rows[0].length) {
    console.log('   employees database is empty!\n'.red);
  } else {
    console.table(rows[0]);
  }
}

let crud = { viewAllRoles, addARole, deleteRole, viewBudgetByDepartment };
module.exports = crud;
