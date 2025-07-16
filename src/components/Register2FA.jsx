import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../redux/action/authaction";

let URL =
  process.env.NODE_ENV === "PRODUCTION"
    ? process.env.REACT_APP_BACKEND_LIVE_URL
    : process.env.REACT_APP_BACKEND_LOCAL_URL;

const Register2FA = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [email, setEmail] = useState("");
  const [tokenSuccess, setTokenSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyToken = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${URL}/api/2fa/verify-mfa-token`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res && res.status === 200) {
        setEmail(res.data?.data?.email);
        setTokenSuccess(true);
      } else {
        toast.error("Not Allowed!");
        navigate("/login");
        dispatch(logout());
        setTokenSuccess(false);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error occured", error);
      if (error.response.status === 401) {
        toast.error("Invalid token");
        navigate("/login");
      }else{
        toast.error("Something went wrong!");
      }
      setLoading(false);
      setTokenSuccess(false);
    }
  };

  const setUPTwoFactor = async () => {
    if (!email || email === "") return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${URL}/api/2fa/register`,
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res && res.status === 201) {
        setQrCode(res.data?.data?.qrCode);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error occured", error);
      toast.error("Something went wrong!");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token, navigate]);

  useEffect(() => {
    setUPTwoFactor();
  }, [tokenSuccess]);

  if (loading) {
    return (
      <div className="flex-fill d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verifying...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body text-center">
              <h3 className="card-title mb-4">Enable Two‑Factor Authentication</h3>

              {qrCode ? (
                <>
                  <img src={qrCode} alt="2FA QR Code" className="img-fluid mb-4" />

                  <ol className="text-start mb-4 led">
                    <li>Open an authenticator app (e.g., Google Authenticator).</li>
                    <li>Scan the QR code displayed above.</li>
                    <li>Save the generated code in your app.</li>
                  </ol>

                  <button
                    className="btn btn-lg btn-success w-100"
                    onClick={() => {
                        navigate(`/two-factor/verify/${token}`)
                    }}
                  >
                    Continue to Verification →
                  </button>
                </>
              ) : (
                <p className="text-muted">Generating QR code, please wait…</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register2FA;
