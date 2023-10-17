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
import { useEffect, useState } from "react";
import {
  getEquipment,
  getEquipmentFilters,
} from "../../service/equipment.service";
import { getBookings } from "../../service/booking.service";
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
    equipment_name: string;
    number: string;
  }>({ type: "", equipment_name: "", number: "" });

  const [availableEquipment, setAvailableEquipment] = useState<{
    types: string[];
    names: string[];
    numbers: string[];
  }>({
    types: [],
    names: [],
    numbers: [],
  });

  const [bookings, setBookings] = useState<Booking[] | null>([]);

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });

  const getFilters = async (params?: {
    type?: string;
    equipment_name?: string;
  }) => {
    try {
      const response = await getEquipmentFilters({
        type: params?.type,
        equipment_name: params?.equipment_name,
      });
      return response;
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    setFilterTypes();
  }, []);

  const setFilterTypes = async () => {
    const types = await getFilters();
    setAvailableEquipment({ ...availableEquipment, types });
  };

  const handleSetType = async (type: string) => {
    setSelectedEquipment({
      ...selectedEquipment,
      type,
      equipment_name: "",
      number: "",
    });
    const names = await getFilters({ type });
    setAvailableEquipment({ ...availableEquipment, names });
  };

  const handleSetName = async (equipment_name: string) => {
    setSelectedEquipment({ ...selectedEquipment, equipment_name, number: "" });
    const numbers = await getFilters({
      type: selectedEquipment.type,
      equipment_name: equipment_name,
    });
    setAvailableEquipment({ ...availableEquipment, numbers });
  };

  const fetchBookings = async () => {
    // const bookingsData = getBookingsByDate(selectedDate?.format("DD-MM-YYYY"));
    const bookingsData: Booking[] = await getBookings({
      type: selectedEquipment.type,
      equipment_name: selectedEquipment.equipment_name,
      swc_number: selectedEquipment.number,
      date: selectedDate?.format("DD-MM-YYYY"),
    });
    setBookings(bookingsData);
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, selectedEquipment]);

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
                onChange={(e: SelectChangeEvent) => {
                  handleSetType(e.target.value);
                }}
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
                value={selectedEquipment.equipment_name}
                onChange={(e: SelectChangeEvent) => {
                  handleSetName(e.target.value);
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
                disabled={selectedEquipment.equipment_name === ""}
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
