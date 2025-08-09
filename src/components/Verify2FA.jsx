import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../redux/action/authaction";
import { useAuth } from "../context/AuthContext";

let URL =
  process.env.REACT_APP_NODE_ENV === "PRODUCTION"
    ? process.env.REACT_APP_BACKEND_LIVE_URL
    : process.env.REACT_APP_BACKEND_LOCAL_URL;

const Verify2FA = () => {
  const { token } = useParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenSuccess, setTokenSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authed, checking } = useAuth();

  const verifyToken = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${URL}/api/2fa/verify-mfa-token`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            'x-crypt-value': process.env.REACT_APP_BACKEND_CRYPT_SECRET
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
      console.log("Error occured >>>", error);
      if (error.response.status === 401) {
        toast.error("Invalid token");
        navigate("/login");
      } else {
        toast.error("Something went wrong!");
      }
      setLoading(false);
      setTokenSuccess(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token, navigate]);

  //   useEffect(() => {
  //     if (!email && !tokenSuccess) return;
  //     async function checkSecret() {
  //       setLoading(true);
  //       console.log("calling this api");
  //       try {
  //         const res = await axios.post(
  //           `${URL}/api/2fa/verify-mfa-enabled`,
  //           {
  //             email: email,
  //           },
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );
  //         console.log("response", res);
  //         if (res && res.status === 200) {
  //           if (res.data.twoFAEnabled && Boolean(res.data.twoFAVerified)) {
  //             console.log("response data", res.data);
  //             setSecretExists(true);
  //           }
  //         }
  //         setLoading(false);
  //       } catch (err) {
  //         setSecretExists(false);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //     checkSecret();
  //   }, [tokenSuccess, email]);

  const handleRescan = () => {
    navigate(`/two-factor/register/${token}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!tokenSuccess) {
      setError("Looks like entered incorrect url. Please try again.");
      return;
    }
    if (!code.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${URL}/api/2fa/verify-totp`,
        {
          email: email,
          token: code,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            'x-crypt-value': process.env.REACT_APP_BACKEND_CRYPT_SECRET
          },
        }
      );
      if (response && response.status === 200) {
        toast.success("Verification Successful!");
        window.location.href = "/";
        // navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="container py-5 min-vh-100 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-10 col-md-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Verify Your Code</h2>
              <p className="text-center text-muted mb-4">
                Enter the 6-digit code from your authenticator app
              </p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control form-control-sm text-center fs-2 fw-semibold"
                    maxLength="6"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••••"
                    autoFocus
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="d-flex align-items-center justify-content-center w-100 btn bg-warning text-dark fw-bold btn-lg gap-2"
                  disabled={!code || code.length !== 6}
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  Verify
                </button>
              </form>

              <div className="text-center mt-3">
                <p>
                  {" "}
                  issues in getting code ? seems you have not scanned QR code
                  yet. Click here to scan QR code
                </p>
                <button className="btn btn-link" onClick={handleRescan}>
                  Didn’t scan QR code yet? Click here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify2FA;
