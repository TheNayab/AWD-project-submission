const express = require("express");
const company_router = express.Router();
const { authForCompany } = require("../middleware/authMiddlewe.js");

const company_controller = require("../controllers/company_controller.js");

// ####### AGENTS ROUTES #############

// COMPANY LOGIN

company_router.post("/login", company_controller.company_login);

// COMPANY LOGOUT
company_router.get("/logout", company_controller.company_logout);
// ADD EMPLOYEE BY COMPANY

company_router.post(
  "/add-employee",
  authForCompany,
  company_controller.add_employee_by_company
);

// GET ALL EMPLOYEES

company_router.get(
  "/get-all-employees/:companyId",
  authForCompany,
  company_controller.get_all_employees
);

// ADD CUSTOMER BY COMPANY

company_router.post(
  "/add-customer",
  authForCompany,
  company_controller.add_customer_by_company
);

// GET ALL CUSTOMERS

company_router.get(
  "/get-all-customers/:companyId",
  authForCompany,
  company_controller.get_all_customers
);

// GET SINGLE CUSTOMER

company_router.get(
  "/get-single-customer/:companyId/:customerId",
  authForCompany,
  company_controller.get_single_customer_by_company
);

// GET SINGLE EMPLOYEE

company_router.get(
  "/get-single-employee/:companyId/:employeeId",
  authForCompany,
  company_controller.get_single_employee_by_company
);

// EDIT EMPLOYEE BY COMPANY

company_router.put(
  "/edit-employee/:companyId/:employeeId",
  authForCompany,
  company_controller.edit_employee_by_company
);

// EDIT CUSTOMER BY COMPANY

company_router.put(
  "/edit-customer/:companyId/:customerId",
  authForCompany,
  company_controller.edit_customer_by_company
);

// EDIT PROFILE OF COMPANY

company_router.put(
  "/edit-profile-of-company/:user_id",
  authForCompany,
  company_controller.edit_profile_of_company
);

// GET COMPANY PROFILE

company_router.get(
  "/get-company-profile/:user_id",
  authForCompany,
  company_controller.get_company_profile
);

// TOGGLE AUTO MANUAL TAB
company_router.post(
  "/toggle-auto-manual-tab",
  // authForEmployee,
  company_controller.ToggleAutoManualTab
);
// GET CURRENT MODE
company_router.get(
  "/get-current-mode",
  // authForEmployee,
  company_controller.getCurrentMode
);
// GET CURRENT MODE
company_router.get(
  "/get-connected-chats/:companyId",
  // authForEmployee,
  company_controller.companyChatConnect
);
// POST connection
company_router.post(
  "/connected-chats/:companyId",
  // authForEmployee,
  company_controller.connecttochat
);

module.exports = company_router;
