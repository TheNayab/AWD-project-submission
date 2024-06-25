const { aiBotsDB } = require("../DB/db.js");
const mysql = require("mysql2");
const Joi = require("joi");

const CompanyDBConnection = (companyDBName) => {
  return mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: companyDBName,
  });
};

// const axios = require('axios')

// const handleWebhook = async (req, res) => {
//   console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

//   const GRAPH_API_TOKEN = "EAAXAZCA69CQ0BOxW7sgsmXOhL6Gsv878Jq0WTTVT9ZB0Vo0vUZB3mfnT4m7lDppeCjOSTec0PwZAPM0uGYVUZBBjDVCrl3gwwZATvhtISyFdCulHodev0h0B48OQZBYHxzM0qukUaDcH4D9fKeRQRFvg7RBySezy8GrvYsHPfPYGFvZCWa2cVEVXvupXZBTC7SNN0UYZCpOfCKHIowC9DzI9YZD"
//   WEBHOOK_VERIFY_TOKEN="EAAXAZCA69CQ0BOxW7sgsmXOhL6Gsv878Jq0WTTVT9ZB0Vo0vUZB3mfnT4m7lDppeCjOSTec0PwZAPM0uGYVUZBBjDVCrl3gwwZATvhtISyFdCulHodev0h0B48OQZBYHxzM0qukUaDcH4D9fKeRQRFvg7RBySezy8GrvYsHPfPYGFvZCWa2cVEVXvupXZBTC7SNN0UYZCpOfCKHIowC9DzI9YZD"

//   const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

//   if (message?.type === "text") {
//     const business_phone_number_id = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

//     await axios({
//       method: "POST",
//       url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
//       headers: {
//         Authorization: `Bearer ${GRAPH_API_TOKEN}`,
//       },
//       data: {
//         messaging_product: "whatsapp",
//         to: message.from,
//         text: { body: "Echo: " + message.text.body },
//         context: {
//           message_id: message.id,
//         },
//       },
//     });

//     await axios({
//       method: "POST",
//       url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
//       headers: {
//         Authorization: `Bearer ${GRAPH_API_TOKEN}`,
//       },
//       data: {
//         messaging_product: "whatsapp",
//         status: "read",
//         message_id: message.id,
//       },
//     });
//   }

//   res.sendStatus(200);
// };

// const verifyWebhook = (req, res) => {
//   const mode = req.query["hub.mode"];
//   const token = req.query["hub.verify_token"];
//   const challenge = req.query["hub.challenge"];

//   if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
//     console.log(token)
//     res.status(200).send(challenge);
//     console.log("Webhook verified successfully!");
//   } else {
//     res.sendStatus(403);
//   }
// };

// module.exports = { handleWebhook, verifyWebhook };

// const axios = require('axios')

// const handleWebhook = async (req, res) => {
//   console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

//   const GRAPH_API_TOKEN = "EAAXAZCA69CQ0BO5SxURluNgFGVpWgQVT6eIZCuEyWlfT3kabyCGbdEA3atXx8SphwD0WlMWYiaQe0kLnBFAXtNLFM8T6QszfyuZCS8m32j5tQyZCn6UtI05ZAuI4EMUlv9n9PM1YskBd5rKjbsr7lFmz4E8Bkmdr6ZAGXxvZBZAAwqVa0TLSvOckpwEQX4kmluNat4uRuiVHDpI4bjxTjoIZD"
//   WEBHOOK_VERIFY_TOKEN="EAAXAZCA69CQ0BO5SxURluNgFGVpWgQVT6eIZCuEyWlfT3kabyCGbdEA3atXx8SphwD0WlMWYiaQe0kLnBFAXtNLFM8T6QszfyuZCS8m32j5tQyZCn6UtI05ZAuI4EMUlv9n9PM1YskBd5rKjbsr7lFmz4E8Bkmdr6ZAGXxvZBZAAwqVa0TLSvOckpwEQX4kmluNat4uRuiVHDpI4bjxTjoIZD"

//   const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

//   if (message?.type === "text") {
//     const business_phone_number_id = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

//     await axios({
//       method: "POST",
//       url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
//       headers: {
//         Authorization: `Bearer ${GRAPH_API_TOKEN}`,
//       },
//       data: {
//         messaging_product: "whatsapp",
//         to: message.from,
//         text: { body: "Echo: " + message.text.body },
//         context: {
//           message_id: message.id,
//         },
//       },
//     });

