const express = require("express");
const whatsapp_router = express.Router();
// const {authForAdmin} = require('../middleware/authMiddlewe.js')

const whatsapp_chat_controller = require("../controllers/whatsapp_chat_controller.js");

whatsapp_router.post("/webhook", whatsapp_chat_controller.handleWebhook);
whatsapp_router.get("/webhook", whatsapp_chat_controller.verifyWebhook);
whatsapp_router.get(
  "/get-all-whatsapp-messages",
  whatsapp_chat_controller.getAllWhatsAppMessages
);
whatsapp_router.get(
  "/get-last-whatsapp-messages",
  whatsapp_chat_controller.getLastWhatsappMessages
);
whatsapp_router.post(
  "/send-message",
  whatsapp_chat_controller.sendMessageController
);
whatsapp_router.post(
  "/send-message-template",
  whatsapp_chat_controller.sendTemplateMessageController
);
whatsapp_router.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
  Checkout README.md to start.</pre>`);
});

module.exports = whatsapp_router;
