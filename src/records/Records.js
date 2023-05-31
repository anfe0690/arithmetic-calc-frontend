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
  const [sortBy, setSortBy] = useState([]);

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
      <button className="page-link" data-page={i} onClick={e => setPageNumber(parseInt(e.currentTarget.dataset.page))}>{i+1}</button>
    </li> );

  useEffect(() => {
    console.log('Loading records');
    let ignore = false;

    let params = new URLSearchParams();
    params.append('recordsPerPage', recordsPerPage);
    params.append('page', pageNumber);
    sortBy.forEach(sb => {
      params.append('sortBy', sb.name);
      params.append('sortDirection', sb.direction)
    });
    axios.get('records', {
        params: params
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
  }, [recordsPerPage, pageNumber, sortBy, navigate]);

  function filterNonNumberCharacters(e) {
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }

  function calculateCaret(name) {
    for (let i=0; i<sortBy.length; i++) {
      if (sortBy[i].name === name) {
        return sortBy[i].direction === 'ASC' ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-down-fill"></i>;
      }
    }
    return null;
  }

  function setSortByAndSortDirection(e) {
    let sortByName = e.currentTarget.dataset.name;
    console.log('Sort by ' + sortByName);

    let foundIndex = -1;
    let newSortBy = [];
    for (let i=0; i<sortBy.length; i++) {
      newSortBy.push(sortBy[i]);

      if (sortBy[i].name === sortByName) {
        foundIndex = i;
      }
    }

    if (foundIndex === -1) {
      newSortBy.push({ name: sortByName, direction: 'ASC' });
    }
    else if (newSortBy[foundIndex].direction === 'ASC') {
      newSortBy[foundIndex].direction = 'DESC';
    }
    else {
      newSortBy.splice(foundIndex, 1);
    }

    setSortBy(newSortBy);
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
            <label htmlFor="records-per-page" className="col-form-label">Records per page</label>
          </div>
          <div className="col-auto">
            <input id="records-per-page" className="form-control" type="number" onKeyDown={filterNonNumberCharacters}
                onChange={e => setRecordsPerPage(e.currentTarget.value)} value={recordsPerPage}></input>
          </div>
        </div>

        <div className="row">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col" role="button" data-name="type" onClick={setSortByAndSortDirection}>Operation {calculateCaret('type')}</th>
                <th scope="col" role="button" data-name="amount" onClick={setSortByAndSortDirection}>Amount {calculateCaret('amount')}</th>
                <th scope="col" role="button" data-name="userBalance" onClick={setSortByAndSortDirection}>Balance {calculateCaret('userBalance')}</th>
                <th scope="col" role="button" data-name="operationResponse" onClick={setSortByAndSortDirection}>Result {calculateCaret('operationResponse')}</th>
                <th scope="col" role="button" data-name="date" onClick={setSortByAndSortDirection}>Date {calculateCaret('date')}</th>
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
