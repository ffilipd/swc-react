import { styled } from "@mui/material/styles";
import { Button, ButtonProps } from "@mui/material";

export const SwcButton = styled(Button)<ButtonProps>(({ theme }) => ({
  variant: "outlined",
  border: "none",
  color: "#fff",
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
