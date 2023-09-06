import { Auth0Provider } from '@auth0/auth0-react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from '@pages/home/page';
import Layout from '@components/Layout/Layout';
import { Suspense, lazy } from 'react';
import PageLoader from '@components/common/Loader/PageLoader';
import NotFoundPage from './pages/404/page';

const WorkflowListPage = lazy(() => import('@pages/workflow-list/page'));
const WorkflowCreatePage = lazy(() => import('@pages/create/page'));
const WorkflowEditPage = lazy(() => import('@pages/edit/page'));
const WorkflowDetailPage = lazy(() => import('@pages/detail/page'));
const RuntimeDetailPage = lazy(() => import('@pages/runtime-detail/page'));

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
      <Layout>
        <Routes>
          <Route path="/" index element={<HomePage />} />
          <Route
            path="/workflows"
            element={
              <Suspense fallback={<PageLoader />}>
                <WorkflowListPage />
              </Suspense>
            }
          />
          <Route
            path="/create"
            element={
              <Suspense fallback={<PageLoader />}>
                <WorkflowCreatePage />
              </Suspense>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <WorkflowEditPage />
              </Suspense>
            }
          />
          <Route
            path="/workflows/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <WorkflowDetailPage />
              </Suspense>
            }
          />
          <Route
            path="/runtime/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <RuntimeDetailPage />
              </Suspense>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Auth0Provider>
  );
};

export default App;
