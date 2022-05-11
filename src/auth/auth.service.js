import { API_BASE_URL, ACCESS_TOKEN_NAME } from "@/config/serverApiConfig";

import axios from "axios";
import errorHandler from "@/request/errorHandler";
import successHandler from "@/request/successHandler";
import storePersist from "@/redux/storePersist";

import { getCookie, setCookie, deleteCookie } from "./cookie";

export const login = async (loginAdminData) => {
  try {
    const response = await axios.post(
      API_BASE_URL + `login`,
      loginAdminData
    );
    token.set(response.data.result.token);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

export const logout = () => {
  token.remove();
  storePersist.clear();
};

export const registerProvider = async (loginAdminData) => {
  console.log(loginAdminData)
  try {
    const response = await axios.post(
      API_BASE_URL + `register?timestamp=${new Date().getTime()}`,
      loginAdminData
    );
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
}

export const token = {
  get: () => {
    return getCookie(ACCESS_TOKEN_NAME);
  },
  set: (token) => {
    return setCookie(ACCESS_TOKEN_NAME, token);
  },
  remove: () => {
    return deleteCookie(ACCESS_TOKEN_NAME);
  },
};

export const verifyClient = async (loginAdminData) => {
  try {
    const response = await axios.get(
      API_BASE_URL + `client/verify/${loginAdminData.id}/${loginAdminData.token}`
    );
    token.set(response.data.result.token);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};