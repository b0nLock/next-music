import Navbar from "@/components/Navbar";
import Player from "@/components/Player";
import { Container } from "@mui/material";
import React, { PropsWithChildren } from "react";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container style={{ marginTop: "90px" }}>{children}</Container>
      <Player />
    </>
  );
};

export default MainLayout;
