import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Logo } from '../components/Logo'
import '../styles/Header.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast';

export const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const pages = [
    { name: 'Inicio', path: '/' },
    { name: 'Contacto', path: '/contact' },
    { name: 'Uso de información', path: '/data-usage' },
    ...(
      isLoggedIn
      ? [
        { name: 'Mi cuenta', path: '/user' },
        { name: 'Cerrar sesión', action: 'logout' }
      ]
      : [
        { name: 'Iniciar sesión', path: '/login' }
      ]
    )
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    logout();
    toast.success("🌊Se ha cerrado la sesión correctamente🌊");
    navigate("/");
  }

  return (
    <AppBar position='static' sx={{ backgroundColor: '#1447e6' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link to='/'>
            <Logo/>
          </Link>
          <Box sx={{display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              page.action === "logout" ? (
                <Button
                  key={page.name}
                  onClick={() => {handleCloseNavMenu(); handleLogout();}}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
              ) : (
                <Button
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  component={Link}
                  to={page.path}
                >
                  {page.name}
                </Button>
              )
            ))}
          </Box>
          <Box sx={{display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                page.action === "logout" ? (
                  <MenuItem key={page.name} onClick={() => {handleCloseNavMenu(); handleLogout();}}>
                    <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu} component={Link} to={page.path}>
                    <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
                  </MenuItem>
                )
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
