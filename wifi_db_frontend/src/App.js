import SubmitTest from './components/SubmitTest';
import Home from './components/Home';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  const isAuthenticated = false; // This should be determined based on your auth logic


  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/submit">Submit</Link>
            </li>
            {isAuthenticated ? (
              <li>
                <Link to="/profile">Profile</Link> {/* Adjust if you have a specific profile component */}
              </li>
            ) : null
            }
            {isAuthenticated ? (
              <li>
                {/* <button onClick={handleLogout}>Logout</button> */}
              </li>
            ) : (
              <li>
                <Link to="/login">Login</Link> {/* Adjust if you have a specific login component */}
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<SubmitTest />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
