import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Root from './Root';
import ErrorPage from './ErrorPage';
import RequestOperation from './request-operation/RequestOperation';


axios.defaults.baseURL = 'http://localhost:8080/'
axios.defaults.withCredentials = true

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/request-operation",
    loader: async () => {
      if (!Cookies.get('user')) {
        return redirect('/');
      }
      return null;
    },
    element: <RequestOperation/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
