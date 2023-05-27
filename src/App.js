import { useState, useContext } from 'react';
import axios from 'axios';

import './App.css';

import { UserContext } from './UserContext';
import Header from './header/Header.js'


export default function App() {
  const ax = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: true,
  });

  const userContext = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loginMessageClass, setLoginMessageClass] = useState('success-message');

  function handleLogIn(e) {
    e.preventDefault()

    console.log('Sending log in request...')
    ax.post('log-in', {
        username: username,
        password: password
      })
      .then(function (response){
        const message = 'Log in request successful'
        console.log(message)
        setLoginMessage(message)
        setLoginMessageClass('alert alert-success')

        console.log(response.data)
      })
      .catch(function (error){
        let errorMessage = 'Error logging in: ' + error.message
        if (error.response) {
          errorMessage += ' - ' + error.response.data
        }

        console.log(errorMessage)
        setLoginMessage(errorMessage)
        setLoginMessageClass('alert alert-danger')
      })
  }

  return (
    <>
      <Header/>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="card">
              <div className="card-header">Login</div>
              <form onSubmit={handleLogIn} className="card-body">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input id="username" className="form-control" type="email" required
                      value={username} onChange={e => setUsername(e.target.value)}></input>
                </div>
                  
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input id="password" className="form-control" type="password" required
                      value={password} onChange={e => setPassword(e.target.value)}></input>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Log in</button>
                </div>

                { loginMessage ? (<div className={'login-message ' + loginMessageClass}>{loginMessage}</div>) : null }
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
