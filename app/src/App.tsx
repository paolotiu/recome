import React from "react";
import { Header, Home, Login, Recommend, Wave } from "./Components/index";
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
        <Header />
        <Router>
          <Switch>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/recommend" exact>
              <Recommend access_token={access_token} />
            </Route>
            <Route path="/home">
              <Home token={access_token} />
            </Route>

            <Route path="/">
              <Redirect to="/home" />
            </Route>
          </Switch>
        </Router>
      </div>
    </Theme>
  );
}

export default App;
