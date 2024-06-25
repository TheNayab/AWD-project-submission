const { aiBotsDB } = require("../DB/db.js");
const mysql = require("mysql2");
const axios = require("axios");

let webChatDB;

const CompanyDBConnection = (companyDBName) => {
  return mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: companyDBName,
  });
};

const saveIncomingMessageToDatabase = async (message, req) => {
  // Extract necessary information from the message
  const receiver_id = message.entry[0].messaging[0].recipient.id;
  const sender_id = message.entry[0].messaging[0].sender.id;
  const txtmessage = message.entry[0].messaging[0].message.text;

  // Perform database operation to save the incoming message using webChatDB

  if (typeof webChatDB !== "undefined") {
    webChatDB.query(
      `INSERT INTO chats (sender_id,receiver_id, message, platform) VALUES (?, ?, ?, ?)`,
      [sender_id, receiver_id, txtmessage, "fb_messenger"],
      (insertErr, result) => {
        if (insertErr) {
          console.error(
            "Error saving incoming message to the database:",
            insertErr
          );
        } else {
          console.log("Incoming message saved to the database successfully");

          // req.io.emit("fb_messenger", {
          //   user_id: message.user_id,
          //   sender_id: receipient,
          //   sender_name: senderName,
          //   recipient: "",
          //   message: messageBody,
          //   platform: "whatsApp",
          // });
        }
      }
    );
  }
};

//   meta verification
exports.handleVerification = async (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  if (mode && token) {
    if (mode === "subscribe" && token === "hellothisisnewtoken") {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    } 
  }
}; 

// Receiving Messages
exports.handleIncomingMsg = async (req, res) => {
  let body = req.body;

  console.log("Received POST request for webhook event");

  console.log(`\u{1F7EA} Received webhook:`);
  console.dir(body, { depth: null });

  if (body.object === "page") {
    res.status(200).send("EVENT_RECEIVED");
    body.entry.forEach(function (entry) {
      let webhookEvent = entry.messaging[0];
      let senderPSID = webhookEvent.sender.id;
      console.log("PSID: " + senderPSID);
    });
    // saveIncomingMessageToDatabase(body, req);
  } else {
    res.sendStatus(404);
  }
};

exports.sendMessagesToUser = async (req, res) => {
  const PAGE_ACCESS_TOKEN =
    "EAALr3Fo8icgBO63zwdcGK0NZA30VCrJdHzCd5qSAxTD3gLvVEhZAZBjXLTw0ZC385DGKcXrx9zv4H0nX911NmcGLEbcv4OPW6V9qyVcVIL5deFzcglBlaZAbp26i1bN2rWyJfx0DI2Ngk1xxhF8bA5jDZCMjqZCz66we492ZAGyscYYhULZBDZBup94okREo7tz1IfYwZDZD";
  const { user_id, sender_id, receiver_id, message } = req.body;

  if (!receiver_id || !message) {
    return res.status(400).send("PSID and message are required");
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
            result.db_name.includes("fb_messenger_chat_db")
          );

          console.log("chatdbconsole", webChatDbResult);

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for sender" });
          }

          const webChatDbName = webChatDbResult.db_name;
          console.log("fb_messenger_db", webChatDbName);

          // Reuse the existing webChatDB connection
          webChatDB = CompanyDBConnection(webChatDbName);
          // const sanitizedWebChatDB = removeCircularReferences(webChatDB);
          // res.cookie("web", sanitizedWebChatDB);
          webChatDB.connect();

          webChatDB.query(
            `INSERT INTO chats (user_id, sender_id,receiver_id, message, platform) VALUES (?, ?, ?, ?, ?)`,
            [user_id, sender_id, receiver_id, message, "fb_messenger"],
            async (insertErr, result) => {
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

              const requestBody = {
                recipient: {
                  id: receiver_id,
                },
                message: {
                  text: message,
                },
              };

              try {
                const response = await axios.post(
                  `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
                  requestBody,
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (response.status === 200) {
                  console.log("Message sent successfully");
                  return res.status(200).send("Message sent successfully");
                } else {
                  console.error("Error sending message", response.data);
                  return res
                    .status(response.status)
                    .send("Error sending message");
                }
              } catch (error) {
                console.error("Error sending message", error);
                return res.status(500).send("Internal Server Error");
              }
            }
          );
        }
      );
    }
  );
};

exports.getAllFbMessages = (req, res) => {
  const { user_id, sender_id, receiver_id } = req.query;

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
            result.db_name.includes("fb_messenger_chat_db")
          );

          if (!webChatDbResult) {
            return res
              .status(404)
              .json({ error: "Web chat database not found for user" });
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

          if (receiver_id) {
            query += " OR receipient_whatsapp = ?";
            queryParams.push(receiver_id);
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

// function removeCircularReferences(obj) {
//   const seen = new WeakSet();
//   return JSON.parse(
//     JSON.stringify(obj, function (key, value) {
//       if (typeof value === "object" && value !== null) {
//         if (seen.has(value)) {
//           return; // Skip circular references
//         }
//         seen.add(value);
//       }
//       return value;
//     })
//   );
// }
