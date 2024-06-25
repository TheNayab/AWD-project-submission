const { aiBotsDB } = require("../DB/db.js");
const mysql = require("mysql2");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const CompanyDBConnection = (companyDBName) => {
  return mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: companyDBName,
  });
};

const sendChatMessage = (req, res) => {
  // const schema = Joi.object({
  //   user_id: Joi.number().required(),
  //   sender_id: Joi.number().required(),
  //   sender_name: Joi.string().required(),
  //   receiver_id: Joi.number().required(),
  //   message: Joi.string().required(),
  // });

  // const { error } = schema.validate(req.body);

  // if (error) {
  //   return res.status(400).json({ error: error.details[0].message });
  // }

  const { user_id, sender_id, sender_name, receiver_id, message } = req.body;

  if (!user_id || !sender_id || !sender_name || !receiver_id || !message) {
    return res.status(400).json({
      error:
        "All fields are required: user_id, sender_id, sender_name, receiver_id, message",
    });
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
        return res.status(404).json({ error: "Sender or receiver not found" });
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

          // Find "web_chat_db" and use it, ignore others
          const webChatDbResult = dbResults.find((result) =>
            result.db_name.includes("web_chat_db")
          );

          console.log("webchatdb", webChatDbResult);

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for sender" });
          }

          const webChatDbName = webChatDbResult.db_name;
          console.log("chat", webChatDbName);

          const webChatDB = CompanyDBConnection(webChatDbName);
          webChatDB.connect();

          webChatDB.query(
            `INSERT INTO chats (user_id, sender_id,sender_name, receiver_id, message,platform) VALUES (?, ?,?, ?, ?, ?)`,
            [user_id, sender_id, sender_name, receiver_id, message, "webchat"],
            (insertErr, result) => {
              if (insertErr) {
                console.error(
                  "Error saving chat message to the database:",
                  insertErr
                );
                return res.status(500).json({ error: "Internal Server Error" });
              }

              const messageId = result.insertId;

              // Join the chat room with the sender_id and receiver_id
              // req.io.to(sender_id).socketsJoin(sender_id);
              // req.io.to(receiver_id).socketsJoin(receiver_id);

              // Emit chat message to the joined room
              // req.io.to(sender_id).emit("chatMessage", {
              //   user_id,
              //   sender_id,
              //   sender_name,
              //   receiver_id,
              //   message,
              // });

              req.io.to(receiver_id).emit("chatMessage", {
                user_id,
                sender_id,
                sender_name,
                receiver_id,
                message,
              });

              webChatDB.end();
            }
          );

          companyDB.end();

          res.json({
            success: true,
            message: "Chat message sent successfully",
          });
        }
      );
    }
  );
};

// const sendChatMessage = (req, res) => {
//   const schema = Joi.object({
//     user_id: Joi.number().required(),
//     sender_id: Joi.number().required(),
//     receiver_id: Joi.number().required(),
//     message: Joi.string().required(),
//   });

//   const { error } = schema.validate(req.body);

//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }

//   const { user_id, sender_id, receiver_id, message } = req.body;

//   aiBotsDB.query(
//     "SELECT company_database FROM users WHERE user_id = ?",
//     [user_id],
//     (selectDbErr, dbResult) => {
//       if (selectDbErr) {
//         console.error("Error fetching company database:", selectDbErr);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (dbResult.length === 0) {
//         return res.status(404).json({ error: "Sender or receiver not found" });
//       }

//       const companyDbName = dbResult[0].company_database;

//       console.log(companyDbName);

//       const companyDB = CompanyDBConnection(companyDbName);

//       companyDB.connect();

//       aiBotsDB.query(
//         "SELECT db_name FROM company_chats_dbs WHERE user_id = ?",
//         [user_id],
//         (selectDbErr, dbResults) => {
//           if (selectDbErr) {
//             console.error("Error fetching chat database:", selectDbErr);
//             return res.status(500).json({ error: "Internal Server Error" });
//           }

