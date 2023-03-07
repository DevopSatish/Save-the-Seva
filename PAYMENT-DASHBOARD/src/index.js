import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

import './index.css';
import HomePage from './pages/home';
import SignInPage from "./pages/signin";
import FeedbackPage from "./pages/feedback";

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = createTheme({
  typography: {
    fontFamily: 'Lexend Deca'
  },
  palette: {
    type: 'light',
    primary: {
      main: '#673ab7',
      dark: '#512DA8',
      light: '#d1c4e9',
    },
    secondary: {
      main: '#ff5722',
    },
  }
});


root.render(
  <BrowserRouter>
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <CssBaseline enableColorScheme />
      <ThemeProvider theme={theme}>
        <Routes>
          <Route exa path="/" element={<SignInPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </ThemeProvider>
    </QueryParamProvider>
  </BrowserRouter>
);
