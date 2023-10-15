import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Booking } from "../../interfaces";
import { getBookings } from "../../service/booking.service";
import { useTranslation } from "react-i18next";
import "./table.css";

interface BookingsProps {
  bookings: Booking[] | null;
}

const BookingTable = (props: BookingsProps) => {
  const { bookings } = props;
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Box id="table-wrapper">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">{t("Class / Name")}</TableCell>
                <TableCell align="left">{t("Number")}</TableCell>
                <TableCell align="left">{t("Date")}</TableCell>
                <TableCell align="left">{t("From")}</TableCell>
                <TableCell align="left">{t("To")}</TableCell>
                <TableCell align="left">{t("Booker")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings &&
                bookings.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component={"th"} scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.swc_number}</TableCell>
                    <TableCell align="left">{row.date}</TableCell>
                    <TableCell align="left">{row.time_from}</TableCell>
                    <TableCell align="left">{row.time_to}</TableCell>
                    <TableCell align="left">{row.user_id}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </React.Fragment>
  );
};

export default BookingTable;
