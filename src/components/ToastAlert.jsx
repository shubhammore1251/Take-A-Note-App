import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastAlert = ({type,msg}) => {
  
  
  if (type===("addnote" || "editnote" || "deletenote")) {
    const notify = () => toast.success(msg);
     
    notify();
    
  }
 

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default ToastAlert;
