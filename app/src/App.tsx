import React, { useEffect, useMemo, useRef, useState } from "react";
import { Header, Home, Login, Recommend, Wave } from "./Components/index";
import { getUser } from "./functions/api";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Theme } from "./Theme";
import { useUpdateUser } from "./UserContext";
function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const { current: setUser } = useRef(useUpdateUser());
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const access_token = params.get("access_token")!;

  //Check if logged in
  useEffect(() => {
    if (!token || token === "null") {
      if (access_token) {
        setToken(access_token);
        logIn();
        localStorage.setItem("token", access_token);
      } else {
        logOut();
        setIsLoading(false);
        setToken(null);
      }
    } else {
      setIsLoading(true);
      getUser(token)
        .then((res: any) => {
          setUser({
            displayName: res.display_name!,
            product: res.product,
            url: res.external_urls.spotify,
            followers: res.followers.total,
            id: res.id,
          });
          logIn();
          setIsLoading(false);
        })
        .catch((err) => {
          setToken("");
          setIsLoading(false);
          localStorage.removeItem("token");
        });
    }
  }, [token, setToken, params, access_token, setUser]);

  return (
    <Theme>
      <Wave />

      <div className="App">
        <Router>
          <Header />
          <Switch>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/recommend">
              {isAuth ? (
                <Recommend token={token!} />
              ) : isLoading ? (
                ""
              ) : (
                <Redirect to="login" />
              )}
            </Route>
            <Route path="/home">
              {/* Redirect to login page if not authenticated */}
              {isAuth ? (
                <Home token={token!} />
              ) : isLoading ? (
                ""
              ) : (
                <Redirect to="login" />
              )}
            </Route>
            <Route path="/">
              <Redirect to="/home" />
            </Route>
          </Switch>
        </Router>
      </div>
    </Theme>
  );

  function logIn() {
    setIsAuth(true);
  }

  function logOut() {
    setIsAuth(false);
  }
}

export default App;
