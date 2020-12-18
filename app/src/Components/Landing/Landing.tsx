import React, { useEffect, useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { Redirect } from "react-router";
import { getUser } from "../../functions/api";
import { useUpdateUser } from "../../UserContext";

interface Props {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Landing: React.FC<Props> = ({ setToken }) => {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const access_token = params.get("access_token")!;

  const { current: setUser } = useRef(useUpdateUser());
  localStorage.setItem("token", access_token);
  const { isLoading, data } = useQuery("getUser", () => getUser(access_token), {
    enabled: !!access_token,
  });

  useEffect(() => {
    if (data) {
      setToken(access_token);
      setUser({
        displayName: data.display_name!,
        product: data.product,
        url: data.external_urls.spotify,
        followers: data.followers.total,
        id: data.id,
      });
    }
  }, [data, setUser, setToken, access_token]);
  if (isLoading) {
    return <> </>;
  }
  return <Redirect to="/" />;
};
