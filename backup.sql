-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: my_ecommerce_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add cart',8,'add_cart'),(26,'Can change cart',8,'change_cart'),(27,'Can delete cart',8,'delete_cart'),(28,'Can view cart',8,'view_cart'),(29,'Can add cart item',7,'add_cartitem'),(30,'Can change cart item',7,'change_cartitem'),(31,'Can delete cart item',7,'delete_cartitem'),(32,'Can view cart item',7,'view_cartitem'),(33,'Can add Category',9,'add_category'),(34,'Can change Category',9,'change_category'),(35,'Can delete Category',9,'delete_category'),(36,'Can view Category',9,'view_category'),(37,'Can add Order',10,'add_order'),(38,'Can change Order',10,'change_order'),(39,'Can delete Order',10,'delete_order'),(40,'Can view Order',10,'view_order'),(41,'Can add Order Item',11,'add_orderitem'),(42,'Can change Order Item',11,'change_orderitem'),(43,'Can delete Order Item',11,'delete_orderitem'),(44,'Can view Order Item',11,'view_orderitem'),(45,'Can add Payment',12,'add_payment'),(46,'Can change Payment',12,'change_payment'),(47,'Can delete Payment',12,'delete_payment'),(48,'Can view Payment',12,'view_payment'),(49,'Can add Payment Detail',13,'add_paymentdetail'),(50,'Can change Payment Detail',13,'change_paymentdetail'),(51,'Can delete Payment Detail',13,'delete_paymentdetail'),(52,'Can view Payment Detail',13,'view_paymentdetail'),(53,'Can add Payment Method',14,'add_paymentmethod'),(54,'Can change Payment Method',14,'change_paymentmethod'),(55,'Can delete Payment Method',14,'delete_paymentmethod'),(56,'Can view Payment Method',14,'view_paymentmethod'),(57,'Can add Product',15,'add_product'),(58,'Can change Product',15,'change_product'),(59,'Can delete Product',15,'delete_product'),(60,'Can view Product',15,'view_product'),(61,'Can add Product Promotion',16,'add_productpromotion'),(62,'Can change Product Promotion',16,'change_productpromotion'),(63,'Can delete Product Promotion',16,'delete_productpromotion'),(64,'Can view Product Promotion',16,'view_productpromotion'),(65,'Can add Promotion',17,'add_promotion'),(66,'Can change Promotion',17,'change_promotion'),(67,'Can delete Promotion',17,'delete_promotion'),(68,'Can view Promotion',17,'view_promotion'),(69,'Can add Review',18,'add_review'),(70,'Can change Review',18,'change_review'),(71,'Can delete Review',18,'delete_review'),(72,'Can view Review',18,'view_review'),(73,'Can add Shipping Address',19,'add_shippingaddress'),(74,'Can change Shipping Address',19,'change_shippingaddress'),(75,'Can delete Shipping Address',19,'delete_shippingaddress'),(76,'Can view Shipping Address',19,'view_shippingaddress'),(77,'Can add User',20,'add_users'),(78,'Can change User',20,'change_users'),(79,'Can delete User',20,'delete_users'),(80,'Can view User',20,'view_users'),(81,'Can add user',21,'add_user'),(82,'Can change user',21,'change_user'),(83,'Can delete user',21,'delete_user'),(84,'Can view user',21,'view_user'),(85,'Can add blacklisted token',22,'add_blacklistedtoken'),(86,'Can change blacklisted token',22,'change_blacklistedtoken'),(87,'Can delete blacklisted token',22,'delete_blacklistedtoken'),(88,'Can view blacklisted token',22,'view_blacklistedtoken'),(89,'Can add outstanding token',23,'add_outstandingtoken'),(90,'Can change outstanding token',23,'change_outstandingtoken'),(91,'Can delete outstanding token',23,'delete_outstandingtoken'),(92,'Can view outstanding token',23,'view_outstandingtoken'),(93,'Can add product image',24,'add_productimage'),(94,'Can change product image',24,'change_productimage'),(95,'Can delete product image',24,'delete_productimage'),(96,'Can view product image',24,'view_productimage'),(97,'Can add Token',25,'add_token'),(98,'Can change Token',25,'change_token'),(99,'Can delete Token',25,'delete_token'),(100,'Can view Token',25,'view_token'),(101,'Can add Token',26,'add_tokenproxy'),(102,'Can change Token',26,'change_tokenproxy'),(103,'Can delete Token',26,'delete_tokenproxy'),(104,'Can view Token',26,'view_tokenproxy');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$720000$nJQPgI2yo9dbA7jzD8XEKN$beblQ1V84jb/vMP/9lhdvp4SfkoEVRjKDCPYu7c92mg=',NULL,1,'ecommerce','','','segzykid416@gmail.com',1,1,'2024-07-26 14:37:11.141889'),(2,'pbkdf2_sha256$720000$iAphcdBuqgQPlp9vPeKmiX$aTdBiFxUVu4CM6MGsmotoWIExZ38UQLQqQnYgT8FY5o=','2024-08-12 19:38:05.406623',1,'admin','','','seunakanni417@gmail.com',1,1,'2024-07-29 15:22:23.651591'),(3,'pbkdf2_sha256$720000$2NA3bqyIYbLt908HVMqALZ$QjafusVsZulbip+49oLfYQyvDzE74LAMwhkfV0HcD9c=',NULL,0,'sourceboy','','','',0,1,'2024-08-17 17:37:40.724790');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
INSERT INTO `authtoken_token` VALUES ('519c56034cb06a3d67562598d03e6b93eb6d893a','2024-08-17 18:11:49.578995',3),('91e8f5b06a4b62f6526b2a9937cbb54669b66446','2024-08-10 17:20:58.472484',2);
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'powerbanks','This are all product for powerbanks','2024-08-09 23:36:41'),(2,'games','here is all the games you want','2024-08-10 01:30:56'),(3,'latops','','2024-08-15 03:21:43'),(4,'airpods','','2024-08-15 03:21:55'),(5,'pouches & screen guides','','2024-08-15 03:22:33'),(6,'phones & tablets','','2024-08-15 03:22:55'),(7,'watches','','2024-08-15 03:23:05');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2024-08-09 11:33:29.631008','2','iphone 12',1,'[{\"added\": {}}]',15,2),(2,'2024-08-09 11:54:15.610976','2','iphone 12',3,'',15,2),(3,'2024-08-09 11:58:40.499264','3','iphone 12',1,'[{\"added\": {}}]',15,2),(4,'2024-08-09 12:50:22.724911','3','iphone 12',2,'[{\"changed\": {\"fields\": [\"Image url\"]}}]',15,2),(5,'2024-08-09 13:06:44.684742','3','iphone 12',2,'[{\"changed\": {\"fields\": [\"Description\", \"Stock\"]}}]',15,2),(6,'2024-08-09 13:18:05.914782','3','iphone 12',2,'[]',15,2),(7,'2024-08-09 14:39:32.709311','3','iphone 12',2,'[{\"changed\": {\"fields\": [\"Description\", \"Price\"]}}]',15,2),(8,'2024-08-09 14:59:23.420166','3','iphone 12',2,'[{\"changed\": {\"fields\": [\"Image url\"]}}]',15,2),(9,'2024-08-09 15:16:48.383838','3','iphone 12',2,'[{\"changed\": {\"fields\": [\"Image url\"]}}]',15,2),(10,'2024-08-09 15:18:42.520007','3','iphone 12',2,'[{\"changed\": {\"fields\": [\"Image url\"]}}]',15,2),(11,'2024-08-09 17:05:02.495434','3','iphone 12',2,'[{\"changed\": {\"fields\": [\"Image url\"]}}]',15,2),(12,'2024-08-09 17:05:25.678002','3','iphone 12',2,'[{\"changed\": {\"fields\": [\"Image url\"]}}]',15,2),(13,'2024-08-09 17:22:59.991507','3','iphone 12',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',15,2),(14,'2024-08-09 17:24:07.470667','3','iphone 12',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',15,2),(15,'2024-08-09 18:09:53.972602','3','Razer ultra',2,'[{\"changed\": {\"fields\": [\"Name\", \"Price\"]}}]',15,2),(16,'2024-08-09 18:12:09.005922','3','Razer ultra',2,'[]',15,2),(17,'2024-08-09 18:13:18.786587','4','powerbank',1,'[{\"added\": {}}]',15,2),(18,'2024-08-09 18:13:27.871009','4','powerbank',2,'[]',15,2),(19,'2024-08-09 18:36:41.427538','1','powerbanks',1,'[{\"added\": {}}]',9,2),(20,'2024-08-09 18:36:49.810765','1','powerbanks',2,'[]',9,2),(21,'2024-08-09 18:37:02.534615','4','powerbank',2,'[{\"changed\": {\"fields\": [\"Category\"]}}]',15,2),(22,'2024-08-09 20:30:55.769245','2','games',1,'[{\"added\": {}}]',9,2),(23,'2024-08-09 20:31:01.822478','3','Razer ultra',2,'[{\"changed\": {\"fields\": [\"Category\"]}}]',15,2),(24,'2024-08-09 21:54:01.967827','1','powerbanks',2,'[]',9,2),(25,'2024-08-09 22:35:51.731162','2','games',2,'[]',9,2),(26,'2024-08-10 11:42:18.340560','4','powerbank',2,'[]',15,2),(27,'2024-08-10 13:24:19.639601','1','Image for powerbank',1,'[{\"added\": {}}]',24,2),(28,'2024-08-10 16:19:45.016639','1','Image for powerbank',2,'[]',24,2),(29,'2024-08-10 16:20:14.576716','2','Image for Razer ultra',1,'[{\"added\": {}}]',24,2),(30,'2024-08-10 17:44:31.272773','4','powerbank',2,'[]',15,2),(31,'2024-08-11 15:20:05.867235','4','powerbank',2,'[{\"changed\": {\"fields\": [\"Stock\"]}}]',15,2),(32,'2024-08-11 15:20:16.197773','3','Razer ultra',2,'[{\"changed\": {\"fields\": [\"Stock\"]}}]',15,2),(33,'2024-08-11 16:12:19.749410','2','Image for Razer ultra',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',24,2),(34,'2024-08-11 16:12:39.125250','1','Image for powerbank',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',24,2),(35,'2024-08-11 19:44:01.536728','2','Image for Razer ultra',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',24,2),(36,'2024-08-14 22:21:42.638744','3','latops',1,'[{\"added\": {}}]',9,2),(37,'2024-08-14 22:21:54.531343','4','airpods',1,'[{\"added\": {}}]',9,2),(38,'2024-08-14 22:22:32.643475','5','pouches & screen guides',1,'[{\"added\": {}}]',9,2),(39,'2024-08-14 22:22:54.849065','6','phones & tablets',1,'[{\"added\": {}}]',9,2),(40,'2024-08-14 22:23:05.375271','7','watches',1,'[{\"added\": {}}]',9,2),(41,'2024-08-17 17:24:10.859917','2','sourceboy',3,'',20,2),(42,'2024-08-17 17:24:10.866898','6','sourceboy1',3,'',20,2),(43,'2024-08-17 17:28:07.682631','7','sourceboy',3,'',20,2),(44,'2024-08-18 12:56:23.006493','8','sourceboy',3,'',20,2),(45,'2024-08-18 13:08:23.453535','9','sourceboy',3,'',20,2),(46,'2024-08-21 18:37:09.645190','2','Order object (2)',3,'',10,2),(47,'2024-08-21 18:39:51.448833','3','Order object (3)',3,'',10,2),(48,'2024-08-22 13:42:03.216757','10','sourceboy',3,'',20,2),(49,'2024-08-22 13:56:58.318320','11','sourceboy',3,'',20,2),(50,'2024-08-22 14:05:26.434539','12','sourceboy',3,'',20,2),(51,'2024-08-22 14:24:25.941264','13','sourceboy',3,'',20,2),(52,'2024-08-22 14:26:25.449202','14','sourceboy101',3,'',20,2),(53,'2024-08-22 14:33:23.115849','15','sourceboy',3,'',20,2),(54,'2024-08-22 14:35:27.727106','16','sourceboy',3,'',20,2),(55,'2024-08-22 14:45:41.966399','17','sourceboy',3,'',20,2),(56,'2024-08-22 15:31:52.959820','5','Order object (5)',3,'',10,2),(57,'2024-08-22 16:13:51.829021','18','sourceboy',3,'',20,2),(58,'2024-08-22 16:15:37.954300','4','Order object (4)',3,'',10,2),(59,'2024-08-22 16:15:55.157295','18','sourceboy',3,'',20,2),(60,'2024-08-22 18:02:50.376175','19','sourceboy',3,'',20,2),(61,'2024-08-23 12:04:44.070670','20','sourceboy',3,'',20,2),(62,'2024-08-23 12:10:16.663825','21','sourceboy',3,'',20,2),(63,'2024-08-23 12:12:45.024210','22','sourceboy',3,'',20,2),(64,'2024-08-23 12:17:37.653672','23','sourceboy',3,'',20,2),(65,'2024-08-23 12:18:51.214695','24','sourceboy',3,'',20,2);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(25,'authtoken','token'),(26,'authtoken','tokenproxy'),(5,'contenttypes','contenttype'),(8,'main_app','cart'),(7,'main_app','cartitem'),(9,'main_app','category'),(10,'main_app','order'),(11,'main_app','orderitem'),(12,'main_app','payment'),(13,'main_app','paymentdetail'),(14,'main_app','paymentmethod'),(15,'main_app','product'),(24,'main_app','productimage'),(16,'main_app','productpromotion'),(17,'main_app','promotion'),(18,'main_app','review'),(19,'main_app','shippingaddress'),(21,'main_app','user'),(20,'main_app','users'),(6,'sessions','session'),(22,'token_blacklist','blacklistedtoken'),(23,'token_blacklist','outstandingtoken');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2024-07-26 14:29:23.990321'),(2,'auth','0001_initial','2024-07-26 14:29:25.232394'),(3,'admin','0001_initial','2024-07-26 14:29:25.610440'),(4,'admin','0002_logentry_remove_auto_add','2024-07-26 14:29:25.623443'),(5,'admin','0003_logentry_add_action_flag_choices','2024-07-26 14:29:25.637779'),(6,'contenttypes','0002_remove_content_type_name','2024-07-26 14:29:25.800395'),(7,'auth','0002_alter_permission_name_max_length','2024-07-26 14:29:26.018313'),(8,'auth','0003_alter_user_email_max_length','2024-07-26 14:29:26.127652'),(9,'auth','0004_alter_user_username_opts','2024-07-26 14:29:26.150566'),(10,'auth','0005_alter_user_last_login_null','2024-07-26 14:29:26.336944'),(11,'auth','0006_require_contenttypes_0002','2024-07-26 14:29:26.343026'),(12,'auth','0007_alter_validators_add_error_messages','2024-07-26 14:29:26.369470'),(13,'auth','0008_alter_user_username_max_length','2024-07-26 14:29:26.570280'),(14,'auth','0009_alter_user_last_name_max_length','2024-07-26 14:29:26.718946'),(15,'auth','0010_alter_group_name_max_length','2024-07-26 14:29:26.763972'),(16,'auth','0011_update_proxy_permissions','2024-07-26 14:29:26.780258'),(17,'auth','0012_alter_user_first_name_max_length','2024-07-26 14:29:26.921531'),(18,'sessions','0001_initial','2024-07-26 14:29:26.998317'),(19,'main_app','0001_initial','2024-07-29 15:03:01.953197'),(20,'main_app','0002_user','2024-07-31 13:57:36.427370'),(21,'token_blacklist','0001_initial','2024-08-01 16:44:48.470049'),(22,'token_blacklist','0002_outstandingtoken_jti_hex','2024-08-01 16:44:48.567502'),(23,'token_blacklist','0003_auto_20171017_2007','2024-08-01 16:44:48.598878'),(24,'token_blacklist','0004_auto_20171017_2013','2024-08-01 16:44:48.745995'),(25,'token_blacklist','0005_remove_outstandingtoken_jti','2024-08-01 16:44:48.857083'),(26,'token_blacklist','0006_auto_20171017_2113','2024-08-01 16:44:48.907199'),(27,'token_blacklist','0007_auto_20171017_2214','2024-08-01 16:44:49.355159'),(28,'token_blacklist','0008_migrate_to_bigautofield','2024-08-01 16:44:49.837743'),(29,'token_blacklist','0010_fix_migrate_to_bigautofield','2024-08-01 16:44:49.854299'),(30,'token_blacklist','0011_linearizes_history','2024-08-01 16:44:49.858967'),(31,'token_blacklist','0012_alter_outstandingtoken_user','2024-08-01 16:44:49.874724'),(32,'main_app','0003_alter_product_options','2024-08-09 17:48:40.034721'),(33,'main_app','0004_remove_product_image_url_product_category_and_more','2024-08-09 17:51:22.309213'),(34,'main_app','0005_alter_category_options_productimage','2024-08-10 12:49:37.503094'),(35,'main_app','0006_alter_productimage_table','2024-08-10 13:22:54.366187'),(36,'authtoken','0001_initial','2024-08-10 16:55:16.385264'),(37,'authtoken','0002_auto_20160226_1747','2024-08-10 16:55:16.442135'),(38,'authtoken','0003_tokenproxy','2024-08-10 16:55:16.447121'),(39,'authtoken','0004_alter_tokenproxy_options','2024-08-10 16:55:16.455099'),(40,'main_app','0007_alter_order_options','2024-08-21 11:54:08.651614');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('8ybz9300r3b0e6uuqvuwn6zp06zocw0n','.eJxVjMsOgjAQRf-la9N0RpqhLt37Dc08iqAGEgor4r8rCQvd3nPO3VzmdenzWsucB3MXh-70uwnrs4w7sAeP98nrNC7zIH5X_EGrv01WXtfD_TvoufbfOrUkiaxp9MzWIUUrJXAAaJUwqoSolFi7joATiEDUhKhgBoUQzb0_8Qg4WA:1sYSfG:DGZkN7e_qn3Zm3ZO6kbDsx_gQv8qQk1ghRXrRwvAOtc','2024-08-12 15:51:58.478754'),('s3qchzz0k6kw8ymslh0eqksfqs53x48l','.eJxVjMsOgjAQRf-la9N0RpqhLt37Dc08iqAGEgor4r8rCQvd3nPO3VzmdenzWsucB3MXh-70uwnrs4w7sAeP98nrNC7zIH5X_EGrv01WXtfD_TvoufbfOrUkiaxp9MzWIUUrJXAAaJUwqoSolFi7joATiEDUhKhgBoUQzb0_8Qg4WA:1sdarl:KgLlToSJ34c24FGbUy0gEZ3ukvCKgAkComzLPNC0tFI','2024-08-26 19:38:05.415627');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `main_app_user`
--

DROP TABLE IF EXISTS `main_app_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `main_app_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(254) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main_app_user`
--

LOCK TABLES `main_app_user` WRITE;
/*!40000 ALTER TABLE `main_app_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `main_app_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `shipping_method` varchar(50) NOT NULL,
  `order_note` text,
  `payment_method` varchar(50) NOT NULL,
  `shipping_cost` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,59.97,'2024-07-26 13:44:51','','','','','','','','','',NULL,'',0.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_details`
--

DROP TABLE IF EXISTS `payment_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_details` (
  `payment_detail_id` int NOT NULL AUTO_INCREMENT,
  `payment_id` int NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('success','failure','pending') DEFAULT 'pending',
  `details` text,
  PRIMARY KEY (`payment_detail_id`),
  KEY `payment_id` (`payment_id`),
  CONSTRAINT `payment_details_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_details`
--

LOCK TABLES `payment_details` WRITE;
/*!40000 ALTER TABLE `payment_details` DISABLE KEYS */;
INSERT INTO `payment_details` VALUES (1,1,'txn_1234567890',59.97,'success','Payment completed successfully.');
/*!40000 ALTER TABLE `payment_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `payment_method_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `method_name` varchar(100) NOT NULL,
  `details` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_method_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,1,'Credit Card','**** **** **** 1234','2024-07-26 13:48:15');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  PRIMARY KEY (`payment_id`),
  KEY `order_id` (`order_id`),
  KEY `payment_method_id` (`payment_method_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`payment_method_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,1,59.97,'2024-07-26 13:48:21','completed');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_image`
--

DROP TABLE IF EXISTS `product_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product` (`product_id`),
  CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image`
--

LOCK TABLES `product_image` WRITE;
/*!40000 ALTER TABLE `product_image` DISABLE KEYS */;
INSERT INTO `product_image` VALUES (1,4,'products/additional/razer.jpg','this is anker powerbank'),(2,3,'products/additional/powerbank1.jpg','this is razer ultra');
/*!40000 ALTER TABLE `product_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_promotions`
--

DROP TABLE IF EXISTS `product_promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_promotions` (
  `product_promotion_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `promotion_id` int NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  PRIMARY KEY (`product_promotion_id`),
  KEY `product_id` (`product_id`),
  KEY `promotion_id` (`promotion_id`),
  CONSTRAINT `product_promotions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `product_promotions_ibfk_2` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`promotion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_promotions`
--

LOCK TABLES `product_promotions` WRITE;
/*!40000 ALTER TABLE `product_promotions` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (3,'Razer ultra','Lorem ipsum dolor sit amet,',7000.00,2,2,'2024-08-09 16:58:40','products/razer_eoLMKEh.jpg'),(4,'powerbank','this is a powerbank',1000.00,3,1,'2024-08-09 23:13:19','products/powerbank1_2Bq0x8B.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_applications`
--

DROP TABLE IF EXISTS `promotion_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_applications` (
  `promotion_application_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `promotion_id` int NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  PRIMARY KEY (`promotion_application_id`),
  KEY `order_id` (`order_id`),
  KEY `promotion_id` (`promotion_id`),
  CONSTRAINT `promotion_applications_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `promotion_applications_ibfk_2` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`promotion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_applications`
--

LOCK TABLES `promotion_applications` WRITE;
/*!40000 ALTER TABLE `promotion_applications` DISABLE KEYS */;
INSERT INTO `promotion_applications` VALUES (1,1,1,15.00);
/*!40000 ALTER TABLE `promotion_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `promotion_id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `description` text,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `usage_limit` int DEFAULT NULL,
  `usage_count` int DEFAULT '0',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`promotion_id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (1,'SUMMER21','Summer 2021 Promotion','percentage',15.00,'2024-07-01','2024-08-31',100,0,'active','2024-07-26 13:50:02');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_addresses`
--

DROP TABLE IF EXISTS `shipping_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `shipping_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_addresses`
--

LOCK TABLES `shipping_addresses` WRITE;
/*!40000 ALTER TABLE `shipping_addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipping_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_blacklistedtoken`
--

DROP TABLE IF EXISTS `token_blacklist_blacklistedtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_id` (`token_id`),
  CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_blacklistedtoken`
--

LOCK TABLES `token_blacklist_blacklistedtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_outstandingtoken`
--

DROP TABLE IF EXISTS `token_blacklist_outstandingtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` int DEFAULT NULL,
  `jti` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  KEY `token_blacklist_outs_user_id_83bc629a_fk_auth_user` (`user_id`),
  CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_auth_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=391 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_outstandingtoken`
--

LOCK TABLES `token_blacklist_outstandingtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_outstandingtoken` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzI5OTUyNiwiaWF0IjoxNzIzMjEzMTI2LCJqdGkiOiJjMjk5OWUxZWFmYzQ0YTQ3OWNhY2NjNmQ1N2QwZDZmNCIsInVzZXJfaWQiOjJ9.1qpOZ8TiLVr5X0a6Axc-pD_kSh9Xg2eExpJ34Dg248U','2024-08-09 14:18:46.978456','2024-08-10 14:18:46.000000',2,'c2999e1eafc44a479caccc6d57d0d6f4'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzI5OTUyNiwiaWF0IjoxNzIzMjEzMTI2LCJqdGkiOiI5ZGY3MGY0ODk4ZjU0NjZlYTU5NDkzYjc5NWU3ZTkzYyIsInVzZXJfaWQiOjJ9.h0ipEPsCSJLMXSs8IpxYlE3sGLHf3WbnLhpQ4CfeThM','2024-08-09 14:18:46.969478','2024-08-10 14:18:46.000000',2,'9df70f4898f5466ea59493b795e7e93c'),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzI5OTk0MiwiaWF0IjoxNzIzMjEzNTQyLCJqdGkiOiJmYWMwMTMwNmFmNGM0NWVlOGY3MTZiYzFmMzIyYTAzZSIsInVzZXJfaWQiOjJ9.vh7OUhIXLSezVTRAu1XPQQxEhUt82-Ny85xMhT059iA','2024-08-09 14:25:42.044305','2024-08-10 14:25:42.000000',2,'fac01306af4c45ee8f716bc1f322a03e'),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzI5OTk0MiwiaWF0IjoxNzIzMjEzNTQyLCJqdGkiOiJjMTViNDlhZGQ3MjY0ZTQ3OWZhNjc2ZTIxMjVhZDFiOCIsInVzZXJfaWQiOjJ9.G3MUUPd3Whr0W1_F2Jv5tR5NqA3g8uq3J407zvFFiUA','2024-08-09 14:25:42.106139','2024-08-10 14:25:42.000000',2,'c15b49add7264e479fa676e2125ad1b8'),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzI5OTk5MSwiaWF0IjoxNzIzMjEzNTkxLCJqdGkiOiJlODE5MDU2YjViYzQ0NTdkYTlhZmNjMTIwMzE0YTFlYSIsInVzZXJfaWQiOjJ9.7T9DDZ5_2iL9guJ9Co26N73Uvdc9pQz_kfiyz-2P4HE','2024-08-09 14:26:31.227910','2024-08-10 14:26:31.000000',2,'e819056b5bc4457da9afcc120314a1ea'),(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzI5OTk5MSwiaWF0IjoxNzIzMjEzNTkxLCJqdGkiOiIzNTYyN2FlMmFhY2I0ZmY5OWM4MzRkMzFhNTU1N2NlYyIsInVzZXJfaWQiOjJ9.qnlavBVYsprOG8UsbR5WRA-DbSqShnAk47MTvA_WQCw','2024-08-09 14:26:31.284808','2024-08-10 14:26:31.000000',2,'35627ae2aacb4ff99c834d31a5557cec'),(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDAwNCwiaWF0IjoxNzIzMjEzNjA0LCJqdGkiOiI2NjRiMDkzODhiZGM0YWYzYjkzZGM0NTllOWJhNDJkMSIsInVzZXJfaWQiOjJ9.ietf1F5cDEJG9f9ltWp_sDFxaJSOIEeC-QItcHas-ew','2024-08-09 14:26:44.771625','2024-08-10 14:26:44.000000',2,'664b09388bdc4af3b93dc459e9ba42d1'),(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDAwNCwiaWF0IjoxNzIzMjEzNjA0LCJqdGkiOiJmMjI2YjRmNTBlNGI0ODNmOGQ4MjJiOGZkYjcyNGUxNiIsInVzZXJfaWQiOjJ9.b5lybvoTccbcIYJLpGn8AcsOFV8aeuccx81wEZR5nTI','2024-08-09 14:26:44.809521','2024-08-10 14:26:44.000000',2,'f226b4f50e4b483f8d822b8fdb724e16'),(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDAxMCwiaWF0IjoxNzIzMjEzNjEwLCJqdGkiOiI5M2NkZmFlY2I5YTc0ZWFmYWVlNTA3MmE4NjM3NTFlMyIsInVzZXJfaWQiOjJ9.-JPoKnGj9N5qg55_3eG3_rWoSQKWXyPaq5l7FQzGTHQ','2024-08-09 14:26:50.969254','2024-08-10 14:26:50.000000',2,'93cdfaecb9a74eafaee5072a863751e3'),(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDAxMCwiaWF0IjoxNzIzMjEzNjEwLCJqdGkiOiIxOTVlMzczMTEyZDg0NTExODE5NjAzMGFhMzMyOTc5NSIsInVzZXJfaWQiOjJ9.XB5acmmoEXX8reU3FHImdjkN_E_h0_rKgubxvAlibUg','2024-08-09 14:26:50.975270','2024-08-10 14:26:50.000000',2,'195e373112d845118196030aa3329795'),(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDEzMywiaWF0IjoxNzIzMjEzNzMzLCJqdGkiOiI2MjZiNWUwZmYxZTk0M2NlYjNhMjM2MmMxMzE4ZjgyNCIsInVzZXJfaWQiOjJ9.fEgnHcOU_9_E07LuLKDqqiEqquOG1s_2vVQT-GCniZc','2024-08-09 14:28:53.281558','2024-08-10 14:28:53.000000',2,'626b5e0ff1e943ceb3a2362c1318f824'),(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDEzMywiaWF0IjoxNzIzMjEzNzMzLCJqdGkiOiJlODU2NzczNWQ3NGQ0ZTllOGNkZGUwOWIzMjM3OTVmNyIsInVzZXJfaWQiOjJ9.P-65mpxeSBTp7Idkk_86cNI9jB6BTdwXAZRYOhqI8Es','2024-08-09 14:28:53.406222','2024-08-10 14:28:53.000000',2,'e8567735d74d4e9e8cdde09b323795f7'),(13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDEzNywiaWF0IjoxNzIzMjEzNzM3LCJqdGkiOiIzZjgzMWRlYTU1MWE0YTYxODg3YTY3NzBkZWQzM2FiZiIsInVzZXJfaWQiOjJ9.a1mhb-hszFbUbUvFdG_lvgTS9LVxjThy42Pkq0L45io','2024-08-09 14:28:57.613581','2024-08-10 14:28:57.000000',2,'3f831dea551a4a61887a6770ded33abf'),(14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDEzNywiaWF0IjoxNzIzMjEzNzM3LCJqdGkiOiI1ZDkyNzBlMjQ1YTk0ZmZjODZmMjhmN2M2ZjIxZTZhMCIsInVzZXJfaWQiOjJ9.sYlxp4EUJm-gshz6HTubDOAg-RtZKFqUFB3-dGMcH2A','2024-08-09 14:28:57.738247','2024-08-10 14:28:57.000000',2,'5d9270e245a94ffc86f28f7c6f21e6a0'),(15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDEzOCwiaWF0IjoxNzIzMjEzNzM4LCJqdGkiOiJiZDJkMWIxNmJmNzc0Zjg4OWIyZDlmNzc3MWViMGQ1NSIsInVzZXJfaWQiOjJ9.FPuj9UDAqQw_WfhZBCt6RhA3NxlJJa76dy5sYtyrrpQ','2024-08-09 14:28:58.953996','2024-08-10 14:28:58.000000',2,'bd2d1b16bf774f889b2d9f7771eb0d55'),(16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDEzOSwiaWF0IjoxNzIzMjEzNzM5LCJqdGkiOiI2MDE0MGYwOTkyZGE0ODc4YTYwYjU4NmI5OGE0Y2ZiMCIsInVzZXJfaWQiOjJ9.oMme4JBR9pIiWKraXKrs3h8i71E3pHj7kGHEqm9670U','2024-08-09 14:28:59.169930','2024-08-10 14:28:59.000000',2,'60140f0992da4878a60b586b98a4cfb0'),(17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDEzOSwiaWF0IjoxNzIzMjEzNzM5LCJqdGkiOiJmYzRlZmI1NzAxNzE0OGRhODAwOWE2YTAxMmUwOWQ4ZSIsInVzZXJfaWQiOjJ9.dqOQixE6_EknTvLeVGVFpcyiMW8KX1WiOty_lIVGXG0','2024-08-09 14:28:59.430235','2024-08-10 14:28:59.000000',2,'fc4efb57017148da8009a6a012e09d8e'),(18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDEzOSwiaWF0IjoxNzIzMjEzNzM5LCJqdGkiOiJmNDU0NzgyNzAyZjU0YmY1ODE4Njc1NGQwMjQ3ODM1OSIsInVzZXJfaWQiOjJ9.sTuLWOv4hT_UJvaYUw0faTufAUJ777zucm0M03Pc50E','2024-08-09 14:28:59.499084','2024-08-10 14:28:59.000000',2,'f454782702f54bf58186754d02478359'),(19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDE4OCwiaWF0IjoxNzIzMjEzNzg4LCJqdGkiOiIyMTZmMGE3MWE4Y2Y0Mjg2YTEyMDRkMTk2YTYyMjFiMyIsInVzZXJfaWQiOjJ9.UBpDGHhCnEjKxk7BxEVBvi6D69L_mBfNWDYkDW2ltbc','2024-08-09 14:29:48.747609','2024-08-10 14:29:48.000000',2,'216f0a71a8cf4286a1204d196a6221b3'),(20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDE4OCwiaWF0IjoxNzIzMjEzNzg4LCJqdGkiOiI3ZjIxODA3MGFhY2U0MGU5ODMzYTE5MzUzOTNjNWU0NCIsInVzZXJfaWQiOjJ9.QO5HeCBe0IVkqR7HLHDjuEmVSoc19qxOvgnMrSJjvDI','2024-08-09 14:29:48.759805','2024-08-10 14:29:48.000000',2,'7f218070aace40e9833a1935393c5e44'),(21,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDQ2OSwiaWF0IjoxNzIzMjE0MDY5LCJqdGkiOiI2ZWNjNzQ5ZmJjNTc0Y2RmOTAwYzNlM2Y1NzllMWRkYiIsInVzZXJfaWQiOjJ9.sk7L_V7Fp_Fp8YshqQB370zYr2St6axu6Y_iFVLtBNA','2024-08-09 14:34:29.350031','2024-08-10 14:34:29.000000',2,'6ecc749fbc574cdf900c3e3f579e1ddb'),(22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDQ2OSwiaWF0IjoxNzIzMjE0MDY5LCJqdGkiOiIxMDRhNGMzZGMxNWI0ZDNlOTMzMTQxYmI4Y2RjMTM2YyIsInVzZXJfaWQiOjJ9.F3POoqP7_u9d91_LSA0ZJBftIvHtX70BKc3NV-M38UY','2024-08-09 14:34:29.353054','2024-08-10 14:34:29.000000',2,'104a4c3dc15b4d3e933141bb8cdc136c'),(23,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDQ4MCwiaWF0IjoxNzIzMjE0MDgwLCJqdGkiOiI4ZmRlOTQyODk4MzI0YWEzYWQxOTIzMDkzMTY4NjQ0MiIsInVzZXJfaWQiOjJ9.9VLoev_iXul1Se1q479VP33JKFx5yQgDxw0EqPFS10A','2024-08-09 14:34:40.811141','2024-08-10 14:34:40.000000',2,'8fde942898324aa3ad19230931686442'),(24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDQ4MCwiaWF0IjoxNzIzMjE0MDgwLCJqdGkiOiI2NGEyOGJiNDJlMzI0OTY4YjE2MTEzY2EwZjIwN2ZiYyIsInVzZXJfaWQiOjJ9.UG2H-Rf1bMxXwiYJFQ1UhfqSEfol9xpYHBjds4VXC64','2024-08-09 14:34:40.837074','2024-08-10 14:34:40.000000',2,'64a28bb42e324968b16113ca0f207fbc'),(25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDQ4MSwiaWF0IjoxNzIzMjE0MDgxLCJqdGkiOiI4M2UzM2NkYjJmYzQ0OTZjYTYwZGNlZThhZGU2M2JhOCIsInVzZXJfaWQiOjJ9.rKticCnSrJHgB7J8j_x6JFfUtY1sThJVAM3_dxXFSnI','2024-08-09 14:34:41.708743','2024-08-10 14:34:41.000000',2,'83e33cdb2fc4496ca60dcee8ade63ba8'),(26,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDQ4MSwiaWF0IjoxNzIzMjE0MDgxLCJqdGkiOiJjMGFiYjMzMTI5NzU0NTI3YjRmMjhiZDlmZGVjYmY2NCIsInVzZXJfaWQiOjJ9.Ke0zb8O5splqZDFbSUW5Tfytqbxi_mHjH-LaIbzTSSE','2024-08-09 14:34:41.943156','2024-08-10 14:34:41.000000',2,'c0abb33129754527b4f28bd9fdecbf64'),(27,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDQ4NywiaWF0IjoxNzIzMjE0MDg3LCJqdGkiOiJlN2UzYThkNTVhOTA0ZTBiYjJmMDM0ZDkyOWY1MjgyYiIsInVzZXJfaWQiOjJ9.1LhEQ5eFjOImkpG8o1qOtee1BKdKsRAspy4MTzigU1Q','2024-08-09 14:34:47.954886','2024-08-10 14:34:47.000000',2,'e7e3a8d55a904e0bb2f034d929f5282b'),(28,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDQ4NywiaWF0IjoxNzIzMjE0MDg3LCJqdGkiOiJkNDJjOGM3MjU0ZjQ0ODY5YjgwMzkyMzhhOGI3MmQzNiIsInVzZXJfaWQiOjJ9.Z4f5na_RA1ml9T9j8-LtVBH2lBC_aUgohOX5wRqUnsI','2024-08-09 14:34:47.958728','2024-08-10 14:34:47.000000',2,'d42c8c7254f44869b8039238a8b72d36'),(29,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDYzMCwiaWF0IjoxNzIzMjE0MjMwLCJqdGkiOiJmNWRkNzQwZGFjM2E0YWUzODNjMmVjNTg0ZDA1NGRjNiIsInVzZXJfaWQiOjJ9.1PkIhYnPD3sWjdFFQ6uGL_1crb_owr8zPe_3cQFjULI','2024-08-09 14:37:10.217982','2024-08-10 14:37:10.000000',2,'f5dd740dac3a4ae383c2ec584d054dc6'),(30,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDYzMCwiaWF0IjoxNzIzMjE0MjMwLCJqdGkiOiJkYjhkMzEwYzQxNDE0NDdhYWRhMDlhYjJmMjNlYzVjMSIsInVzZXJfaWQiOjJ9._Isyy3GLN6GGWhjquj3uMwJ2RClsmbGxbjbYN58kpoc','2024-08-09 14:37:10.220194','2024-08-10 14:37:10.000000',2,'db8d310c4141447aada09ab2f23ec5c1'),(31,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDY2NSwiaWF0IjoxNzIzMjE0MjY1LCJqdGkiOiI0YTc3ZDkzMTZkYTQ0YjU3YjdmN2FjMmU4MTA0ZDFhMCIsInVzZXJfaWQiOjJ9.TP8AVhe2Ta6eKTocbVBbw73bxkCve7codtcCujVuy5U','2024-08-09 14:37:45.313044','2024-08-10 14:37:45.000000',2,'4a77d9316da44b57b7f7ac2e8104d1a0'),(32,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDY2NSwiaWF0IjoxNzIzMjE0MjY1LCJqdGkiOiI0ZDU3N2NiYzljODU0OWNkYTE5YjQ5YTk4MDIzYzllNCIsInVzZXJfaWQiOjJ9.-vk9Ca4CcfRR-h_k2hFDaN_KpnoM7Bi41tdDWIi7HD8','2024-08-09 14:37:45.333989','2024-08-10 14:37:45.000000',2,'4d577cbc9c8549cda19b49a98023c9e4'),(33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDY5MiwiaWF0IjoxNzIzMjE0MjkyLCJqdGkiOiI5Nzc3MTFiYjlhYjY0ODNlYjJmZjgwMzYwNzU3NjNiZCIsInVzZXJfaWQiOjJ9.nsPWywiWrStEXt5-Rmv4Plrho0pvOh4dS_xzLJZyClk','2024-08-09 14:38:12.400900','2024-08-10 14:38:12.000000',2,'977711bb9ab6483eb2ff8036075763bd'),(34,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDY5MiwiaWF0IjoxNzIzMjE0MjkyLCJqdGkiOiIyODliNzAwMDk5MDE0NTQ1YjU0YjY1YmVlNjk4ZWMyZiIsInVzZXJfaWQiOjJ9.fjZ8Fo3H0BpTbP00fqS2Jfyfz9zS0VcSCVhvLoa0Ngg','2024-08-09 14:38:12.448772','2024-08-10 14:38:12.000000',2,'289b700099014545b54b65bee698ec2f'),(35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDc4MSwiaWF0IjoxNzIzMjE0MzgxLCJqdGkiOiIxNTQ1YzRkNDMxZjY0ZmIzYjFkZjQ4NDUzOGUwNzVhNyIsInVzZXJfaWQiOjJ9.y8CDa64I-hT1P5K2y8ebi2MExE7gfbkZ3Gli0dUsUC4','2024-08-09 14:39:41.463361','2024-08-10 14:39:41.000000',2,'1545c4d431f64fb3b1df484538e075a7'),(36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDc4MSwiaWF0IjoxNzIzMjE0MzgxLCJqdGkiOiIxZDdkMzFmN2I3ZTA0YmUzOWRmODZjYjlmMDllYjU0NyIsInVzZXJfaWQiOjJ9.thWKAMZ3Q1vZIUO2T9tGoQsoqGFHS5G2-yY7ancAKvc','2024-08-09 14:39:41.468348','2024-08-10 14:39:41.000000',2,'1d7d31f7b7e04be39df86cb9f09eb547'),(37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDc4NSwiaWF0IjoxNzIzMjE0Mzg1LCJqdGkiOiJhNWM3ZDhkNGIyNWI0ZDgzYjc3MDkzZmIxMzQ3ZGE1ZSIsInVzZXJfaWQiOjJ9.yCNgQz8ucRxMxI55AD47Vioa07ewltgI80AwUNjM2Ew','2024-08-09 14:39:45.947737','2024-08-10 14:39:45.000000',2,'a5c7d8d4b25b4d83b77093fb1347da5e'),(38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDc4NSwiaWF0IjoxNzIzMjE0Mzg1LCJqdGkiOiIzMjMxNjgyMGU5M2E0ODkyYjVmYWM1OGVmYTRiY2QzYyIsInVzZXJfaWQiOjJ9.qTog8_cvdXPPvPsbVuO3h6XmHmv26YYfiDDXwr8Qktc','2024-08-09 14:39:45.990628','2024-08-10 14:39:45.000000',2,'32316820e93a4892b5fac58efa4bcd3c'),(39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDc4NywiaWF0IjoxNzIzMjE0Mzg3LCJqdGkiOiJkODM2YTc3MmU0YmI0NzE3YjU4M2Y1MmMyN2YyNDRiNyIsInVzZXJfaWQiOjJ9.G8nDU-Y0LICnbvVWSCwj8QMLeaDGjx28okXdvYjU-d0','2024-08-09 14:39:47.271716','2024-08-10 14:39:47.000000',2,'d836a772e4bb4717b583f52c27f244b7'),(40,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMDc4NywiaWF0IjoxNzIzMjE0Mzg3LCJqdGkiOiIxNTkxYWFmYjUyZjA0ZmNhYWMzNmVhNjgzZDcxZjdlMiIsInVzZXJfaWQiOjJ9.yijlA_FrJhj5fbTr6leXEMPpOyHrVIZ8lZy7wYRMifM','2024-08-09 14:39:47.630757','2024-08-10 14:39:47.000000',2,'1591aafb52f04fcaac36ea683d71f7e2'),(41,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMTI4NSwiaWF0IjoxNzIzMjE0ODg1LCJqdGkiOiJkODY5YTEyZmQwMDc0MGEzYTIyNDJmMjhiODhkMWUwYiIsInVzZXJfaWQiOjJ9.33azA8-fobFGcOmZPTw-QDMg_T9WoS8PiWmsXmUIRds','2024-08-09 14:48:05.073615','2024-08-10 14:48:05.000000',2,'d869a12fd00740a3a2242f28b88d1e0b'),(42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMTI4NSwiaWF0IjoxNzIzMjE0ODg1LCJqdGkiOiJmZTAxMzg5OThmN2Y0ZThiOWFjYWY0ODFkMjA0NDBkYyIsInVzZXJfaWQiOjJ9.JR57xPXwgN6yTayw4LbtRkfBGnRJAs_KdYCXGpC_Pi4','2024-08-09 14:48:05.091566','2024-08-10 14:48:05.000000',2,'fe0138998f7f4e8b9acaf481d20440dc'),(43,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMTk3MiwiaWF0IjoxNzIzMjE1NTcyLCJqdGkiOiI4MTA1NmZiZTBhZGQ0N2VlOTBjMDE2N2I3YmYwZjI4MiIsInVzZXJfaWQiOjJ9.CZ5sWODUErKbhXarsl9wGE2JGuX6V8P4BAqscTQhRNo','2024-08-09 14:59:32.762465','2024-08-10 14:59:32.000000',2,'81056fbe0add47ee90c0167b7bf0f282'),(44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMTk3MiwiaWF0IjoxNzIzMjE1NTcyLCJqdGkiOiI1ZWQwNDhhMmEyNWU0N2RkOTJkNzFkNTgxM2I1YzZiOSIsInVzZXJfaWQiOjJ9.f_lYGRrgLzBxIyHvvQ3NuLANTw7XdaLoKaDwRrmKq2c','2024-08-09 14:59:32.780419','2024-08-10 14:59:32.000000',2,'5ed048a2a25e47dd92d71d5813b5c6b9'),(45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMjE4NSwiaWF0IjoxNzIzMjE1Nzg1LCJqdGkiOiJmNzM5MjliNGJiMmI0MTY2YTEwYjI0ZjE5NGQ4Y2M4YyIsInVzZXJfaWQiOjJ9.Xwc9EsgZz26jq-bbaRGl_4BR-nVo5joTqXL9GmgCPRg','2024-08-09 15:03:05.640098','2024-08-10 15:03:05.000000',2,'f73929b4bb2b4166a10b24f194d8cc8c'),(46,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMjE4NSwiaWF0IjoxNzIzMjE1Nzg1LCJqdGkiOiIzZmE4N2MwYWY3OWU0ODBjOTIxNjk0ZWE4ODYyNTg5ZCIsInVzZXJfaWQiOjJ9.Sd4T7TvULmuENwn-faUWmKThvsK-_7yZ6FUEOWpbfKQ','2024-08-09 15:03:05.644033','2024-08-10 15:03:05.000000',2,'3fa87c0af79e480c921694ea8862589d'),(47,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMjE5MCwiaWF0IjoxNzIzMjE1NzkwLCJqdGkiOiI2YmE3NDgyMWYyYTY0ZWY4YTMxYmQzNjlmZDFlNWVmYiIsInVzZXJfaWQiOjJ9.rmAvRbraJKeKMDRf1qQv37ihL1WxvLjI-e-YdwVvzxM','2024-08-09 15:03:10.062409','2024-08-10 15:03:10.000000',2,'6ba74821f2a64ef8a31bd369fd1e5efb'),(48,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMjE5MCwiaWF0IjoxNzIzMjE1NzkwLCJqdGkiOiIwM2FlOTI3ZTYxMjU0NWRjOWEzY2ZkNTRhNjJhZGMyNiIsInVzZXJfaWQiOjJ9.3Cn_vd8IwZSZM-y2MBjRF9GC30eEne3DrlTSdeuAHZM','2024-08-09 15:03:10.121248','2024-08-10 15:03:10.000000',2,'03ae927e612545dc9a3cfd54a62adc26'),(49,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMjg5OCwiaWF0IjoxNzIzMjE2NDk4LCJqdGkiOiIwMjhhMWViNTY5ZWI0OGMzOTkyMDNjYWU2Nzk5MmY0YSIsInVzZXJfaWQiOjJ9.dRYHQB2m3EltDu0zCYXbA8tqBwWA1LTtd7B0dM2Q-X8','2024-08-09 15:14:58.206607','2024-08-10 15:14:58.000000',2,'028a1eb569eb48c399203cae67992f4a'),(50,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMjg5OCwiaWF0IjoxNzIzMjE2NDk4LCJqdGkiOiI4ZmFjZmVkM2YxNjM0YmQ1ODlhODRmMGYzYmQyYzU1OCIsInVzZXJfaWQiOjJ9.8f3fBceByvpl_RFy6s0XAlg5qu70ZUg-evkXr-1Tq6o','2024-08-09 15:14:58.427050','2024-08-10 15:14:58.000000',2,'8facfed3f1634bd589a84f0f3bd2c558'),(51,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMzAxNiwiaWF0IjoxNzIzMjE2NjE2LCJqdGkiOiI0N2I4ZWYyMGMzNDE0YjhkYTljOTUwYzVkYjkwYjRiMCIsInVzZXJfaWQiOjJ9.P1YaxpKHAcAz80AUuupCs32IgoeRIScYM84N__w404w','2024-08-09 15:16:56.920414','2024-08-10 15:16:56.000000',2,'47b8ef20c3414b8da9c950c5db90b4b0'),(52,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMzAxNiwiaWF0IjoxNzIzMjE2NjE2LCJqdGkiOiJlMmYxN2QyN2U3YTY0YzExYTQ2OWNmZTA2NmI1MWY2YSIsInVzZXJfaWQiOjJ9.xXMtz9ANRhDDUT0LW1fnyblGGMJLw3E3MFPdXpVauQQ','2024-08-09 15:16:56.947341','2024-08-10 15:16:56.000000',2,'e2f17d27e7a64c11a469cfe066b51f6a'),(53,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMzEzNCwiaWF0IjoxNzIzMjE2NzM0LCJqdGkiOiI1Njg1ODAyN2M3Y2Y0Y2ZlYjFlODQ4Y2VhNWNhODk2MSIsInVzZXJfaWQiOjJ9.R76QG2wuMqpHaRId3AaIqBmbD49LdrDSp3eIGpgb5Ug','2024-08-09 15:18:54.232195','2024-08-10 15:18:54.000000',2,'56858027c7cf4cfeb1e848cea5ca8961'),(54,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwMzEzNCwiaWF0IjoxNzIzMjE2NzM0LCJqdGkiOiJiNjRmNDMxYTUxOWM0ZDA3Yjc5Y2YwYWNkNjA5NmE4ZCIsInVzZXJfaWQiOjJ9.DRLUHnVZvdNNSQ1jLYJ_wd8UhRIz-H8Zmnr9RWZQl8M','2024-08-09 15:18:54.249279','2024-08-10 15:18:54.000000',2,'b64f431a519c4d07b79cf0acd6096a8d'),(55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwOTUzNiwiaWF0IjoxNzIzMjIzMTM2LCJqdGkiOiI0MGQ4ODkxY2YyODA0NzBlYmJjM2MwNGYzZjA5OTdiNCIsInVzZXJfaWQiOjJ9.EwwQaLnyk8CRMWdWW0zp60xjJrN-jL4_mrGgMz1cong','2024-08-09 17:05:36.582994','2024-08-10 17:05:36.000000',2,'40d8891cf280470ebbc3c04f3f0997b4'),(56,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwOTUzNiwiaWF0IjoxNzIzMjIzMTM2LCJqdGkiOiJmODk2MTBmY2E5ZjA0OGQ3YWY4YjE0M2U3ZDJhZjIxMSIsInVzZXJfaWQiOjJ9.sbZHelsViwkjimJBesqXPpKV87zLqywh5XeWh2Y25EE','2024-08-09 17:05:36.609922','2024-08-10 17:05:36.000000',2,'f89610fca9f048d7af8b143e7d2af211'),(57,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwOTU0MywiaWF0IjoxNzIzMjIzMTQzLCJqdGkiOiJiZDk4MTliNGJiMmM0MmY5ODAwZDBmNzMyOGY4ZmI5ZCIsInVzZXJfaWQiOjJ9.2jjrYF40Gl9Llx3DGs3Jh-R0CYFbwR24REMGf0AfdBM','2024-08-09 17:05:43.114241','2024-08-10 17:05:43.000000',2,'bd9819b4bb2c42f9800d0f7328f8fb9d'),(58,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwOTU0MywiaWF0IjoxNzIzMjIzMTQzLCJqdGkiOiI3NGFkZDc2YTAzNTY0NDEwYTZhNWZkOTIyOTJmNDI5NyIsInVzZXJfaWQiOjJ9.qICAX0_dfb-qdubuIt-BcqZSt1fVgYiFQvo4v1rabSs','2024-08-09 17:05:43.233922','2024-08-10 17:05:43.000000',2,'74add76a03564410a6a5fd92292f4297'),(59,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwOTU0NCwiaWF0IjoxNzIzMjIzMTQ0LCJqdGkiOiJmOWRjNzJiOTViMTE0NDA1YWY2Y2E4M2Y4YTA0NGZkNyIsInVzZXJfaWQiOjJ9.DjNDQxgeUWzHEu0UZiMg00Jr1WKsWYPU1f8G8I-r4-I','2024-08-09 17:05:44.326001','2024-08-10 17:05:44.000000',2,'f9dc72b95b114405af6ca83f8a044fd7'),(60,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwOTU0NCwiaWF0IjoxNzIzMjIzMTQ0LCJqdGkiOiIxNGI4NDQzZTYzMjE0NDg5YWZmMzQ4NzljZjc4NzM5OSIsInVzZXJfaWQiOjJ9.uBS3YNjWHOfhNrJjmwR8JxhSQmeLwJeSik1dx0GbaMM','2024-08-09 17:05:44.327997','2024-08-10 17:05:44.000000',2,'14b8443e63214489aff34879cf787399'),(61,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwOTU5OSwiaWF0IjoxNzIzMjIzMTk5LCJqdGkiOiJhMTZiYjBjZWNiZTI0ODFlYjlkNjRkYjhiYzBiYTFiMSIsInVzZXJfaWQiOjJ9.xOXRIAHSsnqjNnuJRYjZwjm10im1gmhLEjnyokE0nLE','2024-08-09 17:06:39.648706','2024-08-10 17:06:39.000000',2,'a16bb0cecbe2481eb9d64db8bc0ba1b1'),(62,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMwOTU5OSwiaWF0IjoxNzIzMjIzMTk5LCJqdGkiOiI3NDE1ZjgzYzBiNjA0YmQzOTAzMDgzOWEzOThmMmFhOSIsInVzZXJfaWQiOjJ9.XlGHVRpZoRNNyn1xqLPx1C9sfyjTYhwMLOkau_oTDwA','2024-08-09 17:06:39.664664','2024-08-10 17:06:39.000000',2,'7415f83c0b604bd39030839a398f2aa9'),(63,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMDU5MiwiaWF0IjoxNzIzMjI0MTkyLCJqdGkiOiJjNTY3MWJjMDFiM2M0OGI4ODM0YWRiMzFjNzdjNWQyMyIsInVzZXJfaWQiOjJ9.M1vf8067nZg5aKb1Eg_PhkdIV2xp9YEDIq-ggYsSLHI','2024-08-09 17:23:12.596915','2024-08-10 17:23:12.000000',2,'c5671bc01b3c48b8834adb31c77c5d23'),(64,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMDU5MiwiaWF0IjoxNzIzMjI0MTkyLCJqdGkiOiI5NGE2MDNlMWQ5ZGQ0MDA5YTlhYmRmMGUyMGJmNzZlYyIsInVzZXJfaWQiOjJ9.l_DrpWbq-ew9YPrNNC_OvT34WexvbwJNx28iICE3INQ','2024-08-09 17:23:12.623842','2024-08-10 17:23:12.000000',2,'94a603e1d9dd4009a9abdf0e20bf76ec'),(65,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMDYwMSwiaWF0IjoxNzIzMjI0MjAxLCJqdGkiOiIzZTM1MWM1NGFiMGY0NjliYjQyMWQ0MzIzZjk1Nzc1OSIsInVzZXJfaWQiOjJ9.hsTZrkzq2TMTqLwoC1EA4AIvkVNmmM9oJTMaa14wEfc','2024-08-09 17:23:21.081326','2024-08-10 17:23:21.000000',2,'3e351c54ab0f469bb421d4323f957759'),(66,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMDYwMSwiaWF0IjoxNzIzMjI0MjAxLCJqdGkiOiJhMTljZTBiMzM3OTc0ZjUwOGE2YzVhMjRkNzVkNzc1OSIsInVzZXJfaWQiOjJ9.FLYJ0JoRkAgyTNVoFl5oX_FNwwcff6J7Qpf0x3oyj_M','2024-08-09 17:23:21.100276','2024-08-10 17:23:21.000000',2,'a19ce0b337974f508a6c5a24d75d7759'),(67,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMDY2NCwiaWF0IjoxNzIzMjI0MjY0LCJqdGkiOiIzY2VlMDY5ZDc1N2U0ZWQ2YTc3ZTdiNDZlZDcwOTEyNiIsInVzZXJfaWQiOjJ9.mpZ2-OI7eTML-eC6LU288jyZ7nqptjm151QH_3pIPtk','2024-08-09 17:24:24.476100','2024-08-10 17:24:24.000000',2,'3cee069d757e4ed6a77e7b46ed709126'),(68,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMDY2NCwiaWF0IjoxNzIzMjI0MjY0LCJqdGkiOiJmZTk3ZTgyZjU0YTQ0NTg2YmQ0MjNjMjRkZWY5NzE5MSIsInVzZXJfaWQiOjJ9.MATaHkGYHkyHaj4cVO1nrTZZMco1-NCCiKUzj4QdclQ','2024-08-09 17:24:24.505026','2024-08-10 17:24:24.000000',2,'fe97e82f54a44586bd423c24def97191'),(69,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMDk4MCwiaWF0IjoxNzIzMjI0NTgwLCJqdGkiOiIwMDQxZWEwZmIzNTY0OWIyYjI2M2QxOTIxOTQ2NzcwOSIsInVzZXJfaWQiOjJ9.Lj6bb9IAn2xHJmy2ggcWFewQCOtGRDH0fWzng8eAsjg','2024-08-09 17:29:40.300212','2024-08-10 17:29:40.000000',2,'0041ea0fb35649b2b263d19219467709'),(70,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMDk4MCwiaWF0IjoxNzIzMjI0NTgwLCJqdGkiOiIxZDlmYTdkNDk3NjM0MTQwYWYwZTFlZTQwMWJmYjhiOSIsInVzZXJfaWQiOjJ9.1mxKBrWe2RpbzVGr_0EIbiCz3QZtbJZBjrm-rkR-jaI','2024-08-09 17:29:40.342101','2024-08-10 17:29:40.000000',2,'1d9fa7d497634140af0e1ee401bfb8b9'),(71,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjMxMCwiaWF0IjoxNzIzMjI1OTEwLCJqdGkiOiI0NjM0ZGE1NWFlNDg0MWU0ODVlZjk3NDYxZmEwOThjMiIsInVzZXJfaWQiOjJ9.Y6JV8edOqQOkjADu-azl-Sh5n-5B1kaNIzJwwhzlQBY','2024-08-09 17:51:50.557453','2024-08-10 17:51:50.000000',2,'4634da55ae4841e485ef97461fa098c2'),(72,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjMxMCwiaWF0IjoxNzIzMjI1OTEwLCJqdGkiOiI4MDUwOWMzNWM1YzI0OGUxYjA5ZTZkNjE5MWQ1MWJkNSIsInVzZXJfaWQiOjJ9.DS3-QIXuIXRB25aHUUsbxjKphMpyoF53CkT9ber1h-E','2024-08-09 17:51:50.868675','2024-08-10 17:51:50.000000',2,'80509c35c5c248e1b09e6d6191d51bd5'),(73,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjM1NiwiaWF0IjoxNzIzMjI1OTU2LCJqdGkiOiI2MDVlNjY4MDJjZTY0MjVmOTJmYWM0NmJlMzJlOGRmNiIsInVzZXJfaWQiOjJ9.Et7aZww3DoTixwzPx49yMwqrxkRxFtAozR4c9IRPnvI','2024-08-09 17:52:36.835541','2024-08-10 17:52:36.000000',2,'605e66802ce6425f92fac46be32e8df6'),(74,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjM1NiwiaWF0IjoxNzIzMjI1OTU2LCJqdGkiOiJlMmEwYWMxZjAwYjE0YjYzYTVkZjM4MDg1NDdkMGQ4NCIsInVzZXJfaWQiOjJ9.oUKG2g-WVc7pXSRhD9pA5VHHrGtxta5FBKZmehQorQY','2024-08-09 17:52:36.849504','2024-08-10 17:52:36.000000',2,'e2a0ac1f00b14b63a5df3808547d0d84'),(75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjM2MSwiaWF0IjoxNzIzMjI1OTYxLCJqdGkiOiJmYTJhZGIzYzRhZjk0YWFjYjhkNWMxODA5NGUyZTMwNiIsInVzZXJfaWQiOjJ9.cLpX5cZyLcleki7fiMw3tg20EEjNYNRG4zbmEA685fk','2024-08-09 17:52:41.953566','2024-08-10 17:52:41.000000',2,'fa2adb3c4af94aacb8d5c18094e2e306'),(76,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjM2MiwiaWF0IjoxNzIzMjI1OTYyLCJqdGkiOiJhZTRiY2E0Y2YzZGQ0NDJlYjE1ZTEyNzdhOGJiNTYyOSIsInVzZXJfaWQiOjJ9.GGjFpDiRy1FxsBpvpAb14_X5Uzb2HtAoazNge_cYm7c','2024-08-09 17:52:42.010414','2024-08-10 17:52:42.000000',2,'ae4bca4cf3dd442eb15e1277a8bb5629'),(77,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjM2MiwiaWF0IjoxNzIzMjI1OTYyLCJqdGkiOiJjMWRhZjkzMTRkZTk0YzBjYjM4NjYwZDM2MGZlYTVkMSIsInVzZXJfaWQiOjJ9.zBKRkyhJHAtg4o0fL6_teQDLNi-zHtHi5dBezichW6w','2024-08-09 17:52:42.926706','2024-08-10 17:52:42.000000',2,'c1daf9314de94c0cb38660d360fea5d1'),(78,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjM2MiwiaWF0IjoxNzIzMjI1OTYyLCJqdGkiOiIyNmY0YmY4MjVkZWU0ZDE1YmQ1YjU2NDY4ZGUzYTUzOCIsInVzZXJfaWQiOjJ9.iE9Ni2yq6Aw8WNAeUKLmmHqp-2jPPZt70iNAJVPvpCI','2024-08-09 17:52:42.937673','2024-08-10 17:52:42.000000',2,'26f4bf825dee4d15bd5b56468de3a538'),(79,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjQzMywiaWF0IjoxNzIzMjI2MDMzLCJqdGkiOiJkM2VkYzBlNWU3ZjI0Mjc0YWJkNDE4ZjkwMDQ2NWI5ZSIsInVzZXJfaWQiOjJ9.VT9r9Gw53bAoWNX2oihOFmnK6_ywpIzhVop7ZFg3cfE','2024-08-09 17:53:53.456435','2024-08-10 17:53:53.000000',2,'d3edc0e5e7f24274abd418f900465b9e'),(80,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjQzMywiaWF0IjoxNzIzMjI2MDMzLCJqdGkiOiIxYzE0NDdmYjgzZTk0YjFjYTM0MmNjMmFiMGNiZDIxOCIsInVzZXJfaWQiOjJ9.Ht1nC1xrd12S4bU2VNZkgnLEgZBQl7fpv5FU0h1waLU','2024-08-09 17:53:53.478375','2024-08-10 17:53:53.000000',2,'1c1447fb83e94b1ca342cc2ab0cbd218'),(81,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjU4NiwiaWF0IjoxNzIzMjI2MTg2LCJqdGkiOiI4OGQxNzBjODE2MDM0N2FmYThiZmYxODAyM2MzYjBjOCIsInVzZXJfaWQiOjJ9.zjjXbUyuMZn4vJTEmERXPVZzZJqRBYjLb7blJWiQJtI','2024-08-09 17:56:26.783886','2024-08-10 17:56:26.000000',2,'88d170c8160347afa8bff18023c3b0c8'),(82,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjU4NiwiaWF0IjoxNzIzMjI2MTg2LCJqdGkiOiI5ZDZiYmQ1NmJjZjM0YTg2YTQzN2RhOTYwYTczNmM3YyIsInVzZXJfaWQiOjJ9.6DR_LBnKN_ywApzBKqO38UX9MF_3tmwJsu-Cq4UdlBM','2024-08-09 17:56:26.860732','2024-08-10 17:56:26.000000',2,'9d6bbd56bcf34a86a437da960a736c7c'),(83,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjU5NCwiaWF0IjoxNzIzMjI2MTk0LCJqdGkiOiIzNDM4MzBjNTcwOWQ0ZmM5OTg0ODk3YTUyMDMzN2NkNyIsInVzZXJfaWQiOjJ9.4qeFzvH4OVihEXoIcJMYeE9K9mVUFifecq0te3SycGs','2024-08-09 17:56:34.283635','2024-08-10 17:56:34.000000',2,'343830c5709d4fc9984897a520337cd7'),(84,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMjU5NCwiaWF0IjoxNzIzMjI2MTk0LCJqdGkiOiI0MzVmNGEzYTNlZTE0MjFiOTk0ZDNhOWQ1ZDI3NjFhNCIsInVzZXJfaWQiOjJ9.PY1QxkXjZi2kHqBI-yuGx5ilO6DQEVrg6-fTEJYXUQQ','2024-08-09 17:56:34.286627','2024-08-10 17:56:34.000000',2,'435f4a3a3ee1421b994d3a9d5d2761a4'),(85,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzEwNSwiaWF0IjoxNzIzMjI2NzA1LCJqdGkiOiI5NzQ2YzhjZDgyMDU0MjdkYjQ4MGMxOTAyMzJjMjJjNSIsInVzZXJfaWQiOjJ9.m3HpJLkDujp9ttQXQG0E2STLZwTW95MJF2kzdYf5EWs','2024-08-09 18:05:05.157606','2024-08-10 18:05:05.000000',2,'9746c8cd8205427db480c190232c22c5'),(86,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzEwNSwiaWF0IjoxNzIzMjI2NzA1LCJqdGkiOiJhOTU5MjNjNjllNGE0YTJjYjc5MDBkZDFkYzIzMDFhNCIsInVzZXJfaWQiOjJ9.y8B2ujJCF_NN7v0s72nmXQSeQUZBJum-hp5wGrq2CqI','2024-08-09 18:05:05.202794','2024-08-10 18:05:05.000000',2,'a95923c69e4a4a2cb7900dd1dc2301a4'),(87,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzEzMCwiaWF0IjoxNzIzMjI2NzMwLCJqdGkiOiJkMzcxODVmYjM4MzQ0MzY1YTU4M2QxMWYxNDhhODYyNyIsInVzZXJfaWQiOjJ9.wbQpbGYB0AAYJbd_MIZiMLbMHs69cqmGd6xdYvnzU7U','2024-08-09 18:05:30.841713','2024-08-10 18:05:30.000000',2,'d37185fb38344365a583d11f148a8627'),(88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzEzMCwiaWF0IjoxNzIzMjI2NzMwLCJqdGkiOiIxNWZlNTY4NDJlM2I0OTgxODk0ZGZjNThlYzA1YTAxNSIsInVzZXJfaWQiOjJ9.0nGOv_T0fJd5jiJgRMa9LzMRvdk_tfsyQWGOJlRkxhs','2024-08-09 18:05:30.860907','2024-08-10 18:05:30.000000',2,'15fe56842e3b4981894dfc58ec05a015'),(89,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzQwOCwiaWF0IjoxNzIzMjI3MDA4LCJqdGkiOiI1ZjcxNDhhYjc0M2U0MjFiYWY2NWY3NWFiMjBmNWI3MiIsInVzZXJfaWQiOjJ9.09ppgS_c5OhVOJUdghmYmhe6a0UdYiq0-p2uRAhSKHs','2024-08-09 18:10:08.714776','2024-08-10 18:10:08.000000',2,'5f7148ab743e421baf65f75ab20f5b72'),(90,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzQwOCwiaWF0IjoxNzIzMjI3MDA4LCJqdGkiOiJmMTA3MWQ5YWJkNTM0YzNhOTRiNzllN2NhNDllODY5MiIsInVzZXJfaWQiOjJ9.Z8GmnqM0aB5drQ5ahKv0ufwE5Q57j5PjXHxrGRNayLM','2024-08-09 18:10:08.723812','2024-08-10 18:10:08.000000',2,'f1071d9abd534c3a94b79e7ca49e8692'),(91,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzYyMSwiaWF0IjoxNzIzMjI3MjIxLCJqdGkiOiI2YjE5MTk4MWI0OTA0NDBmYWI4ZjI4MGVlMTYyYWY4NCIsInVzZXJfaWQiOjJ9.QxkjqSoWeie_9Zc-lTM9KysFv3KChDYO_fmzXzR96fY','2024-08-09 18:13:41.804109','2024-08-10 18:13:41.000000',2,'6b191981b490440fab8f280ee162af84'),(92,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzYyMSwiaWF0IjoxNzIzMjI3MjIxLCJqdGkiOiIxZjNlZDUyZmY2Y2E0YjhkODRiODAyMDU1ZGNjN2UwZCIsInVzZXJfaWQiOjJ9.keivlPgWremluw1m1J0b9taDz1RXYu7egDWw2K6mFto','2024-08-09 18:13:41.857964','2024-08-10 18:13:41.000000',2,'1f3ed52ff6ca4b8d84b802055dcc7e0d'),(93,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzY3MCwiaWF0IjoxNzIzMjI3MjcwLCJqdGkiOiJhMzJhMmY4OGQwNDk0NTYxOTY1NWRjOGZiYjI0ZDNjZiIsInVzZXJfaWQiOjJ9.aJJlqFmdKSMyBsRQvcFzx-FwNCtsSeN1O0UIaLx8Zdc','2024-08-09 18:14:30.034439','2024-08-10 18:14:30.000000',2,'a32a2f88d04945619655dc8fbb24d3cf'),(94,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzY3MCwiaWF0IjoxNzIzMjI3MjcwLCJqdGkiOiI1NTY0NWZmY2UxYzI0OGExYWZhYTkwYWMxMWRiYzNhYyIsInVzZXJfaWQiOjJ9.cwVQCiIfVyvM0s0-LxDf7Y82KPbl9XX6-9FUca5FzRA','2024-08-09 18:14:30.044414','2024-08-10 18:14:30.000000',2,'55645ffce1c248a1afaa90ac11dbc3ac'),(95,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzY3MywiaWF0IjoxNzIzMjI3MjczLCJqdGkiOiIxNDMxNDU5MGJjYWU0ZWQyYmY0OTM3N2U2ODZlNDgxOCIsInVzZXJfaWQiOjJ9.wnuJ6Zxh32CIL9lCD1_hjX7pjERlQl76fiCG0y1IiIs','2024-08-09 18:14:33.070119','2024-08-10 18:14:33.000000',2,'14314590bcae4ed2bf49377e686e4818'),(96,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzY3MywiaWF0IjoxNzIzMjI3MjczLCJqdGkiOiI3ZGE0MGYzMmZjYTQ0Zjc2OThhNDg3NzMzODA1MWY0OSIsInVzZXJfaWQiOjJ9.cljdxz0psDlA5pGNmB5966PiGnvNWlGokevaA4NNuS0','2024-08-09 18:14:33.136008','2024-08-10 18:14:33.000000',2,'7da40f32fca44f7698a4877338051f49'),(97,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzY5OCwiaWF0IjoxNzIzMjI3Mjk4LCJqdGkiOiJiNDQyZmEwNGI1MWE0ZWVmYTVkN2FkMTE3ZDAzNWNhNiIsInVzZXJfaWQiOjJ9.tIK3x1WjcZ0FUDN9oMw-OYJS0kMn0P3tHzlkHRfLZyM','2024-08-09 18:14:58.373855','2024-08-10 18:14:58.000000',2,'b442fa04b51a4eefa5d7ad117d035ca6'),(98,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxMzY5OCwiaWF0IjoxNzIzMjI3Mjk4LCJqdGkiOiJkY2UyMDRkODM3MzA0ZDNhODA5Njk3YWFiYWI5MDdlYSIsInVzZXJfaWQiOjJ9.U3sLYsLgrS6OzjSWSp2IQl-Wa43_LlUwLFDD3hvudBQ','2024-08-09 18:14:58.470579','2024-08-10 18:14:58.000000',2,'dce204d837304d3a809697aabab907ea'),(99,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNDUyOCwiaWF0IjoxNzIzMjI4MTI4LCJqdGkiOiI3NTlkYTBiNGFlM2E0NDQ1ODYzOWVhNmEyMWJmZDk5MiIsInVzZXJfaWQiOjJ9.bAVmrs5utkFMLtDUV05x2rpfF7ujMq3VyTdAKCAFc1c','2024-08-09 18:28:48.692728','2024-08-10 18:28:48.000000',2,'759da0b4ae3a44458639ea6a21bfd992'),(100,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNDY4MSwiaWF0IjoxNzIzMjI4MjgxLCJqdGkiOiIxYjU3YzRhMmNmZjk0N2QyOWE2YWY0M2E2MGI2ZjZiZSIsInVzZXJfaWQiOjJ9.qqnYHLax0MEvOkjJD3S1vJgMgvoZkTKrXpgU4E7vuPA','2024-08-09 18:31:21.201399','2024-08-10 18:31:21.000000',2,'1b57c4a2cff947d29a6af43a60b6f6be'),(101,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNDgzMywiaWF0IjoxNzIzMjI4NDMzLCJqdGkiOiJkMmM1NDhiOTI4Y2U0NTMwYTQ5ODQzY2FhYTM4NjU0NiIsInVzZXJfaWQiOjJ9.WBSYkE45yuORVqBMidp5KYTzPxxDPhbC8YQMB8_mHfs','2024-08-09 18:33:53.219509','2024-08-10 18:33:53.000000',2,'d2c548b928ce4530a49843caaa386546'),(102,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNDgzMywiaWF0IjoxNzIzMjI4NDMzLCJqdGkiOiJkZTQ1ZWRmYTY3YWY0MGMyOTk1YTAxZjQ2NmIxMzhjNiIsInVzZXJfaWQiOjJ9.GpaeWbQ6Ct7BQ6nZ8mzuZmlrM23XHhyGFCooU8QO8aQ','2024-08-09 18:33:53.236496','2024-08-10 18:33:53.000000',2,'de45edfa67af40c2995a01f466b138c6'),(103,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNDg0MywiaWF0IjoxNzIzMjI4NDQzLCJqdGkiOiJkOTkxYmMxYTc0Zjg0YzgxODkzNTAzNWExN2U5MjA4MSIsInVzZXJfaWQiOjJ9.LxIUNwshO8TJaeGQaXoVmPZ0rwL57AaoOn56Hr7q1pw','2024-08-09 18:34:03.702772','2024-08-10 18:34:03.000000',2,'d991bc1a74f84c818935035a17e92081'),(104,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNDg0MywiaWF0IjoxNzIzMjI4NDQzLCJqdGkiOiJjYjE1MGZkN2ZhNTQ0MDk0YjJiYWQwYWQxYTg4YTM4MCIsInVzZXJfaWQiOjJ9.tMn2WVV0Kin9i0S13VJzF1iyLv09HehmvY8DX0Djkrc','2024-08-09 18:34:03.708886','2024-08-10 18:34:03.000000',2,'cb150fd7fa544094b2bad0ad1a88a380'),(105,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNDkxMiwiaWF0IjoxNzIzMjI4NTEyLCJqdGkiOiJjNmNhNTYzYzZlNzI0YzA5OGE5NjRlZWZiYjE0NDkxYSIsInVzZXJfaWQiOjJ9.RcpgsJlPYB8CEKudDDhRN-Vb6OuXlU08387pOGllTbA','2024-08-09 18:35:12.567875','2024-08-10 18:35:12.000000',2,'c6ca563c6e724c098a964eefbb14491a'),(106,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNDkxMiwiaWF0IjoxNzIzMjI4NTEyLCJqdGkiOiIxODU0N2NiYTVlYjI0MmM2YTVhMTk2YjgyMGMwY2FkNCIsInVzZXJfaWQiOjJ9.4d2Q6vSiaT3Vdd1Kny2jMrDsyjP20esjOd4f9SRiBKI','2024-08-09 18:35:12.614784','2024-08-10 18:35:12.000000',2,'18547cba5eb242c6a5a196b820c0cad4'),(107,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNDkxNiwiaWF0IjoxNzIzMjI4NTE2LCJqdGkiOiIyZGQ5YmM3NTdhMDg0NzA1YmQ2ZGViOTUzYmMxM2IwOCIsInVzZXJfaWQiOjJ9.fGfMLh7MFXg5jUGfHsQ4lwBYz04P89si70gdDd4B44U','2024-08-09 18:35:16.828490','2024-08-10 18:35:16.000000',2,'2dd9bc757a084705bd6deb953bc13b08'),(108,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNDkxNiwiaWF0IjoxNzIzMjI4NTE2LCJqdGkiOiI0NjZkYmE1NWNiYmM0ZWI2ODg0YTc1YjlmYjU1OTExYSIsInVzZXJfaWQiOjJ9.oc3ZniVyB_T1tMZ1IPvXS4HlxLRG0296elV3eqLrTy4','2024-08-09 18:35:16.835471','2024-08-10 18:35:16.000000',2,'466dba55cbbc4eb6884a75b9fb55911a'),(109,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNTA0NiwiaWF0IjoxNzIzMjI4NjQ2LCJqdGkiOiJlYjBlNzFkOWRhM2U0ZGQxOWM5NzZmM2FmZjkzMDVlNiIsInVzZXJfaWQiOjJ9.A8qO4ku5petu6Tb578oio6CBtnIzu-Fp-55tn1wL-Mw','2024-08-09 18:37:26.394231','2024-08-10 18:37:26.000000',2,'eb0e71d9da3e4dd19c976f3aff9305e6'),(110,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNTA0NiwiaWF0IjoxNzIzMjI4NjQ2LCJqdGkiOiI3NjU3NWEwNTc0MGE0OGE3ODYzN2RkNjkyM2QxYmMzNyIsInVzZXJfaWQiOjJ9.RHQZeOl7pzdPV340BCzQ7IMkiGXRgN1ezEtkQf4R7Zc','2024-08-09 18:37:26.442821','2024-08-10 18:37:26.000000',2,'76575a05740a48a78637dd6923d1bc37'),(111,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNTA2MSwiaWF0IjoxNzIzMjI4NjYxLCJqdGkiOiI0NDQ0NmE0N2JkODc0OTYzODMxMzUzZjQ1YjhmODlhMSIsInVzZXJfaWQiOjJ9.TTuNdQAia44XJx1zjcQ1Vys_mEc-kkvuLXGxVMyV00M','2024-08-09 18:37:41.776934','2024-08-10 18:37:41.000000',2,'44446a47bd874963831353f45b8f89a1'),(112,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNTA2MSwiaWF0IjoxNzIzMjI4NjYxLCJqdGkiOiI2NjJlNmEzNDE1YmQ0ZDk4YWM5NTViNTQzZjcyMmJkYyIsInVzZXJfaWQiOjJ9.lSexeh4aqy7EyYZO2yI-CU2sBsrMhjcuWWzyo1qYYG0','2024-08-09 18:37:41.820610','2024-08-10 18:37:41.000000',2,'662e6a3415bd4d98ac955b543f722bdc'),(113,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNjE5MSwiaWF0IjoxNzIzMjI5NzkxLCJqdGkiOiIyMWFhMDdhNmU0MGU0YWY1YWIyOWRkOTk0ZjA1ODhiZiIsInVzZXJfaWQiOjJ9.bPBS3YNU3Y_uKF20uL2dwcSw6yWcpu8zDMXZ-HeJ5vM','2024-08-09 18:56:31.020593','2024-08-10 18:56:31.000000',2,'21aa07a6e40e4af5ab29dd994f0588bf'),(114,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNjE5MSwiaWF0IjoxNzIzMjI5NzkxLCJqdGkiOiJiZTMyM2JmODhkYzQ0YTRlYmMzNjYxYTEwODM0NzM2YiIsInVzZXJfaWQiOjJ9.USwfgYCz80IvtDDk1iTdQvgQAmHT-KD1Tc7Bu3uM12I','2024-08-09 18:56:31.044531','2024-08-10 18:56:31.000000',2,'be323bf88dc44a4ebc3661a10834736b'),(115,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNjE5OCwiaWF0IjoxNzIzMjI5Nzk4LCJqdGkiOiJkYmM1YjFlNmEwNGI0ZWNiOTZhZDJjYTY0YmYzNmUxYSIsInVzZXJfaWQiOjJ9.0W45ikbeAXVA15GngwOBwieCEf2FJkwby80jl9N_is4','2024-08-09 18:56:38.396080','2024-08-10 18:56:38.000000',2,'dbc5b1e6a04b4ecb96ad2ca64bf36e1a'),(116,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxNjE5OCwiaWF0IjoxNzIzMjI5Nzk4LCJqdGkiOiI5M2I0MWQ0MWI3YWI0NmIyODY4ZDYyMjFhMGU3NmU4NCIsInVzZXJfaWQiOjJ9.z7gWfsk5YaIr704KWcOU-mDWa_iVmkBvGHYkY4DFkmY','2024-08-09 18:56:38.399073','2024-08-10 18:56:38.000000',2,'93b41d41b7ab46b2868d6221a0e76e84'),(117,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxOTA4OCwiaWF0IjoxNzIzMjMyNjg4LCJqdGkiOiI3OTI0OTVmMzc1NzA0OTAxOTE3ZTFlNTU3ODc1ZWFjZiIsInVzZXJfaWQiOjJ9.rqTKwUbifo4Fcc0YRXzFmkffZ3gtC0POxbK7aT5w_X4','2024-08-09 19:44:48.190735','2024-08-10 19:44:48.000000',2,'792495f375704901917e1e557875eacf'),(118,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxOTA4OCwiaWF0IjoxNzIzMjMyNjg4LCJqdGkiOiJkZWUxMGExYmMzNmE0N2U4YmUwYWI1YWRhODg1MWZiYiIsInVzZXJfaWQiOjJ9.7bEAsz-1a1CKUvKRrJ-BdJzGnVt62eRhCIdIR6nNB0o','2024-08-09 19:44:48.231627','2024-08-10 19:44:48.000000',2,'dee10a1bc36a47e8be0ab5ada8851fbb'),(119,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxOTA5MiwiaWF0IjoxNzIzMjMyNjkyLCJqdGkiOiI1ODY5NjRkM2QzN2Y0NGIzYTAwNTU4NmViOTkyMzc5NCIsInVzZXJfaWQiOjJ9.pVrQKhgKQBLjyv0Uot5auYmnRHexN_C0_SH4PPcrvU0','2024-08-09 19:44:52.404900','2024-08-10 19:44:52.000000',2,'586964d3d37f44b3a005586eb9923794'),(120,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMxOTA5MiwiaWF0IjoxNzIzMjMyNjkyLCJqdGkiOiI3YmNiMjQ4ZTA0YzM0OTJiYjUzZGQ3YTE0YzM0N2RlYyIsInVzZXJfaWQiOjJ9.l-jBfBTY3ys9xAHZT4VfA3YxxJWNq81pszjfwnWno4o','2024-08-09 19:44:52.445790','2024-08-10 19:44:52.000000',2,'7bcb248e04c3492bb53dd7a14c347dec'),(121,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMDI3OSwiaWF0IjoxNzIzMjMzODc5LCJqdGkiOiIwYTEyNTdiOTI1YTk0MmNmYWY5Yzg2MTEwMTkxMWZlNiIsInVzZXJfaWQiOjJ9.7PE-tE-N3-wRrGqEzzLXwBTThT4lfzkvwaJcPTKmG5Y','2024-08-09 20:04:39.358819','2024-08-10 20:04:39.000000',2,'0a1257b925a942cfaf9c861101911fe6'),(122,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMDI3OSwiaWF0IjoxNzIzMjMzODc5LCJqdGkiOiI2MDYxMDNkNTBjNzg0OTc2YmJhZDdmZjY0ODE5YTU0MyIsInVzZXJfaWQiOjJ9.gD9Pvd00s48cl-y8iZhlFMFX1XGDF2VrKfYlDooQt94','2024-08-09 20:04:39.379764','2024-08-10 20:04:39.000000',2,'606103d50c784976bbad7ff64819a543'),(123,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMDMxMiwiaWF0IjoxNzIzMjMzOTEyLCJqdGkiOiJkZDBlYzYxMmVmMmQ0MGRmYjZkMmQ5NGNhNmZlYjIzNSIsInVzZXJfaWQiOjJ9.yOMdPrVcyO1Msi0aa5BVxKUo4NVtksHig1xJW6YdKgU','2024-08-09 20:05:12.041051','2024-08-10 20:05:12.000000',2,'dd0ec612ef2d40dfb6d2d94ca6feb235'),(124,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMDMxMiwiaWF0IjoxNzIzMjMzOTEyLCJqdGkiOiI3MmNmOTQ4YzcwMWU0MjY0ODgxNGM0NTJkNDAwNTBkNyIsInVzZXJfaWQiOjJ9.U5z7x_xK2OWkKQEDWFhVWTW0Mj4_HX0FolPiAuin-Kw','2024-08-09 20:05:12.048628','2024-08-10 20:05:12.000000',2,'72cf948c701e42648814c452d40050d7'),(125,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMDYzNywiaWF0IjoxNzIzMjM0MjM3LCJqdGkiOiJkNThiMzIwZjBjNjI0N2NjOWEwMmYzOGYxMjViMTQ2OSIsInVzZXJfaWQiOjJ9.pU5xbtYMDBCYljEEsBoD1cOS9zDTXvEUC2xGwTDIYgY','2024-08-09 20:10:37.206644','2024-08-10 20:10:37.000000',2,'d58b320f0c6247cc9a02f38f125b1469'),(126,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTA5OCwiaWF0IjoxNzIzMjM0Njk4LCJqdGkiOiIyYjVkMzcwODNlYWQ0YmE3YTlhYjIyNjI4ZGUxNGE3NSIsInVzZXJfaWQiOjJ9.NG0062UZGPRI3KM45wsl3B2e75cglMP2aKQkJTwxD7s','2024-08-09 20:18:18.186487','2024-08-10 20:18:18.000000',2,'2b5d37083ead4ba7a9ab22628de14a75'),(127,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTA5OCwiaWF0IjoxNzIzMjM0Njk4LCJqdGkiOiJhODZhNDg3ODJhZjc0MTA4YjZiODhkOTZmY2IyZjY0NCIsInVzZXJfaWQiOjJ9.ngh2KLsaempQ_l8Fpu4Rnmto4eGpUb24-WbvUZqP4vg','2024-08-09 20:18:18.237748','2024-08-10 20:18:18.000000',2,'a86a48782af74108b6b88d96fcb2f644'),(128,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTEwNiwiaWF0IjoxNzIzMjM0NzA2LCJqdGkiOiI3NTJjZGExNjA5NDQ0ODVlOTgyNGNjZDg4ZjIxZDYwOSIsInVzZXJfaWQiOjJ9.VPnnr9JmRM4Ufagh5Qe6B94na0tGfLcekEaE-Nat7o0','2024-08-09 20:18:26.313393','2024-08-10 20:18:26.000000',2,'752cda160944485e9824ccd88f21d609'),(129,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTEwNiwiaWF0IjoxNzIzMjM0NzA2LCJqdGkiOiI1MWE1ZmNkOTI1NGE0MWFhYjA0OGZmM2M0YTg1YzUwMCIsInVzZXJfaWQiOjJ9.2MRWoN3CzE77cFQYu0GwL8D4a39Oe57lkDDyVNOL8h8','2024-08-09 20:18:26.317246','2024-08-10 20:18:26.000000',2,'51a5fcd9254a41aab048ff3c4a85c500'),(130,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTE4NCwiaWF0IjoxNzIzMjM0Nzg0LCJqdGkiOiI1MmRmNTE0ZjkwMWQ0ODAxYWZmMzBiZjIwMGMzOGY5MSIsInVzZXJfaWQiOjJ9.f25dPahDp0y_TN4kaQshQ1WkwSKZSwl_AzqQfdcH_MI','2024-08-09 20:19:44.390528','2024-08-10 20:19:44.000000',2,'52df514f901d4801aff30bf200c38f91'),(131,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTE4NCwiaWF0IjoxNzIzMjM0Nzg0LCJqdGkiOiJhMjNmZTgwOGZiMzY0NTNiYTVjMTdmMzExNGYwYTdhYSIsInVzZXJfaWQiOjJ9.AeY1ydlYjvvHt-3Ho7DMVeQZ2nLaIBQyJ7bU-8hvbu0','2024-08-09 20:19:44.447374','2024-08-10 20:19:44.000000',2,'a23fe808fb36453ba5c17f3114f0a7aa'),(132,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTQyNiwiaWF0IjoxNzIzMjM1MDI2LCJqdGkiOiIyODFjOThkMmU3Y2Q0OGM3YjAxMWFmNmVhZDYxZDM4NSIsInVzZXJfaWQiOjJ9.N2Yso-4uci16eA1p9UjLUe_9rN8w6SL1u2p7xgsfTXY','2024-08-09 20:23:46.228274','2024-08-10 20:23:46.000000',2,'281c98d2e7cd48c7b011af6ead61d385'),(133,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTQyNiwiaWF0IjoxNzIzMjM1MDI2LCJqdGkiOiJhZjg5Y2MyZjQ3ZDg0MTc1OWIyMTk3NDMzZDdlYzY0OCIsInVzZXJfaWQiOjJ9.H1GwuV8IqyyzkXjr0Bi3tDj5uJNf1oRjLogRVW_5SIk','2024-08-09 20:23:46.248259','2024-08-10 20:23:46.000000',2,'af89cc2f47d841759b2197433d7ec648'),(134,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTY0MiwiaWF0IjoxNzIzMjM1MjQyLCJqdGkiOiI4MGQyM2U2MDAwNjI0MTQ2YWYyODNkMTJhZGVmZjUwMiIsInVzZXJfaWQiOjJ9.EwrdYShwCJkfbOVrcXjdKnD_Tm4W6RQwsv21DQ5_a-w','2024-08-09 20:27:22.110955','2024-08-10 20:27:22.000000',2,'80d23e6000624146af283d12adeff502'),(135,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTY0MiwiaWF0IjoxNzIzMjM1MjQyLCJqdGkiOiI2M2I3MjJjNzRmYTc0OWQ5YWI3OTE4YTc5NmYzMjY2MSIsInVzZXJfaWQiOjJ9.IbkBkHzhSHxKpA_1XzA_80s32VwjT4AJTj_mf-_FoCY','2024-08-09 20:27:22.166817','2024-08-10 20:27:22.000000',2,'63b722c74fa749d9ab7918a796f32661'),(136,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTY2MywiaWF0IjoxNzIzMjM1MjYzLCJqdGkiOiJiOGY2YmVlNDRiZDg0NmNlOGUzNWIxMDRmOGM2NjQwMCIsInVzZXJfaWQiOjJ9.zHVIRzyS5oozh-pdew2hGbjE-6jGwpR9YuqVkRMeXkY','2024-08-09 20:27:43.191164','2024-08-10 20:27:43.000000',2,'b8f6bee44bd846ce8e35b104f8c66400'),(137,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTY2MywiaWF0IjoxNzIzMjM1MjYzLCJqdGkiOiI2ZGZiNDc4Y2E1NGM0NTg3YTg5YWNlYmJiYzE3YTJjNCIsInVzZXJfaWQiOjJ9.Dqm8pa-4FuH1xHyPNJ2QyEo2oRgVQvWCCJNoDhgS69g','2024-08-09 20:27:43.254993','2024-08-10 20:27:43.000000',2,'6dfb478ca54c4587a89acebbbc17a2c4'),(138,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTczOCwiaWF0IjoxNzIzMjM1MzM4LCJqdGkiOiI3NDI4OThhYjBlMDY0Zjg0YTI5MmFmMmI2Nzc4ODRmMyIsInVzZXJfaWQiOjJ9.JemS9QvU33V4oASY3FH64INmTNT5c20XZaJDAqlQ9rs','2024-08-09 20:28:58.516815','2024-08-10 20:28:58.000000',2,'742898ab0e064f84a292af2b677884f3'),(139,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTczOCwiaWF0IjoxNzIzMjM1MzM4LCJqdGkiOiIyYzkxNDdjZDFmMjU0ODM2YTdiYWQ4M2MzZGFiZDRkOCIsInVzZXJfaWQiOjJ9.u0dDDE8E8a0ihzaBqNbIncLMR7wHAOQEYXA4K0-Tc-4','2024-08-09 20:28:58.571668','2024-08-10 20:28:58.000000',2,'2c9147cd1f254836a7bad83c3dabd4d8'),(140,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTc0NCwiaWF0IjoxNzIzMjM1MzQ0LCJqdGkiOiI5OWNmOWQ3MjU2NzA0ZDJkYjc0MTQ0MTA3OWZkYzU4NSIsInVzZXJfaWQiOjJ9.zdHWjAS1QqZNfzsQejNANod6xuzRlsdpnT0GAOWNbs4','2024-08-09 20:29:04.982899','2024-08-10 20:29:04.000000',2,'99cf9d7256704d2db741441079fdc585'),(141,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTc0NSwiaWF0IjoxNzIzMjM1MzQ1LCJqdGkiOiJlNTEzNzkzNGZhNTk0MWU5YmYyYmI5NjQzZDVhMjJlMyIsInVzZXJfaWQiOjJ9.baW3yq2dJOvlwHvDEjiMmi0npGSHb3TT-2QaFEExw78','2024-08-09 20:29:05.016756','2024-08-10 20:29:05.000000',2,'e5137934fa5941e9bf2bb9643d5a22e3'),(142,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTc1MCwiaWF0IjoxNzIzMjM1MzUwLCJqdGkiOiIzN2E1M2U1YjEwOTQ0MzRjYWNhM2MxYzk5YzIzZThmYyIsInVzZXJfaWQiOjJ9.OW_tsQhvcolTQ1x36MWzz7aIRwEICTThQhUH8n837GM','2024-08-09 20:29:10.512924','2024-08-10 20:29:10.000000',2,'37a53e5b1094434caca3c1c99c23e8fc'),(143,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTc1MCwiaWF0IjoxNzIzMjM1MzUwLCJqdGkiOiJhZDYwZmE0YjI2ZTM0MjBjODk5YzhjYTA2YWI2MGRhNSIsInVzZXJfaWQiOjJ9.BA_YepAEf9eDAWNjVSfCzKE2NsnC6i-AsOESddQ5tn0','2024-08-09 20:29:10.527886','2024-08-10 20:29:10.000000',2,'ad60fa4b26e3420c899c8ca06ab60da5'),(144,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTg3NiwiaWF0IjoxNzIzMjM1NDc2LCJqdGkiOiI0Mzg3ZjBkNzcyNWU0ZWY0OWM4YjM3OWM2MmM1OTNhMSIsInVzZXJfaWQiOjJ9.fyfAn0b6AvDDCkssSOpRcI3Jajq7MZWt7305YcEw1LE','2024-08-09 20:31:16.647340','2024-08-10 20:31:16.000000',2,'4387f0d7725e4ef49c8b379c62c593a1'),(145,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTg3NiwiaWF0IjoxNzIzMjM1NDc2LCJqdGkiOiIwYzY1YThhNmI0YWM0ZGYzOTRhMGIxYzEzNGZiZDZiMCIsInVzZXJfaWQiOjJ9.oCKhyN2LfEvVL6NszIpUIXTKZ7hT1ule68NJvfLdckU','2024-08-09 20:31:16.659306','2024-08-10 20:31:16.000000',2,'0c65a8a6b4ac4df394a0b1c134fbd6b0'),(146,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTg5NSwiaWF0IjoxNzIzMjM1NDk1LCJqdGkiOiJiZDRmNmU1YmFjMjE0ODI2YTAzN2Q5MjdjNzVkZWViYiIsInVzZXJfaWQiOjJ9.Bz4DoIarHX9YgrPMabee48zeFhGxr3ZlQaSquBAFS24','2024-08-09 20:31:35.930198','2024-08-10 20:31:35.000000',2,'bd4f6e5bac214826a037d927c75deebb'),(147,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTg5NSwiaWF0IjoxNzIzMjM1NDk1LCJqdGkiOiIyNjNhOTY2ZjYzNzU0YWZjOTgxMWMzMThjOTY3MmRkNCIsInVzZXJfaWQiOjJ9.9cZJnev4lPe2u-7nK5A4zntbVyE6U0WuDZZd682MsW8','2024-08-09 20:31:35.993028','2024-08-10 20:31:35.000000',2,'263a966f63754afc9811c318c9672dd4'),(148,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTg5OSwiaWF0IjoxNzIzMjM1NDk5LCJqdGkiOiI3NDcwYWY3NGM3N2E0MWJjYWE2OTMwNzZiNDg4YmQxYyIsInVzZXJfaWQiOjJ9.KForjKPXo2w6xlo3xjlU3dOj4CTDEq-PVdUqFzz6A_4','2024-08-09 20:31:39.610847','2024-08-10 20:31:39.000000',2,'7470af74c77a41bcaa693076b488bd1c'),(149,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMTg5OSwiaWF0IjoxNzIzMjM1NDk5LCJqdGkiOiI0OGE1ZmE3ODVjYTY0ZjExOGQ4ZjMwZjgwZDM2YWIxYSIsInVzZXJfaWQiOjJ9.2TBMGxCPjdUxVaPBdaEVAR3TQqAHA9nxIqLifV7TI8w','2024-08-09 20:31:39.625518','2024-08-10 20:31:39.000000',2,'48a5fa785ca64f118d8f30f80d36ab1a'),(150,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjY4MCwiaWF0IjoxNzIzMjM2MjgwLCJqdGkiOiJiZWI1MzNiOGNjN2M0Y2I2ODI4NmRlZDFiMmRkODFlNSIsInVzZXJfaWQiOjJ9.3h1MmmVtSUpsXXCJZCMOSBHL4ei2bUiC8M6uzHhh01A','2024-08-09 20:44:40.675790','2024-08-10 20:44:40.000000',2,'beb533b8cc7c4cb68286ded1b2dd81e5'),(151,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjY4MCwiaWF0IjoxNzIzMjM2MjgwLCJqdGkiOiJjYTE5ODg3ZGRlZDI0OWMyOGM3YjhiYTc5YzMwZTZkNyIsInVzZXJfaWQiOjJ9.5P4LAJYyghL0wm_QKtyc4JsTvEYt-F18Xzvz3xQOlXM','2024-08-09 20:44:40.707670','2024-08-10 20:44:40.000000',2,'ca19887dded249c28c7b8ba79c30e6d7'),(152,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjY4NywiaWF0IjoxNzIzMjM2Mjg3LCJqdGkiOiJjMGI0ZjU5YTg0YzU0ZmI5ODY0MTlhNGMwMjgyNGViNyIsInVzZXJfaWQiOjJ9.VvG0W-Z71M9AOfqD_Y63ggJ5uTLkZu8PZMjz4GmrpTA','2024-08-09 20:44:47.436196','2024-08-10 20:44:47.000000',2,'c0b4f59a84c54fb986419a4c02824eb7'),(153,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjY4NywiaWF0IjoxNzIzMjM2Mjg3LCJqdGkiOiI2NDJhNTNiODYyMDQ0MWQ5YjAyZjAxM2FkYWMyN2IzMCIsInVzZXJfaWQiOjJ9.ytXiIViwdMAJ2hyx6OlU84LL-dfLgWAKYeT2W4cLuCU','2024-08-09 20:44:47.446276','2024-08-10 20:44:47.000000',2,'642a53b8620441d9b02f013adac27b30'),(154,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjcwOSwiaWF0IjoxNzIzMjM2MzA5LCJqdGkiOiIxMWI2NDMxZGEyNjQ0ODNjYjcyYWE0YmQ2Yzg0MWEyNSIsInVzZXJfaWQiOjJ9.egP55QucOFJaqXFRQVRWSUJbRyuEykX_mZ1ffDFW-zY','2024-08-09 20:45:09.433376','2024-08-10 20:45:09.000000',2,'11b6431da264483cb72aa4bd6c841a25'),(155,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjcwOSwiaWF0IjoxNzIzMjM2MzA5LCJqdGkiOiI5MWNhYmMyNTQxYzQ0ZmNjODgzYzgxY2E1MjBmYjY3MSIsInVzZXJfaWQiOjJ9.cLNi976GqiFOtx55LjaAqMX16P5iinLjukmVJ8mvP6s','2024-08-09 20:45:09.514160','2024-08-10 20:45:09.000000',2,'91cabc2541c44fcc883c81ca520fb671'),(156,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjcyNSwiaWF0IjoxNzIzMjM2MzI1LCJqdGkiOiJhNzNmNTBlZTM1OTQ0YmU2OTkzZmViYTIxZTFhYzQwZCIsInVzZXJfaWQiOjJ9.hzDF4Rf9H27HjoW7lJDgWeTDiYIpzCIwWqB4HmbhkZk','2024-08-09 20:45:25.618926','2024-08-10 20:45:25.000000',2,'a73f50ee35944be6993feba21e1ac40d'),(157,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjcyNSwiaWF0IjoxNzIzMjM2MzI1LCJqdGkiOiIwNmM5ZGE1MGVjNWU0OTFhOWMzYjA5ZjQ3OWE4ZjA4OCIsInVzZXJfaWQiOjJ9.cTabRawvqEXoyenC7mE7ZWSEng_713SV22uT3BOn-uk','2024-08-09 20:45:25.622916','2024-08-10 20:45:25.000000',2,'06c9da50ec5e491a9c3b09f479a8f088'),(158,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjczNSwiaWF0IjoxNzIzMjM2MzM1LCJqdGkiOiI0ZTNhNDEwYTYwYTk0ODgxOGNiNTlhYzE5NDI4NTc1OSIsInVzZXJfaWQiOjJ9.atyMeTsKQb7dttXHKXFHNQVvxCSJV5Ml0irqBDLbCrA','2024-08-09 20:45:35.295790','2024-08-10 20:45:35.000000',2,'4e3a410a60a948818cb59ac194285759'),(159,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjczNSwiaWF0IjoxNzIzMjM2MzM1LCJqdGkiOiI2Y2QzNTA2Mzg3ZGI0YzM0OWE0ZmZlYWIyZGFkZGY2YSIsInVzZXJfaWQiOjJ9.FGnF3cTMZm8vGhWjE6pTvS_Dkhk-WXgLB9ItdZnI3wI','2024-08-09 20:45:35.362560','2024-08-10 20:45:35.000000',2,'6cd3506387db4c349a4ffeab2daddf6a'),(160,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjc1MSwiaWF0IjoxNzIzMjM2MzUxLCJqdGkiOiIxNGJkZmQwNjE0ZTU0MzFmYmJiYzlkNmJjZmMxMzI3MyIsInVzZXJfaWQiOjJ9.QHB1zbp_2KD84P_7xfx4gOTzMgeKCr2pdSscgi853B8','2024-08-09 20:45:51.836380','2024-08-10 20:45:51.000000',2,'14bdfd0614e5431fbbbc9d6bcfc13273'),(161,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjc1MSwiaWF0IjoxNzIzMjM2MzUxLCJqdGkiOiIwZDk1ZjdiNzg0M2Y0MTU4YTZhMTQyMmQzMWU2NWY3ZiIsInVzZXJfaWQiOjJ9.eIk3wnMnt-U5K6biVEDbqbBXji28BRuySSp4AIVauRY','2024-08-09 20:45:51.844322','2024-08-10 20:45:51.000000',2,'0d95f7b7843f4158a6a1422d31e65f7f'),(162,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjg3MiwiaWF0IjoxNzIzMjM2NDcyLCJqdGkiOiJiZDFmOWYyZDU1NGU0MTg3OGFiN2E1ZDYyNTJiNWY5NyIsInVzZXJfaWQiOjJ9.zHiSyFlBJgyZi6I901EiYYFodVbZAWwskPy7yq9AbmI','2024-08-09 20:47:52.434429','2024-08-10 20:47:52.000000',2,'bd1f9f2d554e41878ab7a5d6252b5f97'),(163,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjg3MiwiaWF0IjoxNzIzMjM2NDcyLCJqdGkiOiJjNzJjMjBjN2NlZjg0NmI1YWVkMjc4OThhOWZkZTA4MSIsInVzZXJfaWQiOjJ9.OtGBgW_6tqwECUaS3DO-w-nAlo5JRwHQ7OSIFWHENc4','2024-08-09 20:47:52.445400','2024-08-10 20:47:52.000000',2,'c72c20c7cef846b5aed27898a9fde081'),(164,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjg3OCwiaWF0IjoxNzIzMjM2NDc4LCJqdGkiOiJiZTRmOWFhMDM1NjY0ZWVkOTI1YzcxYmUzZDk2NjZjYyIsInVzZXJfaWQiOjJ9._rtnQfclNC9KAGc28pDqN-4v55e9BXMuyDjWG9a71lU','2024-08-09 20:47:58.189693','2024-08-10 20:47:58.000000',2,'be4f9aa035664eed925c71be3d9666cc'),(165,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjg3OCwiaWF0IjoxNzIzMjM2NDc4LCJqdGkiOiJmODYzMjQ3M2I4MjY0OTU3YjllNjk5N2RlMDI3MjQzOSIsInVzZXJfaWQiOjJ9.egWF3c69E8Os5q24yif_rbiIYySQCk_pfVmSEfot3TA','2024-08-09 20:47:58.286393','2024-08-10 20:47:58.000000',2,'f8632473b8264957b9e6997de0272439'),(166,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjg5NiwiaWF0IjoxNzIzMjM2NDk2LCJqdGkiOiIyNDE2NjZiODllZTY0ZDFhOTJlZjdjYzY5MDI1NTNiMSIsInVzZXJfaWQiOjJ9.L7vX5ZpUIkG2voc6ni62JmHnaiE4xYl_qrLjV7vahIY','2024-08-09 20:48:16.215979','2024-08-10 20:48:16.000000',2,'241666b89ee64d1a92ef7cc6902553b1'),(167,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjg5NiwiaWF0IjoxNzIzMjM2NDk2LCJqdGkiOiIwOWE0OTc2YjY3NDc0NmUxODM1MzhiNThmMGNjNTQwMiIsInVzZXJfaWQiOjJ9.FpieWSB72SGgWL8KxnVmDoJqgQeOvfinFDwdjym7vDo','2024-08-09 20:48:16.265846','2024-08-10 20:48:16.000000',2,'09a4976b674746e183538b58f0cc5402'),(168,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjk2NCwiaWF0IjoxNzIzMjM2NTY0LCJqdGkiOiJmYjk0Njg5MDFhMzA0Y2U5OTdmYmZlMjA5ZGFkOTBiNyIsInVzZXJfaWQiOjJ9.36pOSurpiLB5SmuNE7vn6i41SDFUi6zylh2M3oidAMk','2024-08-09 20:49:24.774455','2024-08-10 20:49:24.000000',2,'fb9468901a304ce997fbfe209dad90b7'),(169,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjk2NCwiaWF0IjoxNzIzMjM2NTY0LCJqdGkiOiI3YzYzNDRlNDkxZmU0OGQ5OTE1YjhhNDUzZGZmODQ0MiIsInVzZXJfaWQiOjJ9.ozB9s0axuMOiTmbVpEBS5yzKPWBn8oWO1PBVc85jaQs','2024-08-09 20:49:24.858231','2024-08-10 20:49:24.000000',2,'7c6344e491fe48d9915b8a453dff8442'),(170,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjk3MCwiaWF0IjoxNzIzMjM2NTcwLCJqdGkiOiI3OGE1NDk5ODgwY2I0OTY5YTlkMWM4NTM0MDMyYWY3MiIsInVzZXJfaWQiOjJ9.yu-dlaCMmLl5_3QAoXYyF_hD6Z7_RnpQI2KN-pw0esQ','2024-08-09 20:49:30.091181','2024-08-10 20:49:30.000000',2,'78a5499880cb4969a9d1c8534032af72'),(171,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjk3MCwiaWF0IjoxNzIzMjM2NTcwLCJqdGkiOiI5MTY3OWFlNzI3NDg0YTcwODUwNDA4YTk1NzA4MGZjYiIsInVzZXJfaWQiOjJ9.dHFIMGJypc5LWL9OR_Fl5HStq8xAr5nbHMQuXfNbC-w','2024-08-09 20:49:30.142727','2024-08-10 20:49:30.000000',2,'91679ae727484a70850408a957080fcb'),(172,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjk5MSwiaWF0IjoxNzIzMjM2NTkxLCJqdGkiOiJlMDdmMTY2NjYzNWI0MGU3ODgyYzU1ZmYxYTFmZTM5YSIsInVzZXJfaWQiOjJ9.GMjX7VPTfTsumYDbv7FI41rv-xceQf1sK7MTLkd4EyU','2024-08-09 20:49:51.866583','2024-08-10 20:49:51.000000',2,'e07f1666635b40e7882c55ff1a1fe39a'),(173,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjk5MSwiaWF0IjoxNzIzMjM2NTkxLCJqdGkiOiJlZDdjNGFiYmQ5NWM0NmMwYjdiZGU5M2FiMmM4OTBmMyIsInVzZXJfaWQiOjJ9.ojlv0rD8hvJWd5iZU0ZLtEv3hLF-RAu7X5j1D5EzkOM','2024-08-09 20:49:51.905479','2024-08-10 20:49:51.000000',2,'ed7c4abbd95c46c0b7bde93ab2c890f3'),(174,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjk5NywiaWF0IjoxNzIzMjM2NTk3LCJqdGkiOiJjNzJjZDMwMDI1ZGQ0ZDU0YjVmNmE0NDM1YmMwYmMyNCIsInVzZXJfaWQiOjJ9.CFZRqfOwVJ5IvrG7Lw1zfdfeNNI1w_9sEyVGlQghtwA','2024-08-09 20:49:57.390417','2024-08-10 20:49:57.000000',2,'c72cd30025dd4d54b5f6a4435bc0bc24'),(175,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMjk5NywiaWF0IjoxNzIzMjM2NTk3LCJqdGkiOiJhMjkzYjY2N2FkNzU0NmU3YjBkMWQyMzJhMDJkNGYzOSIsInVzZXJfaWQiOjJ9.C9cZ2vYa09LMNf6nSuv85AK4KNmT34uhKeXGiCORE0Q','2024-08-09 20:49:57.409367','2024-08-10 20:49:57.000000',2,'a293b667ad7546e7b0d1d232a02d4f39'),(176,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzAwMywiaWF0IjoxNzIzMjM2NjAzLCJqdGkiOiIxNjQ1MjQ2NmZjZmY0MzY5YWIxMmVmYmU3ODQ0ZDU1MCIsInVzZXJfaWQiOjJ9.JKnGaGgrscI9z7gf9XKiyetBdL4BWc1_ejjrmgOB5yE','2024-08-09 20:50:03.590770','2024-08-10 20:50:03.000000',2,'16452466fcff4369ab12efbe7844d550'),(177,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzAwMywiaWF0IjoxNzIzMjM2NjAzLCJqdGkiOiJiZWRkM2JiNGUzYmE0MWM3YjYzOGZkOGJmODAyMjlmYiIsInVzZXJfaWQiOjJ9.JfZn27Z9gbepIsScQvipoDiy9XeBVpX7h4FPj4FrvqM','2024-08-09 20:50:03.633657','2024-08-10 20:50:03.000000',2,'bedd3bb4e3ba41c7b638fd8bf80229fb'),(178,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzUzNCwiaWF0IjoxNzIzMjM3MTM0LCJqdGkiOiJkYjI0MjJjYjhkZGU0Yzg0OGVmMDhiYjE2ZjAwOGFhMSIsInVzZXJfaWQiOjJ9.Juhph4isk7pxTpaKA_b5h-gtXwwAuBcyk-X-8NQ5tVg','2024-08-09 20:58:54.537823','2024-08-10 20:58:54.000000',2,'db2422cb8dde4c848ef08bb16f008aa1'),(179,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzUzNCwiaWF0IjoxNzIzMjM3MTM0LCJqdGkiOiI3YmNlMTY3MjRhNmY0YjE0OWI2ODE0ZjJhNWM4MWMwMCIsInVzZXJfaWQiOjJ9.C3PMR4kulrthntRsQzLzTtq9e2hiivhYUWZ0ohqfoyQ','2024-08-09 20:58:54.565749','2024-08-10 20:58:54.000000',2,'7bce16724a6f4b149b6814f2a5c81c00'),(180,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzUzOSwiaWF0IjoxNzIzMjM3MTM5LCJqdGkiOiIwZDE4MzJhZDkyMmY0NjdjOTQ4ZDM2NzdlOThlZjI4YSIsInVzZXJfaWQiOjJ9.xPIqhIkx1K2wVFYfLCWWvpcOalhwEAUEfxqO6hjExw0','2024-08-09 20:58:59.215978','2024-08-10 20:58:59.000000',2,'0d1832ad922f467c948d3677e98ef28a'),(181,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzUzOSwiaWF0IjoxNzIzMjM3MTM5LCJqdGkiOiIzOWIxNDlhOTMyYjM0Mzg0YjU0YjkwMzBjM2I5ZjY0MyIsInVzZXJfaWQiOjJ9.U04llvRxPQlBEWrvwGsUWbssiV5342lLQGOdBf8WCOw','2024-08-09 20:58:59.272829','2024-08-10 20:58:59.000000',2,'39b149a932b34384b54b9030c3b9f643'),(182,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzU2MSwiaWF0IjoxNzIzMjM3MTYxLCJqdGkiOiJiNDkzYjM5MTgzOTI0NGVjYWVmZWRmYzllYjUwMWY0NSIsInVzZXJfaWQiOjJ9.7U6e0-NoS1EiQtVYc1vQj8C6sHTuksQtJQEXmib_9I0','2024-08-09 20:59:21.576279','2024-08-10 20:59:21.000000',2,'b493b391839244ecaefedfc9eb501f45'),(183,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzU2MSwiaWF0IjoxNzIzMjM3MTYxLCJqdGkiOiJlNzU3Y2FiM2Q2ZDA0YTU4ODU1MTkxZmIzYzBmNzdlMCIsInVzZXJfaWQiOjJ9.G7aoVB23d2DMt3qF3SO8y0nDI3eSKUpi3Gdiqtf1pQs','2024-08-09 20:59:21.590276','2024-08-10 20:59:21.000000',2,'e757cab3d6d04a58855191fb3c0f77e0'),(184,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzU3MywiaWF0IjoxNzIzMjM3MTczLCJqdGkiOiIyYzIyNzFiMzFlZDI0N2U4ODYzYzAzNGUxYzAxZWU0MCIsInVzZXJfaWQiOjJ9._QKsOyCtMBWdt78iZzfS_SB1cnMg7dnGvfsDyad6LVI','2024-08-09 20:59:33.446719','2024-08-10 20:59:33.000000',2,'2c2271b31ed247e8863c034e1c01ee40'),(185,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzU3MywiaWF0IjoxNzIzMjM3MTczLCJqdGkiOiJmMzU5YjFjMmY0NmY0YzIzYmM3YTQ0Njg1YWNjMDAzZSIsInVzZXJfaWQiOjJ9.5kGGD48Pk5ZUMEC9k4x9j7OLcy71lifL2D5Haacn5I0','2024-08-09 20:59:33.557392','2024-08-10 20:59:33.000000',2,'f359b1c2f46f4c23bc7a44685acc003e'),(186,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzU5NywiaWF0IjoxNzIzMjM3MTk3LCJqdGkiOiIzZDcwZmZiMTgwMDA0NWQ3OGU0NzA5ZjY4M2M2MjMzZCIsInVzZXJfaWQiOjJ9.1PZNC_YDMYoaEcSvx31MQHIpluELutesU6b8e2hbTFw','2024-08-09 20:59:57.449510','2024-08-10 20:59:57.000000',2,'3d70ffb1800045d78e4709f683c6233d'),(187,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzU5NywiaWF0IjoxNzIzMjM3MTk3LCJqdGkiOiIwZDBiY2U1ZjQyNzk0NGEwYjU4ODk0N2NhMTdiYmE3NSIsInVzZXJfaWQiOjJ9.eWHjSz0v-XZG06VA-MwdIbMswV25BgblmzN33f5_AMc','2024-08-09 20:59:57.512341','2024-08-10 20:59:57.000000',2,'0d0bce5f427944a0b588947ca17bba75'),(188,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzc2NiwiaWF0IjoxNzIzMjM3MzY2LCJqdGkiOiJjMTA1MzQ2NzZkZDQ0ZmNmODkzYzA5MWY2YmUyNDlkZCIsInVzZXJfaWQiOjJ9.hePu7fS-5gQJI2puVKqWDy6Uwn_QO43D9J90hbpdpoo','2024-08-09 21:02:46.855553','2024-08-10 21:02:46.000000',2,'c10534676dd44fcf893c091f6be249dd'),(189,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzc2NiwiaWF0IjoxNzIzMjM3MzY2LCJqdGkiOiIzNzFmOTA1YzUyMzk0YTkyYmExYWE5OWViNjQ2MjBjOCIsInVzZXJfaWQiOjJ9.pxQBRXqfSDph289IxVgWWV8lS8l4Xk1hU7A9hxXX480','2024-08-09 21:02:46.906421','2024-08-10 21:02:46.000000',2,'371f905c52394a92ba1aa99eb64620c8'),(190,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzc4MCwiaWF0IjoxNzIzMjM3MzgwLCJqdGkiOiI3ZGM5OWMzYTlkOTc0MmU4YjU0YjI2ZTI4NjNkMTQ2OCIsInVzZXJfaWQiOjJ9.epRFnMAenfdpHDHFgKom4u2rhlaaT1hYT1L-xHfSH4o','2024-08-09 21:03:00.792569','2024-08-10 21:03:00.000000',2,'7dc99c3a9d9742e8b54b26e2863d1468'),(191,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyMzc4MCwiaWF0IjoxNzIzMjM3MzgwLCJqdGkiOiIyZjc5NjNiODRiNzM0ZjdmOGM3YTVhZjBiMTM4YmUxNyIsInVzZXJfaWQiOjJ9.C_DYlHdaFHDvq2M8crnW-7Ji4XPJpHUZcojzOVXa7Mc','2024-08-09 21:03:00.831466','2024-08-10 21:03:00.000000',2,'2f7963b84b734f7f8c7a5af0b138be17'),(192,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNDg1NSwiaWF0IjoxNzIzMjM4NDU1LCJqdGkiOiJmZTkyNGNjNjUzODQ0NDU0YmFlN2E4NDczODIyMGFiOSIsInVzZXJfaWQiOjJ9.ZowbqF5cXY5uOILbN4ZDmyoxXmYr0DPw7GzNheHT5_Q','2024-08-09 21:20:55.542020','2024-08-10 21:20:55.000000',2,'fe924cc653844454bae7a84738220ab9'),(193,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNDk2NiwiaWF0IjoxNzIzMjM4NTY2LCJqdGkiOiJhYmJmZDY2MmJmY2M0YzZhYTc5ZTc4MzY3NDY5Yjc0OCIsInVzZXJfaWQiOjJ9.2s1_C8GCHiwGvmHZfD5rahLXAIaKRS0GEDIiH_IiMQw','2024-08-09 21:22:46.177073','2024-08-10 21:22:46.000000',2,'abbfd662bfcc4c6aa79e78367469b748'),(194,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNDk2NiwiaWF0IjoxNzIzMjM4NTY2LCJqdGkiOiI3NWJmYzkyN2JjNjQ0ZWRiYTczNTk2ZDVlYmFhYWVhMCIsInVzZXJfaWQiOjJ9.2fLj9W84MH_92sDHmLEiMeM4d5JMVCUitMWeuYhKcrc','2024-08-09 21:22:46.385517','2024-08-10 21:22:46.000000',2,'75bfc927bc644edba73596d5ebaaaea0'),(195,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTMzOSwiaWF0IjoxNzIzMjM4OTM5LCJqdGkiOiI0ZjkwMWE2Yjc4NDA0YjI2OTEyYWQ5OTNhMmI1OWM3YyIsInVzZXJfaWQiOjJ9.EWYmw23JSq2dcCjzxuqxXdqq6ya4jbHSvMAFHfefH1o','2024-08-09 21:28:59.212478','2024-08-10 21:28:59.000000',2,'4f901a6b78404b26912ad993a2b59c7c'),(196,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTMzOSwiaWF0IjoxNzIzMjM4OTM5LCJqdGkiOiJkMDZmNzQxYmZjNzM0NjQzYmQ4NTlkMmUwZTU4NDliMiIsInVzZXJfaWQiOjJ9.UpZYrQuuIKFvBFAnsnXY5Gvmvl8_IpgAKIhedF83QQk','2024-08-09 21:28:59.235418','2024-08-10 21:28:59.000000',2,'d06f741bfc734643bd859d2e0e5849b2'),(197,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTM0NywiaWF0IjoxNzIzMjM4OTQ3LCJqdGkiOiJlNmJiYmVmMDEzNTc0NDRlOWZjZTdmNDg3MGU0YzNiNyIsInVzZXJfaWQiOjJ9.Yhg_ZK4s9SP0yPfOjrzppKILwkzYJcXprzCFsSbTjvs','2024-08-09 21:29:07.520737','2024-08-10 21:29:07.000000',2,'e6bbbef01357444e9fce7f4870e4c3b7'),(198,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTM0NywiaWF0IjoxNzIzMjM4OTQ3LCJqdGkiOiIwNzA5ZGY1ZDRkY2E0NDlhODBiMDVjZmYzNGNjNDljNyIsInVzZXJfaWQiOjJ9.pS1OTc8HpB3FqowbIu2AjjxgjMyebnl8Oeu2-p4cKoE','2024-08-09 21:29:07.543678','2024-08-10 21:29:07.000000',2,'0709df5d4dca449a80b05cff34cc49c7'),(199,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTQwNywiaWF0IjoxNzIzMjM5MDA3LCJqdGkiOiJlMzY0OWMxOGJmYmU0MTc2YjczMGIxYjc3NzI2NzU1ZiIsInVzZXJfaWQiOjJ9.KYuUlUS4iE1-qECmdYLbwZJghg3T2lcs5bf9iacmxrQ','2024-08-09 21:30:07.145142','2024-08-10 21:30:07.000000',2,'e3649c18bfbe4176b730b1b77726755f'),(200,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTQwNywiaWF0IjoxNzIzMjM5MDA3LCJqdGkiOiJjMzNmMTlmNDIyM2U0YTg5YmEyMjVjMGM0YWJhZTYwNCIsInVzZXJfaWQiOjJ9.ySOmdYRUcqK8nVtFK0mNmXa4HkFRmGPWhdSFPgGiupI','2024-08-09 21:30:07.224931','2024-08-10 21:30:07.000000',2,'c33f19f4223e4a89ba225c0c4abae604'),(201,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTQ2MSwiaWF0IjoxNzIzMjM5MDYxLCJqdGkiOiI3YjM3N2E0MDIyMDg0NmNhOGRlOTg3YTJjNmNlZDFhMCIsInVzZXJfaWQiOjJ9.h5qR2ePO7ygbSodDMI6mQD0JJPFIFwjRE6XtGh92df0','2024-08-09 21:31:01.164475','2024-08-10 21:31:01.000000',2,'7b377a40220846ca8de987a2c6ced1a0'),(202,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTQ2MSwiaWF0IjoxNzIzMjM5MDYxLCJqdGkiOiJiYjBiNDU5NTMxM2M0Mzg3ODllN2Q2OWZmMDk1ZjhjMiIsInVzZXJfaWQiOjJ9.mfcEQ3pYeeFxmO55KJ-51VYY7BDWOIZvoFqTuuC5ktg','2024-08-09 21:31:01.175441','2024-08-10 21:31:01.000000',2,'bb0b4595313c438789e7d69ff095f8c2'),(203,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTU2NiwiaWF0IjoxNzIzMjM5MTY2LCJqdGkiOiIxNjUwYWUzMzQ1ZGM0YTIwODYyN2VjYzJiOTcxYTJjNiIsInVzZXJfaWQiOjJ9.S4P5eFl8x-lTxtft76mM6nlk_7QELQ3FSxVAOzxTISk','2024-08-09 21:32:46.742924','2024-08-10 21:32:46.000000',2,'1650ae3345dc4a208627ecc2b971a2c6'),(204,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTU2NiwiaWF0IjoxNzIzMjM5MTY2LCJqdGkiOiJhNzM2MzJjOWMyYTU0ODc2YTU1YzY5ODFkNjcyNzQwNiIsInVzZXJfaWQiOjJ9.ZA89NFtd1HqYcDXiHXMta3xE-lRZ2f54ltan7OZ33Cs','2024-08-09 21:32:46.750904','2024-08-10 21:32:46.000000',2,'a73632c9c2a54876a55c6981d6727406'),(205,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTg1NCwiaWF0IjoxNzIzMjM5NDU0LCJqdGkiOiJjNDMxMmEzZTdkODE0MDQzODZjYzZmNTZkYzZlNWE4ZCIsInVzZXJfaWQiOjJ9.-C_C7uqr3YHMwn93PT8DDoV0S0voY7AfP6qYmvWYVQE','2024-08-09 21:37:34.795652','2024-08-10 21:37:34.000000',2,'c4312a3e7d81404386cc6f56dc6e5a8d'),(206,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTg1NCwiaWF0IjoxNzIzMjM5NDU0LCJqdGkiOiI2OGU3YjM4NTJlYTk0MjgzODY1ZDYxMmUzNjAwM2FiOSIsInVzZXJfaWQiOjJ9.YmWirZLnEj1yikjyMh1uduqwWe6yrPZUme8XtPM1zr0','2024-08-09 21:37:34.803633','2024-08-10 21:37:34.000000',2,'68e7b3852ea94283865d612e36003ab9'),(207,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTk4MywiaWF0IjoxNzIzMjM5NTgzLCJqdGkiOiIyZmQ2ZjRiZjdjYmI0NjMwODc4NmMwMjhlNTQyODg3NCIsInVzZXJfaWQiOjJ9.ZG7qdBm3QYbeZSffF760NbX3sja34EZMapi1ayl_KU4','2024-08-09 21:39:43.470889','2024-08-10 21:39:43.000000',2,'2fd6f4bf7cbb46308786c028e5428874'),(208,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNTk4MywiaWF0IjoxNzIzMjM5NTgzLCJqdGkiOiJlZDVkMzg0ZGI3OTU0NDBkOWU5ODY3NTQ5M2ExZTIxYiIsInVzZXJfaWQiOjJ9.aBjTR7dK9eVSFuiN_QKVcVQ-rqSWGxYIwuK4dAED9dc','2024-08-09 21:39:43.480863','2024-08-10 21:39:43.000000',2,'ed5d384db795440d9e98675493a1e21b'),(209,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjM1NCwiaWF0IjoxNzIzMjM5OTU0LCJqdGkiOiIyMWUxNzEwNjYxNDA0OGM1OGQzYjVhYTg5YjAwYjZhYiIsInVzZXJfaWQiOjJ9.ZmTw4jdiW0iOzxyVjGqfsuAgVzrSoiOSCcy3fipEnzM','2024-08-09 21:45:54.053835','2024-08-10 21:45:54.000000',2,'21e17106614048c58d3b5aa89b00b6ab'),(210,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjM1NCwiaWF0IjoxNzIzMjM5OTU0LCJqdGkiOiJmMTM1ZWRjZWUxZWQ0M2YwYmU0YTA5MDA4MmI0NjcxYiIsInVzZXJfaWQiOjJ9.qMuNmlM9TycXYMjASbDyGEoRQyU-Bfq-_TmW5zu6akc','2024-08-09 21:45:54.074781','2024-08-10 21:45:54.000000',2,'f135edcee1ed43f0be4a090082b4671b'),(211,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjM2MiwiaWF0IjoxNzIzMjM5OTYyLCJqdGkiOiIwZjE1OTAwN2VkYTY0Y2U3YWQyN2M4OTQ0N2ZkMWE3MiIsInVzZXJfaWQiOjJ9.VztxDHOGM_46sAaUnfo-6JBALBkks-OG2so_q-LmjLE','2024-08-09 21:46:02.604210','2024-08-10 21:46:02.000000',2,'0f159007eda64ce7ad27c89447fd1a72'),(212,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjM2MiwiaWF0IjoxNzIzMjM5OTYyLCJqdGkiOiJlMzg5YjJkNTMxZTE0NjRiOTQyNzkyMjhhYzJiZDg4MCIsInVzZXJfaWQiOjJ9.TimdLgZZVRNNGoK2TNoKfc4WNTpNtjaIpOhk66kF0rU','2024-08-09 21:46:02.664053','2024-08-10 21:46:02.000000',2,'e389b2d531e1464b94279228ac2bd880'),(213,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjM4MywiaWF0IjoxNzIzMjM5OTgzLCJqdGkiOiJmODBmYmRlMTFlNTU0OGFlOTc3ZTQyNzU4MGVhYTNiMCIsInVzZXJfaWQiOjJ9.gqIAzNGv31w0G8hDuGJaiTzxw9LKtIIljdDIACi8lJY','2024-08-09 21:46:23.566697','2024-08-10 21:46:23.000000',2,'f80fbde11e5548ae977e427580eaa3b0'),(214,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjM4MywiaWF0IjoxNzIzMjM5OTgzLCJqdGkiOiJjZGQxMjhhZTFiNWU0OWYxYjJkOWFjZWIzMzNiOTVjZCIsInVzZXJfaWQiOjJ9.Ryyyo4E1MU2797WsTLcBV7MTTEhuZ0TMdRNu0cFZxOQ','2024-08-09 21:46:23.568693','2024-08-10 21:46:23.000000',2,'cdd128ae1b5e49f1b2d9aceb333b95cd'),(215,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjQyNywiaWF0IjoxNzIzMjQwMDI3LCJqdGkiOiI4NzhjZDgwNjVhZWI0NTA3YmY3Mjg2MzcwMWE5ODg5MCIsInVzZXJfaWQiOjJ9.svTdzuWN68fYO3y8IO-V-X7ULdKN5Bnnqf-oVJAg734','2024-08-09 21:47:07.976393','2024-08-10 21:47:07.000000',2,'878cd8065aeb4507bf72863701a98890'),(216,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjQyOCwiaWF0IjoxNzIzMjQwMDI4LCJqdGkiOiIyNjljZDljMWZkNmM0MmRhOTFmNjVkNTU1NjlhZmRhMSIsInVzZXJfaWQiOjJ9.maW0V0ZtI0F5Jd7Pjb4_Y78mD5A9Fk9UZIy06aU9xm8','2024-08-09 21:47:08.040223','2024-08-10 21:47:08.000000',2,'269cd9c1fd6c42da91f65d55569afda1'),(217,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjQ1MCwiaWF0IjoxNzIzMjQwMDUwLCJqdGkiOiJlODU3NWUxNzQyZGU0ZDk5YTNiODY1M2M4MWUyYmZkNiIsInVzZXJfaWQiOjJ9.u7tpDgQ4vDRpuqt6tGQE27Tq-msWBL4wgWs3rNDQjs8','2024-08-09 21:47:30.814407','2024-08-10 21:47:30.000000',2,'e8575e1742de4d99a3b8653c81e2bfd6'),(218,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjQ1MCwiaWF0IjoxNzIzMjQwMDUwLCJqdGkiOiI5ZWIxMDUzMDRiMTM0ZDk1YTc5ZGNiNjUwZGY5YWRkNyIsInVzZXJfaWQiOjJ9.KS2TPtE34QASYN42u1DTnBODgBgoHL99uIfhNPyaNDM','2024-08-09 21:47:30.824384','2024-08-10 21:47:30.000000',2,'9eb105304b134d95a79dcb650df9add7'),(219,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjQ4NSwiaWF0IjoxNzIzMjQwMDg1LCJqdGkiOiJlYjBkZGIzOWEwYzk0NzJiODgzZjU5OTFlMDU4Mzc0YiIsInVzZXJfaWQiOjJ9.tjkLJD0LjgLAQxvIi6OT8eXD8VeMzPCA_QiP2yu1Lzg','2024-08-09 21:48:05.554198','2024-08-10 21:48:05.000000',2,'eb0ddb39a0c9472b883f5991e058374b'),(220,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjQ4NSwiaWF0IjoxNzIzMjQwMDg1LCJqdGkiOiJmMzFjN2RkOTQ4ZjQ0NTM1OTFiZDY5MjM1MDk4N2I5YiIsInVzZXJfaWQiOjJ9.dPqBGe1FdSQUnaMLoCwvpDpPbvax8bcKclS-UiGTX1Q','2024-08-09 21:48:05.583122','2024-08-10 21:48:05.000000',2,'f31c7dd948f4453591bd692350987b9b'),(221,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjcyOCwiaWF0IjoxNzIzMjQwMzI4LCJqdGkiOiJiNzU2MDVkYjJkOTM0Y2E2ODVhZjA4ZGJiZWYzYjhlMiIsInVzZXJfaWQiOjJ9.wEWVitPbN7aQxVkGLE0_dSAukwJn7yTB_Z4ZvqAOYgU','2024-08-09 21:52:08.841611','2024-08-10 21:52:08.000000',2,'b75605db2d934ca685af08dbbef3b8e2'),(222,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjcyOCwiaWF0IjoxNzIzMjQwMzI4LCJqdGkiOiJhZTJmYTU1NzY2MWY0NzE4OWM4ZTk2NTMyYTY1ZTc1ZiIsInVzZXJfaWQiOjJ9.nfjGY3F2MJ7DQu412dEo-W9VvNWR4y9JIGKU5ZihUrw','2024-08-09 21:52:08.841611','2024-08-10 21:52:08.000000',2,'ae2fa557661f47189c8e96532a65e75f'),(223,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjczNywiaWF0IjoxNzIzMjQwMzM3LCJqdGkiOiJkOTkwOTY0Y2ZhZTg0MDg4OTM2MWQ1YzQ3YzUzYWYyNSIsInVzZXJfaWQiOjJ9.FsgnpeNlaLBdoGBDSZwVd7rEqFreikrlGtqX3_xWv7c','2024-08-09 21:52:17.046846','2024-08-10 21:52:17.000000',2,'d990964cfae840889361d5c47c53af25'),(224,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjczNywiaWF0IjoxNzIzMjQwMzM3LCJqdGkiOiJjM2Q4YTRhZmQwMmY0ZDczOGIzZjNkYWUyNDgyNzUyOCIsInVzZXJfaWQiOjJ9.bVue3FVOh5fWg3YkeXUwtQEqejnKWT-BbRHIaAKSMPE','2024-08-09 21:52:17.077727','2024-08-10 21:52:17.000000',2,'c3d8a4afd02f4d738b3f3dae24827528'),(225,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjc0MCwiaWF0IjoxNzIzMjQwMzQwLCJqdGkiOiI0ZWRkYTgwNGY4ZDQ0N2VlYjM3OWNlOTZjNzgyODk5NCIsInVzZXJfaWQiOjJ9.k5bMEZ3mUZMkrot3FJWlfVchOTqkSBoXorTz2XJZdoU','2024-08-09 21:52:20.863465','2024-08-10 21:52:20.000000',2,'4edda804f8d447eeb379ce96c7828994'),(226,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjc0MCwiaWF0IjoxNzIzMjQwMzQwLCJqdGkiOiJmNGEwZTBmOWIyMDY0MzU2OTUxOTBhOWRhYjkyMDE4MyIsInVzZXJfaWQiOjJ9.TYbGw-nK1evtwrPyepgaN-lPU8e3mWkhyVr_Sz6xqos','2024-08-09 21:52:20.865461','2024-08-10 21:52:20.000000',2,'f4a0e0f9b206435695190a9dab920183'),(227,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjkwMSwiaWF0IjoxNzIzMjQwNTAxLCJqdGkiOiJkYWJlMzI2ZTg4YjM0ZDZmOWUzNDhkNWUzNjE3NDZkYiIsInVzZXJfaWQiOjJ9.eIud8YUwl6wTcin4MijF93SqofzUv2mVr57RSSY4S6A','2024-08-09 21:55:01.050633','2024-08-10 21:55:01.000000',2,'dabe326e88b34d6f9e348d5e361746db'),(228,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjkwMSwiaWF0IjoxNzIzMjQwNTAxLCJqdGkiOiI1Y2RiODYxNTBiNDc0MDBiOTEzNzhiMGUzMTRlMjMyOCIsInVzZXJfaWQiOjJ9.73pNcltkpunfkbnJPUs6Ss9RiUQ5InwX6Ss3bhPh520','2024-08-09 21:55:01.073573','2024-08-10 21:55:01.000000',2,'5cdb86150b47400b91378b0e314e2328'),(229,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjkwOSwiaWF0IjoxNzIzMjQwNTA5LCJqdGkiOiI3OGEzMmQwNDNlNTE0ZTQ2YWM3Yjk3MzVkZTU1N2ZkMyIsInVzZXJfaWQiOjJ9.hTFbs0z_lOqYwxLVLIHiUtCP6jBPA3FqtaUz_lioESY','2024-08-09 21:55:09.190937','2024-08-10 21:55:09.000000',2,'78a32d043e514e46ac7b9735de557fd3'),(230,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNjkwOSwiaWF0IjoxNzIzMjQwNTA5LCJqdGkiOiI4MTk5MWZiMzZmZDA0ZmNmYjQ2Njk3NDE4ZWU5NTdkYiIsInVzZXJfaWQiOjJ9.zlIhukVbF33l30GVlyth_ZX-zIHJCEvO5rqlQl3BPBA','2024-08-09 21:55:09.269726','2024-08-10 21:55:09.000000',2,'81991fb36fd04fcfb46697418ee957db'),(231,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzQzNCwiaWF0IjoxNzIzMjQxMDM0LCJqdGkiOiJmZjUzNWE4MzJkYjc0ZGI2YTU5ODI0OTYwMDIxMTgzYiIsInVzZXJfaWQiOjJ9.XRHaM1DzAAqcoyNI7ips3-74z0LHnBorb7A1p-kaXJA','2024-08-09 22:03:54.552860','2024-08-10 22:03:54.000000',2,'ff535a832db74db6a59824960021183b'),(232,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzU1OSwiaWF0IjoxNzIzMjQxMTU5LCJqdGkiOiI0MWFhNjMyN2UyNDQ0NzAwOWRjOTU4Y2VmZmE0MGQ2ZSIsInVzZXJfaWQiOjJ9.CMjKIBNwjZqSWZOQAF_yQAErtrtiiUfebpV26BqIq9g','2024-08-09 22:05:59.409184','2024-08-10 22:05:59.000000',2,'41aa6327e24447009dc958ceffa40d6e'),(233,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzU1OSwiaWF0IjoxNzIzMjQxMTU5LCJqdGkiOiIxNzQ3ODk0OGVlZDY0ZDYxOTU0ZTJhOWE3YzE1OTMzOCIsInVzZXJfaWQiOjJ9.FQiZf3gLgPMmRbKDWXuxmBQVktBeic-dYeUe7yKsYHs','2024-08-09 22:05:59.412207','2024-08-10 22:05:59.000000',2,'17478948eed64d61954e2a9a7c159338'),(234,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzU2MywiaWF0IjoxNzIzMjQxMTYzLCJqdGkiOiIwYmZiMzJiZjlmN2E0YTRhYmU1OTlmMTViNjBhNDNhOCIsInVzZXJfaWQiOjJ9.pJewZQatUpsQAdteEMhJfv0MOiKUAMHkKy7xcx-5yP8','2024-08-09 22:06:03.467310','2024-08-10 22:06:03.000000',2,'0bfb32bf9f7a4a4abe599f15b60a43a8'),(235,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzU2MywiaWF0IjoxNzIzMjQxMTYzLCJqdGkiOiI5MzQxODQ2MzVlNDY0ODBhOWM5MTgxZmE2NDA0NTgyYyIsInVzZXJfaWQiOjJ9.DzfeAG4dInc_1liAUOsE99xcqG6c-Kok7v-X1PS5CBU','2024-08-09 22:06:03.473301','2024-08-10 22:06:03.000000',2,'934184635e46480a9c9181fa6404582c'),(236,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzU2OCwiaWF0IjoxNzIzMjQxMTY4LCJqdGkiOiJhODk5Mzg1Nzg3MDA0NjJlODVkNzJhNTQ4N2E3ZjZhMSIsInVzZXJfaWQiOjJ9.OQaZQ-7cj15hIiw463luh8UhmChQF0C1xFWuCmYRtBQ','2024-08-09 22:06:08.221444','2024-08-10 22:06:08.000000',2,'a89938578700462e85d72a5487a7f6a1'),(237,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzU2OCwiaWF0IjoxNzIzMjQxMTY4LCJqdGkiOiI5MTNkZTJmNDViMTY0M2FmYmQyNjcyYTBlNTQ1ODRlNCIsInVzZXJfaWQiOjJ9.qtOBABuHOecvlczfXRmEydj4muP9sLeEYhwZk1AVHTE','2024-08-09 22:06:08.223439','2024-08-10 22:06:08.000000',2,'913de2f45b1643afbd2672a0e54584e4'),(238,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzU3NSwiaWF0IjoxNzIzMjQxMTc1LCJqdGkiOiIzNzE0NmE2MzM1ZGI0Yjk2YmRiNzIxOTcyNzRiNmU3NSIsInVzZXJfaWQiOjJ9.4F5Av4ry6qBZO5--8C3G-5PdOyIYX1z4iTaTgkiLJuc','2024-08-09 22:06:15.213431','2024-08-10 22:06:15.000000',2,'37146a6335db4b96bdb72197274b6e75'),(239,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzU3NSwiaWF0IjoxNzIzMjQxMTc1LCJqdGkiOiI3ZWRhMjJkYTBmYzM0ZjczYWY1MTAyYWU4MDllMGI0OSIsInVzZXJfaWQiOjJ9.gvC4xW-OEPJs8akjNJjQTfQggCmHiPWVuBait3ANdjY','2024-08-09 22:06:15.217421','2024-08-10 22:06:15.000000',2,'7eda22da0fc34f73af5102ae809e0b49'),(240,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzU4NCwiaWF0IjoxNzIzMjQxMTg0LCJqdGkiOiIxODgwMzU2M2U1MWQ0YWIxOTEwN2IyMTg2MTcwNjZjNyIsInVzZXJfaWQiOjJ9.H07XARgE0_QCW7mYlTACKOOkccn_SPLpqTxAU8H88hQ','2024-08-09 22:06:24.310543','2024-08-10 22:06:24.000000',2,'18803563e51d4ab19107b218617066c7'),(241,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzU4NCwiaWF0IjoxNzIzMjQxMTg0LCJqdGkiOiI1ODFjNjRmODFmNmE0YjM3OGM4ZmU0ZTkzMTc3Njk1ZiIsInVzZXJfaWQiOjJ9.ffiLjUy5VozZh7cSksU_rJapng1o8h1XFMaYJIVkhdM','2024-08-09 22:06:24.371291','2024-08-10 22:06:24.000000',2,'581c64f81f6a4b378c8fe4e93177695f'),(242,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzY3NywiaWF0IjoxNzIzMjQxMjc3LCJqdGkiOiI5MDkxNjQ1YzM5MDc0M2E3Yjk4MmY4ZGUzOWRjY2ZkYiIsInVzZXJfaWQiOjJ9.ip8jenMOVJIsEtCQuaCKd7sBISXviJ5R2u0JjDzDgH8','2024-08-09 22:07:57.568131','2024-08-10 22:07:57.000000',2,'9091645c390743a7b982f8de39dccfdb'),(243,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyNzY3NywiaWF0IjoxNzIzMjQxMjc3LCJqdGkiOiI0YjE2N2FkNGZkMTc0Nzc4YjcxNTZlNjRkNDAwYjQzYyIsInVzZXJfaWQiOjJ9.0Exto-GZx99toWnQx0sx37LLTrZVbfj3w6q41A_ysIY','2024-08-09 22:07:57.669860','2024-08-10 22:07:57.000000',2,'4b167ad4fd174778b7156e64d400b43c'),(244,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyODE3OSwiaWF0IjoxNzIzMjQxNzc5LCJqdGkiOiI4YmRjZjIzYTgxNWE0MmMzOGMzMDIxMTQwYjA0ZjUwYiIsInVzZXJfaWQiOjJ9.-J40uILf6CSyQQ85UyYEuUX8zuWEjuX9k7bu8qNZgLg','2024-08-09 22:16:19.749367','2024-08-10 22:16:19.000000',2,'8bdcf23a815a42c38c3021140b04f50b'),(245,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyODE4MCwiaWF0IjoxNzIzMjQxNzgwLCJqdGkiOiI4MjE5ZTRhYmJiNTg0ODRmYmExMTZmOGRkZjdiMGY3OCIsInVzZXJfaWQiOjJ9.teK7B6z291-nfhYODFOLTE97rqyc42OD_5iheS55kKg','2024-08-09 22:16:20.079527','2024-08-10 22:16:20.000000',2,'8219e4abbb58484fba116f8ddf7b0f78'),(246,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyODI2MCwiaWF0IjoxNzIzMjQxODYwLCJqdGkiOiJiZjQ4M2RhMGRmMTg0NGRhODMzNzZjMDQ3ZGIwNjM2ZiIsInVzZXJfaWQiOjJ9.-xgnz9FBw2sbruslKqpxU9hL0NT-PwJT8P3lLAGoMo8','2024-08-09 22:17:40.960890','2024-08-10 22:17:40.000000',2,'bf483da0df1844da83376c047db0636f'),(247,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyODI2MSwiaWF0IjoxNzIzMjQxODYxLCJqdGkiOiIyNGRiNjBhYmQ3ZDg0OTNkYTBjYjEyZTZjZjg1MGEzYyIsInVzZXJfaWQiOjJ9.ftEzg1B6-4dgWndAWHxOu_nT5QR7k95iLyGopnyBBCM','2024-08-09 22:17:41.044666','2024-08-10 22:17:41.000000',2,'24db60abd7d8493da0cb12e6cf850a3c'),(248,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyODQ0MSwiaWF0IjoxNzIzMjQyMDQxLCJqdGkiOiIxMjdiOWMxYmM4Y2Y0NmEyYTJmZDU5MWJiNWNjMjYyNCIsInVzZXJfaWQiOjJ9.VSi9imsD8VI87eCoRIRViouM8WjIKo6KA0Qlf224QkM','2024-08-09 22:20:41.699376','2024-08-10 22:20:41.000000',2,'127b9c1bc8cf46a2a2fd591bb5cc2624'),(249,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyODQ0MSwiaWF0IjoxNzIzMjQyMDQxLCJqdGkiOiIyMjExOGE2MjViNGE0NjdiODRmOGVjNTNhOWU4NjI4MiIsInVzZXJfaWQiOjJ9.vuAile5WuMv0zsi8mjzfeNJQkxsoqEsd9twJ2_2OAnw','2024-08-09 22:20:41.816822','2024-08-10 22:20:41.000000',2,'22118a625b4a467b84f8ec53a9e86282'),(250,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyOTI1NSwiaWF0IjoxNzIzMjQyODU1LCJqdGkiOiJhNzA4NmE3YjdjNWU0NGU2YmMyMjY2ZTU2ZGYxY2IyNiIsInVzZXJfaWQiOjJ9.XQTosonvZYhl6daHaGduKPK2NaBjyMnFOhcx-5NHUds','2024-08-09 22:34:15.567676','2024-08-10 22:34:15.000000',2,'a7086a7b7c5e44e6bc2266e56df1cb26'),(251,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyOTI1NSwiaWF0IjoxNzIzMjQyODU1LCJqdGkiOiJkYmQxYjI0NTNiYzQ0YWRkOTE2ZTNjNDQyM2NlZTBlZCIsInVzZXJfaWQiOjJ9.R4Pez7GotBVniaMlREYOi1k_bmlT4rdP_2nksRsQRbs','2024-08-09 22:34:15.577665','2024-08-10 22:34:15.000000',2,'dbd1b2453bc44add916e3c4423cee0ed'),(252,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyOTI3NiwiaWF0IjoxNzIzMjQyODc2LCJqdGkiOiI5MGE1OTUzNzQwYzA0NmYxYTllMzkwOWNlMWFhNDE2NiIsInVzZXJfaWQiOjJ9._5pV3PzUSczR1K7KdpXtjqRXl_eOtTp0QqAR_YNrMMY','2024-08-09 22:34:36.980251','2024-08-10 22:34:36.000000',2,'90a5953740c046f1a9e3909ce1aa4166'),(253,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyOTI3NywiaWF0IjoxNzIzMjQyODc3LCJqdGkiOiJkZjVhMDNjNmNiMWQ0MmNkODFlMDM2MGU3ZDBmM2RjYyIsInVzZXJfaWQiOjJ9.evOuJJr_Cq8iWdFUh6moEnBq-Xzi-1gVKTVVP3wHDWQ','2024-08-09 22:34:37.132060','2024-08-10 22:34:37.000000',2,'df5a03c6cb1d42cd81e0360e7d0f3dcc'),(254,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyOTI5NywiaWF0IjoxNzIzMjQyODk3LCJqdGkiOiJiNDdhZjIwNGYxZDI0MWJkYjM2OGY1ZWZhODVmM2UxMCIsInVzZXJfaWQiOjJ9.Z_RTQG-Vejcx9-hEv2AGmX6VW4UzLoHhujtnWQfyEqs','2024-08-09 22:34:57.958358','2024-08-10 22:34:57.000000',2,'b47af204f1d241bdb368f5efa85f3e10'),(255,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyOTI5NywiaWF0IjoxNzIzMjQyODk3LCJqdGkiOiJjM2RmZjMwMzUwMjU0NjZkODhiMDQ3MGQ4ZDVlYjA3MSIsInVzZXJfaWQiOjJ9.o7ylHR-VKDV_0TqHHkP9N0D6eHvdwZAJk6yBLT_JFjM','2024-08-09 22:34:57.995776','2024-08-10 22:34:57.000000',2,'c3dff3035025466d88b0470d8d5eb071'),(256,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyOTM4MiwiaWF0IjoxNzIzMjQyOTgyLCJqdGkiOiIzOWQzZDVhNGMyOWY0YjE3YjRhYjMxZTU2M2UxNzI4MCIsInVzZXJfaWQiOjJ9.Wu9yKoJzGcGkrCZWmDXimu0p_AXJyD5FPhpKNL0R4mc','2024-08-09 22:36:22.448048','2024-08-10 22:36:22.000000',2,'39d3d5a4c29f4b17b4ab31e563e17280'),(257,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyOTM4MiwiaWF0IjoxNzIzMjQyOTgyLCJqdGkiOiI2MjY4YzllZWJiYzI0ZDBjOGQxZjg5MDc4MDVmNWM3OCIsInVzZXJfaWQiOjJ9.S0Ut7ShwOdxUPF_qv5dUcayqKCKGkmrRUBziWxQP7qM','2024-08-09 22:36:22.452036','2024-08-10 22:36:22.000000',2,'6268c9eebbc24d0c8d1f8907805f5c78'),(258,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyOTk5OSwiaWF0IjoxNzIzMjQzNTk5LCJqdGkiOiI2ZTVjMWMyNmUzYzY0MTNkYmM3NzNlOTlhN2UzODhlZCIsInVzZXJfaWQiOjJ9.O0LKfq7zDmQIU5UznQb-tDVONNg4GHt5HtPZ1khBOCY','2024-08-09 22:46:39.537533','2024-08-10 22:46:39.000000',2,'6e5c1c26e3c6413dbc773e99a7e388ed'),(259,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMyOTk5OSwiaWF0IjoxNzIzMjQzNTk5LCJqdGkiOiJiZGUxMzkwMzBlNjk0MGMzYTRkMDk4MmRhZTMzOWNhYiIsInVzZXJfaWQiOjJ9.J2HstVBuyDQAE5RQ1g0R6ove28g0HVEECpmbVAW8jgw','2024-08-09 22:46:39.604326','2024-08-10 22:46:39.000000',2,'bde139030e6940c3a4d0982dae339cab'),(260,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDAwNSwiaWF0IjoxNzIzMjQzNjA1LCJqdGkiOiI2MzdhNmM0YWJiM2Y0OGE0YTZmOTdhNjQ0OTJjMzgyMyIsInVzZXJfaWQiOjJ9.2PjcvA7aNZMBvb6nFFe2nT0AYgPYUvR5_egzq2bvGAA','2024-08-09 22:46:45.685046','2024-08-10 22:46:45.000000',2,'637a6c4abb3f48a4a6f97a64492c3823'),(261,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDAwNSwiaWF0IjoxNzIzMjQzNjA1LCJqdGkiOiJmZDI1MWY0MDg2YmE0YmZjYTM3YWJkYzcyMzM1YWI0NyIsInVzZXJfaWQiOjJ9.oP6rHfGL_9xY6x-sEo0P6NKf9LSRZ4tSOMrMnegTR4w','2024-08-09 22:46:45.711268','2024-08-10 22:46:45.000000',2,'fd251f4086ba4bfca37abdc72335ab47'),(262,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDAyNywiaWF0IjoxNzIzMjQzNjI3LCJqdGkiOiI5ZGJkOTQ0ZmUyNDQ0M2E2YTlhYWYxMmY2YjdhMjVjOCIsInVzZXJfaWQiOjJ9.0awJdIJU7nXcoyNruXRuN55DGa_OZ9aT6p1ezQE7-0c','2024-08-09 22:47:07.908908','2024-08-10 22:47:07.000000',2,'9dbd944fe24443a6a9aaf12f6b7a25c8'),(263,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDAyNywiaWF0IjoxNzIzMjQzNjI3LCJqdGkiOiIyNTg3OWM1ZTJmZDc0ZTJiYTgwYTcxNTNkMzU3MTFjNyIsInVzZXJfaWQiOjJ9.IX2XpTdNJ204dLCwUHKNQ2TXSwgMCSdr30UVKXJ00ww','2024-08-09 22:47:07.983790','2024-08-10 22:47:07.000000',2,'25879c5e2fd74e2ba80a7153d35711c7'),(264,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDAzMiwiaWF0IjoxNzIzMjQzNjMyLCJqdGkiOiI4ZjMxYjNjM2MxM2I0YTM5OTRiNjZmOTZiMzU0ZTdlZiIsInVzZXJfaWQiOjJ9.tADS7oJzvoUWu88W3RxrEcXxXIUTd9cMITVIHwx161s','2024-08-09 22:47:12.482707','2024-08-10 22:47:12.000000',2,'8f31b3c3c13b4a3994b66f96b354e7ef'),(265,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDAzMiwiaWF0IjoxNzIzMjQzNjMyLCJqdGkiOiIwNTYwOTc2ZGRiN2Q0OWExODJjZmQ0MzkyMzFjOTA1ZiIsInVzZXJfaWQiOjJ9.R-x8erBJ7-QRGGF7-o7E4KKq_JcgBb-1Bbrq9yhWmwg','2024-08-09 22:47:12.487694','2024-08-10 22:47:12.000000',2,'0560976ddb7d49a182cfd439231c905f'),(266,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDEwOCwiaWF0IjoxNzIzMjQzNzA4LCJqdGkiOiI0ODE3Mzc1YzEzZWY0MzAzYTRiMDlhODM1OTljMzJhNiIsInVzZXJfaWQiOjJ9.TgyU3TtL0fIAN_zJHH0LafwqllgvXoG5tbfSmA46LVw','2024-08-09 22:48:28.255278','2024-08-10 22:48:28.000000',2,'4817375c13ef4303a4b09a83599c32a6'),(267,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDEwOCwiaWF0IjoxNzIzMjQzNzA4LCJqdGkiOiJhYTA4MDE3Y2UxNGI0NDVlOWY3NDk2ZDA2NDEwMjZkNCIsInVzZXJfaWQiOjJ9.z2T7ZuKRDv4uP-MgUSKP7UAUFmuWjZgI_b0DtrJfqQ0','2024-08-09 22:48:28.278213','2024-08-10 22:48:28.000000',2,'aa08017ce14b445e9f7496d0641026d4'),(268,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDIyNSwiaWF0IjoxNzIzMjQzODI1LCJqdGkiOiJkMjZhOWZlY2MxZTY0ZDgwYmM1OTkzMzg0MmUwZDMyZCIsInVzZXJfaWQiOjJ9.pIvkDusxCd8yZgtwCSY12hgGRchNxcgI0aOrDERL3uI','2024-08-09 22:50:25.994616','2024-08-10 22:50:25.000000',2,'d26a9fecc1e64d80bc59933842e0d32d'),(269,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDIyNiwiaWF0IjoxNzIzMjQzODI2LCJqdGkiOiI0MTE0M2Y4ZGQ0ZWE0YzRhOGJkODk1N2ZlZjliNWMwOSIsInVzZXJfaWQiOjJ9.qhnzqzYZURbQSairYC7jYffY1O28qB2O-7lW6iGWqQ4','2024-08-09 22:50:26.005584','2024-08-10 22:50:26.000000',2,'41143f8dd4ea4c4a8bd8957fef9b5c09'),(270,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDQ1OCwiaWF0IjoxNzIzMjQ0MDU4LCJqdGkiOiI2YTU0MmI5MDEzM2Y0ZWJlODliMjhhNDExYjEyY2YwNSIsInVzZXJfaWQiOjJ9.PmLBsCC1zNl8F16h7TZNivbdIrM5WeCpB_QdYCUzaww','2024-08-09 22:54:18.820850','2024-08-10 22:54:18.000000',2,'6a542b90133f4ebe89b28a411b12cf05'),(271,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzMzMDQ1OCwiaWF0IjoxNzIzMjQ0MDU4LCJqdGkiOiJlYzViMzU0NzQ0NTk0NmI4YjVhNjYyYjVlNjMxNDdkMCIsInVzZXJfaWQiOjJ9.1cUyofCc_WdV3SQTpKtpA5FNk8As7fNr4s4I3NoLsmM','2024-08-09 22:54:18.851650','2024-08-10 22:54:18.000000',2,'ec5b3547445946b8b5a662b5e63147d0'),(272,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NjUyMywiaWF0IjoxNzIzMjkwMTIzLCJqdGkiOiIxNjhmMTliZmQ5OWI0ODgwOTBhNjk1NjIyMGNkMDdkMSIsInVzZXJfaWQiOjJ9.lR__1YTWYbO8iBMylgveZsMn6y9vsGlMzYkPheHgCLw','2024-08-10 11:42:03.188428','2024-08-11 11:42:03.000000',2,'168f19bfd99b488090a6956220cd07d1'),(273,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NjUyMywiaWF0IjoxNzIzMjkwMTIzLCJqdGkiOiI3MDI2OTY2MDFlOGY0ODJlODhkYjc2MDUzZGQ2MDZiYiIsInVzZXJfaWQiOjJ9.FAfRrH_rGkgx3yeNlhHBhAfSyhwwteW4VWTxHuOGsT8','2024-08-10 11:42:03.244164','2024-08-11 11:42:03.000000',2,'702696601e8f482e88db76053dd606bb'),(274,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NjUyNywiaWF0IjoxNzIzMjkwMTI3LCJqdGkiOiJhYzg5OTgwZTQ3NzY0NDY3YjdhNGQ1OTFhNjM1ODBmMCIsInVzZXJfaWQiOjJ9.9EUjx29mMOcGoQazMDiUopFzaiY5gSM6cK77OawYe7U','2024-08-10 11:42:07.688959','2024-08-11 11:42:07.000000',2,'ac89980e47764467b7a4d591a63580f0'),(275,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NjUyNywiaWF0IjoxNzIzMjkwMTI3LCJqdGkiOiI2MzMyMmYxMzllYzY0NzkzYjc5ZDAxMjk0YjQyNGZjNyIsInVzZXJfaWQiOjJ9.4ratGCciw7M9JnoR-yqwXgMsb2qazw2pdRwAuocGWrI','2024-08-10 11:42:07.708864','2024-08-11 11:42:07.000000',2,'63322f139ec64793b79d01294b424fc7'),(276,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzA0MywiaWF0IjoxNzIzMjkwNjQzLCJqdGkiOiIzYTlhNzkwMWU4NzE0NjY3YjZmNjlmODc2OTRmODA0OSIsInVzZXJfaWQiOjJ9.hS9WII_ugy3wTUOXp1RIz88cu3H_GWb6LVp6LPP3zkA','2024-08-10 11:50:43.090318','2024-08-11 11:50:43.000000',2,'3a9a7901e8714667b6f69f87694f8049'),(277,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzA0MywiaWF0IjoxNzIzMjkwNjQzLCJqdGkiOiJkY2E3NGE0OWI4ODU0MmYxOWM2ZDM4OWM3MmY0YmEwYyIsInVzZXJfaWQiOjJ9.H_Kx-GgFbwQdFX6uGDnDJql_mx1Lf_lsnL6DwDH-sGY','2024-08-10 11:50:43.114221','2024-08-11 11:50:43.000000',2,'dca74a49b88542f19c6d389c72f4ba0c'),(278,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzIyNCwiaWF0IjoxNzIzMjkwODI0LCJqdGkiOiIwYzBlMzlmNDhmOTY0NThjODU1Yjk1OTJkY2Q5MTQ3NCIsInVzZXJfaWQiOjJ9.bquOkJOIedmmTKz1webROAc1RefBVSn19l1pSGqmgAw','2024-08-10 11:53:44.323920','2024-08-11 11:53:44.000000',2,'0c0e39f48f96458c855b9592dcd91474'),(279,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzIyNCwiaWF0IjoxNzIzMjkwODI0LCJqdGkiOiJiMjVhYjUzMTQ2OTU0ODZhOGNjMWM2NGQ5MzdhZTQyMCIsInVzZXJfaWQiOjJ9.xgQPKdVhpz8NKnrYtSRyZZMSdt3ndz5bTv6b5na1crg','2024-08-10 11:53:44.648051','2024-08-11 11:53:44.000000',2,'b25ab5314695486a8cc1c64d937ae420'),(280,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzI1NiwiaWF0IjoxNzIzMjkwODU2LCJqdGkiOiI2MGM1ZDU0ZjM5MTU0YWRkOWI2M2I1MWNiZDI2MmQ2OCIsInVzZXJfaWQiOjJ9.Zwp_bRI8hzqjK4-qQ0CmF-6yAcHTLa3Mtzs6Ne6Ylv8','2024-08-10 11:54:16.805058','2024-08-11 11:54:16.000000',2,'60c5d54f39154add9b63b51cbd262d68'),(281,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzI1NiwiaWF0IjoxNzIzMjkwODU2LCJqdGkiOiJjZjAxMTVkNDc2ZGY0NTRjYmNmZmYyYzZiZTNlNWJiMiIsInVzZXJfaWQiOjJ9.M3qiDJSmUBpNvFPxq3E1AZvDMmxnjntyejI0WL2aKCs','2024-08-10 11:54:16.880854','2024-08-11 11:54:16.000000',2,'cf0115d476df454cbcfff2c6be3e5bb2'),(282,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzM0NiwiaWF0IjoxNzIzMjkwOTQ2LCJqdGkiOiI2Y2NmMTdiYmM1NTM0MzM3ODAyZjA2ZTQ2MTU1ZjZmMSIsInVzZXJfaWQiOjJ9.MSLWoyA-v9GyY7ddQEyeMPyIORGwqnmaZoXnestJ9l4','2024-08-10 11:55:46.757125','2024-08-11 11:55:46.000000',2,'6ccf17bbc5534337802f06e46155f6f1'),(283,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzM2MSwiaWF0IjoxNzIzMjkwOTYxLCJqdGkiOiI3NzQwYWRjNDk4ZDU0NjJmYWE5NDU3ZWNmYTliMTk5MiIsInVzZXJfaWQiOjJ9.a3tZqx0lJEcCzHdl-vDqaYhLZfG__TblOPeuexkcnCY','2024-08-10 11:56:01.715464','2024-08-11 11:56:01.000000',2,'7740adc498d5462faa9457ecfa9b1992'),(284,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzM2NywiaWF0IjoxNzIzMjkwOTY3LCJqdGkiOiI5M2UxNTA2Nzk4YTM0ZTNmODFmZmZhMWIwMTIwM2UxNiIsInVzZXJfaWQiOjJ9.XjA-uilIQDmT5nlb9li3ZL9mjBQK77iEHJeMC46K3nM','2024-08-10 11:56:07.429597','2024-08-11 11:56:07.000000',2,'93e1506798a34e3f81fffa1b01203e16'),(285,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzM2NywiaWF0IjoxNzIzMjkwOTY3LCJqdGkiOiI4NzA5NmNhNWQ1NWE0YWNkYWVlMmRhMDQ3YjMyYzg1YSIsInVzZXJfaWQiOjJ9.GwFtB27XpAigWrS1Mxz-Jgexv2gd6r37ZmA-Mj0MuFc','2024-08-10 11:56:07.446638','2024-08-11 11:56:07.000000',2,'87096ca5d55a4acdaee2da047b32c85a'),(286,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzM3MiwiaWF0IjoxNzIzMjkwOTcyLCJqdGkiOiJmNzllYmQ3MDdkZTU0YzNiOGVjZWQ2YTE3NmFiOTE1NCIsInVzZXJfaWQiOjJ9.S4f0u0TFMkJ1VbUCEGTgF7hQQ7PURQ24hy77045s0vM','2024-08-10 11:56:12.471570','2024-08-11 11:56:12.000000',2,'f79ebd707de54c3b8eced6a176ab9154'),(287,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzM3MiwiaWF0IjoxNzIzMjkwOTcyLCJqdGkiOiI3M2FiNzQ4MWNhMTk0NGQzODc3YTMwMDQwOGZiZDBjYSIsInVzZXJfaWQiOjJ9.3id3CvplAE4slyRL0Ry_IFKsRKCCtY7jpWX4EVKkMa0','2024-08-10 11:56:12.478030','2024-08-11 11:56:12.000000',2,'73ab7481ca1944d3877a300408fbd0ca'),(288,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzM4MCwiaWF0IjoxNzIzMjkwOTgwLCJqdGkiOiIzYTIzZTFjMjIwNzQ0MDViOWVkMTNlZWVmOGJiOTllOSIsInVzZXJfaWQiOjJ9.ruBTjVzX2r2djzXgyPwsRY5F74GRpXpTjKyyqHU-xE0','2024-08-10 11:56:20.871286','2024-08-11 11:56:20.000000',2,'3a23e1c22074405b9ed13eeef8bb99e9'),(289,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzM4MCwiaWF0IjoxNzIzMjkwOTgwLCJqdGkiOiIzMTMyODU2ZTRjYWU0NmYyOTJmYmQ2NGM1MzY3NmEzNCIsInVzZXJfaWQiOjJ9.UDwd5t5rPXe2w05YhX-hB2Kuj5Bu-E6cPbKjA6H-8nE','2024-08-10 11:56:20.886244','2024-08-11 11:56:20.000000',2,'3132856e4cae46f292fbd64c53676a34'),(290,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzM5MCwiaWF0IjoxNzIzMjkwOTkwLCJqdGkiOiJkMjJjMTg4NTZhNDE0NDc1YjVmNGY5YjNkZjM4Yjg5NiIsInVzZXJfaWQiOjJ9.SkmWPud3GUO4uEc__nEXNqTZFYEyXaVZOgWuwKhsYxg','2024-08-10 11:56:30.040282','2024-08-11 11:56:30.000000',2,'d22c18856a414475b5f4f9b3df38b896'),(291,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzM5MCwiaWF0IjoxNzIzMjkwOTkwLCJqdGkiOiI1MWJlNjZlZjlkOWE0ZTc2YmFmNzYxOGIyNmFlODBlOSIsInVzZXJfaWQiOjJ9.oi7SJnDWLqfFW2VrB2-gh6FvOoZWDiKwBS-eKQtZ4hk','2024-08-10 11:56:30.130488','2024-08-11 11:56:30.000000',2,'51be66ef9d9a4e76baf7618b26ae80e9'),(292,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzQwNywiaWF0IjoxNzIzMjkxMDA3LCJqdGkiOiJkZDYzZjkwNjE4MDI0YjQxYjUwYzczNTBiZjQxNDEzYSIsInVzZXJfaWQiOjJ9.wPDBQkaGlsxaYmmqenn12QcfQTAx63Xqm-DgKVuUuSs','2024-08-10 11:56:47.891512','2024-08-11 11:56:47.000000',2,'dd63f90618024b41b50c7350bf41413a'),(293,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzQwNywiaWF0IjoxNzIzMjkxMDA3LCJqdGkiOiI4ODhiYWZmMzdiYzA0ZDE4YWNjYTgwZjQ4ZGZjMWU1YiIsInVzZXJfaWQiOjJ9.pMF7iNKj71Uy19cxk5y5F6a4OE6e1Pb6DmlH7gejZXI','2024-08-10 11:56:47.964316','2024-08-11 11:56:47.000000',2,'888baff37bc04d18acca80f48dfc1e5b'),(294,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzQyNSwiaWF0IjoxNzIzMjkxMDI1LCJqdGkiOiI5ODNlM2RjYTg0NGU0MmRmODdjNmRkNzMyNzZjZGY4ZCIsInVzZXJfaWQiOjJ9.0hn2G-ENc-t0O5b-PHtpuIDR0gSW9-haBDGQEZwA_aA','2024-08-10 11:57:05.942079','2024-08-11 11:57:05.000000',2,'983e3dca844e42df87c6dd73276cdf8d'),(295,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzQyNSwiaWF0IjoxNzIzMjkxMDI1LCJqdGkiOiI3YjYxNmJhZjdjMWE0NzBlODgyNGNlZWRhNGI0OTdiZCIsInVzZXJfaWQiOjJ9.3X6ztfDxJm3MHC6MvoakRmmu2aMvZVY07lmcyeryXSY','2024-08-10 11:57:05.952009','2024-08-11 11:57:05.000000',2,'7b616baf7c1a470e8824ceeda4b497bd'),(296,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzQzMiwiaWF0IjoxNzIzMjkxMDMyLCJqdGkiOiJiMWQ4ZTc2OGFiYmQ0ZjRkYjMzOWNhMWQ0YTBlMzA3YSIsInVzZXJfaWQiOjJ9.qk8C0a-RhS_RxfYzCu9zjmMg68ydkFXRWs5mHJ2k4ic','2024-08-10 11:57:12.608406','2024-08-11 11:57:12.000000',2,'b1d8e768abbd4f4db339ca1d4a0e307a'),(297,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzQzMiwiaWF0IjoxNzIzMjkxMDMyLCJqdGkiOiI5ZTBhMGYxYzdmYzY0MTU3OGY1NTM5MTdkMDJhZDRlOCIsInVzZXJfaWQiOjJ9._zYvMfvpC5_H6tti-lvVvPdt2HM7DXZXw1S1AscHun0','2024-08-10 11:57:12.611146','2024-08-11 11:57:12.000000',2,'9e0a0f1c7fc641578f553917d02ad4e8'),(298,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzYwOCwiaWF0IjoxNzIzMjkxMjA4LCJqdGkiOiJlZThhN2YyZTY3YWM0NTVlYTBlMWFlZjU3MDY0YmVlOCIsInVzZXJfaWQiOjJ9.f8tiyNti4BXQNlA72o6pyrTlRMOhdvsnJn-kN8e4drE','2024-08-10 12:00:08.573062','2024-08-11 12:00:08.000000',2,'ee8a7f2e67ac455ea0e1aef57064bee8'),(299,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3NzYwOCwiaWF0IjoxNzIzMjkxMjA4LCJqdGkiOiI3ODIzNTc4Y2VhYTk0Zjc3ODNkOTZjZTdlM2I3YmQ2NSIsInVzZXJfaWQiOjJ9.TNOttciyTJGpO_4oFPWpTfhd_Pekxzuorhz8bFZXXJw','2024-08-10 12:00:08.576989','2024-08-11 12:00:08.000000',2,'7823578ceaa94f7783d96ce7e3b7bd65'),(300,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3ODE3MiwiaWF0IjoxNzIzMjkxNzcyLCJqdGkiOiIyNTg4M2Q2NzE5NzI0Y2EzYmNkM2VmOWQyMjM0NmY4MyIsInVzZXJfaWQiOjJ9.f13wtMa3T4DgrQriNtSWqhQtr4u_hrYZu8V39HJdcuI','2024-08-10 12:09:32.032382','2024-08-11 12:09:32.000000',2,'25883d6719724ca3bcd3ef9d22346f83'),(301,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3ODE3MiwiaWF0IjoxNzIzMjkxNzcyLCJqdGkiOiJmNmE3OTg3ZmU1Zjk0NDRhODlhOWQ1ZjM4M2Y1MTNjOSIsInVzZXJfaWQiOjJ9.eRWIjNeemuzQY11KB8nV3-ZjIsVaZIDsVVjKv8A6esI','2024-08-10 12:09:32.111208','2024-08-11 12:09:32.000000',2,'f6a7987fe5f9444a89a9d5f383f513c9'),(302,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3OTM0NywiaWF0IjoxNzIzMjkyOTQ3LCJqdGkiOiIzZjg0MTMzNjhjYTM0OTUwOTZlNTk4ODllYjA3YTBlYyIsInVzZXJfaWQiOjJ9.1MC1DHXfvJMBRQsPKRrxUkHJXGl7oVM2jY1KZV7vN7E','2024-08-10 12:29:07.004263','2024-08-11 12:29:07.000000',2,'3f8413368ca3495096e59889eb07a0ec'),(303,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3OTM0NywiaWF0IjoxNzIzMjkyOTQ3LCJqdGkiOiIwM2U5MjI4MGI5YTQ0MDFiYWI3ZGI0Y2I5Yjg4ZGQxOCIsInVzZXJfaWQiOjJ9.AtmYpSTxAmgBhyGzR1zEiA2eqoIOrXtMo0hyBAg-sac','2024-08-10 12:29:07.011247','2024-08-11 12:29:07.000000',2,'03e92280b9a4401bab7db4cb9b88dd18'),(304,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3OTM0OSwiaWF0IjoxNzIzMjkyOTQ5LCJqdGkiOiJjY2QwMTI5NzA0MGU0NDZmOWMwYTg3NGI2ZTQzMzM3ZiIsInVzZXJfaWQiOjJ9.GdzJhRfSGmfpIISIkvf5zOffjvmpirSjesxsNIFLAtk','2024-08-10 12:29:09.993514','2024-08-11 12:29:09.000000',2,'ccd01297040e446f9c0a874b6e43337f'),(305,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3OTM1MCwiaWF0IjoxNzIzMjkyOTUwLCJqdGkiOiIwMTVhYzMxZjAyNjc0NzAwOTg4YTEwYTE5M2U1MTZiNSIsInVzZXJfaWQiOjJ9.K8qPexRjhBQfGudcOMKrSyvBLAokFInzKJbP39-9y74','2024-08-10 12:29:10.055349','2024-08-11 12:29:10.000000',2,'015ac31f02674700988a10a193e516b5'),(306,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3OTYxNSwiaWF0IjoxNzIzMjkzMjE1LCJqdGkiOiJiNDEzMGMyM2UzZGE0MThiYWUyZmEyZjI0OGMwNDAxMCIsInVzZXJfaWQiOjJ9.-FwObcIbqRSy47Xnfb_qWEI_KPx_qqyRkAWRWaP72ME','2024-08-10 12:33:35.256587','2024-08-11 12:33:35.000000',2,'b4130c23e3da418bae2fa2f248c04010'),(307,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM3OTYxNSwiaWF0IjoxNzIzMjkzMjE1LCJqdGkiOiJkYmU1MmNhNDQ4ZGQ0ODFmODdlYjBkYTMzODdkNTQzYyIsInVzZXJfaWQiOjJ9.gHEY7oOSl8_qdHSI1jGwQDOEywFQVFrLslRva3pXIi0','2024-08-10 12:33:35.391240','2024-08-11 12:33:35.000000',2,'dbe52ca448dd481f87eb0da3387d543c'),(308,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4MTc3NSwiaWF0IjoxNzIzMjk1Mzc1LCJqdGkiOiI5YTFkYzEzZTMyYTE0NDJmOWUyOTYxOTU0YTNlZTk0NCIsInVzZXJfaWQiOjJ9.2H7AkLbu5b3wpYR8efLvHk0ft5oga9TOO5Djuz7ACtM','2024-08-10 13:09:35.545971','2024-08-11 13:09:35.000000',2,'9a1dc13e32a1442f9e2961954a3ee944'),(309,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4MTc3NSwiaWF0IjoxNzIzMjk1Mzc1LCJqdGkiOiJjYzY0ZmJmYWU0Y2Q0M2UwYTIyZjlmYWQ0NjE2NWY3MyIsInVzZXJfaWQiOjJ9.YLTD5e8bg9WSXCE5yeBZY-aDbW5-wW8m3mh7MJHDtp8','2024-08-10 13:09:35.690584','2024-08-11 13:09:35.000000',2,'cc64fbfae4cd43e0a22f9fad46165f73'),(310,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4MjY4MiwiaWF0IjoxNzIzMjk2MjgyLCJqdGkiOiI4MTg5ZjhjMWQxMjc0OTZmODllNDIyZTlkNzlmN2VkMSIsInVzZXJfaWQiOjJ9.QWyR2szx0L7-pBIeSnsS_GCAQZY0vGSgoNk9k_x2338','2024-08-10 13:24:42.468273','2024-08-11 13:24:42.000000',2,'8189f8c1d127496f89e422e9d79f7ed1'),(311,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4MjY4MiwiaWF0IjoxNzIzMjk2MjgyLCJqdGkiOiI2ZTNhNjFkYjU1N2Q0NTViOTNkOWUyZDU4ZTI5OGIyOCIsInVzZXJfaWQiOjJ9.CstWKTg5ehEm7GBz1siISgU4v-B2nTqmk8LovacTOWs','2024-08-10 13:24:42.482805','2024-08-11 13:24:42.000000',2,'6e3a61db557d455b93d9e2d58e298b28'),(312,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4Mjc3MCwiaWF0IjoxNzIzMjk2MzcwLCJqdGkiOiI1OTU3MTIxZThlYTE0Y2JjOWY3NTJiZDU1YWNmYzk2NSIsInVzZXJfaWQiOjJ9.jTzyGlkxy0K8Z0F3N18bVCIDXMzyx5NUWh3ZF4WHTxQ','2024-08-10 13:26:10.429455','2024-08-11 13:26:10.000000',2,'5957121e8ea14cbc9f752bd55acfc965'),(313,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4Mjc3MCwiaWF0IjoxNzIzMjk2MzcwLCJqdGkiOiI0ZDQ1Mzg3ZDYyY2Q0NzJkOTE0ZjFhNTA3ZjAzYTQ0NiIsInVzZXJfaWQiOjJ9.phep7aug0ksJ5cdFvP00E7CKf89m1f4WB_YYgTswnL4','2024-08-10 13:26:10.432447','2024-08-11 13:26:10.000000',2,'4d45387d62cd472d914f1a507f03a446'),(314,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4MzQwMSwiaWF0IjoxNzIzMjk3MDAxLCJqdGkiOiI3NGY1Nzg1ZTMxMjg0ODgwYmI3OWY5NGQ4YTlkZGM0MiIsInVzZXJfaWQiOjJ9.dpEq_yUlK0WHYg0bGB2wjNRe6LuDBHv5dhtykVcScFA','2024-08-10 13:36:41.189790','2024-08-11 13:36:41.000000',2,'74f5785e31284880bb79f94d8a9ddc42'),(315,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4MzQwMSwiaWF0IjoxNzIzMjk3MDAxLCJqdGkiOiI5MjU1ZGFhNDY1YTE0ODgwYWU3ZDY5ZDBkZjQwMzg5MSIsInVzZXJfaWQiOjJ9.jWPKJviIejspbI7hC1pIMWpmp7cReFpMKhPJVXc6VGQ','2024-08-10 13:36:41.297500','2024-08-11 13:36:41.000000',2,'9255daa465a14880ae7d69d0df403891'),(316,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDA0NiwiaWF0IjoxNzIzMjk3NjQ2LCJqdGkiOiI2ZGUyZTczZDc3MjQ0ZDQ3OTVhYzlhODYzZTFiMTE2ZCIsInVzZXJfaWQiOjJ9.6HBDeN_t693J-uAvmFm1McG-6ZHdB4L3_JyTRTK_Zgc','2024-08-10 13:47:26.609627','2024-08-11 13:47:26.000000',2,'6de2e73d77244d4795ac9a863e1b116d'),(317,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDA0NiwiaWF0IjoxNzIzMjk3NjQ2LCJqdGkiOiIxYjlmN2ZjZTQzNjQ0YmZiOTAxODRmNTI2NWFmMzhkOCIsInVzZXJfaWQiOjJ9.Pdt3h66h1iFuSNTFS6G2DAsdPSNmKKqkOfi0RSNX7ao','2024-08-10 13:47:26.703375','2024-08-11 13:47:26.000000',2,'1b9f7fce43644bfb90184f5265af38d8'),(318,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDA4NSwiaWF0IjoxNzIzMjk3Njg1LCJqdGkiOiI4NzQ5ODhiYWM3MDQ0MmYyOGViMDA5Y2E5MDNhN2ZmOSIsInVzZXJfaWQiOjJ9.yK_JHdfwt32w55aY2mB6zb-wjDOk1TiY37ePrAakL_c','2024-08-10 13:48:05.564455','2024-08-11 13:48:05.000000',2,'874988bac70442f28eb009ca903a7ff9'),(319,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDA4NSwiaWF0IjoxNzIzMjk3Njg1LCJqdGkiOiI5ODcwMzlhMzBhNmE0MDM0YTZjZTM1Y2I2MDJhNDg2ZCIsInVzZXJfaWQiOjJ9.IMNY3fa01h7Mrp_fz2dzmP442T5P2btLOmzbFKbUryQ','2024-08-10 13:48:05.566453','2024-08-11 13:48:05.000000',2,'987039a30a6a4034a6ce35cb602a486d'),(320,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDEwNywiaWF0IjoxNzIzMjk3NzA3LCJqdGkiOiIyYjQ3ODRmMTAyNDg0ZGYxOTdmMGIzZmM4OTQxZTNkMyIsInVzZXJfaWQiOjJ9.f0TepFGz2GMRJAzS8RMh1OWnLe6Zm3n2B2KZ7VI0GBU','2024-08-10 13:48:27.968646','2024-08-11 13:48:27.000000',2,'2b4784f102484df197f0b3fc8941e3d3'),(321,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDEwOCwiaWF0IjoxNzIzMjk3NzA4LCJqdGkiOiIyZDMyZDgwZmZhMjQ0NmQwODkyNGMxZDdkZjljYWQzNSIsInVzZXJfaWQiOjJ9.v0Vk43VGQKoy44VP2mJ1gZ43Bh09TB8Cwc4z2NN8j8s','2024-08-10 13:48:28.043439','2024-08-11 13:48:28.000000',2,'2d32d80ffa2446d08924c1d7df9cad35'),(322,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDI4NiwiaWF0IjoxNzIzMjk3ODg2LCJqdGkiOiIzYTU5YWEwNGU4NzY0MGE0ODE5NDAzZWZkMmJjMWM5YyIsInVzZXJfaWQiOjJ9.V3xR8aYUaRcVUQelujbK8jSM4fyovm-kQ8cNjKReu0M','2024-08-10 13:51:26.111908','2024-08-11 13:51:26.000000',2,'3a59aa04e87640a4819403efd2bc1c9c'),(323,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDI4NiwiaWF0IjoxNzIzMjk3ODg2LCJqdGkiOiI4ZDA1MzJkY2VhMjI0YjVkYTNlM2EzNWNhMGM5MWQwOCIsInVzZXJfaWQiOjJ9.5jWeR_4aRR2sFpAySgFEEjR736ww5O84jVbRoBHDpnc','2024-08-10 13:51:26.126871','2024-08-11 13:51:26.000000',2,'8d0532dcea224b5da3e3a35ca0c91d08'),(324,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDMwNiwiaWF0IjoxNzIzMjk3OTA2LCJqdGkiOiJmZGZkMzUwYTRiMzU0MjZjOTE2ZGQ4ZjU1YTgzM2ZiYiIsInVzZXJfaWQiOjJ9.Qmu_wyDDUxXQ7zVCehiIPQMMOCTEe_eelWA3FlRFVRQ','2024-08-10 13:51:46.579018','2024-08-11 13:51:46.000000',2,'fdfd350a4b35426c916dd8f55a833fbb'),(325,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDMwNiwiaWF0IjoxNzIzMjk3OTA2LCJqdGkiOiI2ZmE0ODY5NjNjYmM0MDQ0YTEyMjU3ZjQ3ZTRmMjY4MCIsInVzZXJfaWQiOjJ9.AqmvctQK6Q9M4U-tITzCZCZfdluiXjxKAXsRUdyCYKQ','2024-08-10 13:51:46.596969','2024-08-11 13:51:46.000000',2,'6fa486963cbc4044a12257f47e4f2680'),(326,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDU0NSwiaWF0IjoxNzIzMjk4MTQ1LCJqdGkiOiJhZjQ4NzM5YzFjNjk0MDAyYWIyMDkwMmMxMjQxNGEzMiIsInVzZXJfaWQiOjJ9.zzxNUqAqy91vfcnNe26O-gol8-yUYfIKlY7o0It7ttE','2024-08-10 13:55:45.625805','2024-08-11 13:55:45.000000',2,'af48739c1c694002ab20902c12414a32'),(327,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDU0NSwiaWF0IjoxNzIzMjk4MTQ1LCJqdGkiOiIxOTY1MDNiZWEwYzM0ZDE5YTA2NTljZWQ3N2MyMTk3YyIsInVzZXJfaWQiOjJ9.XmFSyBVyFc-w746bq6_Y7mSslH_RdkakqpiitiFErfU','2024-08-10 13:55:45.647417','2024-08-11 13:55:45.000000',2,'196503bea0c34d19a0659ced77c2197c'),(328,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDU1MSwiaWF0IjoxNzIzMjk4MTUxLCJqdGkiOiJjZTU2M2FmNjMwNGM0MjdjYTNlNDA0ZDgyZjgxYzFlYiIsInVzZXJfaWQiOjJ9.dTdg_WSWmeAyG2z7IkJeJOZfzSuMd7CtUsrOLNbMykM','2024-08-10 13:55:51.554853','2024-08-11 13:55:51.000000',2,'ce563af6304c427ca3e404d82f81c1eb'),(329,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDU1MSwiaWF0IjoxNzIzMjk4MTUxLCJqdGkiOiI5OWVkM2Y2ZmE1ZDY0MTUyOTYxNjMzMGY4OWQ0NjA1MSIsInVzZXJfaWQiOjJ9.bKCKgMadiFPnVXZQ3_VGNJgLgnVH4d2l_EiPyWhZiuo','2024-08-10 13:55:51.736367','2024-08-11 13:55:51.000000',2,'99ed3f6fa5d641529616330f89d46051'),(330,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDY4NiwiaWF0IjoxNzIzMjk4Mjg2LCJqdGkiOiJlNDZjODFiNWMzN2M0OGIzODFkNDQ4MzdkODJmNzNjYiIsInVzZXJfaWQiOjJ9.CT7VpGe5GAztrUmH3wcWg8-vLsjA825KR-LGHlnEtIU','2024-08-10 13:58:06.859306','2024-08-11 13:58:06.000000',2,'e46c81b5c37c48b381d44837d82f73cb'),(331,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDY4NiwiaWF0IjoxNzIzMjk4Mjg2LCJqdGkiOiIzM2QxM2M5NGI0NGY0MDdhYTk5MTIwMmY0ZjQ1ZGIwMCIsInVzZXJfaWQiOjJ9.IQtUjLtNmSOYULbmx8EeaEx8T6TIQljxIDqlQ8CTWuo','2024-08-10 13:58:06.888230','2024-08-11 13:58:06.000000',2,'33d13c94b44f407aa991202f4f45db00'),(332,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDY5MSwiaWF0IjoxNzIzMjk4MjkxLCJqdGkiOiI4NTQ2NjY1ZTZlMDk0OTIwOWM3Y2E3OTI2MjY0NGE5OCIsInVzZXJfaWQiOjJ9.IDvoli4yDY3WqD596pNoR63UGhWJBLwL4wrRJoqpJSs','2024-08-10 13:58:11.817357','2024-08-11 13:58:11.000000',2,'8546665e6e0949209c7ca79262644a98'),(333,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4NDY5MSwiaWF0IjoxNzIzMjk4MjkxLCJqdGkiOiI3YTMzMTQ2MTUxMGY0MTg5YjNmNDA0YWIxOGE3MzdiMSIsInVzZXJfaWQiOjJ9.nCuQPOipOjGIa-e_kssXTTlGsJcuuy9epww_Jgn7exQ','2024-08-10 13:58:11.826287','2024-08-11 13:58:11.000000',2,'7a331461510f4189b3f404ab18a737b1'),(334,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4Njg5MSwiaWF0IjoxNzIzMzAwNDkxLCJqdGkiOiI3ODk1Nzk5YmNlNWY0Y2M4YjYwZDU3OWM5NTU5Y2Y5MCIsInVzZXJfaWQiOjJ9.xTkOTs-7J564yb-voBfqthlaIOlCwd2XaC6EwfoF-AM','2024-08-10 14:34:51.986309','2024-08-11 14:34:51.000000',2,'7895799bce5f4cc8b60d579c9559cf90'),(335,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4Njg5MiwiaWF0IjoxNzIzMzAwNDkyLCJqdGkiOiJjOThjNWVmZTRiMmY0YjNmOTM0YmQ4ZDBjZDMyNWIwYSIsInVzZXJfaWQiOjJ9.W3HC4eiczNVS-NOgTA5aHhpAoyrPhMLF-sWoxE1DjXQ','2024-08-10 14:34:52.063103','2024-08-11 14:34:52.000000',2,'c98c5efe4b2f4b3f934bd8d0cd325b0a'),(336,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4Nzk4NiwiaWF0IjoxNzIzMzAxNTg2LCJqdGkiOiI0MTRiMjU3ZjM5ZDA0NTlhYTM4ODQ2MWMyNzU5MDEzYSIsInVzZXJfaWQiOjJ9.yIm3BG1Sz9e2JZL3slD4f-obJdKNmwRKLj4ckdFPDZ4','2024-08-10 14:53:06.931148','2024-08-11 14:53:06.000000',2,'414b257f39d0459aa388461c2759013a'),(337,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4Nzk4NiwiaWF0IjoxNzIzMzAxNTg2LCJqdGkiOiJkYmE2MDhjZjIzZWI0NDBiYjc4MmZkMDgwODhjYTg4ZiIsInVzZXJfaWQiOjJ9.ikD86efSeVQ_5OxXGEqP8tJ3swIXF09chzQ3Y8CzSkI','2024-08-10 14:53:06.956081','2024-08-11 14:53:06.000000',2,'dba608cf23eb440bb782fd08088ca88f'),(338,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4ODAwNiwiaWF0IjoxNzIzMzAxNjA2LCJqdGkiOiI5Yjk2NzBkZmNkNDc0MzY4OGYwMjM0NWYzOWIwMWQxMiIsInVzZXJfaWQiOjJ9.QXyKFJyDY6fU0GHX23EXhQlAfETYykSxGfBqBGRrDM0','2024-08-10 14:53:26.161605','2024-08-11 14:53:26.000000',2,'9b9670dfcd4743688f02345f39b01d12'),(339,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4ODAwNiwiaWF0IjoxNzIzMzAxNjA2LCJqdGkiOiIzM2Y2MzFhMmI3YTU0ZjFhOGY1ZjFhNmRjMDA5ZDhlMiIsInVzZXJfaWQiOjJ9.IMTqZrrllCzNdiui4i06qzXrGsbDKDCyZyLihdWNGqk','2024-08-10 14:53:26.301234','2024-08-11 14:53:26.000000',2,'33f631a2b7a54f1a8f5f1a6dc009d8e2'),(340,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4ODAxMiwiaWF0IjoxNzIzMzAxNjEyLCJqdGkiOiIyODczN2FlZTk0MmQ0ZTM3OTYzNWU5ZTYwNmRjZDg4OCIsInVzZXJfaWQiOjJ9.vZlj-qhf23Z8Fl3kB7mQlQFkKmI7a1TbQJreG1xAtIs','2024-08-10 14:53:32.481047','2024-08-11 14:53:32.000000',2,'28737aee942d4e379635e9e606dcd888'),(341,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4ODAxMiwiaWF0IjoxNzIzMzAxNjEyLCJqdGkiOiI0MDJmNmU2MjlkNTg0N2ZiYWM4ODNmYjJiMDU4OTI3YiIsInVzZXJfaWQiOjJ9.4v09ccO1O22FwmE8vfpJHJyKR3gjBFkmW-nXI6qKPF4','2024-08-10 14:53:32.483042','2024-08-11 14:53:32.000000',2,'402f6e629d5847fbac883fb2b058927b'),(342,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4ODgyMCwiaWF0IjoxNzIzMzAyNDIwLCJqdGkiOiIzMTBkMTQwZWI4MzI0ODM5YWY5M2U4NDgxMzAwMTRkYyIsInVzZXJfaWQiOjJ9.8tflt9ySRYfr6IDgrUdahOyg6oFmKRjQxz8cHz1RiHE','2024-08-10 15:07:00.429282','2024-08-11 15:07:00.000000',2,'310d140eb8324839af93e848130014dc'),(343,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4ODgyMCwiaWF0IjoxNzIzMzAyNDIwLCJqdGkiOiI2MGM0MGI4OTRlMDU0MzU5YTc2N2UxNjNlZTZjMGNlOCIsInVzZXJfaWQiOjJ9.Q7RwhsYU8gkaht9nSrWjBEtCE9pmOODJNJPNJhdO1tg','2024-08-10 15:07:00.556941','2024-08-11 15:07:00.000000',2,'60c40b894e054359a767e163ee6c0ce8'),(344,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4OTU3MCwiaWF0IjoxNzIzMzAzMTcwLCJqdGkiOiJjNzUzYmZmMDMyY2U0MDE1YmVmNjBiYTIyNTllMTY5OSIsInVzZXJfaWQiOjJ9.BEWw9m9MpbpqFB-RyagMM8h7gOqOV-KU7zKxJopvkI4','2024-08-10 15:19:30.402975','2024-08-11 15:19:30.000000',2,'c753bff032ce4015bef60ba2259e1699'),(345,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4OTU3MCwiaWF0IjoxNzIzMzAzMTcwLCJqdGkiOiJlY2IwNjRmZWIyYzc0MTY3YjkzNjNlNDZlYTg1ZDMzNyIsInVzZXJfaWQiOjJ9.H6-pgb7hkCOI-he8hCwebWKfSMl-vTMcOHdvFq8p7KM','2024-08-10 15:19:30.768002','2024-08-11 15:19:30.000000',2,'ecb064feb2c74167b9363e46ea85d337'),(346,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4OTk2MCwiaWF0IjoxNzIzMzAzNTYwLCJqdGkiOiJlYjU4NTUwZDk3M2E0ODE3OGRmZDAzOTk5ZDdiMjY1NCIsInVzZXJfaWQiOjJ9.8IM4o6OHCjv2EYftIQa0E5RqEQp8L_buWLA6QyqLTsE','2024-08-10 15:26:00.589903','2024-08-11 15:26:00.000000',2,'eb58550d973a48178dfd03999d7b2654'),(347,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM4OTk2MCwiaWF0IjoxNzIzMzAzNTYwLCJqdGkiOiIyZmVjZTQ5NTY0MDg0NDdkODI2NzNjOTYyNTkxNmM1ZCIsInVzZXJfaWQiOjJ9.If_NR3HdVhXrHDK62TGidMVS7JoYLUvLyE4u-fOqlA0','2024-08-10 15:26:00.592895','2024-08-11 15:26:00.000000',2,'2fece4956408447d82673c9625916c5d'),(348,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MDA2OSwiaWF0IjoxNzIzMzAzNjY5LCJqdGkiOiIzMDQ0YWFiNjU4NWQ0OTZmODliYWVhMjhlNjhjNGI3MiIsInVzZXJfaWQiOjJ9.QeasOu9TPbMDOZuuTcFYIePur_jXfTYjIKpXAcAitDw','2024-08-10 15:27:49.508699','2024-08-11 15:27:49.000000',2,'3044aab6585d496f89baea28e68c4b72'),(349,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MDA2OSwiaWF0IjoxNzIzMzAzNjY5LCJqdGkiOiJmYjc4MGIzZmQ5MDQ0ZjA5YjkzMjlmMWQxZGQyODNkZSIsInVzZXJfaWQiOjJ9.Emhgz1wjJgrW_EcRCa0SoXx1TIeHkk9lZzLQzh8Vcno','2024-08-10 15:27:49.518674','2024-08-11 15:27:49.000000',2,'fb780b3fd9044f09b9329f1d1dd283de'),(350,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MDA3NCwiaWF0IjoxNzIzMzAzNjc0LCJqdGkiOiIwMTNiM2Q5YmFhZjk0YTM4YmMxMDM4OGU4ZTlhNmFiYyIsInVzZXJfaWQiOjJ9.SLgv7UZ_MetH9RM8Bhlq5hlg_348XUD6q4mvK9h-ZT0','2024-08-10 15:27:54.075364','2024-08-11 15:27:54.000000',2,'013b3d9baaf94a38bc10388e8e9a6abc'),(351,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MDA3NCwiaWF0IjoxNzIzMzAzNjc0LCJqdGkiOiJiM2E4Yzk5YmYyMGM0OTkyODk5ZWZhNTI2NDdiMThmMyIsInVzZXJfaWQiOjJ9.1LYpotd3lBpkloAxWozmD5PimM08tPLVFz_11N6JuZA','2024-08-10 15:27:54.078355','2024-08-11 15:27:54.000000',2,'b3a8c99bf20c4992899efa52647b18f3'),(352,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MDA4MCwiaWF0IjoxNzIzMzAzNjgwLCJqdGkiOiIzMWQzYTM1NWQ2OTI0ODhmODU3NDMwY2Q2ZGZjZmVjZSIsInVzZXJfaWQiOjJ9.XjOGZUBeHcZSqAbiR20kKk3dZb7dOc-xK2NFKUVGdXc','2024-08-10 15:28:00.458645','2024-08-11 15:28:00.000000',2,'31d3a355d692488f857430cd6dfcfece'),(353,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MDA4MCwiaWF0IjoxNzIzMzAzNjgwLCJqdGkiOiI2YjExNTFiYThjNDI0NjhjOTkzN2E1MTcyMTBmNGFhNyIsInVzZXJfaWQiOjJ9.VOFKO84E3duQQGF05QaYHJakYMd1hmYV4sXDmVxENOo','2024-08-10 15:28:00.569350','2024-08-11 15:28:00.000000',2,'6b1151ba8c42468c9937a517210f4aa7'),(354,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MDEwNCwiaWF0IjoxNzIzMzAzNzA0LCJqdGkiOiJjYTAyYzM5MzExZmY0MWVjODVjZGJiNDYzNzNkZGQxZiIsInVzZXJfaWQiOjJ9.Cx55ELcBoKzscLC91cTLwffwl4RYlFLuQ7R8JL6FbzY','2024-08-10 15:28:24.886345','2024-08-11 15:28:24.000000',2,'ca02c39311ff41ec85cdbb46373ddd1f'),(355,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MDEwNCwiaWF0IjoxNzIzMzAzNzA0LCJqdGkiOiI5M2EzMjU1NWU4ZTg0ZjJjYWY5ZWE4MzViN2RjYTc2YyIsInVzZXJfaWQiOjJ9.pklPyYg4ur9aoKdeVSBuLw9RcWUS81DPh123fXAz4NA','2024-08-10 15:28:24.974113','2024-08-11 15:28:24.000000',2,'93a32555e8e84f2caf9ea835b7dca76c'),(356,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MTU1OSwiaWF0IjoxNzIzMzA1MTU5LCJqdGkiOiJlMzVmODc2ZDAxMDQ0YzA5OGI3YTYzZWE3MTEwOWU1MSIsInVzZXJfaWQiOjJ9.EZG8cOJY8yGjJrsrREmtQrcXarEtd-hwflFfqBWimpU','2024-08-10 15:52:39.834345','2024-08-11 15:52:39.000000',2,'e35f876d01044c098b7a63ea71109e51'),(357,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MTU1OSwiaWF0IjoxNzIzMzA1MTU5LCJqdGkiOiI0MmU2NDU5NjEyNzI0ODQyOTBiOWFmOGY5ZmI1MjY2NiIsInVzZXJfaWQiOjJ9.w2qrqToD83rV3VpF69TeHTixOXmyOFASEaD53RQ6Z7A','2024-08-10 15:52:39.870251','2024-08-11 15:52:39.000000',2,'42e645961272484290b9af8f9fb52666'),(358,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MjY1MywiaWF0IjoxNzIzMzA2MjUzLCJqdGkiOiI0NWM3YTA2OGRjM2Y0ZDdhYmMwMzYwNDE5ZmNkOWMzNCIsInVzZXJfaWQiOjJ9.CXpnd9IvWP4nd1dmeAS6vGfGkOrAC7VXgpG68DRcYTU','2024-08-10 16:10:53.063074','2024-08-11 16:10:53.000000',2,'45c7a068dc3f4d7abc0360419fcd9c34'),(359,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MjY1MywiaWF0IjoxNzIzMzA2MjUzLCJqdGkiOiI2OGQ4YWY1MmRhMzU0ZjczODY3YjQyZWY1NDZmZDJmZSIsInVzZXJfaWQiOjJ9.7NfVq38P31iPtMsaeU2D9mFtj8PmsuLmIepiqWE4aqc','2024-08-10 16:10:53.065068','2024-08-11 16:10:53.000000',2,'68d8af52da354f73867b42ef546fd2fe'),(360,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5Mjc2NCwiaWF0IjoxNzIzMzA2MzY0LCJqdGkiOiJlMzU3NDQyNmZiNGE0MTM5YWY5YzcyYzQxZThmODEwMyIsInVzZXJfaWQiOjJ9.kzp3HowicPztF-SMQT02T2nZiGZV98wGVX13DlnSufQ','2024-08-10 16:12:44.739368','2024-08-11 16:12:44.000000',2,'e3574426fb4a4139af9c72c41e8f8103'),(361,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5Mjc2NCwiaWF0IjoxNzIzMzA2MzY0LCJqdGkiOiJkYmZjMmM5MDM5NTc0MDY4OGE1N2YzMWNiYTFhNjAwYyIsInVzZXJfaWQiOjJ9._RL6cDO89pYBPY6BjgGgOcMj205JVpnk-_9UqMGLzJM','2024-08-10 16:12:44.749619','2024-08-11 16:12:44.000000',2,'dbfc2c90395740688a57f31cba1a600c'),(362,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MzIzNiwiaWF0IjoxNzIzMzA2ODM2LCJqdGkiOiIwOTQxNTczNjNiNWM0ODZkYjM0YmQ3ZWY2ZjEzNTY2YiIsInVzZXJfaWQiOjJ9.eqqgsAYBeKrfXZLZWbBP99OEpxX7xMbQjZ57PPebwmY','2024-08-10 16:20:36.055324','2024-08-11 16:20:36.000000',2,'094157363b5c486db34bd7ef6f13566b'),(363,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MzIzNiwiaWF0IjoxNzIzMzA2ODM2LCJqdGkiOiIzNWRlNDJkNmY4NjY0OTA2YTQ4ODE3MTM4NDJiMjcxMiIsInVzZXJfaWQiOjJ9.9yBtBpKeQhU16iIFrhRi_nonx1Gs3BCwUuxb-T3pfqY','2024-08-10 16:20:36.416635','2024-08-11 16:20:36.000000',2,'35de42d6f8664906a4881713842b2712'),(364,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MzI1NywiaWF0IjoxNzIzMzA2ODU3LCJqdGkiOiIzNzI2Zjc4YmI5ZmQ0MjE0OGQwMWM4Y2U3YWFjMmFkNSIsInVzZXJfaWQiOjJ9.3wzDPlHddE0s-fQeCGTrZUaqtN1ukSSPJ7DrgxQKWkk','2024-08-10 16:20:57.242840','2024-08-11 16:20:57.000000',2,'3726f78bb9fd42148d01c8ce7aac2ad5'),(365,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MzI1NywiaWF0IjoxNzIzMzA2ODU3LCJqdGkiOiJkZTBlYzhiY2IyYjY0YTNkYTYwYjRhODY4NWJmZjNkMyIsInVzZXJfaWQiOjJ9.cwkDUrgD-4f-moCrFBOrCX1uEXJL8AWK7MKHPVtZf5M','2024-08-10 16:20:57.311662','2024-08-11 16:20:57.000000',2,'de0ec8bcb2b64a3da60b4a8685bff3d3'),(366,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MzUxNSwiaWF0IjoxNzIzMzA3MTE1LCJqdGkiOiI4YjEwNDBjOWZlNWM0NDQxODI0MTRlMmRhOTk2NzJmMyIsInVzZXJfaWQiOjJ9.cds0idkOKjeKq83f91OLSLfRRjEn6Tldr5VFefC7axI','2024-08-10 16:25:15.492795','2024-08-11 16:25:15.000000',2,'8b1040c9fe5c444182414e2da99672f3'),(367,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MzUxNSwiaWF0IjoxNzIzMzA3MTE1LCJqdGkiOiJiZjFkNDJmZTAzYWU0YmU4YjM4ZDE5MzY5ZjU2YTNmMyIsInVzZXJfaWQiOjJ9.z0_NDxezzOb3ga6O_UcjynF7qWwD-ucFql1t33G9j_M','2024-08-10 16:25:15.588531','2024-08-11 16:25:15.000000',2,'bf1d42fe03ae4be8b38d19369f56a3f3'),(368,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MzkxNSwiaWF0IjoxNzIzMzA3NTE1LCJqdGkiOiI4NjdlMzZjNDA0MmE0ODZmODc5OTAwOTA4Njc4Mzc1OCIsInVzZXJfaWQiOjJ9.RCRrQqdEuHuZmwXurh1QL465SHDm36fxrObkV4Rb3x8','2024-08-10 16:31:55.401655','2024-08-11 16:31:55.000000',2,'867e36c4042a486f8799009086783758'),(369,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5MzkxNSwiaWF0IjoxNzIzMzA3NTE1LCJqdGkiOiJjMTM4MDdhZjMyZWY0YmU1YmU4ZmJhNDZmYmM0NjIwNCIsInVzZXJfaWQiOjJ9._jYGjdvcM-KCfu7EO2USqWE1kIxSQAwwwFNTU4CIvR4','2024-08-10 16:31:55.493553','2024-08-11 16:31:55.000000',2,'c13807af32ef4be5be8fba46fbc46204'),(370,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NDA3NSwiaWF0IjoxNzIzMzA3Njc1LCJqdGkiOiI4Y2ZlZThlMjZlN2Q0NDQ2OWYzNTc1MGI4NTY5YWJmYyIsInVzZXJfaWQiOjJ9.lKOUJoV3W0_ljQSC0sYx1Fh0L_KPRJEf-cGPUqEYPRA','2024-08-10 16:34:35.795262','2024-08-11 16:34:35.000000',2,'8cfee8e26e7d44469f35750b8569abfc'),(371,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NDA3NSwiaWF0IjoxNzIzMzA3Njc1LCJqdGkiOiIyZDg0NDI1YTVkYTg0OGM2YTUwODFkMjFiN2E4NDk5MCIsInVzZXJfaWQiOjJ9.f73iep-Al1Y0GBHTMsmqVBN7XBSU7AeSpimQ9afUIIA','2024-08-10 16:34:35.800417','2024-08-11 16:34:35.000000',2,'2d84425a5da848c6a5081d21b7a84990'),(372,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NDQxNCwiaWF0IjoxNzIzMzA4MDE0LCJqdGkiOiI4YjA4ZDM5OTlmMWU0MTQ4OTIyZmQ3Mjg2NWU2NjNjMCIsInVzZXJfaWQiOjJ9.0jMUbYrsFjIsjYMu-7xcS0Pc-tCfvwtcY0SJQr6wdP8','2024-08-10 16:40:14.491651','2024-08-11 16:40:14.000000',2,'8b08d3999f1e4148922fd72865e663c0'),(373,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NDQxNCwiaWF0IjoxNzIzMzA4MDE0LCJqdGkiOiJjY2VlNGI3NDk3MDA0MWZiOTY5NGQwMjhkMmZlNzM4MSIsInVzZXJfaWQiOjJ9.WztiBz_w7gdib5PKJYLZEgw-cEOKCMKqQGxZPBBG9A8','2024-08-10 16:40:14.517817','2024-08-11 16:40:14.000000',2,'ccee4b74970041fb9694d028d2fe7381'),(374,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NDQyNSwiaWF0IjoxNzIzMzA4MDI1LCJqdGkiOiIxMDVhYWJiMjg2OTg0MDE3OGQxMTViYTlkYjE0MTVmMCIsInVzZXJfaWQiOjJ9.2rYdwnM1ofbBC_pM9UVFQTMlePcYbtBPH7B75ynLL3s','2024-08-10 16:40:25.750795','2024-08-11 16:40:25.000000',2,'105aabb2869840178d115ba9db1415f0'),(375,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NDQyNSwiaWF0IjoxNzIzMzA4MDI1LCJqdGkiOiJiZGNhZThmMmU5NGQ0M2E1YjA4OGY1NTIyMTI5YjQ3OSIsInVzZXJfaWQiOjJ9.OOqhWWy33Q3msbRXDOZnYWzUpOoXhY0KE35LSWwLtEg','2024-08-10 16:40:25.764886','2024-08-11 16:40:25.000000',2,'bdcae8f2e94d43a5b088f5522129b479'),(376,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NDg4MCwiaWF0IjoxNzIzMzA4NDgwLCJqdGkiOiJiN2Y0MjBkZmM1OGY0M2FjOTcyNjBkMzg3MWI5YTQ5MSIsInVzZXJfaWQiOjJ9.UmkzCajdnoO9sTDm5mlOcd7evWYguEL8JbUUD_ipG1I','2024-08-10 16:48:00.709174','2024-08-11 16:48:00.000000',2,'b7f420dfc58f43ac97260d3871b9a491'),(377,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NDg4MCwiaWF0IjoxNzIzMzA4NDgwLCJqdGkiOiJlMDk4NGYxNDJhNzg0MDdiYjM0YzI0ODg1MmIwMjg0NiIsInVzZXJfaWQiOjJ9.AoOeZGpW_k0xQ1RUahWm5YtB4DWS3P0XoqqaDNar29E','2024-08-10 16:48:00.727127','2024-08-11 16:48:00.000000',2,'e0984f142a78407bb34c248852b02846'),(378,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NTgyOCwiaWF0IjoxNzIzMzA5NDI4LCJqdGkiOiIwM2NhNTNhNGM5MWI0NmFiYjg0M2U2ZDI3MjY2ZDU1ZSIsInVzZXJfaWQiOjJ9._phs1kKzwLCsf8_IK52hPlmy64wnG92Usis_mG95TTg','2024-08-10 17:03:48.786161','2024-08-11 17:03:48.000000',2,'03ca53a4c91b46abb843e6d27266d55e'),(379,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NTgyOCwiaWF0IjoxNzIzMzA5NDI4LCJqdGkiOiJmOTE3YjYyZjVkZjI0M2YyYWUwMmZiN2Y0YTVjNjcxMCIsInVzZXJfaWQiOjJ9.qXsVK1HcIUldZyMx3JL6F28tdL8KPyGLecOgxa1l4P4','2024-08-10 17:03:48.796203','2024-08-11 17:03:48.000000',2,'f917b62f5df243f2ae02fb7f4a5c6710'),(380,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NzMyNiwiaWF0IjoxNzIzMzEwOTI2LCJqdGkiOiIyM2RkMjgxNjJjMWY0ZGExYWVhMjM3MDU0NzA0ZDc5ZSIsInVzZXJfaWQiOjJ9.FbWOqhUHy5y7BwiPz23M6abTE5YfLUPgZVWlQ0H61Fg','2024-08-10 17:28:46.738479','2024-08-11 17:28:46.000000',2,'23dd28162c1f4da1aea237054704d79e'),(381,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NzMyNiwiaWF0IjoxNzIzMzEwOTI2LCJqdGkiOiJhYjc4YjY1Y2JmNzY0MThmYTdjZDQ4ODNjZjc3YTc4OSIsInVzZXJfaWQiOjJ9.BWEvxzbYqFxp8Pz-MOxga0ty-4UBn3vCgsRvR0wBRuU','2024-08-10 17:28:46.771391','2024-08-11 17:28:46.000000',2,'ab78b65cbf76418fa7cd4883cf77a789'),(382,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NzQyNiwiaWF0IjoxNzIzMzExMDI2LCJqdGkiOiIzNmM0MGUzYjE4ZTA0MTdkYmVjZjYyZWE2OTM0ZjU3NyIsInVzZXJfaWQiOjJ9.Lj66YBvOle_elgJMoIuqRjtRe8XrAdpkVYeBIWLdpNQ','2024-08-10 17:30:26.713706','2024-08-11 17:30:26.000000',2,'36c40e3b18e0417dbecf62ea6934f577'),(383,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5NzQyNiwiaWF0IjoxNzIzMzExMDI2LCJqdGkiOiI5YmVmYWZhNmI0YmU0YjA4OWMyOTllZGE5N2Q0ZWRiNyIsInVzZXJfaWQiOjJ9.10yHFxSJthGIPnPEPb46Lptg0BsiO89NXERVF7OlTvc','2024-08-10 17:30:26.762176','2024-08-11 17:30:26.000000',2,'9befafa6b4be4b089c299eda97d4edb7'),(384,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5ODE1NiwiaWF0IjoxNzIzMzExNzU2LCJqdGkiOiI2MjljMmNhM2JiNTE0N2U3YTIxNzJkNDlmZjI4NzI3NCIsInVzZXJfaWQiOjJ9.5csBOj8QoT89-9JGogfBJdx1KWlc7Dbcztb8WeTb_6o','2024-08-10 17:42:36.101516','2024-08-11 17:42:36.000000',2,'629c2ca3bb5147e7a2172d49ff287274'),(385,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5ODE1NiwiaWF0IjoxNzIzMzExNzU2LCJqdGkiOiIxYmUwMzljYTQzYjE0ODQ2YmRjNjI5ZDFiN2IxMzdkZSIsInVzZXJfaWQiOjJ9._N-svkv0VSIEOiT6A01otuv059a25JakNmK1Z53kIbM','2024-08-10 17:42:36.218673','2024-08-11 17:42:36.000000',2,'1be039ca43b14846bdc629d1b7b137de'),(386,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5ODQwMCwiaWF0IjoxNzIzMzEyMDAwLCJqdGkiOiI1NjUwODY1ZDFlNTQ0NGVhODE5ZTNhNTY4YzA3ZGI0YiIsInVzZXJfaWQiOjJ9._pGidy7k_RxQ_q_KjSnt3iq5G7pCuxSwf-kI_waqohA','2024-08-10 17:46:40.713454','2024-08-11 17:46:40.000000',2,'5650865d1e5444ea819e3a568c07db4b'),(387,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5ODQwMCwiaWF0IjoxNzIzMzEyMDAwLCJqdGkiOiJjMTUzZTFmNTZjZjc0Y2IzYmQ4NWY1MDdlMDAwYjU3ZCIsInVzZXJfaWQiOjJ9.1irfpd0MWTkfwNXbivMfO0YFCXvDXcY-u1fgQ5QEmWc','2024-08-10 17:46:40.767291','2024-08-11 17:46:40.000000',2,'c153e1f56cf74cb3bd85f507e000b57d'),(388,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5ODYyOSwiaWF0IjoxNzIzMzEyMjI5LCJqdGkiOiI5NmFkZTVmYjNmNzk0Zjc3YTUxYjBkZjhiMTAwYzBjMiIsInVzZXJfaWQiOjJ9.SFI6D8P2REQzeFE3bjrkXFSQvGgSVwfW04HZCmZSVtU','2024-08-10 17:50:29.409923','2024-08-11 17:50:29.000000',2,'96ade5fb3f794f77a51b0df8b100c0c2'),(389,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5OTAyNSwiaWF0IjoxNzIzMzEyNjI1LCJqdGkiOiI2Yjk4OTZmMDJlYmY0NzJhYjlhMDAyM2Y4YmM1ODNjNyIsInVzZXJfaWQiOjJ9.1y81iuU8mCliSrjaFR6GVa1Q1Q4XXx5QUie7k34koUM','2024-08-10 17:57:05.069321','2024-08-11 17:57:05.000000',2,'6b9896f02ebf472ab9a0023f8bc583c7'),(390,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMzM5OTAyNSwiaWF0IjoxNzIzMzEyNjI1LCJqdGkiOiJlNmM5ZmZlOTRmM2M0NzU1ODI2MDY2ODVjY2U0NGRlMSIsInVzZXJfaWQiOjJ9.o0cRc--GHzAmb73wEZlaPKXUEvpKzk3uo-4SJidZTAA','2024-08-10 17:57:05.078297','2024-08-11 17:57:05.000000',2,'e6c9ffe94f3c475582606685cce44de1');
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `address` text,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'john_doe','hashed_password','john@example.com','John','Doe',NULL,NULL,'2024-07-26 13:44:07');
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

-- Dump completed on 2024-08-23  7:46:25
