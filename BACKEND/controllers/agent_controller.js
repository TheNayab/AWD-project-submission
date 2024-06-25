const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { aiBotsDB } = require('../DB/db.js');
const mysql = require("mysql2");




// ### ADD CUSTOMER BY AGENT API

// const add_customer = (req, res) => {
//   try {
//     // Input validation using Joi
//     const schema = Joi.object({
//       agent_id: Joi.number().required(),
//       user_name: Joi.string().email().required(),
//       name: Joi.string(),
//       role: Joi.string().valid('customer').default('customer'),
//       gender: Joi.string(),
//       contact: Joi.string(),
//       password: Joi.string().required(),
//     });

//     const { error } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     const { agent_id, user_name, name, gender,contact, password } = req.body;

//     // Check if the user making the request is an agent
//     aiBotsDB.query('SELECT * FROM users WHERE id = ? AND role = "agent"', [agent_id], (agentErr, agentResults) => {
//       if (agentErr) {
//         console.error('Error checking agent:', agentErr);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       const agent = agentResults[0];

//       if (!agent) {
//         return res.status(403).json({ error: 'Access forbidden. Only agents can add customers.' });
//       }

//       // Check if the customer already exists
//       aiBotsDB.query('SELECT * FROM users WHERE user_name = ?', [user_name], (existingCustomerErr, existingCustomerResults) => {
//         if (existingCustomerErr) {
//           console.error('Error checking existing customer:', existingCustomerErr);
//           return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         const existingCustomer = existingCustomerResults[0];

//         if (existingCustomer) {
//           return res.status(409).json({ error: 'Customer already exists.' });
//         }

//         // Hash the password
//         bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
//           if (hashErr) {
//             console.error('Error hashing password:', hashErr);
//             return res.status(500).json({ error: 'Internal Server Error' });
//           }

//           // Insert customer details into the users table with hashed password
//           aiBotsDB.query(
//             'INSERT INTO users (user_name, role, name, gender,contact, password) VALUES (?, ?, ?, ?, ?, ?)',
//             [user_name, 'customer',name, gender,contact, hashedPassword],
//             (insertErr, result) => {
//               if (insertErr) {
//                 console.error('Error adding customer:', insertErr);
//                 return res.status(500).json({ error: 'Internal Server Error' });
//               }

//               const customer_id = result.insertId;

//               // Link the customer to the customers table
//               aiBotsDB.query('INSERT INTO customers (user_id, agent_id) VALUES (?, ?)', [customer_id, agent_id], (linkErr) => {
//                 if (linkErr) {
//                   console.error('Error linking customer to agent:', linkErr);
//                   return res.status(500).json({ error: 'Internal Server Error' });
//                 }

//                 res.json({ message: 'Customer added successfully', customer_id });
//               });
//             }
//           );
//         });
//       });
//     });
//   } catch (error) {
//     console.error('Error in add_customer:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };



// const add_company = (req, res) => {
//   try {
//     // Input validation using Joi
//     const schema = Joi.object({
//       user_name: Joi.string().required(),
//       name: Joi.string().required(),
//       email: Joi.string().email().required(),
//       phone: Joi.string(),
//       password: Joi.string().required(),
//     });

//     const { error } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     const { user_name, name, email, phone, password } = req.body;

//     // Check if the company with the given user_name already exists
//     aiBotsDB.query('SELECT * FROM users WHERE user_name = ? OR email = ?', [user_name,email], (existingCompanyErr, existingCompanyResults) => {
//       if (existingCompanyErr) {
//         console.error('Error checking existing company:', existingCompanyErr);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       const existingCompany = existingCompanyResults[0];
//       // console.log(existingCompany)

//       if (existingCompany) {
//         return res.status(409).json({ error: 'Company already exists.' });
//       }

//       // Hash the password
//       bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
//         if (hashErr) {
//           console.error('Error hashing password:', hashErr);
//           return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         // Insert company details into the users table with hashed password
//         aiBotsDB.query(
//           'INSERT INTO users (user_name, role, name, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)',
//           [user_name, 'company', name, email, phone, hashedPassword],
//           (insertErr, result) => {
//             if (insertErr) {
//               console.error('Error adding company:', insertErr);
//               return res.status(500).json({ error: 'Internal Server Error' });
//             }

//             const companyId = result.insertId;

//             // Insert company details into the companies table
//             aiBotsDB.query('INSERT INTO companies (user_id) VALUES (?)', [companyId], (companyInsertErr) => {
//               if (companyInsertErr) {
//                 console.error('Error adding company to companies table:', companyInsertErr);
//                 return res.status(500).json({ error: 'Internal Server Error' });
//               }

//               res.json({ message: 'Company added successfully', company_id: companyId });
//             });
//           }
//         );
//       });
//     });
//   } catch (error) {
//     console.error('Error in addCompany:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };






// ######### CHANGE PASSWORD API 



const change_password_of_agent = (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      user_id: Joi.number().required(),
      current_password: Joi.string().required(),
      new_password: Joi.string().required(),
      confirm_new_password: Joi.string().required(), 
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id, current_password, new_password, confirm_new_password } = req.body;

    const logged_in_user = req.user.user_id
    if (logged_in_user !== user_id) {
        return res.status(403).json({ error: 'Forbidden! you are not authorized to change the password' });
      }
   

    // Additional check to ensure new_password matches confirm_new_password
    if (new_password !== confirm_new_password) {
      return res.status(400).json({ error: 'New password and confirm new password do not match' });
    }

    // Fetch user details from the database
    aiBotsDB.query('SELECT * FROM users WHERE id = ? AND role = "agent" ', [user_id], (fetchErr, fetchResults) => {
      if (fetchErr) {
        console.error('Error fetching user details:', fetchErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const user = fetchResults[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare current password with stored hashed password
      bcrypt.compare(current_password, user.password, (compareErr, passwordMatch) => {
        if (compareErr) {
          console.error('Error comparing passwords:', compareErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!passwordMatch) {
          return res.status(401).json({ error: 'Incorrect current password' });
        }

        // Hash the new password
        bcrypt.hash(new_password, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error('Error hashing new password:', hashErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Update the user's password in the database
          aiBotsDB.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user_id], (updateErr) => {
            if (updateErr) {
              console.error('Error updating password:', updateErr);
              return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json({ message: 'Password changed successfully' });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error in change_password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = {
  // add_company,
  change_password_of_agent
};
