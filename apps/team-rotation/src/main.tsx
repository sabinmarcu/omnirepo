/* eslint-disable unicorn/filename-case */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import 'dayjs/locale/ro';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
