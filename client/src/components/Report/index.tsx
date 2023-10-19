import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import "./report.css";
import { useEffect, useState } from "react";
import { Booking } from "../../interfaces";
import { getBookings } from "../../service/booking.service";
import { useTranslation } from "react-i18next";
import {
  LocalizationProvider,
  DatePicker,
  DateCalendar,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import i18next from "i18next";

const ReportComponent = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [selectedDamageType, setSelectedDamageType] = useState<string>("");

  const damageTypes = ["Major", "Minor", "No"];
  const labels = {
    booking: i18next.t("Select the corresponding booking"),
    damageType: i18next.t("Any damages?"),
    type: "*" + i18next.t("Equipment type"),
    name: "*" + i18next.t("Class / Name"),
    number: "*" + i18next.t("Number"),
  };

  const fetchBookings = async () => {
    const bookingsData: Booking[] = await getBookings({
      date: selectedDate?.format("DD-MM-YYYY"),
    });
    setBookings(bookingsData);
  };

  const handleSelectDate = (newDate: Dayjs | null) => {
    setSelectedBookingId("");
    setSelectedDate(newDate);
  };

  const handleSelectBooking = (bookingId: string): void => {
    console.log("booking id: " + bookingId);
    setSelectedBookingId(bookingId);
  };

  const handleSelectDamageType = (type: string): void => {
    setSelectedDamageType(type);
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedDate]);
  return (
    <Box id="report-root">
      <Box id="report-header">{t("Report Equipment Usage")}</Box>
      <Divider />
      <Box id="report-wrapper">
        <Box id="report-container">
          <FormControl id="your-booking-select">
            <FormLabel id="demo-radio-buttons-group-label">
              {t("Did you book the equipment yourself?")}
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="yes"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label={t("Yes")}
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label={t("No, someone else booked")}
              />
            </RadioGroup>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="DD-MM-YYYY"
              value={selectedDate}
              sx={{ borderRadius: "8px" }}
              label={t("Select date of booking")}
              onChange={(newDate) => handleSelectDate(newDate)}
            />
          </LocalizationProvider>

          <FormControl fullWidth className="report-select-item">
            <InputLabel id="equipment-type">{labels.booking}</InputLabel>
            <Select
              className="report-select-button"
              labelId="equipment-type-label"
              id="report-booking-input"
              label={labels.booking}
              value={selectedBookingId}
              onChange={(e: SelectChangeEvent) => {
                handleSelectBooking(e.target.value);
              }}
            >
              {bookings.map((booking: Booking, index: number) => (
                <MenuItem
                  id="report-booking-item"
                  key={booking.id}
                  value={booking.id}
                >
                  <Box>
                    {`${booking.equipment_name} #${booking.swc_number}`}
                  </Box>
                  <Box>{`${booking.time_from}—${booking.time_to}`}</Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className="report-select-item">
            <InputLabel>{labels.damageType}</InputLabel>
            <Select
              className="report-select-button"
              labelId="equipment-type-label"
              id="report-booking-input"
              label={labels.damageType}
              value={selectedDamageType}
              onChange={(e: SelectChangeEvent) => {
                handleSelectDamageType(e.target.value);
              }}
            >
              {damageTypes.map((type: string, index: number) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportComponent;
