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
  Tooltip,
} from "@mui/material";
import { RiDeleteBin2Line } from "react-icons/ri";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Booking, FMProfile } from "../../interfaces";
import { useTranslation } from "react-i18next";
import "./mytable.css";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs";
import TablePaginationActions from "../Pagination";
import { hover } from "@testing-library/user-event/dist/hover";

interface BookingsProps {
  bookings: Booking[];
  setBookings: Dispatch<SetStateAction<Booking[]>>;
  handleEditBooking: (e: any) => void;
  handleDeleteBooking: (e: any) => void;
  handleEditReport: (e: any) => void;
  handleCreateReportNow: (e: any) => void;
  openDescriptionDialog: (description: string) => void;
  users: FMProfile[];
  isMobile: boolean;
  labels: {
    equipment: {
      type: string;
      name: string;
      number: string;
    };
  };
  availableTypes: string[];
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

const UsersTable = (props: BookingsProps) => {
  const { isMobile, bookings, availableTypes, users } = props;

  dayjs.extend(customParseFormat);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const { t } = useTranslation();

  const [filters, setFilters] = useState<{
    type: string;
    name: string;
    number: string;
  }>({
    type: "",
    name: "",
    number: "",
  });
  const [availableFilters, setAvailableFilters] = useState<{
    types: string[];
    names: string[];
    numbers: string[];
  }>({
    types: availableTypes,
    names: [],
    numbers: [],
  });

  const isInPast = (date: string) => {
    const formattedDate = date.split("-").reverse().join("-");
    if (formattedDate < dayjs().format("YYYY-MM-DD")) {
      return true;
    }
    return false;
  };

  const handleClickUserRow = (user: FMProfile) => {
    console.log(user);
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
                  count={bookings ? bookings.length : 0}
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
    </React.Fragment>
  );
};

export default UsersTable;
