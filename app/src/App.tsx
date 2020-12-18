import React, { useEffect, useRef, useState } from "react";
import {
  Header,
  Home,
  Landing,
  Login,
  Recommend,
  Wave,
} from "./Components/index";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Theme } from "./Theme";
import { useUpdateUser, useUser } from "./UserContext";
import { useQuery } from "react-query";
import { getUser } from "./functions/api";

const Protected: React.FC<PropsProtected> = ({
  component: Component,
  isAuth,
  isLoading,
  error,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoading ? (
          <></>
        ) : isAuth ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const { current: user } = useRef(useUser());
  const { current: setUser } = useRef(useUpdateUser());
  const { isLoading, data, status } = useQuery(
    ["getUser", token],
    () => {
      return getUser(token!);
    },
    {
      enabled: !!token,
    }
  );

  useEffect(() => {
    if (!isLoading && Object.keys(user).length && token) {
      setUser({
        displayName: data.display_name,
        product: data.product,
        url: data.external_urls.spotify,
        followers: data.followers.total,
        id: data.id,
      });
    }
  }, [data, setUser, isLoading, user, token]);

  // Reomve stale token
  useEffect(() => {
    if (status === "error") {
      localStorage.removeItem("token");
    }
  }, [status]);
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
                isAuth={data ? true : false}
              />
            </Route>
            <Route path="/home">
              <Protected
                isLoading={isLoading}
                component={() => <Home token={token!} />}
                isAuth={data ? true : false}
              />
            </Route>
            <Route path="/landing">
              <Landing setToken={setToken} />
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

interface PropsProtected {
  component: any;
  isAuth: boolean;
  isLoading: boolean;
  [key: string]: any;
}

export default App;
