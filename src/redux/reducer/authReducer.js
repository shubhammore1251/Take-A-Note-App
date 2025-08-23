import Cookies from 'js-cookie';
import { LOAD_PROF, LOGIN_FAIL, LOGIN_REQ, LOGIN_SUCCESS, LOGOUT } from '../action-types';

const initialState = {
    user: Cookies.get('takeanote-user') ? JSON.parse(Cookies.get('takeanote-user')) : null,
    loading: false,
    twoFAData: null,
    error: null
}


export const authReducer = (state = initialState, action)=>{
      
    const {type,payload} = action

    switch(type){

        case LOGIN_REQ:
            return {...state, loading:true}
        
        case LOGIN_SUCCESS:
            return {...state, twoFAData: payload, loading:false}

        case LOGIN_FAIL:
            return {...state, loading: false, error: payload}

        case LOAD_PROF:
            return {...state, user: payload}

        case LOGOUT:
            return {...state, user: null}

        default:
            return state
    }
}