DROP TABLE IF EXISTS `competencias`;

CREATE TABLE `competencias` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1024 DEFAULT CHARSET=latin1;

LOCK TABLES `competencias` WRITE;
INSERT INTO `competencias`(nombre) 
	VALUES ('¿Cuál es la mejor película?'),
    ('¿Qué drama te hizo llorar más?'),
    ('¿Cuál es la peli más bizarra?'),
    ('¿Cuál es la película mas enigmatica?'),
    ('¿Cuál es la película con mejor historia?'),
    ('¿Cuál es la película con mejor animacion?');
UNLOCK TABLES;