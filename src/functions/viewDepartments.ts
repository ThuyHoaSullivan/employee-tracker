import pool from '../db/connection';

const viewDepartments = async () => {
  try {
    const res = await pool.query('SELECT * FROM department');  // Use pool instead of client
    if (res.rows.length > 0) {
      console.table(res.rows);
    } else {
      console.log('No departments found.');
    }
  } catch (err) {
    console.error('Error viewing departments:', err);
  }
};

export default viewDepartments;