//           if (dbResults.length === 0) {
//             return res
//               .status(404)
//               .json({ error: "Chat database not found for sender" });
//           }

//           // Find "web_chat_db" and use it, ignore others
//           const webChatDbResult = dbResults.find(
//             (result) => result.db_name.includes("web_chat_db")
//           );

//           console.log("first", webChatDbResult);

//           if (!webChatDbResult) {
//             return res
//               .status(404)
//               .json({ error: "Web chat database not found for sender" });
//           }

//           const webChatDbName = webChatDbResult.db_name;
//           console.log("chat", webChatDbName);

//           const webChatDB = CompanyDBConnection(webChatDbName);
//           webChatDB.connect();

//           // Retrieve sender_name from both employees and customers tables
//           companyDB.query(
//             `
//             SELECT name FROM employees WHERE employee_id = ?
//             UNION
//             SELECT name FROM customers WHERE customer_id = ?
//             `,
//             [sender_id, sender_id],
//             (senderNameErr, senderNameResult) => {
//               if (senderNameErr) {
//                 console.error("Error fetching sender name:", senderNameErr);
//                 return res.status(500).json({ error: "Internal Server Error" });
//               }

//               if (senderNameResult.length === 0) {
//                 // If sender is not found in employees or customers table, check users table
//                 aiBotsDB.query(
//                   "SELECT name FROM users WHERE user_id = ?",
//                   [sender_id],
//                   (senderNameErr, senderNameResult) => {
//                     if (senderNameErr) {
//                       console.error("Error fetching sender name from users table:", senderNameErr);
//                       return res.status(500).json({ error: "Internal Server Error" });
//                     }

//                     if (senderNameResult && senderNameResult.length > 0) {
//                       const senderName = senderNameResult[0].name;

//                       // Insert chat message into the database
//                       webChatDB.query(
//                         `INSERT INTO chats (user_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)`,
//                         [user_id, sender_id, receiver_id, message],
//                         (insertErr, result) => {
//                           if (insertErr) {
//                             console.error(
//                               "Error saving chat message to the database:",
//                               insertErr
//                             );
//                             return res
//                               .status(500)
//                               .json({ error: "Internal Server Error" });
//                           }

//                           const messageId = result.insertId;

//                           // Join the chat room with the sender_id and receiver_id
//                           req.io.to(sender_id).socketsJoin(sender_id);
//                           req.io.to(receiver_id).socketsJoin(receiver_id);

//                           // Emit chat message to the joined room
//                           req.io.to(sender_id).emit("chatMessage", {
//                             messageId,
//                             sender_id,
//                             receiver_id,
//                             sender_name: senderName, // Include sender_name in the emitted message
//                             message,
//                           });

//                           req.io.to(receiver_id).emit("chatMessage", {
//                             messageId,
//                             sender_id,
//                             receiver_id,
//                             sender_name: senderName, // Include sender_name in the emitted message
//                             message,
//                           });

//                           webChatDB.end();

//                           // Send response with sender_name included
//                           res.json({
//                             success: true,
//                             message: "Chat message sent successfully",
//                             sender_name: senderName // Include sender_name in the response
//                           });
//                         }
//                       );
//                     } else {
//                       return res.status(404).json({ error: "Sender not found in employees, customers, or users table" });
//                     }
//                   }
//                 );
//               } else {
//                 const senderName = senderNameResult[0].name;
//                 // Insert chat message into the database
//                 webChatDB.query(
//                   `INSERT INTO chats (user_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)`,
//                   [user_id, sender_id, receiver_id, message],
//                   (insertErr, result) => {
//                     if (insertErr) {
//                       console.error(
//                         "Error saving chat message to the database:",
//                         insertErr
//                       );
//                       return res
//                         .status(500)
//                         .json({ error: "Internal Server Error" });
//                     }

//                     const messageId = result.insertId;

//                     // Join the chat room with the sender_id and receiver_id
//                     req.io.to(sender_id).socketsJoin(sender_id);
//                     req.io.to(receiver_id).socketsJoin(receiver_id);

