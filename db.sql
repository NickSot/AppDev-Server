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
    WardrobeType Enum('Personal', 'Shared') NOT NULL,
    AdminId Integer Not NULL
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

-- Trigger and Procedure creations
Drop Trigger If Exists BeforeWardrobeDeleteTrigger;
Drop Trigger If Exists BeforeUserDeleteTrigger;
Drop Procedure If Exists DeleteUserWardrobeRelationship;
Drop Procedure If Exists DeleteWardrobeUserRelationship;

Delimiter $

Create Trigger BeforeWardrobeDeleteTrigger Before Delete On Wardrobes
For Each Row
Begin
    Delete From WardrobesClothes Where wId = Old.wId;
    Delete From WardrobesClothes Where cId In (Select cId From Clothes Where OriginalWardrobeId = Old.wId);
    Delete From Clothes Where OriginalWardrobeId = Old.wId;
End$

Create Procedure DeleteUserWardrobeRelationship(userId Integer)
Begin
	Create Temporary Table If Not Exists wIds (wId Integer) Engine = Memory;
    
    Delete From wIds;
    Insert Into wIds Select wId From UsersWardrobes Where uId = userId;
    
    Delete From UsersWardrobes Where uId = userId;
    
    Delete From Wardrobes Where Wardrobes.wId In (Select wId From wIds) And Wardrobes.wId Not In (Select wId From UsersWardrobes);
End$

Create Procedure DeleteWardrobeUserRelationship(userId Integer, wardrobeId Integer)
Begin
	If wardrobeId is null Then
		Call DeleteUserWardrobeRelationship(userId);
	else
		Create Temporary Table If Not Exists wIds (wId Integer) Engine = Memory;
		Delete From wIds;
		
        Insert Into wIds Select wId From UsersWardrobes Where uId = userId And wId = wardrobeId;
		Delete From UsersWardrobes Where uId = userId;
        
        Update Wardrobes Set AdminId = (Select uId From UsersWardrobes Where wId = wardrobeId Order By uId Desc Limit 1) Where Wardrobes.wId = wardrobeId;
        
		Delete From Wardrobes Where Wardrobes.wId In (Select wId From wIds) And Wardrobes.wId Not In (Select wId From UsersWardrobes);
	End If;
End$

Create Trigger BeforeUserDeleteTrigger Before Delete On Users
For Each Row
Begin
	Call DeleteUserWardrobeRelationship(Old.uId);
End$

Delimiter ;