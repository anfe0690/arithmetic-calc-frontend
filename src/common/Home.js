import { Link } from "react-router-dom";
import Cookies from "js-cookie"

export default function Home() {
  const user = JSON.parse(Cookies.get('user'))

  return (
    <div className="col">
      <h1>Arithmetic Calculator</h1>
      <p>Welcome {user.name}. Here you can request new operations: <Link to={`/request-operation`}>Request Operation</Link></p>
    </div>
  )
}
