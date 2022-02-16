-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: ourwardrobedb
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clothes`
--

DROP TABLE IF EXISTS `clothes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clothes` (
  `cId` int NOT NULL AUTO_INCREMENT,
  `ClothType` enum('Head','UpperBody','LowerBody','Feet','Hands','Groin') NOT NULL,
  `Image` varchar(200) NOT NULL,
  `OriginalWardrobeId` int NOT NULL,
  PRIMARY KEY (`cId`),
  KEY `OriginalWardrobeId` (`OriginalWardrobeId`),
  CONSTRAINT `clothes_ibfk_1` FOREIGN KEY (`OriginalWardrobeId`) REFERENCES `wardrobes` (`wId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clothes`
--

LOCK TABLES `clothes` WRITE;
/*!40000 ALTER TABLE `clothes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clothes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `uId` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(50) NOT NULL,
  `NickName` varchar(50) NOT NULL,
  `Pass` varchar(1024) NOT NULL,
  `Avatar` blob,
  `Gender` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`uId`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `NickName` (`NickName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userswardrobes`
--

DROP TABLE IF EXISTS `userswardrobes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userswardrobes` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `uId` int NOT NULL,
  `wId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `uId` (`uId`),
  KEY `wId` (`wId`),
  CONSTRAINT `userswardrobes_ibfk_1` FOREIGN KEY (`uId`) REFERENCES `users` (`uId`),
  CONSTRAINT `userswardrobes_ibfk_2` FOREIGN KEY (`wId`) REFERENCES `wardrobes` (`wId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userswardrobes`
--

LOCK TABLES `userswardrobes` WRITE;
/*!40000 ALTER TABLE `userswardrobes` DISABLE KEYS */;
/*!40000 ALTER TABLE `userswardrobes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wardrobes`
--

DROP TABLE IF EXISTS `wardrobes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wardrobes` (
  `wId` int NOT NULL AUTO_INCREMENT,
  `NickName` varchar(50) NOT NULL,
  `CreationTime` timestamp NULL DEFAULT NULL,
  `WardrobeType` enum('Personal','Shared') NOT NULL,
  PRIMARY KEY (`wId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wardrobes`
--

LOCK TABLES `wardrobes` WRITE;
/*!40000 ALTER TABLE `wardrobes` DISABLE KEYS */;
/*!40000 ALTER TABLE `wardrobes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wardrobesclothes`
--

DROP TABLE IF EXISTS `wardrobesclothes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wardrobesclothes` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `wId` int NOT NULL,
  `cId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `wId` (`wId`),
  KEY `cId` (`cId`),
  CONSTRAINT `wardrobesclothes_ibfk_1` FOREIGN KEY (`wId`) REFERENCES `wardrobes` (`wId`),
  CONSTRAINT `wardrobesclothes_ibfk_2` FOREIGN KEY (`cId`) REFERENCES `clothes` (`cId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wardrobesclothes`
--

LOCK TABLES `wardrobesclothes` WRITE;
/*!40000 ALTER TABLE `wardrobesclothes` DISABLE KEYS */;
/*!40000 ALTER TABLE `wardrobesclothes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-16 21:00:56
