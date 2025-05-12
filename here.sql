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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anh_xe`
--

LOCK TABLES `anh_xe` WRITE;
/*!40000 ALTER TABLE `anh_xe` DISABLE KEYS */;
INSERT INTO `anh_xe` VALUES (1,1,'https://headhongdac.com/upload/sanpham/large/wave-alpha-1742803061-e1e6d8.png'),(2,1,'https://cdn.honda.com.vn/motorbike-strong-points/July2023/NyeJDaabXKegK3tRHzwy.png'),(3,1,'https://images2.thanhnien.vn/zoom/686_429/528068263637045248/2023/9/30/honda-5-169603657000360185369-95-109-1218-1905-crop-1696036774374602790943.jpg'),(4,3,'https://headhongdac.com/upload/sanpham/large/sh-125-160-1719728973-264bdb.png'),(5,3,'https://headhongdac.com/upload/sanpham/large/sh-125-160-1719729365-241ab8.png'),(6,4,'https://static-images.vnncdn.net/files/publish/2023/5/15/346102675-1255538878399914-1825674319887368606-n-1-1536.jpg?width=500&s=8ngsWyVihcwStvzrSllmlw'),(7,4,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhX1Uf15cL2GSlsLI8m30duBzNPtNjvW8Ult5Pv0Bwg5U7fz7sBP7YNyw&s'),(8,5,'https://hdgo.vn/upload/hinh-anh/tin-tuc/hinh-anh/hinh-anh-xe-sirius-do-kieng-den-trang-sieu-dep/hinh-anh-xe-sirius-do-kieng-den-trang-sieu-dep-4.jpg'),(9,5,'https://hdgo.vn/upload/hinh-anh/tin-tuc/hinh-anh/hinh-anh-xe-sirius-do-kieng-den-trang-sieu-dep/hinh-anh-xe-sirius-do-kieng-den-trang-sieu-dep-3.jpg'),(10,5,'https://thienthanhlimo.com/wp-content/uploads/2022/05/sirius-do-kieng-1024x682.jpg'),(11,6,'https://thienthanhlimo.com/wp-content/uploads/2022/05/sirius-do-kieng-1024x682.jpg'),(12,6,'https://cuuhoxemayhanoi.vn/wp-content/uploads/2024/07/hinh-anh-xe-exciter-do-kieng-dep-1.jpg'),(13,7,'https://motosaigon.vn/wp-content/uploads/2016/11/danh-gia-xe-yamaha-nvx-155-motosaigon-35.jpg'),(14,7,'https://yamaha-motor.com.vn/wp/wp-content/uploads/2024/02/NVX-Pearl-Blue-004-768x645.png'),(15,8,'https://imgcdn.zigwheels.vn/medium/gallery/exterior/80/1020/yamaha-janus-75711.jpg'),(16,8,'https://product.hstatic.net/200000795625/product/ja-limited-2024-mat-silver-004-1024x860_d9088f19b20f4bbd99f1f82aa31ee6b1_master.png'),(17,2,'http://localhost:8080/mauxe/images/72af0597-3daf-477d-87ef-1f3b1b930491.jfif'),(18,2,'http://localhost:8080/mauxe/images/7f3406ec-502d-462a-b093-222d783c1818.jpg'),(19,2,'http://localhost:8080/mauxe/images/f593a0c1-b765-44d1-a341-128e07c91b4f.jpg');
/*!40000 ALTER TABLE `anh_xe` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_don_dat_xe`
--

