import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { SwcButton } from "../../utils/buttons";
import { useEffect, useState } from "react";
import { ExpandMore, ExpandLess, Key } from "@mui/icons-material";
import { Languages } from "../../interfaces";
import React from "react";

interface MobileDrawerProps {
  isOpen: boolean;
  languages: Languages;
  toggleDrawer: (open: boolean) => (event: any) => void;
  handleMenuItemClick: (event: any) => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = (props) => {
  const { languages, isOpen, toggleDrawer, handleMenuItemClick } = props;
  const [openLanguageCollapse, setOpenLanguageCollapse] =
    useState<boolean>(false);

  const handleExpandLanguageCollapse = () => {
    if (openLanguageCollapse) setOpenLanguageCollapse(false);
    else setOpenLanguageCollapse(true);
  };

  useEffect(() => {
    if (openLanguageCollapse) setOpenLanguageCollapse(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleDrawer]);

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
          {["Home", "Report", "Book equipment", "Account", "Language"].map(
            (text, index) => (
              <React.Fragment key={`${text}-${index}`}>
                <ListItem>
                  <ListItemButton
                    onClick={
                      text === "Language"
                        ? handleExpandLanguageCollapse
                        : () => handleMenuItemClick(text)
                    }
                  >
                    <ListItemText primary={text} />
                    {text === "Language" &&
                      (openLanguageCollapse ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </ListItem>
                {text === "Language" && (
                  <Collapse
                    id="language-collapse"
                    in={openLanguageCollapse}
                    timeout="auto"
                    unmountOnExit
                    orientation="vertical"
                  >
                    <List disablePadding>
                      {Object.entries(languages).map((lang) => (
                        <ListItemButton key={lang[0]} sx={{ pl: 4 }}>
                          <ListItemText>{lang[1]}</ListItemText>
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            )
          )}
        </List>
      </Drawer>
    </>
  );
};

export default MobileDrawer;
