const fs = require('fs');

const setupDatabases = async connection => {
  let createDepartments = fs.readFileSync('./assets/db/schema/createDepartments.sql', { encoding: 'utf8' });
  let createRoles = fs.readFileSync('./assets/db/schema/createRoles.sql', { encoding: 'utf8' });
  let createEmployees = fs.readFileSync('./assets/db/schema/createEmployees.sql', { encoding: 'utf8' });

  connection.execute(createDepartments);
  connection.execute(createRoles);
  connection.execute(createEmployees);
};
module.exports = setupDatabases;
