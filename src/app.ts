import inquirer from 'inquirer';
import { Client } from 'pg';
import dotenv from 'dotenv';
import { mainMenu } from './prompts';
import { MainMenuAnswer } from './types';

// Load environment variables
dotenv.config();

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
};

// Function to view all departments
async function viewAllDepartments() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM department');
    console.table(result.rows); // Display the results in a table format
  } catch (error) {
    console.error('Error fetching departments:', error);
  } finally {
    await client.end();
  }
}

// Function to view all roles
async function viewAllRoles() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    const result = await client.query(`
      SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      LEFT JOIN department ON role.department_id = department.id
    `);
    console.table(result.rows); // Display the results in a table format
  } catch (error) {
    console.error('Error fetching roles:', error);
  } finally {
    await client.end();
  }
}

// Function to view all employees
async function viewAllEmployees() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    const result = await client.query(`
      SELECT 
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title AS job_title,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    `);
    console.table(result.rows); // Display the results in a table format
  } catch (error) {
    console.error('Error fetching employees:', error);
  } finally {
    await client.end();
  }
}

// Function to add a department
async function addDepartment() {
  const client = new Client(dbConfig);

  try {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
      },
    ]);

    await client.connect();
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Department "${name}" added successfully!`);
  } catch (error) {
    console.error('Error adding department:', error);
  } finally {
    await client.end();
  }
}

// Function to add a role
async function addRole() {
  const client = new Client(dbConfig);

  try {
    // Fetch departments for the user to choose from
    await client.connect();
    const departments = await client.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map((dept) => ({
      name: dept.name,
      value: dept.id,
    }));

    const { title, salary, department_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department for the role:',
        choices: departmentChoices,
      },
    ]);

    await client.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
      [title, salary, department_id]
    );
    console.log(`Role "${title}" added successfully!`);
  } catch (error) {
    console.error('Error adding role:', error);
  } finally {
    await client.end();
  }
}

// Function to add an employee
async function addEmployee() {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    // Fetch roles for the user to choose from
    const roles = await client.query('SELECT * FROM role');
    const roleChoices = roles.rows.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    // Fetch employees for the user to choose as a manager
    const employees = await client.query('SELECT * FROM employee');
    const managerChoices = employees.rows.map((emp) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));
    managerChoices.unshift({ name: 'None', value: null }); // Add "None" option for no manager

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the employee\'s first name:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the employee\'s last name:',
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the employee\'s role:',
        choices: roleChoices,
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the employee\'s manager:',
        choices: managerChoices,
      },
    ]);

    await client.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, role_id, manager_id]
    );
    console.log(`Employee "${first_name} ${last_name}" added successfully!`);
  } catch (error) {
    console.error('Error adding employee:', error);
  } finally {
    await client.end();
  }
}

// Function to update an employee's role
async function updateEmployeeRole() {
  const client = new Client(dbConfig);

  try {
    await client.connect();

    // Fetch employees for the user to choose from
    const employees = await client.query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map((emp) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));

    // Fetch roles for the user to choose from
    const roles = await client.query('SELECT * FROM role');
    const roleChoices = roles.rows.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const { employee_id, role_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: employeeChoices,
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role for the employee:',
        choices: roleChoices,
      },
    ]);

    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Employee role updated successfully!');
  } catch (error) {
    console.error('Error updating employee role:', error);
  } finally {
    await client.end();
  }
}

// Main application logic
async function main() {
  const answers = await inquirer.prompt<MainMenuAnswer>(mainMenu);
  const { action } = answers;

  console.log(`You selected: ${action}`);
  try {
    switch (action) {
      case 'View All Departments':
        await viewAllDepartments();
        break;
      case 'View All Roles':
        await viewAllRoles();
        break;
      case 'View All Employees':
        await viewAllEmployees();
        break;
      case 'Add Department':
        await addDepartment();
        break;
      case 'Add Role':
        await addRole();
        break;
      case 'Add Employee':
        await addEmployee();
        break;
      case 'Update Employee Role':
        await updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Exiting...');
        process.exit();
        return; // Exit the function to stop the loop
      default:
        console.log('Invalid action!');
        break;
    }
  } catch (error) {
    console.error('Error during prompt:', error);
  }

  // Recursively call main to show the menu again
  main();
}

// Run the application
main().catch(console.error);