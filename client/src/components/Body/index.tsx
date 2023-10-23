import { Suspense } from "react";
import Header from "../Header";
import { Outlet } from "react-router-dom";
import Wrapper from "./Wrapper";
import Inner from "./Inner";

function Body() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Wrapper>
        <Header />
        <Inner>
          <Outlet />
        </Inner>
      </Wrapper>
    </Suspense>
  );
}

export default Body;