//     await axios({
//       method: "POST",
//       url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
//       headers: {
//         Authorization: `Bearer ${GRAPH_API_TOKEN}`,
//       },
//       data: {
//         messaging_product: "whatsapp",
//         status: "read",
//         message_id: message.id,
//       },
//     });
//   }

//   res.sendStatus(200);
// };

// const verifyWebhook = (req, res) => {
//   const mode = req.query["hub.mode"];
//   const token = req.query["hub.verify_token"];
//   const challenge = req.query["hub.challenge"];

//   if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
//     console.log(token)
//     res.status(200).send(challenge);
//     console.log("Webhook verified successfully!");
//   } else {
//     res.sendStatus(403);
//   }
// };

// const sendMessage = (data) => {
//   const config = {
//     method: 'post',
//     url: `https://graph.facebook.com/v18.0/240832239122260/messages`,
//     headers: {
//       'Authorization': `Bearer EAAXAZCA69CQ0BO5SxURluNgFGVpWgQVT6eIZCuEyWlfT3kabyCGbdEA3atXx8SphwD0WlMWYiaQe0kLnBFAXtNLFM8T6QszfyuZCS8m32j5tQyZCn6UtI05ZAuI4EMUlv9n9PM1YskBd5rKjbsr7lFmz4E8Bkmdr6ZAGXxvZBZAAwqVa0TLSvOckpwEQX4kmluNat4uRuiVHDpI4bjxTjoIZD`,
//       'Content-Type': 'application/json'
//     },
//     data: data
//   };

//   return axios(config);
// };

// const getTextMessageInput = (recipient, text) => {
//   return JSON.stringify({
//     "messaging_product": "whatsapp",
//     "preview_url": false,
//     "recipient_type": "individual",
//     "to": recipient,
//     "type": "text",
//     "text": {
//       "body": text
//     }
//   });
// };

// const sendMessageController = (req, res, next) => {
//   const { user_id, recipient, message } = req.body;

//   if (!recipient || !message) {
//     return res.status(400).json({ error: 'Recipient and message are required' });
//   }

//   // Fetch company database name here
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

//           // Find "whatsapp_chat_db" and use it, ignore others
//           const webChatDbResult = dbResults.find(
//             (result) => result.db_name.includes("whatsapp_chat_db")
//           );

//           console.log("first", webChatDbResult);

//           if (!webChatDbResult) {
//             return res
//               .status(404)
//               .json({ error: "Web chat database not found for sender" });
//           }

//           const webChatDbName = webChatDbResult.db_name;
//           console.log("whatsappchat", webChatDbName);

//           const webChatDB = CompanyDBConnection(webChatDbName);
//           webChatDB.connect();

//           webChatDB.query(
//             `INSERT INTO chats (user_id, sender_id, sender_name, receiver_id, message) VALUES (?, ?, ?, ?, ?)`,
//             [user_id, 2323, "dummy", recipient, message],
//             (insertErr, result) => {
//               if (insertErr) {
//                 console.error(
//                   "Error saving chat message to the database:",
//                   insertErr
//                 );
//                 return res
//                   .status(500)
//                   .json({ error: "Internal Server Error" });
//               }

//               const messageId = result.insertId;

//               // Use company database name to perform further operations
//               // For now, let's assume companyDbName is available and proceed with sending the message

//               const data = getTextMessageInput(recipient, message);

//               sendMessage(data)
//                 .then((response) => {
//                   res.json({ success: true, message: 'Message sent successfully' });
//                 })
//                 .catch((error) => {
//                   console.log(error);
//                   res.status(500).json({ error: 'An error occurred while sending the message' });
//                 });
//             }
//           );
//         }
//       );
//     }
//   );
// };

// module.exports = { handleWebhook, verifyWebhook,sendMessageController };

const axios = require("axios");

let webChatDB; // Define webChatDB globally

