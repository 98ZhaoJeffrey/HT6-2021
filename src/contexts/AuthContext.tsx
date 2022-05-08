import React, {useState, createContext, ReactNode, useEffect } from "react";
import firebase from "../firebase";


export const AuthContext = createContext<firebase.User | null>(null);

const parseUser = (user: string | null) => {
    return (user === null) ? null : JSON.parse(user);
}

export const AuthProvider = ({children} : {children : ReactNode}) => {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(parseUser(localStorage.getItem("user")));

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user)
            localStorage.setItem("user", JSON.stringify(user));
            console.log(currentUser)
        });
        return unsubscribe;
    });

    return(
        <AuthContext.Provider value={currentUser}>
            { children }
        </AuthContext.Provider>
    )
};