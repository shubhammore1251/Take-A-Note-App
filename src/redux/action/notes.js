import {
  ADD_NOTE_FAIL,
  ADD_NOTE_REQ,
  ADD_NOTE_SUCCESS,
  DELETE_NOTE_FAIL,
  DELETE_NOTE_REQ,
  DELETE_NOTE_SUCCESS,
  GET_NOTE_FAIL,
  GET_NOTE_REQ,
  GET_NOTE_SUCCESS,
  UPDATE_NOTE_FAIL,
  UPDATE_NOTE_REQ,
  UPDATE_NOTE_SUCCESS,
} from "../action-types";


import { db } from "../../firebase";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  where,
  query
} from "firebase/firestore";



export const getNotes = () => async (dispatch) => {
  let userNotes = [];

  const logedInUser = await JSON.parse(
    sessionStorage.getItem("takeanote-user")
  );

  async function getNoteData(db) {
    const noteCol = collection(db, "notes");

    const UserSpecificNotes = query(
      noteCol,
      where("userid", "==", logedInUser.userId)
    );

    const noteSnapshot = await getDocs(UserSpecificNotes);

    const noteList = noteSnapshot.docs.map((doc) => doc.data());

    return noteList;
  }

  try {
    dispatch({
      type: GET_NOTE_REQ,
    });

    userNotes = await getNoteData(db);

    dispatch({
      type: GET_NOTE_SUCCESS,
      payload: userNotes,
    });

  } catch (error) {
    dispatch({
      type: GET_NOTE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};




export const addNote = (data) => async (dispatch) => {
  
 
  try {
    dispatch({
      type: ADD_NOTE_REQ,
    });

    await setDoc(doc(db, "notes", data.id), {
      userid: data.userid,
      id: data.id,
      uname: data.uname,
      title: data.title,
      text: data.text,
      createdAt: String(data.createdAt)
    });

    dispatch({
      type: ADD_NOTE_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: ADD_NOTE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};




export const deleteNote = (data) => async (dispatch) => {
  
  try {
    dispatch({ 
      type: DELETE_NOTE_REQ 
    })
    
    await deleteDoc(doc(db, 'notes', data.id))
    
    dispatch({ 
      type: DELETE_NOTE_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: DELETE_NOTE_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}


export const updateNote = (data) => async(dispatch)=>{
  
  try {
    
    dispatch({
      type: UPDATE_NOTE_REQ
    })

    await updateDoc(doc(db, 'notes', data.id1), {
      title: data.title1,
      text: data.text1
    })

    dispatch({
      type: UPDATE_NOTE_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: UPDATE_NOTE_FAIL,
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
};

