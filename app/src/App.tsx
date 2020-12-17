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

const Protected: React.FC<PropsProtected> = ({
  component: Component,
  isAuth,
  isLoading,
  ...rest
}) => {
  if (isLoading) {
    return <> </>;
  }
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

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
      <div className="App">
        <Router>
          <Wave />
          <Header />
          <Switch>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/recommend">
              <Protected
                isLoading={isLoading}
                component={() => <Recommend token={token!} />}
                isAuth={isAuth}
              />
            </Route>
            <Route path="/home">
              <Protected
                isLoading={isLoading}
                component={() => <Home token={token!} />}
                isAuth={isAuth}
              />
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

interface PropsProtected {
  component: any;
  isAuth: boolean;
  isLoading: boolean;
  [key: string]: any;
}

export default App;
