SELECT e.first_name, e.last_name, title, d.name, concat("$",FORMAT(salary,0)) as salary, IF(m.first_name is NULL, "", concat(m.first_name, " ", m.last_name)) as manager 
  FROM employees as e
  LEFT JOIN employees as m on e.manager_id=m.id
  JOIN roles as r on e.role_id = r.id
  JOIN departments as d on r.department_id=d.id;