LOCK TABLES `chi_tiet_don_dat_xe` WRITE;
/*!40000 ALTER TABLE `chi_tiet_don_dat_xe` DISABLE KEYS */;
INSERT INTO `chi_tiet_don_dat_xe` VALUES (1,1,2,2,300000.00),(2,2,3,2,360000.00),(3,3,4,2,2400000.00),(4,4,5,2,2000000.00),(5,5,6,2,3000000.00),(6,1,3,2,3400000.00),(8,8,1,5,2500000.00),(9,8,1,5,2500000.00),(12,1,1,2,2400000.00),(13,2,2,2,3000000.00),(14,3,3,1,1400000.00),(15,4,4,2,1600000.00),(16,5,5,2,5000000.00),(17,1,1,2,2400000.00),(18,2,2,2,3000000.00),(19,3,3,1,1400000.00),(20,4,4,2,1600000.00),(21,5,5,2,5000000.00),(22,10,1,5,2500000.00),(23,10,1,5,2500000.00),(24,11,2,5,2500000.00),(25,11,2,5,2500000.00),(26,12,1,5,2500000.00),(27,12,2,5,2500000.00),(28,13,3,5,2500000.00),(29,13,8,5,2500000.00),(30,14,1,5,2500000.00),(31,14,3,5,2500000.00),(32,15,2,5,2500000.00),(33,16,2,5,2500000.00),(34,17,2,5,2500000.00),(35,18,2,5,2500000.00),(36,19,3,2,360000.00),(37,20,4,1,1200000.00),(38,21,9,2,2400000.00),(39,22,2,1,150000.00),(40,23,5,1,1000000.00),(41,24,10,1,1000000.00),(42,25,5,2,2000000.00),(45,28,1,5,750000.00),(46,29,7,5,750000.00),(47,30,7,5,750000.00),(48,31,7,5,750000.00),(49,32,4,2,2400000.00),(50,33,3,0,180000.00),(51,34,8,1,180000.00),(52,35,7,2,300000.00),(53,36,7,5,750000.00),(54,37,7,1,150000.00),(55,38,7,1,150000.00),(56,39,7,1,150000.00),(57,40,5,1,1000000.00),(58,41,7,4,600000.00),(59,42,3,4,720000.00),(60,43,3,8,1440000.00),(61,44,6,1,1500000.00),(62,45,1,1,150000.00),(63,46,2,1,150000.00),(64,47,3,2,360000.00);
/*!40000 ALTER TABLE `chi_tiet_don_dat_xe` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
INSERT INTO `danh_gia` VALUES (1,1,1,4,'Xe Wave Alpha chạy ổn, tiết kiệm xăng','2025-04-07 09:52:25'),(2,2,1,5,'Rất thích Wave Alpha, dễ lái','2025-04-07 09:52:25'),(3,3,2,3,'Sirius mạnh nhưng hơi ồn','2025-04-07 09:52:25'),(4,4,3,5,'Camry thoải mái, sang trọng','2025-04-07 09:52:25'),(5,5,5,4,'Lux A2.0 hiện đại, nhưng sạc lâu','2025-04-07 09:52:25'),(6,6,6,5,'Ninja 300 quá đỉnh, tốc độ cao','2025-04-07 09:52:25'),(7,1,1,5,'Xe rất đẹp, dịch vụ tốt!','2025-04-25 06:31:14'),(8,10,1,5,'Xe rất đẹp, dịch vụ tốt!','2025-05-06 16:37:10'),(9,10,1,1,'Xe tệ','2025-05-06 16:37:35'),(10,10,2,3,'Con này đi hơi sóc, khuyên mọi người đi phượt nên thuê con cào cào','2025-05-06 16:46:22'),(11,1,1,5,'Xe rất đẹp, dịch vụ tốt!','2025-05-06 16:47:45'),(12,13,1,4,'Con này hơi xấu, được cái tốn xăng =))','2025-05-08 07:19:54');
/*!40000 ALTER TABLE `danh_gia` ENABLE KEYS */;
UNLOCK TABLES;

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
  `phuong_thuc_thanh_toan` varchar(255) DEFAULT NULL,
  `tong_tien_landau` decimal(38,2) DEFAULT NULL,
  `trang_thai_thanh_toan` int DEFAULT NULL,
  PRIMARY KEY (`don_dat_xe_id`),
  KEY `khach_hang_id` (`khach_hang_id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  CONSTRAINT `don_dat_xe_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`khach_hang_id`),
  CONSTRAINT `don_dat_xe_ibfk_2` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`nguoi_dung_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_dat_xe`
--

