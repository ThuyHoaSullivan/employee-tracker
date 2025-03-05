import pool from './connection';

// Function to get all employees
export const getAllEmployees = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id, e.first_name, e.last_name, r.title AS role, r.salary, d.name AS department 
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
    `);
    return result.rows;
  } catch (err) {
    console.error('Error fetching employees:', err);
  }
};

// Function to get all departments
export const getAllDepartments = async () => {
  try {
    const result = await pool.query('SELECT * FROM department');
    return result.rows;
  } catch (err) {
    console.error('Error fetching departments:', err);
  }
};

// Function to get all roles
export const getAllRoles = async () => {
  try {
    const result = await pool.query('SELECT * FROM role');
    return result.rows;
  } catch (err) {
    console.error('Error fetching roles:', err);
  }
};
