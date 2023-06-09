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
  const [pageControl, setPageControl] = useState({ recordsPerPage: 10, pageNumber: 0, maxPage: 0 });
  const [sortBy, setSortBy] = useState([]);
  const [search, setSearch] = useState('');

  const recordsHtml = records.map(r => (
    <tr key={r.id}>
      <td>{r.id}</td>
      <td>{r.type}</td>
      <td>{r.amount}</td>
      <td>{r.balance}</td>
      <td>{r.result}</td>
      <td>{r.date}</td>
      <td className="text-center"><input class="form-check-input" type="checkbox" data-id={r.id}
          onChange={handleRecordSelected} checked={r.selected}></input></td>
    </tr>
  ))

  const pagesIndexes = Array.from(Array(pageControl.maxPage+1).keys());
  const pagesButtons = pagesIndexes.map(i => (<li key={i} className={i === pageControl.pageNumber ? "page-item active" : "page-item"}>
        <button className="page-link" data-page={i} onClick={handlePageSelection}>{i+1}</button>
      </li>));

  useEffect(() => {
    console.log('Loading records');
    let ignore = false;

    let params = new URLSearchParams();
    params.append('recordsPerPage', pageControl.recordsPerPage);
    params.append('page', pageControl.pageNumber);
    sortBy.forEach(sb => {
      params.append('sortBy', sb.name);
      params.append('sortDirection', sb.direction)
    });
    if (search.length >= 3) {
      params.append('search', search);
    }

    axios.get('records', {
        params: params
      })
      .then(function (response){
        if (!ignore) {
          console.log(response.data);
          response.data.forEach(r => r.selected = false);
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
  }, [pageControl, sortBy, search, navigate]);

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

  function handlePageSelection(e) {
    setPageControl(n => ({
      ...n,
      pageNumber: parseInt(e.target.dataset.page)
    }))
  }

  function handlePrevious() {
    setPageControl(n => ({
      ...n,
      pageNumber: n.pageNumber-1,
      maxPage: Math.max(n.pageNumber-1, n.maxPage)
    }));
  }

  function handleNext() {
    setPageControl(n => ({
      ...n,
      pageNumber: n.pageNumber+1,
      maxPage: Math.max(n.pageNumber+1, n.maxPage)
    }));
  }

  function handleRecordSelected(e) {
    let id = parseInt(e.currentTarget.dataset.id);
    console.log('Record selected/unselected: ' + id);
    let newRecords = [];
    records.forEach(function(item, index) {
      let newRecord = Object.assign({}, item);
      if (item.id === id) {
        newRecord.selected = !item.selected;
      }
      newRecords.push(newRecord);
    });
    setRecords(newRecords);
  }

  function handleDeleteSelected() {
    console.log('Deleting records');
    let deletingRecords = records.filter(r => r.selected).map(r => r.id);
    console.log(deletingRecords);

    axios.delete('records', {
          data: deletingRecords
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(function (response){
          const message = 'Operation successful';
          console.log(message);
          setPageMessage({ message: message, type: 'success' });

          let keepingRecords = records.filter(r => !r.selected);
          setRecords(keepingRecords);
        })
        .catch(function (error){
          if (error.response.status === 401) {
            console.log('Error with session. Redirecting to root.');
            Cookies.remove('user');
            navigate('/');
            return;
          }

          let errorMessage = 'Error deleting records: ' + error.message
          if (error.response) {
            if (error.response.data && error.response.data.error) {
              errorMessage += ' - ' + error.response.data.error
            }
            else {
              errorMessage += ' - ' + error.response.data
            }
          }

          console.log(errorMessage)
          setPageMessage({ message: errorMessage, type: 'failure' })
        });
  }

  return (
    <>
      <Helmet>
        <title>Records - Arithmetic Calculator</title>
      </Helmet>
      <Header setPageMessage={setPageMessage} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      <div className="container records">
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
                onChange={e => setPageControl({ recordsPerPage: Math.max(parseInt(e.currentTarget.value), 1), pageNumber: 0, maxPage: 0 })}
                value={pageControl.recordsPerPage}></input>
          </div>
        </div>

        <div className="row mb-3 align-items-center">
          <div className="col-auto">
            <label htmlFor="search" className="col-form-label">Search</label>
          </div>
          <div className="col-auto">
            <input id="search" className="form-control" type="text"
                onChange={e => e.currentTarget.value.length >= 3 ? setSearch(e.currentTarget.value) : setSearch('')}></input>
          </div>
          <div class="col-auto">
            <span id="searchHelp" class="form-text">Search in Operation, Result, and Date columns. Minimum 3 characters.</span>
          </div>

        </div>

        <div className="row">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col" role="button" data-name="id" onClick={setSortByAndSortDirection}>ID {calculateCaret('id')}</th>
                <th scope="col" role="button" data-name="type" onClick={setSortByAndSortDirection}>Operation {calculateCaret('type')}</th>
                <th scope="col" role="button" data-name="amount" onClick={setSortByAndSortDirection}>Amount {calculateCaret('amount')}</th>
                <th scope="col" role="button" data-name="userBalance" onClick={setSortByAndSortDirection}>Balance {calculateCaret('userBalance')}</th>
                <th scope="col" role="button" data-name="operationResponse" onClick={setSortByAndSortDirection}>Result {calculateCaret('operationResponse')}</th>
                <th scope="col" role="button" data-name="date" onClick={setSortByAndSortDirection}>Date {calculateCaret('date')}</th>
                <th scope="col" className="text-center" onClick={handleDeleteSelected}>
                  <button type="button" className={records.find(r => r.selected) ? "btn btn-danger" : "btn btn-danger disabled"}>Delete</button>
                </th>
              </tr>
            </thead>
            <tbody>{recordsHtml}</tbody>
          </table>
        </div>

        <div className="row">
          <nav>
            <ul className="pagination justify-content-center">
              <li className={pageControl.pageNumber === 0 ? "page-item disabled": "page-item"}><button className="page-link"
                  onClick={handlePrevious}>Previous</button></li>
              {pagesButtons}
              <li className={records.length < pageControl.recordsPerPage ? "page-item disabled": "page-item"}><button className="page-link"
                  onClick={handleNext}>Next</button></li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
