import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RecipePage from "./pages/Recipe";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import History from "./pages/History";
import Collection from "./pages/Collection";
import PrivateRoute from "./components/PrivateRoute";
import { PrivateRouteProps } from "./ts/interfaces";
import {AuthProvider} from "./contexts/AuthContext";
import { IngredientsListProvider } from "./contexts/IngredientsListContext";
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Sidebar from "./components/Sidebar";

const theme = extendTheme({
    components: {
      Steps,
    },
  });
  

const App = () => {

    const defaultPrivateRouteProps: Omit<PrivateRouteProps, 'outlet'> = {
        authenticationPath: '/',
      };

    return (
    <ChakraProvider theme={theme}>
        <AuthProvider>
            <IngredientsListProvider>
                <Router> 
                    <Sidebar> 
                        <Routes>    
                            <Route path="/" element={<Home/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/signup" element={<SignUp/>}/>
                            <Route 
                                path='dashboard' 
                                element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<Dashboard />} />} 
                            />
                            <Route 
                                path="/recipe/:id"
                                element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<RecipePage />}/>} 
                            />
                            <Route 
                                path="/search" 
                                element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<Search />}/>} 
                            />
                            <Route 
                                path="/collection" 
                                element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<Collection />}/>} 
                            />
                            <Route 
                                path="/history" 
                                element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<History />}/>} 
                            />
                        </Routes>
                    </Sidebar> 
                </Router>
            </IngredientsListProvider> 
        </AuthProvider>
    </ChakraProvider>
    );
};

export default App;
