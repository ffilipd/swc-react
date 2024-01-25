import { Box, Typography } from "@mui/material";
import { FmButton, FmButton2, FmButtonCircle } from "../../utils/buttons";
import { useState } from "react";
import { useEquipment } from "../../EquipmentContext";

const MobileBooking = () => {
  const { equipment } = useEquipment();
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

  if (equipment) console.log(equipment);

  return (
    <Box>
      {accessablEquipmentNames.map((item: string, index: number) => (
        <Box key={`${item}-${index}`}>
          <FmButton2
            sx={{
              width: "100%",
              marginBottom: "15px",
              display: "flex",
              backgroundColor: expanded === index ? "#053654" : "",
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
                <FmButtonCircle
                  key={num}
                  sx={{
                    margin: "10px 10px 20px 10px",
                  }}
                  onClick={() => handleMobileSelectEquipmentNumber(num, index)}
                >
                  {num}
                </FmButtonCircle>
              ))}
            </Box>
          )}
        </Box>
      ))}
      <Typography
        sx={{
          padding: "4px 15px",
          borderRadius: "50px",
        }}
      >
        Selected: {selectedEquipmentString}
      </Typography>
    </Box>
  );
};

export default MobileBooking;
