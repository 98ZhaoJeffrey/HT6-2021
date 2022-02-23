import React, {ReactNode, useContext} from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { PrivateRouteProps } from "../ts/interfaces";


const PrivateRoute = ({authenticationPath, outlet}: PrivateRouteProps) => {
    const currentUser = useContext(AuthContext);
    if(currentUser != null) {
        return outlet;
    } else {
        return <Navigate to={{ pathname: authenticationPath }} />;
    }
};

export default PrivateRoute