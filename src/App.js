import './App.css';
import Navbar from './components/Navbar';
import {Routes, Route} from "react-router-dom";
import NotesList from './components/NotesList';
import AddNote from './components/AddNote';
import Login from './components/Login';
import { useNavigate } from 'react-router-dom';
import { useSelector} from "react-redux";
import { useEffect } from 'react';

const Layout = ({children})=>{
      
  return(
    <>
    <Navbar/>
    {children}
    </>
    
  )
}


function App() {
  
  const { accessToken, loading} = useSelector(state => state.auth);

  const navigate = useNavigate();

  useEffect(() => {

    if (!loading && !accessToken) {
      navigate("/login")
    }
  }, [accessToken,loading, navigate])


  return (
    <>
     
     <Routes>

      <Route exact path="/" element={<Layout><NotesList/></Layout>} />

      <Route exact path="/addanote" element={<Layout><AddNote/></Layout>} />

      <Route exact path="/login" element={<Login/>} />
     </Routes>
    </>
  );
}

export default App;
