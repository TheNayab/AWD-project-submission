// const { aiBotsDB } = require("../DB/db.js");
// const mysql = require("mysql2");
// const request = require('request');
// const CryptoJS = require("crypto-js");

// const CompanyDBConnection = (companyDBName) => {
//   return mysql.createConnection({
//     host: process.env.host,
//     user: process.env.user,
//     password: process.env.pass,
//     database: companyDBName,
//   });
// };

// // EuroSMS API credentials
// const integrationId = process.env.INTEGRATION_ID;
// const integrationKey = process.env.INTEGRATION_KEY;

// // Function to generate the signature
// function generateSignature(sender, recipient, messageText) {
//     // Concatenate sender, recipient, message text
//     const concatenatedString = `${sender}${recipient}${messageText}`;

//     // Generate SHA-1 hash
//     const signature = CryptoJS.HmacSHA1(concatenatedString, integrationKey).toString(CryptoJS.enc.Hex);

//     return signature;
// }

// // Arrow function to send SMS
// const sendSMS = async (req, res) => {
//     try {
//         // EuroSMS API endpoint
//         const url = process.env.EURO_SMS_URL_SEND_ONE_SMS;

//         // SMS data from request body
//         const { rcpt, txt } = req.body;

//         const sndr = process.env.SENDER_SK || process.env.SENDER_CZ;

//         // Generate signature
//         const signature = generateSignature(sndr, rcpt, txt);

//         // console.log(signature)

//         // Construct SMS data with generated signature
//         const smsData = {
//             iid: integrationId,
//             sgn: signature,
//             rcpt: rcpt,
//             flgs: 3,
//             ttl: 600,
//             sndr: sndr,
//             txt: txt
//         };

//         // Make POST request to EuroSMS API using request library
//         request.post({
//             url: url,
//             json: smsData
//         }, (error, response, body) => {
//             if (error) {
//                 // Return error response
//                 res.status(500).json({ error: 'Error sending SMS', message: error });
//             } else {
//                 // Return response from EuroSMS API
//                 res.status(200).json(body);
//             }
//         });
//     } catch (error) {
//         // Return error response
//         res.status(500).json({ error: 'Error sending SMS', message: error.response.data });
//     }
// };

// module.exports = {
//     sendSMS
// };

const { aiBotsDB } = require("../DB/db.js");
const mysql = require("mysql2");
const request = require("request");
const CryptoJS = require("crypto-js");

const CompanyDBConnection = (companyDBName) => {
  return mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: companyDBName,
  });
};

