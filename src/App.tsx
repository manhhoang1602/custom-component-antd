import React from "react";
import MenuComponent from "./components/MenuComponent";
import {BrowserRouter, Switch, Route} from "react-router-dom";

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={"/menu-component"} component={MenuComponent}/>
                <Route>
                    404 Not Found
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default App;