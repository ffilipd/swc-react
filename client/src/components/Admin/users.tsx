import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import "./mypage.css";
import { useEffect, useState } from "react";
import { getEquipmentFilters } from "../../service/equipment.service";
import { deleteBooking, getBookings } from "../../service/booking.service";
import dayjs, { Dayjs } from "dayjs";
import UsersTable from "./usersTable";
import { Booking, FMProfile, NewBooking } from "../../interfaces";
import { useUser } from "../../UserContext";
import { getAllUsers } from "../../service/user.service";

const AdminUsersComponent = () => {
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

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<FMProfile[]>([]);

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

  const fetchBookings = async () => {
    const bookingsData: Booking[] = await getBookings({
      userId: user?.role === "user" ? user.id : undefined,
      equipmentNameId: selectedEquipment.equipmentNameId,
      equipment_type: selectedEquipment.type,
      equipmentId: selectedEquipment.number,
      date: selectedDate?.format("DD-MM-YYYY") || "",
      time_from: selectedTime.fromTime?.format("HH:mm") || "",
      time_to: selectedTime.toTime?.format("HH:mm") || "",
      usage: "edit",
    });
    setBookings(bookingsData);
  };

  const fetchUsers = async () => {
    const usersData: FMProfile[] = await getAllUsers();
    setUsers(usersData);
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, selectedEquipment, selectedTime]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditBooking = (e: any) => {
    console.log("edit" + e);
  };
  const handleEditReport = (e: any) => {
    console.log("edit" + e);
  };

  const [deleteBookingDialogOpen, setDeleteBookingDialogOpen] =
    useState<boolean>(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const handleOpenDeleteDialog = (bookingId: string) => {
    setDeleteBookingDialogOpen(true);
    if (bookingId) setBookingToDelete(bookingId);
  };
  const handleCloseDeleteDialog = () => setDeleteBookingDialogOpen(false);
  const handleDeleteBooking = async () => {
    if (bookingToDelete) {
      const message = await deleteBooking(bookingToDelete);
      alert(message);
      fetchBookings();
    }
    setDeleteBookingDialogOpen(false);
  };

  const [description, setDescription] = useState<string>("");
  const [descriptionDialogOpen, setDescriptionDialogOpen] =
    useState<boolean>(false);
  const handleCloseDescriptionDialog = () => {
    setDescriptionDialogOpen(false);
    setDescription("");
  };
  const openDescriptionDialog = (description: string) => {
    setDescription(description);
    setDescriptionDialogOpen(true);
  };

  const handleCreateReportNow = (bookingId: string) => {
    console.log(bookingId);
  };

  return (
    <>
      <Box id="my-page-header">{t("User Management")}</Box>
      {/* <Divider /> */}
      <Box id="my-page-wrapper">
        <UsersTable
          handleCreateReportNow={handleCreateReportNow}
          openDescriptionDialog={openDescriptionDialog}
          handleEditReport={handleEditReport}
          handleEditBooking={handleEditBooking}
          handleDeleteBooking={handleOpenDeleteDialog}
          bookings={bookings}
          users={users}
          setBookings={setBookings}
          isMobile={isMobile}
          labels={labels}
          availableTypes={availableEquipment.types}
        />
      </Box>
      <Dialog
        open={deleteBookingDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t("Delete booking")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("Are you sure you want to delete booking?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} autoFocus>
            {t("Cancel")}
          </Button>
          <Button onClick={handleDeleteBooking}>{t("Delete")}</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={descriptionDialogOpen}
        onClose={handleCloseDescriptionDialog}
      >
        <DialogTitle id="alert-dialog-title">
          {t("Description of damage report")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsersComponent;
