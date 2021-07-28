-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 28, 2021 at 03:04 PM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `salon_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_transaksi`
--

CREATE TABLE `detail_transaksi` (
  `id_transaksi` int(255) NOT NULL,
  `id_produk` int(255) NOT NULL,
  `jumlah` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(255) NOT NULL,
  `nama_kategori` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`) VALUES
(1, 'Perawatan Tubuh'),
(2, 'Perawatan Rambut');

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `id_produk` int(255) NOT NULL,
  `id_kategori` int(255) DEFAULT NULL,
  `nama_produk` varchar(255) DEFAULT NULL,
  `harga_jual` double DEFAULT NULL,
  `qty` int(20) DEFAULT NULL,
  `gambar_produk` text DEFAULT NULL,
  `deskripsi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id_produk`, `id_kategori`, `nama_produk`, `harga_jual`, `qty`, `gambar_produk`, `deskripsi`) VALUES
(1, 1, 'Shinzui Skin Lightening Body Scrub Matsu', 18000, 17, 'k8nhHRz8ew.jpeg', 'Untuk mencerahkan kulit'),
(2, 2, 'Elips', 10000, 16, 'QR4m4KlK22.jpeg', 'Untuk menata rambut dengan catokan'),
(3, 1, 'Wardah soft body scrub', 35000, 17, 'Uv2RdCgamB.jpeg', 'Memiliki wangi segar, untuk kulit sensitif'),
(4, 1, 'Mustika Ratu Coffe Body Scrub', 50000, 18, 'o4QAHcEwNO.jpeg', 'Untuk mengatasi Atasi bau badan'),
(6, 1, 'Herborist lulur zaitun', 13000, 19, 'Z1qLYGw3Jz.png', 'Merawat kulit kering yang kasar dan kusam'),
(7, 1, 'Aiwax Sugar Waxing kit', 89000, 20, '5bBAEaC2ZL.jpeg', 'Untuk mencerahkan kulit'),
(8, 1, 'Sugar pot honey wax', 95000, 20, 'CW0rAPxrQc.jpeg', 'Untuk membersihkan kulit dari bulu halus yang mengganggu'),
(9, 1, 'Cool sugar wax', 79000, 20, 'cT12YKhOk2.jpeg', 'Untuk mencerahkan dan membuat kulit lebih sehat'),
(10, 1, 'Mirael sugar waxing kit', 85000, 20, 'Gi4s9Qf58l.jpeg', 'Untuk digunakan pada kaki, tangan, ketiak, paha'),
(11, 1, 'Veet almond wax strips', 77000, 20, 'IarOr6NVkM.jpeg', 'Untuk menghilangkan bulu pada tubuh'),
(12, 2, 'Loreal Paris', 40000, 20, 'HvcnPr2rum.jpeg', 'Untuk rambut kering, rusak'),
(13, 2, 'TRESemme Deep', 40000, 20, 'atYfYh0yQ3.jpeg', 'Untuk rambut kering'),
(14, 2, 'Makarizo Hair Energy', 75000, 20, 'U1ywHUvpHq.jpeg', 'Untuk rambut rontok, kusam'),
(15, 2, 'Pantene total damage', 40000, 20, 'eJtJEBQZ0a.jpeg', 'Untuk menjaga kesehatan rambut dan memberikan hidrasi pada rambut'),
(16, 2, 'Matrix ', 68000, 20, 'ujLXY0W048.jpeg', 'Untuk pewarna rambut'),
(17, 2, 'Makarizo', 70000, 20, 'fNTG9IcOcc.jpeg', 'Untuk pewarna rambut'),
(18, 2, 'Miranda', 100000, 20, 'TgnpUZXFE6.jpeg', 'Untuk pewarna rambut');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id_transaksi` int(255) NOT NULL,
  `id_pelanggan` int(255) DEFAULT NULL,
  `tgl_transaksi` date DEFAULT curdate(),
  `status_transaksi` enum('proses','batal','selesai') DEFAULT 'proses',
  `tipe_bayar` enum('langsung','cod','transfer') DEFAULT NULL,
  `status_pembayaran` enum('belum dibayar','dibayar') DEFAULT 'belum dibayar',
  `tgl_bayar` date DEFAULT NULL,
  `alamat_kirim` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(255) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `email` text DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','pelanggan') DEFAULT 'pelanggan',
  `telepon` text DEFAULT NULL,
  `alamat` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `nama`, `email`, `password`, `role`, `telepon`, `alamat`) VALUES
(1, 'Admin', 'admin@gmail.com', '$2b$08$EtDDhvPZU4QopEJTNQR1UO2T2dbc5sy9YChhZn2IU9rcVXACVZkmO', 'admin', '081123123123', 'Alamat 123')

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_transaksi`
--
ALTER TABLE `detail_transaksi`
  ADD PRIMARY KEY (`id_transaksi`,`id_produk`),
  ADD KEY `fk_detail_transaksi_produk_1` (`id_produk`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`),
  ADD KEY `fk_produk_kategori_1` (`id_kategori`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `fk_transaksi_pelanggan_1` (`id_pelanggan`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id_transaksi` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_transaksi`
--
ALTER TABLE `detail_transaksi`
  ADD CONSTRAINT `fk_detail_transaksi_produk_1` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`),
  ADD CONSTRAINT `fk_detail_transaksi_transaksi_1` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id_transaksi`);

--
-- Constraints for table `produk`
--
ALTER TABLE `produk`
  ADD CONSTRAINT `fk_produk_kategori_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`);

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `fk_transaksi_pelanggan_1` FOREIGN KEY (`id_pelanggan`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
