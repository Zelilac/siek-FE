import { LOGIN_FAILED, LOGIN_SUCCES, LOGOUT } from "../Helper";

const INTIAL_STATE = {
  iduser: "",
  fullname: "",
  gender: "",
  username: "",
  email: "",
  role: "",
  status: "",
  cart: [],
  address: [],
  messages: "",
  response: "",
  phone_number: "",
  profile_image: ""
};

export const authReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_SUCCES:
      return { ...state, ...action.payload };
    case LOGIN_FAILED:
      return {
        ...state,
        messages: action.payload.messages,
        response: action.payload.response,
      };
    case "GET_DATA_ADDRESS":
      return { ...state, address: action.payload };
    case "GET_PROFILE_IMAGE":
      return { ...state, image_profile: action.payload };
    case LOGOUT:
      return INTIAL_STATE;
    default:
      return state;
  }
};
