import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    ERROR_MODAL: "ERROR_MODAL"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        isError: false,
        errorMessage: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    isError: false,
                    errorMessage: null
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    isError: false,
                    errorMessage: null
                })
            }
            case AuthActionType.ERROR_MODAL: {
                return setAuth({
                    user: auth.user,
                    loggedIn: true,
                    isError: payload.isError,
                    errorMessage: payload.errorMessage
                })
            }
            default:
                return auth;
        }
    }

    auth.closeModal = function(){
        authReducer({
            type: AuthActionType.ERROR_MODAL,
            payload: {
                isError: false,
                errorType: null
            }
        });
    }

    auth.getLoggedIn = async function (userData,store) {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(userData, store) {
        try{
        const response = await api.registerUser(userData);      
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
    }catch(error){
        console.log(error.response.data);
        authReducer({
            type: AuthActionType.ERROR_MODAL,
            payload: {
                isError: true,
                errorMessage: error.response.data.errorMessage
            }
        });
    }
    }
    auth.loginUser = async function(loginInfo, store){
        try{
        const response = await api.loginUser(loginInfo);//LOGIN USER RETURNS USE IF VALID PASSWORD WORKS, ERROR IF NOT      
        console.log(response);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
            history.push("/");
            store.loadIdNamePairs();
        }
    }catch(error){
        authReducer({
            type: AuthActionType.ERROR_MODAL,
            payload: {
                isError: true,
                errorMessage: error.response.data.errorMessage
            }
        });
    }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };