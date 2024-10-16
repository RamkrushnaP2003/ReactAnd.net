# DataBase My Sql

CREATE DATABASE PersonDetailsDB;
use PersonDetailsDB;

DROP TABLE PersonDetails;

CREATE TABLE PersonDetails (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,   -- Ensure Email is unique
    Contact VARCHAR(15) NOT NULL UNIQUE,   -- Ensure Contact is unique
    Address VARCHAR(250) NOT NULL,
    Pincode VARCHAR(6) NOT NULL
);

- Stored Procedure

DELIMITER //

CREATE PROCEDURE InsertPersonDetails(
    IN p_FirstName VARCHAR(50),
    IN p_LastName VARCHAR(50),
    IN p_Email VARCHAR(100),
    IN p_Contact VARCHAR(15),
    IN p_Address VARCHAR(250),
    IN p_Pincode VARCHAR(6)
)
BEGIN
    INSERT INTO PersonDetails (FirstName, LastName, Email, Contact, Address, Pincode)
    VALUES (p_FirstName, p_LastName, p_Email, p_Contact, p_Address, p_Pincode);
END //

DELIMITER ;

