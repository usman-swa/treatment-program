import { Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ProfileDropdown: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    navigate(`${path}?email=${encodeURIComponent(email || '')}`);
    handleMenuClose();
  };

  return (
    <>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="inherit"
        sx={{
          backgroundColor: 'rgb(93, 175, 116)',
          color: 'white',
          marginLeft: '20px',
          '&:hover': {
            backgroundColor: 'rgb(83, 165, 106)',
          },
        }}
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleNavigate('/profile')}>
          <Typography>{t('Profile')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/settings')}>
          <Typography>{t('Settings')}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Typography>{t('Logout')}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileDropdown;