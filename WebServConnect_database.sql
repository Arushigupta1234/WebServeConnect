create database mainss;
use mainss;
create table users(email_id varchar(30) primary key,password varchar(30),utype varchar(30),dos date,status int);
select*from users;
drop table users;

create table custprofile(emailId varchar(30) primary key,Name varchar(30),contactNumber varchar(30) ,address varchar(100),city varchar(30),state varchar(30),picname varchar(200));
select*from custprofile;
drop table custprofile;


create table tasks (email varchar(50),category varchar(30),address varchar(50),city varchar(20),upto_date date,task varchar(30));
select * from tasks;
ALTER TABLE tasks ADD COLUMN rid INT AUTO_INCREMENT PRIMARY KEY;
create table provider (emalId varchar(50) primary key, Name varchar(50),contactNumber varchar(30), Gender varchar(20), Category varchar(40), Firm varchar(80), Website varchar(50),Address varchar(80), City varchar(30), Since varchar(20), picname varchar(50), Info varchar(100));
select * from provider;
drop table provider;

create table serProvider(emailid varchar(30) primary key, FName varchar(30) ,  contact varchar(15) , gender varchar(15),  Firmaddress varchar(100) , Since varchar(5) , serviceCat varchar(100) , firm varchar(200) , website varchar(200) , idproof varchar(15) , ppic varchar(300) , textt varchar(400) , city varchar(100), state varchar(100));
select * from serProvider;
