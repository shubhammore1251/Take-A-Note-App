import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {updateNote,deleteNote, getNotes } from "../redux/action/notes";
import NoteCard from "./NoteCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Spinner";

const NotesList = () => {
  

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotes())
  }, [dispatch])

  
  const [updatedNote, setUpdatedNote] = useState({
    userid1: "",
    createAt1: "",
    title1: "",
    text1: "",
    id1: "",
    uname: ""
  });
  

  const {
    notesList: list,
    loading,
  } = useSelector((state) => state.getnotes);
  
  

  const ref = useRef(null);
  const refClose = useRef(null);

  const notify = (msg) => toast.success(msg);

  const onChange = (e) => {
    setUpdatedNote({ ...updatedNote, [e.target.name]: e.target.value });
  };

  const editNote = (currNote) => {
    ref.current.click();
    setUpdatedNote({
      userid1: currNote.userid,
      createdAt1: currNote.createdAt,
      title1: currNote.title,
      text1: currNote.text,
      id1: currNote.id,
      uname1: currNote.uname
    });
  };
  
  
  const handleClick = () => {
    dispatch(updateNote(updatedNote));
    refClose.current.click();
    notify("Note Saved");
  };

  
  const handleDelete = (note)  => {
    dispatch(deleteNote(note));
    notify("Note Deleted");
  };

  

  

  return (
    <div>
      {/* Button trigger modal */}
      <button
        type="button"
        ref={ref}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        Launch static backdrop modal
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                View / Edit Your Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title1"
                    name="title1"
                    value={updatedNote.title1}
                    placeholder="Your Title Here"
                    onChange={onChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="text" className="form-label">
                    Text
                  </label>
                  <textarea
                    className="form-control"
                    id="text1"
                    name="text1"
                    value={updatedNote.text1}
                    onChange={onChange}
                    rows="5"
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                ref={refClose}
                className="btn btn-danger d-none"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn modal-btn"
                onClick={handleClick}
                disabled={
                  updatedNote.title1.length < 5 || updatedNote.text1.length < 5
                }
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ):(
        <div className="container card-cont px-2 my-1">
          <div className="heading text-center">
            {list.length ? (
              <h1>Your Notes</h1>
            ) : (
              <h1>You Don't Have any Notes!😕</h1>
            )}
          </div>

          <div className="card-grid">
            {list.length ? (
              list.map((note, i) => (
                <NoteCard
                  note={note}
                  key={i}
                  editNote={editNote}
                  notify={notify}
                  handleDelete={handleDelete}
                />
              ))
            ) : (
              <div className="container not-found">
                <img src="No-note.gif" alt="no-note" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* <ToastContainer
        position="top-center"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      /> */}
    </div>
  );
};

export default NotesList;
