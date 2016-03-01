CREATE USER 'uq_parking'@'localhost' IDENTIFIED BY 'uq_parking';
GRANT ALL PRIVILEGES ON uq_parking.* TO 'uq_parking'@'localhost' WITH GRANT OPTION;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
CREATE DATABASE IF NOT EXISTS `uq_parking` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `uq_parking`;

CREATE USER 'uq_parking'@'localhost' IDENTIFIED BY 'uq_parking';
GRANT ALL ON uq_parking.* TO 'uq_parking'@'localhost';

DROP TABLE IF EXISTS `car_park_info`;
CREATE TABLE IF NOT EXISTS `car_park_info` (
  `id` int(11) NOT NULL,
  `car_park` int(11) NOT NULL,
  `available` int(11) NOT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `car_parks`;
CREATE TABLE IF NOT EXISTS `car_parks` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `data_name` text NOT NULL,
  `casual` tinyint(1) NOT NULL DEFAULT '1',
  `active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `car_parks`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `car_park_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car_park` (`car_park`);


ALTER TABLE `car_parks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `car_park_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `car_park_info`
  ADD CONSTRAINT `car_park_info_ibfk_1` FOREIGN KEY (`car_park`) REFERENCES `car_parks` (`id`);
