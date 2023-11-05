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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../../UserContext";
import { FMProfile, UserRole } from "../../interfaces";
import { getUserById } from "../../service/user.service";
import React from "react";
import { useTranslation } from "react-i18next";
import "./account.css";
import i18next from "i18next";
import { DarkThemeHeader, SecondaryText } from "../../utils/custom-elements";
import SailingIcon from "@mui/icons-material/Sailing";
import DirectionsBoatFilledIcon from "@mui/icons-material/DirectionsBoatFilled";
import SurfingIcon from "@mui/icons-material/Surfing";
import { useEquipment } from "../../EquipmentContext";

const AccountInfoComponent = () => {
  const [searchParams] = useSearchParams();
  const userId: string | null = searchParams.get("id");
  const { t } = useTranslation();
  const { user } = useUser();
  const { equipment } = useEquipment();

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
  });

  const fetchUserDetails = async (id: string) => {
    try {
      const res = await getUserById(id);
      setUserInfo(res);
    } catch (err) {
      alert("Error fetching user data: " + err);
    }
  };

  useEffect(() => {
    if (user) {
      setUserInfo(user);
    }
    if (equipment) {
      equipment.map((type) => {
        // console.log(type.names);
        type.names.map((name: any) => {
          // console.log(name.name);
        });
      });
    }
  }, []);

  const handleChangeInfo = (event: any) => {
    const { name, value } = event.target;
    if (name === "language") setUserInfo({ ...userInfo, language: value });
    if (name === "name") setUserInfo({ ...userInfo, name: value });
    if (name === "role") setUserInfo({ ...userInfo, role: value });
  };

  const [checkedType, setCheckedType] = useState<string[]>([""]);
  const handleToggleType = (value: string) => () => {
    const currentIndex = checkedType.indexOf(value);
    const newChecked = [...checkedType];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedType(newChecked);
  };

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
  };

  const [checkedAllNames, setCheckedAllNames] = useState<string[]>([""]);
  const handleToggleAllNames = (value: string) => () => {
    const currentIndex = checkedAllNames.indexOf(value);
    const newChecked = [...checkedAllNames];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedAllNames(newChecked);
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
            <ListItem disablePadding>
              <SailingIcon className="access-icon" />
              <ListItemText>{t("Sailboats")}</ListItemText>
              <Switch
                edge="start"
                checked={checkedType.indexOf("Sailboat") !== -1}
                onChange={handleToggleType("Sailboat")}
              />
            </ListItem>
            {checkedType.indexOf("Sailboat") !== -1 && (
              <Box className="access-checkbox-list">
                <>
                  <ListItemButton
                    dense
                    onClick={handleToggleAllNames("Sailboat")}
                    key={"Sailboat"}
                  >
                    <ListItem disablePadding>
                      <Checkbox
                        edge="start"
                        checked={checkedAllNames.indexOf("Sailboat") !== -1}
                      />
                      <Typography>{t("All")}</Typography>
                    </ListItem>
                  </ListItemButton>
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
                                checked={
                                  checkedName.indexOf(name.name) !== -1 ||
                                  checkedAllNames.indexOf(type.typeName) !== -1
                                }
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
            )}
            <ListItem disablePadding>
              <DirectionsBoatFilledIcon className="access-icon" />
              <ListItemText>{t("Motorboats")}</ListItemText>
              <Switch
                edge="start"
                checked={checkedType.indexOf("Motorboat") !== -1}
                onChange={handleToggleType("Motorboat")}
              />
            </ListItem>
            {checkedType.includes("Motorboat") && (
              <Box className="access-checkbox-list">
                <>
                  <ListItemButton
                    dense
                    role={undefined}
                    onClick={handleToggleAllNames("Motorboat")}
                    key={"Motorboat"}
                  >
                    <ListItem disablePadding>
                      <Checkbox
                        edge="start"
                        checked={checkedAllNames.indexOf("Motorboat") !== -1}
                      />
                      <Typography>{t("All")}</Typography>
                    </ListItem>
                  </ListItemButton>
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
                                checked={
                                  checkedName.indexOf(name.name) !== -1 ||
                                  checkedAllNames.indexOf(type.typeName) !== -1
                                }
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
            )}
            <ListItem disablePadding>
              <SurfingIcon className="access-icon" />
              <ListItemText>{t("Windsurfing")}</ListItemText>
              <Switch edge="start" />
            </ListItem>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default AccountInfoComponent;
