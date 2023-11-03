import { Box, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../../UserContext";
import { FMProfile } from "../../interfaces";
import { getUserById } from "../../service/user.service";
import React from "react";
import { useTranslation } from "react-i18next";
import "./account.css";

const AccountInfoComponent = () => {
  const [searchParams] = useSearchParams();
  const userId: string | null = searchParams.get("id");
  const { t } = useTranslation();
  const { user } = useUser();

  const [userInfo, setUserInfo] = useState<FMProfile>();

  const fetchUserDetails = async () => {
    if (userId && userId !== user?.id) {
      try {
        const res = await getUserById(userId);
        setUserInfo(res);
      } catch (err) {
        alert("Error fetching user data: " + err);
      }
      return;
    }
    if (user) setUserInfo(user);
  };

  useEffect(() => {
    if (user?.role === "admin") {
      // if (user?.role === "admin" && userId !== user.id) {
      fetchUserDetails();
    }
  }, [userId]);
  return (
    <React.Fragment>
      <Box id="account-info-header">{t("Account info")}</Box>
      <Divider />
      <Box id="account-info-wrapper">
        {userInfo?.name}
        <br />
        {userInfo?.email}
      </Box>
    </React.Fragment>
  );
};

export default AccountInfoComponent;
