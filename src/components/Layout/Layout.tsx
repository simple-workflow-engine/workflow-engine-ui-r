import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { type FC, type ReactNode } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  return (
    <Stack
      component={'div'}
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: '100vh',
      }}
    >
      <AppBar color="transparent" position="static" elevation={2}>
        <Toolbar>
          <Link to={'/'}>
            <Tooltip title="Workflow Engine">
              <Typography variant="h6" component="div">
                WF-Engine
              </Typography>
            </Tooltip>
          </Link>
          <span
            style={{
              flex: 1,
              width: '100%',
            }}
          ></span>
          <Stack direction={'row'} justifyContent={'flex-end'} alignItems={'center'} columnGap={1}>
            <Link to={'/workflows'}>
              <Button>Workflows</Button>
            </Link>
            <LoadingButton
              loading={isLoading}
              variant="contained"
              color="primary"
              onClick={() => {
                if (isAuthenticated) {
                  logout({ logoutParams: { returnTo: window.location.origin } });
                } else {
                  loginWithRedirect();
                }
              }}
            >
              {isAuthenticated ? [user?.given_name, 'Logout'].join(', ') : 'Login'}
            </LoadingButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          width: '100%',
          overflowY: 'auto',
        }}
        component={'main'}
      >
        <Container maxWidth="xl">{children}</Container>
      </Box>

      <Box
        component={'footer'}
        sx={{
          width: '100%',
        }}
      >
        <Typography>Footer</Typography>
      </Box>
    </Stack>
  );
};

export default Layout;
