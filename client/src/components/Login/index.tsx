import { Box } from "@mui/material";
import "./login.css";
import { SwcButton2 } from "../../utils/buttons";
import { GoogleSvgIcon } from "../../utils/svg-components";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LoginComponent = () => {
  const { t } = useTranslation();
  const { login } = useUser();
  return (
    <Box id="login-root">
      <Box id="login-wrapper">
        <Box id="login-container">
          <SwcButton2 onClick={() => login()}>
            <GoogleSvgIcon />
            <Box id="login-button-text">{t("Sign in with google")}</Box>
          </SwcButton2>
        </Box>
      </Box>
    </Box>
  );
};
export default LoginComponent;
