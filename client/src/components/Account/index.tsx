import {
  Box,
  Divider,
  FormControl,
  Input,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Checkbox,
  ListItemText,
  Switch,
  Typography,
  ListItemButton,
  Collapse,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../../UserContext";
import { FMProfile, UserRole } from "../../interfaces";
import { getUserById, updateUserProfile } from "../../service/user.service";
import React from "react";
import { useTranslation } from "react-i18next";
import "./account.css";
import i18next from "i18next";
import { DarkThemeHeader, SecondaryText } from "../../utils/custom-elements";
import SailingIcon from "@mui/icons-material/Sailing";
import DirectionsBoatFilledIcon from "@mui/icons-material/DirectionsBoatFilled";
import SurfingIcon from "@mui/icons-material/Surfing";
import { useEquipment } from "../../EquipmentContext";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { FmButton, FmButton2 } from "../../utils/buttons";

const AccountInfoComponent = () => {
  const [searchParams] = useSearchParams();
  const searchId: string | null = searchParams.get("id");
  const { t } = useTranslation();
  const { user, setUser } = useUser();
  const { equipment, sailboatNames, motorboatNames } = useEquipment();

  const labels = {
    selectRole: i18next.t("Role"),
    name: i18next.t("Name"),
    language: i18next.t("Preferred language"),
  };
  const [userInfo, setUserInfo] = useState<FMProfile>({
    id: "",
    email: "",
    verified_email: "",
    name: "",
    given_name: "",
    family_name: "",
    picture: "",
    locale: "",
    created_date: "",
    last_login: "",
    language: "en",
    role: "viewer",
    access: "",
  });

  // If admin is accessing other than own account info
  const fetchUserDetails = async (userId: string) => {
    try {
      const res = await getUserById(userId);
      setUserInfo(res);
    } catch (err) {
      alert("Error fetching user data: " + err);
    }
  };

  // When page is loaded, check if admin is browsing other user than self
  useEffect(() => {
    if (user && searchId && user.role === "admin" && searchId !== user.id) {
      fetchUserDetails(searchId);
    } else if (user) setUserInfo(user);
  }, []);

  useEffect(() => {
    if (userInfo.id !== "") {
      // Set existing access
      const accessList = userInfo.access?.split(",");
      setCheckedName(accessList);
    }
  }, [userInfo]);

  // Handle checkboxes for equipment access
  const [checkedName, setCheckedName] = useState<string[]>([""]);
  const handleToggleName = (value: string) => () => {
    const currentIndex = checkedName.indexOf(value);
    const newChecked = [...checkedName];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedName(newChecked);
    handleChangeAccess(newChecked);
  };

  // Handle list collapse
  const [sailboatsOpen, setSailboatsOpen] = useState<boolean>(false);
  const [motorboatsOpen, setMotorboatsOpen] = useState<boolean>(false);
  const [windsurfingOpen, setWindsurfingOpen] = useState<boolean>(false);

  const handleCollapseClick = (target: string) => {
    if (target === "sailboats") {
      if (sailboatsOpen) return setSailboatsOpen(false);
      setSailboatsOpen(true);
    }
    if (target === "motorboats") {
      if (motorboatsOpen) return setMotorboatsOpen(false);
      setMotorboatsOpen(true);
    }
    if (target === "windsurfing") {
      if (windsurfingOpen) return setWindsurfingOpen(false);
      setWindsurfingOpen(true);
    }
  };

  const handleChangeInfo = (event: any) => {
    const { name, value } = event.target;
    if (name === "language") setUserInfo({ ...userInfo, language: value });
    if (name === "name") setUserInfo({ ...userInfo, name: value });
    if (name === "role") setUserInfo({ ...userInfo, role: value });
  };

  const handleChangeAccess = async (accessList: string[]) => {
    setUserInfo({ ...userInfo, access: accessList.join(",") });
  };

  const handleClickSave = async () => {
    const { id, name, language, role, access } = userInfo;
    const newUserData: Partial<FMProfile> = {
      id,
      name,
      language,
      role,
      access,
    };
    const { message } = await updateUserProfile(newUserData);
    alert(message);
  };

  return (
    <React.Fragment>
      <Box id="account-info-header">
        <Box>{t("Account info")}</Box>
        <Box id="last-login-box">
          <SecondaryText text={`Last login: ${userInfo.last_login}`} />
        </Box>
      </Box>
      <Divider />
      <Box id="account-info-wrapper">
        <Box id="account-info-box">
          <TextField
            className="account-info-input"
            name="name"
            label={labels.name}
            value={userInfo?.name}
            onChange={handleChangeInfo}
          />

          <FormControl fullWidth className="account-info-input">
            <InputLabel id="role-select-label">{labels.language}</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select-input"
              value={userInfo?.language}
              label={labels.language}
              name="language"
              onChange={handleChangeInfo}
              disabled={user?.role === "admin" ? false : true}
            >
              <MenuItem value={"en"}>{t("English")}</MenuItem>
              <MenuItem value={"sv"}>{t("Svenska")}</MenuItem>
              <MenuItem value={"fi"}>{t("Suomi")}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth className="account-info-input">
            <InputLabel id="role-select-label">{labels.selectRole}</InputLabel>
            <Select
              name="role"
              labelId="role-select-label"
              id="role-select-input"
              value={userInfo?.role}
              label={labels.selectRole}
              onChange={handleChangeInfo}
              disabled={user?.role === "admin" ? false : true}
            >
              <MenuItem value={"admin"}>{t("Admin")}</MenuItem>
              <MenuItem value={"viewer"}>{t("Viewer")}</MenuItem>
              <MenuItem value={"user"}>{t("User")}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box id="account-info-box-2">
          <Box className="account-info-input">
            <DarkThemeHeader text={t("Access control")} />
            <Divider />
            <ListItemButton onClick={() => handleCollapseClick("sailboats")}>
              <ListItem disablePadding>
                <SailingIcon className="access-icon" />
                <ListItemText>{t("Sailboats")}</ListItemText>
                {sailboatsOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            </ListItemButton>
            <Collapse in={sailboatsOpen}>
              <Box className="access-checkbox-list">
                <>
                  {equipment?.map((type) => {
                    if (type.typeName === "Sailboat") {
                      return type.names.map((name: any, i: number) => {
                        return (
                          <ListItem
                            className="access-name-item"
                            disablePadding
                            key={name.name}
                          >
                            <ListItemButton
                              dense
                              onClick={handleToggleName(name.name)}
                              disableRipple
                            >
                              <Checkbox
                                tabIndex={-1}
                                checked={checkedName.indexOf(name.name) !== -1}
                              />
                              <Typography>{name.name}</Typography>
                            </ListItemButton>
                          </ListItem>
                        );
                      });
                    }
                    return [];
                  })}
                </>
              </Box>
            </Collapse>
            <ListItemButton onClick={() => handleCollapseClick("motorboats")}>
              <ListItem disablePadding>
                <DirectionsBoatFilledIcon className="access-icon" />
                <ListItemText>{t("Motorboats")}</ListItemText>
                {motorboatsOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            </ListItemButton>
            <Collapse in={motorboatsOpen}>
              <Box className="access-checkbox-list">
                <>
                  {equipment?.map((type) => {
                    if (type.typeName === "Motorboat") {
                      return type.names.map((name: any, i: number) => {
                        return (
                          <ListItem
                            className="access-name-item"
                            disablePadding
                            key={name.name}
                          >
                            <ListItemButton
                              role={undefined}
                              dense
                              onClick={handleToggleName(name.name)}
                            >
                              <Checkbox
                                checked={checkedName.indexOf(name.name) !== -1}
                              />
                              <Typography>{name.name}</Typography>
                            </ListItemButton>
                          </ListItem>
                        );
                      });
                    }
                    return [];
                  })}
                </>
              </Box>
            </Collapse>
            <ListItemButton onClick={() => handleCollapseClick("windsurfing")}>
              <ListItem disablePadding>
                <SurfingIcon className="access-icon" />
                <ListItemText>{t("Windsurfing")}</ListItemText>
                {windsurfingOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            </ListItemButton>
            <Collapse in={windsurfingOpen}>
              <Box className="access-checkbox-list">
                <>
                  {equipment?.map((type) => {
                    if (type.typeName === "Windsurfing") {
                      return type.names.map((name: any, i: number) => {
                        return (
                          <ListItem
                            className="access-name-item"
                            disablePadding
                            key={name.name}
                          >
                            <ListItemButton
                              role={undefined}
                              dense
                              onClick={handleToggleName(name.name)}
                            >
                              <Checkbox
                                checked={checkedName.indexOf(name.name) !== -1}
                              />
                              <Typography>{name.name}</Typography>
                            </ListItemButton>
                          </ListItem>
                        );
                      });
                    }
                    return [];
                  })}
                </>
              </Box>
            </Collapse>
          </Box>
          <FmButton2 id="account-save-button" onClick={handleClickSave}>
            {t("save")}
          </FmButton2>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default AccountInfoComponent;
