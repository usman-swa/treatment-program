// src/LanguageSwitcher.js

import { Button, IconButton, Menu, MenuItem } from "@mui/material";
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
    <div>
      <Button
        variant="outlined"
        startIcon={<ArrowDropDownIcon />}
        onClick={handleClick}
        sx={{ borderRadius: "none", textTransform: "none", backgroundColor: "rgb(93, 175, 116)", color: "white" }}
      >
        Select Language
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        <MenuItem onClick={() => changeLanguage("en")}>
          <FlagIcon src={USFlag} alt="English" />
          English
        </MenuItem>
        <MenuItem onClick={() => changeLanguage("es")}>
          <FlagIcon src={SpainFlag} alt="Español" />
          Español
        </MenuItem>
        {/* Add more language options if needed */}
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
