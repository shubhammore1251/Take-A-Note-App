import { applyMiddleware, combineReducers, createStore } from "redux";
import { notesReducer} from "./reducer/notesReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { authReducer } from "./reducer/authReducer";

const reducer=combineReducers({
    auth: authReducer,
    getnotes: notesReducer,
})

const store = createStore(reducer,composeWithDevTools(applyMiddleware(thunk)));

export default store;