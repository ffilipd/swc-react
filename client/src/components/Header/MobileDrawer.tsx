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
import { ExpandMore, ExpandLess, Key, Language } from "@mui/icons-material";
import { Languages } from "../../interfaces";
import React from "react";
import { useTranslation } from "react-i18next";

interface MobileDrawerProps {
  isOpen: boolean;
  language: string;
  languages: Languages;
  updateLanguage: (newLanguage: string) => void;
  toggleDrawer: (open: boolean) => (event: any) => void;
  handleMenuItemClick: (event: any) => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = (props) => {
  const {
    language,
    languages,
    updateLanguage,
    isOpen,
    toggleDrawer,
    handleMenuItemClick,
  } = props;
  const { t } = useTranslation();
  const menuItems = [
    t("Home"),
    t("Report"),
    t("Book equipment"),
    t("Account details"),
  ];

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
      <SwcButton onClick={toggleDrawer(true)}>{t("Menu")}</SwcButton>
      <Drawer
        id="drawer"
        transitionDuration={500}
        anchor="top"
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        <List>
          {menuItems.map((text, index) => (
            <ListItem key={`${text}-${index}`}>
              <ListItemButton onClick={() => handleMenuItemClick(text)}>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem>
            <ListItemButton onClick={handleExpandLanguageCollapse}>
              <ListItemText primary={languages[language as keyof Languages]} />
              {openLanguageCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse
            id="language-collapse"
            in={openLanguageCollapse}
            timeout="auto"
            unmountOnExit
          >
            <List disablePadding>
              {Object.entries(languages).map((lang) => (
                <ListItemButton
                  key={lang[0]}
                  sx={{ pl: 4 }}
                  onClick={() => updateLanguage(lang[0])}
                >
                  <ListItemText>{lang[1]}</ListItemText>
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
};

export default MobileDrawer;
