import React, { useEffect, useMemo, useState } from "react";
import { Header, Home, Login, Recommend, Wave } from "./Components/index";
import { getUser } from "./functions/api";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Theme } from "./Theme";
import { IUser } from "./types";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState<IUser>();

  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const access_token = params.get("access_token")!;
  useEffect(() => {
    console.log("effect");
    if (!token || token === "null") {
      console.log(params);

      if (params) {
        setToken(access_token);
        localStorage.setItem("token", access_token);
      } else {
        setToken(null);
      }
    } else {
      getUser(token)
        .then((res: any) => {})
        .catch((err) => {
          setToken("");
          localStorage.removeItem("token");
        });
    }
  }, [token, setToken, params, access_token]);

  return (
    <Theme>
      <Wave />

      <div className="App">
        <Header />
        <Router>
          <Switch>
            <Route path="/login" exact>
              {token && token !== "null" ? <Redirect to="/home" /> : <Login />}
            </Route>
            {token && token !== "null" ? (
              <>
                <Route path="/recommend" exact>
                  <Recommend access_token={token!} />
                </Route>
                <Route path="/home">
                  {/* <Home token={access_token} /> */}
                </Route>
                <Route path="/">
                  <Redirect to="/home" />
                </Route>{" "}
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Switch>
        </Router>
      </div>
    </Theme>
  );
}

export default App;
