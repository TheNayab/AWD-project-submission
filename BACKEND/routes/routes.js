const express = require("express");
const router = express.Router();
const {authForAgent,authForCustomer} = require('../middleware/authMiddlewe.js')
const auth_controller = require("../controllers/auth_controller.js");
const agent_controller = require("../controllers/agent_controller.js");
const customer_controller = require("../controllers/customer_controller.js");
// const admin_controller = require("../controllers/admin_controller.js");




// ####### AGENTS ROUTES #############

// AGENT LOGIN 

router.post(
    "/agent/agent-login",
    auth_controller.agent_login
  );


// ADD CUSTOMER BY AGENT

// router.post(
//     "/agent/add-customer",
//     authForAgent,
//     agent_controller.add_customer
//   );

  // CHANGE_PASSWORD

router.post(
  "/agent/change-password",
  authForAgent,
  agent_controller.change_password_of_agent
);





// ####### CUSTOMER ROUTES #############
  
router.post(
  "/customer/customer-login",
  auth_controller.customer_login
);


// ADD EMPLOYEE BY CUSTOMER

router.post(
    "/customer/add-employees",
    authForCustomer,
    customer_controller.add_employees
  );
// UPDATE EMPLOYEE BY CUSTOMER

router.put(
    "/customer/update-employee",
    authForCustomer,
    customer_controller.update_employee
  );

// GET ALL EMPLOYEES BY CUSTOMER

router.get(
    "/customer/get-all-emplyees/:customer_id",
    authForCustomer,
    customer_controller.get_all_employees
  );


// CHANGE_PASSWORD

router.post(
    "/customer/change-password",
    authForCustomer,
    customer_controller.change_password_of_customer
  );



// Webhook endpoint for receiving messages
router.post('/webhook', customer_controller.handleMessage);

// Set up a webhook verification endpoint
router.get('/webhook', customer_controller.verifyWebhook);


// whatsapp
router.post('/send-wa/webhook', customer_controller.send_message);

    

              

            
  


module.exports = router