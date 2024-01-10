// URL
export const URL_API = `http://localhost:2010`;

// USER CONTROLLER
export const LOGIN_SUCCES = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const GET_DATA_ADDRESS = "GET_DATA_ADDRESS";
export const GET_PROFILE_IMAGE = "GET_PROFILE_IMAGE";
export const GET_DATA_CITY = "GET_DATA_CITY";

// PRODUCT CONTROLLER
export const GET_PRODUCT = "GET_PRODUCT";

//GET TOKEN
export const headers = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("tkn_id")}`,
  },
};
