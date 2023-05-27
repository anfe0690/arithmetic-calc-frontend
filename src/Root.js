import { useState } from 'react';
import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';

import Header from './common/Header.js'
import Login from './common/Login';
import Home from './common/Home';
import PageMessage from './common/PageMessage.js';


export default function Root() {
  const [loggedIn, setLoggedIn] = useState(Cookies.get('user'));
  const [pageMessage, setPageMessage] = useState(null);

  return (
    <>
      <Helmet>
        <title>Arithmetic Calculator</title>
      </Helmet>
      <Header setPageMessage={setPageMessage} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      <div className="container">
        <PageMessage pageMessage={pageMessage} setPageMessage={setPageMessage} />
        <div className="row">
          {loggedIn ? (<Home/>) : (<Login setPageMessage={setPageMessage} setLoggedIn={setLoggedIn}/>) }
        </div>
      </div>
    </>
  );
};
