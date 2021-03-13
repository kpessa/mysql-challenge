SELECT r.id, r.title, concat("$", FORMAT(r.salary,0)) as salary, d.name FROM roles as r
JOIN departments as d ON r.department_id = d.id;