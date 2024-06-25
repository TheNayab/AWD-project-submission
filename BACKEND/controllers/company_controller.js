const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const mysql = require("mysql2");
const { aiBotsDB } = require("../DB/db.js");
const { v4: uuidv4 } = require("uuid");

// ####### CONNECTION FOR DB FOR NEWLY REGISTERED COMPANY #######

const createCompanyDBConnection = (companyDBName) => {
  return mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: companyDBName,
  });
};

// ####### COMPANY LOGIN API #######

// const company_login = (req, res) => {
//   try {
//     // Input validation using Joi
//     const schema = Joi.object({
//       user_name: Joi.string().required(),
//       password: Joi.string().required(),
//     });

//     const { error } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     const { user_name, password } = req.body;

//     // Check if the company with the given user_name exists
//     aiBotsDB.query('SELECT * FROM users WHERE user_name = ? AND role = "company"', [user_name], (companyErr, companyResults) => {
//       if (companyErr) {
//         console.error('Error checking company:', companyErr);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       const company = companyResults[0];

//       if (!company) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }

//       // Check if the password is correct
//       bcrypt.compare(password, company.password, (compareErr, passwordMatch) => {
//         if (compareErr) {
//           console.error('Error comparing passwords:', compareErr);
//           return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         if (!passwordMatch) {
//           return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         // Generate a JWT token with expiration set to 2 days
//         const expiresIn = 2 * 24 * 60 * 60; // 2 days in seconds
//         const expirationDate = moment().add(expiresIn, 'seconds');
//         const token = jwt.sign(
//           {
//             user_id: company.user_id,
//             email: company.email,
//             user_name: company.user_name,
//             role: company.role,
//           },
//           process.env.JWT_SECRET_COMPANY,
//           { expiresIn }
//         );

//         res.cookie("company_access_token", token, {
//           maxAge: 2 * 24 * 60 * 60 * 1000,
//           secure: true,
//           httpOnly: true,
//       }); // 2 days in milliseconds

//          // Remove sensitive information from the response
//           delete company.password;

//         res.json
//         ({
//             message: 'Login successfull',
//             company:company,
//             company_access_token:token,
//             expires_at: expirationDate.format()

