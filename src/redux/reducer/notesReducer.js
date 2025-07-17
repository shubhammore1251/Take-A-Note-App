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


const initialState = {
  notesList: [],
  loading: false,
  error: null,
}

export const notesReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {

    //GETTING THE NOTES 

    case GET_NOTE_REQ: {
      return {
        ...state,
        loading: true,
      };
    }

    case GET_NOTE_SUCCESS: {
      return {
        ...state,
        notesList: payload,
        loading: false,
      };
    }

    case GET_NOTE_FAIL: {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    }


    //ADDING THE NOTE

    case ADD_NOTE_REQ: {
      return {
        ...state,
      };
    }

    case ADD_NOTE_SUCCESS: {
      return {
        ...state,
        notesList: [...state.notesList, payload],
      };
    }

    case ADD_NOTE_FAIL: {
      return {
        ...state,
        error: payload,
      };
    }
    

    //DELETE THE NOTE
    case DELETE_NOTE_REQ: {
      return {
        ...state,
      };
    }

    case DELETE_NOTE_SUCCESS: {
     
      const filteredList = state.notesList.filter((item) => item.id!== payload.id);

      return {
        ...state,
        notesList: filteredList,
      };
    }

    case DELETE_NOTE_FAIL: {
      return {
        ...state,
        error: payload,
      };
    }


    //UPDATING THE NOTE

    case UPDATE_NOTE_REQ: {
      return {
        ...state,
      }
    }

    case UPDATE_NOTE_SUCCESS: {
     
      const UpdatedList = state.notesList.map((note) =>{
           
        if (note.id===payload.id1) {
      
          note.title = payload.title1
          note.text = payload.text1
        }
        
        return note

      } );

      return {
        ...state,
        notesList: UpdatedList,
      };
    }

    case UPDATE_NOTE_FAIL: {
      return {
        ...state,
        error: payload,
      };
    }

    default:
      return state;
  }
};