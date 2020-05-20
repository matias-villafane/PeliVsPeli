DROP TABLE IF EXISTS `competencias`;

CREATE TABLE `competencias` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `id_genero` int unsigned,
  `id_director` int unsigned,
  `id_actor` int unsigned,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=1029 DEFAULT CHARSET=latin1;

LOCK TABLES `competencias` WRITE;
INSERT INTO `competencias`
	VALUES (1024,'¿Cuál es la mejor película?',null,null,null),
    (1025,'¿Qué drama te hizo llorar más?',8,null,null),
    (1026,'¿Cuál es la peli más bizarra?',5,null,null),
    (1027,'¿Cuál es la mejor película de Adam Sandler?',null,null,13),
    (1028,'¿Cuál es la película con mejor animacion?',3,null,null);
UNLOCK TABLES;

CREATE TABLE `votos` (
  `id_pelicula` int unsigned NOT NULL,
  `id_competencia` int unsigned NOT NULL
);