const sendSMS = (req, res, next) => {
  const { user_id, rcpt, txt,direction,message_type } = req.body;

  if (!user_id || !rcpt || !txt) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // const processedRecipient = rcpt.startsWith("+")
  // ? rcpt.slice(1)
  // : rcpt;

  // Fetch company database name here
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

          //   console.log("dbres",dbResults)

          if (dbResults.length === 0) {
            return res
              .status(404)
              .json({ error: "Chat database not found for sender" });
          }

          // Find "whatsapp_chat_db" and use it, ignore others
          const webChatDbResult = dbResults.find((result) =>
            result.db_name.includes("SMS_chat_db")
          );

          console.log("chatdbconsole", webChatDbResult);

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for sender" });
          }

          const webChatDbName = webChatDbResult.db_name;
          console.log("smschat", webChatDbName);

          // Reuse the existing webChatDB connection
          webChatDB = CompanyDBConnection(webChatDbName);
          webChatDB.connect();

          // Send SMS using EuroSMS API
          // const sndr = process.env.SENDER_SK || process.env.SENDER_CZ;

          let sndr;
          const rcpte = rcpt.toString();

          if (rcpte.startsWith("421")) {
            sndr = process.env.SENDER_SK;
          } else if (rcpte.startsWith("420")) {
            sndr = process.env.SENDER_CZ;
          } else {
            sndr = process.env.SENDER_SK;
          }

          const concatenatedString = `${sndr}${rcpt}${txt}`;
          const signature = CryptoJS.HmacSHA1(
            concatenatedString,
            process.env.INTEGRATION_KEY
          ).toString(CryptoJS.enc.Hex);
          const smsData = {
            iid: process.env.INTEGRATION_ID,
            sgn: signature,
            rcpt: rcpt,
            flgs: 3,
            ttl: 600,
            sndr: sndr,
            txt: txt,
          };

          request.post(
            {
              url: process.env.EURO_SMS_URL_SEND_ONE_SMS,
              json: smsData,
            },
            (error, response, body) => {
              if (error) {
                console.error("Error sending SMS:", error);
                return res.status(500).json({ error: "Error sending SMS" });
              }

              // console.log("body",body)

              const userId = user_id;
              const senderId = sndr;
              const senderName = "EuroSMS";
              const recipient = rcpt;
              const message = txt;
              const platform = "sms";

              // Save sent message to database
              webChatDB.query(
                `INSERT INTO chats ( user_id, sender_id, sender_name, receipient_whatsapp, message, platform,direction,message_type) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, senderId, senderName, recipient, message, platform,direction,message_type],
                (err, result) => {
                  if (err) {
                    console.error(
                      "Error saving sent message to the database:",
                      err
                    );
                  }
                }
              );

              return res.json({
                success: true,
                message: "Message sent successfully",
                body,
              });
            }
          );
        }
      );
    }
  );
};

//####### GET ALL EURO SMS MESSAGES #######//

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

const getLastSMSMessages = (req, res) => {
  const { receipient_whatsapp, user_id } = req.query;

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
              .json({ error: "Web chat database not found for user" });
          }

          const webChatDbName = webChatDbResult.db_name;

          const chatDB = CompanyDBConnection(webChatDbName);
          chatDB.connect();

          let query = `SELECT * FROM chats WHERE receipient_whatsapp = ${receipient_whatsapp} ORDER BY chat_id DESC LIMIT 1`;

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

            res.json({ success: true, messages });
          });
        }
      );
    }
  );
};

// RECEIVED EURO SMS MESSAGE API CODE

// const receivedMessage = (req, res, next) => {
//   const { user_id, sms_uuid, recipient, receive_time, sender, sms_text } = req.body;

//   // Validate incoming data
//   if (!user_id || !sms_uuid || !recipient || !receive_time || !sender || !sms_text) {
//     return res.status(400).json({ error: 'Incomplete message data' });
//   }

//   // Fetch company database name
//   aiBotsDB.query(
//     "SELECT company_database FROM users WHERE user_id = ?",
//     [user_id],
//     (selectDbErr, dbResult) => {
//       if (selectDbErr) {
//         console.error("Error fetching company database:", selectDbErr);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (dbResult.length === 0) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       const companyDbName = dbResult[0].company_database;
//       // console.log("company",companyDbName)

//       // Save received message to database
//       const companyDB = CompanyDBConnection(companyDbName);
//       companyDB.connect();

//       companyDB.query(
//         `INSERT INTO chats (user_id, receipient_whatsapp, timestamp, sender_id, message) VALUES (?, ?, ?, ?, ?)`,
//         [user_id, recipient, receive_time, sender, sms_text],
//         (err, result) => {
//           companyDB.end(); // Close the database connection
//           if (err) {
//             console.error("Error saving received message to the database:", err);
//             return res.status(500).json({ error: "Internal Server Error" });
//           }

//           // Confirm receipt of the message to EuroSMS
//           const confirmationData = {
//             sms_uuid: sms_uuid,
//             status: 'ok'
//           };

//           request.post({
//             url: process.env.EURO_SMS_CONFIRMATION_ENDPOINT,
//             json: confirmationData
//           }, (error, response, body) => {
//             if (error) {
//               console.error("Error confirming receipt to EuroSMS:", error);
//               return res.status(500).json({ error: "Error confirming receipt to EuroSMS" });
//             }

//             // Handle response from EuroSMS confirmation
//             if (response.statusCode === 200) {
//               return res.json({ success: true, message: 'Message receipt confirmed successfully' });
//             } else {
//               console.error("Error confirming receipt to EuroSMS:", response.statusCode, body);
//               return res.status(response.statusCode).json({ error: "Error confirming receipt to EuroSMS", body });
//             }
//           });
//         }
//       );
//     }
//   );
// };
const receivedMessage = (req, res, next) => {
  const { user_id, sms_uuid, recipient, receive_time, sender, sms_text } =
    req.body;

  // Validate incoming data
  if (
    !user_id ||
    !sms_uuid ||
    !recipient ||
    !receive_time ||
    !sender ||
    !sms_text
  ) {
    return res.status(400).json({ error: "Incomplete message data" });
  }

  // Fetch company database name
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

      // Fetch relevant chat database name
      aiBotsDB.query(
        "SELECT db_name FROM company_chats_dbs WHERE user_id = ?",
        [user_id],
        (selectChatDbErr, chatDbResults) => {
          if (selectChatDbErr) {
            console.error("Error fetching chat database:", selectChatDbErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (chatDbResults.length === 0) {
            return res
              .status(404)
              .json({ error: "Chat database not found for sender" });
          }

          // Find the database containing SMS chats
          const smsChatDbResult = chatDbResults.find((result) =>
            result.db_name.includes("SMS_chat_db")
          );

          if (!smsChatDbResult) {
            return res
              .status(404)
              .json({ error: "SMS chat database not found for sender" });
          }

          const smsChatDbName = smsChatDbResult.db_name;

          // Reuse the existing connection to the SMS chat database
          const smsChatDB = CompanyDBConnection(smsChatDbName);
          smsChatDB.connect();

          // Insert received message into the appropriate table
          smsChatDB.query(
            `INSERT INTO chats (user_id, receipient_whatsapp, timestamp, sender_id, message, platform) VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, recipient, receive_time, sender, sms_text, "sms"],
            (err, result) => {
              smsChatDB.end(); // Close the database connection
              if (err) {
                console.error(
                  "Error saving received message to the database:",
                  err
                );
                return res.status(500).json({ error: "Internal Server Error" });
              }

              // // Confirm receipt of the message to EuroSMS
              // const confirmationData = {
              //   sms_uuid: sms_uuid,
              //   status: 'ok'
              // };

              // request.post({
              //   url: process.env.EURO_SMS_CONFIRMATION_ENDPOINT,
              //   json: confirmationData
              // }, (error, response, body) => {
              //   if (error) {
              //     console.error("Error confirming receipt to EuroSMS:", error);
              //     return res.status(500).json({ error: "Error confirming receipt to EuroSMS" });
              //   }

              //   // Handle response from EuroSMS confirmation
              //   if (response.statusCode === 200) {
              //     return res.json({ success: true, message: 'Message receipt confirmed successfully' });
              //   } else {
              //     console.error("Error confirming receipt to EuroSMS:", response.statusCode, body);
              //     return res.status(response.statusCode).json({ error: "Error confirming receipt to EuroSMS", body });
              //   }
              // });

              return res.json({
                success: true,
                message: "Message receipt confirmed successfully",
              });
            }
          );
        }
      );
    }
  );
};

module.exports = {
  sendSMS,
  getAllEuroSmsMessages,
  receivedMessage,
  getLastSMSMessages,
};
