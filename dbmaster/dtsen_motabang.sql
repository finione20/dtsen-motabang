-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 28, 2026 at 08:48 AM
-- Server version: 5.6.50
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dtsen_motabang`
--

-- --------------------------------------------------------

--
-- Table structure for table `operator`
--

CREATE TABLE `operator` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `operator`
--

INSERT INTO `operator` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'desamtbg', '$2a$10$9QC6nd4/Tcf1vgVuIclz9.U37bxo7jNRWXYD5LTSZHTAaARjv2k2K', '2026-05-28 07:37:20');

-- --------------------------------------------------------

--
-- Table structure for table `statistik_desa`
--

CREATE TABLE `statistik_desa` (
  `id` int(11) NOT NULL,
  `jumlah_keluarga` int(11) DEFAULT '0',
  `jumlah_penduduk` int(11) DEFAULT '0',
  `desil_1` int(11) DEFAULT '0',
  `desil_2` int(11) DEFAULT '0',
  `desil_3` int(11) DEFAULT '0',
  `desil_4` int(11) DEFAULT '0',
  `desil_5` int(11) DEFAULT '0',
  `desil_6_10` int(11) DEFAULT '0',
  `belum_pemeringkatan` int(11) DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `statistik_desa`
--

INSERT INTO `statistik_desa` (`id`, `jumlah_keluarga`, `jumlah_penduduk`, `desil_1`, `desil_2`, `desil_3`, `desil_4`, `desil_5`, `desil_6_10`, `belum_pemeringkatan`, `updated_at`) VALUES
(1, 1337, 3927, 244, 631, 308, 381, 390, 1597, 376, '2026-05-28 07:56:54');

-- --------------------------------------------------------

--
-- Table structure for table `warga`
--

CREATE TABLE `warga` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `nik` varchar(16) NOT NULL,
  `no_kk` varchar(16) NOT NULL,
  `desil` varchar(50) DEFAULT NULL,
  `status_padan` varchar(50) DEFAULT NULL,
  `penerima_pkh` tinyint(1) DEFAULT '0',
  `penerima_bpnt` tinyint(1) DEFAULT '0',
  `penerima_bpjs_pbi` tinyint(1) DEFAULT '0',
  `penerima_santunan_yatim` tinyint(1) DEFAULT '0',
  `blts_kesra` tinyint(1) DEFAULT '0',
  `sudah_kirim_foto_rumah` tinyint(1) DEFAULT '0',
  `riwayat_desil` text,
  `keterangan_lain` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `warga`
--

INSERT INTO `warga` (`id`, `nama`, `nik`, `no_kk`, `desil`, `status_padan`, `penerima_pkh`, `penerima_bpnt`, `penerima_bpjs_pbi`, `penerima_santunan_yatim`, `blts_kesra`, `sudah_kirim_foto_rumah`, `riwayat_desil`, `keterangan_lain`, `created_at`, `updated_at`) VALUES
(7, 'Budi', '1234556978979123', '1234556978979123', NULL, NULL, 0, 0, 0, 0, 0, 1, NULL, NULL, '2026-05-28 07:25:25', '2026-05-28 07:25:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `operator`
--
ALTER TABLE `operator`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `statistik_desa`
--
ALTER TABLE `statistik_desa`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `warga`
--
ALTER TABLE `warga`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nik_unique` (`nik`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `operator`
--
ALTER TABLE `operator`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `statistik_desa`
--
ALTER TABLE `statistik_desa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `warga`
--
ALTER TABLE `warga`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
