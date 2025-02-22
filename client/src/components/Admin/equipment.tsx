import {
  AppBar,
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
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
import {
  addNewEquipment,
  getEquipment,
  removeEquipment,
} from "../../service/equipment.service";
import { useEquipment } from "../../EquipmentContext";
import { useUser } from "../../UserContext";
import EquipmentTable from "./equipmentTable";

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
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });
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
  const handleSetType = (event: SelectChangeEvent) => {
    const typeName = event.target.value;
    const eventName = event.target.name;
    if (typeName === "new-type" && eventName === "newType") {
      setNewTypeInputVisible(true);
      setNewNameInputVisible(true);
    }
    if (eventName === "newType")
      setNewEquipment({ ...newEquipment, type: typeName });
    if (eventName === "editType")
      setEquipmentToEdit({ ...equipmentToEdit, type: typeName });
  };

  const handleSetName = (event: SelectChangeEvent) => {
    const newName = event.target.value;
    const eventName = event.target.name;
    if (newName === "new-name" && eventName === "newName") {
      setNewNameInputVisible(true);
    }
    if (eventName === "newName")
      setNewEquipment({ ...newEquipment, name: newName });
    if (eventName === "editName")
      setEquipmentToEdit({ ...equipmentToEdit, name: newName });
  };

  const handleSetNumber = (
    event:
      | SelectChangeEvent
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const number = event.target.value;
    const eventName = event.target.name;
    if (eventName === "newNumber")
      setNewEquipment({ ...newEquipment, number: number });
    if (eventName === "editNumber")
      setEquipmentToEdit({ ...equipmentToEdit, number: number });
  };

  const {
    equipment,
    equipmentTypes,
    getEquipmentNames,
    getEquipmentNumbers,
    findEquipmentId,
  } = useEquipment();

  const [newEquipment, setNewEquipment] = useState<NewEquipment>({
    type: "",
    name: "",
    number: "",
    userId: user?.id,
  });

  const [equipmentToEdit, setEquipmentToEdit] = useState<NewEquipment>({
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
    if (equipmentToEdit.type)
      setAvailableEquipmentNames(getEquipmentNames(equipmentToEdit.type));
    if (equipmentToEdit.name)
      setAvailableEquipmentNumbers(getEquipmentNumbers(equipmentToEdit.name));
  }, [newEquipment, getEquipmentNames, getEquipmentNumbers, equipmentToEdit]);

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

  const handleRemoveEquipmentClick = async () => {
    // Get id for selected equipment
    const id = await findEquipmentId(equipmentToEdit);
    if (id) await removeEquipment(id);
    return;
  };

  return (
    <>
      <Box id="my-page-header">{t("Equipment Management")}</Box>
      {/* <Divider /> */}
      <Box id="my-page-wrapper">
        <EquipmentTable
          isMobile={isMobile}
          getEquipment={getEquipment}
          equipment={Array.isArray(equipment) ? equipment : []}
        />
      </Box>

      {/* <Box id="admin-equipment-header">{t("Add and edit equipment")}</Box> */}
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
                name="newType"
                onChange={(e: SelectChangeEvent) => {
                  handleSetType(e);
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
                name="newName"
                onChange={(e: SelectChangeEvent) => {
                  handleSetName(e);
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
                name="newNumber"
                value={newEquipment.number}
                onChange={(e) => {
                  handleSetNumber(e);
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
              {t("Edit & Remove Equipment")}
            </Typography>
            {/* <Button
              autoFocus
              color="inherit"
              onClick={handleAddEquipmentDialogClose}
            >
              {t("Save")}
            </Button> */}
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
                name="editType"
                // value={selectedEquipment.type}
                onChange={(e: SelectChangeEvent) => {
                  handleSetType(e);
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
                name="editName"
                // value={selectedEquipment.equipmentNameId}
                onChange={(e: SelectChangeEvent) => {
                  handleSetName(e);
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
                name="editNumber"
                onChange={(e: SelectChangeEvent) => {
                  handleSetNumber(e);
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
                onClick={handleRemoveEquipmentClick}
              >
                {t("Remove Equipment")}
              </FmButtonDanger>
            </Grid>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default AdminEquipmentComponent;