//                     // Emit chat message to the joined room
//                     req.io.to(sender_id).emit("chatMessage", {
//                       messageId,
//                       sender_id,
//                       receiver_id,
//                       sender_name: senderName, // Include sender_name in the emitted message
//                       message,
//                     });

//                     req.io.to(receiver_id).emit("chatMessage", {
//                       messageId,
//                       sender_id,
//                       receiver_id,
//                       sender_name: senderName, // Include sender_name in the emitted message
//                       message,
//                     });

//                     webChatDB.end();

//                     // Send response with sender_name included
//                     res.json({
//                       success: true,
//                       message: "Chat message sent successfully",
//                       sender_name: senderName // Include sender_name in the response
//                     });
//                   }
//                 );
//               }
//             }
//           );
//         }
//       );
//     }
//   );
// };

const getAllMessages = (req, res) => {
  // const schema = Joi.object({
  //   user_id: Joi.number().required(),
  //   sender_id: Joi.number().required(),
  //   receiver_id: Joi.number().required(),
  // });

  // const { error } = schema.validate(req.query);

  // if (error) {
  //   return res.status(400).json({ error: error.details[0].message });
  // }

  const { user_id, sender_id, receiver_id } = req.query;

  if (!user_id || !sender_id || !receiver_id) {
    return res.status(400).json({
      error: "All fields are required: user_id, sender_id, receiver_id",
    });
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

          // Find any database name containing "web_chat_db" and use it, ignore others
          const webChatDbResult = dbResults.find((result) =>
            result.db_name.includes("web_chat_db")
          );

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for user" });
          }

          const webChatDbName = webChatDbResult.db_name;

          const chatDB = CompanyDBConnection(webChatDbName);

          chatDB.connect();

          chatDB.query(
            "SELECT * FROM chats WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
            [sender_id, receiver_id, receiver_id, sender_id],
            (fetchErr, messages) => {
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

              // Join the chat room with the sender_id and receiver_id
              req.io.to(sender_id).socketsJoin(sender_id);
              req.io.to(receiver_id).socketsJoin(receiver_id);

              req.io.to(sender_id).emit("messagesFetched", {
                user_id,
                sender_id,
                receiver_id,
              });

              chatDB.end();

              res.json({ success: true, messages });
            }
          );
        }
      );
    }
  );
};

const getLastWebchatMessages = (req, res) => {
  const { user_id } = req.query;

  console.log("************************************** " + user_id);

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
            result.db_name.includes("web_chat_db")
          );

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for user" });
          }

          const webChatDbName = webChatDbResult.db_name;

          const chatDB = CompanyDBConnection(webChatDbName);
          chatDB.connect();

          let query = `SELECT * FROM chats WHERE user_id = ${user_id} ORDER BY chat_id DESC LIMIT 1`;

          chatDB.query(query, (fetchErr, messages) => {
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
            console.log(messages);
            res.json({ success: true, messages });   
          });
        }
      );
    }
  );
};

// GET LATEST MESSAGE

