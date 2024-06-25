const express = require("express");
const chats_router = express.Router();
const { authForAdmin } = require("../middleware/authMiddlewe.js");

const chats_controller = require("../controllers/chats_controller.js");

//SEND MESSAGE

chats_router.post("/send-message", chats_controller.sendChatMessage);

//GET ALL MESSAGES

chats_router.get("/get-all-messages", chats_controller.getAllMessages);
chats_router.get(
  "/get-latestt-messages",
  chats_controller.getLastWebchatMessages
);

// GET LATEST MESSAGE

chats_router.get("/get-latest-message", chats_controller.getLatestMessage);
// GET ALL CONTACTS

chats_router.get("/get-all-contacts", chats_controller.getAllContacts);

// ###### generate web chat link

chats_router.post(
  "/generate-web-chat-link",
  chats_controller.generateWebChatLink
);

// ###### get generated link

chats_router.get("/get-generated-link", chats_controller.getGeneratedLink);

// SEND WEB CHAT MSG FOR GUEST

chats_router.post(
  "/send-message-guest",
  chats_controller.sendChatMessageForGuest
);

module.exports = chats_router;
