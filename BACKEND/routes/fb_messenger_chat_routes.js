const express = require("express");
const fb_messenger_router = express.Router();

const fb_messenger_chat_controller = require("../controllers/fb_messenger_chat_controller.js");

fb_messenger_router.post(
  "/webhooks",
  fb_messenger_chat_controller.handleIncomingMsg
);
fb_messenger_router.get(
  "/webhooks",
  fb_messenger_chat_controller.handleVerification
);
fb_messenger_router.get(
  "/get-all-fb-messages",
  fb_messenger_chat_controller.getAllFbMessages
);
fb_messenger_router.post(
  "/send-message",
  fb_messenger_chat_controller.sendMessagesToUser
);

module.exports = fb_messenger_router;