//             });
//       });
//     });
//   } catch (error) {
//     console.error('Error in companyLogin:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const company_login = (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Check if the company with the given user_name exists
    aiBotsDB.query(
      'SELECT * FROM users WHERE (email = ? OR user_name = ?) AND role = "company"',
      [email, email],
      (companyErr, companyResults) => {
        if (companyErr) {
          console.error("Error checking company:", companyErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const company = companyResults[0];

        if (!company) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare passwords using bcrypt
        bcrypt.compare(password, company.password, (bcryptErr, isMatch) => {
          if (bcryptErr) {
            console.error("Error comparing passwords:", bcryptErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (!isMatch) {
            return res.status(401).json({ error: "Invalid Password" });
          }

          // Check if the user is already logged in
          if (company.is_logged_in === 1) {
            // Emit a logout event to all connected clients except the current one
            req.io.emit("logout", { userId: company.user_id });
            // Update the logged_in flag in the users table
            aiBotsDB.query(
              "UPDATE users SET is_logged_in = 0 WHERE user_id = ?",
              [company.user_id],
              (updateErr) => {
                if (updateErr) {
                  console.error("Error updating logged_in flag:", updateErr);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }
                continueLogin(); // Proceed with login after updating the logged-in status
              }
            );
          } else {
            continueLogin(); // Proceed with login if the user is not already logged in
          }

          function continueLogin() {
            // Update the logged_in flag in the users table
            aiBotsDB.query(
              "UPDATE users SET is_logged_in = 1 WHERE user_id = ?",
              [company.user_id],
              (updateErr, updateResult) => {
                if (updateErr) {
                  console.error("Error updating logged_in flag:", updateErr);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                // Generate a JWT token with expiration set to 2 days
                const expiresIn = 2 * 24 * 60 * 60; // 2 days in seconds
                const expirationDate = moment().add(expiresIn, "seconds");

                const token = jwt.sign(
                  {
                    user_id: company.user_id,
                    email: company.email,
                    user_name: company.user_name,
                    name: company.name,
                    role: company.role,
                    phone: company.phone,
                  },
                  process.env.JWT_SECRET_COMPANY,
                  { expiresIn }
                );

                res.cookie("company_access_token", token, {
                  maxAge: 2 * 24 * 60 * 60 * 1000,
                  secure: true,
                  httpOnly: true,
                }); // 2 days in milliseconds

                // Remove sensitive information from the response
                delete company.password;

                res.json({
                  message: "Login successful",
                  company: company,
                  company_access_token: token,
                  expires_at: expirationDate.format(),
                });
              }
            );
          }
        });
      }
    );
  } catch (error) {
    console.error("Error in companyLogin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const company_logout = (req, res) => {
  try {
    res.cookie("company_access_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(201).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    res.status(500).json({
      message: "An unexpected error occur",
    });
  }
};

// ####### ADD EMPLOYEE BY COMPANY API #######
const add_employee_by_company = async (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      company_id: Joi.number().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string(),
      user_name: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { company_id, name, email, phone, user_name, password } = req.body;

    const processedRecipient = phone.startsWith("+") ? phone.slice(1) : phone;
    // Generate unique employee ID using timestamp and random component
    const generateEmployeeId = () => {
      const timestamp = Date.now().toString(); // Timestamp
      const random = Math.floor(Math.random() * 100000); // Random 5-digit number
      return parseInt(timestamp + random); // Convert to integer
    };

    const employee_id = generateEmployeeId();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Retrieve the company's database name from the companies table
    aiBotsDB.query(
      "SELECT company_database FROM users WHERE user_id = ?",
      [company_id],
      (selectErr, selectResults) => {
        if (selectErr) {
          console.error("Error retrieving company database name:", selectErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (selectResults.length === 0) {
          return res.status(404).json({ error: "Company not found" });
        }

        const companyDBName = selectResults[0].company_database;

        // Connect to the specific company's database
        const companyDB = createCompanyDBConnection(companyDBName);
        // Connect to the database
        companyDB.connect();

        // Check if the user_name already exists in the employees table
        companyDB.query(
          "SELECT * FROM employees WHERE user_name = ? OR email = ?",
          [user_name, email],
          (checkUserErr, checkUserResults) => {
            if (checkUserErr) {
              // Close the database connection in case of an error
              companyDB.end();
              console.error("Error checking user:", checkUserErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (checkUserResults.length > 0) {
              // Close the database connection if the user_name already exists
              companyDB.end();
              return res.status(409).json({
                error:
                  "Employee with the same user name or email already exists.",
              });
            }

            // Insert employee details into the employees table with hashed password
            const insertQuery =
              "INSERT INTO employees (employee_id,company_id,name, email, phone, user_name, password) VALUES (?,?, ?, ?, ?, ?, ?)";
            const insertValues = [
              employee_id,
              company_id,
              name,
              email,
              processedRecipient,
              user_name,
              hashedPassword,
            ];

            companyDB.query(insertQuery, insertValues, (insertErr, result) => {
              if (insertErr) {
                console.error("Error adding employee:", insertErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              const employeeId = result.insertId;
              // Close the database connection after both queries
              companyDB.end();
              res.json({
                message: "Employee added successfully",
                employee_id: employeeId,
              });
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in addEmployeeByCompany:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ####### GET ALL EMPLOYEES API  #######

const get_all_employees = (req, res) => {
  const { companyId } = req.params;

  const loggedInUserId = req.user.user_id;

  // console.log(loggedInUserId)

  if (!companyId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (companyId != loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Retrieve the company's database name from the companies table
  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [companyId],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error retrieving company database name:", selectErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (selectResults.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      const companyDBName = selectResults[0].company_database;

      // Create a new connection with the specific company's database
      const companyDB = createCompanyDBConnection(companyDBName);

      // Connect to the database
      companyDB.connect();

      // Retrieve all employees from the employees table
      companyDB.query("SELECT * FROM employees", (queryErr, queryResults) => {
        // Close the database connection after the query
        companyDB.end();

        if (queryErr) {
          console.error("Error retrieving employees:", queryErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Exclude the 'password' field from the response
        const employees = queryResults.map(
          ({ password, ...employee }) => employee
        );

        res.json({ employees });
      });
    }
  );
};

// ####### ADD CUSTOMER BY COMPANY API #######
const add_customer_by_company = async (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      company_id: Joi.number().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string(),
      user_name: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { company_id, name, email, phone, user_name, password } = req.body;

    const processedRecipient = phone.startsWith("+") ? phone.slice(1) : phone;

    // Generate unique CUSTOMER ID using timestamp and random component
    const generateCustomerId = () => {
      const timestamp = Date.now().toString(); // Timestamp
      const random = Math.floor(Math.random() * 100000); // Random 5-digit number
      return parseInt(timestamp + random); // Convert to integer
    };

    const customer_id = generateCustomerId();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Retrieve the company's database name from the companies table
    aiBotsDB.query(
      "SELECT company_database FROM users WHERE user_id = ?",
      [company_id],
      (selectErr, selectResults) => {
        if (selectErr) {
          console.error("Error retrieving company database name:", selectErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (selectResults.length === 0) {
          return res.status(404).json({ error: "Company not found" });
        }

        const companyDBName = selectResults[0].company_database;

        // Create a new connection with the specific company's database
        const companyDB = createCompanyDBConnection(companyDBName);

        // Connect to the database
        companyDB.connect();

        // Check if the user_name already exists in the customers table
        companyDB.query(
          "SELECT * FROM customers WHERE user_name = ?",
          [user_name],
          (checkUserErr, checkUserResults) => {
            if (checkUserErr) {
              // Close the database connection in case of an error
              companyDB.end();
              console.error("Error checking user:", checkUserErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (checkUserResults.length > 0) {
              // Close the database connection if the user_name already exists
              companyDB.end();
              return res.status(409).json({
                error: "User with the same user_name already exists.",
              });
            }

            // Insert customer details into the customers table with hashed password
            const insertQuery =
              "INSERT INTO customers (customer_id,company_id,name, email, phone, user_name, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const insertValues = [
              customer_id,
              company_id,
              name,
              email,
              processedRecipient,
              user_name,
              hashedPassword,
            ];

            companyDB.query(insertQuery, insertValues, (insertErr, result) => {
              // Close the database connection after the query
              companyDB.end();

              if (insertErr) {
                console.error("Error adding customer:", insertErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              const customerId = result.insertId;

              res.json({
                message: "Customer added successfully",
                customer_id: customerId,
              });
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in add_customer_by_company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ####### GET ALL CUSTOMERS BY COMPANY API #######
const get_all_customers = (req, res) => {
  const { companyId } = req.params;

  const loggedInUserId = req.user.user_id;

  // console.log(loggedInUserId)

  if (!companyId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (companyId != loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Retrieve the company's database name from the companies table
  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [companyId],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error retrieving company database name:", selectErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (selectResults.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      const companyDBName = selectResults[0].company_database;

      // Create a new connection with the specific company's database
      const companyDB = createCompanyDBConnection(companyDBName);

      // Connect to the database
      companyDB.connect();

      // Retrieve all customers from the customers table
      companyDB.query("SELECT * FROM customers", (queryErr, queryResults) => {
        // Close the database connection after the query
        companyDB.end();

        if (queryErr) {
          console.error("Error retrieving customers:", queryErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({ customers: queryResults });
      });
    }
  );
};

// ####### GET SINGLE CUSTOMERS BY COMPANY API #######

const get_single_customer_by_company = (req, res) => {
  const { companyId, customerId } = req.params;

  const loggedInUserId = req.user.user_id;

  // console.log(loggedInUserId)

  if (!companyId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (companyId != loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Retrieve the company's database name from the companies table
  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [companyId],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error retrieving company database name:", selectErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (selectResults.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      const companyDBName = selectResults[0].company_database;

      // Create a new connection with the specific company's database
      const companyDB = createCompanyDBConnection(companyDBName);

      // Connect to the database
      companyDB.connect();

      // Retrieve the single customer from the customers table by ID
      companyDB.query(
        "SELECT * FROM customers WHERE customer_id = ?",
        [customerId],
        (queryErr, queryResults) => {
          // Close the database connection after the query
          companyDB.end();

          if (queryErr) {
            console.error("Error retrieving customer:", queryErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (queryResults.length === 0) {
            return res.status(404).json({ error: "Customer not found" });
          }
          // del sensitive data
          delete queryResults[0].password;

          res.json({ customer: queryResults[0] });
        }
      );
    }
  );
};

// ####### GET SINGLE CUSTOMERS BY COMPANY API #######

const get_single_employee_by_company = (req, res) => {
  const { companyId, employeeId } = req.params;

  const loggedInUserId = req.user.user_id;

  // console.log(loggedInUserId)

  if (!companyId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (companyId != loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Retrieve the company's database name from the companies table
  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [companyId],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error retrieving company database name:", selectErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (selectResults.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      const companyDBName = selectResults[0].company_database;

      // Create a new connection with the specific company's database
      const companyDB = createCompanyDBConnection(companyDBName);

      // Connect to the database
      companyDB.connect();

      // Retrieve the single employee from the employees table by ID
      companyDB.query(
        "SELECT * FROM employees WHERE employee_id = ?",
        [employeeId],
        (queryErr, queryResults) => {
          // Close the database connection after the query
          companyDB.end();

          if (queryErr) {
            console.error("Error retrieving employee:", queryErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (queryResults.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
          }

          // del sensitive data
          delete queryResults[0].password;

          res.json({ employee: queryResults[0] });
        }
      );
    }
  );
};

// ####### EDIT EMPLOYEE BY COMPANY API #######

// API endpoint to edit a single employee by ID for a company
const edit_employee_by_company = async (req, res) => {
  try {
    const { companyId, employeeId } = req.params;

    if (!companyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Input validation using Joi
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      user_name: Joi.string(),
      password: Joi.string().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Retrieve the company's database name from the companies table
    aiBotsDB.query(
      "SELECT company_database FROM users WHERE user_id = ?",
      [companyId],
      (selectErr, selectResults) => {
        if (selectErr) {
          console.error("Error retrieving company database name:", selectErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (selectResults.length === 0) {
          return res.status(404).json({ error: "Company not found" });
        }

        const companyDBName = selectResults[0].company_database;

        // Create a new connection with the specific company's database
        const companyDB = createCompanyDBConnection(companyDBName);

        // Connect to the database
        companyDB.connect();

        // Check if the employee exists in the employees table by user_name or email
        companyDB.query(
          "SELECT * FROM employees WHERE (user_name = ? OR email = ?) AND employee_id != ?",
          [req.body.user_name, req.body.email, employeeId],
          (checkEmployeeErr, checkEmployeeResults) => {
            if (checkEmployeeErr) {
              // Close the database connection in case of an error
              companyDB.end();
              console.error("Error checking employee:", checkEmployeeErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (checkEmployeeResults.length > 0) {
              // Close the database connection if an employee with the same user_name or email already exists
              companyDB.end();
              return res.status(400).json({
                error:
                  "Employee with the same user_name or email already exists",
              });
            }

            // Hash the password if provided
            if (req.body.password) {
              bcrypt.hash(req.body.password, 10, (hashErr, hashedPassword) => {
                if (hashErr) {
                  // Close the database connection in case of an error
                  companyDB.end();
                  console.error("Error hashing password:", hashErr);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                // Update employee details in the employees table with hashed password
                const updateEmployeeQuery =
                  "UPDATE employees SET ? WHERE employee_id = ?";
                const updateEmployeeValues = [
                  { ...req.body, password: hashedPassword },
                  employeeId,
                ];

                companyDB.query(
                  updateEmployeeQuery,
                  updateEmployeeValues,
                  (updateEmployeeErr) => {
                    if (updateEmployeeErr) {
                      // Close the database connection in case of an error
                      companyDB.end();
                      console.error(
                        "Error updating employee:",
                        updateEmployeeErr
                      );
                      return res
                        .status(500)
                        .json({ error: "Internal Server Error" });
                    }

                    // Close the database connection after the update
                    companyDB.end();

                    res.json({
                      message: "Employee updated successfully",
                      employee_id: employeeId,
                    });
                  }
                );
              });
            } else {
              // Update employee details in the employees table without changing the password
              const updateEmployeeQuery =
                "UPDATE employees SET ? WHERE employee_id = ?";
              const updateEmployeeValues = [req.body, employeeId];

              companyDB.query(
                updateEmployeeQuery,
                updateEmployeeValues,
                (updateEmployeeErr) => {
                  if (updateEmployeeErr) {
                    // Close the database connection in case of an error
                    companyDB.end();
                    console.error(
                      "Error updating employee:",
                      updateEmployeeErr
                    );
                    return res
                      .status(500)
                      .json({ error: "Internal Server Error" });
                  }

                  // Close the database connection after the update
                  companyDB.end();

                  res.json({
                    message: "Employee updated successfully",
                    employee_id: employeeId,
                  });
                }
              );
            }
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in edit_employee_by_company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// #### EDIT CUSTOMER BY COMPANY API CODE

const edit_customer_by_company = async (req, res) => {
  try {
    const { companyId, customerId } = req.params;

    if (!companyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Input validation using Joi
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      user_name: Joi.string(),
      password: Joi.string().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Retrieve the company's database name from the companies table
    aiBotsDB.query(
      "SELECT company_database FROM users WHERE user_id = ?",
      [companyId],
      (selectErr, selectResults) => {
        if (selectErr) {
          console.error("Error retrieving company database name:", selectErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (selectResults.length === 0) {
          return res.status(404).json({ error: "Company not found" });
        }

        const companyDBName = selectResults[0].company_database;

        // Create a new connection with the specific company's database
        const companyDB = createCompanyDBConnection(companyDBName);

        // Connect to the database
        companyDB.connect();

        // Check if the customer exists in the customers table by user_name or email
        companyDB.query(
          "SELECT * FROM customers WHERE (user_name = ? OR email = ?) AND customer_id != ?",
          [req.body.user_name, req.body.email, customerId],
          async (checkCustomerErr, checkCustomerResults) => {
            if (checkCustomerErr) {
              // Close the database connection in case of an error
              companyDB.end();
              console.error("Error checking customer:", checkCustomerErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (checkCustomerResults.length > 0) {
              // Close the database connection if a customer with the same user_name or email already exists
              companyDB.end();
              return res.status(400).json({
                error:
                  "Customer with the same user_name or email already exists",
              });
            }

            // Hash the password if provided
            if (req.body.password) {
              try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                req.body.password = hashedPassword;
              } catch (hashErr) {
                // Close the database connection in case of an error
                companyDB.end();
                console.error("Error hashing password:", hashErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }
            }

            // Update customer details in the customers table
            const updateCustomerQuery =
              "UPDATE customers SET ? WHERE customer_id = ?";
            const updateCustomerValues = [req.body, customerId];

            companyDB.query(
              updateCustomerQuery,
              updateCustomerValues,
              (updateCustomerErr) => {
                if (updateCustomerErr) {
                  // Close the database connection in case of an error
                  companyDB.end();
                  console.error("Error updating customer:", updateCustomerErr);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                // Close the database connection after the update
                companyDB.end();

                res.json({
                  message: "Customer updated successfully",
                  customer_id: customerId,
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in edit_customer_by_company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// #### UPDATE COMPANY PROFILE API

const edit_profile_of_company = (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Input validation using Joi
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    user_name: Joi.string(),
    password: Joi.string().allow(""),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check if the user exists and is a company
  aiBotsDB.query(
    'SELECT * FROM users WHERE user_id = ? AND role = "company"',
    [user_id],
    (userErr, user) => {
      if (userErr) {
        console.error("Error checking company:", userErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check if the user is trying to update their own profile
      if (user_id != req.user.user_id) {
        return res
          .status(401)
          .json({ error: "Unauthorized to update another user's profile" });
      }
      if (user.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Check if the provided user_name or email is already registered
      aiBotsDB.query(
        "SELECT * FROM users WHERE (user_name = ? OR email = ?) AND user_id != ?",
        [req.body.user_name, req.body.email, user_id],
        (existingUserErr, existingUser) => {
          if (existingUserErr) {
            console.error("Error checking existing user:", existingUserErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (existingUser.length > 0) {
            return res.status(400).json({
              error: "User with this user_name or email already exists",
            });
          }

          // Update company details in the users table
          const updateCompanyQuery = "UPDATE users SET ? WHERE user_id = ?";
          const updateCompanyValues = [req.body, user_id];

          // Hash the password if provided
          if (req.body.password) {
            bcrypt.hash(req.body.password, 10, (hashErr, hashedPassword) => {
              if (hashErr) {
                console.error("Error hashing password:", hashErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              // Update the password with the hashed one
              req.body.password = hashedPassword;

              aiBotsDB.query(
                updateCompanyQuery,
                updateCompanyValues,
                (updateCompanyErr) => {
                  if (updateCompanyErr) {
                    console.error("Error updating company:", updateCompanyErr);
                    return res
                      .status(500)
                      .json({ error: "Internal Server Error" });
                  }

                  res.json({
                    message: "Company profile updated successfully",
                    user_id: user_id,
                  });
                }
              );
            });
          } else {
            // If no password provided, update the profile without hashing
            aiBotsDB.query(
              updateCompanyQuery,
              updateCompanyValues,
              (updateCompanyErr) => {
                if (updateCompanyErr) {
                  console.error("Error updating company:", updateCompanyErr);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                res.json({
                  message: "Company profile updated successfully",
                  user_id: user_id,
                });
              }
            );
          }
        }
      );
    }
  );
};

//#### GET COMPANY PROFILE

const get_company_profile = (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check if the user exists and is a company
  aiBotsDB.query(
    'SELECT * FROM users WHERE user_id = ? AND role = "company"',
    [user_id],
    (userErr, user) => {
      if (userErr) {
        console.error("Error fetching company profile:", userErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check if the user is trying to update their own profile
      if (user_id != req.user.user_id) {
        return res
          .status(401)
          .json({ error: "Unauthorized to update another user's profile" });
      }

      if (user.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Exclude sensitive information (e.g., password) from the response
      const companyProfile = {
        user_id: user[0].user_id,
        name: user[0].name,
        email: user[0].email,
        phone: user[0].phone,
        user_name: user[0].user_name,
      };

      res.status(200).json(companyProfile);
    }
  );
};

// HANGLE AUTO /MANUAL TAB MODE

const ToggleAutoManualTab = (req, res) => {
  const { companyId, mode } = req.body;

  if (!companyId || !mode) {
    return res
      .status(400)
      .json({ error: "All fields are required: companyId, mode" });
  }

  // Update the mode directly in the users table
  const query = `
      UPDATE users
      SET mode = ?
      WHERE user_id = ? ;
    `;

  aiBotsDB.query(query, [mode, companyId], (queryErr, queryResults) => {
    if (queryErr) {
      console.error("Error updating mode:", queryErr);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (queryResults.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Mode updated successfully", mode: mode });
  });
};

const getCurrentMode = (req, res) => {
  const { companyId } = req.query;

  if (!companyId) {
    return res.status(400).json({ error: "companyId is required" });
  }

  // Query to get the current mode from the users table
  const query = `
      SELECT mode
      FROM users
      WHERE user_id = ? ;
    `;

  aiBotsDB.query(query, [companyId], (queryErr, queryResults) => {
    if (queryErr) {
      console.error("Error retrieving mode:", queryErr);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (queryResults.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ mode: queryResults[0].mode });
  });
};

const companyChatConnect = (req, res) => {
  try {
    let companyId = req.params;
    aiBotsDB.query(
      "SELECT company_database FROM users WHERE user_id = ?",
      [companyId.companyId],
      (selectErr, selectResults) => {
        if (selectErr) {
          console.error("Error retrieving company database name:", selectErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (selectResults.length === 0) {
          return res.status(404).json({ error: "Company not found" });
        }

        const companyDBName = selectResults[0].company_database;

        // Create a new connection with the specific company's database
        const companyDB = createCompanyDBConnection(companyDBName);

        // Connect to the database
        companyDB.connect();

        // Check if the employee exists in the employees table by user_name or email
        companyDB.query(
          "SELECT * FROM all_chats",
          (checkEmployeeErr, checkEmployeeResults) => {
            if (checkEmployeeErr) {
              // Close the database connection in case of an error
              companyDB.end();
              console.error("Error checking employee:", checkEmployeeErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (checkEmployeeResults.length > 0) {
              // Close the database connection if an employee with the same user_name or email already exists
              companyDB.end();
              return res.status(200).json({
                success: true,
                checkEmployeeResults,
              });
            }
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in edit_employee_by_company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const connecttochat = (req, res) => {
  try {
    let { wshatsappconnection, nameofchat } = req.body;

    let companyId = req.params;
    aiBotsDB.query(
      "SELECT company_database FROM users WHERE user_id = ?",
      [companyId.companyId],
      (selectErr, selectResults) => {
        if (selectErr) {
          console.error("Error retrieving company database name:", selectErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (selectResults.length === 0) {
          return res.status(404).json({ error: "Company not found" });
        }

        const companyDBName = selectResults[0].company_database;

        // Create a new connection with the specific company's database
        const companyDB = createCompanyDBConnection(companyDBName);

        // Connect to the database
        companyDB.connect();

        // Check if the employee exists in the employees table by user_name or email
        if (nameofchat == "Whatsapp") {
          companyDB.query(
            `UPDATE all_chats set whatsappconnect=${wshatsappconnection} WHERE selected_employee_id = ${companyId.companyId}`,
            (checkEmployeeErr, checkEmployeeResults) => {
              if (checkEmployeeErr) {
                // Close the database connection in case of an error
                companyDB.end();
                console.error("Error checking employee:", checkEmployeeErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              if (checkEmployeeResults) {
                // Close the database connection if an employee with the same user_name or email already exists
                companyDB.end();
                return res.status(200).json({
                  success: true,
                  message: "Chat connect successfully",
                });
              }
            }
          );
        } else if (nameofchat == "Facebook") {
          companyDB.query(
            `UPDATE all_chats set facebookconnect=${wshatsappconnection} WHERE selected_employee_id = ${companyId.companyId}`,
            (checkEmployeeErr, checkEmployeeResults) => {
              if (checkEmployeeErr) {
                // Close the database connection in case of an error
                companyDB.end();
                console.error("Error checking employee:", checkEmployeeErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              if (checkEmployeeResults) {
                // Close the database connection if an employee with the same user_name or email already exists
                companyDB.end();
                return res.status(200).json({
                  success: true,
                  message: "Chat connect successfully",
                });
              }
            }
          );
        } else if (nameofchat == "SMS") {
          companyDB.query(
            `UPDATE all_chats set smsconnect=${wshatsappconnection} WHERE selected_employee_id = ${companyId.companyId}`,
            (checkEmployeeErr, checkEmployeeResults) => {
              if (checkEmployeeErr) {
                // Close the database connection in case of an error
                companyDB.end();
                console.error("Error checking employee:", checkEmployeeErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              if (checkEmployeeResults) {
                // Close the database connection if an employee with the same user_name or email already exists
                companyDB.end();
                return res.status(200).json({
                  success: true,
                  message: "Chat connect successfully",
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("Error in edit_employee_by_company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  company_login,
  add_employee_by_company,
  get_all_employees,
  add_customer_by_company,
  get_all_customers,
  get_single_customer_by_company,
  get_single_employee_by_company,
  edit_employee_by_company,
  edit_customer_by_company,
  edit_profile_of_company,
  get_company_profile,
  company_logout,
  ToggleAutoManualTab,
  getCurrentMode,
  companyChatConnect,
  connecttochat,
};
