create database kmhs;

use kmhs;

create table Admin(
admin_email_id varchar(50),
admin_password varchar(255),
admin_name varchar(100),
admin_address varchar(200),
admin_pincode numeric(6),
admin_phone_number numeric(10),
admin_DOB varchar(10),
admin_blood_group varchar(3),
primary key(admin_email_id)
);

create table Policy(
policy varchar(50),
scheme varchar(20),
rules varchar(200),
interest numeric(3),
is_active boolean,
primary key(policy)
);

create table User(
username varchar(20),
password varchar(255),
name varchar(100),
phonenumber numeric(10),
emailid varchar(50),
DOB varchar(10),
address varchar(200),
pincode numeric(6),
loan_amount numeric(20,2),
premium_amount numeric(20,2),
primary key(username)
);

create table Policy_Taken(
username varchar(20),
policy varchar(50),
admin_email_id varchar(50),
primary key(username,policy),
foreign key(username) references User(username),
foreign key(policy) references Policy(policy),
foreign key(admin_email_id) references Admin(admin_email_id)
);

create table Transaction_History(
username varchar(20),
transaction_time varchar(25),
transaction_amount numeric(20,2),
primary key(username),
foreign key(username) references User(username)
);

create table Customer_Care(
staff_id int auto_increment,
DOB varchar(10),
name varchar(100),
address varchar(200),
phone_number numeric(10),
blood_group varchar(3),
email_id varchar(50),
primary key(staff_id)
);

insert into Admin values('admin@admin.com','admin','adminname','adminaddress','600002','1234576821','30/12/1999','O+');
