-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: thue_xe
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `anh_xe`
--

DROP TABLE IF EXISTS `anh_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anh_xe` (
  `anh_xe_id` int NOT NULL AUTO_INCREMENT,
  `mau_xe_id` int DEFAULT NULL,
  `duong_dan` varchar(255) NOT NULL,
  PRIMARY KEY (`anh_xe_id`),
  KEY `mau_xe_id` (`mau_xe_id`),
  CONSTRAINT `anh_xe_ibfk_1` FOREIGN KEY (`mau_xe_id`) REFERENCES `mau_xe` (`mau_xe_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chi_tiet_don_dat_xe`
--

DROP TABLE IF EXISTS `chi_tiet_don_dat_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_don_dat_xe` (
  `chi_tiet_id` bigint NOT NULL AUTO_INCREMENT,
  `don_dat_xe_id` int DEFAULT NULL,
  `xe_id` int DEFAULT NULL,
  `so_ngay_thue` int NOT NULL,
  `thanh_tien` decimal(38,2) NOT NULL,
  PRIMARY KEY (`chi_tiet_id`),
  KEY `don_dat_xe_id` (`don_dat_xe_id`),
  KEY `xe_id` (`xe_id`),
  CONSTRAINT `chi_tiet_don_dat_xe_ibfk_1` FOREIGN KEY (`don_dat_xe_id`) REFERENCES `don_dat_xe` (`don_dat_xe_id`) ON DELETE CASCADE,
  CONSTRAINT `chi_tiet_don_dat_xe_ibfk_2` FOREIGN KEY (`xe_id`) REFERENCES `xe` (`xe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_gia` (
  `danh_gia_id` int NOT NULL AUTO_INCREMENT,
  `khach_hang_id` int DEFAULT NULL,
  `mau_xe_id` int DEFAULT NULL,
  `so_sao` int DEFAULT NULL,
  `binh_luan` text,
  `ngay_danh_gia` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`danh_gia_id`),
  KEY `khach_hang_id` (`khach_hang_id`),
  KEY `mau_xe_id` (`mau_xe_id`),
  CONSTRAINT `danh_gia_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`khach_hang_id`) ON DELETE CASCADE,
  CONSTRAINT `danh_gia_ibfk_2` FOREIGN KEY (`mau_xe_id`) REFERENCES `mau_xe` (`mau_xe_id`) ON DELETE CASCADE,
  CONSTRAINT `danh_gia_chk_1` CHECK ((`so_sao` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `don_dat_xe`
--

DROP TABLE IF EXISTS `don_dat_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_dat_xe` (
  `don_dat_xe_id` int NOT NULL AUTO_INCREMENT,
  `khach_hang_id` int DEFAULT NULL,
  `nguoi_dung_id` int DEFAULT NULL,
  `ngay_bat_dau` datetime NOT NULL,
  `ngay_ket_thuc` datetime NOT NULL,
  `tong_tien` decimal(38,2) NOT NULL,
  `trang_thai` int DEFAULT '0',
  `dia_diem_nhan_xe` varchar(255) NOT NULL,
  PRIMARY KEY (`don_dat_xe_id`),
  KEY `khach_hang_id` (`khach_hang_id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  CONSTRAINT `don_dat_xe_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`khach_hang_id`),
  CONSTRAINT `don_dat_xe_ibfk_2` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`nguoi_dung_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hang_xe`
--

DROP TABLE IF EXISTS `hang_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hang_xe` (
  `hang_xe_id` int NOT NULL AUTO_INCREMENT,
  `ten_hang` varchar(255) NOT NULL,
  PRIMARY KEY (`hang_xe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_hang` (
  `khach_hang_id` int NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(255) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  PRIMARY KEY (`khach_hang_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `loai_xe`
--

DROP TABLE IF EXISTS `loai_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_xe` (
  `loai_xe_id` int NOT NULL AUTO_INCREMENT,
  `ten_loai` varchar(255) NOT NULL,
  PRIMARY KEY (`loai_xe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mau_xe`
--

DROP TABLE IF EXISTS `mau_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mau_xe` (
  `mau_xe_id` int NOT NULL AUTO_INCREMENT,
  `ten_mau` varchar(255) NOT NULL,
  `hang_xe_id` int DEFAULT NULL,
  `loai_xe_id` int DEFAULT NULL,
  `gia_thue_ngay` double NOT NULL,
  `mo_ta` varchar(255) DEFAULT NULL,
  `anhdefault` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`mau_xe_id`),
  KEY `hang_xe_id` (`hang_xe_id`),
  KEY `loai_xe_id` (`loai_xe_id`),
  CONSTRAINT `mau_xe_ibfk_1` FOREIGN KEY (`hang_xe_id`) REFERENCES `hang_xe` (`hang_xe_id`),
  CONSTRAINT `mau_xe_ibfk_2` FOREIGN KEY (`loai_xe_id`) REFERENCES `loai_xe` (`loai_xe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_dung` (
  `nguoi_dung_id` int NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `vai_tro` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nguoi_dung_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nguoi_dung_vai_tro`
--

DROP TABLE IF EXISTS `nguoi_dung_vai_tro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_dung_vai_tro` (
  `nguoi_dung_nguoi_dung_id` int NOT NULL,
  `vai_tro` varchar(255) DEFAULT NULL,
  KEY `FKk0nqhvknln03e5gb4c5upgbgq` (`nguoi_dung_nguoi_dung_id`),
  CONSTRAINT `FKk0nqhvknln03e5gb4c5upgbgq` FOREIGN KEY (`nguoi_dung_nguoi_dung_id`) REFERENCES `nguoi_dung` (`nguoi_dung_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `thong_tin_ky_thuat`
--

DROP TABLE IF EXISTS `thong_tin_ky_thuat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thong_tin_ky_thuat` (
  `ky_thuat_id` int NOT NULL AUTO_INCREMENT,
  `mau_xe_id` int DEFAULT NULL,
  `dong_co` varchar(255) DEFAULT NULL,
  `dung_tich` int DEFAULT NULL,
  `nhien_lieu` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ky_thuat_id`),
  KEY `mau_xe_id` (`mau_xe_id`),
  CONSTRAINT `thong_tin_ky_thuat_ibfk_1` FOREIGN KEY (`mau_xe_id`) REFERENCES `mau_xe` (`mau_xe_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `xe`
--

DROP TABLE IF EXISTS `xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xe` (
  `xe_id` int NOT NULL AUTO_INCREMENT,
  `bien_so` varchar(255) NOT NULL,
  `mau_xe_id` int DEFAULT NULL,
  `trang_thai` int DEFAULT '0',
  `ngay_dang_ky` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`xe_id`),
  UNIQUE KEY `bien_so` (`bien_so`),
  KEY `mau_xe_id` (`mau_xe_id`),
  CONSTRAINT `xe_ibfk_1` FOREIGN KEY (`mau_xe_id`) REFERENCES `mau_xe` (`mau_xe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-20 16:17:38
