import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@styles/global.scss';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeContextProvider from '@contexts/ThemeContext.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