// Controller function for the get_latest_message API endpoint
const getLatestMessage = (req, res) => {
  // const schema = Joi.object({
  //   user_id: Joi.number().required(),
  //   sender_id: Joi.number().required(),
  //   receiver_id: Joi.number().required(),
  // });

  // const { error } = schema.validate(req.query);

  // if (error) {
  //   return res.status(400).json({ error: error.details[0].message });
  // }

  const { user_id, sender_id, receiver_id } = req.query;

  if (!user_id || !sender_id || !receiver_id) {
    return res.status(400).json({
      error: "All fields are required: user_id, sender_id, receiver_id",
    });
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

          // Find any database name containing "web_chat_db" and use it, ignore others
          const webChatDbResult = dbResults.find((result) =>
            result.db_name.includes("web_chat_db")
          );

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for user" });
          }

          const webChatDbName = webChatDbResult.db_name;

          const chatDB = CompanyDBConnection(webChatDbName);

          chatDB.connect();

          // Fetch latest message query
          chatDB.query(
            "SELECT * FROM chats WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp DESC LIMIT 1",
            [sender_id, receiver_id, receiver_id, sender_id],
            (fetchErr, latestMessage) => {
              if (fetchErr) {
                console.error("Error fetching latest message:", fetchErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              if (latestMessage.length === 0) {
                return res.status(404).json({ error: "No messages found" });
              }

              // Join the chat room with the sender_id and receiver_id
              // req.io.to(sender_id).socketsJoin(sender_id);
              // req.io.to(receiver_id).socketsJoin(receiver_id);

              // req.io.to(sender_id).emit("latestMessage", {
              //   user_id,
              //   sender_id,
              //   receiver_id,
              // });
              // req.io.to(receiver_id).emit("latestMessage", {
              //   user_id,
              //   sender_id,
              //   receiver_id,
              // });

              // Emit the latest message directly to the receiver's socket
              req.io.to(sender_id).emit("latestMessage", {
                user_id,
                sender_id,
                receiver_id,
                message: latestMessage[0],
              });

              req.io.to(receiver_id).emit("latestMessage", {
                user_id,
                sender_id,
                receiver_id,
                message: latestMessage[0],
              });

              chatDB.end();

              res.json({ success: true, latestMessage });
            }
          );
        }
      );
    }
  );
};

// GET ALL CONTACTS

// const getAllContacts = (req, res) => {
//   const schema = Joi.object({
//     company_id: Joi.number().required(),
//     user_id: Joi.number().required(),
//   });

//   const { error } = schema.validate(req.query);

//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }

//   const { company_id, user_id } = req.query;

//   aiBotsDB.query(
//     "SELECT company_database FROM users WHERE user_id = ?",
//     [company_id],
//     (selectDbErr, dbResult) => {
//       if (selectDbErr) {
//         console.error("Error fetching company database:", selectDbErr);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (dbResult.length === 0) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       const companyDbName = dbResult[0].company_database;

//       const companyDB = CompanyDBConnection(companyDbName);

//       companyDB.connect();

//       aiBotsDB.query(
//         'SELECT db_name FROM company_chats_dbs WHERE user_id = ?',
//         [company_id],
//         (selectDbErr, dbResults) => {
//           if (selectDbErr) {
//             console.error('Error fetching chat database:', selectDbErr);
//             return res.status(500).json({ error: 'Internal Server Error' });
//           }

//           if (dbResults.length === 0) {
//             return res.status(404).json({ error: 'Company not found' });
//           }

//           const webChatDbResult = dbResults.find(
//             (result) => result.db_name.includes("web_chat_db")
//           );

//           if (!webChatDbResult) {
//             return res
//               .status(404)
//               .json({ error: "Web chat database not found for user" });
//           }

//           const webChatDbName = webChatDbResult.db_name;

//           const chatDB = CompanyDBConnection(webChatDbName);

//           chatDB.connect();

//           chatDB.query(
//             'SELECT * FROM chats WHERE sender_id = ? OR receiver_id = ? ORDER BY timestamp DESC LIMIT 1',
//             [user_id, user_id],
//             (fetchErr, contacts) => {
//               if (fetchErr) {
//                 console.error('Error fetching contacts from the database:', fetchErr);
//                 return res.status(500).json({ error: 'Internal Server Error' });
//               }

//               if (contacts.length === 0) {
//                 return res.status(404).json({ error: 'No contacts found' });
//               }

//               // Emit the 'contactsUpdated' event to notify clients about the updated contacts
//               // Assuming `req.socket` is the correct Socket.IO instance for the client's connection
//               req.socket.emit('contactsUpdated');

//               chatDB.end();

//               // Send the response with the updated contacts
//               res.json({ success: true, contacts: [contacts[0]] });
//             }
//           );

//         }
//       );
//     }
//   );
// };

