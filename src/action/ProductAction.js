import { GET_PRODUCT, GET_DATA_CITY } from "../Helper";
import HTTP from "../service/HTTP";

export const getProductAction = (type, query = "") => {
  return async (dispatch) => {
    try {
      let product = await HTTP.get(`/product/${type}${query}`);
      dispatch({
        type: GET_PRODUCT,
        payload: product.data,
      });
    } catch (error) {
      console.log("ERROR GET PRODUCT", error);
    }
  };
};

// export const getProducts = () => {
//   return async (dispatch) => {
//     try {
//       let res = await HTTP.get(`/product/get-products`);

//       dispatch({
//         type: "GET_DATA_PRODUCTS",
//         payload: res.data,
//       });
//     } catch (error) {
//       console.log("ERROR GET PRODUCT", error);
//     }
//   };
// };

export const getCity = () => {
  return async (dispatch) => {
    try {
      let res = await HTTP.get(`/user/get-city`);
      dispatch({
        type: GET_DATA_CITY,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
};
