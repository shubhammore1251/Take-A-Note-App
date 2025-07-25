import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/action/authaction";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const accessToken = useSelector((state) => state.auth.accessToken);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const twoFAData = useSelector((state) => state.auth.twoFAData);

  const handleLogin = () => {
    dispatch(login());
  };

  useEffect(() => {
    if (error) {
      toast.error('Error Occured! Please Try Again');
    }
  }, [error])
  

  useEffect(() => {
    if (twoFAData) {
      if (twoFAData.multiFactorEnabled) {
        navigate(`/two-factor/verify/${twoFAData.verificationToken}`)
      }else{
        navigate(`/two-factor/register/${twoFAData.verificationToken}`)
      }
    }
  }, [twoFAData,navigate]);

  return (
    <div className="login">
      <div className="login-container">
        <img src="weblogo.png" alt="takeanote-logo" />

        {loading ? (
          <div class="spinner-border text-secondary mt-4" role="status">
            <span class="sr-only d-none">Loading...</span>
          </div>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}

        <p>
          Take'A'Note App Made by{" "}
          <a
            href={process.env.REACT_APP_SOCIAL_GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
          >
            Shubham More
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
