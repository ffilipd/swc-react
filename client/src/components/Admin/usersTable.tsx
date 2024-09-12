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
  Button,
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
} from "@mui/material";
import { RiDeleteBin2Line } from "react-icons/ri";
import CloseIcon from "@mui/icons-material/Close";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FMProfile, UserRole } from "../../interfaces";
import { useTranslation } from "react-i18next";
import "./mytable.css";
import TablePaginationActions from "../Pagination";
import { FmButton2 } from "../../utils/buttons";
import { TransitionProps } from "@mui/material/transitions";

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
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "var(--color-theme-dark)",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

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
  const { isMobile, users } = props;
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<FMProfile>();
  const userRoles: UserRole[] = ["admin", "user", "viewer"];
  const userAccess: string[] | "" = ["J/70", "Elliott 6M", "RS Toura"];
  const [userIsActive, setUserIsActive] = useState<boolean>(false);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - (users ? users.length : 0))
      : 0;

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

  const handleChangeUserRole = () => {
    const currentRole = selectedUser?.role;
  };
  const handleChangeUserAccess = () => {
    const currentRole = selectedUser?.role;
  };

  const handleCheckboxActive = () => {};

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
                        {row.rejected
                          ? "Rejected"
                          : row.active
                          ? "Active"
                          : "Inactive"}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.role}</StyledTableCell>
                      <StyledTableCell align="left">
                        {row.last_login}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <RiDeleteBin2Line size={"large"} />
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
              onClick={() => setShowUserDetails(false)}
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
              // onClick={handleAddEquipmentDialogClose}
            >
              {t("Save")}
            </Button>
          </Toolbar>
        </AppBar>
        <Box id="admin-equipment-select-wrapper">
          {/* NAME */}
          <FormControl variant="standard" className="show-user-dialog-input">
            <InputLabel htmlFor="user-name">{t("Full Name")}</InputLabel>
            <Input id="user-name" value={selectedUser?.name} />
          </FormControl>
          <FormControl variant="standard" className="show-user-dialog-input">
            <InputLabel htmlFor="user-email">{t("Email")}</InputLabel>
            <Input id="user-email" value={selectedUser?.email} />
          </FormControl>
          <FormControl variant="standard" className="show-user-dialog-input">
            <InputLabel htmlFor="user-role">{t("Role")}</InputLabel>
            <Select
              labelId="user-role"
              id="user-role-select"
              value={selectedUser?.role}
              onChange={handleChangeUserRole}
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
              checked={selectedUser?.active}
            />
            <FormControlLabel
              control={<Checkbox color="error" />}
              label={t("Rejected")}
              checked={selectedUser?.rejected}
            />
          </FormGroup>
          <FormGroup>
            {userAccess.map((accessItem) => (
              <FormControlLabel
                key={accessItem}
                control={<Checkbox color="secondary" />}
                label={accessItem}
              />
            ))}
          </FormGroup>

          {/* <FmButton2>{t("Edit")}</FmButton2> */}
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

export default UsersTable;
