import {
  Box,
  Button,
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

const Booking = () => {
  const { t } = useTranslation();
  const equipmentTypes = getEquipmentTypes();
  const equipmentTypeLabel: string = i18next.t("Equipment type");
  const equipmentNameLabel: string = i18next.t("Class / Name");
  const equipmentSwcNbrLabel: string = i18next.t("Number");

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

  return (
    <Box id="booking-container">
      <Box id="select-box">
        {/* TYPE */}
        <FormControl fullWidth className="booking-select-item">
          <InputLabel id="equipment-type">{equipmentTypeLabel}</InputLabel>
          <Select
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
            labelId="equipment-name-label"
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
          <InputLabel id="equipment-swc-nbr">{equipmentSwcNbrLabel}</InputLabel>
          <Select
            labelId="equipment-swc-nbr-label"
            id="equipment-swc-nbr"
            label={equipmentSwcNbrLabel}
            value={selectedEquipmentNumber}
            onChange={(e: SelectChangeEvent) => {
              setSelectedEquipmentNumber(e.target.value);
            }}
          >
            {availableEquipmentNumbers.map((name: string, index: number) => (
              <MenuItem key={`${name}-${index}`} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box id="calendar-box">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar />
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

export default Booking;
