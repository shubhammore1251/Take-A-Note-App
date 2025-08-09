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

import axios from "axios";

let URL =
  process.env.REACT_APP_NODE_ENV === "PRODUCTION"
    ? process.env.REACT_APP_BACKEND_LIVE_URL
    : process.env.REACT_APP_BACKEND_LOCAL_URL;

export const getNotes = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_NOTE_REQ,
    });

    const response = await axios.get(
      `${URL}/api/get-notes`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (response && response.status === 200) {
      dispatch({
        type: GET_NOTE_SUCCESS,
        payload: response.data.data ?? [],
      });
    }
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

    const response = await axios.post(
      `${URL}/api/addnote`,
      {
        id: data?.id,
        title: data?.title,
        text: data?.text,
        uname: data?.uname,
        userid: data?.userid,
        createdAt: new Date(),
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (response && response.status === 201) {
      dispatch({
        type: ADD_NOTE_SUCCESS,
        payload: data,
      });
    }
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
      type: DELETE_NOTE_REQ,
    });

    const response = await axios.delete(
      `${URL}/api/delete-note/${data?.id}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (response && response.status === 200) {
      dispatch({
        type: DELETE_NOTE_SUCCESS,
        payload: data,
      });
    }
  } catch (error) {
    dispatch({
      type: DELETE_NOTE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateNote = (data) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_NOTE_REQ,
    });

    const response = await axios.put(
      `${URL}/api/update-note/${data?.id1}`,
      {
        title: data?.title1,
        text: data?.text1,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    if (response && response.status === 200) {
      dispatch({
        type: UPDATE_NOTE_SUCCESS,
        payload: data,
      });
    }
  } catch (error) {
    dispatch({
      type: UPDATE_NOTE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
