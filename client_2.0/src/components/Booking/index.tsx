import "./mobile-booking.css";
import { Box, Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs";
import { useUser } from "../../UserContext";
import { useState } from "react";
import { FmButton2, FmButtonCircle } from "../../utils/buttons";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DatePicker } from "@mui/x-date-pickers";

dayjs.extend(customParseFormat);

const BookingComponent = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<{
    fromTime: Dayjs | null;
    toTime: Dayjs | null;
  }>({
    fromTime: null,
    toTime: null,
  });
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });

  const [expanded, setExpanded] = useState(-1);

  const handleExpand = (index: number) => {
    setExpanded(index === expanded ? -1 : index);
  };

  const handleMobileSelectEquipmentName = (name: string, index: number) => {
    setSelectedEquipmentString(name);
    handleExpand(index);
  };

  const handleMobileSelectEquipmentNumber = (number: number, index: number) => {
    setSelectedEquipmentString((name) => `${name} #${number}`);
    setTimeout(() => {
      handleExpand(index);
    }, 300);
  };

  const classNames = ["Elliott 6M", "RS Toura", "J/70"];
  const [selectedEquipmentString, setSelectedEquipmentString] =
    useState<string>("");

  return (
    <Box id="mobile">
      <Box id="mobile-booking-header">{t("Book equipment")}</Box>
      <Box id="mobile-booking-class-name">
        {classNames.map((item, index) => (
          <Box key={`${item}-${index}`}>
            <FmButton2
              className="mobile-booking-class-name-button"
              onClick={() => handleMobileSelectEquipmentName(item, index)}
            >
              {item}
            </FmButton2>
            {expanded === index && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <Box
                    sx={{
                      display: "flex",
                      width: "30%",
                      margin: "auto",
                      justifyContent: "center",
                    }}
                  >
                    <FmButtonCircle
                      key={num}
                      onClick={() => {
                        handleMobileSelectEquipmentNumber(num, index);
                      }}
                      id={`circle-${num}-${index}`}
                    >
                      {num}
                    </FmButtonCircle>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <Box id="mobile-selected-equipment">
        <Typography>{selectedEquipmentString}</Typography>
      </Box>
      <Divider />
      <Typography className="label center padding-y">
        {t("Select Date and Time")}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          format="DD-MM-YYYY"
          value={selectedDate}
          sx={{ borderRadius: "8px" }}
          label={t("Select Date")}
          onChange={(newDate) => setSelectedDate(newDate)}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default BookingComponent;
