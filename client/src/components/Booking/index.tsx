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
import { getEquipmentFilters } from "../../service/equipment.service";
import { addBooking, getBookings } from "../../service/booking.service";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs";
import {
  DatePicker,
  MobileTimePicker,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { SwcButton2 } from "../../utils/buttons";
import BookingTable from "./Table";
import { Booking, NewBooking } from "../../interfaces";
import { useUser } from "../../UserContext";

dayjs.extend(customParseFormat);
const roundedTime = (time: Dayjs): Dayjs => {
  return time.minute() > 30
    ? time.startOf("hour").add(30, "minutes")
    : time.startOf("hour").add(0, "minutes");
};

const BookingComponent = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  // const equipmentTypes = getEquipmentTypes();
  const labels = {
    equipment: {
      type: "*" + i18next.t("Equipment type"),
      name: "*" + i18next.t("Class / Name"),
      number: "*" + i18next.t("Number"),
    },
  };
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<{
    fromTime: Dayjs | null;
    toTime: Dayjs | null;
  }>({
    fromTime: null,
    toTime: null,
  });

  const [selectedEquipment, setSelectedEquipment] = useState<{
    type: string;
    equipmentNameId: string;
    number: string;
  }>({ type: "", equipmentNameId: "", number: "" });

  const [availableEquipment, setAvailableEquipment] = useState<{
    types: string[];
    names: { id: string; name: string }[];
    numbers: { id: string; number: string }[];
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
    equipmentNameId?: string;
  }) => {
    try {
      const response = await getEquipmentFilters({
        type: params?.type,
        equipmentNameId: params?.equipmentNameId,
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
    const types = (await getFilters()) as string[];
    setAvailableEquipment({ ...availableEquipment, types });
  };

  const handleSetType = async (type: string) => {
    setSelectedEquipment({
      ...selectedEquipment,
      type,
      equipmentNameId: "",
      number: "",
    });
    const names = (await getFilters({ type })) as {
      id: string;
      name: string;
    }[];
    setAvailableEquipment({ ...availableEquipment, names });
  };

  const handleSetName = async (equipmentNameId: string) => {
    setSelectedEquipment({ ...selectedEquipment, equipmentNameId, number: "" });
    const equipment = (await getFilters({
      type: selectedEquipment.type,
      equipmentNameId: equipmentNameId,
    })) as { id: string; number: string }[];
    setAvailableEquipment({ ...availableEquipment, numbers: equipment });
  };

  const fetchBookings = async () => {
    const bookingsData: Booking[] = await getBookings({
      equipmentNameId: selectedEquipment.equipmentNameId,
      equipment_type: selectedEquipment.type,
      equipmentId: selectedEquipment.number,
      date: selectedDate?.format("DD-MM-YYYY") || "",
      time_from: selectedTime.fromTime?.format("HH:mm") || "",
      time_to: selectedTime.toTime?.format("HH:mm") || "",
      usage: "booking",
    });
    setBookings(bookingsData);
  };

  const handleClearSelections = (): void => {
    setSelectedEquipment({ equipmentNameId: "", type: "", number: "" });
    setSelectedTime({ ...selectedTime, fromTime: null, toTime: null });
  };

  const handleSetTimeFrom = (newTime: any) => {
    setSelectedTime({ ...selectedTime, fromTime: newTime });
  };
  const handleSetTimeTo = (newTime: any) => {
    setSelectedTime({ ...selectedTime, toTime: newTime });
  };

  const handleBookEquipmentClick = async () => {
    const { type, equipmentNameId, number } = selectedEquipment;
    const date = selectedDate?.format("DD-MM-YYYY").toString();
    const { fromTime, toTime } = selectedTime;
    const newBooking: NewBooking = {
      date,
      time_from: fromTime?.format("HH:mm").toString(),
      time_to: toTime?.format("HH:mm").toString(),
      userId: user?.id,
      equipmentId: number,
    };
    try {
      const res = await addBooking(newBooking);
      alert(res);
      fetchBookings();
      setSelectedEquipment({ ...selectedEquipment, number: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const bookingFilledOut = (): boolean => {
    if (
      selectedDate &&
      selectedTime.fromTime &&
      selectedTime.toTime &&
      selectedEquipment.type &&
      selectedEquipment.equipmentNameId &&
      selectedEquipment.number
    )
      return true;
    return false;
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, selectedEquipment, selectedTime]);

  return (
    <>
      <Box id="booking-header">{t("Book equipment")}</Box>
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
          <Button
            variant="outlined"
            id="clear-selections-button"
            onClick={handleClearSelections}
          >
            {t("Clear Selections")}
          </Button>
          <Box id="time-picker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box>
                <MobileTimePicker
                  className="time"
                  value={selectedTime.fromTime}
                  ampm={false}
                  sx={{ paddingRight: "4px" }}
                  minutesStep={30}
                  label={"*" + t("From")}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                  }}
                  onChange={handleSetTimeFrom}
                />
              </Box>
              <Box>
                <MobileTimePicker
                  className="time"
                  value={selectedTime.toTime}
                  sx={{ paddingLeft: "4px" }}
                  ampm={false}
                  minutesStep={30}
                  label={"*" + t("To")}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                  }}
                  onChange={handleSetTimeTo}
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
                value={selectedEquipment.equipmentNameId}
                onChange={(e: SelectChangeEvent) => {
                  handleSetName(e.target.value);
                }}
              >
                {availableEquipment.names.map((name) => (
                  <MenuItem key={name.id} value={name.id}>
                    {name.name}
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
                disabled={selectedEquipment.equipmentNameId === ""}
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
                {availableEquipment.numbers.map((number) => (
                  <MenuItem
                    key={number.id}
                    value={number.id}
                    disabled={bookings?.some(
                      (booking) => booking.equipmentId === number.id
                    )}
                  >
                    {number.number}
                    {bookings?.some(
                      (booking) => booking.equipmentId === number.id
                    ) && <i> - {t("booked")}</i>}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <SwcButton2
              id={!bookingFilledOut() ? "disabled-button" : "book-button"}
              disabled={!bookingFilledOut()}
              onClick={handleBookEquipmentClick}
            >
              {t("Book")}
            </SwcButton2>
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
    </>
  );
};

export default BookingComponent;
