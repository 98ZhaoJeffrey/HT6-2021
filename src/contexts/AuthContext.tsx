import React, {useState, createContext, ReactNode, useEffect } from "react";
import { auth } from "../firebase";
import { User } from "firebase/auth";


export const AuthContext = createContext<User | null>(null);

const parseUser = (user: string | null) => {
    return (user === null) ? null : JSON.parse(user);
}

export const AuthProvider = ({children} : {children : ReactNode}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(parseUser(localStorage.getItem("user")));

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            localStorage.setItem("user", JSON.stringify(user));
        });
        return unsubscribe;
    });

    return(
        <AuthContext.Provider value={currentUser}>
            { children }
        </AuthContext.Provider>
    )
};