import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div style={styles.header}>
      <div style={styles.div}>
        <Link to="/">
          <button style={styles.button}>Person Details</button>
        </Link>
        <Link to="/create-person">
          <button style={styles.button}>Create New Person</button>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: "#282c34",
    padding: "10px",
    top: 0,
    zIndex: 1,
    boxShadow: "0 4px 2px -2px gray",
  },
  button: {
    backgroundColor: "#61dafb",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: ".5rem",
  },
  div: {
    maxWidth: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "0 auto",
    padding: ".5rem",
  },
};

export default Header;
