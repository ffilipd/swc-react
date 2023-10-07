import { Suspense } from "react";
import Header from "../Header";
import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";

function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <Outlet />
    </Suspense>
  );
}

export default Home;