const handleWebhook = async (req, res) => {
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message?.type === "text" || message?.type === "template") {
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    // await axios({
    //   method: "POST",
    //   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
    //   headers: {
    //     Authorization: `Bearer ${GRAPH_API_TOKEN}`,
    //   },
    //   data: {
    //     messaging_product: "whatsapp",
    //     to: message.from,
    //     text: { body: "Echo: " + message.text.body },
    //     context: {
    //       message_id: message.id,
    //     },
    //   },
    // });

    await axios({
      method: "POST",
      url: `https://graph.facebook.com/${process.env.VERSION}/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      },
    });

    // Save the incoming message to the database
    saveIncomingMessageToDatabase(message, req);
  }

  res.sendStatus(200);
};

const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log(mode,token,challenge)
  console.log("hello")

 

  if (mode === "subscribe" && token === process.env.GRAPH_API_TOKEN) {
    console.log(token);
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
    console.log("Webhook verification failed!");
    
  }
};

const sendMessage = (data) => {
  const config = {
    method: "post",
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    data: data,
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  };

  return axios(config);
};

const getTextMessageInput = (recipient, text) => {
  return JSON.stringify({
    messaging_product: "whatsapp",
    preview_url: false,
    recipient_type: "individual",
    to: recipient,
    type: "text",
    text: {
      body: text,
    },
  });
};

const sendMessageController = (req, res, next) => {
  const { user_id, sender_id, sender_name, recipient,sender, message,direction,message_type } = req.body;

  if (!sender_id || !sender_name || !recipient || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const processedRecipient = recipient.startsWith("+")
    ? recipient.slice(1)
    : recipient;

  console.log(processedRecipient);

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

          if (dbResults.length === 0) {
            return res
              .status(404)
              .json({ error: "Chat database not found for sender" });
          }

          // Find "whatsapp_chat_db" and use it, ignore others
          const webChatDbResult = dbResults.find((result) =>
            result.db_name.includes("whatsapp_chat_db")
          );

          console.log("chatdbconsole", webChatDbResult);

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for sender" });
          }

          const webChatDbName = webChatDbResult.db_name;
          console.log("whatsappchat", webChatDbName);

          // Reuse the existing webChatDB connection
          webChatDB = CompanyDBConnection(webChatDbName);
          webChatDB.connect();

          webChatDB.query(
            `INSERT INTO chats (user_id, sender_id, sender_name,receipient_whatsapp,sender_whatsapp, message, platform,direction,message_type) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user_id,
              sender_id,
              sender_name,
              processedRecipient,
              sender,
              message,
              "whatsApp",
              direction,
              message_type
            ],
            (insertErr, result) => {
              if (insertErr) {
                console.error(
                  "Error saving chat message to the database:",
                  insertErr
                );
                return res.status(500).json({ error: "Internal Server Error" });
              }

              const messageId = result.insertId;

              // Use company database name to perform further operations
              // For now, let's assume companyDbName is available and proceed with sending the message

              const data = getTextMessageInput(processedRecipient, message);

              sendMessage(data)
                .then((response) => {
                  res.json({
                    success: true,
                    message: "Message sent successfully",
                  });
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({
                    error: "An error occurred while sending the message",
                  });
                });
            }
          );
        }
      );
    }
  );
};

