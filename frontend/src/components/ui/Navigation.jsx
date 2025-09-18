import { Link } from "react-router-dom";

const Navigation = () => (
  <nav style={{ marginBottom: 24 }}>
    <Link to="/">Home</Link>
    <Link to="/profile" style={{ marginLeft: 16 }}>Profile</Link>
    <Link to="/questionnaire" style={{ marginLeft: 16 }}>Questionnaire</Link>
    <Link to="/dashboard" style={{ marginLeft: 16 }}>Dashboard</Link>
    {/* Add more links as needed */}
  </nav>
);

export default Navigation;