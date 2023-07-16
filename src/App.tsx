import { Auth0Provider } from '@auth0/auth0-react';
import { ThemeProvider } from '@mui/material/styles';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { theme } from '@lib/theme/theme';
import HomePage from './pages/home/page';
import Layout from './components/Layout/Layout';
import { Suspense, lazy } from 'react';

const WorkflowListPage = lazy(() => import('./pages/workflow-list/page'));

const App = () => {
  const navigation = useNavigate();

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'openid profile email offline_access',
      }}
      onRedirectCallback={(appState) => {
        const redirectURL = appState?.returnTo || window.location.pathname;
        navigation(redirectURL);
      }}
    >
      <ThemeProvider theme={theme}>
        <Layout>
          <Routes>
            <Route path="/" index element={<HomePage />} />
            <Route
              path="/workflows"
              element={
                <Suspense fallback={<p>Loading...</p>}>
                  <WorkflowListPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Link to="/">No page found, Go to home</Link>} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Auth0Provider>
  );
};

export default App;
