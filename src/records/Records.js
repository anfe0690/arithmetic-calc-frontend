import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Header from "../common/Header"
import PageMessage from "../common/PageMessage";

export default function Records() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(true);
  const [pageMessage, setPageMessage] = useState(null);
  const [records, setRecords] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);

  const recordsHtml = records.map(r => (
    <tr key={r.id}>
      <td>{r.type}</td>
      <td>{r.amount}</td>
      <td>{r.balance}</td>
      <td>{r.result}</td>
      <td>{r.date}</td>
    </tr>
  ))

  const pagesIndexes = Array.from(Array(pageNumber+1).keys());
  const pagesButtons = pagesIndexes.map(i => <li key={i} className={i === pageNumber ? "page-item active" : "page-item"}>
      <button className="page-link" data-page={i} onClick={e => setPageNumber(parseInt(e.target.dataset.page))}>{i+1}</button>
    </li> );

  useEffect(() => {
    console.log('Loading records');
    let ignore = false;
    axios.get('records', {
        params: {
          recordsPerPage: recordsPerPage,
          page: pageNumber
        }
      })
      .then(function (response){
        if (!ignore) {
          console.log(response.data);
          setRecords(response.data);
        }
      })
      .catch(function (error){
        if (!ignore) {
          let errorMessage = 'Error getting operations: ' + error.message
          if (error.response) {
            console.log(error.response);

            if (error.response.status === 401) {
              console.log('Error with session. Redirecting to root.');
              Cookies.remove('user');
              navigate('/');
            }
            else if (error.response.data && error.response.data.error) {
              errorMessage += ' - ' + error.response.data.error
            }
            else {
              errorMessage += ' - ' + error.response.data
            }
          }

          console.log(errorMessage)
          setPageMessage({ message: errorMessage, type: 'failure' })
        }
      });
    return () => {
      ignore = true;
    };
  }, [recordsPerPage, pageNumber, navigate]);

  function filterNonNumberCharacters(e) {
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }

  return (
    <>
      <Helmet>
        <title>Records - Arithmetic Calculator</title>
      </Helmet>
      <Header setPageMessage={setPageMessage} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      <div className="container perform-operation">
        <PageMessage pageMessage={pageMessage} setPageMessage={setPageMessage} />
        <div className="row">
          <h1>Records</h1>
        </div>

        <div className="row mb-3">
          <div className="col-auto">
            <label for="records-per-page" className="col-form-label">Records per page</label>
          </div>
          <div className="col-auto">
            <input id="records-per-page" className="form-control" type="number" onKeyDown={filterNonNumberCharacters}
                onChange={e => setRecordsPerPage(e.target.value)} value={recordsPerPage}></input>
          </div>
        </div>

        <div className="row">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">Operation</th>
                <th scope="col">Amount</th>
                <th scope="col">Balance</th>
                <th scope="col">Result</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>{recordsHtml}</tbody>
          </table>
        </div>

        <div className="row">
          <nav>
            <ul className="pagination justify-content-center">
              <li className={pageNumber === 0 ? "page-item disabled": "page-item"}><button className="page-link"
                  onClick={() => setPageNumber(n => n - 1)}>Previous</button></li>
              {pagesButtons}
              <li className={records.length < recordsPerPage ? "page-item disabled": "page-item"}><button className="page-link"
                  onClick={() => setPageNumber(n => n + 1)}>Next</button></li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
