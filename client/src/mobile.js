mobile

{
    isMobile && (
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
                                                    <TableCell align="left">
                                                        {t("From")}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {t("To")}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {t("User")}
                                                    </TableCell>
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
    )
}