import {
  Box,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Booking } from "../../interfaces";
import { useTranslation } from "react-i18next";
import "./mytable.css";
import { KeyboardArrowRight, KeyboardArrowLeft } from "@mui/icons-material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs";

interface BookingsProps {
  bookings: Booking[];
  setBookings: Dispatch<SetStateAction<Booking[]>>;
  handleEditBooking: (e: any) => void;
  handleDeleteBooking: (e: any) => void;
  handleEditReport: (e: any) => void;
  handleCreateReportNow: (e: any) => void;
  openDescriptionDialog: (description: string) => void;
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const BookingTable = (props: BookingsProps) => {
  const {
    isMobile,
    bookings,
    setBookings,
    labels,
    availableTypes,
    handleEditBooking,
    handleEditReport,
    handleDeleteBooking,
    handleCreateReportNow,
    openDescriptionDialog,
  } = props;

  dayjs.extend(customParseFormat);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - (bookings ? bookings.length : 0))
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
                    <StyledTableCell align="left">{t("Date")}</StyledTableCell>
                    <StyledTableCell align="left">{t("Name")}</StyledTableCell>
                    <StyledTableCell align="left">
                      {t("Number")}
                    </StyledTableCell>
                    <StyledTableCell align="left">{t("From")}</StyledTableCell>
                    <StyledTableCell align="left">{t("To")}</StyledTableCell>
                    <StyledTableCell />
                    <StyledTableCell />
                    <StyledTableCell
                      style={{ borderLeft: "3px solid white" }}
                      align="left"
                    >
                      {t("Report")}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {t("Damage type")}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {t("Description")}
                    </StyledTableCell>
                    <StyledTableCell />
                  </>
                )}
              </StyledTableRow>
            </TableHead>
            <TableBody id="my-table-body">
              {isMobile && (
                <>
                  {Array.from(
                    new Set(
                      bookings?.map(
                        (row) => `${row.equipment_name}-${row.equipment_number}`
                      )
                    )
                  ).map((uniqueKey, i) => {
                    const groupedRows = bookings?.filter(
                      (row) =>
                        `${row.equipment_name}-${row.equipment_number}` ===
                        uniqueKey
                    );
                    const firstRow = groupedRows && groupedRows[0];
                    const isRowSelected = selectedRow === i;

                    return (
                      <React.Fragment key={uniqueKey}>
                        <StyledTableRow
                          sx={{
                            "& > *": { borderBottom: "unset" },
                          }}
                        >
                          <StyledTableCell>{firstRow?.date}</StyledTableCell>
                          <StyledTableCell align="left">
                            {firstRow?.equipment_name} #
                            {firstRow?.equipment_number}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() =>
                                setSelectedRow(isRowSelected ? null : i)
                              }
                            >
                              {isRowSelected ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </StyledTableCell>
                        </StyledTableRow>
                        <TableRow sx={{ padding: 0 }}>
                          <StyledTableCell
                            size="small"
                            sx={{ padding: 0 }}
                            colSpan={3}
                          >
                            <Collapse
                              in={isRowSelected}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box padding={"0 0 10px 0"}>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow sx={{ backgroundColor: "#89a" }}>
                                      <StyledTableCell align="left">
                                        {t("From")}
                                      </StyledTableCell>
                                      <StyledTableCell align="left">
                                        {t("To")}
                                      </StyledTableCell>
                                      <StyledTableCell align="left"></StyledTableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {groupedRows?.map((row, index) => (
                                      <StyledTableRow
                                        key={`${row.id}-${row.equipment_name}-${index}`}
                                      >
                                        <StyledTableCell align="left">
                                          {row.time_from}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                          {row.time_to}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                          <EditOutlinedIcon />
                                        </StyledTableCell>
                                      </StyledTableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </StyledTableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
              {!isMobile &&
                (rowsPerPage > 0
                  ? bookings?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : bookings
                ).map((row, i) => (
                  <React.Fragment key={`${row.id}-${row.equipment_name}-${i}`}>
                    <StyledTableRow
                      sx={{
                        "& > *": { borderBottom: "unset" },
                      }}
                    >
                      <StyledTableCell align="left">{row.date}</StyledTableCell>
                      <StyledTableCell align="left">
                        {row.equipment_name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.equipment_number}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.time_from}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.time_to}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {!isInPast(row.date ?? "") && row.damage_type === "" ? (
                          <EditOutlinedIcon
                            onClick={() => handleEditBooking(row.id)}
                            className="my-page-icon-button"
                          />
                        ) : null}
                      </StyledTableCell>
                      <StyledTableCell>
                        {(isInPast(row.date ?? "") && row.damage_type === "") ||
                        (!isInPast(row.date ?? "") &&
                          row.damage_type === "") ? (
                          <DeleteOutlineOutlinedIcon
                            onClick={() => handleDeleteBooking(row.id)}
                            className="my-page-icon-button"
                          />
                        ) : null}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{ borderLeft: "3px solid gray" }}
                        align="center"
                      >
                        {row.damage_type ? (
                          <CheckOutlinedIcon sx={{ color: "green" }} />
                        ) : (
                          row.damage_type === "" &&
                          isInPast(row.date ?? "") && (
                            <WarningAmberOutlinedIcon sx={{ color: "red" }} />
                          )
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.damage_type !== ""
                          ? row.damage_type
                          : isInPast(row.date ?? "") && t("Report missing!")}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{ minWidth: "180px" }}
                        onClick={() =>
                          isInPast(row.date ?? "") &&
                          openDescriptionDialog(
                            row.damage_description ? row.damage_description : ""
                          )
                        }
                        className="damage-description-cell"
                      >
                        {row.damage_description &&
                        row.damage_description.length > 20
                          ? `${row.damage_description.slice(0, 20)}...`
                          : row.damage_description}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.damage_type !== "" ? (
                          <EditOutlinedIcon
                            onClick={() => handleEditReport(row.id)}
                            className="my-page-icon-button"
                          />
                        ) : (
                          isInPast(row.date ?? "") &&
                          row.damage_type === "" && (
                            <NoteAltOutlinedIcon
                              onClick={() => handleCreateReportNow(row.id)}
                            />
                          )
                        )}
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

export default BookingTable;
// export default {};
