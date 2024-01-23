import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getEquipment } from "../../service/equipment.service";
import { FmButton, FmButton2, FmButtonCube } from "../../utils/buttons";
import "./home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });
  return isMobile ? (
    <Box className="home-button-container">
      <Box className="home-button-row">
        <FmButtonCube onClick={() => navigate("/booking")}>Book</FmButtonCube>
        <FmButtonCube onClick={() => navigate("/report")}>Report</FmButtonCube>
      </Box>
      <Box className="home-button-row">
        <FmButtonCube>Status</FmButtonCube>
        <FmButtonCube>Fix</FmButtonCube>
      </Box>
    </Box>
  ) : (
    <Box>Home</Box>
  );
}

export default Home;
