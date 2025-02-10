import { useState } from "react";
import { FMProfile } from "../../interfaces";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { deleteUser } from "../../service/user.service";

interface DeleteDialogProps {
  selectedUser: FMProfile;
  closeUserDetailsDialog: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  selectedUser,
  closeUserDetailsDialog,
}) => {
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    const res = await deleteUser(selectedUser.id as keyof FMProfile);
    setDeleteDialogOpen(false);
    alert(res);
    closeUserDetailsDialog();
  };

  return (
    <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
      <DialogTitle id="alert-dialog-title">{t("Delete user")}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-delete">
          {/* {description} */}
          {t("Are you sure you want to delete user ")}"{selectedUser.name}"
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog} autoFocus>
          {t("Cancel")}
        </Button>
        <Button onClick={handleDeleteUser}>{t("Delete")}</Button>
      </DialogActions>
    </Dialog>
  );
};
