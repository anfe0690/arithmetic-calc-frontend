import { useState } from 'react';

import Header from './common/Header.js'
import Login from './common/Login';
import Home from './common/Home';


export default function Root() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('user') != null);
  return (
    <>
      <Header/>
      <div className="container">
        <div className="row">
          {loggedIn ? (<Home/>) : (<Login setLoggedIn={setLoggedIn}/>) }
        </div>
      </div>
    </>
  );
};
