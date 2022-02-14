DROP DATABASE IF EXISTS order_delivery_service;   
CREATE DATABASE IF NOT EXISTS order_delivery_service;   
USE order_delivery_service; 

DROP TABLE IF EXISTS orders; 

CREATE TABLE IF NOT EXISTS orders
  ( 
     id         INT PRIMARY KEY auto_increment, 
     customer_id   VARCHAR(25) NULL, 
     order_id   INT(12) UNIQUE NOT NULL, 
     origin JSON NOT NULL, 
     destination  JSON NOT NULL, 
     distance      VARCHAR(20) NULL, 
     status       ENUM('unassigned', 'taken', 'delivered') DEFAULT 'unassigned' NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ); 