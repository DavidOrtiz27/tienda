-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 11-07-2025 a las 01:58:03
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `uploads`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_productos` int(11) NOT NULL,
  `codigo` varchar(200) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `gramaje` varchar(80) DEFAULT NULL,
  `precio` int(120) DEFAULT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `stock` int(100) DEFAULT NULL,
  `url_ruta_img` varchar(244) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_productos`, `codigo`, `nombre`, `gramaje`, `precio`, `descripcion`, `stock`, `url_ruta_img`) VALUES
(21, 'ADSO111', 'Fentanilo premium', '150g', 2000, 'vamos a enviciarnos', 50, 'uploads/ADSO111/imagen_1752186255266_descarga.jpeg'),
(22, 'ADSO113', 'Flor', '150g', 2000, 'flor bonita :)', 20, 'uploads/ADSO113/imagen_1752187399866_descarga.jpeg'),
(23, 'ADSO112', 'Jirasol', '150g', 2000, 'flor bonita', 50, 'uploads/ADSO112/imagen_1752188996132_descarga.jpeg'),
(24, 'ADSO115', 'Pepe actualizado', '200g', 2500, 'Pepe gato actualizado', 25, 'uploads/ADSO114/imagen_pepe.jpeg'),
(26, 'Plch001', 'Stich Azul', '1 M', 20000, 'Hermoso Stich Azul Con cara tierna', 10, 'uploads/Plch001/imagen_Stich Tierno.jpeg');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_productos`),
  ADD UNIQUE KEY `codigo_UNIQUE` (`codigo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_productos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
