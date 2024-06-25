-- --------------------------------------------------------
-- Host:                         68.183.92.114
-- Server version:               10.4.20-MariaDB-1:10.4.20+maria~buster-log - mariadb.org binary distribution
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table tdgbejrfqj.app_users
CREATE TABLE IF NOT EXISTS `app_users` (
  `userid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User ID, Primary Key',
  `authname` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT 'User Name Email or phone',
  `firstname` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `lastname` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `gender` int(11) DEFAULT 0 COMMENT '1->Male , 2-> Female',
  `password` varchar(150) COLLATE utf8_bin NOT NULL DEFAULT '',
  `devicetype` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `deviceid` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `fcmtoken` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `authmode` int(11) unsigned DEFAULT 0,
  `configid` int(11) DEFAULT NULL,
  `roleid` int(11) DEFAULT 1 COMMENT '1=>admin,2=>partner,3=>pos',
  `pin` int(11) DEFAULT NULL,
  `usertype` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `tenantid` int(11) DEFAULT NULL,
  `locationid` int(11) DEFAULT NULL,
  `status` char(10) COLLATE utf8_bin NOT NULL DEFAULT 'Active',
  `created` timestamp NULL DEFAULT current_timestamp(),
  `updated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`userid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=363 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Dumping data for table tdgbejrfqj.app_users: ~1 rows (approximately)
INSERT INTO `app_users` (`userid`, `authname`, `firstname`, `lastname`, `gender`, `password`, `devicetype`, `deviceid`, `fcmtoken`, `authmode`, `configid`, `roleid`, `pin`, `usertype`, `tenantid`, `locationid`, `status`, `created`, `updated`) VALUES
	(1, 'test@gmail.com', 'test', 'test', 1, '$2b$10$x6i8fcETm8QKtPeB8tR5IeDc49ESgAaL09E9owI9WEnGRPwMxtYbq', NULL, NULL, NULL, 0, 1, 1, NULL, NULL, 0, NULL, 'Inactive', '2023-08-23 10:54:43', '2023-11-08 07:54:11');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
