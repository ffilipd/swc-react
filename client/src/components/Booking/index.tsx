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
import { Label, SettingsInputComponent } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  TimePicker,
  renderDigitalClockTimeView,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { SwcButton2 } from "../../utils/buttons";
import BookingTable from "./Table";
import { Booking } from "../../interfaces";
import { getBookingsByDate } from "../../service/booking.service";

const BookingComponent = () => {
  const { t } = useTranslation();
  // const equipmentTypes = getEquipmentTypes();
  const labels = {
    equipment: {
      type: i18next.t("Equipment type"),
      name: i18next.t("Class / Name"),
      number: i18next.t("Number"),
    },
  };
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const [selectedEquipment, setSelectedEquipment] = useState<{
    type: string;
    name: string;
    number: string;
  }>({ type: "", name: "", number: "" });

  const [availableEquipment, setAvailableEquipment] = useState<{
    types: string[];
    names: string[];
    numbers: string[];
  }>({
    types: getEquipmentTypes(),
    names: [],
    numbers: [],
  });

  const [bookings, setBookings] = useState<Booking[] | null>([]);

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });

  useEffect(() => {}, []);

  useEffect(() => {
    const names: string[] =
      getEquipmentNamesByType(selectedEquipment.type) || [];
    setAvailableEquipment({ ...availableEquipment, names: names });
  }, [selectedEquipment.type]);

  useEffect(() => {
    const numbers: string[] = getNumbersByTypeAndName(
      selectedEquipment.type,
      selectedEquipment.name
    );
    setAvailableEquipment({ ...availableEquipment, numbers: numbers });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEquipment.name]);

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
                  label={t("Select Date")}
                  onChange={(newDate) => setSelectedDate(newDate)}
                />
              ) : (
                <>
                  <Typography className="label">{t("Select Date")}</Typography>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                  />
                </>
              )}
            </LocalizationProvider>
          </Box>
          <Box id="time-picker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box>
                <TimePicker
                  className="time"
                  ampm={false}
                  sx={{ paddingRight: "4px" }}
                  minutesStep={30}
                  label={t("From")}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                  }}
                />
              </Box>
              <Box>
                <TimePicker
                  className="time"
                  sx={{ paddingLeft: "4px" }}
                  ampm={false}
                  minutesStep={30}
                  label={t("To")}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>

          {/* Select */}
          <Box id="select-box">
            {/* TYPE */}
            <FormControl fullWidth className="booking-select-item">
              <InputLabel id="equipment-type">
                {labels.equipment.type}
              </InputLabel>
              <Select
                className="booking-select-button"
                labelId="equipment-type-label"
                id="equipment-type"
                label={labels.equipment.type}
                value={selectedEquipment.type}
                onChange={(e: SelectChangeEvent) =>
                  setSelectedEquipment({
                    ...selectedEquipment,
                    type: e.target.value,
                  })
                }
              >
                {availableEquipment.types?.map(
                  (type: string, index: number) => (
                    <MenuItem key={`${type}-${index}`} value={type}>
                      {type}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            {/* CLASS/NAME */}
            <FormControl fullWidth className="booking-select-item">
              <InputLabel id="equipment-name">
                {labels.equipment.name}
              </InputLabel>
              <Select
                className="booking-select-button"
                labelId="equipment-name-label"
                disabled={selectedEquipment.type === ""}
                id="equipment-name"
                label={labels.equipment.name}
                value={selectedEquipment.name}
                onChange={(e: SelectChangeEvent) => {
                  setSelectedEquipment({
                    ...selectedEquipment,
                    name: e.target.value,
                  });
                }}
              >
                {availableEquipment.names.map((name: string, index: number) => (
                  <MenuItem key={`${name}-${index}`} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* SWC NUMBER */}
            <FormControl fullWidth className="booking-select-item">
              <InputLabel id="equipment-swc-nbr">
                {labels.equipment.number}
              </InputLabel>
              <Select
                className="booking-select-button"
                labelId="equipment-swc-nbr-label"
                disabled={selectedEquipment.name === ""}
                id="equipment-swc-nbr"
                label={labels.equipment.number}
                value={selectedEquipment.number}
                onChange={(e: SelectChangeEvent) => {
                  setSelectedEquipment({
                    ...selectedEquipment,
                    number: e.target.value,
                  });
                }}
              >
                {availableEquipment.numbers.map(
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
        <BookingTable
          bookings={bookings}
          setBookings={setBookings}
          isMobile={isMobile}
          labels={labels}
          availableTypes={availableEquipment.types}
        />
      </Box>
    </Box>
  );
};

export default BookingComponent;
