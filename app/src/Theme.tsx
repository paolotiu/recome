import React from "react";
import { ThemeProvider } from "styled-components";

const theme = {
  mainFont: "Poppins",
  primary: "#222831",
  secondary: "#00ADB5",
  lightenedDark: "#444444",
  background: "#393939",
  darkBg: "#302f2f",
  light: "#EEE",
  buttonBg: "#00ADB5",
  buttonText: "#EEE",
};

export const Theme: React.FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
