import React, {useContext, useEffect} from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Nav from "./components/Nav";
import Dashboard from "./pages/Dashboard";
import RecipePage from "./pages/Recipe";
import Search from "./pages/Search";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import { PrivateRouteProps } from "./ts/interfaces";
import {AuthProvider} from "./contexts/AuthContext";
import { IngredientsListProvider } from "./contexts/IngredientsListContext";


const App = () => {

    const defaultPrivateRouteProps: Omit<PrivateRouteProps, 'outlet'> = {
        authenticationPath: '/',
      };

    return (
        <div>
            <AuthProvider>
            <IngredientsListProvider>
                <Router>
                    <Nav />
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route 
                            path='dashboard' 
                            element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<Dashboard />} />} 
                        />
                        <Route path="/recipe/:id" element={<RecipePage />}/>
                        <Route path="/search" element={<Search />}/>
                    </Routes>
                </Router>
            </IngredientsListProvider> 
            </AuthProvider>
        </div>
    );
};

export default App;
