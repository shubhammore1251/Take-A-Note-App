import { LOAD_PROF, LOGIN_FAIL, LOGIN_REQ, LOGIN_SUCCESS, LOGOUT } from '../action-types';

const initialState = {
    accessToken: sessionStorage.getItem("takeanote-access-token")? sessionStorage.getItem("takeanote-access-token") : null,

    user: sessionStorage.getItem("takeanote-user")? JSON.parse(sessionStorage.getItem("takeanote-user")) : null,
    
    loading: false
}


export const authReducer = (state = initialState, action)=>{
      
    const {type,payload} = action

    switch(type){

        case LOGIN_REQ:
            return {...state,loading:true}
        
        case LOGIN_SUCCESS:
            return {...state, accessToken:payload, loading:false}

        case LOGIN_FAIL:
            return {...state, accessToken:null, loading: false, error: payload}

        case LOAD_PROF:
            return {...state, user: payload}

        case LOGOUT:
            return {...state, accessToken: null, user: null}

        default:
            return state
    }
}