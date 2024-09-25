// src/LanguageSwitcher.tsx

import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SpainFlag from "../assets/flags/es.png";
import USFlag from "../assets/flags/us.png";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";

// Import flag icons (You can use flag icon libraries or images)

const FlagIcon = styled("img")({
  width: "24px",
  height: "24px",
  marginRight: "8px",
});

/**
 * LanguageSwitcher component allows users to switch the application's language.
 * It uses the `useTranslation` hook from `react-i18next` to change the language.
 *
 * @component
 *
 * @example
 * return (
 *   <LanguageSwitcher />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * This component uses Material-UI's `Button` and `Menu` components to display a dropdown menu
 * for language selection. It also uses custom `FlagIcon` components to display flags next to
 * the language options.
 *
 * @function
 * @name LanguageSwitcher
 */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          backgroundColor: 'rgb(93, 175, 116)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgb(83, 165, 106)',
          },
        }}
      >
        <FlagIcon src={i18n.language === "es" ? SpainFlag : USFlag} alt="flag" />
        <Typography variant="body1">
          {i18n.language === "es" ? "Español" : "English"}
        </Typography>
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => changeLanguage("en")}>
          <FlagIcon src={USFlag} alt="US Flag" />
          <Typography variant="body1">English</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => changeLanguage("es")}>
          <FlagIcon src={SpainFlag} alt="Spain Flag" />
          <Typography variant="body1">Español</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
