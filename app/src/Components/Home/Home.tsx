import React from "react";
import { Redirect } from "react-router";

interface Props {
  token: string;
}

export const Home: React.FC<Props> = ({ token }) => {
  if (!token) {
    return <Redirect to="/login" />;
  }
  return <div></div>;
};
