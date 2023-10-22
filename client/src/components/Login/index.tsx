import { GoogleLogin } from "@react-oauth/google";
import i18n from "../../i18next";
const Login = () => {
  return (
    <GoogleLogin
      locale={i18n.language}
      theme="outline"
      onSuccess={(res) => console.log(res)}
      onError={() => console.log("Login failed")}
    />
  );
};

export default Login;
