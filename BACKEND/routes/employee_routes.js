const express = require("express");
const employee_router = express.Router();
const { authForEmployee } = require("../middleware/authMiddlewe.js");

const employee_controller = require("../controllers/employee_controller.js");

// EMPLOYEE LOGIN

employee_router.post("/login", employee_controller.employee_login);
// EMPLOYEE LOGOUT

employee_router.get("/logout", employee_controller.employee_logout);

  // EMPLOYEE LOGOUT

employee_router.get("/logout", employee_controller.employee_logout);

  // EMPLOYEE LOGOUT

employee_router.get("/logout", employee_controller.employee_logout);

// GET ALL COMPANIES
employee_router.get(
  "/get-all-companies-names",
  employee_controller.get_all_companies_names
);

// GET ALL EMPLOYEES

employee_router.get(
  "/get-all-employees/:companyId",
  authForEmployee,
  employee_controller.get_all_employees
);

// GET ALL EMPLOYEES

employee_router.get(
  "/get-all-customers/:companyId",
  authForEmployee,
  employee_controller.get_all_customers
);

// GET PARENT COMPANY DETAILS

employee_router.get(
  "/get-parent-company-details/:companyId",
  authForEmployee,
  employee_controller.get_parent_company_details
);
// start new chat
employee_router.post(
  "/start-new-chat",
  // authForEmployee,
  employee_controller.createChat
);
// GET ALL CHATS
employee_router.get(
  "/get-all-chats",
  // authForEmployee,
  employee_controller.getAllChats
); 
// MERGE CHATS
employee_router.post(
  "/merge-chats",
  // authForEmployee,
  employee_controller.mergeChats
);
// GET ALL MERGED CHATS
employee_router.get(
  "/get-all-merged-chats",
  // authForEmployee,
  employee_controller.getAllMergedChats
);




  // AI bots
  employee_router.post(
    "/process-chat-history-for-ai-bot",
    // authForEmployee,
    employee_controller.processChatHistory
  );
  // ai bot next task
  employee_router.post(
    "/next-task-for-ai-bot",
    // authForEmployee,
    employee_controller.handleNextTaskForAiBot
  );
  // TOGGLE AUTO MANUAL TAB 
  employee_router.post(
    "/toggle-auto-manual-tab",
    // authForEmployee,
    employee_controller.ToggleAutoManualTab
  );
  // GET CURRENT MODE
  employee_router.get(
    "/get-current-mode",
    // authForEmployee,
    employee_controller.getCurrentMode
  );
  // SEARCH CHATS
  employee_router.get(
    "/search-chats",
    // authForEmployee,
    employee_controller.searchChats
  );
  // UPDATE CHAT MODE
  employee_router.post(
    "/update-chat-mode",
    // authForEmployee,
    employee_controller.updateChatMode
  );


module.exports = employee_router;