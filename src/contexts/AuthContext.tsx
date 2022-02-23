import React, {useState, createContext, ReactNode, useEffect } from "react";
import firebase from "../firebase";


export const AuthContext = createContext<firebase.User | null>(null);

export const AuthProvider = ({children} : {children : ReactNode}) => {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user)
            console.log(currentUser)
        });
        return unsubscribe;
    }, []);

    return(
        <AuthContext.Provider value={currentUser}>
            { children }
        </AuthContext.Provider>
    )
};

export default {AuthProvider, AuthContext}