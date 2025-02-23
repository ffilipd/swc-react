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
import "./mypage.css";
import { useEffect, useState } from "react";
import UsersTable from "./usersTable";
import { FMProfile } from "../../interfaces";
import { getAllUsers } from "../../service/user.service";
import FmDialog from "../../utils/dialog";
import { useUser } from "../../UserContext";

const AdminUsersComponent = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [users, setUsers] = useState<FMProfile[]>([]);

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });

  const fetchUsers = async () => {
    const usersData: FMProfile[] = await getAllUsers();
    setUsers(usersData);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [deleteBookingDialogOpen, setDeleteBookingDialogOpen] =
    useState<boolean>(false);
  const handleCloseDeleteDialog = () => setDeleteBookingDialogOpen(false);

  const [description, setDescription] = useState<string>("");
  const [descriptionDialogOpen, setDescriptionDialogOpen] =
    useState<boolean>(false);
  const handleCloseDescriptionDialog = () => {
    setDescriptionDialogOpen(false);
    setDescription("");
  };

  return (
    <>
      <Box id="my-page-header">{t("User Management")}</Box>
      {/* <Divider /> */}
      <Box id="my-page-wrapper">
        <UsersTable users={users} isMobile={isMobile} fetchUsers={fetchUsers} />
      </Box>
      <FmDialog
        onDialogOpen={deleteBookingDialogOpen}
        onDialogClose={handleCloseDeleteDialog}
        onHandleAction={() => {}}
        props={{
          title: t("Delete booking"),
          description: t("Are you sure you want to delete booking?"),
          action: t("Delete"),
        }}
      />
      {/* <Dialog
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
      </Dialog> */}
    </>
  );
};

export default AdminUsersComponent;
