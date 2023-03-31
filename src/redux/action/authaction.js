import firebase from 'firebase/compat/app';
import {auth} from "../../firebase"
import { LOAD_PROF, LOGIN_FAIL, LOGIN_REQ, LOGIN_SUCCESS, LOGOUT } from '../action-types';
import Cookies from 'js-cookie';

export const login = ()=> async (dispatch) =>{

    try{
        
        dispatch({
            type: LOGIN_REQ,
        })

        const provider = new firebase.auth.GoogleAuthProvider()
        
        const res = await auth.signInWithPopup(provider);
        
        const accessToken = res.credential.accessToken;

        const profile = {
            name: res.additionalUserInfo.profile.name,
            photoURL: res.additionalUserInfo.profile.picture,
            userId: res.additionalUserInfo.profile.id
        }

    
        Cookies.set('takeanote-access-token', accessToken, { expires: 5 });
        Cookies.set('takeanote-user', JSON.stringify(profile) , { expires: 5 })

        dispatch({
            type: LOGIN_SUCCESS,
            payload: accessToken
        })

        dispatch({
            type: LOAD_PROF,
            payload: profile
        })
    }
    catch(error){
        dispatch({
            type: LOGIN_FAIL,
            payload: error.message
        })
    }
}


export const logout = () => async dispatch =>{

    await auth.signOut()

    dispatch({
        type: LOGOUT
    })

    Cookies.remove('takeanote-access-token');
    Cookies.remove('takeanote-user');
}