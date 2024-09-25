import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import LanguageSwitcher from "./LanguageSwitcher"; // Adjust the import path
import ProfileDropdown from "./ProfileDropdown"; // Adjust the import path
import React from "react";
import { t } from "i18next";

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#6919d2" }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {location.pathname !== "/Calendar" && (
            <Button color="inherit" onClick={handleHomeClick}>
              Home
            </Button>
          )}
        </Box>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          {t("CalendarTitle")}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
          <LanguageSwitcher />
          <ProfileDropdown />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
