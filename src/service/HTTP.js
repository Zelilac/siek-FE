import axios from "axios";
import { URL_API, headers } from "../Helper";

class HTTP {
  get = (url, body) => {

    return axios.get(URL_API + url, headers).catch(res => {
      return Promise.reject()
    });
  };
  delete = (url) => {
    return axios.delete(URL_API + url, headers);
  };

  patch = (url, body) => {
    // headers = {
    //   ...headers,
    //   Authorization: `Bearer ${localStorage.getItem("tkn_id")}`,
    // };
   
    return axios.patch(URL_API + url, body, headers);
  };

  post = (url, body) => {
    // let headers = {
    //   ...headersParam,
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem("tkn_id")}`
    //   },
    // };
    
    return axios.post(URL_API + url, body, headers);
  };
}

export default new HTTP();
