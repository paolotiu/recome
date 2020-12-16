import React from "react";

import styled from "styled-components";

interface Props {
  token: string;
}

const StyledDiv = styled.div`
  overflow-wrap: break-word;
`;

export const Recommend: React.FC<Props> = ({ token }) => {
  return <StyledDiv>{token}</StyledDiv>;
};
