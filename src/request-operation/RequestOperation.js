import { useState } from "react";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";

import Header from "../common/Header"
import PageMessage from "../common/PageMessage";

export default function RequestOperation() {
  const [loggedIn, setLoggedIn] = useState(Cookies.get('user'));
  const [pageMessage, setPageMessage] = useState(null);

  return (
    <>
      <Helmet>
        <title>Request Operation - Arithmetic Calculator</title>
      </Helmet>
      <Header setPageMessage={setPageMessage} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      <div className="container">
        <PageMessage pageMessage={pageMessage} setPageMessage={setPageMessage} />
        <div className="row">
          <h1>Request Operation</h1>
        </div>
      </div>
    </>
  )
}
