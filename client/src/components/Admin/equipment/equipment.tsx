import {
  Box,
  SelectChangeEvent,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import "./equipment.css";
import { FmButton2 } from "../../../utils/buttons";
import { useEffect, useState } from "react";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import i18next from "i18next";
import { NewEquipment } from "../../../interfaces";
import {
  addNewEquipment,
  getEquipment,
  removeEquipment,
} from "../../../service/equipment.service";
import { useEquipment } from "../../../EquipmentContext";
import { useUser } from "../../../UserContext";
import EquipmentTable from "./equipmentTable";
import { useAlert } from "../../../AlertContext";
import AddEquipmentDialog from "./equipmentDialogs";

const AdminEquipmentComponent = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { showAlert, alertProps, alertVisible } = useAlert();
  const {
    equipment,
    findEquipmentId,
    equipmentTypes,
    getEquipmentNames,
    getEquipmentNumbers,
  } = useEquipment();

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });

  const [addEquipmentDialogOpen, setAddEquipmentDialogOpen] =
    useState<boolean>(false);
  const [editEquipmentDialogOpen, setEditEquipmentDialogOpen] =
    useState<boolean>(false);
  const [equipmentToEdit, setEquipmentToEdit] = useState<NewEquipment>({
    type: "",
    name: "",
    number: "",
    userId: user?.id,
  });

  const handleEditEquipmentDialogOpen = () => setEditEquipmentDialogOpen(true);
  const handleEditEquipmentDialogClose = () =>
    setEditEquipmentDialogOpen(false);
  const handleAddEquipmentDialogOpen = () => setAddEquipmentDialogOpen(true);
  const handleAddEquipmentDialogClose = () => setAddEquipmentDialogOpen(false);
  const handleAddClick = () => handleAddEquipmentDialogOpen();
  const handleEditClick = () => handleEditEquipmentDialogOpen();

  const handleRemoveEquipmentClick = async (id?: string) => {
    // Get id for selected equipment
    let equipmentIdToDelete = id || (await findEquipmentId(equipmentToEdit));
    if (!equipmentIdToDelete) {
      showAlert({ severity: "error", message: t("Equipment ID not found") });
      return;
    }
    if (equipmentIdToDelete) {
      const res = await removeEquipment(equipmentIdToDelete);
      alert(res);
      handleEditEquipmentDialogClose();
      window.location.reload();
    }
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
          handleRemoveEquipmentClick={handleRemoveEquipmentClick}
        />
      </Box>

      {/* <Box id="admin-equipment-header">{t("Add and edit equipment")}</Box> */}
      {/* <Divider /> */}
      <Box id="admin-equipment-wrapper">
        {/* <FmButton2 className="admin-equipment-button" onClick={handleEditClick}>
          {t("Edit")}
        </FmButton2> */}
        <FmButton2 className="admin-equipment-button" onClick={handleAddClick}>
          {t("New Equipment")}
        </FmButton2>
      </Box>
      <AddEquipmentDialog
        equipmentTypes={equipmentTypes}
        addEquipmentDialogOpen={addEquipmentDialogOpen}
        handleAddEquipmentDialogClose={handleAddEquipmentDialogClose}
        getEquipmentNames={getEquipmentNames}
      />
    </>
  );
};

export default AdminEquipmentComponent;
