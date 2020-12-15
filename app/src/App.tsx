import React from "react";
import { Login, Recommend, Wave } from "./Components/index";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Theme } from "./Theme";

function App() {
  const params = new URLSearchParams(window.location.search);
  const access_token = params.get("access_token")!;

  return (
    <Theme>
      <Wave />
      <div className="App">
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/recommend">
              <Recommend access_token={access_token} />
            </Route>
            <Route path="/">
              <Redirect to="/recommend" />
            </Route>
          </Switch>
        </Router>
      </div>
    </Theme>
  );
}

export default App;
