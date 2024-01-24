import { Box, Typography } from "@mui/material";
import { FmButton, FmButton2, FmButtonSecondary } from "../../utils/buttons";
import { useState } from "react";

const MobileBooking = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<{
    type: string;
    equipmentNameId: string;
    number: string;
  }>({ type: "", equipmentNameId: "", number: "" });

  const [selectedEquipmentString, setSelectedEquipmentString] =
    useState<string>("");

  const accessablEquipmentNames = ["Elliott 6M", "J/70", "RS Toura"];

  const [expanded, setExpanded] = useState(-1);

  const handleExpand = (index: number) => {
    setExpanded(index === expanded ? -1 : index);
  };

  const handleMobileSelectEquipmentName = (name: string, index: number) => {
    setSelectedEquipmentString(name);
    handleExpand(index);
  };

  const handleMobileSelectEquipmentNumber = (number: number, index: number) => {
    setSelectedEquipmentString(selectedEquipmentString + " #" + number);
    handleExpand(index);
  };

  return (
    <Box>
      {accessablEquipmentNames.map((item: string, index: number) => (
        <Box key={`${item}-${index}`}>
          <FmButton2
            sx={{
              width: "100%",
              marginBottom: "15px",
              display: "flex",
            }}
            onClick={() => handleMobileSelectEquipmentName(item, index)}
          >
            {item}
          </FmButton2>
          {expanded === index && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <FmButtonSecondary
                  key={num}
                  sx={{
                    margin: "10px 10px 20px 10px",
                    opacity: num === 3 ? "70%" : "",
                    backgroundColor: num === 3 ? "gray" : "",
                  }}
                  onClick={() => handleMobileSelectEquipmentNumber(num, index)}
                >
                  {num}
                </FmButtonSecondary>
              ))}
            </Box>
          )}
        </Box>
      ))}
      <Typography
        className="label"
        sx={{ backgroundColor: "#999", padding: "5px" }}
      >
        Selected: {selectedEquipmentString}
      </Typography>
    </Box>
  );
};

export default MobileBooking;
