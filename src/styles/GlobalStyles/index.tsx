import React, { ReactNode } from "react";
import "./GlobalStyles.scss";

type GlobalStyledProps = {
  children: ReactNode;
};
const GlobalStyled: React.FC<GlobalStyledProps> = ({ children }) => {
  return <>{children}</>;
};

export default GlobalStyled;
