const express = require("express");
const sms_router = express.Router();
// const {authForAdmin} = require('../middleware/authMiddlewe.js')

const sms_controller = require("../controllers/sms_controller.js");

//SEND MESSAGE

sms_router.post("/send-sms", sms_controller.sendSMS);

//GET ALL SMS MESSAGES

sms_router.get("/get-all-sms", sms_controller.getAllEuroSmsMessages);
sms_router.get("/get-latest-sms", sms_controller.getLastSMSMessages);
      
sms_router.post("/received-sms", sms_controller.receivedMessage);

// ### RECEIVED MESSAGE ROUTE

module.exports = sms_router;
