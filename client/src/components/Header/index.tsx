import {
  Box,
  Button,
  ButtonGroup,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { HssLogo } from "../../utils/svg-components";
import "./header.css";
import { useTranslation } from "react-i18next";
import { SwcButton } from "../../utils/buttons";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardControlKeyIcon from "@mui/icons-material/KeyboardControlKey";
import LanguageSharpIcon from "@mui/icons-material/LanguageSharp";
import LoginSharpIcon from "@mui/icons-material/LoginSharp";
import { useNavigate } from "react-router-dom";

function Header() {
  const [language, setLanguage] = useState<string>("en");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuth = true;
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  const loggedInUser = {
    name: "John Doe",
  };
  const accountMenuOpen = Boolean(menuAnchorEl);

  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
  };
  function handleAccountMenuClose(e: any) {
    /* eslint-disable */
    e.target.value === 0
      ? null // @TODO: Implement account details fn here!
      : null;
    setMenuAnchorEl(null);
  }

  function handleUserManagement() {
    navigate("/users");
  }
  function handleLogin() {
    navigate("/login");
  }
  function handleLogout() {
    console.log("logout");
  }

  function handleAccountMenuClick(e: React.MouseEvent<HTMLButtonElement>) {
    setMenuAnchorEl(e.currentTarget);
  }

  const handleAccountDetailsClick = (event: any) => {
    // open /accountinfo with current user account details
    handleAccountMenuClose(event);
    console.log("navigate to account details");
  };

  return (
    <Box
      id="header-wrapper"
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "180px",
        backgroundColor: "var(--color-dark-blue)",
        width: "100%",
        alignItems: "flex-start",
      }}
    >
      <Box id={"hss-logo"}>
        <HssLogo />
      </Box>
      <Box id="header-and-buttongroup">
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Typography id="swc-header-text">
            SAILING AND WINDSURFING CENTER
          </Typography>
        </Box>
        <ButtonGroup
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            // border: "1px solid white",
          }}
          variant="outlined"
          aria-label="header button group"
        >
          <Box sx={{ display: "flex", alignSelf: "flex-end" }}>
            <SwcButton>{t("Report")}</SwcButton>
            <SwcButton>{t("Book Equipment")}</SwcButton>
          </Box>
          <Box sx={{ display: "flex" }}>
            {isAuth ? (
              <>
                <Button
                  id="login-header-btn"
                  aria-controls={accountMenuOpen ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={accountMenuOpen ? "true" : undefined}
                  onClick={handleAccountMenuClick}
                >
                  {loggedInUser.name}
                  {accountMenuOpen ? (
                    <KeyboardControlKeyIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </Button>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={accountMenuOpen}
                  onClose={handleAccountMenuClose}
                  MenuListProps={{
                    "aria-labelledby": "account-button",
                  }}
                >
                  <MenuItem onClick={handleAccountDetailsClick}>
                    {t("Account details")}
                  </MenuItem>
                  <MenuItem value={1} onClick={handleLogout}>
                    {t("Logout")}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <SwcButton>{t("Login")}</SwcButton>
            )}
            <Select
              variant="outlined"
              className="swc-select"
              sx={{
                color: "#fff",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                ".MuiSvgIcon-root ": {
                  fill: "#fff",
                },
              }}
              IconComponent={KeyboardArrowDownIcon}
              labelId="lang"
              value={language}
              startAdornment={
                <InputAdornment position="start">
                  {/* <LanguageSharpIcon sx={{ color: "#fff" }} /> */}
                </InputAdornment>
              }
              inputProps={{ style: { textTransform: "capitalize" } }}
              onChange={(e: SelectChangeEvent) =>
                updateLanguage(e.target.value)
              }
            >
              <MenuItem value={"en"}>English</MenuItem>
              <MenuItem value={"fi"}>Suomi</MenuItem>
              <MenuItem value={"sv"}>Svenska</MenuItem>
            </Select>
          </Box>
        </ButtonGroup>
      </Box>
    </Box>
  );
}

export default Header;
