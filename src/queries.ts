import  db from './db/connection';

// Add a new department
export const addDepartment = async (departmentName: string) => {
  const query = 'INSERT INTO department (department_name) VALUES ($1)';
  await db.query(query, [departmentName]);
};

// Add a new role
export const addRole = async (roleName: string, departmentName: string, salary: string) => {
  const query = 'INSERT INTO role (title, department_id, salary) VALUES ($1, (SELECT id FROM department WHERE department_name = $2), $3)';
  await db.query(query, [roleName, departmentName, salary]);
};

// Add a new employee
export const addEmployee = async (firstName: string, lastName: string, role: string, manager: string) => {
  const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, (SELECT id FROM role WHERE title = $3), (SELECT id FROM employee WHERE first_name = $4 AND last_name = $5))';
  await db.query(query, [firstName, lastName, role, manager]);
};

// Update employee role
export const updateEmployeeRole = async (employeeId: string, newRoleId: string) => {
  const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
  await db.query(query, [newRoleId, employeeId]);
};
