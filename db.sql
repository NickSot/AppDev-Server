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
    AdminId Integer
);

Drop Table If Exists Clothes;

Create Table Clothes (
	cId Integer Primary Key auto_increment NOT NULL,
    ClothType Enum ('Shirt', 'Pants', 'Skirt',
		'Dress', 'Shoe', 'Jacket') NOT NULL,
	Image LongText,
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
	Declare Counter Integer Default 0;
    
	Drop Temporary Table If Exists wIds;
	Create Temporary Table If Not Exists wIds (id Integer auto_increment Primary Key, wId Integer) Engine = Memory;

	Insert Into wIds (wId) Select wId From UsersWardrobes Where uId = userId;
    
    Drop Temporary Table If Exists wIds_copy;
	Create Temporary Table If Not Exists wIds_copy (id Integer auto_increment Primary Key, wId Integer) Engine = Memory;
    Insert wIds_copy Select * From wIds;
 
	Delete From UsersWardrobes Where uId = userId;
 
	While Counter <= (Select Count(*) wIds) + 1 Do
		Update Wardrobes Set AdminId = (Select uId From UsersWardrobes Where wId = (Select wId From wIds Where id = Counter) Order by uId Asc Limit 1) Where wId = (Select wId From wIds_copy Where id = Counter Limit 1);
		Set Counter = Counter + 1;
	End While;
	
	Delete From Wardrobes Where Wardrobes.wId In (Select wId From wIds) And Wardrobes.wId Not In (Select wId From UsersWardrobes);
    
End$

Create Procedure DeleteWardrobeUserRelationship(userId Integer, wardrobeId Integer)
Begin
	If wardrobeId is null Then
		Call DeleteUserWardrobeRelationship(userId);
	else
		Drop Temporary Table If Exists wIds;
		Create Temporary Table If Not Exists wIds (wId Integer) Engine = Memory;
		Delete From wIds;
		
        Insert wIds (Select wId From UsersWardrobes Where uId = userId And wId = wardrobeId);
		Delete From UsersWardrobes Where uId = userId AND wId = wardrobeId;
        
        Update Wardrobes Set AdminId = (Select uId From UsersWardrobes Where wId = wardrobeId Order By uId Asc Limit 1) Where Wardrobes.wId = wardrobeId;
        
		Delete From Wardrobes Where Wardrobes.wId In (Select wId From wIds) And Wardrobes.wId Not In (Select wId From UsersWardrobes);
	End If;
End$

Create Trigger BeforeUserDeleteTrigger Before Delete On Users
For Each Row
Begin
	Call DeleteUserWardrobeRelationship(Old.uId);
End$

Delimiter ;