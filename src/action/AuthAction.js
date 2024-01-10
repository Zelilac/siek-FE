import axios from "axios";
import {
  LOGIN_FAILED,
  LOGIN_SUCCES,
  LOGOUT,
  URL_API,
  GET_DATA_ADDRESS,
} from "../Helper";
import HTTP from "../service/HTTP";

export const authLogin = (email, password) => {
  return async (dispatch) => {
    try {
      let login = await axios.post(URL_API + `/user/login`, {
        email,
        password,
      });
      if (login.data.status === "verified") {
        localStorage.setItem("tkn_id", login.data.token);
        dispatch({
          type: LOGIN_SUCCES,
          payload: login.data,
        });
      } else {
        dispatch({
          type: LOGIN_FAILED,
          payload: login.data,
        });
      }
    } catch (error) {
      console.log("LOGIN ERROR", error);
    }
  };
};

export const authLogout = () => {
  localStorage.removeItem("tkn_id");
  return {
    type: LOGOUT,
  };
};

export const getAddress = (iduser) => {
  return async (dispatch) => {
    try {
      let res = await HTTP.get(`/user/get-address?iduser=${iduser}`);
      dispatch({
        type: GET_DATA_ADDRESS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

// export const getImageProfileUser = (id) => {
//   return async (dispatch) => {
//     try {
//       let res = await HTTP.get(`/user/get-image-user?iduser=${id}`);
//       dispatch({
//         type: GET_PROFILE_IMAGE,
//         payload: res.data,
//       });
//     } catch (error) {
//       console.log("Get Image Profile Error", error);
//     }
//   };
// };

export const keepLogin = (token) => {
  return async (dispatch) => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let keep = await axios.get(URL_API + `/user/keep`, headers);
      dispatch({
        type: LOGIN_SUCCES,
        payload: keep.data,
      });
    } catch (error) {
      console.log("ERROR KEEP LOGIN", error);
    }
  };
};
