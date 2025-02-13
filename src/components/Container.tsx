import React, { ReactNode } from "react";
import { Container } from "@mui/material";

interface ContainerWrapperType {
  children: ReactNode;
}

const ContainerWrapper: React.FC<ContainerWrapperType> = ({ children }) => {
  return (
    <>
      <Container sx={{ width: "100% !important", maxWidth: "none !important" }}>
        <>{children}</>
      </Container>
    </>
  );
};

export default ContainerWrapper;
