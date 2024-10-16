import React, { useState } from "react";
import "./PersonDetailsForm.css";

const PersonDetailsForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
    pincode: "",
  });
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState(null);

  const validateForm = () => {
    let errors = {};

    // Basic validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First Name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (formData.contact.length < 10) {
      errors.contact = "Contact number must be at least 10 digits";
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }
    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (formData.pincode.length !== 6) {
      errors.pincode = "Pincode must be 6 digits";
    }

    return errors;
  };

  const checkDuplicate = async () => {
    try {
      const response = await fetch("http://localhost:5126/api/person");
      const data = await response.json();

      const duplicate = data.some(
        (person) =>
          person.email === formData.email || person.contact === formData.contact
      );

      return duplicate;
    } catch (err) {
      console.error("Error fetching person data for duplicate check: ", err);
      return false; // Assume no duplicates if fetching fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setError(formErrors);
      return; // If there are validation errors, don't proceed
    }

    // Check for duplicate email or contact before submitting
    const isDuplicate = await checkDuplicate();
    if (isDuplicate) {
      alert("Duplicate entry detected. Please check the email or contact.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5126/api/person", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Data Submitted Successfully");
      console.log("Form submitted", formData);

      // Reset form and errors after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        address: "",
        pincode: "",
      });
      setError({});
      setServerError(null);
    } catch (err) {
      setServerError(err.message);
      console.log("Error while submitting data: ", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: "" }); // Clear error on field change
  };

  return (
    <form className="person-form">
      <div>
        First Name:{" "}
        <input
          type="text"
          onChange={handleChange}
          value={formData.firstName}
          name="firstName"
          placeholder="Enter First Name"
        />
        {error.firstName && (
          <span className="error-message">{error.firstName}</span>
        )}
        <br />
        Last Name:{" "}
        <input
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          name="lastName"
          placeholder="Enter Last Name"
        />
        {error.lastName && (
          <span className="error-message">{error.lastName}</span>
        )}
        <br />
        Email:{" "}
        <input
          value={formData.email}
          onChange={handleChange}
          type="email"
          name="email"
          placeholder="Enter Email"
        />
        {error.email && <span className="error-message">{error.email}</span>}
        <br />
        Contact:{" "}
        <input
          type="number"
          value={formData.contact}
          onChange={handleChange}
          name="contact"
          placeholder="Enter Mobile Number"
        />
        {error.contact && (
          <span className="error-message">{error.contact}</span>
        )}
        <br />
        Address:{" "}
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter Address"
        ></textarea>
        {error.address && (
          <span className="error-message">{error.address}</span>
        )}
        <br />
        Pincode:{" "}
        <input
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Enter Pincode"
          type="number"
        />
        {error.pincode && (
          <span className="error-message">{error.pincode}</span>
        )}
      </div>

      <button className="btn-submit" onClick={handleSubmit}>
        Submit
      </button>

      {serverError && <div className="error-message">Error: {serverError}</div>}
    </form>
  );
};

export default PersonDetailsForm;
