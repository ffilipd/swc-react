import {
  AppBar,
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import "./equipment.css";
import { FmButton2 } from "../../utils/buttons";
import { useState } from "react";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import i18next from "i18next";
import { NewEquipment } from "../../interfaces";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminEquipmentComponent = () => {
  const { t } = useTranslation();
  const labels = {
    equipment: {
      type: "*" + i18next.t("Equipment type"),
      name: "*" + i18next.t("Class / Name"),
      number: "*" + i18next.t("Number"),
      newType: "*" + i18next.t("Enter new type"),
      newName: "*" + i18next.t("Enter new class / name"),
    },
  };
  const [addEquipmentDialogOpen, setAddEquipmentDialogOpen] =
    useState<boolean>(false);
  const [editEquipmentDialogOpen, setEditEquipmentDialogOpen] =
    useState<boolean>(false);

  const handleAddEquipmentDialogOpen = () => setAddEquipmentDialogOpen(true);
  const handleAddEquipmentDialogClose = () => setAddEquipmentDialogOpen(false);
  const handleEditEquipmentDialogOpen = () => setEditEquipmentDialogOpen(true);
  const handleEditEquipmentDialogClose = () =>
    setEditEquipmentDialogOpen(false);
  const handleAddClick = () => handleAddEquipmentDialogOpen();
  const handleEditClick = () => handleEditEquipmentDialogOpen();

  const [newTypeInputVisible, setNewTypeInputVisible] =
    useState<boolean>(false);
  const [newNameInputVisible, setNewNameInputVisible] =
    useState<boolean>(false);
  const handleSetType = (typeName: string) => {
    if (typeName === "new-type") {
      setNewTypeInputVisible(true);
      setNewNameInputVisible(true);
    }
  };

  const handleSetName = (typeName: string) => {
    if (typeName === "new-name") {
      setNewNameInputVisible(true);
    }
  };

  const [newEquipment, setNewEquipment] = useState<NewEquipment>({
    type: "",
    name: "",
    number: "",
  });

  const handleAddEquipmentClick = async () => {};

  return (
    <React.Fragment>
      <Box id="admin-equipment-header">{t("Add and edit equipment")}</Box>
      <Divider />
      <Box id="admin-equipment-wrapper">
        <FmButton2 className="admin-equipment-button" onClick={handleEditClick}>
          {t("Edit")}
        </FmButton2>
        <FmButton2 className="admin-equipment-button" onClick={handleAddClick}>
          {t("Add new")}
        </FmButton2>
      </Box>
      <Dialog
        fullScreen
        open={addEquipmentDialogOpen}
        onClose={handleAddEquipmentDialogClose}
        TransitionComponent={Transition}
      >
        <AppBar
          sx={{
            position: "relative",
            backgroundColor: "var(--color-theme-dark)",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleAddEquipmentDialogClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {t("Add new")}
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleAddEquipmentDialogClose}
            >
              {/* save */}
            </Button>
          </Toolbar>
        </AppBar>
        <Box id="admin-equipment-select-wrapper">
          <Box id="admin-equipment-select-box">
            {/* TYPE */}
            <FormControl fullWidth className="admin-equipment-select-item">
              <InputLabel id="equipment-type">
                {labels.equipment.type}
              </InputLabel>
              <Select
                className="booking-select-button"
                labelId="equipment-type-label"
                id="equipment-type"
                label={labels.equipment.type}
                // value={selectedEquipment.type}
                onChange={(e: SelectChangeEvent) => {
                  handleSetType(e.target.value);
                }}
              >
                {/* {availableEquipment.types?.map((type: string, index: number) => (
                <MenuItem key={`${type}-${index}`} value={type}>
                  {type}
                </MenuItem>
              ))} */}
                <MenuItem key={"new-type"} value={"new-type"}>
                  {t("–– New ––")}
                </MenuItem>
              </Select>
            </FormControl>
            {newTypeInputVisible && (
              <FormControl className="admin-equipment-select-item">
                <TextField
                  id="new-type-input"
                  className="booking-select-button"
                  label={labels.equipment.newType}
                  autoFocus
                />
                <Divider sx={{ margin: "16px 0 0 0" }} />
              </FormControl>
            )}

            {/* CLASS/NAME */}
            <FormControl fullWidth className="admin-equipment-select-item">
              <InputLabel id="equipment-name">
                {labels.equipment.name}
              </InputLabel>
              <Select
                className="booking-select-button"
                labelId="equipment-name-label"
                // disabled={selectedEquipment.type === ""}
                id="equipment-name"
                label={labels.equipment.name}
                // value={selectedEquipment.equipmentNameId}
                onChange={(e: SelectChangeEvent) => {
                  handleSetName(e.target.value);
                }}
              >
                {/* {availableEquipment.names.map((name) => (
                <MenuItem key={name.id} value={name.id}>
                  {name.name}
                </MenuItem>
              ))} */}
                <MenuItem key={"new-name"} value={"new-name"}>
                  {t("–– New ––")}
                </MenuItem>
              </Select>
            </FormControl>
            {newNameInputVisible && (
              <FormControl className="admin-equipment-select-item">
                <TextField
                  id="new-name-input"
                  className="booking-select-button"
                  label={labels.equipment.newName}
                  autoFocus
                />
                <Divider sx={{ margin: "16px 0 0 0" }} />
              </FormControl>
            )}

            {/* NUMBER */}
            <FormControl fullWidth className="admin-equipment-select-item">
              <TextField
                id="number-input"
                className="booking-select-button"
                label={labels.equipment.number}
                autoFocus
              />
              <Divider sx={{ margin: "16px 0 0 0" }} />
            </FormControl>

            <FmButton2
              // id={!bookingFilledOut() ? "disabled-button" : "book-button"}
              // disabled={!bookingFilledOut()}
              onClick={handleAddEquipmentClick}
            >
              {t("Add equipment")}
            </FmButton2>
          </Box>
        </Box>
      </Dialog>

      <Dialog
        fullScreen
        open={editEquipmentDialogOpen}
        onClose={handleEditEquipmentDialogClose}
        TransitionComponent={Transition}
      >
        <AppBar
          sx={{
            position: "relative",
            backgroundColor: "var(--color-theme-dark)",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleEditEquipmentDialogClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {t("Edit")}
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleAddEquipmentDialogClose}
            >
              {t("Save")}
            </Button>
          </Toolbar>
        </AppBar>
        <Box id="admin-equipment-select-wrapper">
          <Box id="admin-equipment-select-box">
            {/* TYPE */}
            <FormControl fullWidth className="admin-equipment-select-item">
              <InputLabel id="equipment-type">
                {labels.equipment.type}
              </InputLabel>
              <Select
                className="booking-select-button"
                labelId="equipment-type-label"
                id="equipment-type"
                label={labels.equipment.type}
                // value={selectedEquipment.type}
                onChange={(e: SelectChangeEvent) => {
                  handleSetType(e.target.value);
                }}
              >
                {/* {availableEquipment.types?.map((type: string, index: number) => (
                <MenuItem key={`${type}-${index}`} value={type}>
                  {type}
                </MenuItem>
              ))} */}
                <MenuItem key={"new-type"} value={"new-type"}>
                  {t("–– New ––")}
                </MenuItem>
              </Select>
            </FormControl>
            {newTypeInputVisible && (
              <FormControl className="admin-equipment-select-item">
                <TextField
                  id="new-type-input"
                  className="booking-select-button"
                  label={labels.equipment.newType}
                  autoFocus
                />
                <Divider sx={{ margin: "16px 0 0 0" }} />
              </FormControl>
            )}

            {/* CLASS/NAME */}
            <FormControl fullWidth className="admin-equipment-select-item">
              <InputLabel id="equipment-name">
                {labels.equipment.name}
              </InputLabel>
              <Select
                className="booking-select-button"
                labelId="equipment-name-label"
                // disabled={selectedEquipment.type === ""}
                id="equipment-name"
                label={labels.equipment.name}
                // value={selectedEquipment.equipmentNameId}
                onChange={(e: SelectChangeEvent) => {
                  handleSetName(e.target.value);
                }}
              >
                {/* {availableEquipment.names.map((name) => (
                <MenuItem key={name.id} value={name.id}>
                  {name.name}
                </MenuItem>
              ))} */}
                <MenuItem key={"new-name"} value={"new-name"}>
                  {t("–– New ––")}
                </MenuItem>
              </Select>
            </FormControl>
            {newNameInputVisible && (
              <FormControl className="admin-equipment-select-item">
                <TextField
                  id="new-name-input"
                  className="booking-select-button"
                  label={labels.equipment.newName}
                  autoFocus
                />
                <Divider sx={{ margin: "16px 0 0 0" }} />
              </FormControl>
            )}

            {/* NUMBER */}
            <FormControl fullWidth className="admin-equipment-select-item">
              <TextField
                id="number-input"
                className="booking-select-button"
                label={labels.equipment.number}
                autoFocus
              />
              <Divider sx={{ margin: "16px 0 0 0" }} />
            </FormControl>

            <FmButton2
            // id={!bookingFilledOut() ? "disabled-button" : "book-button"}
            // disabled={!bookingFilledOut()}
            // onClick={handleBookEquipmentClick}
            >
              {t("Edit")}
            </FmButton2>
          </Box>
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

export default AdminEquipmentComponent;