const sendTemplateMessageController = (req, res, next) => {
  const { user_id, sender_id, sender_name, recipient, templateName } = req.body;

  if (!sender_id || !sender_name || !recipient || !templateName) {
    return res.status(400).json({ error: "All fields are required" });
  }

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

          if (dbResults.length === 0) {
            return res
              .status(404)
              .json({ error: "Chat database not found for sender" });
          }

          // Find "whatsapp_chat_db" and use it, ignore others
          const webChatDbResult = dbResults.find((result) =>
            result.db_name.includes("whatsapp_chat_db")
          );

          console.log("chatdbconsole", webChatDbResult);

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for sender" });
          }

          const webChatDbName = webChatDbResult.db_name;
          console.log("whatsappchat", webChatDbName);

          // Reuse the existing webChatDB connection
          webChatDB = CompanyDBConnection(webChatDbName);
          webChatDB.connect();

          webChatDB.query(
            `INSERT INTO chats (user_id, sender_id, sender_name, receipient_whatsapp, message, platform) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              user_id,
              sender_id,
              sender_name,
              recipient,
              JSON.stringify({
                templateName,
              }),
              "whatsApp",
            ],
            (insertErr, result) => {
              if (insertErr) {
                console.error(
                  "Error saving chat message to the database:",
                  insertErr
                );
                return res.status(500).json({ error: "Internal Server Error" });
              }

              const messageId = result.insertId;

              const data = getTemplateMessageInput(recipient, templateName);

              sendMessage(data)
                .then((response) => {
                  res.json({
                    success: true,
                    message: "Message sent successfully",
                  });
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({
                    error:
                      "An error occurred while sending the message" + error,
                  });
                });
            }
          );
        }
      );
    }
  );
};

const getTemplateMessageInput = (recipient, templateName) => {
  return JSON.stringify({
    messaging_product: "whatsapp",
    to: recipient,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: "en_US",
      },
    },
  });
};

// const saveIncomingMessageToDatabase = async (message, req) => {

  
//   // Extract necessary information from the message
//   const receipient = message.from;
//   const messageId = message.id;
//   const messageBody = message.text?.body;

  

//   // const senderName =  contact.profile?.name || '';
//   const senderName =
//     req.body.entry?.[0]?.changes[0]?.value?.contacts?.[0].profile?.name || "";
//   // console.log("message",message)

//   // Perform database operation to save the incoming message using webChatDB
//   if (typeof webChatDB !== "undefined") {
//     webChatDB.query(
//       `INSERT INTO chats (receipient_whatsapp, message,platform,direction) VALUES (?,?,?,?)`,
//       [receipient, messageBody, "whatsApp","in"],
//       (insertErr, result) => {
//         if (insertErr) {
//           console.error(
//             "Error saving incoming message to the database:",
//             insertErr
//           );
//         } else {
//           console.log("Incoming message saved to the database successfully");

//           req.io.emit("whatsappMessage", {
//             user_id: message.user_id,
//             sender_id: receipient,
//             sender_name: senderName,
//             recipient: "",
//             message: messageBody,
//             platform: "whatsApp",
//           });
//         }
//       }
//     );
//   }
// };


const saveIncomingMessageToDatabase = async (message, req) => {
  // Extract necessary information from the message
  const recipient = message.from.startsWith("+")
    ? message.from.slice(1)
    : message.from;
  const messageId = message.id;
  const messageBody = message.text?.body;
  const senderName =
    req.body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name || "";
  const displayPhoneNumber =
    req.body.entry?.[0]?.changes?.[0]?.value?.metadata?.display_phone_number || "";

  console.log("Recipient phone number:", recipient);
  console.log("Display phone number:", displayPhoneNumber);

  if (typeof webChatDB === "undefined") {
    // Fetch user ID based on display phone number
    aiBotsDB.query(
      "SELECT user_id FROM users WHERE phone = ?",
      [displayPhoneNumber],
      (selectUserIdErr, userIdResult) => {
        if (selectUserIdErr) {
          console.error("Error fetching user ID:", selectUserIdErr);
          return;
        }

        if (userIdResult.length === 0) {
          console.error("User not found for display phone number");
          return;
        }

        const user_id = userIdResult[0].user_id;
        console.log("Fetched user ID:", user_id);

        // Fetch company database name here
        aiBotsDB.query(
          "SELECT company_database FROM users WHERE user_id = ?",
          [user_id],
          (selectDbErr, dbResult) => {
            if (selectDbErr) {
              console.error("Error fetching company database:", selectDbErr);
              return;
            }

            if (dbResult.length === 0) {
              console.error("Company database not found for user");
              return;
            }

            const companyDbName = dbResult[0].company_database;
            console.log("Fetched company database name:", companyDbName);

            const companyDB = CompanyDBConnection(companyDbName);
            companyDB.connect();

            // Fetch chat database name
            aiBotsDB.query(
              "SELECT db_name FROM company_chats_dbs WHERE user_id = ?",
              [user_id],
              (selectChatDbErr, chatDbResults) => {
                if (selectChatDbErr) {
                  console.error("Error fetching chat database:", selectChatDbErr);
                  return;
                }

                if (chatDbResults.length === 0) {
                  console.error("Chat database not found for user");
                  return;
                }

                const webChatDbResult = chatDbResults.find((result) =>
                  result.db_name.includes("whatsapp_chat_db")
                );

                if (!webChatDbResult) {
                  console.error("WhatsApp chat database not found for user");
                  return;
                }

                const webChatDbName = webChatDbResult.db_name;
                console.log("Fetched WhatsApp chat database name:", webChatDbName);

                webChatDB = CompanyDBConnection(webChatDbName);
                webChatDB.connect();

                // Save the incoming message to the database
                webChatDB.query(
                  `INSERT INTO chats (user_id, receipient_whatsapp,sender_whatsapp, message, platform, direction, message_type) VALUES (?,?, ?, ?, ?, ?, ?)`,
                  [user_id, recipient,displayPhoneNumber, messageBody, "whatsApp", "in", "user"],
                  (insertErr, result) => {
                    if (insertErr) {
                      console.error(
                        "Error saving incoming message to the database:",
                        insertErr
                      );
                    } else {
                      console.log("Incoming message saved to the database successfully");

                      req.io.emit("whatsappMessage", {
                        user_id,
                        sender_id: recipient,
                        sender_name: senderName,
                        recipient: "",
                        message: messageBody,
                        sender_whatsapp: displayPhoneNumber,
                        platform: "whatsApp",
                        direction: "in",
                        timestamp: new Date().toISOString()
                      });
                    }
                  }
                );
              }
            );
          }
        );
      }
    );
  } else {
    // Save the incoming message to the database
    webChatDB.query(
      `INSERT INTO chats (receipient_whatsapp,sender_whatsapp, message, platform, direction, message_type) VALUES (?,?, ?, ?, ?, ?)`,
      [recipient,displayPhoneNumber, messageBody, "whatsApp", "in", "user"],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Error saving incoming message to the database:", insertErr);
        } else {
          console.log("Incoming message saved to the database successfully");

          req.io.emit("whatsappMessage", {
            user_id: message.user_id,
            sender_id: recipient,
            sender_name: senderName,
            recipient: "",
            message: messageBody,
            platform: "whatsApp",
          });
        }
      }
    );
  }
};




// GET ALL WHATSAPP MESSAGES

// const getAllWhatsAppMessages = (req, res) => {
//   const { sender_id, receipient_whatsapp,user_id } = req.query;

//   if (!sender_id || !user_id || !receipient_whatsapp) {
//     return res.status(400).json({ error: 'All fields are required' });
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
//         return res.status(404).json({ error: "User not found" });
//       }

//       const companyDbName = dbResult[0].company_database;

//       const companyDB = CompanyDBConnection(companyDbName);

//       companyDB.connect();

//       aiBotsDB.query(
//         'SELECT db_name FROM company_chats_dbs WHERE user_id = ?',
//         [user_id],
//         (selectDbErr, dbResults) => {
//           if (selectDbErr) {
//             console.error('Error fetching chat database:', selectDbErr);
//             return res.status(500).json({ error: 'Internal Server Error' });
//           }

//           if (dbResults.length === 0) {
//             return res.status(404).json({ error: 'Company not found' });
//           }

//           // Find any database name containing "web_chat_db" and use it, ignore others
//           const webChatDbResult = dbResults.find(
//             (result) => result.db_name.includes("whatsapp_chat_db")
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
//             'SELECT * FROM chats WHERE sender_id = ? AND receipient_whatsapp = ? AND user_id = ?',
//             [sender_id, receipient_whatsapp, user_id],
//             (fetchErr, messages) => {
//               if (fetchErr) {
//                 console.error('Error fetching messages from the database:', fetchErr);
//                 return res.status(500).json({ error: 'Internal Server Error' });
//               }

//               if (messages.length === 0) {
//                 return res.status(404).json({ error: 'No messages found' });
//               }

//               res.json({ success: true, messages });
//             }
//           );

//         }
//       );
//     }
//   );
// };


const getAllWhatsAppMessages = (req, res) => {
  const { sender_id, receipient_whatsapp, user_id } = req.query;

  console.log("receipient_whatsapp", receipient_whatsapp);

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (!sender_id || !receipient_whatsapp) {
    return res.status(400).json({ error: "Sender ID and Recipient WhatsApp are required" });
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
            result.db_name.includes("whatsapp_chat_db")
          );

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for user" });
          }

          const webChatDbName = webChatDbResult.db_name;

          const chatDB = CompanyDBConnection(webChatDbName);
          chatDB.connect();

          const query = "SELECT * FROM chats WHERE sender_whatsapp = ? AND receipient_whatsapp = ?";
          const queryParams = [sender_id, receipient_whatsapp];

          chatDB.query(query, queryParams, (fetchErr, messages) => {
            if (fetchErr) {
              console.error("Error fetching messages from the database:", fetchErr);
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

const getLastWhatsappMessages = (req, res) => {
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
            result.db_name.includes("whatsapp_chat_db")
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

module.exports = {
  handleWebhook,
  verifyWebhook,
  sendMessageController,
  getAllWhatsAppMessages,
  sendTemplateMessageController,
  getLastWhatsappMessages,
};
