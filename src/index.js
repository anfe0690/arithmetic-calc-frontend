import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css"

import Root from './Root';
import ErrorPage from './ErrorPage';
import PerformOperation from './perform-operation/PerformOperation';
import Records from './records/Records';


axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HOST + '/v1/'
axios.defaults.withCredentials = true

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/perform-operation",
    loader: async () => {
      if (!Cookies.get('user')) {
        console.log('There is not session. Redirecting to root.')
        return redirect('/');
      }
      return null;
    },
    element: <PerformOperation/>
  },
  {
    path: "/records",
    loader: async () => {
      if (!Cookies.get('user')) {
        console.log('There is not session. Redirecting to root.')
        return redirect('/');
      }
      return null;
    },
    element: <Records/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
