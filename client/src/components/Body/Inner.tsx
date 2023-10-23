import { Box } from "@mui/material";

interface InnerProps {
  children: React.ReactNode;
}

const Inner: React.FC<InnerProps> = ({ children }) => {
  return <Box id="body-inner">{children}</Box>;
};

export default Inner;
