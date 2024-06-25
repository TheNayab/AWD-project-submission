const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { aiBotsDB } = require("../DB/db.js");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const { get_all_companies } = require("./admin_controller.js");

const axios = require("axios");
const cloudinary = require("cloudinary").v2;
// const fs = require('fs/promises');
const fs = require("fs");
const request = require("request");
const path = require("path");
const streamifier = require("streamifier");

// Function to create a connection to a specific company's database
const CompanyDBConnection = (companyDBName) => {
  return mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: companyDBName,
  });
};

// Controller function for employee login
// Controller function for employee login
// const employee_login = (req, res) => {
//     try {
//       // Input validation using Joi
//       const schema = Joi.object({
//         company_id: Joi.number().required(),
//         user_name: Joi.string().required(),
//         password: Joi.string().required(),
//       });

//       const { error } = schema.validate(req.body);

//       if (error) {
//         return res.status(400).json({ error: error.details[0].message });
//       }

//       const { company_id, user_name, password } = req.body;

//       // Fetch the chat database name from company_chats_dbs
//       aiBotsDB.query(
//         'SELECT company_database FROM users WHERE user_id = ?',
//         [company_id],
//         (selectDbErr, dbResult) => {
//           if (selectDbErr) {
//             console.error('Error fetching chat database:', selectDbErr);
//             return res.status(500).json({ error: 'Internal Server Error' });
//           }

//           const companyDbName = dbResult[0].company_database;
//           console.log(companyDbName);
//           const companyDB = CompanyDBConnection(companyDbName);

//           companyDB.query(
//             'SELECT * FROM employees WHERE user_name = ?',
//             [user_name],
//             (selectEmployeeErr, employeeResult) => {
//               if (selectEmployeeErr) {
//                 console.error('Error fetching employee details:', selectEmployeeErr);
//                 return res.status(500).json({ error: 'Internal Server Error' });
//               }

//               // If no employee is found with the provided user_name, return an authentication error
//               if (employeeResult.length === 0) {
//                 companyDB.end(); // Disconnect from the company's database
//                 return res.status(401).json({ error: 'You are not registered in this company.' });
//               }

//               const employee = employeeResult[0];

//               // Compare the provided password with the stored hashed password
//               bcrypt.compare(password, employee.password, (bcryptErr, passwordMatch) => {
//                 if (bcryptErr) {
//                   console.error('Error comparing passwords:', bcryptErr);
//                   companyDB.end(); // Disconnect from the company's database
//                   return res.status(500).json({ error: 'Internal Server Error' });
//                 }

//                 // If passwords match, generate a JWT token
//                 if (passwordMatch) {
//                   // Generate a JWT token with expiration set to 2 days
//                   const expiresIn = 2 * 24 * 60 * 60; // 2 days in seconds
//                   const expirationDate = moment().add(expiresIn, 'seconds');
//                   const token = jwt.sign(
//                     { employee_id: employee.employee_id, user_name: employee.user_name,role: employee.role,company_id:employee.company_id },
//                     process.env.JWT_SECRET_EMPLOYEE,
//                     { expiresIn }
//                   );
//                      // Set the JWT token as a cookie
//                 res.cookie("employee_access_token", token, {
//                     maxAge: 2 * 24 * 60 * 60 * 1000,
//                     secure: true,
//                     httpOnly: true,
//                 }); // 2 days in milliseconds

//                   // Remove sensitive information from the response
//                   delete employee.password;

//                   // Disconnect from the company's database after successful login
//                   companyDB.end();

//                   // Return the token in the response
//                   res.json({
//                     message: 'Login successful',
//                     employee,
//                     employee_access_token: token,
//                     expires_at: expirationDate,
//                   });
//                 } else {
//                   // If passwords do not match, return an authentication error
//                   companyDB.end(); // Disconnect from the company's database
//                   res.status(401).json({ error: 'Invalid credentials. Please check your username and password.' });
//                 }
//               });
//             }
//           );
//         }
//       );
//     } catch (error) {
//       console.error('Error in employeeLogin:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };

