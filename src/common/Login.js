import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import './Login.css';

export default function Login({ setPageMessage, setLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogIn(e) {
    e.preventDefault()

    console.log('Sending log in request...')
    axios.post('log-in', {
        username: username,
        password: password
      })
      .then(function (response){
        const message = 'Log in request successful'
        console.log(message)
        setPageMessage({ message: message, type: 'success' })

        console.log(response.data)

        Cookies.set('user', JSON.stringify(response.data), { expires: 1, sameSite: 'strict' })
        setLoggedIn(true)
      })
      .catch(function (error){
        let errorMessage = 'Error logging in: ' + error.message
        if (error.response) {
          errorMessage += ' - ' + error.response.data
        }

        console.log(errorMessage)
        setPageMessage({ message: errorMessage, type: 'failure' })
      });
  }

  return (
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
        </form>
      </div>
    </div>
  );
};
