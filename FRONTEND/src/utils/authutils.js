// authUtils.js

export const getAdminAccessToken = () => {
    const token = localStorage.getItem("admin_access_token");
  
    if (!token) {
      // Redirect to login page if no token is found
      window.location.href = "/admin/login";
    }
  
    return token;
  };

  export const getCompanyAccessToken = () => {
    const token = localStorage.getItem("company_access_token");
  
    if (!token) {
      // Redirect to login page if no token is found
      window.location.href = "/company/login";
    }
  
    return token;
  };
  


  // employee access token

  


export const getEmployeeAccessToken = () => {
  const token = localStorage.getItem("employee_access_token");

  if (!token) {
    // Redirect to login page if no token is found
    window.location.href = "/emp/login";
  }

  return token;
};

export const getGuestAccessToken = () => {
  const token = sessionStorage.getItem("guest_access_token");

  // if (!token) {
  //   // Redirect to login page if no token is found
  //   window.location.href = "/emp/login";
  // }

  return token;
};
