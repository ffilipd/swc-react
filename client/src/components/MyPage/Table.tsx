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
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Booking } from "../../interfaces";
import { useTranslation } from "react-i18next";
import "./table.css";

interface BookingsProps {
  bookings: Booking[] | null;
  setBookings: Dispatch<SetStateAction<Booking[] | null>>;
  handleEditBooking: (e: any) => void;
  handleDeleteBooking: (e: any) => void;
  handleEditReport: (e: any) => void;
  openDescriptionDialog: (e: any) => void;
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
    backgroundColor: "var(--color-dark-blue)",
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
    openDescriptionDialog,
  } = props;
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

  return (
    <React.Fragment>
      <Box id="my-page-table-wrapper">
        {/* <Typography className="label">
          {t("Booking and report history")}
        </Typography> */}
        <Box id="table-content">
          <TableContainer>
            <Table>
              <TableHead>
                <StyledTableRow>
                  {isMobile ? (
                    <>
                      <StyledTableCell align="left">
                        {t("Date")}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {t("Name")}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {t("Number")}
                      </StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </>
                  ) : (
                    <>
                      <StyledTableCell align="left">
                        {t("Date")}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {t("Name")}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {t("Number")}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {t("From")}
                      </StyledTableCell>
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
              <TableBody>
                {isMobile && (
                  <>
                    {Array.from(
                      new Set(
                        bookings?.map(
                          (row) =>
                            `${row.equipment_name}-${row.equipment_number}`
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
                                      <TableRow
                                        sx={{ backgroundColor: "#89a" }}
                                      >
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
                  bookings?.map((row, i) => (
                    <React.Fragment
                      key={`${row.id}-${row.equipment_name}-${i}`}
                    >
                      <StyledTableRow
                        sx={{
                          "& > *": { borderBottom: "unset" },
                        }}
                      >
                        <StyledTableCell align="left">
                          {row.date}
                        </StyledTableCell>
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
                          <EditOutlinedIcon
                            onClick={() => handleEditBooking(row.id)}
                            className="my-page-icon-button"
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <DeleteOutlineOutlinedIcon
                            onClick={() => handleDeleteBooking(row.id)}
                            className="my-page-icon-button"
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          style={{ borderLeft: "3px solid gray" }}
                        ></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell
                          onClick={() => openDescriptionDialog(row)}
                          className="damage-description-cell"
                        >
                          <u>Lorem ipsum dolor sit amet...</u>
                        </StyledTableCell>
                        <StyledTableCell>
                          <EditOutlinedIcon
                            onClick={() => handleEditReport(row.id)}
                            className="my-page-icon-button"
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default BookingTable;
// export default {};
