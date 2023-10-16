import {
  Box,
  FormControl,
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
                  {isMobile === false && (
                    <>
                      <StyledTableCell align="left">
                        {t("Date")}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {t("From")}
                      </StyledTableCell>
                      <StyledTableCell align="left">{t("To")}</StyledTableCell>
                      <StyledTableCell align="left">
                        {t("Booker")}
                      </StyledTableCell>
                    </>
                  )}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {bookings?.map((row) => (
                  <StyledTableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell align="left">{row.name}</StyledTableCell>
                    <StyledTableCell align="left">
                      {row.swc_number}
                    </StyledTableCell>
                    {isMobile === false && (
                      <>
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
                          {row.user_id}
                        </StyledTableCell>
                      </>
                    )}
                  </StyledTableRow>
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
