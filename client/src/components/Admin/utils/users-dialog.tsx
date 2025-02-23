import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
  Slide,
} from "@mui/material";
import { t } from "i18next";
import React from "react";
import { FmButton2, FmButtonDanger } from "../../../utils/buttons";
import { UserStaticCheckBoxes } from "./user-table";
import { FMProfile, UserRole } from "../../../interfaces";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { updateUserProfile } from "../../../service/user.service";

interface UsersDialogProps {
  showUserDetails: boolean;
  closeUserDetailsDialog: () => void;
  updatedUser: FMProfile;
  handleDeleteUserClick: () => void;
  setUpdatedUser: (user: FMProfile) => void;
  setSelectedUser: (user: FMProfile) => void;
  user: FMProfile | null;
  equipmentTypes: string[];
  getEquipmentNames: (type: string) => string[];
  userRoles: UserRole[];
  selectedUser: FMProfile;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UsersDialog = (props: UsersDialogProps) => {
  const {
    showUserDetails,
    closeUserDetailsDialog,
    updatedUser,
    handleDeleteUserClick,
    setUpdatedUser,
    setSelectedUser,
    user,
    equipmentTypes,
    getEquipmentNames,
    userRoles,
    selectedUser,
  } = props;

  const handleCheckboxClick = (event: React.SyntheticEvent<Element, Event>) => {
    const { name, checked } = event.target as HTMLInputElement;
    if (name === "active" || name === "rejected") {
      setUpdatedUser({ ...updatedUser, [name]: checked });
    }
    if (name === "type" || name === "name") {
      const item = (event.target as HTMLInputElement).id.split("-")[2];
      if (checked) {
        setUpdatedUser({
          ...updatedUser,
          access: updatedUser.access + "," + item,
        });
      } else {
        setUpdatedUser({
          ...updatedUser,
          access: updatedUser.access
            ?.replace(item, "")
            // Clean away any double commas left when removing a type
            .replace(/(^,)|(,$)/g, "")
            .replace(/,,+/g, ",")
            .replace(/^,/, "")
            .replace(/null/g, ""),
        });
      }
    }
  };

  const handleChangeUserRole = async (event: SelectChangeEvent<UserRole>) => {
    const selectedRole = event.target.value as UserRole;
    const currentRole = updatedUser?.role;
    if (selectedRole === currentRole) return;
    setUpdatedUser({ ...updatedUser, role: selectedRole });
  };

  const handleSaveUser = async () => {
    if (
      updatedUser &&
      updatedUser.id !== "12345" && // dummy id, without this check it might try to update a non existing user
      JSON.stringify(updatedUser) !== JSON.stringify(selectedUser)
    ) {
      try {
        const res = await updateUserProfile(updatedUser);
        setSelectedUser(updatedUser);
        alert(res.message);
      } catch (err) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("An unknown error occurred");
        }
      }
      return;
    }
    alert("No changes made");
  };

  return (
    <Dialog
      fullScreen
      open={showUserDetails}
      // onClose={handleEditEquipmentDialogClose}
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
            onClick={() => closeUserDetailsDialog()}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 4, flex: 1 }} variant="h6" component="div">
            {t("Edit User")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box id="admin-equipment-select-wrapper">
        {/* NAME */}
        <FormControl variant="standard" className="show-user-dialog-input">
          <InputLabel htmlFor="user-name">{t("Full Name")}</InputLabel>
          <Input id="user-name" value={updatedUser?.name} />
        </FormControl>
        <FormControl variant="standard" className="show-user-dialog-input">
          <InputLabel htmlFor="user-email">{t("Email")}</InputLabel>
          <Input id="user-email" value={updatedUser?.email} />
        </FormControl>
        <FormControl variant="standard" className="show-user-dialog-input">
          <InputLabel htmlFor="user-role">{t("Role")}</InputLabel>
          <Select
            labelId="user-role"
            id="user-role-select"
            value={updatedUser?.role}
            onChange={(e) => handleChangeUserRole(e)}
          >
            {userRoles.map((role) => (
              <MenuItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <UserStaticCheckBoxes
          user={user ? user : null}
          onChange={handleCheckboxClick}
          updatedUser={updatedUser}
        />
        <Typography sx={{ marginTop: "20px", fontWeight: "bold" }}>
          {t("User Access Rights")}
        </Typography>
        <Divider />
        <FormGroup sx={{ margin: "0 0 100px 0" }}>
          {equipmentTypes.map((type) => (
            <React.Fragment key={type}>
              <FormControlLabel
                sx={{ margin: "20px 0 0 0" }}
                control={
                  <Checkbox color="primary" id={`equipment-type-${type}`} />
                }
                checked={updatedUser.access?.split(",").includes(type)}
                label={type}
                name="type"
                onChange={(e) => handleCheckboxClick(e)}
              />
              <Divider />
              {getEquipmentNames(type).map((name) => (
                <FormControlLabel
                  style={{ marginLeft: "20px" }}
                  key={name}
                  control={
                    <Checkbox color="primary" id={`equipment-name-${name}`} />
                  }
                  checked={updatedUser.access?.split(",").includes(name)}
                  label={name}
                  name="name"
                  onChange={(e) => handleCheckboxClick(e)}
                />
              ))}
            </React.Fragment>
          ))}
        </FormGroup>

        <FmButton2 onClick={handleSaveUser}>{t("Save")}</FmButton2>
        <FmButtonDanger onClick={handleDeleteUserClick}>
          {t("Delete User")}
        </FmButtonDanger>
      </Box>
    </Dialog>
  );
};

export default UsersDialog;
