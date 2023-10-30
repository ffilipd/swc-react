import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <Box id="footer-wrapper">
      <Box id="footer-content">&copy; {t("Filip Dahlskog 2023")}</Box>
    </Box>
  );
};

export default Footer;
