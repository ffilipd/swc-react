import { Typography } from "@mui/material";

type styledTypographyType = {
  text: string | null;
  wrap?: boolean;
};

export const DarkThemeHeader = ({ text }: styledTypographyType) => {
  return (
    <Typography
      sx={{
        color: "var(--color-theme-dark)",
        fontSize: "var(--font-size-text-s)",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </Typography>
  );
};
export const SecondaryText = ({ text, wrap }: styledTypographyType) => {
  return (
    <Typography
      sx={{
        color: "var(--color-secondary-gray)",
        fontSize: "var(--font-size-text-s)",
        whiteSpace: wrap ? "" : "nowrap",
      }}
    >
      {text}
    </Typography>
  );
};

export const SmallText: React.FC<any> = ({ children }) => {
  return (
    <Typography
      sx={{
        color: "var(--color-secondary-gray)",
        fontSize: "var(--font-size-text-xs)",
      }}
    >
      {children}
    </Typography>
  );
};
