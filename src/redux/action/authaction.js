import firebase from "firebase/compat/app";
import { auth } from "../../firebase";
import {
  LOAD_PROF,
  LOGIN_FAIL,
  LOGIN_REQ,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../action-types";
import Cookies from "js-cookie";
import axios from "axios";

let URL =
  process.env.REACT_APP_NODE_ENV === "PRODUCTION"
    ? process.env.REACT_APP_BACKEND_LIVE_URL
    : process.env.REACT_APP_BACKEND_LOCAL_URL;

export const login = () => async (dispatch) => {
  try {
    dispatch({
      type: LOGIN_REQ,
    });

    const provider = new firebase.auth.GoogleAuthProvider();

    const res = await auth.signInWithPopup(provider);

    let profile = {
      name: res.additionalUserInfo.profile.name,
      photoURL: res.additionalUserInfo.profile.picture,
    };
    
    const response = await axios.post(
      `${URL}/api/signupuser`,
      {
        name: res.additionalUserInfo.profile.name,
        photoURL: res.additionalUserInfo.profile.picture,
        email: res.additionalUserInfo.profile.email,
      },
      {
        withCredentials: true,
        headers: {
          'x-crypt-value': process.env.REACT_APP_BACKEND_CRYPT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    if (response && response.status === 200) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data.data,
      });

      profile = {
        ...profile,
        userId: response?.data?.data?.userId,
      };

      dispatch({
        type: LOAD_PROF,
        payload: profile,
      });

      Cookies.set("takeanote-user", JSON.stringify(profile), {
        expires: 1,
      });
    } else {
      dispatch({
        type: LOGIN_FAIL,
        payload: "Login Failed!",
      });
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  await auth.signOut();

  const response = await axios.post(
    `${URL}/api/logout`,
    {},
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // ✅ send cookie so server can clear it
    }
  );

  if (response && response.status === 200) {
    dispatch({
      type: LOGOUT,
    });
  }
  Cookies.remove("takeanote-user");
};
