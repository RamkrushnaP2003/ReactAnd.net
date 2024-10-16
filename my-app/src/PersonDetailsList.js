import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import NoDataAvailable from "./NoDataAvailable";

const PersonDetailsList = () => {
  const [personDetails, setPersonDetails] = useState([]);
  const [editPerson, setEditPerson] = useState(null); // State to manage the person being edited
  const [dialogVisible, setDialogVisible] = useState(false); // State to manage the visibility of the dialog
  const [newPersonDetails, setNewPersonDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
    pincode: "",
  }); // State to hold the new person details

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5126/api/person");
      const data = await response.json();
      setPersonDetails(data);
    } catch (err) {
      console.error("Error fetching person details: ", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (contact) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this person?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5126/api/person/${contact}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          fetchData(); // Re-fetch after deletion
          alert(`Person deleted successfully.`);
        } else {
          alert("Failed to delete the person.");
        }
      } catch (err) {
        alert("Failed to delete.");
        console.error(err);
      }
    }
  };

  const handleEdit = (person) => {
    setEditPerson(person);
    setNewPersonDetails({
      firstName: person.firstName || "",
      lastName: person.lastName || "",
      email: person.email || "",
      contact: person.contact || "",
      address: person.address || "",
      pincode: person.pincode || "",
    });
    setDialogVisible(true); // Open the dialog when editing
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5126/api/person/${editPerson.contact}`, // Make sure the correct identifier is used
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Fix header case
          },
          body: JSON.stringify(newPersonDetails),
        }
      );

      if (response.ok) {
        alert("Person updated successfully.");
        fetchData(); // Re-fetch the updated data
        setDialogVisible(false); // Close the dialog
        setEditPerson(null); // Clear the edit state
        setNewPersonDetails({
          firstName: "",
          lastName: "",
          email: "",
          contact: "",
          address: "",
          pincode: "",
        }); // Reset form
      } else {
        alert("Failed to update the person.");
      }
    } catch (err) {
      console.error("Error updating person: ", err);
    }
  };

  const editTemplate = (rowData) => {
    return (
      <button
        onClick={() => handleEdit(rowData)}
        className="p-button p-button-raised p-button-info"
      >
        <i className="pi pi-user-edit" style={{ fontSize: "1rem" }}></i>
      </button>
    );
  };

  const deleteTemplate = (rowData) => {
    return (
      <button
        onClick={() => handleDelete(rowData.contact)} // Fixed: Use contact for deletion
        className="p-button p-button-raised p-button-danger"
      >
        <i className="pi pi-trash" style={{ fontSize: "1rem" }}></i>
      </button>
    );
  };

  const handleChange = (e) => {
    setNewPersonDetails({
      ...newPersonDetails,
      [e.target.name]: e.target.value,
    });
  };

  if (personDetails.length === 0) {
    return <NoDataAvailable />;
  }

  return (
    <div className="card">
      <DataTable
        value={personDetails}
        showGridlines
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="firstName" header="First Name"></Column>
        <Column field="lastName" header="Last Name"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="contact" header="Contact"></Column>
        <Column field="address" header="Address"></Column>
        <Column field="pincode" header="Pincode"></Column>

        {/* Add custom edit and delete buttons */}
        <Column header="Edit" body={editTemplate}></Column>
        <Column header="Delete" body={deleteTemplate}></Column>
      </DataTable>

      {/* Dialog for Editing Person Details */}
      <Dialog
        header="Edit Person"
        visible={dialogVisible}
        style={{ width: "30vw" }}
        modal
        onHide={() => setDialogVisible(false)} // Close the dialog on hide
      >
        <div className="p-fluid">
          <div className="p-field">
            <label>First Name:</label>
            <input
              type="text"
              value={newPersonDetails.firstName} // Use lowercase
              name="firstName"
              onChange={handleChange}
            />
          </div>
          <div className="p-field">
            <label>Last Name:</label>
            <input
              type="text"
              value={newPersonDetails.lastName} // Use lowercase
              name="lastName"
              onChange={handleChange}
            />
          </div>
          <div className="p-field">
            <label>Email:</label>
            <input
              type="email"
              value={newPersonDetails.email} // Use lowercase
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="p-field">
            <label>Contact:</label>
            <input
              type="text"
              value={newPersonDetails.contact} // Use lowercase
              name="contact"
              onChange={handleChange}
            />
          </div>
          <div className="p-field">
            <label>Address:</label>
            <input
              type="text"
              value={newPersonDetails.address} // Use lowercase
              name="address"
              onChange={handleChange}
            />
          </div>
          <div className="p-field">
            <label>Pincode:</label>
            <input
              type="text"
              value={newPersonDetails.pincode} // Use lowercase
              name="pincode"
              onChange={handleChange}
            />
          </div>

          <div style={styles.div} className="p-field">
            <button
              onClick={handleUpdate}
              className="p-button p-button-raised p-button-success"
              style={styles.button}
            >
              Update
            </button>
            <button
              onClick={() => setDialogVisible(false)} // Close the dialog
              className="p-button p-button-raised p-button-secondary"
              style={styles.button}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const styles = {
  div: {
    display: "flex",
    justifyContent: "space-around",
    alignItem: "center",
    paddingTop: "1.5rem",
  },

  button: {
    width: "8rem",
    display: "flex",
    alignItem: "center",
    justifyContent: "center",
    borderRadius: "6px",
  },
};

export default PersonDetailsList;
