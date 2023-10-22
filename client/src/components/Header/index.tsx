import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  HssFleetLogo,
  HssFleetLogo2,
  HssLogo2,
  SwcTextLogo,
} from "../../utils/svg-components";
import "./header.css";
import { useTranslation } from "react-i18next";
import { SwcButton } from "../../utils/buttons";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardControlKeyIcon from "@mui/icons-material/KeyboardControlKey";
import LanguageSharpIcon from "@mui/icons-material/LanguageSharp";
import LoginSharpIcon from "@mui/icons-material/LoginSharp";
import { useNavigate } from "react-router-dom";
import MobileDrawer from "./MobileDrawer";
import i18next from "i18next";
import { GoogleLogin } from "@react-oauth/google";
import i18n from "../../i18next";

function Header() {
  const languages = {
    en: "English",
    sv: "Svenska",
    fi: "Suomi",
  };
  const [language, setLanguage] = useState<string>("en");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuth = false;
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });

  const handleLoginDialogClose = () => {
    setLoginDialogOpen(false);
  };
  const handleLoginDialogOpen = () => {
    setLoginDialogOpen(true);
  };

  // Update page when language changes
  useEffect(() => {
    i18next.changeLanguage(language);
  }, [language]);

  const loggedInUser = {
    name: "John Doe",
  };
  const accountMenuOpen = Boolean(menuAnchorEl);

  const updateLanguage = (newLanguage: string) => {
    console.log(language);
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
  function handleClickLogin() {
    // navigate("/login");
    setLoginDialogOpen(true);
  }
  function handleLoginSuccess(responseObject: any) {
    console.log(responseObject.credential);
    setLoginDialogOpen(false);
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

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuItemClick = (clickedItem: any) => {
    setDrawerOpen(false);
    if (clickedItem === "Home") navigate("/");
    if (clickedItem === "Book equipment") navigate("/booking");
    if (clickedItem === "Report") navigate("/report");
    if (clickedItem === "Login") handleClickLogin();
  };

  return (
    <Box id="header-wrapper">
      <Box id={"hss-logo"}>
        <HssLogo2 />
      </Box>
      <Box id="header-and-buttongroup">
        <Box id="swc-header-text">
          {/* <SwcTextLogo width={350} /> */}
          <HssFleetLogo2 />
        </Box>
        {isMobile ? (
          <MobileDrawer
            isOpen={drawerOpen}
            toggleDrawer={toggleDrawer}
            language={language}
            languages={languages}
            updateLanguage={updateLanguage}
            handleMenuItemClick={handleMenuItemClick}
          />
        ) : (
          <ButtonGroup
            id="button-group"
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
              <SwcButton onClick={() => navigate("/")}>{t("Home")}</SwcButton>
              <SwcButton onClick={() => navigate("/report")}>
                {t("Report")}
              </SwcButton>
              <SwcButton onClick={() => navigate("/booking")}>
                {t("Book equipment")}
              </SwcButton>
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
                <SwcButton onClick={handleClickLogin}>{t("Login")}</SwcButton>
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
                {Object.entries(languages).map((lang) => (
                  <MenuItem key={`language-${lang[0]}`} value={lang[0]}>
                    {lang[1]}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </ButtonGroup>
        )}
      </Box>
      <Dialog fullWidth open={loginDialogOpen} onClose={handleLoginDialogClose}>
        <DialogTitle id="submit-dialog-title" sx={{ textAlign: "center" }}>
          {t("Login with Google Account")}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="submit-dialog-description">
            {t("Thank you for the report!")}
          </DialogContentText> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GoogleLogin
              locale={i18n.language}
              theme="outline"
              onSuccess={(res) => handleLoginSuccess(res)}
              onError={() => console.log("Login failed")}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginDialogClose}>{t("Close")}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Header;
