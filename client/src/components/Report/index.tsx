import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  TextField,
  Typography,
} from "@mui/material";
import "./report.css";
import { useEffect, useState } from "react";
import { Booking, Report } from "../../interfaces";
import { getBookings } from "../../service/booking.service";
import { getEquipmentFilters } from "../../service/equipment.service";
import { useTranslation } from "react-i18next";
import {
  LocalizationProvider,
  DatePicker,
  DateCalendar,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import i18next from "i18next";
import React from "react";
import { SwcButton2 } from "../../utils/buttons";
import { addReport, getReports } from "../../service/report.service";
import { useUser } from "../../UserContext";

const ReportComponent = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [availableEquipment, setAvailableEquipment] = useState<{
    types: string[];
    names: string[];
    numbers: { id: string; number: string }[];
  }>({
    types: [],
    names: [],
    numbers: [],
  });

  const initialReportValues: Report = {
    user_id: user?.id || "",
    damage_type: "",
    booking_id: undefined,
    type: undefined,
    equipment_name: undefined,
    swc_number: undefined,
    date: selectedDate?.format("DD-MM-YYYY"),
    notes: "",
  };
  const [newReport, setNewReport] = useState<Report>(initialReportValues);
  const [reportExistsNote, setReportExistsNote] = useState<boolean>(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState<boolean>(false);
  const [yourBooking, setYourBooking] = useState<"yes" | "no">("yes");
  const damageTypes = [t("No"), t("Minor"), t("Major"), t("Other")];
  const labels = {
    booking: i18next.t("Select the corresponding booking"),
    damageType: i18next.t("Any damages?"),
    type: "*" + i18next.t("Equipment type"),
    name: "*" + i18next.t("Class / Name"),
    number: "*" + i18next.t("Number"),
  };

  const handleSubmitDialogClose = () => {
    setSubmitDialogOpen(false);
  };
  const handleSubmitDialogOpen = () => {
    setSubmitDialogOpen(true);
  };
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

  const fetchBookings = async () => {
    const bookingsData: Booking[] = await getBookings({
      // user_id: yourBooking === "yes" ? user?.id : undefined,
      date: selectedDate?.format("DD-MM-YYYY"),
    });
    setBookings(bookingsData);
  };

  const handleSelectDate = (newDate: Dayjs | null) => {
    setSelectedBookingId("");
    setSelectedDate(newDate);
  };

  const handleSetYourBooking = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYourBooking((event.target as HTMLInputElement).value as "yes" | "no");
  };
  const handleSelectBooking = async (bookingId: string) => {
    const reportExists = await getReports({ booking_id: bookingId });
    console.log(reportExists);
    if (reportExists.length > 0 && bookingId !== "no-booking")
      setReportExistsNote(true);
    else setReportExistsNote(false);
    setNewReport({ ...newReport, booking_id: bookingId });
    setSelectedBookingId(bookingId);
  };

  const handleSelectDamageType = (type: string): void => {
    setNewReport({ ...newReport, damage_type: type });
  };

  const setFilterTypes = async () => {
    const types = (await getFilters()) as string[];
    setAvailableEquipment({ ...availableEquipment, types });
  };

  const handleSetType = async (type: string) => {
    setNewReport({
      ...newReport,
      type,
      equipment_name: "",
      swc_number: "",
    });
    const names = (await getFilters({ type })) as string[];
    setAvailableEquipment({ ...availableEquipment, names });
  };

  const handleSetName = async (equipment_name: string) => {
    setNewReport({
      ...newReport,
      equipment_name,
      swc_number: "",
    });
    const numbers = (await getFilters({
      type: newReport.type,
      equipment_name: equipment_name,
    })) as {
      id: string;
      number: string;
    }[];
    setAvailableEquipment({ ...availableEquipment, numbers });
  };

  const reportFilledOut = (): boolean => {
    const { damage_type, booking_id, type, equipment_name, swc_number } =
      newReport;
    if (booking_id !== "no-booking") {
      if (damage_type === "No") return true;
      if (damage_type !== "No" && newReport.notes) return true;
    }
    if (booking_id === "no-booking") {
      if (type && equipment_name && swc_number) {
        if (damage_type === "No") return true;
        if (damage_type !== "No" && newReport.notes) return true;
      }
    }
    return false;
  };

  const handleSubmitReportClick = async () => {
    try {
      await addReport(newReport);
      setNewReport(initialReportValues);
      setSelectedBookingId("");
      handleSubmitDialogOpen();
    } catch (error) {
      console.log(error);
    }
  };

  const addNotes = (event: any) => {
    setNewReport({ ...newReport, notes: event.target.value });
    console.log(event.target.value);
  };

  useEffect(() => {
    setFilterTypes();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, yourBooking]);
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
              name="radio-buttons-group"
              value={yourBooking}
              onChange={handleSetYourBooking}
            >
              <FormControlLabel
                value={"yes"}
                control={<Radio />}
                label={t("Yes")}
              />
              <FormControlLabel
                value={"no"}
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
              label={t("Select date of booking / usage")}
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
                    {/* {`${booking.equipment_name} #${booking.swc_number}`} */}
                  </Box>
                  <Box>{`${booking.time_from}—${booking.time_to}`}</Box>
                </MenuItem>
              ))}
              <MenuItem
                id="report-booking-item"
                key={"no-booking"}
                value={"no-booking"}
              >
                {t("I cannot find the booking")}
              </MenuItem>
            </Select>
          </FormControl>
          {reportExistsNote && (
            <Alert severity="warning" className="report-select-item">
              {t("A report for this booking already exists!")}
            </Alert>
          )}
          {selectedBookingId === "no-booking" && (
            <React.Fragment>
              {/* TYPE */}
              <FormControl fullWidth className="report-select-item">
                <InputLabel id="equipment-type">{labels.type}</InputLabel>
                <Select
                  className="booking-select-button"
                  labelId="equipment-type-label"
                  id="equipment-type"
                  label={labels.type}
                  value={newReport.type}
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
              <FormControl fullWidth className="report-select-item">
                <InputLabel id="equipment-name">{labels.name}</InputLabel>
                <Select
                  className="booking-select-button"
                  labelId="equipment-name-label"
                  disabled={newReport.type === ""}
                  id="equipment-name"
                  label={labels.name}
                  value={newReport.equipment_name}
                  onChange={(e: SelectChangeEvent) => {
                    handleSetName(e.target.value);
                  }}
                >
                  {availableEquipment.names.map(
                    (name: string, index: number) => (
                      <MenuItem key={`${name}-${index}`} value={name}>
                        {name}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {/* SWC NUMBER */}
              <FormControl fullWidth className="report-select-item">
                <InputLabel id="equipment-swc-nbr">{labels.number}</InputLabel>
                <Select
                  className="booking-select-button"
                  labelId="equipment-swc-nbr-label"
                  disabled={newReport.equipment_name === ""}
                  id="equipment-swc-nbr"
                  label={labels.number}
                  value={newReport.swc_number}
                  onChange={(e: SelectChangeEvent) => {
                    setNewReport({
                      ...newReport,
                      swc_number: e.target.value,
                    });
                  }}
                >
                  {availableEquipment.numbers.map((number) => (
                    <MenuItem key={number.id} value={number.id}>
                      {number.number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </React.Fragment>
          )}
          <FormControl fullWidth className="report-select-item">
            <InputLabel>{labels.damageType}</InputLabel>
            <Select
              className="report-select-button"
              labelId="equipment-type-label"
              id="report-booking-input"
              label={labels.damageType}
              value={newReport.damage_type}
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
          {newReport.damage_type === "Other" ? (
            <Alert severity="info" className="report-select-item">
              {t("Please provide description!")}
            </Alert>
          ) : (
            (newReport.damage_type === "Major" ||
              newReport.damage_type === "Minor") && (
              <Alert severity="warning" className="report-select-item">
                {t("Description of the damage is mandatory!")}
              </Alert>
            )
          )}
          <TextField
            className="report-select-item"
            id="report-notes-textfield"
            label="Notes / Description"
            multiline
            rows={4}
            variant="outlined"
            value={newReport.notes}
            onChange={addNotes}
          />
          <SwcButton2
            id={
              !reportFilledOut()
                ? "submit-disabled-button"
                : "submit-report-button"
            }
            disabled={!reportFilledOut()}
            onClick={handleSubmitReportClick}
          >
            {t("Submit Report")}
          </SwcButton2>
        </Box>
      </Box>
      <Dialog
        fullWidth
        open={submitDialogOpen}
        onClose={handleSubmitDialogClose}
      >
        <DialogTitle id="submit-dialog-title">
          {t("Report submited")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="submit-dialog-description">
            {t("Thank you for the report!")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitDialogClose}>{t("Close")}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportComponent;
