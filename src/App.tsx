import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Nav from "./components/Nav";
import Dashboard from "./pages/Dashboard";
import Hero from "./components/Hero";
import Features from "./components/Features";
import RecipePage from "./pages/Recipe";
import Search from "./pages/Search";

const App = () => {
    return (
        <div>
            <Router>
                <Nav />
                <Switch>
                    <Route exact path="/">
                        <Hero />
                        <Features />
                    </Route>
                    <Route path="/dashboard">
                        {localStorage.getItem("user") ? (
                            <Dashboard />
                        ) : (
                            <Redirect to="/" />
                        )}
                    </Route>
                    <Route path="/recipe/:id">
                        <RecipePage />
                    </Route>
                    <Route path="/search">
                        <Search />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
};

export default App;