const employee_login = (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      company_id: Joi.number().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { company_id, email, password } = req.body;

    // Fetch the chat database name from company_chats_dbs
    aiBotsDB.query(
      "SELECT company_database, user_id FROM users WHERE user_id = ?",
      [company_id],
      (selectDbErr, dbResult) => {
        if (selectDbErr) {
          console.error("Error fetching chat database:", selectDbErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const { company_database, user_id } = dbResult[0];
        const companyDbName = company_database;
        console.log(companyDbName);
        const companyDB = CompanyDBConnection(companyDbName);

        companyDB.query(
          "SELECT * FROM employees WHERE (email = ? OR user_name = ?)",
          [email, email],
          (selectEmployeeErr, employeeResult) => {
            if (selectEmployeeErr) {
              console.error(
                "Error fetching employee details:",
                selectEmployeeErr
              );
              return res.status(500).json({ error: "Internal Server Error" });
            }

            // If no employee is found with the provided user_name, return an authentication error
            if (employeeResult.length === 0) {
              companyDB.end(); // Disconnect from the company's database
              return res
                .status(401)
                .json({ error: "You are not registered in this company." });
            }

            const employee = employeeResult[0];

            // Compare the provided password with the stored hashed password
            bcrypt.compare(
              password,
              employee.password,
              (bcryptErr, passwordMatch) => {
                if (bcryptErr) {
                  console.error("Error comparing passwords:", bcryptErr);
                  companyDB.end(); // Disconnect from the company's database
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                // If passwords match, generate a JWT token
                if (passwordMatch) {
                  // Check if the user is already logged in
                  if (employee.is_logged_in === 1) {
                    // Emit a logout event to all connected clients except the current one
                    req.io.emit("employee-logout", {
                      userId: employee.employee_id,
                    });
                    // Update the logged_in flag in the users table
                    companyDB.query(
                      "UPDATE employees SET is_logged_in = 0 WHERE employee_id = ?",
                      [employee.employee_id],
                      (updateErr) => {
                        if (updateErr) {
                          console.error(
                            "Error updating logged_in flag:",
                            updateErr
                          );
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
                    companyDB.query(
                      "UPDATE employees SET is_logged_in = 1 WHERE employee_id = ?",
                      [employee.employee_id],
                      (updateErr, updateResult) => {
                        if (updateErr) {
                          console.error(
                            "Error updating logged_in flag:",
                            updateErr
                          );
                          return res
                            .status(500)
                            .json({ error: "Internal Server Error" });
                        }

                        // Generate a JWT token with expiration set to 2 days
                        const expiresIn = 2 * 24 * 60 * 60; // 2 days in seconds
                        const expirationDate = moment().add(
                          expiresIn,
                          "seconds"
                        );

                        const token = jwt.sign(
                          {
                            employee_id: employee.employee_id,
                            user_name: employee.user_name,
                            name: employee.name,
                            role: employee.role,
                            company_id: employee.company_id,
                          },
                          process.env.JWT_SECRET_EMPLOYEE,
                          { expiresIn }
                        );
                        // Set the JWT token as a cookie
                        res.cookie("employee_access_token", token, {
                          maxAge: 2 * 24 * 60 * 60 * 1000,
                          secure: true,
                          httpOnly: true,
                        }); // 2 days in milliseconds

                        // Remove sensitive information from the response
                        delete employee.password;

                        // Disconnect from the company's database after successful login
                        companyDB.end();

                        // Return the token in the response
                        res.json({
                          message: "Login successful",
                          employee,
                          employee_access_token: token,
                          expires_at: expirationDate,
                        });
                      }
                    );
                  }
                } else {
                  // If passwords do not match, return an authentication error
                  companyDB.end(); // Disconnect from the company's database
                  res.status(401).json({
                    error:
                      "Invalid credentials. Please check your username and password.",
                  });
                }
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in employeeLogin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const employee_logout = (req, res) => {
  try {
    res.cookie("employee_access_token", null, {
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

//   ### GET ALL COMPANIES

const get_all_companies_names = (req, res) => {
  // Query to select user_id and user_name from the table
  const query = 'SELECT user_id, user_name FROM users where role = "company"';

  // Execute the query
  aiBotsDB.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching companies:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Send the retrieved data as a JSON response
    res.json(results);
  });
};

// ####### GET ALL EMPLOYEES API  #######

const get_all_employees = (req, res) => {
  const { companyId } = req.params;

  // const loggedInUserId = req.user.user_id

  // console.log(loggedInUserId)

  // if (!companyId) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  // if (companyId != loggedInUserId) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

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
      const companyDB = CompanyDBConnection(companyDBName);

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

// ####### GET ALL CUSTOMERS BY COMPANY API #######
const get_all_customers = (req, res) => {
  const { companyId } = req.params;

  // const loggedInUserId = req.user.user_id

  // console.log(loggedInUserId)

  // if (!companyId) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  // if (companyId != loggedInUserId) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

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
      const companyDB = CompanyDBConnection(companyDBName);

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

// GET PARENT COMPANY DETAILS API

const get_parent_company_details = (req, res) => {
  const { companyId } = req.params;

  // Retrieve parent company details based on companyId
  aiBotsDB.query(
    "SELECT * FROM users WHERE user_id = ?",
    [companyId],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error retrieving parent company details:", selectErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (selectResults.length === 0) {
        return res.status(404).json({ error: "Parent company not found" });
      }

      const parentCompanyDetails = selectResults[0];

      // You might want to fetch additional data or perform additional operations here
      delete parentCompanyDetails.password;
      res.status(200).json({ parentCompanyDetails });
    }
  );
};

// save chats in the databse APi

const createChat = (req, res) => {
  const {
    user_id,
    customer_id,
    selected_employee_id,
    name,
    email,
    phone,
    user_name,
    preferred_platform,
  } = req.body;

  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [user_id],
    (selectDbErr, dbResult) => {
      if (selectDbErr) {
        console.error("Error fetching company database:", selectDbErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (dbResult.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      const companyDbName = dbResult[0].company_database;

      console.log(companyDbName);

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
            return res
              .status(404)
              .json({ error: "Chat database not found for sender" });
          }

          const chatDbName = dbResults[0].db_name;

          console.log(chatDbName);

          // Check if a record with the same platform exists for the selectedEmployeeId
          companyDB.query(
            "SELECT * FROM all_chats WHERE customer_id = ? AND selected_employee_id = ? AND preferred_platform = ?",
            [customer_id, selected_employee_id, preferred_platform],
            (selectErr, existingChat) => {
              console.log(existingChat);
              if (selectErr) {
                console.error("Error checking existing chat:", selectErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              if (existingChat.length > 0) {
                // Update the existing chat record
                companyDB.query(
                  "UPDATE all_chats SET customer_id = ?,selected_employee_id = ?, name = ?, email = ?, phone = ?, user_name = ?, preferred_platform = ? WHERE id = ?",
                  [
                    customer_id,
                    selected_employee_id,
                    name,
                    email,
                    phone,
                    user_name,
                    preferred_platform,
                    existingChat[0].id,
                  ],
                  (updateErr, updateResult) => {
                    if (updateErr) {
                      console.error("Error updating chat:", updateErr);
                      return res
                        .status(500)
                        .json({ error: "Failed to update chat" });
                    }
                    req.io.emit("updatedChat", { chatId: existingChat[0].id });
                    res.status(200).json({
                      message: "Chat updated successfully",
                      chatId: existingChat[0].id,
                    });
                    companyDB.end();
                  }
                );
              } else {
                // Insert a new chat record
                companyDB.query(
                  "INSERT INTO all_chats (customer_id, selected_employee_id, name,email ,phone,user_name, preferred_platform) VALUES (?, ?, ?, ?,? ,?,?)",
                  [
                    customer_id,
                    selected_employee_id,
                    name,
                    email,
                    phone,
                    user_name,
                    preferred_platform,
                  ],
                  (insertErr, insertResult) => {
                    if (insertErr) {
                      console.error("Error inserting chat data:", insertErr);
                      res
                        .status(500)
                        .json({ error: "Failed to save data to database" });
                    } else {
                      req.io.emit("newChat", { chatId: insertResult.insertId });
                      res.status(201).json({
                        message: "Chat started successfully",
                        chatId: insertResult.insertId,
                      });
                    }
                    companyDB.end();
                  }
                );
              }
            }
          );
        }
      );
    }
  );
};

// GET ALL CHATS

// const getAllChats = (req, res) => {
//   const { user_id, selected_employee_id } = req.query;

//   // Fetch the company database name for the user
//   aiBotsDB.query(
//     "SELECT company_database FROM users WHERE user_id = ?",
//     [user_id],
//     (selectDbErr, dbResult) => {
//       if (selectDbErr) {
//         console.error("Error fetching company database:", selectDbErr);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (dbResult.length === 0) {
//         return res.status(404).json({ error: "Company not found" });
//       }

//       const companyDbName = dbResult[0].company_database;

//       // Connect to the company database
//       const companyDB = CompanyDBConnection(companyDbName);
//       companyDB.connect();

//       // Fetch all chats (both merged and unmerged) from all_chats table
//       companyDB.query(
//         `SELECT all_chats.*, merged_chats.merged_name
//         FROM all_chats
//         LEFT JOIN merged_chats ON all_chats.merge_id = merged_chats.id
//         WHERE all_chats.selected_employee_id = ? AND is_merged = 0
//         ORDER BY all_chats.created_at DESC
//         `,
//         [selected_employee_id],
//         (fetchErr, chats) => {
//           if (fetchErr) {
//             console.error("Error fetching chats:", fetchErr);
//             return res.status(500).json({ error: "Internal Server Error" });
//           }

//           // Send the combined merged and unmerged chats as a response
//           res.status(200).json(chats);

//           // Don't forget to end the connection
//           companyDB.end();
//         }
//       );
//     }
//   );
// };

const getAllChats = (req, res) => {
  const { user_id, selected_employee_id, mode } = req.query;

  // Fetch the company database name for the user
  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [user_id],
    (selectDbErr, dbResult) => {
      if (selectDbErr) {
        console.error("Error fetching company database:", selectDbErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (dbResult.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      const companyDbName = dbResult[0].company_database;

      // Connect to the company database
      const companyDB = CompanyDBConnection(companyDbName);
      companyDB.connect();

      // Construct the base query
      let query = `SELECT all_chats.*, merged_chats.merged_name
                   FROM all_chats
                   LEFT JOIN merged_chats ON all_chats.merge_id = merged_chats.id
                   WHERE all_chats.selected_employee_id = ? AND is_merged = 0`;
      const queryParams = [selected_employee_id];

      // Add mode filter if applicable
      if (mode === "manual" || mode === "auto") {
        query += " AND all_chats.mode = ?";
        queryParams.push(mode);
      }

      // Add order by clause
      query += " ORDER BY all_chats.created_at DESC";

      // Execute the query
      companyDB.query(query, queryParams, (fetchErr, chats) => {
        if (fetchErr) {
          console.error("Error fetching chats:", fetchErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Send the chats as a response
        res.status(200).json(chats);

        // End the connection
        companyDB.end();
      });
    }
  );
};

//MERGE CHATS API CODE

// const mergeChats = (req, res) => {
//   const { user_id, chat_ids } = req.body;

//   if (!chat_ids.length) {
//     return res.status(400).json({ error: "No chat IDs provided" });
//   }

//   aiBotsDB.query(
//     "SELECT company_database FROM users WHERE user_id = ?",
//     [user_id],
//     (selectDbErr, dbResult) => {
//       if (selectDbErr) {
//         console.error("Error fetching company database:", selectDbErr);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (dbResult.length === 0) {
//         return res.status(404).json({ error: "Company not found" });
//       }

//       const companyDbName = dbResult[0].company_database;

//       console.log(companyDbName);

//       const companyDB = CompanyDBConnection(companyDbName);

//       companyDB.connect();

//       // Query to fetch all chats for the given customer_ids
//       companyDB.query(
//         "SELECT * FROM all_chats WHERE id IN (?)",
//         [chat_ids],
//         (selectErr, chats) => {
//           if (selectErr) {
//             console.error("Error fetching chats:", selectErr);
//             return res.status(500).json({ error: "Internal Server Error" });
//           }

//           if (chats.length === 0) {
//             return res.status(404).json({ error: "Chats not found" });
//           }

//           // Logic to merge chats here
//           // For simplicity, let's assume we're merging the chats by updating the first chat
//           const firstChat = chats[0];
//           const mergedCustomer_id = chats.map(chat => chat.customer_id).join(", ");
//           const mergedSelectedEmployeeId = chats.map(chat => chat.selected_employee_id).join(", ");
//           const mergedSenderId = chats.map(chat => chat.sender_id).join(", ");
//           const mergedName = chats.map(chat => chat.name).join(", ");
//           const mergedEmail = chats.map(chat => chat.email).join(", ");
//           const mergedPhone = chats.map(chat => chat.phone)[0];
//           const mergedUserName = chats.map(chat => chat.user_name).join(", ");
//           const mergedPreferredPlatform = chats.map(chat => chat.preferred_platform).join(", ");

//           // console.log("mergedCustomer_id",mergedCustomer_id)
//           // console.log("mergedSelectedEmployeeId",mergedSelectedEmployeeId)
//           // console.log("mergedPhone",mergedPhone)
//           // console.log("mergedUserName",mergedUserName)
//           // console.log("mergedPreferredPlatform",mergedPreferredPlatform)

//           companyDB.query(
//             "INSERT INTO merged_chats (customer_id,selected_employee_id,sender_id,name, email, phone, user_name, preferred_platform) VALUES (?,?, ?,?, ?, ?, ?, ?)",
//             [mergedCustomer_id, mergedSelectedEmployeeId,mergedSenderId,mergedName, mergedEmail, mergedPhone, mergedUserName, mergedPreferredPlatform],
//             (insertErr, insertResult) => {
//               if (insertErr) {
//                 console.error("Error inserting merged chat:", insertErr);
//                 return res.status(500).json({ error: "Failed to insert merged chat" });
//               }

//               const mergedChatId = insertResult.insertId;

//               // Update the status of chats in all_chats table to 2 (merged)
//               companyDB.query(
//                 "UPDATE all_chats SET is_merged = 1 WHERE id IN (?)",
//                 [chat_ids],
//                 (updateErr, updateResult) => {
//                   if (updateErr) {
//                     console.error("Error updating chat status:", updateErr);
//                     return res.status(500).json({ error: "Failed to update chat status" });
//                   }
//               // req.io.emit('mergedChat', { chatId: insertResult.insertId });
//                // Emit an event to notify clients that chats have been merged
//                req.io.emit('chatsMerged', { chatIds: chat_ids, mergedChatId: mergedChatId });

//               res.status(200).json({ message: "Chats merged successfully", chatId: insertResult.insertId });
//               companyDB.end();
//             }
//           );
//             }
//           );

//         }
//       );
//     }
//   );
// };

const mergeChats = (req, res) => {
  const { chatIds, user_id, merged_name } = req.body;

  console.log("chatIds", chatIds);

  // Check if chatIds array is provided and contains at least two chat IDs
  if (!chatIds || chatIds?.length < 2) {
    return res
      .status(400)
      .json({ error: "At least two chat IDs are required to merge" });
  }

  // Extract the user ID from the request
  // const { user_id, merged_name } = req.body;

  // Query to fetch the company database name based on user ID
  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [user_id],
    (selectDbErr, dbResult) => {
      if (selectDbErr) {
        console.error("Error fetching company database:", selectDbErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (dbResult.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      const companyDbName = dbResult[0].company_database;

      // Connect to the company database
      const companyDB = CompanyDBConnection(companyDbName);
      companyDB.connect();

      // Start a transaction to ensure atomicity
      companyDB.beginTransaction((err) => {
        if (err) {
          console.error("Error starting transaction:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Query to insert a new record in merged_chats table
        companyDB.query(
          "INSERT INTO merged_chats (merged_name) VALUES (?)",
          [merged_name],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error("Error inserting merged chat:", insertErr);
              companyDB.rollback(() => {
                companyDB.end();
                return res.status(500).json({ error: "Failed to merge chats" });
              });
            }

            const mergeId = insertResult.insertId;

            console.log("mergeId", mergeId);
            console.log("chatIds", chatIds);

            // Query to update all_chats table with merge_id
            companyDB.query(
              "UPDATE all_chats SET merge_id = ?, is_merged = 1 WHERE id IN (?)",
              [mergeId, chatIds],
              (updateErr, updateResult) => {
                if (updateErr) {
                  console.error(
                    "Error updating all_chats with merge_id:",
                    updateErr
                  );
                  companyDB.rollback(() => {
                    companyDB.end();
                    return res
                      .status(500)
                      .json({ error: "Failed to merge chats" });
                  });
                }

                // Commit the transaction if successful
                companyDB.commit((commitErr) => {
                  if (commitErr) {
                    console.error("Error committing transaction:", commitErr);
                    companyDB.rollback(() => {
                      companyDB.end();
                      return res
                        .status(500)
                        .json({ error: "Failed to merge chats" });
                    });
                  }

                  req.io.emit("chatsMerged", {
                    chatIds: chatIds,
                    mergedChatId: mergeId,
                  });
                  // Send success response
                  res
                    .status(200)
                    .json({ message: "Chats merged successfully", mergeId });
                  companyDB.end();
                });
              }
            );
          }
        );
      });
    }
  );
};

// GET ALL MERGED CHATS

// const getAllMergedChats = (req, res) => {
//   const { user_id, selected_employee_id } = req.query;

//   // Fetch the company database name for the user
//   aiBotsDB.query(
//     "SELECT company_database FROM users WHERE user_id = ?",
//     [user_id],
//     (selectDbErr, dbResult) => {
//       if (selectDbErr) {
//         console.error("Error fetching company database:", selectDbErr);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (dbResult.length === 0) {
//         return res.status(404).json({ error: "Company not found" });
//       }

//       const companyDbName = dbResult[0].company_database;
//       console.log(companyDbName);

//       // Connect to the company database
//       const companyDB = CompanyDBConnection(companyDbName);
//       companyDB.connect();

//       // Fetch all chats based on the selectedEmployeeId
//       companyDB.query(
//         "SELECT * FROM merged_chats WHERE selected_employee_id = ?",
//         [selected_employee_id],
//         (fetchErr, chats) => {
//           if (fetchErr) {
//             console.error("Error fetching chats:", fetchErr);
//             return res.status(500).json({ error: "Internal Server Error" });
//           }

//           // Send the chats data as a response
//           res.status(200).json(chats);

//           // Don't forget to end the connection
//           companyDB.end();
//         }
//       );
//     }
//   );
// };

// const getAllMergedChats = (req, res) => {
//   const { user_id, selected_employee_id } = req.query;

//   // Fetch the company database name for the user
//   aiBotsDB.query(
//     "SELECT company_database FROM users WHERE user_id = ?",
//     [user_id],
//     (selectDbErr, dbResult) => {
//       if (selectDbErr) {
//         console.error("Error fetching company database:", selectDbErr);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (dbResult.length === 0) {
//         return res.status(404).json({ error: "Company not found" });
//       }

//       const companyDbName = dbResult[0].company_database;
//       console.log(companyDbName);

//       // Connect to the company database
//       const companyDB = CompanyDBConnection(companyDbName);
//       companyDB.connect();

//       // Fetch all merged chats based on the selectedEmployeeId
//       companyDB.query(
//         "SELECT all_chats.*, merged_chats.merged_name FROM all_chats INNER JOIN merged_chats ON all_chats.merge_id = merged_chats.id WHERE all_chats.selected_employee_id = ? AND all_chats.is_merged = 1 AND all_chats.merge_id IS NOT NULL",
//         [selected_employee_id],
//         (fetchErr, chats) => {
//           if (fetchErr) {
//             console.error("Error fetching merged chats:", fetchErr);
//             return res.status(500).json({ error: "Internal Server Error" });
//           }

//           // Send the merged chats data as a response
//           res.status(200).json(chats);

//           // Don't forget to end the connection
//           companyDB.end();
//         }
//       );
//     }
//   );
// };

// const getAllMergedChats = (req, res) => {
//   const { user_id, selected_employee_id } = req.query;

//   // Fetch the company database name for the user
//   aiBotsDB.query(
//     "SELECT company_database FROM users WHERE user_id = ?",
//     [user_id],
//     (selectDbErr, dbResult) => {
//       if (selectDbErr) {
//         console.error("Error fetching company database:", selectDbErr);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (dbResult.length === 0) {
//         return res.status(404).json({ error: "Company not found" });
//       }

//       const companyDbName = dbResult[0].company_database;

//       // Connect to the company database
//       const companyDB = CompanyDBConnection(companyDbName);
//       companyDB.connect();

//       // Fetch all merged chats based on the selectedEmployeeId
//       companyDB.query(
//         `SELECT
//             all_chats.selected_employee_id,
//             all_chats.sender_id,
//             all_chats.name,
//             all_chats.email,
//             all_chats.phone,
//             all_chats.user_name,
//             all_chats.preferred_platform,
//             all_chats.role,
//             all_chats.created_at,
//             all_chats.updated_at,
//             all_chats.status,
//             all_chats.is_merged,
//             all_chats.merge_id,
//             GROUP_CONCAT(merged_chats.merged_name) AS merged_name
//         FROM
//             all_chats
//         INNER JOIN
//             merged_chats ON all_chats.merge_id = merged_chats.id
//         WHERE
//             all_chats.selected_employee_id = ?
//             AND all_chats.is_merged = 1
//             AND all_chats.merge_id IS NOT NULL

//         GROUP BY
//             all_chats.selected_employee_id,
//             all_chats.sender_id,
//             all_chats.name,
//             all_chats.email,
//             all_chats.phone,
//             all_chats.user_name,
//             all_chats.preferred_platform,
//             all_chats.role,
//             all_chats.created_at,
//             all_chats.updated_at,
//             all_chats.status,
//             all_chats.is_merged,
//             all_chats.merge_id`,
//         [selected_employee_id],
//         (fetchErr, chats) => {
//           if (fetchErr) {
//             console.error("Error fetching merged chats:", fetchErr);
//             return res.status(500).json({ error: "Internal Server Error" });
//           }

//           // Process the fetched data to merge records with the same selected_employee_id
//           const mergedChats = {};
//           chats.forEach(chat => {
//             const key = chat.selected_employee_id;
//             if (!mergedChats[key]) {
//               mergedChats[key] = chat;
//             } else {
//               mergedChats[key].preferred_platform += `, ${chat.preferred_platform}`;
//               mergedChats[key].merged_name += `, ${chat.merged_name}`;

//             }
//           });

//           // Convert the mergedChats object to an array
//           const mergedChatsArray = Object.values(mergedChats);

//           // Send the merged chats data as a response
//           res.status(200).json(mergedChatsArray);

//           // Don't forget to end the connection
//           companyDB.end();
//         }
//       );
//     }
//   );
// };

const getAllMergedChats = (req, res) => {
  const { user_id, selected_employee_id } = req.query;

  // Fetch the company database name for the user
  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [user_id],
    (selectDbErr, dbResult) => {
      if (selectDbErr) {
        console.error("Error fetching company database:", selectDbErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (dbResult.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      const companyDbName = dbResult[0].company_database;

      // Connect to the company database
      const companyDB = CompanyDBConnection(companyDbName);
      companyDB.connect();

      // Fetch all merged chats based on the selectedEmployeeId
      companyDB.query(
        `SELECT
                  all_chats.selected_employee_id,
                  all_chats.sender_id,
                  all_chats.name,
                  all_chats.email,
                  all_chats.phone,
                  all_chats.user_name,
                  all_chats.preferred_platform,
                  all_chats.role, 
                  all_chats.created_at,
                  all_chats.updated_at,
                  all_chats.status,
                  all_chats.is_merged,
                  all_chats.merge_id,
                  GROUP_CONCAT(merged_chats.merged_name) AS merged_name
              FROM
                  all_chats
              INNER JOIN
                  merged_chats ON all_chats.merge_id = merged_chats.id
              WHERE
                  all_chats.selected_employee_id = ?
                  AND all_chats.is_merged = 1
                  AND all_chats.merge_id IS NOT NULL
              GROUP BY
                  all_chats.selected_employee_id,
                  all_chats.sender_id,
                  all_chats.name,
                  all_chats.email,
                  all_chats.phone,
                  all_chats.user_name,
                  all_chats.preferred_platform,
                  all_chats.role,
                  all_chats.created_at,
                  all_chats.updated_at,
                  all_chats.status,
                  all_chats.is_merged,
                  all_chats.merge_id`,
        [selected_employee_id],
        (fetchErr, chats) => {
          if (fetchErr) {
            console.error("Error fetching merged chats:", fetchErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Process the fetched data to merge records with the same selected_employee_id
          const mergedChats = {};
          chats.forEach((chat) => {
            const key = chat.selected_employee_id;
            if (!mergedChats[key]) {
              mergedChats[key] = chat;
              mergedChats[key].sender_id = ""; // Initialize sender_id
            } else {
              mergedChats[
                key
              ].preferred_platform += `, ${chat.preferred_platform}`;
              mergedChats[key].merged_name += `, ${chat.merged_name}`;
            }
            // Concatenate sender_id only if not equal to 0
            if (chat.sender_id !== 0) {
              if (mergedChats[key].sender_id !== "") {
                mergedChats[key].sender_id += `, ${chat.sender_id}`;
              } else {
                mergedChats[key].sender_id = `${chat.sender_id}`;
              }
            }
          });

          // Convert the mergedChats object to an array
          const mergedChatsArray = Object.values(mergedChats);

          // Send the merged chats data as a response
          res.status(200).json(mergedChatsArray);

          // Don't forget to end the connection
          companyDB.end();
        }
      );
    }
  );
};

//////// ############ Ai bots chats functionality Apis ############////////

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function processChatHistory(req, res) {
  const {
    chatHistory,
    companyId,
    sender_id,
    receiver_id,
    recipient,
    sender,
    platform,
    rcpt,
  } = req.body;

  // console.log(
  //   "chat history ------------------------ : " + JSON.stringify(chatHistory)
  // );
  // if (
  //   !chatHistory ||
  //   !companyId ||
  //   !userId ||
  //   !sessionId ||
  //   !chatId ||
  //   !messageId
  // ) {
  //   console.error("Missing required parameters");
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Missing required parameters" });
  // }

  try {
    // Convert chatHistory to JSON string
    const chatHistoryJson = JSON.stringify(chatHistory);

    // Function to upload JSON to Cloudinary
    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "chatHistory", resource_type: "raw", format: "json" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    };

    // Upload chat history to Cloudinary
    const uploadResponse = await uploadToCloudinary(
      Buffer.from(chatHistoryJson)
    );

    // Prepare data for the POST request
    const data = JSON.stringify({
      company_code: "HM",
      bot_main_category: "omni_assistant",
      bot_sub_category: "incoming_chat",
      additional_param: {
        company_Id: companyId,
        user_Id: companyId,
        sender_id: sender_id,
        receiver_id: receiver_id,
        recipient: recipient,
        sender: sender,
        platform: platform,
        rcpt: rcpt,
        chat_history: uploadResponse.secure_url,
        tag: "answer",
      },
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.AI_BOT_API_URL}/trigger`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    // Send the POST request
    const response = await axios(config);
    // console.log('Response from AI bots:', response.data);

    res.status(200).json({
      success: true,
      message: "Chat history sent successfully",
      public_url: uploadResponse.secure_url,
      response: response.data,
    });
  } catch (error) {
    console.error("Error processing chat history:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing chat history" });
  }
}
// async function processChatHistory(req, res) {
//   const {
//     chatHistory,
//     companyId,
//     sender_id,
//     receiver_id,
//     recipient,
//     sender,
//     platform,
//     rcpt,
//   } = req.body;

//   console.log(
//     "chat history ------------------------ : " + JSON.stringify(chatHistory)
//   );
//   // if (
//   //   !chatHistory ||
//   //   !companyId ||
//   //   !userId ||
//   //   !sessionId ||
//   //   !chatId ||
//   //   !messageId
//   // ) {
//   //   console.error("Missing required parameters");
//   //   return res
//   //     .status(400)
//   //     .json({ success: false, message: "Missing required parameters" });
//   // }

//   try {
//     // Convert chatHistory to JSON string
//     const chatHistoryJson = JSON.stringify(chatHistory);

//     // Function to upload JSON to Cloudinary
//     const uploadToCloudinary = (buffer) => {
//       return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           { folder: "chatHistory", resource_type: "raw", format: "json" },
//           (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result);
//             }
//           }
//         );
//         streamifier.createReadStream(buffer).pipe(uploadStream);
//       });
//     };

//     // Upload chat history to Cloudinary
//     const uploadResponse = await uploadToCloudinary(
//       Buffer.from(chatHistoryJson)
//     );

//     // Prepare data for the POST request
//     const data = JSON.stringify({
//       company_code: "HM",
//       bot_main_category: "omni_assistant",
//       bot_sub_category: "incoming_chat",
//       additional_param: {
//         company_Id: companyId,
//         user_Id: companyId,
//         sender_id: sender_id,
//         receiver_id: receiver_id,
//         recipient: recipient,
//         sender: sender,
//         platform: platform,
//         rcpt: rcpt,
//         chat_history: uploadResponse.secure_url,
//         tag: "answer",
//       },
//     });

//     const config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `${process.env.AI_BOT_API_URL}/trigger`,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: data,
//     };

//     // Send the POST request
//     const response = await axios(config);
//     // console.log('Response from AI bots:', response.data);

//     res.status(200).json({
//       success: true,
//       message: "Chat history sent successfully",
//       public_url: uploadResponse.secure_url,
//       response: response.data,
//     });
//   } catch (error) {
//     console.error("Error processing chat history:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error processing chat history" });
//   }
// }

// next task API

// controllers/nextTaskController.js

// controllers/nextTaskController.js

const handleNextTaskForAiBot = async (req, res) => {
  try {
    const {
      company_Id,
      user_Id,
      sender_id,
      receiver_id,
      message,
      recipient,
      sender,
      platform,
      rcpt,
      next_status,
    } = req.body;

    // if (!user_id || !sender_id || !receiver_id || !message || !recipient || !platform) {
    //   console.error("Missing required parameters");
    //   return res.status(400).json({ success: false, message: "Missing required parameters" });
    // }

    res.status(200).json({
      success: true,
      message: "Next task processed successfully",
      data: {
        company_Id,
        user_Id,
        sender_id,
        receiver_id,
        message,
        recipient,
        sender,
        platform,
        rcpt,
        next_status,
      },
    });
  } catch (error) {
    console.error("Error processing next task:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing next task" });
  }
};

//########## HANDLE AUTO / MANUAL TAB API ############//

const ToggleAutoManualTab = (req, res) => {
  const { companyId, employeeId, mode } = req.body;

  if (!companyId || !employeeId || !mode) {
    return res
      .status(400)
      .json({ error: "All fields are required: companyId, employeeId, mode" });
  }

  // Retrieve the company's database name from the users table
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
      const companyDB = CompanyDBConnection(companyDBName);

      // Connect to the database
      companyDB.connect();

      // Insert the new mode into the employees table
      const query = `
        INSERT INTO employees (employee_id, mode)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE mode = VALUES(mode);
      `;

      companyDB.query(query, [employeeId, mode], (queryErr, queryResults) => {
        // Close the database connection after the query
        companyDB.end();

        if (queryErr) {
          console.error("Error updating employee mode:", queryErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({ message: "Employee mode updated successfully", mode: mode });
      });
    }
  );
};

// GET CURRENT MODE API EITHER AUTO OR MANUAL

const getCurrentMode = (req, res) => {
  const { companyId, employeeId } = req.query;

  if (!companyId || !employeeId) {
    return res
      .status(400)
      .json({ error: "Both companyId and employeeId are required" });
  }

  // Retrieve the company's database name from the users table
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
      const companyDB = CompanyDBConnection(companyDBName);

      // Connect to the database
      companyDB.connect();

      // Query to get the current mode from the employees table
      const query = `
        SELECT mode
        FROM employees
        WHERE employee_id = ?;
      `;

      companyDB.query(query, [employeeId], (queryErr, queryResults) => {
        // Close the database connection after the query
        companyDB.end();

        if (queryErr) {
          console.error("Error retrieving employee mode:", queryErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (queryResults.length === 0) {
          return res.status(404).json({ error: "Employee not found" });
        }

        res.json({ mode: queryResults[0].mode });
      });
    }
  );
};

// ################## SEARCH chats API ##################

const searchChats = (req, res) => {
  const { user_id, selected_employee_id, searchTerm } = req.query;

  // Fetch the company database name for the user
  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [user_id],
    (selectDbErr, dbResult) => {
      if (selectDbErr) {
        console.error("Error fetching company database:", selectDbErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (dbResult.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      const companyDbName = dbResult[0].company_database;

      // Connect to the company database
      const companyDB = CompanyDBConnection(companyDbName);
      companyDB.connect();

      // Construct the SQL query to search chats
      const searchQuery = `
        SELECT *
        FROM all_chats
        WHERE selected_employee_id = ? AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR user_name LIKE ? OR preferred_platform LIKE ?)
        ORDER BY created_at DESC
      `;
      const searchParams = [
        selected_employee_id,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
      ];

      // Execute the query
      companyDB.query(searchQuery, searchParams, (fetchErr, chats) => {
        if (fetchErr) {
          console.error("Error searching chats:", fetchErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Send the search results as a response
        res.status(200).json(chats);

        // Don't forget to end the connection
        companyDB.end();
      });
    }
  );
};

// ################## SUPDATE CHAT MODE API ##################

const updateChatMode = (req, res) => {
  const { user_id, customer_id, mode, preferred_platform } = req.body;

  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [user_id],
    (selectDbErr, dbResult) => {
      if (selectDbErr) {
        console.error("Error fetching company database:", selectDbErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (dbResult.length === 0) {
        return res.status(404).json({ error: "Company not found" });
      }

      const companyDbName = dbResult[0].company_database;
      const companyDB = CompanyDBConnection(companyDbName);
      companyDB.connect();

      companyDB.query(
        "UPDATE all_chats SET mode = ? WHERE  customer_id = ? AND preferred_platform = ?",
        [mode, customer_id, preferred_platform],
        (err, result) => {
          if (err) {
            console.error("Error updating chat mode:", err);
            return res
              .status(500)
              .json({ error: "Failed to update chat mode" });
          }

          req.io.emit("updatedChatMode", { customer_id, mode });
          res.status(200).json({ message: "Chat mode updated successfully" });
        }
      );
    }
  );
};

module.exports = {
  employee_login,
  employee_logout,
  get_all_companies_names,
  get_all_employees,
  get_all_customers,
  get_parent_company_details,
  createChat,
  getAllChats,
  mergeChats,
  getAllMergedChats,
  processChatHistory,
  handleNextTaskForAiBot,
  ToggleAutoManualTab,
  getCurrentMode,
  searchChats,
  updateChatMode,
};
