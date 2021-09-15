CREATE DATABASE FOODSTALLDB

USE FOODSTALLDB

CREATE TABLE msCampus(
	CampusID INT PRIMARY KEY IDENTITY(1,1),
	CampusName VARCHAR(100)
)

CREATE TABLE msPayment(
	PaymentID INT PRIMARY KEY IDENTITY(1,1),
	PaymentName VARCHAR(10)
)

CREATE TABLE trFoodStall(
	FoodStallID INT PRIMARY KEY IDENTITY(1,1),
	FoodStallName VARCHAR(50),
	FoodStallDescription VARCHAR(MAX),
	PaymentID INT FOREIGN KEY REFERENCES msPayment(PaymentID),
	CampusID INT FOREIGN KEY REFERENCES msCampus(CampusID)
)

INSERT INTO msCampus VALUES ('Anggrek'), ('Syahdan'), ('Kijang')

INSERT INTO msPayment VALUES ('Cash'), ('Flazz Card'), ('GoPay'), ('OVO')

CREATE PROCEDURE sp_getCampus
AS
BEGIN
	SELECT * FROM msCampus
END

EXEC sp_getCampus

CREATE PROCEDURE sp_getPayment
AS
BEGIN
	SELECT * FROM msPayment
END

EXEC sp_getPayment

CREATE PROCEDURE sp_getFoodStall
@CampusID INT
AS
BEGIN
	SELECT * FROM trFoodStall WHERE CampusID = @CampusID
END

EXEC sp_getFoodStall 1

CREATE PROCEDURE sp_getFoodStallDetail
@FoodStallID INT
AS
BEGIN
	SELECT * FROM trFoodStall WHERE FoodStallID = @FoodStallID
END

CREATE PROCEDURE sp_insertFoodStall
@FoodStallName VARCHAR(50),
@FoodStallDescription VARCHAR(MAX),
@PaymentID INT,
@CampusID INT
AS
BEGIN
	SET NOCOUNT ON;
	INSERT INTO trFoodStall VALUES (@FoodStallName, @FoodStallDescription, @PaymentID, @CampusID);
	SELECT 1 AS [Success]
END

CREATE PROCEDURE sp_updateFoodStall
@FoodStallID INT,
@FoodStallName VARCHAR(50),
@FoodStallDescription VARCHAR(MAX),
@PaymentID INT,
@CampusID INT
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE trFoodStall
	SET FoodStallName = @FoodStallName,
	FoodStallDescription = @FoodStallDescription,
	PaymentID = @PaymentID,
	CampusID = @CampusID
	WHERE FoodStallID = @FoodStallID

	SELECT 1 AS [Success]
END

CREATE PROCEDURE sp_deleteFoodStall
@FoodStallID INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE FROM trFoodStall
	WHERE FoodStallID = @FoodStallID

	SELECT 1 AS [Success]
END

SELECT * FROM trFoodStall
