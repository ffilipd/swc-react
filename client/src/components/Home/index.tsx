import { Box } from "@mui/material";
import { useEffect } from "react";
import { getEquipment } from "../../service/equipment.service";

function Home() {
  useEffect(() => {
    getEquipment();
  }, []);

  return <Box>Home</Box>;
}

export default Home;
