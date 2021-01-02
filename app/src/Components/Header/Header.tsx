import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as Logo } from "../../static/logo.svg";
import { ReactComponent as Bars } from "../../static/bars.svg";
import { Link, useLocation } from "react-router-dom";
import { logOut } from "../../functions/util";
const StyledDropdown = styled.div<{ isDropdownOpen: boolean }>`
  display: ${(props) => (props.isDropdownOpen ? "flex" : "none")};
  position: absolute;
  flex-direction: column;
  text-align: right;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.light};
  border-radius: 4px;
  right: 0;
  font-size: 0.9em;
  font-weight: 300;
  white-space: nowrap;
  z-index: 1000;
  > span,
  > a {
    cursor: pointer;
    padding: 1em 1em 1em 1em;
    :last-child {
      border-top: 1px solid ${(props) => props.theme.lightenedDark};
    }
  }

  #logout {
    padding-top: 0.4em;
  }
`;
const StyledHeader = styled.header`
  display: grid;
  grid-template-columns: 200px 1fr;
  justify-content: center;
  align-items: center;
  padding: 2em;

  .logo-svg {
    width: 100px;
  }
  .nav-links {
    position: relative;
    justify-self: end;
    svg {
      cursor: pointer;
      &:hover {
      }
      height: 100%;
      width: 2em;
    }
  }
  @media (max-width: 600px) {
    padding: 1em;
  }
`;
interface Props {}

export const Header: React.FC<Props> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { pathname: path } = useLocation();
  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }
  window.onclick = function (e: Event) {
    e.stopPropagation();
    setIsDropdownOpen(false);
  };
  const navLinks = (
    <div className="nav-links">
      <Bars
        style={{ fill: "white" }}
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown();
        }}
      />
      <StyledDropdown isDropdownOpen={isDropdownOpen} className="dropdown">
        <Link to="/home">
          <span>Home</span>
        </Link>
        <span id="logout" onClick={logOut}>
          Log out
        </span>
      </StyledDropdown>
    </div>
  );
  return (
    <StyledHeader>
      <Link to="/home">
        <Logo className="logo-svg" />
      </Link>
      {path === "/login" ? "" : navLinks}
    </StyledHeader>
  );
};
