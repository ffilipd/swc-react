import {
  Box,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
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
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Booking } from "../../interfaces";
import { useTranslation } from "react-i18next";
import "./table.css";

interface BookingsProps {
  bookings: Booking[] | null;
  setBookings: Dispatch<SetStateAction<Booking[] | null>>;
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
  const { isMobile, bookings, setBookings, labels, availableTypes } = props;
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

  // useEffect(() => {
  //   // get bookings by filter
  //   setBookings(
  //     getBookingsByParams({
  //       type: filters.type,
  //       name: filters.name,
  //       swc_number: filters.number,
  //     })
  //   );
  // }, [filters]);

  // useEffect(() => {
  //   const _names: string[] = getEquipmentNamesByType(filters.type);
  //   setAvailableFilters({ ...availableFilters, names: _names });
  // }, [filters.type]);
  // useEffect(() => {
  //   const _numbers: string[] = getNumbersByTypeAndName(
  //     filters.type,
  //     filters.name
  //   );
  //   setAvailableFilters({ ...availableFilters, numbers: _numbers });
  // }, [filters.number]);

  return (
    <React.Fragment>
      <Box id="table-wrapper">
        <Typography className="label">
          {t("Bookings for selected date, time and equipment")}
        </Typography>
        <Box id="table-content">
          <TableContainer>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="left">
                    {t("Class / Name")}
                  </StyledTableCell>
                  <StyledTableCell align="left">{t("Number")}</StyledTableCell>
                  {isMobile === false ? (
                    <>
                      <StyledTableCell align="left">
                        {t("Date")}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {t("From")}
                      </StyledTableCell>
                      <StyledTableCell align="left">{t("To")}</StyledTableCell>
                      <StyledTableCell align="left">
                        {t("User")}
                      </StyledTableCell>
                    </>
                  ) : (
                    <StyledTableCell></StyledTableCell>
                  )}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {isMobile && (
                  <>
                    {Array.from(
                      new Set(
                        bookings?.map(
                          (row) => `${row.equipment_name}-${row.swc_number}`
                        )
                      )
                    ).map((uniqueKey, i) => {
                      const groupedRows = bookings?.filter(
                        (row) =>
                          `${row.equipment_name}-${row.swc_number}` ===
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
                            <StyledTableCell align="left">
                              {firstRow?.equipment_name}
                            </StyledTableCell>
                            <StyledTableCell>
                              {firstRow?.swc_number}
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
                                        <StyledTableCell align="left">
                                          {t("User")}
                                        </StyledTableCell>
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
                                          <StyledTableCell align="left">
                                            {row.user_id}
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
                          {row.equipment_name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.swc_number}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.date}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.time_from}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.time_to}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.user_name}
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
