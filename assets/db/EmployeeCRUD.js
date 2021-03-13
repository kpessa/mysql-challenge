const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const cTable = require('console.table');
const colors = require('colors');
const displayHeader = require('../utils/displayHeader');

//! --------------------------------
//!  1.) SELECT * FROM employees
//! --------------------------------
async function viewAllEmployees(connection) {
  let rows = await connection.query(`
  SELECT e.first_name, e.last_name, job_title as title, d.name, concat("$",FORMAT(salary,0)) as salary, concat(m.first_name, " ", m.last_name) as manager 
  FROM employees as e
  LEFT JOIN employees as m on e.manager_id=m.id
  JOIN roles as r on e.role_id = r.id
  JOIN departments as d on r.department_id=d.id;`);
  displayHeader('EMPLOYEES DATABASE');
  if (!rows[0].length) {
    console.log('   employees database is empty!\n'.red);
  } else {
    console.table(rows[0]);
  }
}

//! --------------------------------
//!  2.) INSERT INTO employees (...)
//!      VALUES (...)
//! --------------------------------
async function addAnEmployee(connection) {
  let roles = (await connection.execute('SELECT * FROM roles;'))[0].map(d => `ID#${d.id} - ${d.job_title}`);
  if (!roles.length) {
    console.log('You must first add a role!'.red);
    return;
  }

  let managers = (await connection.execute('SELECT first_name, last_name FROM employees;'))[0].map(row => `${row.first_name} ${row.last_name}`);
  managers.unshift('None');

  answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: "What is the employee's first name?",
    },
    {
      type: 'input',
      name: 'last_name',
      message: "What is the employee's last name?",
    },
    {
      type: 'list',
      name: 'role',
      message: `What is the employee's role?`,
      choices: roles,
    },
    {
      type: 'list',
      name: 'manager',
      message: `Who is the employee's manager?`,
      choices: managers,
    },
  ]);
  let { first_name, last_name, role, manager } = answers;
  roleID = role.match(/ID#(\d+)/)[1];
  if ((manager = 'None')) {
    connection.execute(
      `INSERT INTO employees (first_name, last_name, role_id)
    VALUES (?,?,?);`,
      [first_name, last_name, roleID]
    );
  } else {
    console.log(manager);
    connection.execute(
      `
    INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?);`,
      [first_name, last_name, roleID, manager_id]
    );
  }

  console.log(`\n${first_name} ${last_name} `.magenta + 'successfully'.green + ' add to the employees database!\n');
}

//! --------------------------------
//!  3.) DELETE FROM employees
//!      WHERE ID = ?
//! --------------------------------
async function deleteEmployee(connection) {
  let rows = await connection.execute('SELECT id, first_name, last_name FROM employees;');
  let formattedRows = rows[0].map(row => `ID#${row.id} - ${row.first_name} ${row.last_name}`);
  formattedRows.push('Cancel');
  let { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: ' Which employee do you want to remove?',
      choices: formattedRows,
    },
  ]);
  if (choice != 'Cancel') {
    let id = choice.match(/ID#(\d+) -/)[1];
    let name = choice.match(/- (.*)$/)[1];
    await connection.execute('DELETE FROM employees WHERE id = ?', [id]);
    console.log(`\n${name} ` + 'successfully '.green + 'deleted'.red + ' from the database!\n');
  }
}

//! --------------------------------
//!  5.) UPDATE employees
//!      SET role_id = ?
//!      WHERE ID = ?
//! --------------------------------
async function updateRole(connection) {
  let employees = (await connection.query('SELECT e.id, first_name, last_name, job_title FROM employees as e JOIN roles as r on e.role_id = r.id;'))[0].map(
    ({ id, first_name, last_name, job_title }) => `ID#${id} - ${first_name} ${last_name} - ${job_title}`
  );
  employees.push(new inquirer.Separator(), 'Cancel');

  let roles = (await connection.query('SELECT id, job_title FROM roles;'))[0].map(({ id, job_title }) => `ID#${id} - ${job_title}`);
  roles.push(new inquirer.Separator(), 'Cancel');

  let { choice, role } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: `Which employee's role would you like to update?`,
      choices: employees,
    },
    {
      type: 'list',
      name: 'role',
      message: answers => 'What is ' + `${answers.choice.match(/- (.*) -/)[1]}`.brightWhite + "'s new job title?",
      choices: roles,
    },
  ]);
  if (choice != 'Cancel' || role != 'Cancel') {
    let id = choice.match(/ID#(\d+) -/)[1];
    let role_id = role.match(/ID#(\d+) -/)[1];
    let name = choice.match(/- (.*) -/)[1];
    let job_title = role.match(/- (.*)$/)[1];
    await connection.execute('UPDATE employees SET role_id = ? WHERE id = ?', [role_id, id]);
    console.log(`\n${name}`.magenta + `'s role ` + 'successfully'.green + ' updated'.brightWhite + ' to ' + `${job_title}`.magenta + '\n');
  }
}

//! --------------------------------
//!  5.) UPDATE employees
//!      SET manager = ?
//!      WHERE ID = ?
//! --------------------------------
async function updateManager(connection) {
  let employees = (await connection.execute('SELECT id, first_name, last_name, manager_id FROM employees;'))[0].map(
    ({ id, first_name, last_name, manager }) => `ID#${id} - ${first_name} ${last_name} - ${manager}`
  );

  let managers = (await connection.query('SELECT id, first_name, last_name FROM employees'))[0].map(({ id, first_name, last_name }) => `ID#${id} - ${first_name} ${last_name}`);
  managers.push(new inquirer.Separator(), 'Cancel');
  employees.push(new inquirer.Separator(), 'Cancel');
  let { choice, manager } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: ' Which employee employee manager do you want to update?',
      choices: employees,
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Which employee do you want to set as manager for the selected employee?',
      choices: managers,
    },
  ]);
  if (choice != 'Cancel' || manager != 'Cancel') {
    manager_id = manager.match(/ID#(\d+)/)[1];
    let id = choice.match(/ID#(\d+) -/)[1];
    await connection.execute('UPDATE employees SET manager_id = ? WHERE id = ?', [manager_id, id]);
    console.log(`Updated employee's manager`);
  }
}

let crud = { viewAllEmployees, addAnEmployee, deleteEmployee, updateRole, updateManager };
module.exports = crud;