const getAllContacts = (req, res) => {
  // const schema = Joi.object({
  //   company_id: Joi.number().required(),
  //   user_id: Joi.number().required(),
  // });

  // const { error } = schema.validate(req.query);

  // if (error) {
  //   return res.status(400).json({ error: error.details[0].message });
  // }

  const { company_id, user_id } = req.query;

  if (!company_id || !user_id) {
    return res
      .status(400)
      .json({ error: "All fields are required: company_id, user_id" });
  }

  aiBotsDB.query(
    "SELECT company_database FROM users WHERE user_id = ?",
    [company_id],
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
        [company_id],
        (selectDbErr, dbResults) => {
          if (selectDbErr) {
            console.error("Error fetching chat database:", selectDbErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (dbResults.length === 0) {
            return res.status(404).json({ error: "Company not found" });
          }

          const webChatDbResult = dbResults.find((result) =>
            result.db_name.includes("web_chat_db")
          );

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for user" });
          }

          const webChatDbName = webChatDbResult.db_name;

          const chatDB = CompanyDBConnection(webChatDbName);

          chatDB.connect();

          chatDB.query(
            "SELECT * FROM chats WHERE sender_id = ? OR receiver_id = ? ORDER BY timestamp DESC LIMIT 2",
            [user_id, user_id],
            (fetchErr, contacts) => {
              if (fetchErr) {
                console.error(
                  "Error fetching contacts from the database:",
                  fetchErr
                );
                return res.status(500).json({ error: "Internal Server Error" });
              }

              if (contacts.length === 0) {
                return res.status(404).json({ error: "No contacts found" });
              }

              // Emit the 'contactsUpdated' event to notify clients about the updated contacts
              // Assuming `req.socket` is the correct Socket.IO instance for the client's connection
              req.socket.emit("contactsUpdated");

              chatDB.end();

              // Send the response with the updated contacts
              res.json({ success: true, contacts });
            }
          );
        }
      );
    }
  );
};

// ############## webchat link ######################## //// webchat link ########

// const generateWebChatLink = (req, res) => {
//   const { user_id, generator_id } = req.body;

//   if (!user_id || !generator_id) {
//     return res.status(400).json({ error: 'Both user_id and generator_id are required' });
//   }

//   const chatLink = uuidv4(); // Generating unique token using UUID v4 method
//   const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expiry time set to 24 hours from now

//   // Check if the expiry time has passed
//   if (expiryTime < new Date()) {
//     return res.status(400).json({ error: 'The link has expired' });
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
//         return res.status(404).json({ error: "Sender not found" });
//       }

//       const companyDbName = dbResult[0].company_database;

//       const companyDB = CompanyDBConnection(companyDbName);
//       companyDB.connect();

//       // Check if there is an existing record with the same generator_id
//       companyDB.query(
//         `SELECT * FROM chat_links WHERE user_id = ? AND generator_id = ?`,
//         [user_id, generator_id],
//         (selectErr, existingLinkResult) => {
//           if (selectErr) {
//             console.error("Error checking existing chat link:", selectErr);
//             return res.status(500).json({ error: "Internal Server Error" });
//           }

//           if (existingLinkResult.length > 0) {
//             // Update the existing record with the new chat link and expiry time
//             companyDB.query(
//               `UPDATE chat_links SET chat_link = ?, link_expiry = ? WHERE user_id = ? AND generator_id = ?`,
//               [chatLink, expiryTime, user_id, generator_id],
//               (updateErr, updateResult) => {
//                 if (updateErr) {
//                   console.error("Error updating chat link:", updateErr);
//                   return res.status(500).json({ error: "Internal Server Error" });
//                 }
//                 companyDB.end();
//                 res.json({
//                   success: true,
//                   chat_link: chatLink,
//                   expiry_time: expiryTime,
//                 });
//               }
//             );
//           } else {
//             // Insert the new record into chat_links table
//             companyDB.query(
//               `INSERT INTO chat_links (user_id, generator_id, chat_link, link_expiry) VALUES (?, ?, ?, ?)`,
//               [user_id, generator_id, chatLink, expiryTime],
//               (insertErr, insertResult) => {
//                 if (insertErr) {
//                   console.error("Error inserting chat link:", insertErr);
//                   return res.status(500).json({ error: "Internal Server Error" });
//                 }
//                 companyDB.end();
//                 res.json({
//                   success: true,
//                   chat_link: chatLink,
//                   expiry_time: expiryTime,
//                 });
//               }
//             );
//           }
//         }
//       );
//     }
//   );
// };

