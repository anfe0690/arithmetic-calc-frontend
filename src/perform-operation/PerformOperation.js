import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Header from "../common/Header"
import PageMessage from "../common/PageMessage";

import './PerformOperation.css'

export default function PerformOperation() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(true);
  const [pageMessage, setPageMessage] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(JSON.parse(Cookies.get('user')).balance);
  const [operations, setOperations] = useState([]);
  const operationsOptions = operations.map(o => <option key={o.type} value={o.type} data-cost={o.cost}>{o.type}</option>);
  const [operationSelected, setOperationSelected] = useState(null);
  const [cost, setCost] = useState('');
  const [firstOperand, setFirstOperand] = useState('');
  const [firstOperandDisabled, setFirstOperandDisabled] = useState(false);
  const [secondOperand, setSecondOperand] = useState('');
  const [secondOperandDisabled, setSecondOperandDisabled] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    console.log('Loading operations');
    let ignore = false;
    axios.get('operations')
      .then(function (response){
        if (!ignore) {
          console.log(response.data);
          setOperations(response.data);

          let operation = response.data[0];
          setOperationSelected(operation);
          setCost(operation.cost);
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
  }, [navigate]);

  function handleOperationSelected(e) {
    console.log('Selected ' + e.target.value);
    let operation = operations.find(o => o.type === e.target.value);
    setOperationSelected(operation);
    console.log('Cost: ' + operation.cost);
    setCost(operation.cost);
    setFirstOperandDisabled(operation.arity === 'NULLARY');
    setSecondOperandDisabled(operation.arity !== 'BINARY');
  }

  function filterNonNumberCharacters(e) {
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }

  function calculateOperationPreview(op, first, second) {
    if (op) {
      if (op.arity === 'BINARY') {
        return first + ' ' + op.symbol + ' ' + second;
      }
      else if (op.arity === 'UNARY') {
        return op.symbol + ' ' + first;
      }
      else {
        return op.type;
      }
    }
    else {
      return '';
    }
  }

  function calculateSubmitDisabled(op, first, second) {
    if (op) {
      if (op.arity === 'BINARY') {
        return !first || !second;
      }
      else if (op.arity === 'UNARY') {
        return !first;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }

  function handlePerformOperation(e) {
    e.preventDefault();
    console.log('Performing operation: ' + calculateOperationPreview(operationSelected, firstOperand, secondOperand));
    axios.post('perform-operation', {
        type: operationSelected.type,
        firstOperand: firstOperand,
        secondOperand: secondOperand
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function (response){
        const message = 'Operation successful';
        console.log(message);
        setPageMessage({ message: message, type: 'success' });

        console.log(response.data);
        setCurrentBalance(response.data.balance);
        setResult(response.data.result);

        let user = JSON.parse(Cookies.get('user'));
        user.balance = response.data.balance;
        Cookies.set('user', JSON.stringify(user), { expires: 1, sameSite: 'strict' });
      })
      .catch(function (error){
        if (error.response.status === 401) {
          console.log('Error with session. Redirecting to root.');
          Cookies.remove('user');
          navigate('/');
          return;
        }

        let errorMessage = 'Error performing operation: ' + error.message
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
        <title>Perform Operation - Arithmetic Calculator</title>
      </Helmet>
      <Header setPageMessage={setPageMessage} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      <div className="container perform-operation">
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
                  <input id="current-balance" className="form-control" type="text" disabled value={currentBalance}></input>
                </div>

                <hr></hr>

                <div className="mb-3">
                  <label htmlFor="operation" className="form-label">Operation</label>
                  <select id="operation" className="form-select" onChange={handleOperationSelected}>{operationsOptions}</select>
                </div>

                <div className="mb-3">
                  <label htmlFor="cost" className="form-label">Cost</label>
                  <input id="cost" className="form-control" type="text" disabled value={cost}></input>
                </div>

                <div className="mb-3">
                  <label htmlFor="first-operand" className="form-label">First Operand</label>
                  <input id="first-operand" className="form-control" type="number" onKeyDown={filterNonNumberCharacters}
                      value={firstOperand} onChange={e => setFirstOperand(e.target.value)}
                      disabled={firstOperandDisabled}></input>
                </div>

                <div className="mb-3">
                  <label htmlFor="second-operand" className="form-label">Second Operand</label>
                  <input id="second-operand" className="form-control" type="number" onKeyDown={filterNonNumberCharacters}
                      value={secondOperand} onChange={e => setSecondOperand(e.target.value)}
                      disabled={secondOperandDisabled}></input>
                </div>

                <div className="mb-3">
                  <label htmlFor="operation-preview" className="form-label">Operation Preview</label>
                  <input id="operation-preview" className="form-control" type="text" disabled
                      value={calculateOperationPreview(operationSelected, firstOperand, secondOperand)}></input>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary"
                      disabled={calculateSubmitDisabled(operationSelected, firstOperand, secondOperand)}>Submit</button>
                </div>

                <hr></hr>

                <div className="mb-3">
                  <label htmlFor="result" className="form-label">Result</label>
                  <input id="result" className="form-control" type="text" disabled value={result}></input>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
