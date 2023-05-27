import {React, useState} from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import { UserContext } from './UserContext';
import App from './App';
import ErrorPage from './ErrorPage';
import RequestOperation from './request-operation/RequestOperation';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>
  },
  {
    path: "/request-operation",
    element: <RequestOperation/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
const [user, setUser] = useState(null);

root.render(
  <React.StrictMode>
    <UserContext.Provider value={{ user: user, setUser: setUser }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  </React.StrictMode>
);