const generateWebChatLink = (req, res) => {
  const { user_id, generator_id, generator_name } = req.body;

  if (!user_id || !generator_id || !generator_name) {
    return res.status(400).json({
      error: "All fields user_id, generator_id and generator_name are required",
    });
  }

  const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expiry time set to 24 hours from now

  // Check if the expiry time has passed
  if (expiryTime < new Date()) {
    return res.status(400).json({ error: "The link has expired" });
  }

  // Create JWT payload
  const payload = {
    user_id,
    generator_id,
    generator_name,
  };

  // Sign JWT with a secret key
  jwt.sign(
    payload,
    process.env.WEB_CHAT_LINK_SECRET,
    { expiresIn: "24h" },
    (err, token) => {
      if (err) {
        console.error("Error generating JWT:", err);
        return res.status(500).json({ error: "Internal Server Error" });
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
            return res.status(404).json({ error: "Sender not found" });
          }

          const companyDbName = dbResult[0].company_database;

          const companyDB = CompanyDBConnection(companyDbName);
          companyDB.connect();

          // Check if there is an existing record with the same generator_id
          companyDB.query(
            `SELECT * FROM chat_links WHERE user_id = ? AND generator_id = ?`,
            [user_id, generator_id],
            (selectErr, existingLinkResult) => {
              if (selectErr) {
                console.error("Error checking existing chat link:", selectErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              if (existingLinkResult.length > 0) {
                // Update the existing record with the new chat link and expiry time
                companyDB.query(
                  `UPDATE chat_links SET chat_link = ?, link_expiry = ? WHERE user_id = ? AND generator_id = ?`,
                  [token, expiryTime, user_id, generator_id],
                  (updateErr, updateResult) => {
                    if (updateErr) {
                      console.error("Error updating chat link:", updateErr);
                      return res
                        .status(500)
                        .json({ error: "Internal Server Error" });
                    }
                    companyDB.end();
                    res.json({
                      success: true,
                      chat_link: token,
                      expiry_time: expiryTime,
                    });
                  }
                );
              } else {
                // Insert the new record into chat_links table
                companyDB.query(
                  `INSERT INTO chat_links (user_id, generator_id, chat_link, link_expiry) VALUES (?, ?, ?, ?)`,
                  [user_id, generator_id, token, expiryTime],
                  (insertErr, insertResult) => {
                    if (insertErr) {
                      console.error("Error inserting chat link:", insertErr);
                      return res
                        .status(500)
                        .json({ error: "Internal Server Error" });
                    }
                    companyDB.end();
                    res.json({
                      success: true,
                      chat_link: token,
                      expiry_time: expiryTime,
                    });
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

// ###### GET GENERATED LINK  #####

const getGeneratedLink = (req, res) => {
  const { user_id, generator_id } = req.query;

  if (!user_id || !generator_id) {
    return res
      .status(400)
      .json({ error: "Both user_id and generator_id are required" });
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

      // Fetch the generated link from the chat_links table
      companyDB.query(
        `SELECT chat_link, link_expiry FROM chat_links WHERE user_id = ? AND generator_id = ?`,
        [user_id, generator_id],
        (selectErr, linkResult) => {
          if (selectErr) {
            console.error("Error fetching generated link:", selectErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (linkResult.length === 0) {
            return res.status(404).json({ error: "Generated link not found" });
          }

          const { chat_link, link_expiry } = linkResult[0];

          // Check if the link has expired
          if (new Date() > link_expiry) {
            return res
              .status(400)
              .json({ error: "Generated link has expired" });
          }

          companyDB.end();
          res.json({
            success: true,
            chat_link: chat_link,
            expiry_time: link_expiry,
          });
        }
      );
    }
  );
};

// SEND WEBCHAT MESSAGE FOR GUEST USER

const sendChatMessageForGuest = (req, res) => {
  const { user_id, sender_id, sender_name, receiver_id, message,direction,message_type } = req.body;
  // console.log("Sender id is " + sender_id);
  if (!user_id || !sender_id || !sender_name || !receiver_id || !message) {
    return res.status(400).json({
      error:
        "All fields are required: user_id, sender_id, sender_name, receiver_id, message",
    });
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
        return res.status(404).json({ error: "Sender or receiver not found" });
      }

      const companyDbName = dbResult[0].company_database;
      const companyDB = CompanyDBConnection(companyDbName);

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

          const webChatDbResult = dbResults.find((result) =>
            result.db_name.includes("web_chat_db")
          );

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for sender" });
          }

          const webChatDbName = webChatDbResult.db_name;
          const webChatDB = CompanyDBConnection(webChatDbName);

          webChatDB.query(
            `INSERT INTO chats (user_id, sender_id, sender_name, receiver_id, message, platform,direction,message_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, sender_id, sender_name, receiver_id, message, "webchat",direction,message_type],
            (insertErr, result) => {
              if (insertErr) {
                console.error(
                  "Error saving chat message to the database:",
                  insertErr
                );
                return res.status(500).json({ error: "Internal Server Error" });
              }

              // Check if an entry already exists for the sender_id in the all_chats table
              companyDB.query(
                "SELECT * FROM all_chats WHERE sender_id = ?",
                [sender_id],
                (selectErr, selectResult) => {
                  if (selectErr) {
                    console.error(
                      "Error checking existing entry in all_chats:",
                      selectErr
                    );
                    return res
                      .status(500)
                      .json({ error: "Internal Server Error" });
                  }

                  if (selectResult.length === 0) {
                    // No entry exists, insert a new one
                    companyDB.query(
                      "INSERT INTO all_chats (customer_id, selected_employee_id, sender_id, name, email, phone, user_name, preferred_platform) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                      [
                        receiver_id,
                        receiver_id,
                        sender_id,
                        sender_name,
                        "email",
                        "phone",
                        "user_name",
                        "webchat",
                      ],
                      (insertErr, insertResult) => {
                        if (insertErr) {
                          console.error(
                            "Error inserting chat data:",
                            insertErr
                          );
                          return res
                            .status(500)
                            .json({ error: "Failed to save data to database" });
                        }

                        req.io.emit("newChat", {
                          chatId: insertResult.insertId,
                        });
                        res.status(201).json({
                          message: "Chat started successfully",
                          chatId: insertResult.insertId,
                        });
                      }
                    );
                  } else {
                    // Entry already exists, update it
                    companyDB.query(
                      "UPDATE all_chats SET customer_id = ?, selected_employee_id = ?, name = ?, email = ?, phone = ?, user_name = ?, preferred_platform = ? WHERE sender_id = ?",
                      [
                        receiver_id,
                        receiver_id,
                        sender_name,
                        "email",
                        "phone",
                        "user_name",
                        "webchat",
                        sender_id,
                      ],
                      (updateErr, updateResult) => {
                        if (updateErr) {
                          console.error(
                            "Error updating existing chat data:",
                            updateErr
                          );
                          return res.status(500).json({
                            error: "Failed to update data in database",
                          });
                        }

                        req.io.emit("newChat", {
                          chatId: selectResult[0].chat_id,
                        });
                        res.status(200).json({
                          message: "Chat updated successfully",
                          chatId: selectResult[0].chat_id,
                        });
                      }
                    );
                  }
                }
              );
            }
          );
        }
      );
    }
  );
};

module.exports = {
  sendChatMessage,
  getAllMessages,
  getLatestMessage,
  getAllContacts,
  generateWebChatLink,
  getGeneratedLink,
  sendChatMessageForGuest,
  getLastWebchatMessages,
};
