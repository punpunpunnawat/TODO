-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: todo_db
-- ------------------------------------------------------
-- Server version	9.0.1

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('1120d906-d327-4af0-9285-31c9ef31350c','1@e.com','$2a$10$cbSncgKmcerxkofZpgrjFuWoHYwA3dxLrAHZR4LspYbaR6GSPuOTS','2025-05-18 19:17:32'),('24a65313-15ed-411f-99fa-46fbab7f7801','punnawat_punpun9559@hotmail.com','$2a$10$NKv0P88.kKTBp8aDrM1cK.uTy9bsvBBjiDIQz5HnLgIBGH8ORW0b.','2025-05-13 20:20:43'),('34f6c5df-77cb-44e9-80e8-8bcf1473559e','hallza@za.com','$2a$10$7U6ILiVqbxEVoCsRvqOtyuwhtGrChTQCg49w0ekfeLN1gEFo8falO','2025-05-14 02:29:24'),('3c6a9cb6-30cf-48fc-8a66-7655f7e3acb6','x','$2a$10$qWMZPHwUMerJGmBlCKpmxOTUWoHmcfKRw5vusvfYqDhJ8IX5dKQuK','2025-05-18 19:19:30'),('45e01d8d-0383-4bb0-ac60-5e373a07e4ab','PUN@GMAIL>COM','$2a$10$s9RX25ZJ1oGPvBRJlPUXbOZNYfdP9/PUs2ifRLAzAO2ENThUPswDy','2025-07-02 16:58:17'),('5be7bcba-73d9-46b4-bf0e-ae9d80b80215','y','$2a$10$VxOV7D9xP0yZU6tAgAnA8.muPF8YQmjM7O0GX18ZnKhUAh9ENsTI6','2025-05-18 19:20:03'),('7538afe1-feb8-4bfe-95e3-9e212529da9a','oat@gmail.com','$2a$10$R58tQ7/1jkhVcbM5f2Drhu.NMOISvSjojYP7FtEF65JF7jFFXz3bG','2025-05-14 18:05:02'),('76de96ec-0334-4407-8a1e-db0fea5e74dc','mage@example.com','$2a$10$ON8qpEWYtDdoLhN1oR2e0.ZsUwdYXnuCE6K70aFhw4cdWOn6XKY2C','2025-07-04 18:01:37'),('7bddbdcc-2b30-4b51-b160-b43ff4d739ee','some@email.com','$2a$10$T7SN2rbQFhhKgfvzy.i2XudInaEmvLueB6VuyGpniTw2Ueet0zN6.','2025-05-13 21:33:39'),('8440b3f2-4fa8-4cc3-a429-1cfe58d6f451','Not_real@email.com','$2a$10$v9WJ2dLnYVsOXOtzcRHlzeIAPOQ2OUws3wOMjLNMOOMab8jaujsii','2025-05-18 19:11:48'),('a83924fc-9267-49fb-84a3-f4bff45c3506','jane@example.com','password123','2025-05-07 14:45:00'),('accc73ec-c620-4dac-86c3-fda670502553','PUN@GMAIL.COM','$2a$10$jKMA5tRq1H0uysp59Eot9u41VgC79QZkjly/uTBuS2bTe21MNKZaK','2025-07-02 16:59:17'),('b0af5cf9-3e8b-4588-ad7f-bd385b61edb2','64050150@kmitl.ac.th','$2a$10$/YtSBrKEMuFPR1BlMATF2e5T.3DSBOkjln6fO2uMhP74GZaZOtEOy','2025-07-01 16:44:55'),('f47ac10b-58cc-4372-a567-0e02b2c3d479','john@example.com','password123','2025-05-07 14:30:00'),('test-user-id-001','test@example.com','$2b$12$sddo3.v1S42luVfpG2VJMOsdprU3wZfBmUCi1CRnV2rkwyoE4KfvS','2025-05-08 04:00:05');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-04 19:07:05
