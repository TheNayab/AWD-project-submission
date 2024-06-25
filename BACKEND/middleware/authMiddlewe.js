const jwt = require("jsonwebtoken");


function authForUser(req, res, next) {



 // Get the access token from the cookie

 const authorizationHeader = req.header("Authorization");
 const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");

 const accessToken = authorizationHeader?.replace("Bearer ", "");

 if (!accessToken) {
   return res.status(401).json({ message: "No token, authorization denied" });
 }



  const token_from_cookies = req.cookies.user_token;


 // Verify the access token
 try {
   const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
   req.user = decoded;

   next();
 } catch (error) {
   if (error.name === "TokenExpiredError") {
     return res.status(401).json({ message: "Access token has expired" });
   }
   res.status(400).json({ message: "Access token is not valid" });
 }

  
}





// @@@ Auth for Agent



function authForAgent(req, res, next) {

  const authorizationHeader = req.header("Authorization");
 const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");

 const accessToken = authorizationHeader?.replace("Bearer ", "");

 if (!accessToken) {
   return res.status(401).json({ message: "No token, authorization denied" });
 }



  const token_from_cookies = req.cookies.agent_access_token;

  // Verify the access token
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_AGENT);
    req.user = decoded;
    // console.log(req.user)

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token has expired" });
    }
    res.status(400).json({ message: "Access token is not valid" });
  }
}



function authForCustomer(req, res, next) {

  const authorizationHeader = req.header("Authorization");
 const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");

 const accessToken = authorizationHeader?.replace("Bearer ", "");

 if (!accessToken) {
   return res.status(401).json({ message: "No token, authorization denied" });
 }



  const token_from_cookies = req.cookies.customer_access_token;

  // Verify the access token
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_CUSTOMER);
    req.user = decoded;
    // console.log(req.user)

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token has expired" });
    }
    res.status(400).json({ message: "Access token is not valid" });
  }
}


function authForAdmin(req, res, next) {

  const authorizationHeader = req.header("Authorization");
 const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");



 const accessToken = authorizationHeader?.replace("Bearer ", "");
 

 if (!accessToken) {
   return res.status(401).json({ message: "No token, authorization denied" });
 }



  const token_from_cookies = req.cookies.admin_access_token;

  // Verify the access token
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_ADMIN);
    req.user = decoded;
    // console.log(req.user)

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token has expired" });
    }
    res.status(400).json({ message: "Access token is not valid" });
  }
}




function authForCompany(req, res, next) {

  const authorizationHeader = req.header("Authorization");
 const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");

 const accessToken = authorizationHeader?.replace("Bearer ", "");

 if (!accessToken) {
   return res.status(401).json({ message: "No token, authorization denied" });
 }



  const token_from_cookies = req.cookies.company_access_token;

  // Verify the access token
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_COMPANY);
    req.user = decoded;
    // console.log(req.user)

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token has expired" });
    }
    res.status(400).json({ message: "Access token is not valid" });
  }
}



// auh for employee


function authForEmployee(req, res, next) {

  const authorizationHeader = req.header("Authorization");
 const tokenFromHeader = authorizationHeader?.replace("Bearer ", "");

 const accessToken = authorizationHeader?.replace("Bearer ", "");

 if (!accessToken) {
   return res.status(401).json({ message: "No token, authorization denied" });
 }



  const token_from_cookies = req.cookies.employee_access_token;

  // Verify the access token
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_EMPLOYEE);
    req.user = decoded;
    // console.log(req.user)

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token has expired" });
    }
    res.status(400).json({ message: "Access token is not valid" });
  }
}


module.exports = { authForUser,authForAgent,authForCustomer,authForAdmin,authForCompany,authForEmployee};
