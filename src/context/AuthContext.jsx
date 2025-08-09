import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../redux/action/authaction";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

let URL =
  process.env.REACT_APP_NODE_ENV === "PRODUCTION"
    ? process.env.REACT_APP_BACKEND_LIVE_URL
    : process.env.REACT_APP_BACKEND_LOCAL_URL;

console.log(URL);

export const AuthProvider = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    async function verify() {
      try {
        const res = await axios.get(`${URL}/api/check-session`, {
          withCredentials: true,
        });
        setAuthed(res.data.valid);
        if (
          !res.data.valid ||
          !res.data.twoFAEnabled ||
          !res.data.twoFAVerified
        ) {
          setAuthed(false);
          logout();
        }
      } catch {
        setAuthed(false);
        logout();
      } finally {
        setChecking(false);
      }
    }
    verify();
  }, []);

  return (
    <AuthContext.Provider value={{ authed, checking }}>
      {children}
    </AuthContext.Provider>
  );
};