LOCK TABLES `don_dat_xe` WRITE;
/*!40000 ALTER TABLE `don_dat_xe` DISABLE KEYS */;
INSERT INTO `don_dat_xe` VALUES (1,1,2,'2025-04-24 17:00:00','2025-04-30 16:59:59',1500000.00,3,'123 Đường Láng, Hà Nội',NULL,NULL,0),(2,2,1,'2025-04-11 09:00:00','2025-04-13 09:00:00',360000.00,0,'TP.HCM',NULL,NULL,1),(3,3,2,'2025-04-12 10:00:00','2025-04-14 10:00:00',2400000.00,3,'Đà Nẵng',NULL,NULL,0),(4,4,1,'2025-04-13 14:00:00','2025-04-15 14:00:00',2000000.00,2,'Hải Phòng',NULL,NULL,0),(5,5,2,'2025-04-14 15:00:00','2025-04-16 15:00:00',3000000.00,2,'Cần Thơ',NULL,NULL,0),(8,1,2,'2023-11-01 01:00:00','2023-11-05 11:00:00',5000000.00,0,'123 Main Street, City Center',NULL,NULL,0),(10,1,2,'2023-11-01 01:00:00','2023-11-05 11:00:00',5000000.00,0,'123 Main Street, City Center',NULL,NULL,0),(11,1,2,'2023-11-01 01:00:00','2023-11-05 11:00:00',5000000.00,0,'123 Main Street, City Center',NULL,NULL,0),(12,1,2,'2023-11-01 01:00:00','2023-11-05 11:00:00',5000000.00,0,'123 Main Street, City Center',NULL,NULL,0),(13,1,2,'2023-11-01 01:00:00','2023-11-05 11:00:00',5000000.00,0,'123 Main Street, City Center',NULL,NULL,0),(14,1,2,'2023-11-01 01:00:00','2023-11-05 11:00:00',5000000.00,0,'123 Main Street, City Center',NULL,NULL,0),(15,1,2,'2023-11-01 01:00:00','2023-11-05 11:00:00',5000000.00,2,'123 Main Street, City Center',NULL,NULL,0),(16,10,1,'2023-11-01 01:00:00','2023-11-05 11:00:00',5000000.00,4,'123 Main Street, City Center',NULL,NULL,0),(17,10,1,'2023-11-01 01:00:00','2023-11-05 11:00:00',5000000.00,4,'123 Main Street, City Center',NULL,NULL,0),(18,10,1,'2023-11-01 01:00:00','2023-11-05 11:00:00',5000000.00,2,'123 Main Street, City Center',NULL,NULL,0),(19,10,1,'2025-04-07 01:00:00','2025-04-09 11:00:00',360000.00,2,'Hà Nội phúc tân',NULL,NULL,0),(20,10,1,'2003-03-01 01:00:00','2003-03-02 11:00:00',1200000.00,3,'hoàn kiếm ',NULL,NULL,0),(21,10,1,'2025-05-15 01:00:00','2025-05-17 11:00:00',2400000.00,0,'phúc tân hoàn kiếm',NULL,NULL,0),(22,13,1,'2025-05-07 01:00:00','2025-05-08 11:00:00',150000.00,0,'Hà Nội',NULL,NULL,0),(23,10,1,'2025-05-05 01:00:00','2025-05-22 10:00:00',16000000.00,4,'HCM','Tiền mặt',1000000.00,1),(24,10,1,'2025-05-09 01:00:00','2025-05-10 11:00:00',1000000.00,1,'Quang Ninh',NULL,NULL,0),(25,10,1,'2025-05-09 01:00:00','2025-05-11 11:00:00',2000000.00,3,'Hàn quốc','Tiền mặt',2000000.00,0),(28,11,1,'2023-11-01 01:00:00','2023-11-05 11:00:00',7500000.00,0,'123 Main Street, City Center',NULL,7500000.00,0),(29,11,1,'2023-11-01 01:00:00','2023-11-05 11:00:00',7500000.00,0,'123 Main Street, City Center',NULL,7500000.00,0),(30,11,1,'2023-11-01 01:00:00','2023-11-05 11:00:00',7500000.00,0,'123 Main Street, City Center',NULL,7500000.00,0),(31,11,1,'2025-05-11 01:00:00','2025-05-16 11:00:00',7500000.00,0,'123 Main Street, City Center','Tiền mặt',7500000.00,0),(32,10,1,'2025-05-19 01:00:00','2025-05-21 11:00:00',2400000.00,0,'gàdafsd',NULL,2400000.00,0),(33,10,1,'2025-05-11 01:00:00','2025-05-11 11:00:00',180000.00,0,'Hà Nội sài gòn','Chuyển khoản',180000.00,0),(34,10,1,'2025-05-10 01:00:00','2025-05-11 11:00:00',180000.00,0,'Hà Nội sài gòn','Tiền mặt',180000.00,0),(35,10,1,'2025-05-25 01:00:00','2025-05-27 11:00:00',300000.00,0,'ádfasdf','Chuyển khoản',300000.00,0),(36,11,1,'2025-05-28 01:00:00','2025-05-30 10:00:00',7500000.00,4,'123 Main Street, City Center','Tiền mặt',7500000.00,0),(37,10,1,'2025-05-20 01:00:00','2025-05-21 11:00:00',150000.00,0,'ádfasdf','Chuyển khoản',150000.00,0),(38,10,1,'2025-05-18 01:00:00','2025-05-19 11:00:00',150000.00,0,'ádfasdf','Chuyển khoản',150000.00,0),(39,10,1,'2025-06-10 01:00:00','2025-06-11 11:00:00',150000.00,0,'ádfasdf','Chuyển khoản',150000.00,1),(40,10,1,'2025-05-10 01:00:00','2025-05-11 11:00:00',1000000.00,0,'Đầm trấu','Chuyển khoản',1000000.00,1),(41,10,1,'2025-06-15 01:00:00','2025-06-19 11:00:00',600000.00,0,' Thường Tín','Chuyển khoản',600000.00,0),(42,10,1,'2025-06-10 01:00:00','2025-06-14 11:00:00',720000.00,1,'Hà nỘi','Chuyển khoản',720000.00,1),(43,11,1,'2025-06-22 01:00:00','2025-06-30 11:00:00',1440000.00,0,'Phúc Tân ','Chuyển khoản',1440000.00,1),(44,13,1,'2025-05-11 01:00:00','2025-05-12 11:00:00',1500000.00,2,'Cẩm Phả, Quảng Ninh','Tiền mặt',1500000.00,0),(45,14,1,'2025-07-11 01:00:00','2025-07-12 11:00:00',150000.00,0,'Đại học giao thông vận tải ','Tiền mặt',150000.00,0),(46,13,1,'2025-07-11 01:00:00','2025-07-12 11:00:00',150000.00,0,'Đỗ Đức Dục','Tiền mặt',150000.00,0),(47,13,1,'2025-05-14 01:00:00','2025-05-16 11:00:00',360000.00,0,'Thành phố Uông Bí, Tỉnh Quảng Ninh','Tiền mặt',360000.00,0);
/*!40000 ALTER TABLE `don_dat_xe` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hang_xe`
--

LOCK TABLES `hang_xe` WRITE;
/*!40000 ALTER TABLE `hang_xe` DISABLE KEYS */;
INSERT INTO `hang_xe` VALUES (1,'Honda'),(2,'Yamaha'),(3,'Piaggio'),(4,'Suzuki'),(5,'VinFast'),(6,'Kawasaki');
/*!40000 ALTER TABLE `hang_xe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoa_don_gia_han`
--

DROP TABLE IF EXISTS `hoa_don_gia_han`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoa_don_gia_han` (
  `hoa_don_gia_han_id` int NOT NULL AUTO_INCREMENT,
  `don_dat_xe_id` int NOT NULL,
  `ngay_bat_dau_gia_han` datetime NOT NULL,
  `ngay_ket_thuc_gia_han` datetime NOT NULL,
  `tong_tien_gia_han` double NOT NULL,
  `trang_thai_thanh_toan` int DEFAULT '0',
  `phuong_thuc_thanh_toan` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`hoa_don_gia_han_id`),
  KEY `idx_hoa_don_gia_han_don_dat_xe` (`don_dat_xe_id`),
  CONSTRAINT `hoa_don_gia_han_ibfk_1` FOREIGN KEY (`don_dat_xe_id`) REFERENCES `don_dat_xe` (`don_dat_xe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoa_don_gia_han`
--

LOCK TABLES `hoa_don_gia_han` WRITE;
/*!40000 ALTER TABLE `hoa_don_gia_han` DISABLE KEYS */;
INSERT INTO `hoa_don_gia_han` VALUES (1,23,'2025-05-06 11:00:00','2025-05-10 16:59:59',4000000,0,NULL),(2,23,'2025-05-10 16:59:59','2025-05-22 10:00:00',11000000,0,NULL),(3,36,'2025-05-29 11:00:00','2025-05-30 10:00:00',0,0,NULL);
/*!40000 ALTER TABLE `hoa_don_gia_han` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_hang`
--

LOCK TABLES `khach_hang` WRITE;
/*!40000 ALTER TABLE `khach_hang` DISABLE KEYS */;
INSERT INTO `khach_hang` VALUES (1,'Nguyễn Văn A','nva@gmail.com','0909123456','123456'),(2,'Trần Thị B','ttb@gmail.com','0918234567','abc123'),(3,'Lê Văn C','lvc@gmail.com','0937345678','pass123'),(4,'Phạm Thị D','ptd@gmail.com','0946456789','456789'),(5,'Hoàng Văn E','hve@gmail.com','0955567890','qwerty'),(6,'Đỗ Thị F','dtf@gmail.com','0966678901','zxcvbn'),(7,'Nguyen Van A','nguyenvana@example.com','0123456789','password123'),(9,'Nguyen Van Ab','hah@example.com','0123456789','password123'),(10,'Vương Văn Luyện','vuongluyen2003@gmail.com','094831012003','123456'),(11,'ương','chien@gmail.com','2313123','123456'),(12,'dfadf','àdas','àda','àdsa'),(13,'Trần Công Chiến','tcc3281@gmail.com','0966181103','chien1811@'),(14,'Hoàn Khắc Hưng','chudu4321@gmail.com','0948310103','123456');
/*!40000 ALTER TABLE `khach_hang` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loai_xe`
--

LOCK TABLES `loai_xe` WRITE;
/*!40000 ALTER TABLE `loai_xe` DISABLE KEYS */;
INSERT INTO `loai_xe` VALUES (1,'Xe ga'),(2,'Xe số'),(3,'Xe tay côn'),(4,'Xe phân phối lớn');
/*!40000 ALTER TABLE `loai_xe` ENABLE KEYS */;
UNLOCK TABLES;

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
  `mo_ta` varchar(1000) DEFAULT NULL,
  `anhdefault` varchar(255) DEFAULT NULL,
  `soluotdat` int DEFAULT NULL,
  PRIMARY KEY (`mau_xe_id`),
  KEY `hang_xe_id` (`hang_xe_id`),
  KEY `loai_xe_id` (`loai_xe_id`),
  CONSTRAINT `mau_xe_ibfk_1` FOREIGN KEY (`hang_xe_id`) REFERENCES `hang_xe` (`hang_xe_id`),
  CONSTRAINT `mau_xe_ibfk_2` FOREIGN KEY (`loai_xe_id`) REFERENCES `loai_xe` (`loai_xe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mau_xe`
--

LOCK TABLES `mau_xe` WRITE;
/*!40000 ALTER TABLE `mau_xe` DISABLE KEYS */;
INSERT INTO `mau_xe` VALUES (1,'Wave Alpha',1,1,150000,'Xe số phổ thông giá rẻ, bền bỉ, ít hỏng vặt, rất được ưa chuộng ở vùng nông thôn. Động cơ 110cc vừa đủ mạnh, tiết kiệm nhiên liệu và dễ bảo trì. Thiết kế đơn giản nhưng thực dụng. Thích hợp cho học sinh, sinh viên hoặc công việc đi lại hằng ngày.','https://product.hstatic.net/200000560101/product/alpha_490c985a1d364ba4b6dda4207be9ab3a.png',19),(2,'Vision',1,1,180000,'Xe tay ga phổ thông, thiết kế nhỏ gọn và thanh lịch, rất phù hợp với sinh viên và dân văn phòng. Động cơ eSP tiết kiệm nhiên liệu, có chức năng ngắt tạm thời giúp giảm tiêu hao. Vision dễ điều khiển, ít hỏng vặt và chi phí bảo dưỡng thấp. Đây là mẫu xe bán chạy nhất của Honda tại Việt Nam nhiều năm liền.\n\n','https://img.favpng.com/17/9/14/honda-vision-scooter-car-motorcycle-png-favpng-Ld5ukQ2sFg351Ar90T5bRPqMt.jpg',26),(3,' SH\n',1,2,1200000,'Dòng xe tay ga cao cấp mang dáng vẻ sang trọng, lịch lãm và động cơ mạnh mẽ. Trang bị phanh ABS, hệ thống khóa thông minh Smart Key và nhiều tính năng hiện đại. SH được coi là biểu tượng của sự đẳng cấp trong giới xe máy. Mức giá cao nhưng bù lại là cảm giác lái mượt và chất lượng vượt trội.\n\n','https://c0.klipartz.com/pngpicture/91/160/sticker-png-honda-sh-scooter-motorcycle-honda-chf50-honda-scooter-car-motorcycle-vehicle-month-thumbnail.png',23),(4,'Air Blade',1,3,1000000,'Xe tay ga nam thể thao, thiết kế góc cạnh, mạnh mẽ, phù hợp với người trẻ năng động. Air Blade có nhiều phiên bản động cơ (125cc, 150cc), vận hành ổn định và tiết kiệm xăng. Xe còn có cốp rộng và phanh CBS/ABS tùy phiên bản. Là lựa chọn hàng đầu cho nam giới ở đô thị.\n\n','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE7OkCjF_snsacDAjp2RQ0FB8W0V2CNWrhcg&s',14),(5,'Sirius\n',2,2,1500000,'Xe số phổ thông, thiết kế gọn nhẹ, phù hợp với mọi lứa tuổi. Động cơ bền bỉ, dễ bảo trì và rất tiết kiệm nhiên liệu. Sirius có mức giá hợp lý, vận hành linh hoạt trong thành phố. Là mẫu xe bán chạy hàng đầu của Yamaha tại Việt Nam.','https://img.tinxe.vn/crop/730x410/2021/04/26/XForF7yt/yamaha-sirius-phanh-co-4-2822.png',6),(6,'Exciter 155',2,1,500000,'Xe côn tay mạnh mẽ, phong cách thể thao, được giới trẻ yêu thích. Động cơ 155cc VVA mạnh mẽ, đề-pa tốt, mang lại cảm giác lái phấn khích. Trang bị phanh đĩa, ly hợp 6 số và nhiều công nghệ mới. Mệnh danh là “vua đường phố” của xe côn tay Việt Nam.\n\n','https://yamaha-motor.com.vn/wp/wp-content/uploads/2021/06/Ex155-Yellow-Grey-004-1-1024x819.png',6),(7,'NVX',2,1,120000,'Xe tay ga thể thao, động cơ mạnh và thiết kế hầm hố. NVX phù hợp với người yêu thích sự nổi bật và cá tính. Có phiên bản ABS, kết nối điện thoại và cốp rộng. Xe hướng đến nhóm người dùng trẻ trung, năng động.\n\n','https://w7.pngwing.com/pngs/475/515/png-transparent-yamaha-motor-company-scooter-car-auto-expo-yamaha-aerox-yamaha-nvx-155-blue-scooter-car-thumbnail.png',30),(8,'Janus',2,2,1500000,'Xe tay ga nhỏ gọn, tiết kiệm xăng, giá thành thấp. Thiết kế mềm mại, nhẹ nhàng, hướng đến nữ giới. Có tính năng ngắt động cơ tạm thời, vận hành mượt trong phố đông. Rất được ưa chuộng bởi học sinh, sinh viên nữ.','https://yamaha-motor.com.vn/wp/wp-content/uploads/2017/05/Janus-Mat-Blue-004-1.png',20),(9,'Liberty',3,1,1400000,'Thiết kế mang phong cách Ý, thời trang và cao ráo. Động cơ iGet vận hành êm, hệ thống ABS an toàn. Xe phù hợp với người dùng thành thị yêu thích sự khác biệt. Tuy nhiên, mức tiêu thụ nhiên liệu cao hơn xe Nhật.\n\n','https://p7.hiclipart.com/preview/419/675/721/piaggio-liberty-motorcycle-piaggio-beverly-piaggio-nrg-motorcycle.jpg',1),(10,'Medley',3,4,800000,'Xe tay ga cao cấp, động cơ 150cc, trang bị phanh ABS 2 kênh, cốp rộng. Medley là đối thủ cạnh tranh trực tiếp với Honda SH. Vận hành mạnh mẽ, cảm giác lái chắc chắn. Giá thành cao nhưng được đánh giá xứng đáng với tiện ích đi kèm.\n\n','https://p7.hiclipart.com/preview/736/495/659/piaggio-medley-scooter-motorcycle-eicma-scooter-thumbnail.jpg',NULL),(11,'Zip',3,2,2500000,'Mẫu xe nhỏ gọn, phù hợp cho nữ giới. Xe nhẹ, dễ điều khiển và có thiết kế trẻ trung. Tuy không nhiều tính năng nhưng lại tiết kiệm và phù hợp với không gian đô thị hẹp.\n\n','https://p7.hiclipart.com/preview/546/794/567/piaggio-zip-scooter-vespa-motorcycle-scooter.jpg',NULL),(12,'Raider R150\n',4,1,1200000,'Xe côn tay phong cách hyper-underbone, cực kỳ được giới trẻ yêu thích. Động cơ DOHC, 6 cấp số, tua máy cao. Thích hợp với người đam mê tốc độ và thích độ xe. Ngoại hình cá tính, nổi bật giữa phố.\n\n','https://mc.suzuki.com.ph/wp-content/uploads/2023/11/10-2-1024x768.png',NULL),(13,'Satria F150',4,2,1500000,'Phiên bản nhập khẩu của Raider tại thị trường Indonesia. Thiết kế gần giống Raider nhưng được tinh chỉnh nhẹ. Động cơ mạnh và độ bền được đánh giá cao. Xe hiếm hơn nên phù hợp cho người thích sự độc lạ.\n\n','https://w7.pngwing.com/pngs/653/18/png-transparent-suzuki-raider-150-suzuki-satria-motorcycle-underbone-eco-house-logo-scooter-car-motorcycle.png',NULL),(14,'Address',4,1,1400000,'Xe tay ga nhỏ gọn, tiết kiệm xăng, phù hợp di chuyển hằng ngày. Có cốp rộng, trọng lượng nhẹ và dễ điều khiển. Mức giá rẻ hơn nhiều so với các đối thủ từ Honda, Yamaha.\n\n','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpO52Cre-PMsFBOQcoDT2Qr-LbzW0WaasflQ&s',NULL),(15,'Feliz S',5,4,800000,'Xe máy điện có thiết kế đơn giản, phù hợp với nhu cầu đi lại trong thành phố. Động cơ đặt giữa, vận hành êm, không tiếng ồn. Tốc độ tối đa khoảng 80 km/h, pin lithium cho quãng đường dài. Giá mềm hơn Klara và phù hợp với đại đa số người dùng.','https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw0933a87c/images/PDP-XMD/felizs/img-top-felizs-white.webp',NULL),(16,'Klara S\n',5,2,2500000,'Xe điện cao cấp, thiết kế sang trọng, tích hợp công nghệ kết nối thông minh. Có khả năng chống nước tốt, pin sạc nhanh, bền bỉ. Klara hướng đến người dùng thành thị, yêu thích sản phẩm thân thiện môi trường.\n\n','https://vinfasts.com.vn/wp-content/uploads/2024/10/img-top-klaras-red-1-1.webp',NULL),(17,'Evo 200',5,1,100000,'Mẫu xe điện nhỏ gọn, giá rẻ nhất trong dòng VinFast. Tốc độ tối đa khoảng 70 km/h, phù hợp với học sinh, sinh viên. Thiết kế trẻ trung, tiện dụng, dễ sử dụng cho người mới lái.\n\n','https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwb91ce4b4/images/PDP-XMD/evo200/img-evo-black.png',NULL),(18,'Ninja ZX-10R',6,1,1200,'Xe mô tô phân khối lớn thuộc dòng sportbike. Động cơ mạnh mẽ, thiết kế khí động học, trang bị nhiều công nghệ hiện đại. Phù hợp cho những tay lái chuyên nghiệp yêu thích đường đua.\n\n','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0AbCnBfKltlF1zJD391_F5DSqmRi-l3nAcA&s',NULL),(19,'Z1000',6,1,12000,'Dòng naked-bike nổi tiếng với ngoại hình cực ngầu, tiếng pô uy lực. Động cơ 1043cc, vận hành cực mạnh, không dành cho người mới. Là biểu tượng phân khối lớn ở Việt Nam suốt một thời gian dài.\n\n','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAVXsKAtMVATFWvfOW5ZpCcS-NawAqyNXJYg&s',NULL),(20,'Ninja 400\n',6,1,150000,'Sportbike tầm trung, phù hợp cho người mới chơi mô tô. Thiết kế đẹp, động cơ vừa đủ mạnh, dễ làm quen. Xe phổ biến trong cộng đồng biker nhờ giá hợp lý và thương hiệu mạnh.\n\n','https://p7.hiclipart.com/preview/878/621/217/kawasaki-ninja-400-kawasaki-motorcycles-kawasaki-ninja-300-yamaha-yzf-r3-motorcycle.jpg',NULL);
/*!40000 ALTER TABLE `mau_xe` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES (1,'Admin 1','admin1@gmail.com','admin123','0'),(2,'Admin 2','admin2@gmail.com','admin456','0'),(3,'Chủ xe 1','chuxe1@gmail.com','chu123','1'),(4,'Chủ xe 2','chuxe2@gmail.com','chu456','1'),(5,'Chủ xe 3','chuxe3@gmail.com','chu789','1'),(6,'Nguyen Van A','nguyenvana@example.com','123456',NULL),(8,'Nguyen Van B','nguyenvana1@example.com','123456',NULL),(9,'Nguyen Van B','kk1@example.com','123456',NULL),(10,'Nguyen Van B','k1@example.com','123456',NULL),(12,'Nguyen Van B','1@example.com','123456',NULL),(13,'Nguyen Van B','1a@example.com','123456',NULL),(15,'Nguyen Van B','a@example.com','123456','1'),(16,'Nguyen Van B','aaa@example.com','123456','1'),(21,'Nguyen Van B','a1@example.com','123456','1'),(24,'Nguyen Van B','a2@example.com','123456','1'),(25,'Nguyen Van B','a3@example.com','123456','Admin'),(26,'Nguyen Van B','vuongluye@example.com','123456',NULL),(27,'Nguyen Van B','vuongluyel@example.com','123456',NULL),(30,'hcienes trần','vuongluyea@example.com','123456',NULL),(31,'asdfasdfa afdssadf a','chiếna@example.com','123456',NULL),(32,'ADMIN','admin@example.com','123456',NULL);
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `nguoi_dung_vai_tro`
--

LOCK TABLES `nguoi_dung_vai_tro` WRITE;
/*!40000 ALTER TABLE `nguoi_dung_vai_tro` DISABLE KEYS */;
INSERT INTO `nguoi_dung_vai_tro` VALUES (26,'ADMIN'),(27,'USER'),(30,'USER'),(31,'ADMIN'),(31,'USER'),(32,'ADMIN');
/*!40000 ALTER TABLE `nguoi_dung_vai_tro` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thong_tin_ky_thuat`
--

LOCK TABLES `thong_tin_ky_thuat` WRITE;
/*!40000 ALTER TABLE `thong_tin_ky_thuat` DISABLE KEYS */;
INSERT INTO `thong_tin_ky_thuat` VALUES (1,1,'110cc',110,'Xăng'),(2,2,'115cc',115,'Xăng'),(3,3,'V6 3.5L',3500,'Xăng'),(4,4,'1.6L',1600,'Xăng'),(5,5,'Điện 150kW',0,'Điện'),(6,6,'300cc',300,'Xăng'),(7,1,'2.5L 4 xy-lanh',2500,'Xăng'),(8,2,'1.5L Turbo',1500,'Xăng'),(9,3,'2.0L Bi-Turbo',2000,'Diesel'),(10,4,'1.4L 4 xy-lanh',1400,'Xăng'),(11,5,'2.0L Turbo',2000,'Xăng'),(12,1,'2.5L 4 xy-lanh',2500,'Xăng'),(13,2,'1.5L Turbo',1500,'Xăng'),(14,3,'2.0L Bi-Turbo',2000,'Diesel'),(15,4,'1.4L 4 xy-lanh',1400,'Xăng'),(16,5,'2.0L Turbo',2000,'Xăng');
/*!40000 ALTER TABLE `thong_tin_ky_thuat` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xe`
--

LOCK TABLES `xe` WRITE;
/*!40000 ALTER TABLE `xe` DISABLE KEYS */;
INSERT INTO `xe` VALUES (1,'29A1-12345',1,0,'2023-01-01 00:00:00.000000'),(2,'29V1-67890',1,0,'2023-02-01 00:00:00.000000'),(3,'30B6-54321',1,0,'2023-03-01 00:00:00.000000'),(4,'51C5-98765',2,0,'2022-12-15 00:00:00.000000'),(5,'29D5-11111',2,0,'2023-04-10 00:00:00.000000'),(6,'29E2-22222',2,0,'2023-05-20 00:00:00.000000'),(7,'51H2-12345',3,0,'2024-01-10 00:00:00.000000'),(8,'51G6-67890',4,0,'2024-02-15 00:00:00.000000'),(9,'51F1-54321',3,0,'2024-03-20 00:00:00.000000'),(10,'51K1-98765',4,0,'2024-04-25 00:00:00.000000'),(11,'51M1-24680',5,0,'2024-05-30 00:00:00.000000'),(13,'29K1-123.45',5,0,'2024-01-15 08:00:00.000000'),(14,'59H1-234.56',5,0,'2024-02-20 09:00:00.000000'),(15,'43X1-345.67',6,0,'2024-03-10 10:00:00.000000'),(16,'90Y1-456.78',7,0,'2024-04-05 11:00:00.000000'),(17,'29T1-567.89',7,0,'2024-05-12 12:00:00.000000'),(18,'59S1-678.90',7,0,'2024-06-18 13:00:00.000000'),(19,'43P1-789.01',6,0,'2024-07-22 14:00:00.000000'),(20,'90N1-890.12',8,0,'2024-08-30 15:00:00.000000'),(21,'29M1-901.23',8,0,'2024-09-05 16:00:00.000000'),(22,'59L1-012.34',9,0,'2024-10-10 17:00:00.000000'),(23,'43K1-123.46',9,0,'2024-11-15 08:00:00.000000'),(24,'90H1-234.57',10,0,'2024-12-20 09:00:00.000000'),(25,'29G1-345.68',10,0,'2025-01-25 10:00:00.000000'),(26,'59F1-456.79',11,0,'2025-02-28 11:00:00.000000'),(27,'43E1-567.80',11,0,'2025-03-05 12:00:00.000000'),(28,'90D1-678.91',12,0,'2025-04-10 13:00:00.000000'),(29,'29C1-789.02',12,0,'2025-05-15 14:00:00.000000'),(30,'59B1-890.13',13,0,'2025-06-20 15:00:00.000000'),(31,'43A1-901.24',14,0,'2025-07-25 16:00:00.000000'),(32,'90Z1-012.35',13,0,'2025-08-30 17:00:00.000000'),(33,'29Y1-123.47',14,0,'2025-09-05 08:00:00.000000'),(34,'59X1-234.58',15,0,'2025-10-10 09:00:00.000000'),(35,'43W1-345.69',15,0,'2025-11-15 10:00:00.000000'),(36,'90V1-456.70',16,0,'2025-12-20 11:00:00.000000'),(37,'29U1-567.81',17,0,'2024-01-25 12:00:00.000000'),(38,'59T1-678.92',18,0,'2024-02-28 13:00:00.000000'),(39,'43S1-789.03',19,0,'2024-03-05 14:00:00.000000'),(40,'90R1-890.14',20,0,'2024-04-10 15:00:00.000000'),(41,'29Q1-901.25',17,0,'2024-05-15 16:00:00.000000'),(42,'59P1-012.36',16,0,'2024-06-20 17:00:00.000000');
/*!40000 ALTER TABLE `xe` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 23:41:33
