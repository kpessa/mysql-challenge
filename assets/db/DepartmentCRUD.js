const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const cTable = require('console.table');
const colors = require('colors');
const displayHeader = require('../utils/displayHeader');

//! --------------------------------
//!  1.) SELECT * FROM departments
//! --------------------------------
async function viewAllDepartments(connection) {
  let rows = await connection.execute('SELECT * FROM departments;');
  displayHeader('DEPARTMENTS DATABASE');
  if (!rows[0].length) {
    console.log('   departments database is empty!'.red + '\n');
  } else {
    console.table(rows[0]);
  }
}

//! --------------------------------
//!  2.) INSERT INTO departments (...)
//!      VALUES (...)
//! --------------------------------
async function addADepartment(connection) {
  answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: "What is the department's name?",
    },
  ]);
  let { departmentName } = answers;
  connection.execute(`INSERT INTO departments (name) VALUES (?);`, [departmentName]);
  console.log(`\n${departmentName} `.magenta + 'successfully'.green + ' added to departments database.\n');
}

//! --------------------------------
//!  2.) DELETE FROM departments
//!      WHERE ..
//! --------------------------------
async function deleteDepartment(connection) {
  let departments = (await connection.execute('SELECT * FROM departments;'))[0].map(d => `ID#${d.id} - ${d.name}`);
  answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'department',
      choices: departments,
    },
  ]);
  let { department } = answers;
  let id = department.match(/ID#(\d+)/)[1];
  await connection.execute('DELETE FROM departments WHERE id = ?;', [id]);
  console.log(`\n${department} `.magenta + `successfully `.green + 'DELETED'.red + ` from departments database.\n`);
}

let crud = { viewAllDepartments, addADepartment, deleteDepartment };
module.exports = crud;
