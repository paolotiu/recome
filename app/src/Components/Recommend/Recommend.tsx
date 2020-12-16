import React from "react";
import { Redirect } from "react-router";

interface Props {
  token: string;
}

export const Recommend: React.FC<Props> = ({ token }) => {
  return <div>{token} Hey</div>;
};
