const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const {db, aiBotsDB } = require('../DB/db.js');


const app = express();

//  ADD EMPLYEE BY CUSTOMER API 


const add_employees = (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      customer_id: Joi.number().required(),
      user_name: Joi.string().email().required(),
      name: Joi.string(),
      role: Joi.string().valid('employee').default('employee'),
      gender: Joi.string(),
      contact: Joi.string(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { customer_id, user_name, name, gender,contact, password } = req.body;

    // Check if the user making the request is a customer
    aiBotsDB.query('SELECT * FROM users WHERE id = ? AND role = "customer"', [customer_id], (customerErr, customerResults) => {
      if (customerErr) {
        console.error('Error checking customer:', customerErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const customer = customerResults[0];
    
      if (!customer) {
        return res.status(403).json({ error: 'Access forbidden. Only customers can add employees.' });
      }

      // Check if the employee already exists
      aiBotsDB.query('SELECT * FROM users WHERE user_name = ?', [user_name], (existingEmployeeErr, existingEmployeeResults) => {
        if (existingEmployeeErr) {
          console.error('Error checking existing employee:', existingEmployeeErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const existingEmployee = existingEmployeeResults[0];

        if (existingEmployee) {
          return res.status(409).json({ error: 'Employee already exists.' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error('Error hashing password:', hashErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Insert employee details into the users table with hashed password
          aiBotsDB.query(
            'INSERT INTO users (user_name, role, name, gender, contact, password) VALUES (?, ?, ?, ?, ?, ?)',
            [user_name, 'employee', name, gender,contact, hashedPassword],
            (insertErr, result) => {
              if (insertErr) {
                console.error('Error adding employee:', insertErr);
                return res.status(500).json({ error: 'Internal Server Error' });
              }

              const employee_id = result.insertId;

           

              // Link the employee to the employees table
             aiBotsDB.query('INSERT INTO employees (user_id, customer_id) VALUES (?, ?)', [employee_id, customer_id], (linkErr) => {
                if (linkErr) {
                  console.error('Error linking employee to customer:', linkErr);
                  return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.json({ message: 'Employee added successfully', employee_id });
              });
            }
          );
        });
      });
    });
  } catch (error) {
    console.error('Error in add_employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//  GET ALL EMPLOYEES BY CUSTOMER API 


const get_all_employees = (req, res) => {
  try {
    
    const { customer_id } = req.params;

    // Check if the user making the request is a customer
    aiBotsDB.query('SELECT * FROM users WHERE id = ? AND role = "customer"', [customer_id], (customerErr, customerResults) => {
      if (customerErr) {
        console.error('Error checking customer:', customerErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const customer = customerResults[0];

      if (!customer) {
        return res.status(403).json({ error: 'Access forbidden. Only customers can view employees.' });
      }

      // Retrieve all employees associated with the customer
      aiBotsDB.query('SELECT * FROM users u INNER JOIN employees e ON u.id = e.user_id WHERE e.customer_id = ?', [customer_id], (getEmployeesErr, employees) => {
        if (getEmployeesErr) {
          console.error('Error getting employees:', getEmployeesErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ employees });
      });
    });
  } catch (error) {
    console.error('Error in get_all_employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// UPDATE EMPLOYEE BY CUSTOMER API
// UPDATE EMPLOYEE BY CUSTOMER API
const update_employee = (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      employee_id: Joi.number().required(),
      customer_id: Joi.number().required(),
      user_name: Joi.string().email().required(),
      name: Joi.string(),
      role: Joi.string().valid('employee').default('employee'),
      gender: Joi.string(),
      contact: Joi.string(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { employee_id, customer_id, user_name, name, gender, contact, password } = req.body;

    // Check if the user making the request is a customer
    aiBotsDB.query('SELECT * FROM users WHERE id = ? AND role = "customer"', [customer_id], (customerErr, customerResults) => {
      if (customerErr) {
        console.error('Error checking customer:', customerErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const customer = customerResults[0];

      if (!customer) {
        return res.status(403).json({ error: 'Access forbidden. Only customers can update employees.' });
      }

      // Check if the specified employee exists
      aiBotsDB.query('SELECT * FROM users WHERE id = ? AND role = "employee"', [employee_id], (existingEmployeeErr, existingEmployeeResults) => {
        if (existingEmployeeErr) {
          console.error('Error checking existing employee:', existingEmployeeErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const existingEmployee = existingEmployeeResults[0];

        if (!existingEmployee) {
          return res.status(404).json({ error: 'Employee not found.' });
        }

          // Check if the employee already exists
      aiBotsDB.query('SELECT * FROM users WHERE user_name = ?', [user_name], (existingEmployeeErr, existingEmployeeResults) => {
        if (existingEmployeeErr) {
          console.error('Error checking existing employee:', existingEmployeeErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const existingEmployee = existingEmployeeResults[0];

        if (existingEmployee) {
          return res.status(409).json({ error: 'Employee already exists with this user name.' });
        }


        // Hash the new password
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error('Error hashing password:', hashErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Update employee details in the users table with hashed password
          aiBotsDB.query(
            'UPDATE users SET user_name=?, role=?, name=?, gender=?, contact=?, password=? WHERE id=?',
            [user_name, 'employee', name, gender, contact, hashedPassword, employee_id],
            (updateErr) => {
              if (updateErr) {
                console.error('Error updating employee:', updateErr);
                return res.status(500).json({ error: 'Internal Server Error' });
              }

              res.json({ message: 'Employee updated successfully', employee_id });
            }
          );
        });
      });
      });
    });
  } catch (error) {
    console.error('Error in update_employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// ######### CHANGE PASSWORD API 



const change_password_of_customer = (req, res) => {
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
    aiBotsDB.query('SELECT * FROM users WHERE id = ? AND role = "customer" ', [user_id], (fetchErr, fetchResults) => {
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





// // messenger
// const axios = require('axios');

// const PAGE_ACCESS_TOKEN = 'EAAFoUqZAElzMBO1MvGKrBjBsOfCBMoZAVZCGjOtTccO7jtVoNUqDInE30AZARAXs8RgK5kym9BSZAPmZB2SWxWnCbDAPQaSVoYsZANZBJ3Hyl9FPD25gbMtyfth8lWTRqX9fBa5uhr8qxbZBxGKkYtXeg6Ng4eM1xj0jNfZAEyNYq7z3DtnLgk2Bcfyj6Ew0ZA7XWaf8kNgtWqFEej9SHyYMwZDZD';
// const VERIFY_TOKEN = 'EAAFoUqZAElzMBOwAsjs3Rq6qzlhWgtEUhSsp9vl4CfkbvyWYe7p4GFNub6lyyChSYlN1znkVgS2iVoMOY9ZCVoZCR6hdcDz2ImwYiCZARIhM2hPMDr1bX5gD6XXKqpt24Vr0kdwVjDAWSZBgSESqhH7IuNFFsny9VvYp1KasEHgZCgnRNYoZCVxeCFKbBQ9y8SX';

// // Function to handle incoming messages
// const handleIncomingMessage = (req, res) => {
//   const body = req.body;

//   if (body.object === 'page') {
//     body.entry.forEach((entry) => {
//       const webhookEvent = entry.messaging[0];
//       console.log(webhookEvent);

//       // Handle the incoming message here
//       // You can send a response back using the Messenger API
//       sendTextMessage(webhookEvent.sender.id, 'Hello, this is your chatbot!');
//     });

//     res.status(200).send('EVENT_RECEIVED');
//   } else {
//     res.sendStatus(404);
//   }
// };

// // Function to set up a webhook verification endpoint
// const verifyWebhook = (req, res) => {
//  // Parse the query params
//   let mode = req.query["hub.mode"];
//   let token = req.query["hub.verify_token"];
//   let challenge = req.query["hub.challenge"];

//   // Check if a token and mode is in the query string of the request
//   if (mode && token) {
//     // Check the mode and token sent is correct
//     if (mode === "subscribe" && token === config.verifyToken) {
//       // Respond with the challenge token from the request
//       console.log("WEBHOOK_VERIFIED");
//       res.status(200).send(challenge);
//     } else {
//       // Respond with '403 Forbidden' if verify tokens do not match
//       res.sendStatus(403);
//     }
//   }
// };

// // Function to send a text message using the Messenger API
// const sendTextMessage = (recipientId, messageText) => {
//   const requestBody = {
//     recipient: {
//       id: recipientId,
//     },
//     message: {
//       text: messageText,
//     },
//   };

//   axios.post(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, requestBody)
//     .then(response => {
//       console.log('Message sent:', response.data);
//     })
//     .catch(error => {
//       console.error('Error sending message:', error.response.data);
//     });
// };


// const handleMessage = (req,res)=>{

  
//   // Parse the request body from the POST
//   let body = req.body;

//   // Check the webhook event is from a Page subscription
//   if (body.object === 'page') {

//     // Iterate over each entry - there may be multiple if batched
//     body.entry.forEach(function(entry) {

//       // Get the webhook event. entry.messaging is an array, but 
//       // will only ever contain one event, so we get index 0
//       let webhook_event = entry.messaging[0];
//       console.log(webhook_event);
      
      
//     });

//     // Return a '200 OK' response to all events
//     res.status(200).send('EVENT_RECEIVED');

//   } else {
//     // Return a '404 Not Found' if event is not from a page subscription
//     res.sendStatus(404);
//   }

// }



// const verifyWebhook = (req,res)=>{
//   // Your verify token. Should be a random string.
//   const VERIFY_TOKEN = process.env.FACEBOOK_PAGE_VERIFY_TOKEN;

//   // Parse the query params
//   let mode = req.query['hub.mode'];
//   let token = req.query['hub.verify_token'];
//   let challenge = req.query['hub.challenge'];

//   // Checks if a token and mode is in the query string of the request
//   if (mode && token) {

//     // Checks the mode and token sent is correct
//     if (mode === 'subscribe' && token === VERIFY_TOKEN) {

//       // Responds with the challenge token from the request
//       console.log('WEBHOOK_VERIFIED');
//       res.status(200).send(challenge);

//     } else {
//       // Responds with '403 Forbidden' if verify tokens do not match
//       res.sendStatus(403);
//     }
//   }
// }


const axios = require('axios');
const request = require('request')

const PAGE_ACCESS_TOKEN = "EAAFoUqZAElzMBO2LEZAFrHxxYf1cc6liKEXzSbEZCVcAVjBYsZAvxk0w5YcJBzYn0jh3ZBibZAHrwBc1jZCKwl94IIdnIOOLJ9274zYwVvjnsvNOqbXUnM4MrnvM9SmXATpsvNmGbxwZANYk1gZBLBxAamYLCWGW03IQZC2Ry2nmsv3gwJ4uvhOKF7g6yZAhX4LlAUom97A8dZAl9hZBxc68wQEfmg9ZCygQQZD";

// Function to send a text message using the Messenger API
const sendTextMessage = (recipientId, messageText) => {
  // Construct the request body
  const requestBody = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: messageText,
    },
  };


  // Send the HTTP request to the Messenger Platform
  request({
    'uri': 'https://graph.facebook.com/v18.0/me/messages',
    'qs': { 'access_token': PAGE_ACCESS_TOKEN},
    'method': 'POST',
    'json': requestBody
  }, (err, _res, _body) => {
    if (!err) {
      console.log('Message sent!');
    } else {
      console.error('Unable to send message:' + err);
    }
  });
};

// Updated handleMessage function with sendTextMessage call
const handleMessage = (req, res) => {
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function (entry) {
   
     
      let webhook_event = entry.messaging[0];
      
      // console.log(webhook_event);

      // Extract sender ID and message text from the incoming message
      const senderId = webhook_event.sender.id;
      const messageText = webhook_event.message.text;

      // Send a response back to the user
      sendTextMessage(senderId, `You said: ${messageText}`);
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
};


const verifyWebhook = (req,res)=>{
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = process.env.FACEBOOK_PAGE_VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}

const whatsapp_api = (req,res)=>{

 let mode =  req.query["hub.mode"]
 let challenge = req.query["hub.challenge"]
  let token = req.query["hub.verify_token" ]

  const mytoken = ""

  if(mode && token){
    if(mode==="subscribe" && token===mytoken){
      res.status(200).send(challenge)
    }else{
      res.status(403)
    }
  }
}







const send_message = (req,res)=>{





  const { companyId, employeePhoneNumber, message } = req.body;


  

  // Assuming you have a table named 'companies'
  const selectQuery = 'SELECT contact FROM users WHERE id = ? and role = "customer" ';
  aiBotsDB.query(selectQuery, [companyId], (err, result) => {
    if (err) {
      console.error('Error retrieving WhatsApp credentials: ' + err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const senderPhoneNumber = result[0].contact;

      console.log(senderPhoneNumber)

      client.messages
        .create({
          from: `whatsapp:+14155238886`,
          to: `whatsapp:${employeePhoneNumber}`,
          body: message,
        })
        .then((message) => {
          console.log('WhatsApp message sent: ', message.sid);
          res.json({ message: 'WhatsApp message sent successfully' });
        })
        .catch((err) => {
          console.error('Error sending WhatsApp message: ' + err.message);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    }
  });
}
  
 
module.exports = {
  add_employees,
  get_all_employees,
  update_employee,
  change_password_of_customer,
  handleMessage,
  verifyWebhook,
  send_message
};
