Drop Database If Exists OurWardrobeDB;
Create Database OurWardrobeDB;

Use OurWardrobeDB;

-- Table creations 

Drop Table If Exists Users;

Create Table Users (
	uId Integer Primary Key NOT NULL auto_increment,
    Email Varchar(50) Unique NOT NULL,
    NickName Varchar(50) Unique NOT NULL,
    Pass Varchar(1024) NOT NULL,
    Avatar Blob,
    Gender Varchar(50),
    OauthToken Varchar(100)
);

Drop Table If Exists Wardrobes;

Create Table Wardrobes (
	wId Integer Primary Key auto_increment NOT NULL,
    NickName Varchar(50) NOT NULL,
    CreationTime Timestamp,
    WardrobeType Enum('Personal', 'Shared') NOT NULL
);

Drop Table If Exists Clothes;

Create Table Clothes (
	cId Integer Primary Key auto_increment NOT NULL,
    ClothType Enum ('Head', 'UpperBody', 'LowerBody',
		'Feet', 'Hands', 'Groin') NOT NULL,
	Image Varchar(200) NOT NULL,
    OriginalWardrobeId Integer NOT NULL,
    foreign key (OriginalWardrobeId) References Wardrobes(wId) On Delete Cascade
);

Drop Table If Exists WardrobesClothes;

Create Table WardrobesClothes (
	Id Integer Primary Key auto_increment NOT NULL,
    wId Integer NOT NULL,
    cId Integer NOT NULL
);

Drop Table If Exists UsersWardrobes;

Create Table UsersWardrobes (
	Id Integer Primary Key auto_increment NOT NULL,
    uId Integer NOT NULL,
    wId Integer NOT NULL
);

-- Trigger creations 
Drop Trigger If Exists BeforeWardrobeDeleteTrigger;
Drop Trigger If Exists BeforeUserDeleteTrigger;

Set Global triggerCheck = 1;

Delimiter $

Create Trigger BeforeWardrobeDeleteTrigger Before Delete On Wardrobes
For Each Row
Begin
    Delete From WardrobesClothes Where wId = Old.wId;
    Delete From WardrobesClothes Where cId In (Select cId From Clothes Where OriginalWardrobeId = Old.wId);
    Delete From Clothes Where OriginalWardrobeId = Old.wId;
End$

Create Trigger BeforeUserDeleteTrigger Before Delete On Users
For Each Row
Begin
	Delete From UsersWardrobes Where uId = Old.uId;
End$

Create Trigger BeforeUsersWardrobesDeleteTrigger Before Delete On UsersWardrobes
For Each Row
Begin
	Delete From Wardrobes Where wId = Old.wId And (Select COUNT(*) From UsersWardrobes Where wId = Old.wId) = 0;
End$

Delimiter ;