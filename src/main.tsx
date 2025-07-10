import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import App from './App.tsx';
import Store from './api/store/store.ts';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <Toaster position='top-center' reverseOrder={false} gutter={8} />
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
