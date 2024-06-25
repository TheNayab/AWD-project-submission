const express = require("express");
const admin_router = express.Router();
const { authForAdmin } = require("../middleware/authMiddlewe.js");

const admin_controller = require("../controllers/admin_controller.js");

// ADMIN LOGIN

admin_router.post("/login", admin_controller.admin_login);

// ADD COMPANY BY COMPANY

admin_router.post("/add-company", authForAdmin, admin_controller.add_company);

// ADD COMPANY BY COMPANY

admin_router.put(
  "/edit-company/:userId",
  authForAdmin,
  admin_controller.edit_company
);

// GET SINGLE COMPANY

admin_router.get(
  "/get-single-company/:userId",
  authForAdmin,
  admin_controller.get_single_company
);

// GET ALL COMPANIES

admin_router.get(
  "/get-all-companies",
  authForAdmin,
  admin_controller.get_all_companies
);

// ADD EMPLOYEE FOR COMPANY BY ADMIN

admin_router.post(
  "/add-employee-by-admin",
  authForAdmin,
  admin_controller.add_employee_by_admin
);

// GET ALL EMPLOYEES OF ALL COMPANIES

admin_router.get(
  "/get-all-employees-of-all-companies",
  authForAdmin,
  admin_controller.get_all_employees_of_all_companies
);

// UPDATE EMPLOYEE BY ADMIN

admin_router.put(
  "/edit-employee-by-admin/:employee_id",
  authForAdmin,
  admin_controller.edit_employee_by_admin
);

// GET SINGLE EMPLOYEE BY EMPLOYEE BY ADMIN

admin_router.get(
  "/get-single-employee-by-admin/:company_id/:employee_id",
  authForAdmin,
  admin_controller.get_single_employee_by_admin
);

// ADD CUSTOMER FOR COMPANY BY ADMIN

admin_router.post(
  "/add-customer-by-admin",
  authForAdmin,
  admin_controller.add_customer_by_admin
);

// GET ALL CUSTOMERS OF ALL COMPANIES

admin_router.get(
  "/get-all-customers-of-all-companies",
  authForAdmin,
  admin_controller.get_all_customers_of_all_companies
);

// UPDATE CUSTOMER BY ADMIN

admin_router.put(
  "/edit-customer-by-admin/:customer_id",
  authForAdmin,
  admin_controller.edit_customer_by_admin
);

// GET SINGLE CUSTOMER BY EMPLOYEE BY ADMIN

admin_router.get(
  "/get-single-customer-by-admin/:company_id/:customer_id",
  authForAdmin,
  admin_controller.get_single_customer_by_admin
);

// ADMIN LOGOUT

admin_router.get("/logout", admin_controller.admin_logout);
admin_router.get("/getconnections", admin_controller.companiesConnection);
// admin_router.get("/getallchats", admin_controller.companiesAllChats);
// admin_router.get(
//   "/contactlist/:database",
//   admin_controller.companyContactList 
// );

module.exports = admin_router;  
  