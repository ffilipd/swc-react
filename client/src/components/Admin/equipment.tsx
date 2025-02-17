import {
  AppBar,
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  Grid,
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
import { FmButton2, FmButtonDanger } from "../../utils/buttons";
import { useEffect, useState } from "react";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import i18next from "i18next";
import { NewEquipment } from "../../interfaces";
import { addNewEquipment } from "../../service/equipment.service";
import { useEquipment } from "../../EquipmentContext";
import { useUser } from "../../UserContext";

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
  const { user } = useUser();
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
  const [availableEquipmentNames, setAvailableEquipmentNames] = useState<
    string[]
  >([""]);
  const [availableEquipmentNumbers, setAvailableEquipmentNumbers] = useState<
    string[]
  >([""]);

  const [newType, setNewType] = useState<string>("");
  const [newName, setNewName] = useState<string>("");

  const handleSetNewType = (newType: string) => {
    setNewType(newType);
  };
  const handleSetNewName = (newName: string) => {
    setNewName(newName);
  };
  const handleSetType = (typeName: string) => {
    if (typeName === "new-type") {
      setNewTypeInputVisible(true);
      setNewNameInputVisible(true);
    }
    setNewEquipment({ ...newEquipment, type: typeName });
  };

  const handleSetName = (newName: string) => {
    if (newName === "new-name") {
      setNewNameInputVisible(true);
    }
    setNewEquipment({ ...newEquipment, name: newName });
  };

  const handleSetNumber = (number: string) => {
    setNewEquipment({ ...newEquipment, number: number });
  };

  const { equipment, equipmentTypes, getEquipmentNames, getEquipmentNumbers } =
    useEquipment();
  const [newEquipment, setNewEquipment] = useState<NewEquipment>({
    type: "",
    name: "",
    number: "",
    userId: user?.id,
  });

  useEffect(() => {
    if (newEquipment.type)
      setAvailableEquipmentNames(getEquipmentNames(newEquipment.type));
    if (newEquipment.name)
      setAvailableEquipmentNumbers(getEquipmentNumbers(newEquipment.name));
    console.log(newEquipment);
  }, [newEquipment, getEquipmentNames, getEquipmentNumbers]);

  const handleAddEquipmentClick = async () => {
    let equipmentToSave = { ...newEquipment };
    if (newEquipment.type === "new-type") {
      equipmentToSave.type = newType;
    }
    if (newEquipment.name === "new-name") {
      equipmentToSave.name = newName;
    }
    try {
      const res = await addNewEquipment(equipmentToSave);
      alert(res);
      setNewEquipment({
        ...newEquipment,
        type: "",
        name: "",
        number: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

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

      {/*************************************************/}
      {/***************** ADD EQUIPMENT *****************/}
      {/*************************************************/}
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
                value={newEquipment.type}
                onChange={(e: SelectChangeEvent) => {
                  handleSetType(e.target.value);
                }}
              >
                <MenuItem key={"new-type"} value={"new-type"}>
                  {`–– ${t("New")} ––`}
                </MenuItem>
                {equipmentTypes.map((type: string, index: number) => (
                  <MenuItem key={`${type}-${index}`} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {newTypeInputVisible && (
              <FormControl className="admin-equipment-select-item">
                <TextField
                  id="new-type-input"
                  className="booking-select-button"
                  label={labels.equipment.newType}
                  autoFocus
                  onChange={(e) => handleSetNewType(e.target.value)}
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
                disabled={newEquipment.type === ""}
                id="equipment-name"
                label={labels.equipment.name}
                value={newEquipment.name}
                onChange={(e: SelectChangeEvent) => {
                  handleSetName(e.target.value);
                }}
              >
                <MenuItem key={"new-name"} value={"new-name"}>
                  {`–– ${t("New")} ––`}
                </MenuItem>
                {availableEquipmentNames.map((name: string, index: number) => (
                  <MenuItem key={`${name}-${index}`} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {newNameInputVisible && (
              <FormControl className="admin-equipment-select-item">
                <TextField
                  id="new-name-input"
                  className="booking-select-button"
                  label={labels.equipment.newName}
                  autoFocus
                  onChange={(e) => handleSetNewName(e.target.value)}
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
                disabled={newEquipment.name === ""}
                onChange={(e) => {
                  handleSetNumber(e.target.value);
                }}
              />
              <Divider sx={{ margin: "16px 0 0 0" }} />
            </FormControl>

            <FmButton2
              // id={!bookingFilledOut() ? "disabled-button" : "book-button"}
              disabled={newEquipment.number === ""}
              onClick={handleAddEquipmentClick}
            >
              {t("Add equipment")}
            </FmButton2>
          </Box>
        </Box>
      </Dialog>

      {/**************************************************/}
      {/***************** EDIT EQUIPMENT *****************/}
      {/**************************************************/}
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
                fullWidth
                className="booking-select-button"
                labelId="equipment-type-label"
                id="equipment-type"
                label={labels.equipment.type}
                // value={selectedEquipment.type}
                onChange={(e: SelectChangeEvent) => {
                  handleSetType(e.target.value);
                }}
              >
                {equipmentTypes.map((type: string, index: number) => (
                  <MenuItem key={`${type}-${index}`} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                {availableEquipmentNames.map((name: string, index: number) => (
                  <MenuItem key={`${name}-${index}`} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* NUMBER */}
            <FormControl fullWidth className="admin-equipment-select-item">
              <InputLabel id="equipment-number">
                {labels.equipment.number}
              </InputLabel>
              <Select
                className="booking-select-button"
                labelId="equipment-number-label"
                // disabled={selectedEquipment.type === ""}
                id="equipment-number"
                label={labels.equipment.number}
                // value={selectedEquipment.equipmentNameId}
                onChange={(e: SelectChangeEvent) => {
                  handleSetNumber(e.target.value);
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
              <Divider sx={{ margin: "16px 0 0 0" }} />
            </FormControl>
            <Grid container spacing={2}>
              <FmButton2
              // id={!bookingFilledOut() ? "disabled-button" : "book-button"}
              // disabled={!bookingFilledOut()}
              // onClick={handleBookEquipmentClick}
              >
                {t("Edit")}
              </FmButton2>

              <FmButtonDanger
              // id={!bookingFilledOut() ? "disabled-button" : "book-button"}
              // disabled={!bookingFilledOut()}
              // onClick={handleBookEquipmentClick}
              >
                {t("Remove Equipment")}
              </FmButtonDanger>
            </Grid>
          </Box>
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

export default AdminEquipmentComponent;
