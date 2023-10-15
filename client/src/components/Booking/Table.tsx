import {
  Box,
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
import React, { useEffect, useState } from "react";
import { Booking } from "../../interfaces";
import { getBookings } from "../../service/booking.service";
import { useTranslation } from "react-i18next";
import "./table.css";

interface BookingsProps {
  bookings: Booking[] | null;
  isMobile: boolean;
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
  const { isMobile, bookings } = props;
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Box id="table-wrapper">
        <Typography className="label">
          {t("Bookings for selected date and time")}
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
