-- Insert departments (only if they don't already exist)
INSERT INTO department (name)
SELECT 'Engineering'
WHERE NOT EXISTS (SELECT 1 FROM department WHERE name = 'Engineering');

INSERT INTO department (name)
SELECT 'HR'
WHERE NOT EXISTS (SELECT 1 FROM department WHERE name = 'HR');

INSERT INTO department (name)
SELECT 'Finance'
WHERE NOT EXISTS (SELECT 1 FROM department WHERE name = 'Finance');

INSERT INTO department (name)
SELECT 'Marketing'
WHERE NOT EXISTS (SELECT 1 FROM department WHERE name = 'Marketing');

INSERT INTO department (name)
SELECT 'Sales'
WHERE NOT EXISTS (SELECT 1 FROM department WHERE name = 'Sales');

-- Insert roles
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 80000, 1),
       ('Senior Software Engineer', 100000, 1),
       ('HR Manager', 75000, 2),
       ('Accountant', 70000, 3),
       ('Marketing Specialist', 60000, 4),
       ('Sales Representative', 50000, 5);

-- Insert employees (managers first)
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL), -- John Doe is a manager
       ('Jane', 'Smith', 2, 1),  -- Jane Smith reports to John Doe
       ('Alice', 'Johnson', 3, NULL), -- Alice Johnson is a manager
       ('Bob', 'Brown', 4, 3),   -- Bob Brown reports to Alice Johnson
       ('Charlie', 'Davis', 5, NULL); -- Charlie Davis is a manager

-- Insert employees with managers
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Eve', 'White', 6, 5); -- Eve White reports to Charlie Davis

