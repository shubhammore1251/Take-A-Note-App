import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import NotesList from "./components/NotesList";
import AddNote from "./components/AddNote";
import Login from "./components/Login";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import Register2FA from "./components/Register2FA";
import Verify2FA from "./components/Verify2FA";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoutes from "./components/PrivateRoutes";
import { logout } from "./redux/action/authaction";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  // const { accessToken, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const timerRef = useRef();

  useEffect(() => {
    const reset = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        dispatch(logout()); 
        navigate("/login");
      }, 300000);
    };

    const events = ['mousemove','mousedown','keydown','scroll','touchstart'];
    events.forEach(e => document.addEventListener(e, reset));

    reset(); // start initial timer

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(e => document.removeEventListener(e, reset));
    };
  }, [dispatch]);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route
              exact
              path="/"
              element={
                <Layout>
                  <NotesList />
                </Layout>
              }
            />

            <Route
              exact
              path="/addanote"
              element={
                <Layout>
                  <AddNote />
                </Layout>
              }
            />
          </Route>

          <Route exact path="/login" element={<Login />} />

          <Route
            exact
            path="/two-factor/register/:token"
            element={<Register2FA />}
          />

          <Route
            exact
            path="/two-factor/verify/:token"
            element={<Verify2FA />}
          />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
