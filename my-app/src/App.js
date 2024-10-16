import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import PersonDetailsForm from "./PersonDetailsForm";
import Header from "./Header";
import PersonDetailsList from "./PersonDetailsList";

const AppLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

// const Home = () => (
//   <div style={styles.page}>
//     <h2>Home Page</h2>
//     <p>Click the "Create New Person" button to fill in the form.</p>
//   </div>
// );

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<PersonDetailsList />} />
          <Route path="/create-person" element={<PersonDetailsForm />} />
        </Route>
      </Routes>
    </Router>
  );
};

// const styles = {
//   page: {
//     padding: "20px",
//     textAlign: "center",
//   },
// };

export default App;
