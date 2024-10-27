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
import History from "./pages/recipeCollections/History";
import PrivateRoute from "./components/PrivateRoute";
import { PrivateRouteProps } from "./ts/interfaces";
import {AuthProvider} from "./contexts/AuthContext";
import { IngredientsListProvider } from "./contexts/IngredientsListContext";
import { ChakraProvider } from '@chakra-ui/react';
import Sidebar from "./components/Sidebar";
import theme from "./utils/theme";
import * as PageRoutes from "./constants/routes";
import Upload from "./pages/Upload";
import Favorite from "./pages/recipeCollections/Favorite";
import NotFound from "./pages/NotFound";
  

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
                                <Route path={PageRoutes.LANDING_PAGE} element={<Home/>}/>
                                <Route path={PageRoutes.LOGIN_PAGE} element={<Login/>}/>
                                <Route path={PageRoutes.SIGNUP_PAGE} element={<SignUp/>}/>
                                <Route 
                                    path={PageRoutes.DASHBOARD_PAGE}
                                    element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<Dashboard />} />} 
                                />
                                <Route 
                                    path={PageRoutes.RECIPE_PAGE}
                                    element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<RecipePage />}/>} 
                                />
                                <Route 
                                    path={PageRoutes.SEARCH_PAGE} 
                                    element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<Search />}/>} 
                                />
                                <Route 
                                    path={PageRoutes.FAVORITE_PAGE}
                                    element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<Favorite />}/>} 
                                />
                                <Route 
                                    path={PageRoutes.HISTORY_PAGE}
                                    element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<History />}/>} 
                                />
                                <Route 
                                    path={PageRoutes.UPLOAD_PAGE}
                                    element={<PrivateRoute {...defaultPrivateRouteProps} outlet={<Upload/>}/>} 
                                />
                                <Route
                                    path="*"
                                    element={<NotFound/>}
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
