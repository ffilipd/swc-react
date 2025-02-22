import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  styled,
  tableCellClasses,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  Slide,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormGroup,
  Checkbox,
  TableCellProps,
  Chip,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  SelectChangeEvent,
  Divider,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { EquipmentSearchParams, FMProfile, UserRole } from "../../interfaces";
import { useTranslation } from "react-i18next";
import "./mytable.css";
import TablePaginationActions from "../Pagination";
import { TransitionProps } from "@mui/material/transitions";
import { updateUserProfile, deleteUser } from "../../service/user.service";
import { dummyUser } from "../../utils/dummy-data";
import { FmButton2, FmButtonDanger, FmDeleteButton } from "../../utils/buttons";
import { useEquipment } from "../../EquipmentContext";
import { getEquipment } from "../../service/equipment.service";
import { Height, Label } from "@mui/icons-material";
import { use } from "i18next";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface UsersProps {
  users: FMProfile[];
  isMobile: boolean;
  fetchUsers: () => Promise<void>;
}

interface StyledTableCellProps extends TableCellProps {
  status?: "active" | "inactive" | "rejected";
}

const StyledTableCell = styled(TableCell)<StyledTableCellProps>(
  ({ theme, status }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "var(--color-theme-dark)",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.root}`]: {
      backgroundColor:
        status === "active"
          ? "lightgreen"
          : status === "inactive"
          ? "orange"
          : status === "rejected"
          ? "red"
          : "var(--color-theme-light",
      color: theme.palette.common.white,
      display: "flex",
      alignItems: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  })
);

const StatusChip: React.FC<{
  status: "Active" | "Inactive" | "Rejected" | "default";
}> = ({ status }) => {
  const getColor = (status: string) => {
    switch (status) {
      case "Active":
        return "lightgreen";
      case "Inactive":
        return "orange";
      case "Rejected":
        return "red";
      default:
        return "var(--color-theme-light)";
    }
  };

  return (
    <Chip
      label={status}
      style={{
        backgroundColor: getColor(status),
        color: "white",
        width: "100%",
      }}
    />
  );
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // darken row on hover
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const UsersTable = (props: UsersProps) => {
  const { isMobile, users, fetchUsers } = props;
  const { t } = useTranslation();
  const { equipmentTypes, getEquipmentNames } = useEquipment();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<FMProfile>(dummyUser);
  const [updatedUser, setUpdatedUser] = useState<FMProfile>(dummyUser);
  const userRoles: UserRole[] = ["admin", "user", "moderator"];
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0
  //     ? Math.max(0, (1 + page) * rowsPerPage - (users ? users.length : 0))
  //     : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickUserRow = (user: FMProfile) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const closeUserDetailsDialog = () => {
    if (selectedUser !== updatedUser) {
      alert!("Changes not saved");
      return;
    }
    setShowUserDetails(false);
    fetchUsers();
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteUserClick = () => {
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    setUpdatedUser(selectedUser);
  }, [selectedUser]);

  // useEffect(() => {
  //   setSelectedUser(updatedUser);
  // }, [updatedUser]);

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
            .replace(/,,+/g, ","),
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

  const handleDeleteUser = async () => {
    const res = await deleteUser(selectedUser.id as keyof FMProfile);
    setDeleteDialogOpen(false);
    alert(res);
    closeUserDetailsDialog();
  };

  return (
    <React.Fragment>
      <Box id="my-page-table-wrapper">
        {/* <Typography className="label">
          {t("Booking and report history")}
        </Typography> */}
        <TableContainer id="my-table-container">
          <Table>
            <TableHead>
              <StyledTableRow>
                {isMobile ? (
                  <>
                    <StyledTableCell align="left">{t("Date")}</StyledTableCell>
                    <StyledTableCell align="left">{t("Name")}</StyledTableCell>
                    <StyledTableCell align="left">
                      {t("Number")}
                    </StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </>
                ) : (
                  <>
                    <StyledTableCell align="left">
                      {t("Created")}
                    </StyledTableCell>
                    <StyledTableCell align="left">{t("Name")}</StyledTableCell>
                    <StyledTableCell align="left">{t("Email")}</StyledTableCell>
                    <StyledTableCell align="left">
                      {t("Status")}
                    </StyledTableCell>
                    <StyledTableCell align="left">{t("Role")}</StyledTableCell>
                    <StyledTableCell align="left">
                      {t("Last seen")}
                    </StyledTableCell>
                    <StyledTableCell />
                  </>
                )}
              </StyledTableRow>
            </TableHead>
            <TableBody id="my-table-body">
              {!isMobile &&
                (rowsPerPage > 0
                  ? users?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : users
                ).map((row, i) => (
                  <React.Fragment key={`${row.id}-${row.name}-${i}`}>
                    <StyledTableRow
                      className="hover-highlight"
                      sx={{
                        "& > *": { borderBottom: "unset" },
                        cursor: "pointer",
                      }}
                      onClick={() => handleClickUserRow(row)}
                      // onMouseOver={() => handleMouseOverRow(row)}
                    >
                      <StyledTableCell align="left">
                        {row.created_date}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.name}</StyledTableCell>
                      <StyledTableCell align="left">
                        {row.email}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <StatusChip
                          status={
                            row.rejected
                              ? "Rejected"
                              : row.active
                              ? "Active"
                              : "Inactive"
                          }
                        />
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.role}</StyledTableCell>
                      <StyledTableCell align="left">
                        {row.last_login}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        className="delete-icon-cell"
                      >
                        <FmDeleteButton
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSelectedUser(row);
                            handleDeleteUserClick();
                          }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  </React.Fragment>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  align="right"
                  id="my-table-pagination"
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={11}
                  width={"100%"}
                  count={users ? users.length : 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>

      {/* users dialog */}
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
          <FormGroup>
            <FormControlLabel
              control={<Checkbox color="success" />}
              label={t("Active")}
              checked={updatedUser?.active}
              name={"active"}
              onChange={(e) => handleCheckboxClick(e)}
            />
            <FormControlLabel
              control={<Checkbox color="error" />}
              label={t("Rejected")}
              checked={updatedUser?.rejected}
              name={"rejected"}
              onChange={(e) => handleCheckboxClick(e)}
            />
          </FormGroup>
          <Typography sx={{ marginTop: "20px" }}>
            {t("User Access Rights")}
          </Typography>
          <Divider />
          <FormGroup>
            {equipmentTypes.map((type) => (
              <React.Fragment key={type}>
                <FormControlLabel
                  control={
                    <Checkbox color="primary" id={`equipment-type-${type}`} />
                  }
                  checked={updatedUser.access?.split(",").includes(type)}
                  label={type}
                  name="type"
                  onChange={(e) => handleCheckboxClick(e)}
                />
                {/* <Typography>{type}</Typography> */}
                {/* <FormControlLabel
                  disabled={isTypeSelected(type)}
                  style={{ marginLeft: "20px" }}
                  key={`select-all-${type}`}
                  control={<Checkbox color="primary" />}
                  label={`-- ${t("Select all")} --`}
                  onChange={checkAllNames(type)}
                  /> */}
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
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle id="alert-dialog-title">{t("Delete user")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-delete">
            {/* {description} */}
            {t("Are you sure you want to delete user ")}"{updatedUser.name}"
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} autoFocus>
            {t("Cancel")}
          </Button>
          <Button onClick={handleDeleteUser}>{t("Delete")}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UsersTable;
