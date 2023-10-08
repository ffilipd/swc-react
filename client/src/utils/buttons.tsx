import { styled } from "@mui/material/styles";
import { Button, ButtonProps } from "@mui/material";

export const SwcButton = styled(Button)<ButtonProps>(({ theme }) => ({
  variant: "outlined",
  border: "none",
  color: "#fff",
  padding: "16px",
  borderRadius: "0",
  "&.Mui-focused": {
    border: "none",
  },
  "&:hover": {
    border: "none",
  },
  ".MuiSvgIcon-root ": {
    fill: "#fff",
  },
}));
