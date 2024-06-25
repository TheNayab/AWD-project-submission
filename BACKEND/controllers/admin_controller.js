const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { aiBotsDB } = require("../DB/db.js");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

const CompanyDBConnection = (companyDBName) => {
  return mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: companyDBName,
  });
};

const admin_login = (req, res) => {
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

    // Check if the admin with the given user_name exists
    aiBotsDB.query(
      'SELECT * FROM users WHERE (email = ? OR user_name = ?) AND role = "admin"',
      [email, email],
      (adminErr, adminResults) => {
        if (adminErr) {
          console.error("Error checking admin:", adminErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const admin = adminResults[0];

        if (!admin) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if the password is correct
        bcrypt.compare(
          password,
          admin.password,
          (compareErr, passwordMatch) => {
            if (compareErr) {
              console.error("Error comparing passwords:", compareErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (!passwordMatch) {
              return res.status(401).json({ error: "Invalid Password" });
            }

            // Generate a JWT token with expiration set to 2 days
            const expiresIn = 2 * 24 * 60 * 60; // 2 days in seconds
            const expirationDate = moment().add(expiresIn, "seconds");
            const token = jwt.sign(
              {
                user_id: admin.id,
                email: admin.email,
                user_name: admin.user_name,
                name: admin.name,
                role: admin.role,
              },
              process.env.JWT_SECRET_ADMIN,
              { expiresIn }
            );
            // Set the JWT token as a cookie
            res.cookie("admin_access_token", token, {
              maxAge: 2 * 24 * 60 * 60 * 1000,
              secure: true,
              httpOnly: true,
            }); // 2 days in milliseconds

            // Remove sensitive information from the response
            delete admin.password;

            return res
              .status(200)
              .cookie("admin_access_token", token, {
                maxAge: 2 * 24 * 60 * 60 * 1000,
                // secure: true,
                httpOnly: true,
              })
              .json({
                message: "Login successful",
                admin: admin,
                admin_access_token: token,
                expires_at: expirationDate.format(),
              });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in adminLogin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const admin_logout = (req, res) => {
  try {
    res.cookie("admin_access_token", null, {
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

// const add_company = (req, res) => {
//     try {
//       // Input validation using Joi
//       const schema = Joi.object({
//         user_name: Joi.string().required(),
//         name: Joi.string().required(),
//         email: Joi.string().email().required(),
//         phone: Joi.string(),
//         password: Joi.string().required(),
//       });

//       const { error } = schema.validate(req.body);

//       if (error) {
//         return res.status(400).json({ error: error.details[0].message });
//       }

//       const { user_name, name, email, phone, password } = req.body;

//       // Check if the company with the given user_name or email already exists
//       aiBotsDB.query('SELECT * FROM users WHERE user_name = ? OR email = ?', [user_name, email], (existingCompanyErr, existingCompanyResults) => {
//         if (existingCompanyErr) {
//           console.error('Error checking existing company:', existingCompanyErr);
//           return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         const existingCompany = existingCompanyResults[0];

//         if (existingCompany) {
//           return res.status(409).json({ error: 'Company already exists with this user name or email' });
//         }

//         // Hash the password
//         bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
//           if (hashErr) {
//             console.error('Error hashing password:', hashErr);
//             return res.status(500).json({ error: 'Internal Server Error' });
//           }

//           // Generate a unique database name (e.g., first 12 characters of the company's name)
//           const dbName = `co_db_${user_name.substring(0, 12).toLowerCase()}`;

//           // Use a single MySQL connection for the entire process
//           aiBotsDB.query('START TRANSACTION', (startTransactionErr) => {
//             if (startTransactionErr) {
//               console.error('Error starting transaction:', startTransactionErr);
//               return res.status(500).json({ error: 'Internal Server Error' });
//             }

//             // Insert company details into the users table with hashed password
//             aiBotsDB.query(
//               'INSERT INTO users (user_name, role, name, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)',
//               [user_name, 'company', name, email, phone, hashedPassword],
//               (insertErr, result) => {
//                 if (insertErr) {
//                   console.error('Error adding company:', insertErr);
//                   aiBotsDB.query('ROLLBACK', (rollbackErr) => {
//                     console.error('Error rolling back transaction:', rollbackErr);
//                     return res.status(500).json({ error: 'Internal Server Error' });
//                   });
//                 }

//                 const companyId = result.insertId;

//                 // Create the new database
//                 aiBotsDB.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (createDbErr) => {
//                   if (createDbErr) {
//                     console.error('Error creating new database:', createDbErr);
//                     aiBotsDB.query('ROLLBACK', (rollbackErr) => {
//                       console.error('Error rolling back transaction:', rollbackErr);
//                       return res.status(500).json({ error: 'Internal Server Error' });
//                     });
//                   }

//                   // Create the employees table within the new database
//                   aiBotsDB.query(`
//                     CREATE TABLE IF NOT EXISTS ${dbName}.employees (
//                       employee_id INT PRIMARY KEY AUTO_INCREMENT,
//                       company_id INT,
//                       name VARCHAR(255) NOT NULL,
//                       email VARCHAR(255) NOT NULL,
//                       phone VARCHAR(20),
//                       user_name VARCHAR(50) NOT NULL,
//                       password VARCHAR(255) NOT NULL,
//                       role VARCHAR(100) NOT NULL DEFAULT "employee",
//                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//                       status INT DEFAULT 1
//                     )`, (createTableErr) => {
//                     if (createTableErr) {
//                       console.error('Error creating employees table:', createTableErr);
//                       aiBotsDB.query('ROLLBACK', (rollbackErr) => {
//                         console.error('Error rolling back transaction:', rollbackErr);
//                         return res.status(500).json({ error: 'Internal Server Error' });
//                       });
//                     }

//                     // Create the customers table within the new database
//           aiBotsDB.query(`
//             CREATE TABLE IF NOT EXISTS ${dbName}.customers (
//               customer_id INT PRIMARY KEY AUTO_INCREMENT,
//               company_id INT,
//               name VARCHAR(255) NOT NULL,
//               email VARCHAR(255) NOT NULL,
//               phone VARCHAR(20),
//               user_name VARCHAR(50) NOT NULL,
//               password VARCHAR(255) NOT NULL,
//               role VARCHAR(100) NOT NULL DEFAULT "customer",
//               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//               status INT DEFAULT 1
//             )`, (createTableErr) => {
//             if (createTableErr) {
//               console.error('Error creating customers table:', createTableErr);
//               aiBotsDB.query('ROLLBACK', (rollbackErr) => {
//                 console.error('Error rolling back transaction:', rollbackErr);
//                 return res.status(500).json({ error: 'Internal Server Error' });
//               });
//             }

//                     // Insert company details into the companies table
//                     aiBotsDB.query('UPDATE users SET company_database = ? WHERE user_id = ?', [dbName, companyId], (companyInsertErr) => {
//                       if (companyInsertErr) {
//                         console.error('Error updating company in users table:', companyInsertErr);
//                         aiBotsDB.query('ROLLBACK', (rollbackErr) => {
//                           console.error('Error rolling back transaction:', rollbackErr);
//                           return res.status(500).json({ error: 'Internal Server Error' });
//                         });
//                       }

//                       aiBotsDB.query('COMMIT', (commitErr) => {
//                         if (commitErr) {
//                           console.error('Error committing transaction:', commitErr);
//                           return res.status(500).json({ error: 'Internal Server Error' });
//                         }

//                         res.json
//                         ({
//                            message: 'Company added successfully',
//                             company_id: companyId,

//                            });
//                       });
//                     });
//                   });
//                 });
//               }
//             );
//           });
//           });
//         });
//       });
//     } catch (error) {
//       console.error('Error in addCompany:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };

const add_company = (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      user_name: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { user_name, name, email, phone, password } = req.body;
    // Generate a UUID

    // Check if the company with the given user_name or email already exists
    aiBotsDB.query(
      "SELECT * FROM users WHERE user_name = ? OR email = ?",
      [user_name, email],
      (existingCompanyErr, existingCompanyResults) => {
        if (existingCompanyErr) {
          console.error("Error checking existing company:", existingCompanyErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const existingCompany = existingCompanyResults[0];

        if (existingCompany) {
          return res.status(409).json({
            error: "Company already exists with this user name or email",
          });
        }

        // Hash the password
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error("Error hashing password:", hashErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Generate a unique database name (e.g., first 12 characters of the company's name)
          const dbName = `company_db_${user_name
            .substring(0, 12)
            .toLowerCase()}`;
          const chatDatabases = [
            "whatsapp_chat_db",
            "fb_messenger_chat_db",
            "SMS_chat_db",
            "web_chat_db",
          ];

          // Use a single MySQL connection for the entire process
          aiBotsDB.query("START TRANSACTION", (startTransactionErr) => {
            if (startTransactionErr) {
              console.error("Error starting transaction:", startTransactionErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            // Insert company details into the users table with hashed password
            aiBotsDB.query(
              "INSERT INTO users (user_name, role, name, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)",
              [user_name, "company", name, email, phone, hashedPassword],
              (insertErr, result) => {
                if (insertErr) {
                  console.error("Error adding company:", insertErr);
                  aiBotsDB.query("ROLLBACK", (rollbackErr) => {
                    console.error(
                      "Error rolling back transaction:",
                      rollbackErr
                    );
                    return res
                      .status(500)
                      .json({ error: "Internal Server Error" });
                  });
                }

                const companyId = result.insertId;

                // Create the new company database
                aiBotsDB.query(
                  `CREATE DATABASE IF NOT EXISTS ${dbName}`,
                  (createDbErr) => {
                    if (createDbErr) {
                      console.error(
                        "Error creating new company database:",
                        createDbErr
                      );
                      aiBotsDB.query("ROLLBACK", (rollbackErr) => {
                        console.error(
                          "Error rolling back transaction:",
                          rollbackErr
                        );
                        return res
                          .status(500)
                          .json({ error: "Internal Server Error" });
                      });
                    }

                    // Create the employees and customers tables within the new company database
                    aiBotsDB.query(
                      `
                  CREATE TABLE IF NOT EXISTS ${dbName}.employees (
                    employee_id BIGINT(20) PRIMARY KEY,
                    company_id INT,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    phone VARCHAR(20),
                    user_name VARCHAR(50) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(100) NOT NULL DEFAULT "employee",
                    is_logged_in BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    status INT DEFAULT 1,
                    mode VARCHAR(255) DEFAULT "manual"
                  )`,
                      (createTableErr) => {
                        if (createTableErr) {
                          console.error(
                            "Error creating employees table:",
                            createTableErr
                          );
                          aiBotsDB.query("ROLLBACK", (rollbackErr) => {
                            console.error(
                              "Error rolling back transaction:",
                              rollbackErr
                            );
                            return res
                              .status(500)
                              .json({ error: "Internal Server Error" });
                          });
                        }

                        aiBotsDB.query(
                          `
                    CREATE TABLE IF NOT EXISTS ${dbName}.customers (
                      customer_id BIGINT(20) PRIMARY KEY,
                      company_id INT,
                      name VARCHAR(255) NOT NULL,
                      email VARCHAR(255) NOT NULL,
                      phone VARCHAR(20),
                      user_name VARCHAR(50) NOT NULL,
                      password VARCHAR(255) NOT NULL,
                      role VARCHAR(100) NOT NULL DEFAULT "customer",
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      status INT DEFAULT 1
                    )`,
                          (createTableErr) => {
                            if (createTableErr) {
                              console.error(
                                "Error creating customers table:",
                                createTableErr
                              );
                              aiBotsDB.query("ROLLBACK", (rollbackErr) => {
                                console.error(
                                  "Error rolling back transaction:",
                                  rollbackErr
                                );
                                return res
                                  .status(500)
                                  .json({ error: "Internal Server Error" });
                              });
                            }

                            // Define the chat_links table in the same SQL transaction as other tables
                            aiBotsDB.query(
                              `
              CREATE TABLE IF NOT EXISTS ${dbName}.chat_links (
                link_id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT,
                generator_id BIGINT(20),
                chat_link VARCHAR(255) NOT NULL,
                link_expiry TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
               
              )`,
                              (createTableErr) => {
                                if (createTableErr) {
                                  console.error(
                                    "Error creating chat_links table:",
                                    createTableErr
                                  );
                                  aiBotsDB.query("ROLLBACK", (rollbackErr) => {
                                    console.error(
                                      "Error rolling back transaction:",
                                      rollbackErr
                                    );
                                    return res
                                      .status(500)
                                      .json({ error: "Internal Server Error" });
                                  });
                                }

                                aiBotsDB.query(
                                  `
              CREATE TABLE IF NOT EXISTS ${dbName}.all_chats (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id BIGINT(20),
                selected_employee_id BIGINT(20),
                sender_id BIGINT(20),
                name VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(20),
                user_name VARCHAR(50),
                preferred_platform VARCHAR(50),
                role VARCHAR(100) NOT NULL DEFAULT 'customer',
                mode VARCHAR(100) NOT NULL DEFAULT 'manual',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                status INT(11) DEFAULT 1,
                is_merged TINYINT(2) DEFAULT 0,  
                whatsappconnect VARCHAR(255) DEFAULT '0',
                facebookconnect VARCHAR(255) DEFAULT '0',
                smsconnect VARCHAR(255) DEFAULT '0',
                merge_id BIGINT(20) DEFAULT NULL
            
               
              )`,
                                  (createTableErr) => {
                                    if (createTableErr) {
                                      console.error(
                                        "Error creating chat_links table:",
                                        createTableErr
                                      );
                                      aiBotsDB.query(
                                        "ROLLBACK",
                                        (rollbackErr) => {
                                          console.error(
                                            "Error rolling back transaction:",
                                            rollbackErr
                                          );
                                          return res.status(500).json({
                                            error: "Internal Server Error",
                                          });
                                        }
                                      );
                                    }

                                    aiBotsDB.query(
                                      `
              CREATE TABLE IF NOT EXISTS ${dbName}.merged_chats (
                id INT AUTO_INCREMENT PRIMARY KEY,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                merged_name VARCHAR(255) 
              )`,
                                      (createTableErr) => {
                                        if (createTableErr) {
                                          console.error(
                                            "Error creating chat_links table:",
                                            createTableErr
                                          );
                                          aiBotsDB.query(
                                            "ROLLBACK",
                                            (rollbackErr) => {
                                              console.error(
                                                "Error rolling back transaction:",
                                                rollbackErr
                                              );
                                              return res.status(500).json({
                                                error: "Internal Server Error",
                                              });
                                            }
                                          );
                                        }

                                        // Create chat databases and tables
                                        chatDatabases.forEach((chatDb) => {
                                          const chatDbName = `co_db_chats_${user_name}_${chatDb}`;
                                          aiBotsDB.query(
                                            `CREATE DATABASE IF NOT EXISTS ${chatDbName}`,
                                            (createChatDbErr) => {
                                              if (createChatDbErr) {
                                                console.error(
                                                  `Error creating ${chatDbName} database:`,
                                                  createChatDbErr
                                                );
                                                aiBotsDB.query(
                                                  "ROLLBACK",
                                                  (rollbackErr) => {
                                                    console.error(
                                                      "Error rolling back transaction:",
                                                      rollbackErr
                                                    );
                                                    return res
                                                      .status(500)
                                                      .json({
                                                        error:
                                                          "Internal Server Error",
                                                      });
                                                  }
                                                );
                                              }

                                              aiBotsDB.query(
                                                `
                        CREATE TABLE IF NOT EXISTS ${chatDbName}.chats (
                          chat_id INT PRIMARY KEY AUTO_INCREMENT,
                          user_id INT,
                          sender_id BIGINT(20),
                          receipient_whatsapp BIGINT(20),
                          sender_whatsapp BIGINT(20),
                          sender_name VARCHAR(100),
                          receiver_id BIGINT(20),
                          message TEXT NOT NULL,
                          platform VARCHAR(100),
                          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          status INT DEFAULT 1,
                          direction VARCHAR(10),
                          message_type VARCHAR(100)
                        
                          )`,
                                                (createChatTableErr) => {
                                                  if (createChatTableErr) {
                                                    console.error(
                                                      `Error creating ${chatDbName} chats table:`,
                                                      createChatTableErr
                                                    );
                                                    aiBotsDB.query(
                                                      "ROLLBACK",
                                                      (rollbackErr) => {
                                                        console.error(
                                                          "Error rolling back transaction:",
                                                          rollbackErr
                                                        );
                                                        return res
                                                          .status(500)
                                                          .json({
                                                            error:
                                                              "Internal Server Error",
                                                          });
                                                      }
                                                    );
                                                  }
                                                }
                                              );

                                              // Insert record into company_chats_dbs table
                                              aiBotsDB.query(
                                                "INSERT INTO company_chats_dbs (user_id, db_name, db_type) VALUES (?, ?, ?)",
                                                [companyId, chatDbName, chatDb],
                                                (insertChatDbRecordErr) => {
                                                  if (insertChatDbRecordErr) {
                                                    console.error(
                                                      `Error inserting record into company_chats_dbs table:`,
                                                      insertChatDbRecordErr
                                                    );
                                                    aiBotsDB.query(
                                                      "ROLLBACK",
                                                      (rollbackErr) => {
                                                        console.error(
                                                          "Error rolling back transaction:",
                                                          rollbackErr
                                                        );
                                                        return res
                                                          .status(500)
                                                          .json({
                                                            error:
                                                              "Internal Server Error",
                                                          });
                                                      }
                                                    );
                                                  }
                                                }
                                              );
                                            }
                                          );
                                        });

                                        // Update company details in the users table
                                        aiBotsDB.query(
                                          "UPDATE users SET company_database = ? WHERE user_id = ?",
                                          [dbName, companyId],
                                          (companyInsertErr) => {
                                            if (companyInsertErr) {
                                              console.error(
                                                "Error updating company in users table:",
                                                companyInsertErr
                                              );
                                              aiBotsDB.query(
                                                "ROLLBACK",
                                                (rollbackErr) => {
                                                  console.error(
                                                    "Error rolling back transaction:",
                                                    rollbackErr
                                                  );
                                                  return res.status(500).json({
                                                    error:
                                                      "Internal Server Error",
                                                  });
                                                }
                                              );
                                            }

                                            // Commit the transaction
                                            aiBotsDB.query(
                                              "COMMIT",
                                              (commitErr) => {
                                                if (commitErr) {
                                                  console.error(
                                                    "Error committing transaction:",
                                                    commitErr
                                                  );
                                                  return res.status(500).json({
                                                    error:
                                                      "Internal Server Error",
                                                  });
                                                }

                                                res.json({
                                                  message:
                                                    "Company added successfully",
                                                  company_id: companyId,
                                                });
                                              }
                                            );
                                          }
                                        );
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          });
        });
      }
    );
  } catch (error) {
    console.error("Error in addCompany:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// EDIT COMPANY CREDENTIALS

const edit_company = (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      user_name: Joi.string(),
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      password: Joi.string(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { user_name, name, email, phone, password } = req.body;

    // user id will be the company id as it's registered as a user in the users table
    const userId = req.params.userId;

    // Check if the company with the given user_name or email already exists
    aiBotsDB.query(
      "SELECT * FROM users WHERE (user_name = ? OR email = ?) AND user_id != ?",
      [user_name, email, userId],
      (existingCompanyErr, existingCompanyResults) => {
        if (existingCompanyErr) {
          console.error("Error checking existing company:", existingCompanyErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const existingCompany = existingCompanyResults[0];

        if (existingCompany) {
          return res.status(409).json({
            error: "Company already exists with this user name or email",
          });
        }

        // Hash the new password if provided
        if (password) {
          bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
              console.error("Error hashing password:", hashErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            // Update company details in the users table with the new hashed password
            aiBotsDB.query(
              "UPDATE users SET name = ?, user_name = ?, email = ?, phone = ?, password = ? WHERE user_id = ?",
              [name, user_name, email, phone, hashedPassword, userId],
              (updateErr) => {
                if (updateErr) {
                  console.error("Error updating company:", updateErr);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                res.json({
                  message: "Company updated successfully",
                });
              }
            );
          });
        } else {
          // Update company details without changing the password
          aiBotsDB.query(
            "UPDATE users SET name = ?, user_name = ?, email = ?, phone = ? WHERE user_id = ?",
            [name, user_name, email, phone, userId],
            (updateErr) => {
              if (updateErr) {
                console.error("Error updating company:", updateErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              res.json({
                message: "Company updated successfully",
              });
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("Error in editCompany:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ##### GET SINGLE COMPANY

const get_single_company = (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch details for a single company based on user_id
    aiBotsDB.query(
      "SELECT * FROM users WHERE user_id = ?",
      [userId],
      (err, companyResult) => {
        if (err) {
          console.error("Error fetching company:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const company = companyResult[0];

        if (!company) {
          return res.status(404).json({ error: "Company not found" });
        }

        // Remove sensitive information from the response
        delete company.password;

        res.json({ company });
      }
    );
  } catch (error) {
    console.error("Error in getSingleCompany:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Define the route for getting all companies
const get_all_companies = async (req, res) => {
  try {
    // Retrieve all companies from the database
    aiBotsDB.query(
      'SELECT * FROM users where role = "company" ',
      (err, results) => {
        if (err) {
          console.error("Error retrieving companies:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Send the list of companies in the response
        res.json({ companies: results });
      }
    );
  } catch (error) {
    console.error("Error in getCompanies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ADD EMPLOYEES BY COMPANY

const add_employee_by_admin = async (req, res) => {
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
        const companyDB = CompanyDBConnection(companyDBName);
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
              "INSERT INTO employees (employee_id,company_id,name, email, phone, user_name, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
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

// #### GET ALL EMPLOYEES OF ALL COMPANIES

// API endpoint to get all employees from all companies

const get_all_employees_of_all_companies = async (req, res) => {
  try {
    // Fetch all employees from the employees table in all company databases
    aiBotsDB.query("SHOW DATABASES", async (err, databases) => {
      if (err) {
        console.error("Error fetching databases:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // console.log("company database",companyDatabases)

      const companyDatabases = databases
        .map((db) => db.Database)
        .filter((db) => db.startsWith("company_db_"));

      // Fetch employees from each company database
      const allEmployees = [];
      for (const companyDb of companyDatabases) {
        const employees = await fetchEmployeesFromCompany(companyDb);
        allEmployees.push(...employees);
      }

      res.json({ employees: allEmployees });
    });
  } catch (error) {
    console.error("Error in getAllEmployees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to fetch employees from a specific company database
const fetchEmployeesFromCompany = async (companyDb) => {
  return new Promise((resolve, reject) => {
    aiBotsDB.query(`SELECT * FROM ${companyDb}.employees`, (err, results) => {
      if (err) {
        console.error(`Error fetching employees from ${companyDb}:`, err);
        reject([]);
      } else {
        // Fetch the company name associated with the company database
        aiBotsDB.query(
          "SELECT user_name FROM users WHERE company_database = ?",
          [companyDb],
          (nameErr, nameResults) => {
            if (nameErr) {
              console.error(
                `Error fetching company name for ${companyDb}:`,
                nameErr
              );
              resolve([]);
            } else {
              const companyName =
                nameResults[0]?.user_name || "Unknown Company";
              // Add company name to each employee record
              const employeesWithCompany = results.map((employee) => ({
                ...employee,
                company: companyName,
              }));
              resolve(employeesWithCompany);
            }
          }
        );
      }
    });
  });
};

// ##### UPDATE EMPLOYEE BY ADMIN USER

const edit_employee_by_admin = async (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      company_id: Joi.number().required(),
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

    const { company_id, name, email, phone, user_name, password } = req.body;
    const { employee_id } = req.params;

    // Hash the password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

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
        const companyDB = CompanyDBConnection(companyDBName);
        // Connect to the database
        companyDB.connect();

        // Update employee details in the employees table based on the provided parameters
        let updateQuery;
        let updateValues;

        if (password) {
          // If password is provided, update all fields including the password
          updateQuery =
            "UPDATE employees SET name = ?, email = ?, phone = ?, user_name = ?, password = ? WHERE company_id = ? AND employee_id = ?";
          updateValues = [
            name,
            email,
            phone,
            user_name,
            hashedPassword,
            company_id,
            employee_id,
          ];
        } else {
          // If password is not provided, update only non-password fields
          updateQuery =
            "UPDATE employees SET name = ?, email = ?, phone = ?, user_name = ? WHERE company_id = ? AND employee_id = ?";
          updateValues = [
            name,
            email,
            phone,
            user_name,
            company_id,
            employee_id,
          ];
        }

        companyDB.query(updateQuery, updateValues, (updateErr, result) => {
          if (updateErr) {
            console.error("Error updating employee:", updateErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Close the database connection after the query
          companyDB.end();

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Employee not found" });
          }

          res.json({ message: "Employee updated successfully" });
        });
      }
    );
  } catch (error) {
    console.error("Error in updateEmployeeByAdmin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET SINGLE EMPLOYEE BY ADMIN

const get_single_employee_by_admin = async (req, res) => {
  try {
    // // Input validation using Joi
    // const schema = Joi.object({
    //   company_id: Joi.number().required(),
    //   employee_id: Joi.number().required(),
    // });

    // const { error } = schema.validate(req.params);

    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }

    const { company_id, employee_id } = req.params;

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
        const companyDB = CompanyDBConnection(companyDBName);
        // Connect to the database
        companyDB.connect();

        // Retrieve details of the single employee
        const selectQuery =
          "SELECT * FROM employees WHERE company_id = ? AND employee_id = ?";
        const selectValues = [company_id, employee_id];

        companyDB.query(
          selectQuery,
          selectValues,
          (selectErr, selectResults) => {
            // Close the database connection after the query
            companyDB.end();

            if (selectErr) {
              console.error("Error retrieving employee details:", selectErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (selectResults.length === 0) {
              return res.status(404).json({ error: "Employee not found" });
            }

            const employeeDetails = selectResults[0];
            res.json({ employeeDetails });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in getSingleEmployeeByAdmin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// #### ADD CUSTOMERS BY ADMIN FOR COMPANY

const add_customer_by_admin = async (req, res) => {
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

        // Connect to the specific company's database
        const companyDB = CompanyDBConnection(companyDBName);
        // Connect to the database
        companyDB.connect();

        // Check if the user_name already exists in the customers table
        companyDB.query(
          "SELECT * FROM customers WHERE user_name = ? OR email = ?",
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
                  "Customer with the same user name or email already exists.",
              });
            }

            // Insert customer details into the customers table with hashed password
            const insertQuery =
              "INSERT INTO customers (customer_id,company_id, name, email, phone, user_name, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
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
              if (insertErr) {
                console.error("Error adding customer:", insertErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              const customerId = result.insertId;

              // Close the database connection after both queries
              companyDB.end();

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
    console.error("Error in addCustomerByAdmin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET ALL CUTOMERS OF ALL COMPANIES API
const get_all_customers_of_all_companies = async (req, res) => {
  try {
    // Fetch all customers from the customers table in all company databases
    aiBotsDB.query("SHOW DATABASES", async (err, databases) => {
      if (err) {
        console.error("Error fetching databases:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const companyDatabases = databases
        .map((db) => db.Database)
        .filter((db) => db.startsWith("company_db_"));

      // Fetch customers from each company database
      const allCustomers = [];
      for (const companyDb of companyDatabases) {
        const customers = await fetchCustomersFromCompany(companyDb);
        allCustomers.push(...customers);
      }

      res.json({ customers: allCustomers });
    });
  } catch (error) {
    console.error("Error in getAllCustomers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to fetch customers from a specific company database
const fetchCustomersFromCompany = async (companyDb) => {
  return new Promise((resolve, reject) => {
    aiBotsDB.query(`SELECT * FROM ${companyDb}.customers`, (err, results) => {
      if (err) {
        console.error(`Error fetching customers from ${companyDb}:`, err);
        reject([]);
      } else {
        // Fetch the company name associated with the company database
        aiBotsDB.query(
          "SELECT user_name FROM users WHERE company_database = ?",
          [companyDb],
          (nameErr, nameResults) => {
            if (nameErr) {
              console.error(
                `Error fetching company name for ${companyDb}:`,
                nameErr
              );
              resolve([]);
            } else {
              const companyName =
                nameResults[0]?.user_name || "Unknown Company";
              // Add company name to each employee record
              const employeesWithCompany = results.map((employee) => ({
                ...employee,
                company: companyName,
              }));
              resolve(employeesWithCompany);
            }
          }
        );
      }
    });
  });
};

// #### EDIT CUSTOMER BY ADMIN API

const edit_customer_by_admin = async (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      company_id: Joi.number().required(),
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

    const { company_id, name, email, phone, user_name, password } = req.body;
    const { customer_id } = req.params;

    // Hash the password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

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
        const companyDB = CompanyDBConnection(companyDBName);
        // Connect to the database
        companyDB.connect();

        // Update customer details in the customers table based on the provided parameters
        let updateQuery;
        let updateValues;

        if (password) {
          // If password is provided, update all fields including the password
          updateQuery =
            "UPDATE customers SET name = ?, email = ?, phone = ?, user_name = ?, password = ? WHERE company_id = ? AND customer_id = ?";
          updateValues = [
            name,
            email,
            phone,
            user_name,
            hashedPassword,
            company_id,
            customer_id,
          ];
        } else {
          // If password is not provided, update only non-password fields
          updateQuery =
            "UPDATE customers SET name = ?, email = ?, phone = ?, user_name = ? WHERE company_id = ? AND customer_id = ?";
          updateValues = [
            name,
            email,
            phone,
            user_name,
            company_id,
            customer_id,
          ];
        }

        companyDB.query(updateQuery, updateValues, (updateErr, result) => {
          if (updateErr) {
            console.error("Error updating customer:", updateErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Close the database connection after the query
          companyDB.end();

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Customer not found" });
          }

          res.json({ message: "Customer updated successfully" });
        });
      }
    );
  } catch (error) {
    console.error("Error in updateCustomerByAdmin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// #### GET SINGLE CUSTOMER OF ADMIN

const get_single_customer_by_admin = async (req, res) => {
  try {
    // // Input validation using Joi
    // const schema = Joi.object({
    //   company_id: Joi.number().required(),
    //   customer_id: Joi.number().required(),
    // });

    // const { error } = schema.validate(req.params);

    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }

    const { company_id, customer_id } = req.params;

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
        const companyDB = CompanyDBConnection(companyDBName);
        // Connect to the database
        companyDB.connect();

        // Retrieve details of the single customer
        const selectQuery =
          "SELECT * FROM customers WHERE company_id = ? AND customer_id = ?";
        const selectValues = [company_id, customer_id];

        companyDB.query(
          selectQuery,
          selectValues,
          (selectErr, selectResults) => {
            // Close the database connection after the query
            companyDB.end();

            if (selectErr) {
              console.error("Error retrieving customer details:", selectErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (selectResults.length === 0) {
              return res.status(404).json({ error: "Customer not found" });
            }

            const customerDetails = selectResults[0];
            res.json({ customerDetails });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in getSingleCustomerByAdmin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const companiesConnection = async (req, res) => {
  try {
    let role = "company";
    aiBotsDB.query(
      "SELECT * FROM users WHERE role=?",
      [role],
      async (selectErr, selectResults) => {
        if (selectErr) {
          console.error("Error retrieving company database names:", selectErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (selectResults.length === 0) {
          return res.status(404).json({ error: "No companies found" });
        }
        console.log(selectResults);

        const allChats = [];
        const seenEmployeeIds = new Set();

        for (const result of selectResults) {
          const companyDBName = result.company_database;
          const userId = result.user_id;
          const username = result.user_name;

          const companyDB = CompanyDBConnection(companyDBName);

          const chats = await new Promise((resolve, reject) => {
            companyDB.connect();

            companyDB.query(
              "SELECT * FROM all_chats WHERE selected_employee_id=?",
              [userId],
              (checkEmployeeErr, checkEmployeeResults) => {
                companyDB.end();

                if (checkEmployeeErr) {
                  console.error("Error checking employee:", checkEmployeeErr);
                  reject(checkEmployeeErr);
                } else {
                  if (checkEmployeeResults.length === 0) {
                    // If all_chats table is empty for this user, add user details only
                    resolve([
                      {
                        user_name: username,
                        user_id: userId,
                      },
                    ]);
                  } else {
                    const chatsWithUserDetails = checkEmployeeResults.map(
                      (chat) => ({
                        ...chat,
                        user_name: username,
                        user_id: userId,
                      })
                    );
                    resolve(chatsWithUserDetails);
                  }
                }
              }
            );
          });

          if (chats) {
            for (const chat of chats) {
              if (!seenEmployeeIds.has(chat.selected_employee_id)) {
                seenEmployeeIds.add(chat.selected_employee_id);
                allChats.push(chat);
              }
            }
          }
        }

        return res.status(200).json({
          success: true,
          chats: allChats,
        });
      }
    );
  } catch (error) {
    console.error("Error in companiesConnection:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// const companiesAllChats = async (req, res) => {
//   try {
//     aiBotsDB.query(
//       "SELECT * FROM users WHERE role='company'",
//       async (selectErr, selectResults) => {
//         if (selectErr) {
//           console.error("Error retrieving company database names:", selectErr);
//           return res.status(500).json({ error: "Internal Server Error" });
//         }

//         if (selectResults.length === 0) {
//           return res.status(404).json({ error: "No companies found" });
//         }
//         console.log(selectResults);

//         const allChats = [];
//         const seenEmployeeIds = new Set();

//         for (const result of selectResults) {
//           const companyDBName = result.company_database;
//           const userId = result.user_id;
//           const username = result.user_name;

//           const companyDB = CompanyDBConnection(companyDBName);

//           const chats = await new Promise((resolve, reject) => {
//             companyDB.connect();

//             companyDB.query(
//               "SELECT * FROM all_chats WHERE selected_employee_id=?",
//               [userId],
//               (checkEmployeeErr, checkEmployeeResults) => {
//                 companyDB.end();

//                 if (checkEmployeeErr) {
//                   console.error("Error checking employee:", checkEmployeeErr);
//                   reject(checkEmployeeErr);
//                 } else {
//                   const chatsWithUserDetails = checkEmployeeResults.map(
//                     (chat) => ({
//                       ...chat,
//                       user_name: username,
//                       user_id: userId,
//                       companydb: companyDBName,
//                     })
//                   );
//                   resolve(chatsWithUserDetails);
//                 }
//               }
//             );
//           });

//           if (chats) {
//             for (const chat of chats) {
//               if (!seenEmployeeIds.has(chat.selected_employee_id)) {
//                 seenEmployeeIds.add(chat.selected_employee_id);
//                 allChats.push(chat);
//               }
//             }
//           }
//         }

//         return res.status(200).json({
//           success: true,
//           chats: allChats,
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Error in companiesConnection:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const companyContactList = async (req, res) => {
//   try {
//     let database = req.params;
//     let conn = database.database; 
//     const companyDB = CompanyDBConnection(conn); // Assuming this creates a connection object
//     companyDB.connect();

//     companyDB.query(
//       "SELECT * FROM all_chats",
//       (checkEmployeeErr, checkEmployeeResults) => {
//         if (checkEmployeeErr) {
//           console.error("Error checking employee:", checkEmployeeErr);
//           return res.status(500).json({ error: "Internal Server Error" });
//         } else {
//           return res.status(200).json({
//             success: true,
//             chats: checkEmployeeResults,
//           });
//         }
//       }
//     );

//     // Close connection after sending the response
//     companyDB.end();
//   } catch (error) {
//     console.error("Error in companiesConnection:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const getAllEuroSmsMessages = (req, res) => {
  const { sender_id, receipient_whatsapp, user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [user_id],
    (selectDbErr, dbResult) => {
      if (selectDbErr) {
        console.error("Error fetching company database:", selectDbErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (dbResult.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const companyDbName = dbResult[0].company_database;

      const companyDB = CompanyDBConnection(companyDbName);
      companyDB.connect();

      aiBotsDB.query(
        "SELECT db_name FROM company_chats_dbs WHERE user_id = ?",
        [user_id],
        (selectDbErr, dbResults) => {
          if (selectDbErr) {
            console.error("Error fetching chat database:", selectDbErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (dbResults.length === 0) {
            return res.status(404).json({ error: "Company not found" });
          }

          const webChatDbResult = dbResults.find((result) =>
            result.db_name.includes("SMS_chat_db")
          );

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "SMS chat database not found for user" });
          }

          const webChatDbName = webChatDbResult.db_name;

          const chatDB = CompanyDBConnection(webChatDbName);
          chatDB.connect();

          let query = "SELECT * FROM chats WHERE user_id = ?";
          let queryParams = [user_id];

          if (sender_id) {
            query += " AND sender_id = ?";
            queryParams.push(sender_id);
          }

          if (receipient_whatsapp) {
            query += " OR receipient_whatsapp = ?";
            queryParams.push(receipient_whatsapp);
          }

          chatDB.query(query, queryParams, (fetchErr, messages) => {
            if (fetchErr) {
              console.error(
                "Error fetching messages from the database:",
                fetchErr
              );
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (messages.length === 0) {
              return res.status(404).json({ error: "No messages found" });
            }

            res.json({ success: true, messages });
          });
        }
      );
    }
  );
};
module.exports = {
  admin_login,
  add_company,
  edit_company,
  get_single_company,
  get_all_companies,
  add_employee_by_admin,
  get_all_employees_of_all_companies,
  edit_employee_by_admin,
  get_single_employee_by_admin,
  add_customer_by_admin,
  get_all_customers_of_all_companies,
  edit_customer_by_admin,
  get_single_customer_by_admin,
  admin_logout,
  companiesConnection,
  // companiesAllChats,
  // companyContactList,
};
