import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Slide,
  Alert,
  AlertProps,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../../UserContext";
import { FMProfile } from "../../interfaces";
import { updateUserProfile } from "../../service/user.service";
import React from "react";
import { useTranslation } from "react-i18next";
import "./account.css";
import i18next from "i18next";
import { useEquipment } from "../../EquipmentContext";
import { SecondaryText } from "../../utils/custom-elements";

const AccountInfoComponent = () => {
  const { t } = useTranslation();
  const { user, setUser } = useUser();
  const { equipment } = useEquipment();

  const labels = {
    name: i18next.t("Name"),
    language: i18next.t("Preferred language"),
  };
  const [userInfo, setUserInfo] = useState<Partial<FMProfile>>({
    id: "",
    name: "",
    language: "en",
  });

  // When page is loaded, check if admin is browsing other user than self
  useEffect(() => {
    if (user) setUserInfo(user);
  }, []);

  const handleChangeInfo = (event: any) => {
    const { name, value } = event.target;
    handleSaveUser({ key: name, value });
  };

  const handleSaveUser = async (prop: { key: string; value: any }) => {
    const { key, value } = prop;
    const { id } = userInfo;
    const newUserData: Partial<FMProfile> = {
      id,
      [key]: value,
    };
    try {
      const { message } = await updateUserProfile(newUserData);
      setAlertProps({ severity: "success", message });
      setAlertVisible(true);
      setUserInfo({ ...userInfo, [key]: value });
    } catch (error) {
      if (error instanceof Error) {
        setAlertProps({ severity: "error", message: error.message });
        setAlertVisible(true);
      } else {
        setAlertProps({
          severity: "error",
          message: "An unknown error occurred",
        });
        setAlertVisible(true);
      }
    }
  };

  return (
    <React.Fragment>
      <Box id="account-info-wrapper">
        <Box id="account-info-header">
          <Box>{t("Account info")}</Box>
          <Box id="last-login-box">
            <SecondaryText text={`Last login: ${userInfo.last_login}`} />
          </Box>
        </Box>
        <Divider />
        <Box id="account-info-box">
          <TextField
            className="account-info-input"
            name="name"
            label={labels.name}
            value={userInfo?.name}
            onBlur={handleChangeInfo}
            onChange={(e) => {
              setTimeout(() => {
                handleChangeInfo(e);
              }, 5000);
            }}
          />

          <FormControl fullWidth className="account-info-input">
            <InputLabel id="language-select-label">
              {labels.language}
            </InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select-input"
              value={userInfo?.language}
              label={labels.language}
              name="language"
              onChange={handleChangeInfo}
            >
              <MenuItem value={"en"}>{t("English")}</MenuItem>
              <MenuItem value={"sv"}>{t("Svenska")}</MenuItem>
              <MenuItem value={"fi"}>{t("Suomi")}</MenuItem>
            </Select>
          </FormControl>
          {/* <FmButton2 id="account-save-button" onClick={handleClickSave}>
            {t("save")}
          </FmButton2> */}
        </Box>
        <Box id="account-info-box-2">USER ACCESS DATA</Box>
      </Box>
    </React.Fragment>
  );
};

export default AccountInfoComponent;
