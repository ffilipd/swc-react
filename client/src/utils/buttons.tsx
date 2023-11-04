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

export const SwcButton2 = styled(Button)<ButtonProps>(({ theme }) => ({
  variant: "outlined",
  border: "none",
  backgroundColor: "#002855",
  color: "#fff",
  padding: "16px",
  borderRadius: "8px",
  height: "46px",
  "&.Mui-focused": {
    border: "none",
  },
  "&:hover": {
    backgroundColor: "#003865",
    border: "none",
  },
  ".MuiSvgIcon-root ": {
    fill: "#fff",
  },
}));
