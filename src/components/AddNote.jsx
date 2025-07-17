import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNote } from "../redux/action/notes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";


const AddNote = () => {

  const [note, setNote] = useState({title:"", text:""});

  const user = useSelector(state => state.auth?.user)
  const error = useSelector((state) => state.auth.error);
  console.log(user);

  const noteId = uuidv4();

  console.log(noteId, "noteId");

  const dispatch = useDispatch();

  const notify = (msg) => toast.success(msg);
  
  const handleClick =(e)=>{ 
    e.preventDefault();

    const data = {
      ...note,
      id: noteId,
      createdAt: new Date()
    };

    dispatch(addNote(data));
    notify("Note Added Sucessfully");
    setNote({title:"", text:""});
  }

  const onChange = (e)=>{
    setNote({...note,[e.target.name]: e.target.value});
  }

  useEffect(() => {
    if (error) {
      toast.error('Error Occured! Please Try Again');
    }
  }, [error])
  


  return (
    <div className="container px-2 my-4">
      <div className="heading text-center mt-5">
        <h1>Create a Note</h1>
      </div>

      <div className="form-div">
        <form className='form-class my-3'>
          <div className="mb-3">
            <label className="form-label">
              Add a Title
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter a title"
              name="title"
              value={note.title}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Add Your Text
            </label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Enter your note text"
              name="text"
              value={note.text}
              onChange={onChange}
            ></textarea>
          </div>

          <button className="btn-submit" type="submit" onClick={handleClick} disabled={note.title.length<5 || note.text.length<5}>Add Note</button>
        </form>
      </div>

       

      {/* <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      /> */}
    </div>
  );
};

export default AddNote;
