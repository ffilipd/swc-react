import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import i18next from "i18next";
import "./booking.css";
import { equipment as equipmentJson } from "../../equipment";
import { useEffect, useState } from "react";
import {
  getEquipmentNamesByType,
  getEquipmentTypes,
  getNumbersByTypeAndName,
} from "../../service/equipment.service";
import { SettingsInputComponent } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { SwcButton2 } from "../../utils/buttons";
import BookingTable from "./Table";
import { Booking } from "../../interfaces";
import { getBookingsByDate } from "../../service/booking.service";

const BookingComponent = () => {
  const { t } = useTranslation();
  const equipmentTypes = getEquipmentTypes();
  const equipmentTypeLabel: string = i18next.t("Equipment type");
  const equipmentNameLabel: string = i18next.t("Class / Name");
  const equipmentSwcNbrLabel: string = i18next.t("Number");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const [selectedEquipmentType, setSelectedEquipmentType] =
    useState<string>("");
  const [selectedEquipmentName, setSelectedEquipmentName] =
    useState<string>("");
  const [selectedEquipmentNumber, setSelectedEquipmentNumber] =
    useState<string>("");
  const [availableEquipmentNames, setAvailableEquipmentNames] = useState<
    string[]
  >([]);
  const [availableEquipmentNumbers, setAvailableEquipmentNumbers] = useState<
    string[]
  >([]);

  const [bookings, setBookings] = useState<Booking[] | null>([]);

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });

  useEffect(() => {
    const names: string[] =
      getEquipmentNamesByType(selectedEquipmentType) || [];
    setAvailableEquipmentNames(names);
  }, [selectedEquipmentType]);

  useEffect(() => {
    const numbers: string[] = getNumbersByTypeAndName(
      selectedEquipmentType,
      selectedEquipmentName
    );
    setAvailableEquipmentNumbers(numbers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEquipmentName]);

  useEffect(() => {
    const bookingsData = getBookingsByDate(selectedDate?.format("DD-MM-YYYY"));
    setBookings(bookingsData);
  }, [selectedDate]);

  return (
    <Box id="booking-root">
      <Box id="booking-header">{t("Book Equipment")}</Box>
      <Divider />
      <Box id="booking-wrapper">
        <Box id="booking-container">
          {/* Calendar */}
          <Box id="calendar-box">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {isMobile ? (
                <DatePicker
                  format="DD-MM-YYYY"
                  value={selectedDate}
                  sx={{ borderRadius: "8px" }}
                  onChange={(newDate) => setSelectedDate(newDate)}
                />
              ) : (
                <DateCalendar
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                />
              )}
            </LocalizationProvider>
          </Box>

          {/* Select */}
          <Box id="select-box">
            {/* TYPE */}
            <FormControl fullWidth className="booking-select-item">
              <InputLabel id="equipment-type">{equipmentTypeLabel}</InputLabel>
              <Select
                className="booking-select-button"
                labelId="equipment-type-label"
                id="equipment-type"
                label={equipmentTypeLabel}
                value={selectedEquipmentType}
                onChange={(e: SelectChangeEvent) =>
                  setSelectedEquipmentType(e.target.value)
                }
              >
                {equipmentTypes.map((type: string, index: number) => (
                  <MenuItem key={`${type}-${index}`} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* CLASS/NAME */}
            <FormControl fullWidth className="booking-select-item">
              <InputLabel id="equipment-name">{equipmentNameLabel}</InputLabel>
              <Select
                className="booking-select-button"
                labelId="equipment-name-label"
                disabled={selectedEquipmentType === ""}
                id="equipment-name"
                label={equipmentNameLabel}
                value={selectedEquipmentName}
                onChange={(e: SelectChangeEvent) => {
                  setSelectedEquipmentName(e.target.value);
                }}
              >
                {availableEquipmentNames.map((name: string, index: number) => (
                  <MenuItem key={`${name}-${index}`} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* SWC NUMBER */}
            <FormControl fullWidth className="booking-select-item">
              <InputLabel id="equipment-swc-nbr">
                {equipmentSwcNbrLabel}
              </InputLabel>
              <Select
                className="booking-select-button"
                labelId="equipment-swc-nbr-label"
                disabled={selectedEquipmentName === ""}
                id="equipment-swc-nbr"
                label={equipmentSwcNbrLabel}
                value={selectedEquipmentNumber}
                onChange={(e: SelectChangeEvent) => {
                  setSelectedEquipmentNumber(e.target.value);
                }}
              >
                {availableEquipmentNumbers.map(
                  (name: string, index: number) => (
                    <MenuItem key={`${name}-${index}`} value={name}>
                      {name}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <SwcButton2 id="book-button">Book</SwcButton2>
          </Box>
        </Box>
        <BookingTable bookings={bookings} />
      </Box>
    </Box>
  );
};

export default BookingComponent;
