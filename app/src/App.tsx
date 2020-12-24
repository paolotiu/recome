import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Header, Landing, Login, Wave } from "./Components/index";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Theme } from "./Theme";
import { useUpdateUser } from "./UserContext";
import { useQuery } from "react-query";
import { getUser } from "./functions/api";
import { Toaster } from "react-hot-toast";
const Home = lazy(() => import("./Components/Lazy/Home"));
const Recommend = lazy(() => import("./Components/Lazy/Recommend"));
const Favorites = lazy(() => import("./Components/Lazy/Favorites"));
const Generate = lazy(() => import("./Components/Lazy/Generate"));
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

  const { current: setUser } = useRef(useUpdateUser());
  const { isLoading, data, status } = useQuery(
    "getUser",
    () => {
      return getUser(token!);
    },
    {
      enabled: !!token,

      refetchOnMount: "always",
    }
  );

  useEffect(() => {
    if (status === "success") {
      setUser({
        displayName: data.display_name,
        id: data.id,
        product: data.product,
        followers: data.followers.total,
        url: data.href,
      });
    } else if (status === "error") {
      localStorage.removeItem("token");
    }
  }, [status, data, setUser]);

  return (
    <Theme>
      <div className="App">
        <Router>
          <Wave />
          <Header />
          <Toaster
            toastOptions={{
              style: { backgroundColor: "rgb(48, 47, 47)", color: "#EEE" },
            }}
          />
          <Suspense fallback={<div></div>}>
            <Switch>
              <Route path="/login" exact>
                <Login />
              </Route>
              <Route path="/recommend">
                <Protected
                  isLoading={isLoading}
                  component={() => <Recommend />}
                  isAuth={data ? true : false}
                />
              </Route>
              <Route path="/home">
                <Protected
                  isLoading={isLoading}
                  component={() => <Home />}
                  isAuth={data ? true : false}
                />
              </Route>
              <Route path="/favorites">
                <Favorites />
              </Route>
              <Route path="/generate">
                <Generate />
              </Route>
              <Route path="/landing">
                <Landing setToken={setToken} />
              </Route>

              <Route path="/">
                <Redirect to="/home" />
              </Route>
            </Switch>
          </Suspense>
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
