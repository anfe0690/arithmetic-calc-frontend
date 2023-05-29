import { useState } from "react";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";

import Header from "../common/Header"
import PageMessage from "../common/PageMessage";

import './PerformOperation.css'

export default function PerformOperation() {
  const [loggedIn, setLoggedIn] = useState(Cookies.get('user'));
  const [pageMessage, setPageMessage] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(JSON.parse(Cookies.get('user')).balance);

  function handlePerformOperation(e) {
    e.preventDefault();
  }

  return (
    <>
      <Helmet>
        <title>Perform Operation - Arithmetic Calculator</title>
      </Helmet>
      <Header setPageMessage={setPageMessage} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      <div className="container">
        <PageMessage pageMessage={pageMessage} setPageMessage={setPageMessage} />
        <div className="row">
          <h1>Perform Operation</h1>
        </div>

        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="card">
              <div className="card-header">Perform Operation</div>
              <form onSubmit={handlePerformOperation} className="card-body">

                <div className="mb-3">
                  <label htmlFor="current-balance" className="form-label">Current Balance</label>
                  <input id="current-balance" className="form-control" type="text" readOnly value={currentBalance}></input>
                </div>

                <div className="mb-3">
                  <label htmlFor="operation" className="form-label">Operation</label>
                  <select id="operation" class="form-select">
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="cost" className="form-label">Cost</label>
                  <input id="cost" className="form-control" type="text" readOnly></input>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
