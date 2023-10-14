import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { SwcButton } from "../../utils/buttons";
import { useState } from "react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

interface MobileDrawerProps {
  isOpen: boolean;
  languages: string[];
  toggleDrawer: (open: boolean) => (event: any) => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = (props) => {
  const { languages, isOpen, toggleDrawer } = props;
  const [openLanguageCollapse, setOpenLanguageCollapse] =
    useState<boolean>(false);

  const handleExpandLanguageCollapse = () => {
    if (openLanguageCollapse) setOpenLanguageCollapse(false);
    else setOpenLanguageCollapse(true);
  };
  return (
    <>
      <SwcButton onClick={toggleDrawer(true)}>Menu</SwcButton>
      <Drawer
        id="drawer"
        transitionDuration={500}
        anchor="top"
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        <List>
          {["Report", "Book equipment", "Account", "Language"].map(
            (text, index) => (
              <>
                <ListItemButton
                  onClick={
                    text === "Language"
                      ? handleExpandLanguageCollapse
                      : undefined
                  }
                >
                  <ListItemText primary={text} />
                  {text === "Language" &&
                    (openLanguageCollapse ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                {text === "Language" && (
                  <Collapse
                    id="language-collapse"
                    in={openLanguageCollapse}
                    timeout="auto"
                    unmountOnExit
                    orientation="vertical"
                  >
                    <List disablePadding>
                      {languages.map((lang) => (
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText>{lang}</ListItemText>
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </>
            )
          )}
        </List>
      </Drawer>
    </>
  );
};

export default MobileDrawer;
