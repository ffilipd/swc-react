import { Box, TextField, Typography } from "@mui/material";
import "./signup.css";
import { SwcButton2 } from "../../utils/buttons";
import { GoogleSvgIcon } from "../../utils/svg-components";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { NewUser } from "../../interfaces";
import { signUp } from "../../service/user.service";

const SignupComponent = () => {
  const { t } = useTranslation();
  const { googleLogin } = useUser();

  const [newUser, setNewUser] = useState<NewUser>({
    name: "test",
    email: "testuser@test.com",
    password: "12345",
  });

  const [password2, setPassword2] = useState<string>("12345");
  const [formFilled, setFormFilled] = useState<boolean>(false);

  const checkForm = (password: string) => {
    setPassword2(password);
    if (
      password === newUser.password &&
      newUser.name !== "" &&
      newUser.email !== "" &&
      newUser.password !== ""
    ) {
      return setFormFilled(true);
    }
    setFormFilled(false);
  };

  const signup = async () => {
    const user = await signUp(newUser);
    console.log(user);
  };
  return (
    <Box id="signup-root">
      <Box id="signup-wrapper">
        <Box id="signup-container">
          <TextField
            variant="outlined"
            value={newUser.name}
            label={t("*Name")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewUser({ ...newUser, name: event.target.value });
            }}
          />
          <TextField
            variant="outlined"
            value={newUser.email}
            label={t("*Eamil")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewUser({ ...newUser, email: event.target.value });
            }}
          />
          <TextField
            variant="outlined"
            type="password"
            value={newUser.password}
            label={t("*Password")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewUser({ ...newUser, password: event.target.value });
            }}
          />
          <TextField
            variant="outlined"
            type="password"
            value={password2}
            label={t("*Confirm Password")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              checkForm(event.target.value);
            }}
          />
          <SwcButton2
            id="signup-button"
            // disabled={!formFilled}
            onClick={signup}
          >
            {t("Sign Up")}
          </SwcButton2>
          <Typography sx={{ textAlign: "center" }}>{t("or")}</Typography>
          <SwcButton2 onClick={() => googleLogin()}>
            <GoogleSvgIcon />
            <Box id="login-button-text">{t("Sign up with google")}</Box>
          </SwcButton2>
        </Box>
      </Box>
    </Box>
  );
};
export default SignupComponent;
