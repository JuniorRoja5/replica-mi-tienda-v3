-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 21, 2025 at 03:56 PM
-- Server version: 8.0.41-32
-- PHP Version: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbzyigrezaix7n`
--

-- --------------------------------------------------------

--
-- Table structure for table `applied_coupons`
--

CREATE TABLE `applied_coupons` (
  `id` int UNSIGNED NOT NULL,
  `applied_coupon_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `coupon_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `backups`
--

CREATE TABLE `backups` (
  `id` int UNSIGNED NOT NULL,
  `backup_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'file',
  `version` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `backups`
--

INSERT INTO `backups` (`id`, `backup_id`, `type`, `version`, `file_name`, `path`, `status`, `created_at`, `updated_at`) VALUES
(1, '68476e0319dcf', 'file', '16.5.0', 'file_backup_v1650_2025-06-09.zip', 'backups/file_backup_v1650_2025-06-09.zip', 0, '2025-06-09 21:28:03', '2025-06-17 16:21:36'),
(2, '68476e050183b', 'database', '16.5.0', 'database_backup_v1650_2025-06-09_23-28-05.sql', 'backups/database/database_backup_v1650_2025-06-09_23-28-05.sql', 0, '2025-06-09 21:28:05', '2025-06-17 16:21:39'),
(3, '6851b23fee599', 'file', '16.5.0', 'file_backup_v1650_2025-06-17.zip', 'backups/file_backup_v1650_2025-06-17.zip', 0, '2025-06-17 16:21:51', '2025-06-17 16:32:00'),
(4, '6851e317e4b9b', 'file', '16.5.0', 'file_backup_v1650_2025-06-17.zip', 'backups/file_backup_v1650_2025-06-17.zip', 0, '2025-06-17 19:50:15', '2025-06-22 07:55:15'),
(5, '6851e31a46e06', 'database', '16.5.0', 'database_backup_v1650_2025-06-17_21-50-18.sql', 'backups/database/database_backup_v1650_2025-06-17_21-50-18.sql', 0, '2025-06-17 19:50:18', '2025-06-22 07:55:19'),
(6, '6857d30ff1669', 'file', '16.5.0', 'file_backup_v1650_2025-06-22.zip', 'backups/file_backup_v1650_2025-06-22.zip', 1, '2025-06-22 07:55:27', '2025-06-22 07:55:27'),
(7, '6857d31209da2', 'database', '16.5.0', 'database_backup_v1650_2025-06-22_09-55-30.sql', 'backups/database/database_backup_v1650_2025-06-22_09-55-30.sql', 1, '2025-06-22 07:55:30', '2025-06-22 07:55:30');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int UNSIGNED NOT NULL,
  `published_by` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blog_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `heading` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `long_description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `keywords` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` int UNSIGNED NOT NULL,
  `published_by` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blog_category_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blog_category_title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `blog_category_slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `published_by`, `blog_category_id`, `blog_category_title`, `blog_category_slug`, `status`, `created_at`, `updated_at`) VALUES
(1, '1', '6610f1bad965c', 'Uncategory', 'uncategory', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32');

-- --------------------------------------------------------

--
-- Table structure for table `booked_appointments`
--

CREATE TABLE `booked_appointments` (
  `id` int UNSIGNED NOT NULL,
  `booked_appointment_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `booking_date` date NOT NULL,
  `booking_time` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_price` double NOT NULL DEFAULT '0',
  `booking_status` int NOT NULL DEFAULT '0',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `business_cards`
--

CREATE TABLE `business_cards` (
  `id` int UNSIGNED NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'business',
  `theme_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `card_lang` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EN',
  `cover` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'photo',
  `profile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `card_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `custom_domain` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `card_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `enquiry_email` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `appointment_receive_email` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_newsletter_pop_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_info_pop_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_enable_pwa` tinyint(1) NOT NULL DEFAULT '1',
  `custom_styles` json DEFAULT NULL,
  `custom_css` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `custom_js` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `expiry_time` timestamp NULL DEFAULT NULL,
  `delivery_options` text COLLATE utf8mb4_unicode_ci,
  `seo_configurations` text COLLATE utf8mb4_unicode_ci,
  `card_status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activated',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `business_cards`
--

INSERT INTO `business_cards` (`id`, `card_id`, `user_id`, `type`, `theme_id`, `card_lang`, `cover`, `cover_type`, `profile`, `card_url`, `custom_domain`, `card_type`, `title`, `sub_title`, `description`, `enquiry_email`, `appointment_receive_email`, `is_newsletter_pop_active`, `is_info_pop_active`, `is_enable_pwa`, `custom_styles`, `custom_css`, `custom_js`, `password`, `expiry_time`, `delivery_options`, `seo_configurations`, `card_status`, `status`, `created_at`, `updated_at`) VALUES
(1, '684761d3646f6', '68475dc954ad5', 'business', '588969111139', 'es', 'ZP0bJEpnUkA', 'youtube', 'storage/profile-images/xX8iIaGYH6H7zNlpBRcH.png', '684761d3646f6', NULL, 'vcard', 'Junior Testing', 'Programador Web', '<p>Esto es una bio de ejemlo</p>', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-09 20:36:03', '2025-07-21 05:47:22'),
(2, '684784ae2ede2', '68475dc954ad5', 'business', '588969111146', 'en', '0DjHYeznJgk', 'youtube', 'storage/profile-images/VrfAFDxB1xAlS9Da72Iy.png', '684784ae2ede2', NULL, 'vcard', 'Testing', 'Testing card', '<p>Testing card</p>', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-09 23:04:46', '2025-07-21 05:49:24'),
(3, '68478de3a8278', '68475dc954ad5', 'business', '588969111133', 'es', 'storage/profile-images/mAmf1LQR5WfLT7Ag0Vx1.png', 'photo', 'storage/profile-images/WpaK5xxQioHWfS3ezvnG.png', '68478de3a8278', NULL, 'vcard', 'testing title', 'Testing card', '<p>Testing</p>', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-09 23:44:03', '2025-07-21 05:49:40'),
(4, '68481f2f31886', '68475dc954ad5', 'business', '588969111146', 'en', 'storage/profile-images/0jATCeBFuQE4qMoOGJwG.png', 'photo', 'storage/profile-images/WGcEedw3RnSzY3FufL99.png', '68481f2f31886', NULL, 'vcard', 'testing', 'Programador Web', '<p>TEST</p>', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 10:03:59', '2025-07-21 05:49:43'),
(5, '6848220b70360', '68475dc954ad5', 'business', '588969111146', 'en', 'storage/profile-images/WRoDovoMngV98ebvwKgv.png', 'photo', 'storage/profile-images/gitFSpOS2TLYG5UiVDh4.png', '6848220b70360', NULL, 'vcard', 'test', 'Programador Web', '<p>test</p>', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 10:16:11', '2025-07-21 05:49:27'),
(6, '684822eb5a702', '68475dc954ad5', 'business', '588969111146', 'en', 'storage/profile-images/d9LLnXLeImpP69qWF4ct.png', 'photo', 'storage/profile-images/5bAQhGdPyzgswxHXYlm7.png', '684822eb5a702', NULL, 'vcard', 'testing', 'testing', '<p>testing card</p>', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 10:19:55', '2025-07-21 05:49:30'),
(7, '684827b0b2b89', '68475dc954ad5', 'business', '588969111146', 'en', 'storage/profile-images/g98pQAZoE5GiksFORuiY.png', 'photo', 'storage/profile-images/0czqwKqXHlgBofU5qjfh.png', '684827b0b2b89', NULL, 'vcard', 'test', 'te', '<p>test</p>', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 10:40:16', '2025-07-21 05:49:33'),
(8, '68482a7967c4e', '68475dc954ad5', 'business', '588969111146', 'en', 'storage/profile-images/3FQ7DzRrHu2TmulvKTVd.png', 'photo', 'storage/profile-images/jnHbgdINBTxtx8lMKDfS.png', '68482a7967c4e', NULL, 'vcard', 'testing', 'Programador Web', 'test', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 10:52:09', '2025-07-21 05:49:14'),
(9, '68482c2493c91', '68475dc954ad5', 'business', '588969111146', 'en', 'storage/profile-images/fosc69uC4H2QDghI60rT.png', 'photo', 'storage/profile-images/IoDwQg8zRvMpgGhYmCbT.png', '68482c2493c91', NULL, 'vcard', 'test', 'Programador Web', 'prueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 10:59:16', '2025-07-21 05:49:09'),
(10, '684835e877408', '68475dc954ad5', 'business', '588969111021', 'en', 'storage/profile-images/sKB6yzQBY38OG0rPoCGE.png', 'photo', 'storage/profile-images/Y0MLEIEG4UmlDmzbWjlL.png', '684835e877408', NULL, 'vcard', 'prueba', 'testing', 'Testing con choose dile', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 11:40:56', '2025-07-21 05:49:46'),
(11, '68483bd493614', '68475dc954ad5', 'business', '588969111146', 'en', 'storage/profile-images/hhAj6AqQSwYMnlLWNZuZ.png', 'photo', 'storage/profile-images/ZL69c2geqiW1fZQQHNTp.png', '68483bd493614', NULL, 'vcard', 'esto es una prueba', 'Haciendo un test', 'Esto es una prueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 12:06:12', '2025-07-21 05:49:05'),
(12, '684844523874f', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/photo-1726064855757-ac8720008fe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MXwxfHNlYXJjaHwxfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTYxMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/QxzMG3Yxpg9Rlc203zGG.png', '684844523874f', NULL, 'vcard', 'esto es una prueba', 'hola', 'Aqui una prueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 12:42:26', '2025-07-21 05:49:03'),
(13, '6848464c17637', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw2fHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTYxMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/xCk1AvQoAEPpu04o8XpJ.png', '6848464c17637', NULL, 'vcard', 'prueba', 'prueba', 'prueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 12:50:52', '2025-07-21 05:49:36'),
(14, '684846d61cb10', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw2fHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTYxMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/wQIQEqSIEP7b7ea06ila.png', '684846d61cb10', NULL, 'vcard', 'prueba', 'prueba', 'prueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 12:53:10', '2025-07-21 05:48:59'),
(15, '6848493fb667f', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwzfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTYxMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/v7kEO9zMe5qH4VTKz0Pe.png', '6848493fb667f', NULL, 'vcard', 'prueba', 'prueba', 'rueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 13:03:27', '2025-07-21 05:48:57'),
(16, '68486e2777417', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwzfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTYxMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/S4G1n01FWIBPbgw0D4aE.png', '68486e2777417', NULL, 'vcard', 'prueba', 'prueba', 'prueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 15:40:55', '2025-07-21 05:48:51'),
(17, '68489dcbcdb95', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTYxMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/tzwLyfTZeDJirlvTvlzl.png', '68489dcbcdb95', NULL, 'vcard', 'prueba', 'prueba', 'prueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 19:04:11', '2025-07-21 05:48:48'),
(18, '6848b203bab8e', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTk0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/6ArbRNcNhbRs05tmbru6.png', '6848b203bab8e', NULL, 'vcard', 'prueba', 'prueba', 'prueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 20:30:27', '2025-07-21 05:48:44'),
(19, '6848bb885567e', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTk0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/tygSgVKePgqyiO4t3nj2.png', '6848bb885567e', NULL, 'vcard', 'prueba', 'prueba', 'pprueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 21:11:04', '2025-07-21 05:48:54'),
(20, '6848c37f1750c', '68475dc954ad5', 'personal', '588969111021', 'en', 'https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwzfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTk0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/kYZjLvkWQRAE3sFNXpAU.png', '6848c37f1750c', NULL, 'vcard', 'prueba personal', 'prueba', 'prueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 21:45:03', '2025-07-21 05:49:49'),
(21, '6848c3c0ed312', '68475dc954ad5', 'business', '588969111126', 'en', 'https://images.unsplash.com/photo-1664575599618-8f6bd76fc670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw3fHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTk0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/YyGA4e2vNnfVMlvAg5ED.png', '6848c3c0ed312', NULL, 'vcard', 'layout', 'prueba otro layout', 'prueba otro lñauyout', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 21:46:08', '2025-07-21 05:48:41'),
(22, '6848c465051e5', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwzfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTk0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/h8rNpLZbKFxtoq83vOWn.png', '6848c465051e5', NULL, 'vcard', 'prueba', 'Prueba', 'prueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 21:48:53', '2025-07-21 05:48:38'),
(23, '6848c9bb3abd8', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw0fHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NTk0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/UTPuPVjSsXiiCUtCldOJ.png', '6848c9bb3abd8', NULL, 'vcard', 'prueba', 'prueba', 'prueba', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-10 22:11:39', '2025-07-21 05:48:35'),
(24, '684a716a87168', '68475dc954ad5', 'business', '588969111131', 'en', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw0fHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NzA5MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/qzV8i1OdZSQGo2opOTHK.png', '684a716a87168', NULL, 'vcard', 'prueba personal', 'Prueba', '<p>prueba</p>', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-12 04:19:22', '2025-07-21 05:48:31'),
(25, '684a83bb9488a', '68475dc954ad5', 'business', '588969111086', 'en', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NzA5MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/SPVgwForPi2TKygCLI9p.png', '684a83bb9488a', NULL, 'vcard', 'prueba', 'prueba', '<p>Prueba</p>', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-12 05:37:31', '2025-07-21 05:48:28'),
(26, '684a951cce2a0', '68475dc954ad5', 'business', '588969111034', 'en', 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MXwxfHNlYXJjaHwxfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NzA5MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/9LBTErJVsu2JrUqVkOfG.png', '684a951cce2a0', NULL, 'vcard', 'Nombre de usuario', 'Titulo de trabajo', '<p>Descripcion de la BIO</p>', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-12 06:51:40', '2025-07-21 05:47:27'),
(27, '684ad9809812a', '68475dc954ad5', 'business', '588969111134', 'es', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw0fHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NzA5MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/BuPdJh2SRiFmOZjfB0RX.png', '684ad9809812a', NULL, 'vcard', 'Titulo / Nombre', 'Subtitulo', 'DESCRIPCION DE LA BIO', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-12 11:43:28', '2025-07-21 05:48:25'),
(28, '684af7a916852', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/photo-1665686308827-eb62e4f6604d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw1fHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NzQzNTE3fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/7fKCOLqPRjKTBniY7EC6.png', '684af7a916852', NULL, 'vcard', 'nombre', 'titulo', 'bio titulo', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-12 13:52:09', '2025-07-21 05:48:22'),
(29, '684af962179c2', '68475dc954ad5', 'business', '588969111146', 'en', '/tmp/phpf3klYB', 'photo', 'storage/profile-images/PuOVIyL4ExWF8N8jhqkV.png', '684af962179c2', NULL, 'vcard', 'titulo', 'Sub titulo', 'Descirpicon', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-12 13:59:30', '2025-07-21 05:47:38'),
(30, '684b013b7a0c1', '68475dc954ad5', 'business', '588969111146', 'en', '/tmp/php6QnDKf', 'photo', 'storage/profile-images/JqAvCErQIxmGuffj8qMb.png', '684b013b7a0c1', NULL, 'vcard', 'titulo', 'subtitulo', 'descripcion', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-12 14:32:59', '2025-07-21 05:47:30'),
(31, '684b106b1f1ca', '68475dc954ad5', 'business', '588969111145', 'es', 'https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwzfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NzQ5ODQ2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/9J12X6dJNf8m96lTFiEz.png', '684b106b1f1ca', NULL, 'vcard', 'Titulo de prueba', 'Subtitulo', 'Descirpcion', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-12 15:37:47', '2025-07-21 05:47:34'),
(32, '684b29c30af53', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwzfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NzQ5ODQ2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/cXUCeuzPEymgEIADcHev.png', '684b29c30af53', NULL, 'vcard', 'PRUEBA 3', 'PRUEBA 3', 'PRUEBA 3', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-12 17:25:55', '2025-07-21 05:47:41'),
(33, '684b49afc8f2b', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5NzQ5ODQ2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/ZpJDTYh4AvTjHXuIEwXn.png', '684b49afc8f2b', NULL, 'vcard', 'titulo', 'sub titulo', 'Descripcion', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-12 19:42:07', '2025-07-21 05:47:47'),
(34, '684d316c2de95', '68475dc954ad5', 'business', '588969111146', 'en', 'https://images.unsplash.com/photo-1665686308827-eb62e4f6604d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw1fHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5ODg5Mzc1fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/zam13rkcF5quFn7mC83f.png', '684d316c2de95', NULL, 'vcard', 'titulo', 'subtitulo', 'bio', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-14 06:23:08', '2025-07-21 05:47:44'),
(35, '684d41ea87467', '68475dc954ad5', 'business', '588969111127', 'es', 'https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwzfHxidXNpbmVzc3xlbnwwfDB8fHwxNzQ5ODg5Mzc1fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/gEougnOH0doEfhohMY0G.png', '684d41ea87467', NULL, 'vcard', 'Vcard de prueba', 'Subtitulo vcard de prueba', '<p>Esto es una vcard de prueba. En este apartado el usuario puede poner lo que quiera sobre su BIO</p>', 'featjunior@gmail.com', NULL, 0, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-14 07:33:30', '2025-07-21 05:47:54'),
(36, '6851a9b1143ae', '68475dc954ad5', 'business', '588969111140', 'es', '/tmp/phpdDk5gP', 'photo', 'storage/profile-images/om5abMf5ftjS3l2KCVA6.png', '6851a9b1143ae', NULL, 'vcard', 'Titulo', 'Subtitulo de prueba', 'Dewscripcion', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-17 15:45:21', '2025-07-21 05:45:40'),
(37, '6851d1e43a2dc', '68475dc954ad5', 'business', '588969111140', 'es', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyfHxidXNpbmVzc3xlbnwwfDB8fHwxNzUwMTkyNTU5fDA&ixlib=rb-4.1.0&q=80&w=1080', 'photo', 'storage/profile-images/C0ZN6hGAjx2l74k0CAj5.png', 'tarjeta-de-prueba-final', NULL, 'vcard', 'Tarjeta de prueba final', 'prueba final', '<p>Esta es la biografia</p>', NULL, NULL, 0, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-17 18:36:52', '2025-07-21 05:45:35'),
(38, '685864fba100a', '68475dc954ad5', 'personal', '588969111021', 'es', 'storage/profile-images/UA9gq8zBjFMDfwC7RWYn.png', 'photo', 'storage/profile-images/oJU76tyEemkz3YxmpBn6.png', 'titulo', NULL, 'vcard', 'Titulo', 'subtitulo', '<p>DESCRIPCION</p>', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-22 18:18:03', '2025-07-21 05:45:32'),
(39, '68586844ea4d0', '68475dc954ad5', 'business', '588969111146', 'es', 'storage/profile-images/mZip4nwjiLhx6zvMqapl.png', 'photo', 'storage/profile-images/aBjluDeT3j3kESmC2gr5.png', 'titulo-vcard', NULL, 'vcard', 'Titulo vcard', 'subtitulo', 'Descripcion', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-22 18:32:04', '2025-07-21 05:45:29'),
(40, '685a3f5f76667', '68475dc954ad5', 'business', '588969111146', 'es', 'default-cover.png', 'photo', NULL, '685a3f5f76667', NULL, 'vcard', 'nopmbre', 'sub', 'descip', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-24 04:02:07', '2025-07-21 05:45:25'),
(41, '685b65e8d5cfc', '68475dc954ad5', 'business', '588969111146', 'es', 'default-cover.png', 'photo', NULL, '685b65e8d5cfc', NULL, 'vcard', 'Nombre', 'Subtitulo', 'Descripcion', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-06-25 00:58:48', '2025-07-21 05:45:21'),
(42, '686bcd7f25497', '68475dc954ad5', 'business', '588969111021', 'es', 'storage/profile-images/UFGGFwXKkItrokAA2HKf.png', 'photo', 'storage/profile-images/LYxkJpeEZshjMM0Qxw4u.png', 'testing', NULL, 'vcard', 'testing', 'junior', 'testing desc', NULL, NULL, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-07-07 11:37:03', '2025-07-21 05:45:18'),
(43, '687e028d5d758', '68475dc954ad5', 'custom', '588969111147', 'en', 'storage/profile-images/GMQI8Wzt0MKoJYQ7F22g.png', 'photo', 'storage/profile-images/89m1XJu9BaoiwWAKfbo4.png', 'testing-custom', NULL, 'vcard', 'TESTING CUSTOM', 'TESTING TITLE', '<p>BALA BALA A </p>', NULL, NULL, 0, 0, 1, '{\"layout\": \"column\", \"card_edge\": \"rounded\", \"image_url\": \"\", \"button_edge\": \"rounded\", \"font_family\": \"Times New Roman\", \"title_color\": \"#000000\", \"gradient_end\": \"top_to_bottom\", \"header_style\": \"column\", \"gradient_type\": \"vertical\", \"heading_color\": \"#000000\", \"gradient_start\": \"#ffffff\", \"background_type\": \"single_color\", \"sub_title_color\": \"#000000\", \"background_color\": \"#ffffff\", \"bottom_bar_color\": \"#000000\", \"button_icon_color\": \"#ffffff\", \"button_text_color\": \"#ffffff\", \"description_color\": \"#000000\", \"button_gradient_end\": \"#000000\", \"profile_image_style\": \"rounded\", \"button_gradient_start\": \"#000000\", \"button_background_type\": \"single_color\", \"button_background_color\": \"#000000\"}', NULL, NULL, NULL, NULL, NULL, NULL, 'deleted', '1', '2025-07-21 07:04:13', '2025-07-21 07:13:14'),
(44, '688a4c0476279', '68475dc954ad5', 'business', '588969111138', 'en', 'storage/profile-images/bUrlQhTWALGwkoKpBvvr.png', 'photo', 'storage/profile-images/5QHBCx8y8l6weUpWBQP4.png', 'testing', NULL, 'vcard', 'TESTING', 'TETINMS SUB', '<p>DESCIRPTION</p>', 'xx#@gmail.com', NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '{\"favicon\":null,\"meta_title\":\"SEO\",\"meta_description\":\"SEO\",\"meta_keywords\":\"SEO\"}', 'activated', '1', '2025-07-30 14:44:52', '2025-07-30 14:49:32');

-- --------------------------------------------------------

--
-- Table structure for table `business_fields`
--

CREATE TABLE `business_fields` (
  `id` int UNSIGNED NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `business_fields`
--

INSERT INTO `business_fields` (`id`, `card_id`, `type`, `icon`, `label`, `content`, `position`, `status`, `created_at`, `updated_at`) VALUES
(1, '684761d3646f6', 'facebook', 'fab fa-facebook', 'Sigueme aqui en facebook', 'https://instagram.com', '1', '1', '2025-06-09 20:37:22', '2025-06-09 20:37:22'),
(2, '684761d3646f6', 'instagram', 'fab fa-instagram', 'Instagram', 'https://instagram.com', '2', '1', '2025-06-09 20:37:22', '2025-06-09 20:37:22'),
(3, '684784ae2ede2', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'facebook.com', '1', '1', '2025-06-09 23:04:54', '2025-06-09 23:04:54'),
(4, '68478de3a8278', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-09 23:44:22', '2025-06-09 23:44:22'),
(5, '68481f2f31886', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 10:04:09', '2025-06-10 10:04:09'),
(6, '6848220b70360', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 10:16:17', '2025-06-10 10:16:17'),
(7, '684822eb5a702', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 10:21:05', '2025-06-10 10:21:05'),
(8, '684827b0b2b89', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 10:40:45', '2025-06-10 10:40:45'),
(9, '68482a7967c4e', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 10:52:14', '2025-06-10 10:52:14'),
(10, '68482c2493c91', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 10:59:20', '2025-06-10 10:59:20'),
(11, '684844523874f', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 12:42:36', '2025-06-10 12:42:36'),
(12, '6848464c17637', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 12:50:56', '2025-06-10 12:50:56'),
(13, '684846d61cb10', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 12:53:13', '2025-06-10 12:53:13'),
(14, '6848493fb667f', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 13:03:31', '2025-06-10 13:03:31'),
(15, '68486e2777417', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 15:40:59', '2025-06-10 15:40:59'),
(16, '68489dcbcdb95', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 19:04:15', '2025-06-10 19:04:15'),
(17, '6848b203bab8e', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 20:30:31', '2025-06-10 20:30:31'),
(18, '6848bb885567e', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 21:11:08', '2025-06-10 21:11:08'),
(19, '6848c37f1750c', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 21:45:07', '2025-06-10 21:45:07'),
(20, '6848c3c0ed312', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 21:46:12', '2025-06-10 21:46:12'),
(21, '6848c465051e5', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 21:48:56', '2025-06-10 21:48:56'),
(22, '6848c9bb3abd8', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-10 22:11:42', '2025-06-10 22:11:42'),
(23, '684a716a87168', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-12 04:19:26', '2025-06-12 04:19:26'),
(24, '684a83bb9488a', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-12 05:37:38', '2025-06-12 05:37:38'),
(25, '684a951cce2a0', 'facebook', 'fab fa-facebook-f fa-md', 'Link de Facebook', 'https://facebook.com', '1', '1', '2025-06-12 06:52:14', '2025-06-12 06:52:14'),
(26, '684a951cce2a0', 'instagram', 'fab fa-instagram', 'Link de Instagram', 'https://instagram.com', '2', '1', '2025-06-12 06:52:14', '2025-06-12 06:52:14'),
(27, '684ad9809812a', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-12 11:43:52', '2025-06-12 11:43:52'),
(28, '684ad9809812a', 'instagram', 'fab fa-instagram', 'Instagram', 'https://instagram.com', '2', '1', '2025-06-12 11:43:52', '2025-06-12 11:43:52'),
(29, '684ad9809812a', 'x-twitter', 'fab fa-x-twitter', 'X (Twitter)', 'https://twtter.com', '3', '1', '2025-06-12 11:43:52', '2025-06-12 11:43:52'),
(30, '684af7a916852', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://instagram.com', '1', '1', '2025-06-12 13:52:12', '2025-06-12 13:52:12'),
(31, '684af962179c2', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-12 13:59:33', '2025-06-12 13:59:33'),
(32, '684b013b7a0c1', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://instagram.com', '1', '1', '2025-06-12 14:33:04', '2025-06-12 14:33:04'),
(33, '684b106b1f1ca', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-12 15:37:50', '2025-06-12 15:37:50'),
(34, '684b29c30af53', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://twtter.com', '1', '1', '2025-06-12 17:25:58', '2025-06-12 17:25:58'),
(35, '684b49afc8f2b', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://instagram.com', '1', '1', '2025-06-12 19:42:11', '2025-06-12 19:42:11'),
(36, '684d316c2de95', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://twtter.com', '1', '1', '2025-06-14 06:23:11', '2025-06-14 06:23:11'),
(37, '684d41ea87467', 'facebook', 'fab fa-facebook-f fa-md', 'Sigue en facebook', 'https://facebook.com', '1', '1', '2025-06-14 07:33:57', '2025-06-14 07:33:57'),
(38, '684d41ea87467', 'instagram', 'fab fa-instagram', 'Sigueme en Instagram', 'https://instagram.com', '2', '1', '2025-06-14 07:33:57', '2025-06-14 07:33:57'),
(39, '6851a9b1143ae', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https;//facebook.com', '1', '1', '2025-06-17 15:46:09', '2025-06-17 15:46:09'),
(44, '6851d1e43a2dc', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://instagram.com', '1', '1', '2025-06-17 19:37:21', '2025-06-17 19:37:21'),
(45, '6851d1e43a2dc', 'instagram', 'fab fa-instagram', 'Instagram', 'https://twtter.com', '2', '1', '2025-06-17 19:37:21', '2025-06-17 19:37:21'),
(46, '6851d1e43a2dc', 'tiktok', 'fab fa-tiktok', 'tik tok', 'https://instagram.com', '3', '1', '2025-06-17 19:37:21', '2025-06-17 19:37:21'),
(47, '685864fba100a', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-22 18:18:07', '2025-06-22 18:18:07'),
(48, '68586844ea4d0', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-06-22 18:32:08', '2025-06-22 18:32:08'),
(49, '686bcd7f25497', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'facebook.com', '1', '1', '2025-07-07 11:38:24', '2025-07-07 11:38:24'),
(50, '687e028d5d758', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '1', '1', '2025-07-21 07:04:36', '2025-07-21 07:04:36'),
(51, '687e028d5d758', 'facebook', 'fab fa-facebook-f fa-md', 'Facebook', 'https://facebook.com', '2', '1', '2025-07-21 07:04:36', '2025-07-21 07:04:36'),
(52, '688a4c0476279', 'linkedin', 'fab fa-linkedin-in', 'LinkedIn', 'https://facebook.com', '1', '1', '2025-07-30 14:45:11', '2025-07-30 14:45:11');

-- --------------------------------------------------------

--
-- Table structure for table `business_hours`
--

CREATE TABLE `business_hours` (
  `id` int UNSIGNED NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `monday` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tuesday` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `wednesday` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thursday` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `friday` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `saturday` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sunday` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_always_open` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_display` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `business_hours`
--

INSERT INTO `business_hours` (`id`, `card_id`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`, `is_always_open`, `is_display`, `status`, `created_at`, `updated_at`) VALUES
(1, '684d41ea87467', '09:00-18:30', '09:00-18:30', '09:00-18:30', '09:00-18:30', '09:00-18:30', '09:00-18:30', '09:00-18:30', 'Opening', '1', '1', '2025-06-14 07:38:04', '2025-06-14 07:38:04');

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

CREATE TABLE `campaigns` (
  `id` int UNSIGNED NOT NULL,
  `campaign_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `campaign_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `campaign_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaign_emails`
--

CREATE TABLE `campaign_emails` (
  `id` int UNSIGNED NOT NULL,
  `campaign_email_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `campaign_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `card_appointment_times`
--

CREATE TABLE `card_appointment_times` (
  `id` int UNSIGNED NOT NULL,
  `card_appointment_time_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `day` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slot_duration` int NOT NULL DEFAULT '30',
  `time_slots` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL DEFAULT '0',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int UNSIGNED NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

CREATE TABLE `config` (
  `id` int UNSIGNED NOT NULL,
  `config_key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `config_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`id`, `config_key`, `config_value`, `created_at`, `updated_at`) VALUES
(1, 'site_name', 'Tu creador de tienda', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(2, 'currency', 'USD', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(3, 'timezone', 'UTC', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(4, 'paypal_mode', 'sandbox', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(5, 'paypal_client_id', 'YOUR_PAYPAL_CLIENT_ID', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(6, 'paypal_secret', 'YOUR_PAYPAL_SECRET', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(7, 'razorpay_key', 'YOUR_RAZORPAY_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(8, 'razorpay_secret', 'YOUR_RAZORPAY_SECRET', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(9, 'term', 'monthly', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(10, 'stripe_publishable_key', 'pk_test_51RYFHXIIBS14AMq3BmLkpXtIuPPL3JLfQII0ew2BW4E3SDalrll6yw5BGDDZKtseuepaMtlgAMwHJ94axFpmSd3V00t6A5Z9XI', '2025-06-09 22:16:32', '2025-06-17 15:54:46'),
(11, 'stripe_secret', 'sk_test_51RYFHXIIBS14AMq3pF385iWvkBPnD80PegpWMb9kpadu7cyNtN9lo2qvLBz14z4LqA6ngKNKKamqzBCrMm7GrwIj00GgFZv2Fq', '2025-06-09 22:16:32', '2025-06-17 15:54:46'),
(12, 'app_theme', 'blue', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(13, 'primary_image', '/images/web/elements/68519c3b4c514.png', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(14, 'secondary_image', 'app/assets/elements/sign-up.png', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(15, 'tax_type', 'exclusive', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(16, 'invoice_prefix', 'INV-', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(17, 'invoice_name', 'Click My Link', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(18, 'invoice_email', 'sales@clickmy.link', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(19, 'invoice_phone', '+34666666666', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(20, 'invoice_address', '123', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(21, 'invoice_city', 'Barcelona', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(22, 'invoice_state', 'Barcelona', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(23, 'invoice_zipcode', '600001', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(24, 'invoice_country', 'España', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(25, 'tax_name', 'IVA', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(26, 'tax_value', '21', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(27, 'tax_number', 'CIF', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(28, 'email_heading', 'Thanks for using GoBiz. This is an invoice for your recent purchase.', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(29, 'email_footer', 'If you’re having trouble with the button above', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(30, 'invoice_footer', 'Muchas gracias por utilizar Click My Link. Esperamos volver a trabajar con usted.', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(31, 'share_content', 'Welcome to { business_name }, my digital vCard here : { business_url } Powered by: { appName }', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(32, 'bank_transfer', 'Bank: FARM CREDIT BANK DN P&I\\r\\nBank Account Number: 18539734757                     \\r\\nRouting Number: 21054734\\r\\nIBAN: IN94769888520201207044719366\\r\\n\\r\\nBank: FARM CREDIT BANK DN P&I\\r\\nBank Account Number: 18539734757                     \\r\\nRouting Number: 21054734\\r\\nIBAN: IN94769888520201207044719366', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(33, 'app_version', '17.2.0', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(34, 'paystack_public_key', 'YOUR_PAYSTACK_PUBLIC_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(35, 'paystack_secret_key', 'YOUR_PAYSTACK_SECRET_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(36, 'paystack_payment_url', 'https://domain.com/paystack-payment/callback', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(37, 'merchant_email', 'YOUR_MERCHANT_EMAIL', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(38, 'mollie_key', 'YOUR_MOLLIE_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(39, 'show_website', 'no', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(40, 'tiny_api_key', 'YOUR_TINY_API_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(41, 'show_whatsapp_chatbot', '0', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(42, 'whatsapp_chatbot_mobile_number', '919876543210', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(43, 'whatsapp_chatbot_message', 'Hello', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(44, 'disable_user_email_verification', '0', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(45, 'merchantId', 'YOUR_PHONEPE_MERCHANT_ID', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(46, 'saltKey', 'YOUR_PHONEPE_SALT_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(47, 'enable_subdomain', '0', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(48, 'mercado_pago_public_key', 'YOUR_MERCADO_PAGO_PUBLIC_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(49, 'mercado_pago_access_token', 'YOUR_MERCADO_PAGO_ACCESS_TOKEN', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(50, 'toyyibpay_api_key', 'YOUR_TOYYIBPAY_API_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(51, 'toyyibpay_category_code', 'YOUR_TOYYIBPAY_CATEGORY_CODE', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(52, 'flw_public_key', 'YOUR_FLW_PUBLIC_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(53, 'flw_secret_key', 'YOUR_FLW_SECRET_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(54, 'flw_encryption_key', 'YOUR_FLW_ENCRYPTION_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(55, 'toyyibpay_mode', 'live', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(56, 'currency_format_type', '1,234,567.89', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(57, 'currency_decimals_place', '0', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(58, 'mailgun_smtp_username', 'YOUR_MAILGUN_SMTP_USERNAME', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(59, 'mailgun_smtp_password', 'YOUR_MAILGUN_SMTP_PASSWORD', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(60, 'mailgun_from_address', 'YOUR_FROM_ADDRESS', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(61, 'cronjob_dates_in_array', '[10, 5, 3, 1]', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(62, 'cron_hour', '10', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(63, 'demo_mode', 'off', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(64, 'registration_page', '0', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(65, 'paddle_environment', 'false', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(66, 'paddle_seller_id', 'YOUR_PADDLE_SELLER_ID', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(67, 'paddle_api_key', 'YOUR_PADDLE_API_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(68, 'paddle_client_side_token', 'YOUR_PADDLE_CLIENT_SIDE_TOKEN', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(69, 'paytr_merchant_id', 'YOUR_PAYTR_MERCHANT_ID', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(70, 'paytr_merchant_key', 'YOUR_PAYTR_MERCHANT_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(71, 'paytr_merchant_salt', 'YOUR_PAYTR_MERCHANT_SALT', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(72, 'paytr_mode', 'YOUR_PAYTR_MODE', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(73, 'xendit_secret_key', 'YOUR_XENDIT_SECRET_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(74, 'support_license_code', '', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(75, 'nfc_greetings', '<div class=\'logo\'>\r\n    <img src=\':logo\' alt=\':websitename\'>\r\n</div>\r\n<h2 class=\'d-print-none\'>Welcome to :websitename! ?</h2>\r\n<div class=\'content\'>\r\n    <h4>Dear <strong>:customername</strong>,</h4>\r\n    <p>Your NFC Card is ready to help you share your contact details effortlessly. Activate your card and start networking with just a tap!</p>\r\n    <h3>? Your Activation Code</h3>\r\n    <p class=\'activation-code\'>:activationcode</p>\r\n    <h3 class=\'mt-3\'>? How to Activate Your NFC Card?</h3>\r\n    <ol style=\'text-align: left;\'>\r\n        <li><strong>Log in</strong> to your account.</li>\r\n        <li><strong>Go to</strong> the <strong>\'Activate NFC Card\'</strong> section.</li>\r\n        <li><strong>Enter the activation code</strong> and submit.</li>\r\n        <li>Your NFC card is now ready to use!</li>\r\n    </ol>\r\n    <div class=\'qr-code\'>\r\n        <h3>? Scan to Activate</h3>\r\n        <canvas id=\'activateQrCode\'></canvas>\r\n    </div>\r\n</div>\r\n<div class=\'mt-3\'>\r\n    <span>Thank you for choosing <strong>:websitename</strong>!</span>\r\n    <p>If you need any assistance, feel free to contact us at \r\n        <strong><a href=\'mailto::supportemail\'>:supportemail</a></strong> \r\n        or call us at <strong>:supportphone</strong>.\r\n    </p>\r\n</div>\r\n<div class=\'content\'>\r\n    <p>Best regards,</p>\r\n    <h4>:websitename</h4>\r\n</div>', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(76, 'date_time_format', 'M d, Y h:i A', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(77, 'nfc_order_system', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(78, 'phonepe_client_id', 'YOUR_PHONEPE_CLIENT_ID', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(79, 'phonepe_client_version', 'YOUR_PHONEPE_CLIENT_VERSION', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(80, 'phonepe_client_secret', 'YOUR_PHONEPE_CLIENT_SECRET', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(81, 'referral_system', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(82, 'referral_commission_type', '0', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(83, 'referral_commission_amount', '10', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(84, 'referral_minimum_withdraw_amount', '50', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(85, 'cashfree_mode', 'live', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(86, 'cashfree_app_id', 'YOUR_CASHFREE_APP_ID', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(87, 'cashfree_secret_key', 'YOUR_CASHFREE_SECRET_KEY', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(88, 'show_home_slider', '0', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(89, 'enable_webtools', '1', '2025-06-09 23:08:33', '2025-06-09 23:08:33'),
(90, 'IYZICO_MODE', 'sandbox', '2025-06-09 23:08:33', '2025-06-09 23:08:33'),
(91, 'IYZICO_API_KEY', 'YOUR_IYZICO_API_KEY', '2025-06-09 23:08:33', '2025-06-09 23:08:33'),
(92, 'IYZICO_SECRET_KEY', 'YOUR_IYZICO_SECRET_KEY', '2025-06-09 23:08:33', '2025-06-09 23:08:33'),
(93, 'platform_commission_rate', '5.00', '2025-06-14 21:05:21', '2025-06-14 21:05:21'),
(94, 'minimum_withdrawal_amount', '10.00', '2025-06-14 21:05:21', '2025-06-14 21:05:21');

-- --------------------------------------------------------

--
-- Table structure for table `contact_forms`
--

CREATE TABLE `contact_forms` (
  `id` bigint UNSIGNED NOT NULL,
  `contact_form_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int UNSIGNED NOT NULL,
  `country_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `country_name`, `phone_code`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Afghanistan', '93', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(2, 'Albania', '355', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(3, 'Algeria', '213', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(4, 'American Samoa', '1684', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(5, 'Andorra', '376', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(6, 'Angola', '244', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(7, 'Anguilla', '1264', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(8, 'Antarctica', '672', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(9, 'Antigua and Barbuda', '1268', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(10, 'Argentina', '54', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(11, 'Armenia', '374', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(12, 'Aruba', '297', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(13, 'Australia', '61', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(14, 'Austria', '43', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(15, 'Azerbaijan', '994', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(16, 'Bahamas', '1242', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(17, 'Bahrain', '973', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(18, 'Bangladesh', '880', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(19, 'Barbados', '1246', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(20, 'Belarus', '375', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(21, 'Belgium', '32', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(22, 'Belize', '501', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(23, 'Benin', '229', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(24, 'Bermuda', '1441', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(25, 'Bhutan', '975', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(26, 'Bolivia', '591', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(27, 'Bosnia and Herzegovina', '387', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(28, 'Botswana', '267', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(29, 'Brazil', '55', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(30, 'British Indian Ocean Territory', '246', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(31, 'British Virgin Islands', '1284', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(32, 'Brunei', '673', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(33, 'Bulgaria', '359', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(34, 'Burkina Faso', '226', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(35, 'Burundi', '257', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(36, 'Cambodia', '855', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(37, 'Cameroon', '237', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(38, 'Canada', '1', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(39, 'Cape Verde', '238', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(40, 'Cayman Islands', '1345', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(41, 'Central African Republic', '236', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(42, 'Chad', '235', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(43, 'Chile', '56', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(44, 'China', '86', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(45, 'Christmas Island', '61', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(46, 'Cocos Islands', '61', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(47, 'Colombia', '57', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(48, 'Comoros', '269', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(49, 'Cook Islands', '682', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(50, 'Costa Rica', '506', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(51, 'Croatia', '385', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(52, 'Cuba', '53', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(53, 'Curacao', '599', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(54, 'Cyprus', '357', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(55, 'Czech Republic', '420', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(56, 'Democratic Republic of the Congo', '243', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(57, 'Denmark', '45', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(58, 'Djibouti', '253', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(59, 'Dominica', '1767', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(60, 'Dominican Republic', '1809', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(61, 'Dominican Republic', '1829', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(62, 'Dominican Republic', '1849', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(63, 'East Timor', '670', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(64, 'Ecuador', '593', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(65, 'Egypt', '20', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(66, 'El Salvador', '503', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(67, 'Equatorial Guinea', '240', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(68, 'Eritrea', '291', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(69, 'Estonia', '372', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(70, 'Ethiopia', '251', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(71, 'Falkland Islands', '500', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(72, 'Faroe Islands', '298', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(73, 'Fiji', '679', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(74, 'Finland', '358', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(75, 'France', '33', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(76, 'French Polynesia', '689', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(77, 'Gabon', '241', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(78, 'Gambia', '220', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(79, 'Georgia', '995', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(80, 'Germany', '49', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(81, 'Ghana', '233', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(82, 'Gibraltar', '350', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(83, 'Greece', '30', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(84, 'Greenland', '299', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(85, 'Grenada', '1473', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(86, 'Guam', '1671', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(87, 'Guatemala', '502', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(88, 'Guinea', '224', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(89, 'Guinea-Bissau', '245', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(90, 'Guyana', '592', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(91, 'Haiti', '509', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(92, 'Honduras', '504', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(93, 'Hong Kong', '852', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(94, 'Hungary', '36', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(95, 'Iceland', '354', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(96, 'India', '91', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(97, 'Indonesia', '62', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(98, 'Iran', '98', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(99, 'Iraq', '964', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(100, 'Ireland', '353', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(101, 'Israel', '972', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(102, 'Italy', '39', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(103, 'Ivory Coast', '225', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(104, 'Jamaica', '1876', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(105, 'Japan', '81', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(106, 'Jordan', '962', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(107, 'Kazakhstan', '7', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(108, 'Kenya', '254', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(109, 'Kiribati', '686', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(110, 'Kosovo', '383', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(111, 'Kuwait', '965', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(112, 'Kyrgyzstan', '996', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(113, 'Laos', '856', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(114, 'Latvia', '371', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(115, 'Lebanon', '961', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(116, 'Lesotho', '266', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(117, 'Liberia', '231', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(118, 'Libya', '218', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(119, 'Liechtenstein', '423', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(120, 'Lithuania', '370', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(121, 'Luxembourg', '352', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(122, 'Macau', '853', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(123, 'Macedonia', '389', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(124, 'Madagascar', '261', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(125, 'Malawi', '265', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(126, 'Malaysia', '60', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(127, 'Maldives', '960', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(128, 'Mali', '223', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(129, 'Malta', '356', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(130, 'Marshall Islands', '692', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(131, 'Mauritania', '222', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(132, 'Mauritius', '230', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(133, 'Mayotte', '262', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(134, 'Mexico', '52', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(135, 'Micronesia', '691', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(136, 'Moldova', '373', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(137, 'Monaco', '377', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(138, 'Mongolia', '976', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(139, 'Montenegro', '382', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(140, 'Montserrat', '1664', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(141, 'Morocco', '212', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(142, 'Mozambique', '258', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(143, 'Myanmar', '95', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(144, 'Namibia', '264', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(145, 'Nauru', '674', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(146, 'Nepal', '977', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(147, 'Netherlands', '31', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(148, 'Netherlands Antilles', '599', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(149, 'New Caledonia', '687', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(150, 'New Zealand', '64', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(151, 'Nicaragua', '505', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(152, 'Niger', '227', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(153, 'Nigeria', '234', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(154, 'Niue', '683', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(155, 'Norfolk Island', '672', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(156, 'North Korea', '850', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(157, 'Northern Mariana Islands', '1670', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(158, 'Norway', '47', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(159, 'Oman', '968', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(160, 'Pakistan', '92', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(161, 'Palau', '680', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(162, 'Palestine', '970', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(163, 'Panama', '507', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(164, 'Papua New Guinea', '675', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(165, 'Paraguay', '595', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(166, 'Peru', '51', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(167, 'Philippines', '63', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(168, 'Pitcairn', '64', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(169, 'Poland', '48', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(170, 'Portugal', '351', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(171, 'Puerto Rico', '1787', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(172, 'Puerto Rico', '1939', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(173, 'Qatar', '974', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(174, 'Republic of the Congo', '242', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(175, 'Reunion', '262', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(176, 'Romania', '40', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(177, 'Russia', '7', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(178, 'Rwanda', '250', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(179, 'Saint Barthelemy', '590', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(180, 'Saint Helena', '290', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(181, 'Saint Kitts and Nevis', '1869', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(182, 'Saint Lucia', '1758', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(183, 'Saint Martin', '590', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(184, 'Saint Pierre and Miquelon', '508', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(185, 'Saint Vincent and the Grenadines', '1784', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(186, 'Samoa', '685', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(187, 'San Marino', '378', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(188, 'Sao Tome and Principe', '239', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(189, 'Saudi Arabia', '966', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(190, 'Senegal', '221', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(191, 'Serbia', '381', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(192, 'Seychelles', '248', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(193, 'Sierra Leone', '232', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(194, 'Singapore', '65', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(195, 'Sint Maarten', '1721', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(196, 'Slovakia', '421', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(197, 'Slovenia', '386', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(198, 'Solomon Islands', '677', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(199, 'Somalia', '252', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(200, 'South Africa', '27', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(201, 'South Korea', '82', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(202, 'South Sudan', '211', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(203, 'Spain', '34', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(204, 'Sri Lanka', '94', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(205, 'Sudan', '249', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(206, 'Suriname', '597', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(207, 'Swaziland', '268', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(208, 'Sweden', '46', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(209, 'Switzerland', '41', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(210, 'Syria', '963', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(211, 'Taiwan', '886', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(212, 'Tajikistan', '992', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(213, 'Tanzania', '255', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(214, 'Thailand', '66', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(215, 'Timor-Leste', '670', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(216, 'Togo', '228', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(217, 'Tokelau', '690', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(218, 'Tonga', '676', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(219, 'Trinidad and Tobago', '1868', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(220, 'Tunisia', '216', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(221, 'Turkey', '90', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(222, 'Turkmenistan', '993', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(223, 'Tuvalu', '688', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(224, 'Uganda', '256', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(225, 'Ukraine', '380', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(226, 'United Arab Emirates', '971', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(227, 'United Kingdom', '44', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(228, 'United States', '1', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(229, 'Uruguay', '598', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(230, 'Uzbekistan', '998', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(231, 'Vanuatu', '678', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(232, 'Vatican', '379', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(233, 'Venezuela', '58', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(234, 'Vietnam', '84', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(235, 'Wallis and Futuna', '681', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(236, 'Western Sahara', '212', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(237, 'Yemen', '967', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(238, 'Zambia', '260', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(239, 'Zimbabwe', '263', 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int UNSIGNED NOT NULL,
  `coupon_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `used_for` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'plan',
  `coupon_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `coupon_desc` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coupon_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `coupon_amount` double NOT NULL,
  `coupon_expired_on` datetime NOT NULL,
  `coupon_user_usage_limit` int NOT NULL,
  `coupon_total_usage_limit` int NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `id` int UNSIGNED NOT NULL,
  `priority` int NOT NULL,
  `iso_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `symbol` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subunit` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subunit_to_unit` int NOT NULL,
  `symbol_first` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `html_entity` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `decimal_mark` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thousands_separator` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `iso_numeric` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`id`, `priority`, `iso_code`, `name`, `symbol`, `subunit`, `subunit_to_unit`, `symbol_first`, `html_entity`, `decimal_mark`, `thousands_separator`, `iso_numeric`) VALUES
(1, 100, 'AED', 'United Arab Emirates Dirham', 'د.إ', 'Fils', 100, 'true', '', '.', ',', 784),
(2, 100, 'AFN', 'Afghan Afghani', '؋', 'Pul', 100, 'false', '', '.', ',', 971),
(3, 100, 'ALL', 'Albanian Lek', 'L', 'Qintar', 100, 'false', '', '.', ',', 8),
(4, 100, 'AMD', 'Armenian Dram', 'դր.', 'Luma', 100, 'false', '', '.', ',', 51),
(5, 100, 'ANG', 'Netherlands Antillean Gulden', 'ƒ', 'Cent', 100, 'true', '&#x0192;', ',', '.', 532),
(6, 100, 'AOA', 'Angolan Kwanza', 'Kz', 'Cêntimo', 100, 'false', '', '.', ',', 973),
(7, 100, 'ARS', 'Argentine Peso', '$', 'Centavo', 100, 'true', '&#x20B1;', ',', '.', 32),
(8, 4, 'AUD', 'Australian Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 36),
(9, 100, 'AWG', 'Aruban Florin', 'ƒ', 'Cent', 100, 'false', '&#x0192;', '.', ',', 533),
(10, 100, 'AZN', 'Azerbaijani Manat', 'null', 'Qəpik', 100, 'true', '', '.', ',', 944),
(11, 100, 'BAM', 'Bosnia and Herzegovina Convertible Mark', 'КМ', 'Fening', 100, 'true', '', '.', ',', 977),
(12, 100, 'BBD', 'Barbadian Dollar', '$', 'Cent', 100, 'false', '$', '.', ',', 52),
(13, 100, 'BDT', 'Bangladeshi Taka', '৳', 'Paisa', 100, 'true', '', '.', ',', 50),
(14, 100, 'BGN', 'Bulgarian Lev', 'лв', 'Stotinka', 100, 'false', '', '.', ',', 975),
(15, 100, 'BHD', 'Bahraini Dinar', 'ب.د', 'Fils', 1000, 'true', '', '.', ',', 48),
(16, 100, 'BIF', 'Burundian Franc', 'Fr', 'Centime', 100, 'false', '', '.', ',', 108),
(17, 100, 'BMD', 'Bermudian Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 60),
(18, 100, 'BND', 'Brunei Dollar', '$', 'Sen', 100, 'true', '$', '.', ',', 96),
(19, 100, 'BOB', 'Bolivian Boliviano', 'Bs.', 'Centavo', 100, 'true', '', '.', ',', 68),
(20, 100, 'BRL', 'Brazilian Real', 'R$', 'Centavo', 100, 'true', 'R$', ',', '.', 986),
(21, 100, 'BSD', 'Bahamian Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 44),
(22, 100, 'BTN', 'Bhutanese Ngultrum', 'Nu.', 'Chertrum', 100, 'false', '', '.', ',', 64),
(23, 100, 'BWP', 'Botswana Pula', 'P', 'Thebe', 100, 'true', '', '.', ',', 72),
(24, 100, 'BYR', 'Belarusian Ruble', 'Br', 'Kapyeyka', 100, 'false', '', '.', ',', 974),
(25, 100, 'BZD', 'Belize Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 84),
(26, 5, 'CAD', 'Canadian Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 124),
(27, 100, 'CDF', 'Congolese Franc', 'Fr', 'Centime', 100, 'false', '', '.', ',', 976),
(28, 100, 'CHF', 'Swiss Franc', 'Fr', 'Rappen', 100, 'true', '', '.', ',', 756),
(29, 100, 'CLF', 'Unidad de Fomento', 'UF', 'Peso', 1, 'true', '&#x20B1;', ',', '.', 990),
(30, 100, 'CLP', 'Chilean Peso', '$', 'Peso', 1, 'true', '&#36;', ',', '.', 152),
(31, 100, 'CNY', 'Chinese Renminbi Yuan', '¥', 'Fen', 100, 'true', '&#20803;', '.', ',', 156),
(32, 100, 'COP', 'Colombian Peso', '$', 'Centavo', 100, 'true', '&#x20B1;', ',', '.', 170),
(33, 100, 'CRC', 'Costa Rican Colón', '₡', 'Céntimo', 100, 'true', '&#x20A1;', ',', '.', 188),
(34, 100, 'CUC', 'Cuban Convertible Peso', '$', 'Centavo', 100, 'false', '', '.', ',', 931),
(35, 100, 'CUP', 'Cuban Peso', '$', 'Centavo', 100, 'true', '&#x20B1;', '.', ',', 192),
(36, 100, 'CVE', 'Cape Verdean Escudo', '$', 'Centavo', 100, 'false', '', '.', ',', 132),
(37, 100, 'CZK', 'Czech Koruna', 'Kč', 'Haléř', 100, 'true', '', ',', '.', 203),
(38, 100, 'DJF', 'Djiboutian Franc', 'Fdj', 'Centime', 100, 'false', '', '.', ',', 262),
(39, 100, 'DKK', 'Danish Krone', 'kr', 'Øre', 100, 'false', '', ',', '.', 208),
(40, 100, 'DOP', 'Dominican Peso', '$', 'Centavo', 100, 'true', '&#x20B1;', '.', ',', 214),
(41, 100, 'DZD', 'Algerian Dinar', 'د.ج', 'Centime', 100, 'false', '', '.', ',', 12),
(42, 100, 'EGP', 'Egyptian Pound', 'ج.م', 'Piastre', 100, 'true', '&#x00A3;', '.', ',', 818),
(43, 100, 'ERN', 'Eritrean Nakfa', 'Nfk', 'Cent', 100, 'false', '', '.', ',', 232),
(44, 100, 'ETB', 'Ethiopian Birr', 'Br', 'Santim', 100, 'false', '', '.', ',', 230),
(45, 2, 'EUR', 'Euro', '€', 'Cent', 100, 'true', '&#x20AC;', ',', '.', 978),
(46, 100, 'FJD', 'Fijian Dollar', '$', 'Cent', 100, 'false', '$', '.', ',', 242),
(47, 100, 'FKP', 'Falkland Pound', '£', 'Penny', 100, 'false', '&#x00A3;', '.', ',', 238),
(48, 3, 'GBP', 'British Pound', '£', 'Penny', 100, 'true', '&#x00A3;', '.', ',', 826),
(49, 100, 'GEL', 'Georgian Lari', 'ლ', 'Tetri', 100, 'false', '', '.', ',', 981),
(50, 100, 'GHS', 'Ghanaian Cedi', '₵', 'Pesewa', 100, 'true', '&#x20B5;', '.', ',', 936),
(51, 100, 'GIP', 'Gibraltar Pound', '£', 'Penny', 100, 'true', '&#x00A3;', '.', ',', 292),
(52, 100, 'GMD', 'Gambian Dalasi', 'D', 'Butut', 100, 'false', '', '.', ',', 270),
(53, 100, 'GNF', 'Guinean Franc', 'Fr', 'Centime', 100, 'false', '', '.', ',', 324),
(54, 100, 'GTQ', 'Guatemalan Quetzal', 'Q', 'Centavo', 100, 'true', '', '.', ',', 320),
(55, 100, 'GYD', 'Guyanese Dollar', '$', 'Cent', 100, 'false', '$', '.', ',', 328),
(56, 100, 'HKD', 'Hong Kong Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 344),
(57, 100, 'HNL', 'Honduran Lempira', 'L', 'Centavo', 100, 'true', '', '.', ',', 340),
(58, 100, 'HRK', 'Croatian Kuna', 'kn', 'Lipa', 100, 'true', '', ',', '.', 191),
(59, 100, 'HTG', 'Haitian Gourde', 'G', 'Centime', 100, 'false', '', '.', ',', 332),
(60, 100, 'HUF', 'Hungarian Forint', 'Ft', 'Fillér', 100, 'false', '', ',', '.', 348),
(61, 100, 'IDR', 'Indonesian Rupiah', 'Rp', 'Sen', 100, 'true', '', ',', '.', 360),
(62, 100, 'ILS', 'Israeli New Sheqel', '₪', 'Agora', 100, 'true', '&#x20AA;', '.', ',', 376),
(63, 100, 'INR', 'Indian Rupee', '₹', 'Paisa', 100, 'true', '&#x20b9;', '.', ',', 356),
(64, 100, 'IQD', 'Iraqi Dinar', 'ع.د', 'Fils', 1000, 'false', '', '.', ',', 368),
(65, 100, 'IRR', 'Iranian Rial', '﷼', 'Dinar', 100, 'true', '&#xFDFC;', '.', ',', 364),
(66, 100, 'ISK', 'Icelandic Króna', 'kr', 'Eyrir', 100, 'true', '', ',', '.', 352),
(67, 100, 'JMD', 'Jamaican Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 388),
(68, 100, 'JOD', 'Jordanian Dinar', 'د.ا', 'Piastre', 100, 'true', '', '.', ',', 400),
(69, 6, 'JPY', 'Japanese Yen', '¥', 'null', 1, 'true', '&#x00A5;', '.', ',', 392),
(70, 100, 'KES', 'Kenyan Shilling', 'KSh', 'Cent', 100, 'true', '', '.', ',', 404),
(71, 100, 'KGS', 'Kyrgyzstani Som', 'som', 'Tyiyn', 100, 'false', '', '.', ',', 417),
(72, 100, 'KHR', 'Cambodian Riel', '៛', 'Sen', 100, 'false', '&#x17DB;', '.', ',', 116),
(73, 100, 'KMF', 'Comorian Franc', 'Fr', 'Centime', 100, 'false', '', '.', ',', 174),
(74, 100, 'KPW', 'North Korean Won', '₩', 'Chŏn', 100, 'false', '&#x20A9;', '.', ',', 408),
(75, 100, 'KRW', 'South Korean Won', '₩', 'null', 1, 'true', '&#x20A9;', '.', ',', 410),
(76, 100, 'KWD', 'Kuwaiti Dinar', 'د.ك', 'Fils', 1000, 'true', '', '.', ',', 414),
(77, 100, 'KYD', 'Cayman Islands Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 136),
(78, 100, 'KZT', 'Kazakhstani Tenge', '〒', 'Tiyn', 100, 'false', '', '.', ',', 398),
(79, 100, 'LAK', 'Lao Kip', '₭', 'Att', 100, 'false', '&#x20AD;', '.', ',', 418),
(80, 100, 'LBP', 'Lebanese Pound', 'ل.ل', 'Piastre', 100, 'true', '&#x00A3;', '.', ',', 422),
(81, 100, 'LKR', 'Sri Lankan Rupee', '₨', 'Cent', 100, 'false', '&#x0BF9;', '.', ',', 144),
(82, 100, 'LRD', 'Liberian Dollar', '$', 'Cent', 100, 'false', '$', '.', ',', 430),
(83, 100, 'LSL', 'Lesotho Loti', 'L', 'Sente', 100, 'false', '', '.', ',', 426),
(84, 100, 'LTL', 'Lithuanian Litas', 'Lt', 'Centas', 100, 'false', '', '.', ',', 440),
(85, 100, 'LVL', 'Latvian Lats', 'Ls', 'Santīms', 100, 'true', '', '.', ',', 428),
(86, 100, 'LYD', 'Libyan Dinar', 'ل.د', 'Dirham', 1000, 'false', '', '.', ',', 434),
(87, 100, 'MAD', 'Moroccan Dirham', 'د.م.', 'Centime', 100, 'false', '', '.', ',', 504),
(88, 100, 'MDL', 'Moldovan Leu', 'L', 'Ban', 100, 'false', '', '.', ',', 498),
(89, 100, 'MGA', 'Malagasy Ariary', 'Ar', 'Iraimbilanja', 5, 'true', '', '.', ',', 969),
(90, 100, 'MKD', 'Macedonian Denar', 'ден', 'Deni', 100, 'false', '', '.', ',', 807),
(91, 100, 'MMK', 'Myanmar Kyat', 'K', 'Pya', 100, 'false', '', '.', ',', 104),
(92, 100, 'MNT', 'Mongolian Tögrög', '₮', 'Möngö', 100, 'false', '&#x20AE;', '.', ',', 496),
(93, 100, 'MOP', 'Macanese Pataca', 'P', 'Avo', 100, 'false', '', '.', ',', 446),
(94, 100, 'MRO', 'Mauritanian Ouguiya', 'UM', 'Khoums', 5, 'false', '', '.', ',', 478),
(95, 100, 'MUR', 'Mauritian Rupee', '₨', 'Cent', 100, 'true', '&#x20A8;', '.', ',', 480),
(96, 100, 'MVR', 'Maldivian Rufiyaa', 'MVR', 'Laari', 100, 'false', '', '.', ',', 462),
(97, 100, 'MWK', 'Malawian Kwacha', 'MK', 'Tambala', 100, 'false', '', '.', ',', 454),
(98, 100, 'MXN', 'Mexican Peso', '$', 'Centavo', 100, 'true', '$', '.', ',', 484),
(99, 100, 'MYR', 'Malaysian Ringgit', 'RM', 'Sen', 100, 'true', '', '.', ',', 458),
(100, 100, 'MZN', 'Mozambican Metical', 'MTn', 'Centavo', 100, 'true', '', ',', '.', 943),
(101, 100, 'NAD', 'Namibian Dollar', '$', 'Cent', 100, 'false', '$', '.', ',', 516),
(102, 100, 'NGN', 'Nigerian Naira', '₦', 'Kobo', 100, 'false', '&#x20A6;', '.', ',', 566),
(103, 100, 'NIO', 'Nicaraguan Córdoba', 'C$', 'Centavo', 100, 'false', '', '.', ',', 558),
(104, 100, 'NOK', 'Norwegian Krone', 'kr', 'Øre', 100, 'true', 'kr', ',', '.', 578),
(105, 100, 'NPR', 'Nepalese Rupee', '₨', 'Paisa', 100, 'true', '&#x20A8;', '.', ',', 524),
(106, 100, 'NZD', 'New Zealand Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 554),
(107, 100, 'OMR', 'Omani Rial', 'ر.ع.', 'Baisa', 1000, 'true', '&#xFDFC;', '.', ',', 512),
(108, 100, 'PAB', 'Panamanian Balboa', 'B/.', 'Centésimo', 100, 'false', '', '.', ',', 590),
(109, 100, 'PEN', 'Peruvian Nuevo Sol', 'S/.', 'Céntimo', 100, 'true', 'S/.', '.', ',', 604),
(110, 100, 'PGK', 'Papua New Guinean Kina', 'K', 'Toea', 100, 'false', '', '.', ',', 598),
(111, 100, 'PHP', 'Philippine Peso', '₱', 'Centavo', 100, 'true', '&#x20B1;', '.', ',', 608),
(112, 100, 'PKR', 'Pakistani Rupee', '₨', 'Paisa', 100, 'true', '&#x20A8;', '.', ',', 586),
(113, 100, 'PLN', 'Polish Złoty', 'zł', 'Grosz', 100, 'false', 'z&#322;', ',', '', 985),
(114, 100, 'PYG', 'Paraguayan Guaraní', '₲', 'Céntimo', 100, 'true', '&#x20B2;', '.', ',', 600),
(115, 100, 'QAR', 'Qatari Riyal', 'ر.ق', 'Dirham', 100, 'false', '&#xFDFC;', '.', ',', 634),
(116, 100, 'RON', 'Romanian Leu', 'Lei', 'Bani', 100, 'true', '', ',', '.', 946),
(117, 100, 'RSD', 'Serbian Dinar', 'РСД', 'Para', 100, 'true', '', '.', ',', 941),
(118, 100, 'RUB', 'Russian Ruble', 'р.', 'Kopek', 100, 'false', '&#x0440;&#x0443;&#x0431;', ',', '.', 643),
(119, 100, 'RWF', 'Rwandan Franc', 'FRw', 'Centime', 100, 'false', '', '.', ',', 646),
(120, 100, 'SAR', 'Saudi Riyal', 'ر.س', 'Hallallah', 100, 'true', '&#xFDFC;', '.', ',', 682),
(121, 100, 'SBD', 'Solomon Islands Dollar', '$', 'Cent', 100, 'false', '$', '.', ',', 90),
(122, 100, 'SCR', 'Seychellois Rupee', '₨', 'Cent', 100, 'false', '&#x20A8;', '.', ',', 690),
(123, 100, 'SDG', 'Sudanese Pound', '£', 'Piastre', 100, 'true', '', '.', ',', 938),
(124, 100, 'SEK', 'Swedish Krona', 'kr', 'Öre', 100, 'false', '', ',', '', 752),
(125, 100, 'SGD', 'Singapore Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 702),
(126, 100, 'SHP', 'Saint Helenian Pound', '£', 'Penny', 100, 'false', '&#x00A3;', '.', ',', 654),
(127, 100, 'SKK', 'Slovak Koruna', 'Sk', 'Halier', 100, 'true', '', '.', ',', 703),
(128, 100, 'SLL', 'Sierra Leonean Leone', 'Le', 'Cent', 100, 'false', '', '.', ',', 694),
(129, 100, 'SOS', 'Somali Shilling', 'Sh', 'Cent', 100, 'false', '', '.', ',', 706),
(130, 100, 'SRD', 'Surinamese Dollar', '$', 'Cent', 100, 'false', '', '.', ',', 968),
(131, 100, 'SSP', 'South Sudanese Pound', '£', 'piaster', 100, 'false', '&#x00A3;', '.', ',', 728),
(132, 100, 'STD', 'São Tomé and Príncipe Dobra', 'Db', 'Cêntimo', 100, 'false', '', '.', ',', 678),
(133, 100, 'SVC', 'Salvadoran Colón', '₡', 'Centavo', 100, 'true', '&#x20A1;', '.', ',', 222),
(134, 100, 'SYP', 'Syrian Pound', '£S', 'Piastre', 100, 'false', '&#x00A3;', '.', ',', 760),
(135, 100, 'SZL', 'Swazi Lilangeni', 'L', 'Cent', 100, 'true', '', '.', ',', 748),
(136, 100, 'THB', 'Thai Baht', '฿', 'Satang', 100, 'true', '&#x0E3F;', '.', ',', 764),
(137, 100, 'TJS', 'Tajikistani Somoni', 'ЅМ', 'Diram', 100, 'false', '', '.', ',', 972),
(138, 100, 'TMT', 'Turkmenistani Manat', 'T', 'Tenge', 100, 'false', '', '.', ',', 934),
(139, 100, 'TND', 'Tunisian Dinar', 'د.ت', 'Millime', 1000, 'false', '', '.', ',', 788),
(140, 100, 'TOP', 'Tongan Paʻanga', 'T$', 'Seniti', 100, 'true', '', '.', ',', 776),
(141, 100, 'TRY', 'Turkish Lira', 'TL', 'kuruş', 100, 'false', '', ',', '.', 949),
(142, 100, 'TTD', 'Trinidad and Tobago Dollar', '$', 'Cent', 100, 'false', '$', '.', ',', 780),
(143, 100, 'TWD', 'New Taiwan Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 901),
(144, 100, 'TZS', 'Tanzanian Shilling', 'Sh', 'Cent', 100, 'true', '', '.', ',', 834),
(145, 100, 'UAH', 'Ukrainian Hryvnia', '₴', 'Kopiyka', 100, 'false', '&#x20B4;', '.', ',', 980),
(146, 100, 'UGX', 'Ugandan Shilling', 'USh', 'Cent', 100, 'false', '', '.', ',', 800),
(147, 1, 'USD', 'United States Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 840),
(148, 100, 'UYU', 'Uruguayan Peso', '$', 'Centésimo', 100, 'true', '&#x20B1;', ',', '.', 858),
(149, 100, 'UZS', 'Uzbekistani Som', 'null', 'Tiyin', 100, 'false', '', '.', ',', 860),
(150, 100, 'VEF', 'Venezuelan Bolívar', 'Bs F', 'Céntimo', 100, 'true', '', ',', '.', 937),
(151, 100, 'VND', 'Vietnamese Đồng', '₫', 'Hào', 10, 'true', '&#x20AB;', ',', '.', 704),
(152, 100, 'VUV', 'Vanuatu Vatu', 'Vt', 'null', 1, 'true', '', '.', ',', 548),
(153, 100, 'WST', 'Samoan Tala', 'T', 'Sene', 100, 'false', '', '.', ',', 882),
(154, 100, 'XAF', 'Central African Cfa Franc', 'Fr', 'Centime', 100, 'false', '', '.', ',', 950),
(155, 100, 'XAG', 'Silver (Troy Ounce)', 'oz t', 'oz', 1, 'false', '', '.', ',', 961),
(156, 100, 'XAU', 'Gold (Troy Ounce)', 'oz t', 'oz', 1, 'false', '', '.', ',', 959),
(157, 100, 'XCD', 'East Caribbean Dollar', '$', 'Cent', 100, 'true', '$', '.', ',', 951),
(158, 100, 'XDR', 'Special Drawing Rights', 'SDR', '', 1, 'false', '$', '.', ',', 960),
(159, 100, 'XOF', 'West African Cfa Franc', 'Fr', 'Centime', 100, 'false', '', '.', ',', 952),
(160, 100, 'XPF', 'Cfp Franc', 'Fr', 'Centime', 100, 'false', '', '.', ',', 953),
(161, 100, 'YER', 'Yemeni Rial', '﷼', 'Fils', 100, 'false', '&#xFDFC;', '.', ',', 886),
(162, 100, 'ZAR', 'South African Rand', 'R', 'Cent', 100, 'true', '&#x0052;', '.', ',', 710),
(163, 100, 'ZMK', 'Zambian Kwacha', 'ZK', 'Ngwee', 100, 'false', '', '.', ',', 894),
(164, 100, 'ZMW', 'Zambian Kwacha', 'ZK', 'Ngwee', 100, 'false', '', '.', ',', 967);

-- --------------------------------------------------------

--
-- Table structure for table `custom_domain_requests`
--

CREATE TABLE `custom_domain_requests` (
  `id` int UNSIGNED NOT NULL,
  `custom_domain_request_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `previous_domain` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `current_domain` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `transfer_status` int NOT NULL DEFAULT '0',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `id` int UNSIGNED NOT NULL,
  `email_template_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_template_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_template_subject` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_template_content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_templates`
--

INSERT INTO `email_templates` (`id`, `email_template_id`, `email_template_name`, `email_template_subject`, `email_template_content`, `is_enabled`, `status`, `created_at`, `updated_at`) VALUES
(1, '584922675196', 'Appointment (Pending)', 'Your Appointment is Pending', '<div class=\"header\">\r\n    <h4>Appointment Pendings</h4>\r\n    <p>Your appointment request is pending and will be confirmed shortly.</p>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(2, '584922675197', 'Appointment (Confirmed)', 'Your Appointment has been Confirmed', '<div class=\"header\">\r\n<h1>Appointment Confirmed</h1>\r\n<p>Your appointment has been successfully scheduled!</p>\r\n</div>\r\n<br />\r\n<div class=\"content\">\r\n<p>Hi,</p>\r\n<p>We are pleased to confirm your appointmentDate with :hyperlink. Please find the details below:</p>\r\n<p><strong>Date:</strong> :appointmentdate</p>\r\n<p><strong>Time:</strong> :appointmenttime</p>\r\n<br />\r\n<p>If you have any questions, need to reschedule, or need further assistance, please don\\\'t hesitate to contact :hyperlink.</p>\r\n<p>Thank you for choosing our service!</p>\r\n<br />\r\n<p><strong>You can add this appointment to your Google Calendar by clicking the link below:</strong></p>\r\n<a class=\"button\" href=\":googlecalendarurl\" target=\"_blank\" rel=\"noopener\">Add to Google Calendar</a>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(3, '584922675198', 'Appointment (Canceled)', 'Your Appointment has been Canceled', '<div class=\"header\">\r\n    <h1>Appointment Canceled</h1>\r\n    <p>Your appointment has been successfully canceled.</p>\r\n</div>\r\n<br>\r\n\r\n<div class=\"content\">\r\n    <p>Hi,</p>\r\n    <p>We are sorry to inform you that your appointment has been canceled.</p>\r\n    <br>\r\n    <p>If you have any questions or need further assistance, please don\\\'t hesitate to contact :hyperlink.</p>\r\n    <p>Thank you for choosing our service!</p>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(4, '584922675199', 'Appointment (Rescheduled)', 'Your Appointment has been Rescheduled', '<div class=\"header\">\r\n    <h1>Appointment Rescheduled</h1>\r\n    <p>Your appointment has been successfully rescheduled.</p>\r\n</div>\r\n<br>\r\n\r\n<div class=\"content\">\r\n    <p>Hi,</p>\r\n    <p>We are sorry to inform you that your appointment has been rescheduled. Please find the new appointment details below:</p>\r\n    <p><strong>Date:</strong> :appointmentdate</p>\r\n    <p><strong>Time:</strong> :appointmenttime</p>\r\n    <br>\r\n    <p>If you have any questions, need to reschedule, or need further assistance, please don\\\'t hesitate to contact :hyperlink.</p>\r\n    <p>Thank you for choosing our service!</p>\r\n\r\n    <p><strong>You can add this appointment to your Google Calendar by clicking the link below:</strong></p>\r\n    <a class=\"button\" href=\":googlecalendarurl\" target=\"_blank\" rel=\"noopener\">Add to Google Calendar</a>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(5, '584922675200', 'Appointment (Completed)', 'Your Appointment has been Completed', '<div class=\"header\">\r\n    <h1>Appointment Completed</h1>\r\n    <p>Your appointment has been successfully completed. Thank you for using our services!</p>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(6, '584922675201', 'Appointment (Received vCard Owner)', 'New Appointment Request', '<div class=\"container\">\r\n    <h2 class=\"title\">New Appointment Request</h2>\r\n    <p class=\"text\">Hello,</p>\r\n    <p class=\"text\">\r\n        You have received a new appointment request from\r\n        <span class=\"highlight\">:customername</span>.\r\n        Here are the details:\r\n    </p>\r\n\r\n    <!-- Appointment Details -->\r\n    <div class=\"appointment-details\">\r\n        <p>Appointment Details:</p>\r\n        <ul class=\"list-none\">\r\n            <li class=\"list-item\"><span>Date:</span> :appointmentdate</li>\r\n            <li class=\"list-item\"><span>Time:</span> :appointmenttime</li>\r\n        </ul>\r\n    </div>\r\n\r\n    <!-- View Appointment Button -->\r\n    <a href=\":appointmentpageurl\" class=\"button\">\r\n        View Appointment\r\n    </a>\r\n\r\n    <p class=\"text\">Thank you for using our service!</p>\r\n    <p class=\"text\">Best regards,</p>\r\n    <p class=\"highlight\">:appname</p>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(7, '584922675202', 'Custom Domain Processed', 'Your domain request has been successfully processed', '<div class=\"container\">\r\n    <h2 class=\"title\">Custom Domain Processed</h2>\r\n    <p class=\"text\">Hello,</p>\r\n    <p class=\"text\">\r\n        Your domain request has been successfully processed.\r\n    </p>\r\n    <p class=\"text\">\r\n        Here are the details of the processed domain:\r\n    </p>\r\n\r\n    <!-- Domain Details -->\r\n    <div class=\"domain-details\">\r\n        <p>Domain Details:</p>\r\n        <ul class=\"list-none\">\r\n            <li class=\"list-item\"><span>Previous Domain:</span> <a\r\n                    href=\"https://:previousdomain\"\r\n                    target=\"_blank\">:previousdomain</a></li>\r\n            <li class=\"list-item\"><span>Current Domain:</span> <a\r\n                    href=\"https://:currentdomain\"\r\n                    target=\"_blank\">:currentdomain</a></li>\r\n        </ul>\r\n    </div>\r\n\r\n    <p class=\"text\">Thank you for choosing our service!</p>\r\n    <p class=\"text\">Best regards,</p>\r\n    <p class=\"highlight\">:appname</p>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(8, '584922675203', 'Custom Domain Approval', 'Your domain request has been approved', '<div class=\"container\">\r\n    <h2 class=\"title\">Custom Domain Approval</h2>\r\n    <p class=\"text\">Hello,</p>\r\n    <p class=\"text\">\r\n        Your domain request has been successfully approved.\r\n    </p>\r\n    <p class=\"text\">\r\n        Here are the details of your approved domain:\r\n    </p>\r\n\r\n    <!-- Domain Details -->\r\n    <div class=\"domain-details\">\r\n        <p>Domain Details:</p>\r\n        <ul class=\"list-none\">\r\n            <li class=\"list-item\"><span>Previous Domain:</span> <a\r\n                    href=\"https://:previousdomain\"\r\n                    target=\"_blank\">:previousdomain</a></li>\r\n            <li class=\"list-item\"><span>Current Domain:</span> <a\r\n                    href=\"https://:currentdomain\"\r\n                    target=\"_blank\">:currentdomain</a></li>\r\n        </ul>\r\n    </div>\r\n\r\n    <p class=\"text\">Thank you for choosing our service!</p>\r\n    <p class=\"text\">Best regards,</p>\r\n    <p class=\"highlight\">:appname</p>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(9, '584922675204', 'Custom Domain Rejection', 'Your domain request has been rejected', '<div class=\"container\">\r\n    <h2 class=\"title\">Custom Domain Rejection</h2>\r\n    <p class=\"text\">Hello,</p>\r\n    <p class=\"text\">\r\n        Your domain request has been rejected.\r\n    </p>\r\n    <p class=\"text\">\r\n        Here are the details of the rejected domain:\r\n    </p>\r\n\r\n    <!-- Domain Details -->\r\n    <div class=\"domain-details\">\r\n        <p>Domain Details:</p>\r\n        <ul class=\"list-none\">\r\n            <li class=\"list-item\"><span>Previous Domain:</span> <a\r\n                    href=\"https://:previousdomain\"\r\n                    target=\"_blank\">:previousdomain</a></li>\r\n            <li class=\"list-item\"><span>Current Domain:</span> <a\r\n                    href=\"https://:currentdomain\"\r\n                    target=\"_blank\">:currentdomain</a></li>\r\n        </ul>\r\n    </div>\r\n\r\n    <p class=\"text\">Thank you for choosing our service!</p>\r\n    <p class=\"text\">Best regards,</p>\r\n    <p class=\"highlight\">:appname</p>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(10, '584922675205', 'Service / Product Enquiry', 'New Service / Product Enquiry', '<div class=\"email-content\">\r\n    <p class=\"text\">Hello :vcardname,</p>\r\n\r\n    <p>You have received a new inquiry. Its details are as follows:</p>\r\n    <p class=\"text\">Name: :receivername</p>\r\n    <p class=\"text\">Email: :receiveremail</p>\r\n    <p class=\"text\">Phone: :receiverphone</p>\r\n    <p class=\"text\">Message: :receivermessage</p>\r\n\r\n    <p class=\"text\">Thank you for choosing our service!</p>\r\n    <p class=\"text\">Best regards,</p>\r\n    <p class=\"highlight\">:appname</p>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(11, '584922675206', 'Plan Expired', 'Your plan has been expired', '<div class=\"container\">\r\n    <h2 class=\"title\">Plan Expired</h2>\r\n    <p class=\"text\">Hello,</p>\r\n    <p class=\"text\">\r\n        Your plan has been expired.\r\n    </p>\r\n    <p class=\"text\">\r\n        Here are the details of the expired plan:\r\n    </p>\r\n\r\n    <div class=\"plan-details\">\r\n        <p>Plan Details:</p>\r\n        <ul class=\"list-none\">\r\n            <li class=\"list-item\"><span>Plan Name:</span> :planname</li>\r\n            <li class=\"list-item\"><span>Expiry Date:</span> :expirydate</li>\r\n        </ul>\r\n    </div>\r\n\r\n    <p class=\"text\">Thank you for choosing our service!</p>\r\n    <p class=\"text\">Best regards,</p>\r\n    <p class=\"highlight\">:appname</p>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(12, '584922675207', 'Your plan is about to expire soon', 'Your plan is about to expire soon', '<div class=\"container\">\r\n    <h2 class=\"title\">Your plan is about to expire soon.</h2>\r\n    <p class=\"text\">Hello,</p>\r\n    <p class=\"text\">\r\n        Your plan is about to expire soon.\r\n    </p>\r\n    <p class=\"text\">\r\n        Here are the details of the expired plan:\r\n    </p>\r\n\r\n    <div class=\"plan-details\">\r\n        <p>Plan Details:</p>\r\n        <ul class=\"list-none\">\r\n            <li class=\"list-item\"><span>Plan Name:</span> :planname</li>\r\n            <li class=\"list-item\"><span>Expiry Date:</span> :expirydate</li>\r\n        </ul>\r\n    </div>\r\n\r\n    <p class=\"text\">Thank you for choosing our service!</p>\r\n    <p class=\"text\">Best regards,</p>\r\n    <p class=\"highlight\">:appname</p>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(13, '584922675208', 'Welcome', 'Welcome to :appname', '<div class=\"container\">\r\n    <h2 class=\"title\">Welcome to :appname</h2>\r\n    <p class=\"text\">Hello,</p>\r\n    <p class=\"text\">\r\n        Welcome to :appname.\r\n    </p>\r\n    <p class=\"text\">\r\n        Here are the details of your account:\r\n    </p>\r\n\r\n    <div class=\"account-details\">\r\n        <p>Account Details:</p>\r\n        <ul class=\"list-none\">\r\n            <li class=\"list-item\"><span>Name:</span> :registeredname</li>\r\n            <li class=\"list-item\"><span>Email:</span> :registeredemail</li>\r\n        </ul>\r\n    </div>\r\n\r\n    <p class=\"text\">Thank you for choosing our service!</p>\r\n    <p class=\"text\">Best regards,</p>\r\n    <p class=\"highlight\">:appname</p>\r\n</div>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(14, '584922675209', 'NFC Card Order Confirmation (Customer)', 'Order Confirmation', '<table role=\"presentation\" class=\"email-container\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n    <tr>\r\n        <td align=\"center\">\r\n            <table role=\"presentation\" class=\"email-content\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n                <tr>\r\n                    <td class=\"email-header\">\r\n                        <h1>Order Confirmation</h1>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td class=\"email-body\">\r\n                        <p>Thank you for your order! Your NFC card is being processed.</p>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td class=\"email-details\">\r\n                        <p>Order Details:</p>\r\n                        <ul>\r\n                            <li><strong>Order ID:</strong> #:orderid</li>\r\n                            <li><strong>Card Design:</strong> :cardname</li>\r\n                            <li><strong>Quantity:</strong> :quantity</li>\r\n                            <li><strong>Total Price:</strong> :totalprice</li>\r\n                        </ul>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td align=\"center\">\r\n                        <a href=\":orderpageurl\" class=\"view-order-button\">View Order</a>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td class=\"email-footer\">\r\n                        <p>If you have any questions, contact us at <a href=\"mailto:\\:supportemail\">:supportemail</a></p>\r\n                    </td>\r\n                </tr>\r\n            </table>\r\n        </td>\r\n    </tr>\r\n</table>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(15, '584922675210', 'NFC Card Order Delivery Status', 'Update on your order status', '<table role=\"presentation\" class=\"email-container\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n    <tr>\r\n        <td align=\"center\">\r\n            <table role=\"presentation\" class=\"email-content\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n                <tr>\r\n                    <td class=\"email-header\">\r\n                        <h1>Order Delivery Status</h1>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td class=\"email-body\">\r\n                        <p>Your NFC card order has been :deliverystatus!</p>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td class=\"email-details\">\r\n                        <p>Delivery Details:</p>\r\n                        <ul>\r\n                            <li><strong>Order ID:</strong> #:orderid</li>\r\n                            <li><strong>Shipping Carrier:</strong> :courierpartner</li>\r\n                            <li><strong>Tracking Number:</strong> :trackingnumber</li>\r\n                        </ul>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td align=\"center\">\r\n                        <a href=\":orderpageurl\" class=\"track-button\">Track Order</a>\r\n                    </td>                            \r\n                </tr>\r\n                <tr>\r\n                    <td class=\"email-footer\">\r\n                        <p>If you have any questions, contact us at <a href=\"mailto:\\:supportemail\">:supportemail</a></p>\r\n                    </td>\r\n                </tr>\r\n            </table>\r\n        </td>\r\n    </tr>\r\n</table>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(16, '584922675211', 'New NFC Card Order (Website Owner)', 'New NFC Card Order', '<table role=\"presentation\" class=\"email-container\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n    <tr>\r\n        <td align=\"center\">\r\n            <table role=\"presentation\" class=\"email-content\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n                <tr>\r\n                    <td class=\"email-header\">\r\n                        <h1>New NFC Card Order</h1>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td class=\"email-body\">\r\n                        <p>A new NFC card order has been placed on your website.</p>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td class=\"email-details\">\r\n                        <p>Order Details:</p>\r\n                        <ul>\r\n                            <li><strong>Order ID:</strong> #:orderid</li>\r\n                            <li><strong>Customer Name:</strong> :customername</li>\r\n                            <li><strong>Email:</strong> :customeremail</li>\r\n                            <li><strong>Card Design:</strong> :cardname</li>\r\n                            <li><strong>Quantity:</strong> :quantity</li>\r\n                            <li><strong>Total Price:</strong> :totalprice</li>\r\n                        </ul>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td align=\"center\">\r\n                        <a href=\":orderpageurl\" class=\"view-order-button\">View Order</a>\r\n                    </td>\r\n                </tr>\r\n                <tr>\r\n                    <td class=\"email-footer\">\r\n                        <p>If you have any questions, contact support at <a href=\"mailto:\\:supportemail\">:supportemail</a></p>\r\n                    </td>\r\n                </tr>                            \r\n            </table>\r\n        </td>\r\n    </tr>\r\n</table>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(17, '584922675212', 'Forget Password', 'Reset Password', '<table class=\"wrapper\" style=\"box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\'; position: relative; background-color: #edf2f7; margin: 0; padding: 0; width: 100%;\" role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n    <tbody>\r\n    <tr>\r\n    <td class=\"body\" style=\"background-color: #edf2f7; border-bottom: 1px solid #edf2f7; border-top: 1px solid #edf2f7; margin: 0; padding: 0; width: 100%;\" width=\"100%\">\r\n    <table class=\"inner-body\" style=\"background-color: #ffffff; border-color: #e8e5ef; border-radius: 2px; border-width: 1px; box-shadow: 0 2px 0 rgba(0, 0, 150, 0.025), 2px 4px 0 rgba(0, 0, 150, 0.015); margin: 0 auto; padding: 0; width: 570px;\" role=\"presentation\" width=\"570\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\">\r\n    <tbody>\r\n    <tr>\r\n    <td class=\"content-cell\" style=\"max-width: 100vw; padding: 32px;\">\r\n    <h1 style=\"color: #3d4852; font-size: 18px; font-weight: bold; margin-top: 0; text-align: left;\">Hello :customername!</h1>\r\n    <p style=\"font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;\">You are receiving this email because we received a password reset request for your account.</p>\r\n    <table class=\"action\" style=\"margin: 30px auto; padding: 0; text-align: center; width: 100%;\" role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\">\r\n    <tbody>\r\n    <tr>\r\n    <td align=\"center\">\r\n    <table role=\"presentation\" border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n    <tbody>\r\n    <tr>\r\n    <td align=\"center\">\r\n    <table role=\"presentation\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n    <tbody>\r\n    <tr>\r\n    <td><a class=\"button button-primary\" style=\"border-radius: 4px; color: #fff; display: inline-block; text-decoration: none; background-color: #2d3748; border: 8px solid #2d3748; padding: 8px 18px;\" href=\":actionlink\" target=\"_blank\" rel=\"noopener\">Reset Password</a></td>\r\n    </tr>\r\n    </tbody>\r\n    </table>\r\n    </td>\r\n    </tr>\r\n    </tbody>\r\n    </table>\r\n    </td>\r\n    </tr>\r\n    </tbody>\r\n    </table>\r\n    <p style=\"font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;\">This password reset link will expire in 60 minutes.</p>\r\n    <p style=\"font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;\">If you did not request a password reset, no further action is required.</p>\r\n    <p style=\"font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;\">Regards,<br>GoBiz</p>\r\n    <table class=\"subcopy\" style=\"border-top: 1px solid #e8e5ef; margin-top: 25px; padding-top: 25px;\" role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n    <tbody>\r\n    <tr>\r\n    <td>\r\n    <p style=\"line-height: 1.5em; margin-top: 0; text-align: left; font-size: 14px;\">If you’re having trouble clicking the \"Reset Password\" button, copy and paste the URL below into your web browser: :actionlink</p>\r\n    </td>\r\n    </tr>\r\n    </tbody>\r\n    </table>\r\n    </td>\r\n    </tr>\r\n    </tbody>\r\n    </table>\r\n    </td>\r\n    </tr>\r\n    </tbody>\r\n</table>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(18, '584922675213', 'Verify Email Address', 'Verify Email Address', '<table class=\"wrapper\" style=\"box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\'; position: relative; background-color: #edf2f7; margin: 0; padding: 0; width: 100%;\" role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n    <tbody>\r\n    <tr>\r\n    <td class=\"body\" style=\"background-color: #edf2f7; border-bottom: 1px solid #edf2f7; border-top: 1px solid #edf2f7; margin: 0; padding: 0; width: 100%;\" width=\"100%\">\r\n    <table class=\"inner-body\" style=\"background-color: #ffffff; border-color: #e8e5ef; border-radius: 2px; border-width: 1px; box-shadow: 0 2px 0 rgba(0, 0, 150, 0.025), 2px 4px 0 rgba(0, 0, 150, 0.015); margin: 0 auto; padding: 0; width: 570px;\" role=\"presentation\" width=\"570\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\">\r\n    <tbody>\r\n    <tr>\r\n    <td class=\"content-cell\" style=\"max-width: 100vw; padding: 32px;\">\r\n    <h1 style=\"color: #3d4852; font-size: 18px; font-weight: bold; margin-top: 0; text-align: left;\">Verify Email Address</h1>\r\n    <p style=\"font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;\">Please click the button below to verify your email address.</p>                                            \r\n    <table class=\"action\" style=\"margin: 30px auto; padding: 0; text-align: center; width: 100%;\" role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\">\r\n    <tbody>\r\n    <tr>\r\n    <td align=\"center\">\r\n    <table role=\"presentation\" border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n    <tbody>\r\n    <tr>\r\n    <td align=\"center\">\r\n    <table role=\"presentation\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n    <tbody>\r\n    <tr>\r\n    <td><a class=\"button button-primary\" style=\"border-radius: 4px; color: #fff; display: inline-block; text-decoration: none; background-color: #2d3748; border: 8px solid #2d3748; padding: 8px 18px;\" href=\":actionlink\" target=\"_blank\" rel=\"noopener\">Verify Email Address</a></td>\r\n    </tr>\r\n    </tbody>\r\n    </table>\r\n    </td>\r\n    </tr>\r\n    </tbody>\r\n    </table>\r\n    </td>\r\n    </tr>\r\n    </tbody>\r\n    </table>\r\n    <p style=\"font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;\">If you did not create an account, no further action is required.</p>\r\n    <p style=\"font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;\">Thanks,<br>:appname</p>\r\n    </td>\r\n    </tr>\r\n    </tbody>\r\n    </table>\r\n    </td>\r\n    </tr>\r\n    </tbody>\r\n</table>', 1, 1, '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(19, '584922675214', 'New Custom Domain Request', 'You have received a new custom domain request', '<div class=\"container\" style=\"font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;\">\r\n        <p class=\"text\" style=\"font-size: 16px;\">Hello,</p>\r\n        <p class=\"text\" style=\"font-size: 16px;\">You have received a new custom domain request from a customer.</p>\r\n        <p class=\"text\" style=\"font-size: 16px;\">Please review and verify the request by visiting the verification link below.</p>\r\n        <div class=\"verify-section\" style=\"margin: 20px 0;\">\r\n            <a href=\":actionlink\" target=\"_blank\" \r\n            style=\"display: inline-block; padding: 10px 20px; background-color: #2c7be5; color: #fff; text-decoration: none; border-radius: 5px;\">\r\n                Verify Domain Request\r\n            </a>\r\n        </div>\r\n        <p class=\"text\" style=\"font-size: 16px;\">If you did not expect this request, please ignore this email.</p>\r\n        <p class=\"text\" style=\"font-size: 16px;\">Best regards,</p>\r\n        <p class=\"highlight\" style=\"font-weight: bold; font-size: 16px;\">:appname</p>\r\n    </div>', 1, 1, '2025-06-22 20:10:34', '2025-06-22 20:10:34');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `galleries`
--

CREATE TABLE `galleries` (
  `id` int UNSIGNED NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `gallery_image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `galleries`
--

INSERT INTO `galleries` (`id`, `card_id`, `caption`, `gallery_image`, `status`, `created_at`, `updated_at`) VALUES
(1, '6851d1e43a2dc', 'Mi galeria', 'images/68475dc954ad5-684b13bc6fe5f.jpg', '1', '2025-06-17 19:35:10', '2025-06-17 19:35:10'),
(2, '6851d1e43a2dc', 'Trading sharks', 'images/68475dc954ad5-68476272f0985.png', '1', '2025-06-17 19:35:10', '2025-06-17 19:35:10'),
(3, '688a4c0476279', 'test image', 'images/68475dc954ad5-684b5bf2c74b1.jpg', '1', '2025-07-30 14:48:09', '2025-07-30 14:48:09');

-- --------------------------------------------------------

--
-- Table structure for table `gateways`
--

CREATE TABLE `gateways` (
  `id` int UNSIGNED NOT NULL,
  `payment_gateway_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_gateway_logo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_gateway_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret_key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'enabled',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gateways`
--

INSERT INTO `gateways` (`id`, `payment_gateway_id`, `payment_gateway_logo`, `payment_gateway_name`, `display_name`, `client_id`, `secret_key`, `is_status`, `status`, `created_at`, `updated_at`) VALUES
(1, '60964401751ab', 'img/payment-method/paypal.png', 'Paypal', 'Paypal', '5', '6', 'enabled', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(2, '60964410731d9', 'img/payment-method/razorpay.png', 'Razorpay', 'Razorpay', '7', '8', 'enabled', '0', '2025-06-09 22:16:32', '2025-06-17 15:52:40'),
(3, '60964410732t9', 'img/payment-method/stripe.png', 'Stripe', 'Stripe', '10', '11', 'enabled', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(4, '60964410736592', 'img/payment-method/paystack.png', 'Paystack', 'Paystack', '14', '15', 'enabled', '0', '2025-06-09 22:16:32', '2025-06-17 15:53:08'),
(5, '6096441071589632', 'img/payment-method/mollie.webp', 'Mollie', 'Mollie', '16', '17', 'enabled', '0', '2025-06-09 22:16:32', '2025-06-17 15:53:00'),
(6, '19065566166715', 'img/payment-method/phonepe.png', 'PhonePe', 'PhonePe', '18', '19', 'enabled', '0', '2025-06-09 22:16:32', '2025-06-17 15:53:13'),
(7, '776111730465', 'img/payment-method/mercado-pago.png', 'Mercado Pago', 'Mercado Pago', '20', '21', 'enabled', '1', '2025-06-09 22:16:32', '2025-06-17 15:53:25'),
(8, '767510608137', 'img/payment-method/toyyibpay.png', 'Toyyibpay', 'Toyyibpay', '22', '23', 'enabled', '0', '2025-06-09 22:16:32', '2025-06-17 15:52:47'),
(9, '754201940107', 'img/payment-method/flutterwave.png', 'Flutterwave', 'Flutterwave', '24', '25', 'enabled', '0', '2025-06-09 22:16:32', '2025-06-17 15:52:54'),
(10, '5992737427969', 'img/payment-method/paddle.png', 'Paddle', 'Paddle', '26', '27', 'enabled', '0', '2025-06-09 22:16:32', '2025-06-17 15:53:56'),
(11, '5992737427970', 'img/payment-method/paytr.png', 'Paytr', 'Paytr', '28', '29', 'enabled', '0', '2025-06-09 22:16:32', '2025-06-17 15:53:40'),
(12, '278523098674', 'img/payment-method/xendit.png', 'Xendit', 'Xendit', '30', '31', 'enabled', '0', '2025-06-09 22:16:32', '2025-06-17 15:53:48'),
(13, '278523098675', 'img/payment-method/cashfree.png', 'Cashfree', 'Cashfree', '32', '33', 'enabled', '0', '2025-06-09 22:16:32', '2025-06-17 15:53:33'),
(14, '659644107y2g5', 'img/payment-method/bank-transfer.png', 'Bank Transfer', 'Bank Transfer', '12', '13', 'enabled', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(15, '278523098676', 'img/payment-method/iyzipay.png', 'Iyzipay', 'Iyzipay', '34', '35', 'enabled', '0', '2025-06-09 23:08:33', '2025-06-17 15:52:18');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int UNSIGNED NOT NULL,
  `group_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `emails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `health_check_result_history_items`
--

CREATE TABLE `health_check_result_history_items` (
  `id` bigint UNSIGNED NOT NULL,
  `check_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `check_label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `short_summary` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta` json NOT NULL,
  `ended_at` timestamp NOT NULL,
  `batch` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `information_pops`
--

CREATE TABLE `information_pops` (
  `id` int UNSIGNED NOT NULL,
  `information_pop_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `confetti_effect` tinyint(1) NOT NULL DEFAULT '0',
  `info_pop_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `info_pop_title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `info_pop_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `info_pop_button_text` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `info_pop_button_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `information_pops`
--

INSERT INTO `information_pops` (`id`, `information_pop_id`, `card_id`, `confetti_effect`, `info_pop_image`, `info_pop_title`, `info_pop_desc`, `info_pop_button_text`, `info_pop_button_url`, `status`, `created_at`, `updated_at`) VALUES
(1, '684d42f89c1b1', '684d41ea87467', 1, 'uploads/information_pop_images/IMG-684ebe1bb46a3-1749990939.png', 'Hola', 'Hola esto es una prueba', 'Ir a la pagina', 'https://cavernatecnologica.com', 1, '2025-06-14 07:38:00', '2025-06-15 10:35:39'),
(2, '6851de3bcd202', '6851d1e43a2dc', 1, 'uploads/information_pop_images/IMG-6851de3bccbbe-1750195771.png', 'Felicidades', 'Gracias por comprar', 'Visita mi web', 'https://cavernatecnologica.com', 1, '2025-06-17 19:29:31', '2025-06-17 19:29:31');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `name`, `language`, `created_at`, `updated_at`) VALUES
(1, NULL, 'en', '2025-06-09 20:16:31', '2025-06-09 20:16:31');

-- --------------------------------------------------------

--
-- Table structure for table `medias`
--

CREATE TABLE `medias` (
  `id` bigint UNSIGNED NOT NULL,
  `media_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` bigint NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medias`
--

INSERT INTO `medias` (`id`, `media_id`, `user_id`, `media_name`, `media_url`, `size`, `created_at`, `updated_at`) VALUES
(1, '68476272f0985', '68475dc954ad5', 'TradingShark Logo.jpg', 'images/68475dc954ad5-68476272f0985.png', 0, '2025-06-09 20:38:42', '2025-06-09 20:38:42'),
(2, '68487d9c0f750', '68475dc954ad5', 'TradingShark Logo.jpg', 'images/68475dc954ad5-68487d9c0f750.png', 0, '2025-06-10 16:46:52', '2025-06-10 16:46:52'),
(3, '684af5d035df1', '68475dc954ad5', '7bft1ancxbvhjodauqqe60mhfuxgt951okgmmv0g3btztapfo0lcvavfmvp2yyh.jpg', 'images/68475dc954ad5-684af5d035df1.jpg', 0, '2025-06-12 13:44:16', '2025-06-12 13:44:16'),
(4, '684af6254fc27', '68475dc954ad5', '7bft1ancxbvhjodauqqe60mhfuxgt951okgmmv0g3btztapfo0lcvavfmvp2yyh.jpg', 'images/68475dc954ad5-684af6254fc27.jpg', 0, '2025-06-12 13:45:41', '2025-06-12 13:45:41'),
(5, '684b073171529', '68475dc954ad5', '7bft1ancxbvhjodauqqe60mhfuxgt951okgmmv0g3btztapfo0lcvavfmvp2yyh.jpg', 'images/68475dc954ad5-684b073171529.jpg', 0, '2025-06-12 14:58:25', '2025-06-12 14:58:25'),
(6, '684b13bc6fe5f', '68475dc954ad5', '7bft1ancxbvhjodauqqe60mhfuxgt951okgmmv0g3btztapfo0lcvavfmvp2yyh.jpg', 'images/68475dc954ad5-684b13bc6fe5f.jpg', 0, '2025-06-12 15:51:56', '2025-06-12 15:51:56'),
(7, '684b5bf2c74b1', '68475dc954ad5', '7bft1ancxbvhjodauqqe60mhfuxgt951okgmmv0g3btztapfo0lcvavfmvp2yyh.jpg', 'images/68475dc954ad5-684b5bf2c74b1.jpg', 0, '2025-06-12 21:00:02', '2025-06-12 21:00:02'),
(8, '684d2fb8890ec', '68475dc954ad5', '7bft1ancxbvhjodauqqe60mhfuxgt951okgmmv0g3btztapfo0lcvavfmvp2yyh.jpg', 'images/68475dc954ad5-684d2fb8890ec.jpg', 0, '2025-06-14 06:15:52', '2025-06-14 06:15:52');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2018_08_29_200844_create_languages_table', 1),
(4, '2018_08_29_205156_create_translations_table', 1),
(5, '2019_08_19_000000_create_failed_jobs_table', 1),
(6, '2021_03_31_131010_create_roles_table', 1),
(7, '2021_04_01_151204_create_themes_table', 1),
(8, '2021_04_01_151457_create_plans_table', 1),
(9, '2021_04_01_151522_create_business_cards_table', 1),
(10, '2021_04_01_151647_create_services_table', 1),
(11, '2021_04_01_151712_create_galleries_table', 1),
(12, '2021_04_01_151730_create_payments_table', 1),
(13, '2021_04_01_151755_create_business_hours_table', 1),
(14, '2021_04_01_151814_create_settings_table', 1),
(15, '2021_04_01_151835_create_gateways_table', 1),
(16, '2021_04_01_151858_create_transactions_table', 1),
(17, '2021_05_10_140547_create_currencies_table', 1),
(18, '2021_07_27_190247_create_config_table', 1),
(19, '2021_07_29_140453_create_pages_table', 1),
(20, '2021_08_03_171614_create_business_fields_table', 1),
(21, '2021_08_23_184731_create_store_products_table', 1),
(22, '2021_09_21_132016_create_medias_table', 1),
(23, '2023_07_31_131259_create_contact_forms_table', 1),
(24, '2023_08_16_060213_create_vcard_products_table', 1),
(25, '2023_09_08_113619_create_visitors_table', 1),
(26, '2023_10_02_122417_create_categories_table', 1),
(27, '2023_11_01_065317_create_pending_user_emails_table', 1),
(28, '2023_11_03_153133_create_testimonials_table', 1),
(29, '2024_03_09_060106_create_blogs_table', 1),
(30, '2024_03_09_060454_create_blog_categories_table', 1),
(31, '2024_10_11_115014_create_coupons_table', 1),
(32, '2024_10_11_135726_create_applied_coupons_table', 1),
(33, '2024_10_16_111806_create_card_appointment_times_table', 1),
(34, '2024_10_16_111838_create_booked_appointments_table', 1),
(35, '2024_10_24_161314_create_custom_domain_requests_table', 1),
(36, '2024_11_14_134322_create_campaigns_table', 1),
(37, '2024_11_14_134332_create_groups_table', 1),
(38, '2024_11_14_134858_create_campaign_emails_table', 1),
(39, '2024_11_18_072700_create_backups_table', 1),
(40, '2024_11_20_083838_create_jobs_table', 1),
(41, '2025_01_02_131656_create_newsletters_table', 1),
(42, '2025_01_02_161519_create_information_pops_table', 1),
(43, '2025_01_11_124322_create_nfc_card_designs_table', 1),
(44, '2025_01_11_124444_create_nfc_card_orders_table', 1),
(45, '2025_01_11_125511_create_nfc_card_order_transactions_table', 1),
(46, '2025_01_18_181119_create_email_templates_table', 1),
(47, '2025_02_05_124354_create_nfc_card_keys_table', 1),
(48, '2025_03_08_133718_create_health_tables', 1),
(49, '2025_03_14_135214_create_referrals_table', 1),
(50, '2025_03_14_135232_create_referral_withdraw_requests_table', 1),
(51, '2025_03_14_135300_create_referral_withdraw_transactions_table', 1),
(52, '2025_04_22_072607_create_countries_table', 1),
(53, '2025_06_10_143126_modify_business_cards_cover_field', 2),
(54, '2025_06_10_180115_modify_services_service_image_field', 3),
(55, '2025_06_11_000752_drop_status_from_vcard_products', 4),
(56, '2025_06_11_000845_drop_status_from_vcard_products', 4),
(57, '2025_06_11_002602_add_price_to_services', 5),
(58, '2025_06_12_072638_add_price_to_services', 6);

-- --------------------------------------------------------

--
-- Table structure for table `newsletters`
--

CREATE TABLE `newsletters` (
  `id` int UNSIGNED NOT NULL,
  `newsletter_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nfc_card_designs`
--

CREATE TABLE `nfc_card_designs` (
  `id` int UNSIGNED NOT NULL,
  `nfc_card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nfc_card_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nfc_card_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `nfc_card_front_image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nfc_card_back_image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nfc_card_price` decimal(8,2) NOT NULL,
  `available_stocks` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nfc_card_keys`
--

CREATE TABLE `nfc_card_keys` (
  `id` int UNSIGNED NOT NULL,
  `nfc_card_key_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `unqiue_key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `key_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_status` enum('linked','unlinked') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unlinked',
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nfc_card_orders`
--

CREATE TABLE `nfc_card_orders` (
  `id` int UNSIGNED NOT NULL,
  `nfc_card_order_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nfc_card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nfc_card_order_transaction_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nfc_card_logo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `order_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_status` enum('pending','processing','printing process begun','out for delivery','delivered','cancelled','hold','shipped') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nfc_card_order_transactions`
--

CREATE TABLE `nfc_card_order_transactions` (
  `id` int UNSIGNED NOT NULL,
  `nfc_card_order_transaction_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nfc_card_order_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_transaction_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `invoice_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_prefix` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('pending','success','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int UNSIGNED NOT NULL,
  `page_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `keywords` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `page_name`, `section_name`, `section_title`, `section_content`, `title`, `description`, `keywords`, `status`, `created_at`, `updated_at`) VALUES
(1, 'home', 'banner', 'banner_title', 'Create your Digital Business Card', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(2, 'home', 'banner', 'banner_description', 'GoBiz is a Digital Business Card Maker. You can create your own digital vcard to attract your customers.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(3, 'home', 'banner', 'banner_button_1', 'Sign up now', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(4, 'home', 'banner', 'banner_button_1_link', '/login', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(5, 'home', 'banner', 'banner_button_2', 'How it works', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(6, 'home', 'banner', 'banner_button_2_link', '#how-it-works', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(7, 'home', 'works', 'work_mini_title', 'How it works?', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(8, 'home', 'works', 'work_title', 'Create, share & get more customers', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(9, 'home', 'works', 'work_description', 'Register a new account, create your own digital business card, share your unique link and get more customers.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(10, 'home', 'works', 'work_li_title_1', 'The ability to add and update contact details, such as name, phone number, email, website, and social media profiles', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(11, 'home', 'works', 'work_li_title_2', 'Sharing Options', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(12, 'home', 'works', 'work_li_title_3', 'Options to share the digital business card via email, social media, text message, or other communication channels.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(13, 'home', 'works', 'work_card_title_1', 'Photo gallery', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(14, 'home', 'works', 'work_card_description_1', 'You can show case your product images on your business card.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(15, 'home', 'works', 'work_card_title_2', 'Services Listing', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(16, 'home', 'works', 'work_card_description_2', 'You can list your services with explaination content and enquiry button.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(17, 'home', 'works', 'work_card_title_3', 'Save vCard', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(18, 'home', 'works', 'work_card_description_3', 'Visitor can save your phone number as vCard file format.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(19, 'home', 'works', 'work_card_title_4', 'Best for Businesses', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(20, 'home', 'works', 'work_card_description_4', 'GoBiz Digital Business cards will help you to transform your card visitors into customers.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(21, 'home', 'features', 'feature_mini_title', 'Why Digital Business Card?', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(22, 'home', 'features', 'feature_title', 'vCard Features', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(23, 'home', 'features', 'feature_card_title_1', 'WhatsApp Enabled', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(24, 'home', 'features', 'feature_card_description_1', 'You can enable and disable WhatsApp Chat Feature in your digital business card.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(25, 'home', 'features', 'feature_card_description_2', 'Photo Gallery', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(26, 'home', 'features', 'feature_card_description_2', 'You can upload product photos or any business related photos in your gallery section.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(27, 'home', 'features', 'feature_card_description_3', 'Services Section', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(28, 'home', 'features', 'feature_card_description_3', 'You can list your all services with image and description in this section.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(29, 'home', 'features', 'feature_card_description_4', 'Payment Details', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(30, 'home', 'features', 'feature_card_description_4', 'You can list your all accepted payment methods in your digital business card.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(31, 'home', 'features', 'feature_card_description_5', 'Business Hours', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(32, 'home', 'features', 'feature_card_description_5', 'You can display your business opening hours. Your customer can easily understand when you are available.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(33, 'home', 'features', 'feature_card_description_6', 'YouTube Link Integraion', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(34, 'home', 'features', 'feature_card_description_6', 'You can integrate your YouTube Link with your digital business card.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(35, 'home', 'features', 'feature_card_description_7', 'Google Maps Integraion', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(36, 'home', 'features', 'feature_card_description_7', 'You can display your shop / business location in google maps. Visitors can easily find you.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(37, 'home', 'features', 'feature_card_description_8', 'Social Media Links', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(38, 'home', 'features', 'feature_card_description_8', 'Your all social media presence in one digital business card. Stay connect with your customers.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(39, 'home', 'features', 'feature_card_description_9', 'Modern Theme', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(40, 'home', 'features', 'feature_card_description_9', 'We used modern theme for user interface. It is fully responsive.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(41, 'home', 'features', 'feature_card_description_10', 'Clean UI Design', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(42, 'home', 'features', 'feature_card_description_10', 'We creafted all designs professionally. It made with latest frameworks.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(43, 'home', 'features', 'feature_card_description_11', 'Faster Loading', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(44, 'home', 'features', 'feature_card_description_11', 'We give more importance for page load. Your digital card load faster than normal webpages.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(45, 'home', 'features', 'feature_card_description_12', 'Unique Link', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(46, 'home', 'features', 'feature_card_description_12', 'Your name or business whatever it is. You can generate your business card link as per your choice.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(47, 'home', 'pricing', 'pricing_mini_title', 'Pricing', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(48, 'home', 'pricing', 'pricing_title', 'Choose your best plan', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(49, 'home', 'pricing', 'pricing_subtitle', 'Good investments will gives you 10x more revenue.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(50, 'faq', 'faq', 'faq_title', 'Frequently Asked Question', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(51, 'faq', 'faq', 'faq_description', 'The most common questions about how our business works and what can do for you.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(52, 'faq', 'faq', 'faq_question_1', 'How Long is this site live?', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(53, 'faq', 'faq', 'faq_answer_1', 'Laboris qui labore cillum culpa in sunt quis sint veniam. Dolore ex aute deserunt esse ipsum elit aliqua. Aute quis minim velit nostrud pariatur culpa magna in aute.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(54, 'faq', 'faq', 'faq_question_2', 'Can I install/upload anything I want on there?', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(55, 'faq', 'faq', 'faq_answer_2', 'Laboris qui labore cillum culpa in sunt quis sint veniam. Dolore ex aute deserunt esse ipsum elit aliqua. Aute quis minim velit nostrud pariatur culpa magna in aute.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(56, 'faq', 'faq', 'faq_question_3', 'How can I migrate to another site?', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(57, 'faq', 'faq', 'faq_answer_3', 'Laboris qui labore cillum culpa in sunt quis sint veniam. Dolore ex aute deserunt esse ipsum elit aliqua. Aute quis minim velit nostrud pariatur culpa magna in aute.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(58, 'faq', 'faq', 'faq_question_4', 'Can I change the domain you give me?', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(59, 'faq', 'faq', 'faq_answer_4', 'Laboris qui labore cillum culpa in sunt quis sint veniam. Dolore ex aute deserunt esse ipsum elit aliqua. Aute quis minim velit nostrud pariatur culpa magna in aute.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(60, 'faq', 'faq', 'faq_question_5', 'How many sites I can create at once?', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(61, 'faq', 'faq', 'faq_answer_5', 'Laboris qui labore cillum culpa in sunt quis sint veniam. Dolore ex aute deserunt esse ipsum elit aliqua. Aute quis minim velit nostrud pariatur culpa magna in aute.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(62, 'faq', 'faq', 'faq_question_6', 'How can I communicate with you?', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(63, 'faq', 'faq', 'faq_answer_6', 'Laboris qui labore cillum culpa in sunt quis sint veniam. Dolore ex aute deserunt esse ipsum elit aliqua. Aute quis minim velit nostrud pariatur culpa magna in aute.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(64, 'footer support email', 'support', 'support_email', 'support@gobiz.co.in', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(65, 'privacy', 'privacy', 'privacy_title', 'Privacy Policy for GoBiz', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(66, 'privacy', 'privacy', 'privacy_content_description', 'At GoBiz, accessible from https://gobiz.goapps.online/, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by GoBiz and how we use it.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(67, 'privacy', 'privacy', 'privacy_content_description', 'If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(68, 'privacy', 'privacy', 'privacy_content_description', 'This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in GoBiz. This policy is not applicable to any information collected offline or via channels other than this website.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(69, 'privacy', 'privacy', 'privacy_content_title', 'Consent', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(70, 'privacy', 'privacy', 'privacy_content_description', 'By using our website, you hereby consent to our Privacy Policy and agree to its terms.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(71, 'privacy', 'privacy', 'privacy_content_title', 'Information we collect', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(72, 'privacy', 'privacy', 'privacy_content_description', 'The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(73, 'privacy', 'privacy', 'privacy_content_description', 'If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(74, 'privacy', 'privacy', 'privacy_content_description', 'When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(75, 'privacy', 'privacy', 'privacy_content_title', 'How we use your information', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(76, 'privacy', 'privacy', 'privacy_content_description', 'We use the information we collect in various ways, including to:', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(77, 'privacy', 'privacy', 'privacy_content_description', '\r\n            1. Provide, operate, and maintain our website\r\n            2. Improve, personalize, and expand our website\r\n            3. Understand and analyze how you use our website\r\n            4. Develop new products, services, features, and functionality\r\n            5. Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes\r\n            6. Send you emails\r\n            7. Find and prevent fraud\r\n            ', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32');
INSERT INTO `pages` (`id`, `page_name`, `section_name`, `section_title`, `section_content`, `title`, `description`, `keywords`, `status`, `created_at`, `updated_at`) VALUES
(78, 'privacy', 'privacy', 'privacy_content_title', 'Log Files', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(79, 'privacy', 'privacy', 'privacy_content_description', 'GoBiz follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services analytics.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(80, 'privacy', 'privacy', 'privacy_content_description', 'The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users movement on the website, and gathering demographic information.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(81, 'privacy', 'privacy', 'privacy_content_title', 'Cookies and Web Beacons', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(82, 'privacy', 'privacy', 'privacy_content_description', 'Like any other website, GoBiz uses cookies. These cookies are used to store information including visitors preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users experience by customizing our web page content based on visitors browser type and/or other information.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(83, 'privacy', 'privacy', 'privacy_content_description', 'For more general information on cookies, please read \"What Are Cookies\".', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(84, 'privacy', 'privacy', 'privacy_content_title', 'Advertising Partners Privacy Policies', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(85, 'privacy', 'privacy', 'privacy_content_description', 'You may consult this list to find the Privacy Policy for each of the advertising partners of GoBiz.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(86, 'privacy', 'privacy', 'privacy_content_description', 'Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on GoBiz, which are sent directly to users browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(87, 'privacy', 'privacy', 'privacy_content_description', 'Note that GoBiz has no access to or control over these cookies that are used by third-party advertisers.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(88, 'privacy', 'privacy', 'privacy_content_title', 'Third Party Privacy Policies', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(89, 'privacy', 'privacy', 'privacy_content_description', 'GoBizs Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(90, 'privacy', 'privacy', 'privacy_content_description', 'You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers respective websites.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(91, 'privacy', 'privacy', 'privacy_content_title', 'CCPA Privacy Rights (Do Not Sell My Personal Information)', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(92, 'privacy', 'privacy', 'privacy_content_description', 'Under the CCPA, among other rights, California consumers have the right to:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(93, 'privacy', 'privacy', 'privacy_content_description', 'Request that a business that collects a consumers personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(94, 'privacy', 'privacy', 'privacy_content_description', 'Request that a business delete any personal data about the consumer that a business has collected.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(95, 'privacy', 'privacy', 'privacy_content_description', 'Request that a business that sells a consumers personal data, not sell the consumers personal data.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(96, 'privacy', 'privacy', 'privacy_content_description', 'If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(97, 'privacy', 'privacy', 'privacy_content_title', 'GDPR Data Protection Rights', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(98, 'privacy', 'privacy', 'privacy_content_description', 'We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(99, 'privacy', 'privacy', 'privacy_content_description', 'The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(100, 'privacy', 'privacy', 'privacy_content_description', 'The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(101, 'privacy', 'privacy', 'privacy_content_description', 'The right to erasure – You have the right to request that we erase your personal data, under certain conditions.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(102, 'privacy', 'privacy', 'privacy_content_description', 'The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(103, 'privacy', 'privacy', 'privacy_content_description', 'The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(104, 'privacy', 'privacy', 'privacy_content_description', 'The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(105, 'privacy', 'privacy', 'privacy_content_description', 'If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(106, 'privacy', 'privacy', 'privacy_content_title', 'Childrens Information', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(107, 'privacy', 'privacy', 'privacy_content_description', 'Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(108, 'privacy', 'privacy', 'privacy_content_description', 'GoBiz does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(109, 'terms', 'terms', 'term_content_title', 'Terms and Conditions', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(110, 'terms', 'terms', 'term_content_description', 'Welcome to GoBiz!', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(111, 'terms', 'terms', 'term_content_description', 'These terms and conditions outline the rules and regulations for the use of GoBizs Website, located at https://gobiz.goapps.online/.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(112, 'terms', 'terms', 'term_content_description', 'By accessing this website we assume you accept these terms and conditions. Do not continue to use GoBiz if you do not agree to take all of the terms and conditions stated on this page.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(113, 'terms', 'terms', 'term_content_description', 'The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: \"Client\", \"You\" and \"Your\" refers to you, the person log on this website and compliant to the Company’s terms and conditions. \"The Company\", \"Ourselves\", \"We\", \"Our\" and \"Us\", refers to our Company. \"Party\", \"Parties\", or \"Us\", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(114, 'terms', 'terms', 'term_content_title', 'Cookies', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(115, 'terms', 'terms', 'term_content_description', 'We employ the use of cookies. By accessing GoBiz, you agreed to use cookies in agreement with the GoBizs Privacy Policy.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(116, 'terms', 'terms', 'term_content_description', 'Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(117, 'terms', 'terms', 'term_content_title', 'License', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(118, 'terms', 'terms', 'term_content_description', 'Unless otherwise stated, GoBiz and/or its licensors own the intellectual property rights for all material on GoBiz. All intellectual property rights are reserved. You may access this from GoBiz for your own personal use subjected to restrictions set in these terms and conditions.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(119, 'terms', 'terms', 'term_content_description', 'You must not:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(120, 'terms', 'terms', 'term_content_description', '\r\n            1. Republish material from GoBiz\r\n            2. Sell, rent or sub-license material from GoBiz\r\n            3. Reproduce, duplicate or copy material from GoBiz\r\n            4. Redistribute content from GoBiz\r\n            ', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(121, 'terms', 'terms', 'term_content_description', 'This Agreement shall begin on the date hereof.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(122, 'terms', 'terms', 'term_content_description', 'Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. GoBiz does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of GoBiz,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, GoBiz shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(123, 'terms', 'terms', 'term_content_description', 'GoBiz reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(124, 'terms', 'terms', 'term_content_description', 'You warrant and represent that:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(125, 'terms', 'terms', 'term_content_description', '1. You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;\r\n            2. The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;\r\n            3. The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy\r\n            4. The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(126, 'terms', 'terms', 'term_content_description', 'You hereby grant GoBiz a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(127, 'terms', 'terms', 'term_content_title', 'Hyperlinking to our Content', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(128, 'terms', 'terms', 'term_content_description', 'The following organizations may link to our Website without prior written approval:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(129, 'terms', 'terms', 'term_content_description', '1. Government agencies;\r\n            2. Search engines;\r\n            3. News organizations;\r\n            4. Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and\r\n            5. System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(130, 'terms', 'terms', 'term_content_description', 'These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party’s site.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(131, 'terms', 'terms', 'term_content_description', 'We may consider and approve other link requests from the following types of organizations:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(132, 'terms', 'terms', 'term_content_description', '1. commonly-known consumer and/or business information sources;\r\n            2. dot.com community sites;\r\n            3. associations or other groups representing charities;\r\n            4. online directory distributors;\r\n            5. internet portals;\r\n            6. accounting, law and consulting firms; and\r\n            7. educational institutions and trade associations.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(133, 'terms', 'terms', 'term_content_description', 'We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of GoBiz; and (d) the link is in the context of general resource information.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(134, 'terms', 'terms', 'term_content_description', 'These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party’s site.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(135, 'terms', 'terms', 'term_content_description', 'If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to GoBiz. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(136, 'terms', 'terms', 'term_content_description', 'Approved organizations may hyperlink to our Website as follows:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(137, 'terms', 'terms', 'term_content_description', '1. By use of our corporate name; or\r\n            2. By use of the uniform resource locator being linked to; or\r\n            3. By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party’s site.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(138, 'terms', 'terms', 'term_content_description', 'No use of GoBizs logo or other artwork will be allowed for linking absent a trademark license agreement.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(139, 'terms', 'terms', 'term_content_title', 'iFrames', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(140, 'terms', 'terms', 'term_content_description', 'Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(141, 'terms', 'terms', 'term_content_title', 'Content Liability', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(142, 'terms', 'terms', 'term_content_description', 'We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(143, 'terms', 'terms', 'term_content_title', 'Reservation of Rights', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(144, 'terms', 'terms', 'term_content_description', 'We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(145, 'terms', 'terms', 'term_content_title', 'Removal of links from our website', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(146, 'terms', 'terms', 'term_content_description', 'If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(147, 'terms', 'terms', 'term_content_description', 'We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(148, 'terms', 'terms', 'term_content_title', 'Disclaimer', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(149, 'terms', 'terms', 'term_content_description', 'To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(150, 'terms', 'terms', 'term_content_description', '1. limit or exclude our or your liability for death or personal injury;\r\n            2. limit or exclude our or your liability for fraud or fraudulent misrepresentation;\r\n            3. limit any of our or your liabilities in any way that is not permitted under applicable law; or\r\n            4. exclude any of our or your liabilities that may not be excluded under applicable law.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(151, 'terms', 'terms', 'term_content_description', 'The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(152, 'terms', 'terms', 'term_content_description', 'As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(153, 'footer', 'footer', 'social-facebook', '#', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(154, 'footer', 'footer', 'social-twitter', '#', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(155, 'footer', 'footer', 'social-instagram', '#', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(156, 'footer', 'footer', 'social-linkedIn', '#', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(157, 'refund', 'refund', 'refund-title', 'Return and Refund Policy', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(158, 'refund', 'refund', 'refund-desc', 'Last updated: August 20, 2021', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(159, 'refund', 'refund', 'desc', 'Thank you for shopping at GoBiz.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(160, 'refund', 'refund', 'desc', 'If, for any reason, You are not completely satisfied with a purchase We invite You to review our policy on refunds and returns.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(161, 'refund', 'refund', 'desc', 'The following terms are applicable for any products that You purchased with Us.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(162, 'refund', 'refund', 'desc', 'Interpretation and Definitions', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(163, 'refund', 'refund', 'desc', 'Interpretation', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(164, 'refund', 'refund', 'desc', 'The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(165, 'refund', 'refund', 'desc', 'Definitions', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(166, 'refund', 'refund', 'desc', 'For the purposes of this Return and Refund Policy:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(167, 'refund', 'refund', 'desc', '1. Company referred to as either the Company We, Us or Our in this Agreement) refers to GoBiz, Chennai.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(168, 'refund', 'refund', 'desc', '2. Goods refer to the items offered for sale on the Service.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(169, 'refund', 'refund', 'desc', '3. Orders mean a request by You to purchase Goods from Us.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(170, 'refund', 'refund', 'desc', '4. Service refers to the Website.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(171, 'refund', 'refund', 'desc', '5. Website refers to GoBiz, accessible from https://gobiz.goapps.online', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(172, 'refund', 'refund', 'desc', '6. You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(173, 'refund', 'refund', 'desc', 'Your Order Cancellation Rights', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(174, 'refund', 'refund', 'desc', 'You are entitled to cancel Your Order within 7 days without giving any reason for doing so.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(175, 'refund', 'refund', 'desc', 'The deadline for cancelling an Order is 7 days from the date on which You received the Goods or on which a third party you have appointed, who is not the carrier, takes possession of the product delivered.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(176, 'refund', 'refund', 'desc', 'In order to exercise Your right of cancellation, You must inform Us of your decision by means of a clear statement. You can inform us of your decision by:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(177, 'refund', 'refund', 'desc', 'By email: support@nativecode.in', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(178, 'refund', 'refund', 'desc', 'We will reimburse You no later than 14 days from the day on which We receive the returned Goods. We will use the same means of payment as You used for the Order, and You will not incur any fees for such reimbursement.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(179, 'refund', 'refund', 'desc', 'Conditions for Returns', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(180, 'refund', 'refund', 'desc', 'In order for the Goods to be eligible for a return, please make sure that:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(181, 'refund', 'refund', 'desc', '1. The Goods were purchased in the last 7 days', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(182, 'refund', 'refund', 'desc', 'The following Goods cannot be returned:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(183, 'refund', 'refund', 'desc', '1. The supply of Goods made to Your specifications or clearly personalized.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(184, 'refund', 'refund', 'desc', '2. The supply of Goods which according to their nature are not suitable to be returned, deteriorate rapidly or where the date of expiry is over.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(185, 'refund', 'refund', 'desc', '3. The supply of Goods which are not suitable for return due to health protection or hygiene reasons and were unsealed after delivery.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(186, 'refund', 'refund', 'desc', '4. The supply of Goods which are, after delivery, according to their nature, inseparably mixed with other items.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(187, 'refund', 'refund', 'desc', 'We reserve the right to refuse returns of any merchandise that does not meet the above return conditions in our sole discretion.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(188, 'refund', 'refund', 'desc', 'Only regular priced Goods may be refunded. Unfortunately, Goods on sale cannot be refunded. This exclusion may not apply to You if it is not permitted by applicable law.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(189, 'refund', 'refund', 'desc', 'Returning Goods', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(190, 'refund', 'refund', 'desc', 'You are responsible for the cost and risk of returning the Goods to Us. You should send the Goods at the following address:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(191, 'refund', 'refund', 'desc', 'Chennai,\r\n            Tamilnadu, 600028\r\n            India', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(192, 'refund', 'refund', 'desc', 'We cannot be held responsible for Goods damaged or lost in return shipment. Therefore, We recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the Goods or proof of received return delivery.', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(193, 'refund', 'refund', 'desc', 'Contact Us', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(194, 'refund', 'refund', 'desc', 'If you have any questions about our Returns and Refunds Policy, please contact us:', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(195, 'refund', 'refund', 'desc', 'By email: support@domain.com', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(196, 'contact', 'contact', 'page_name', 'Contact', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(197, 'contact', 'contact', 'page_subtitle', 'Got any question? Let’s talk about it.', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(198, 'contact', 'contact', 'page_section_1', 'Office', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(199, 'contact', 'contact', 'page_section_1_content_1', '359 Hidden', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(200, 'contact', 'contact', 'page_section_1_content_2', 'Valley Road, NY', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(201, 'contact', 'contact', 'page_section_2', 'Contacts', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(202, 'contact', 'contact', 'page_section_2_content_1', 'hello@gmail.com', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(203, 'contact', 'contact', 'page_section_2_content_1', '+48 698 033 101', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(204, 'contact', 'contact', 'page_section_3', 'Socials', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(205, 'about', 'about', 'about_content_title', 'About us', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(206, 'about', 'about', 'about_content_description', 'Welcome to GoBiz!', 'Vcard and WhatsApp Store for Your Business - All-in-One Solution', 'Get a Vcard and WhatsApp Store for your business to streamline your customer interactions. Our all-in-one solution helps you manage your contacts, share your business information, and sell your products. Start now and grow your business with ease!', 'Vcard, WhatsApp Store, business, customer interactions, all-in-one solution, contacts management, business information sharing, product selling.', 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(207, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(208, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(209, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(210, 'about', 'about', 'about_content_title', 'About the company', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(211, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(212, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(213, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(214, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(215, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(216, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(217, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(218, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(219, 'about', 'about', 'about_content_description', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorum. Id labore nulla ullam eius, dolor maxime quas repudiandae officia doloribus debitis eos reprehenderit odit!', NULL, NULL, NULL, 'active', '2025-06-09 22:16:32', '2025-06-09 22:16:32');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int UNSIGNED NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `card_id`, `type`, `icon`, `label`, `content`, `position`, `status`, `created_at`, `updated_at`) VALUES
(1, '684761d3646f6', 'url', 'fab fa-amazon-pay', 'Pago', 'https://cavernatecnologica.com', '1', '1', '2025-06-09 20:38:19', '2025-06-09 20:38:19');

-- --------------------------------------------------------

--
-- Table structure for table `pending_user_emails`
--

CREATE TABLE `pending_user_emails` (
  `id` bigint UNSIGNED NOT NULL,
  `user_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int UNSIGNED NOT NULL,
  `plan_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `plan_price` double(15,2) NOT NULL,
  `commission_rate` decimal(5,2) DEFAULT '5.00' COMMENT 'Comisión por venta (porcentaje)',
  `validity` bigint NOT NULL,
  `trial` int DEFAULT '0',
  `no_of_vcards` bigint DEFAULT NULL,
  `no_of_services` bigint DEFAULT NULL,
  `no_of_vcard_products` bigint DEFAULT NULL,
  `no_of_links` bigint DEFAULT NULL,
  `no_of_payments` bigint DEFAULT NULL,
  `no_of_galleries` bigint DEFAULT NULL,
  `no_testimonials` bigint DEFAULT NULL,
  `business_hours` tinyint(1) NOT NULL DEFAULT '1',
  `contact_form` tinyint(1) NOT NULL DEFAULT '1',
  `appointment` tinyint(1) NOT NULL DEFAULT '1',
  `custom_domain` tinyint(1) NOT NULL DEFAULT '0',
  `nfc_card` bigint NOT NULL DEFAULT '0',
  `no_of_enquires` bigint DEFAULT NULL,
  `no_of_stores` bigint DEFAULT NULL,
  `no_of_categories` bigint DEFAULT NULL,
  `no_of_store_products` bigint DEFAULT NULL,
  `pwa` tinyint(1) NOT NULL DEFAULT '1',
  `password_protected` tinyint(1) NOT NULL DEFAULT '0',
  `advanced_settings` tinyint(1) NOT NULL DEFAULT '0',
  `storage` bigint DEFAULT NULL,
  `additional_tools` tinyint(1) NOT NULL DEFAULT '0',
  `personalized_link` tinyint(1) NOT NULL DEFAULT '0',
  `hide_branding` tinyint(1) NOT NULL DEFAULT '0',
  `free_setup` tinyint(1) NOT NULL DEFAULT '0',
  `free_support` tinyint(1) NOT NULL DEFAULT '1',
  `recommended` tinyint(1) NOT NULL DEFAULT '0',
  `is_private` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `plan_id`, `plan_type`, `plan_name`, `plan_description`, `plan_price`, `commission_rate`, `validity`, `trial`, `no_of_vcards`, `no_of_services`, `no_of_vcard_products`, `no_of_links`, `no_of_payments`, `no_of_galleries`, `no_testimonials`, `business_hours`, `contact_form`, `appointment`, `custom_domain`, `nfc_card`, `no_of_enquires`, `no_of_stores`, `no_of_categories`, `no_of_store_products`, `pwa`, `password_protected`, `advanced_settings`, `storage`, `additional_tools`, `personalized_link`, `hide_branding`, `free_setup`, `free_support`, `recommended`, `is_private`, `status`, `created_at`, `updated_at`) VALUES
(1, '60673288f0d35', 'BOTH', 'Beginner', 'Nullam diam arcu, sodales quis convallis sit amet, sagittis varius ligula.', 0.00, 5.00, 30, 0, 1, 5, 5, 5, 5, 5, 5, 1, 1, 0, 0, 0, 10, 1, 2, 5, 1, 0, 1, 100, 0, 1, 0, 1, 1, 0, 0, 2, '2025-06-09 22:16:32', '2025-06-17 14:24:21'),
(2, '606732aa4fb58', 'BOTH', 'Intermediate', 'Nullam diam arcu, sodales quis convallis sit amet, sagittis varius ligula.', 24.00, 5.00, 30, 0, 5, 10, 10, 10, 10, 10, 10, 1, 1, 1, 0, 1, 100, 5, 5, 100, 1, 1, 1, 100, 0, 1, 1, 0, 1, 0, 0, 2, '2025-06-09 22:16:32', '2025-06-17 14:24:24'),
(3, '606732cb4ec9b', 'BOTH', 'Professional', 'Nullam diam arcu, sodales quis convallis sit amet, sagittis varius ligula.', 48.00, 5.00, 30, 0, 999, 999, 999, 999, 999, 999, 999, 1, 1, 1, 1, 1, 999, 999, 999, 999, 1, 1, 1, 100, 0, 1, 1, 1, 1, 0, 0, 2, '2025-06-09 22:16:32', '2025-06-17 14:24:27'),
(4, '6851972806ff9', 'VCARD', 'Testing', 'Esto es un plan de prueba', 10.00, 5.00, 30, 0, 2, 2, 2, 5, 2, 5, 5, 0, 1, 0, 1, 1, 0, NULL, NULL, NULL, 1, 1, 1, 100, 0, 1, 1, 1, 1, 1, 0, 1, '2025-06-17 14:26:16', '2025-06-22 18:14:30'),
(5, '6851975abff2b', 'VCARD', 'Testing 2', 'Planes sin comisiones', 30.00, 0.00, 30, 0, 5, 5, 5, 10, 5, 5, 10, 1, 1, 1, 0, 0, 0, NULL, NULL, NULL, 0, 1, 1, 100, 0, 1, 0, 1, 1, 0, 0, 1, '2025-06-17 14:27:06', '2025-06-17 14:27:06');

-- --------------------------------------------------------

--
-- Table structure for table `product_orders`
--

CREATE TABLE `product_orders` (
  `id` bigint NOT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `buyer_email` varchar(255) DEFAULT NULL,
  `buyer_name` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `stripe_session_id` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `referrals`
--

CREATE TABLE `referrals` (
  `id` int UNSIGNED NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referred_user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_registered` tinyint(1) NOT NULL DEFAULT '0',
  `is_subscribed` tinyint(1) NOT NULL DEFAULT '0',
  `referral_scheme` json NOT NULL,
  `earning_type` enum('referral','product_sale','service_sale') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'referral',
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `referrals`
--

INSERT INTO `referrals` (`id`, `user_id`, `referred_user_id`, `is_registered`, `is_subscribed`, `referral_scheme`, `earning_type`, `status`, `created_at`, `updated_at`) VALUES
(1, '684d41ea87467', '', 1, 1, '{\"item_name\": \"Test Product\", \"sale_date\": \"2025-06-14\", \"commission_rate\": \"5%\", \"original_amount\": 20.0, \"referral_amount\": 19.0, \"platform_commission\": 1.0}', 'product_sale', 1, '2025-06-14 21:30:20', '2025-06-14 21:30:20'),
(2, '684d41ea87467', '', 1, 1, '{\"item_name\": \"Test Service\", \"sale_date\": \"2025-06-14\", \"commission_rate\": \"5%\", \"original_amount\": 30.0, \"referral_amount\": 28.5, \"platform_commission\": 1.5}', 'service_sale', 1, '2025-06-14 21:30:20', '2025-06-14 21:30:20'),
(3, '684d41ea87467', '', 1, 1, '{\"item_name\": \"Premium Course\", \"sale_date\": \"2025-06-14\", \"commission_rate\": \"5%\", \"original_amount\": 50.0, \"referral_amount\": 47.5, \"platform_commission\": 2.5}', 'product_sale', 1, '2025-06-14 21:36:49', '2025-06-14 21:36:49'),
(4, '684d41ea87467', '', 1, 1, '{\"item_name\": \"1:1 Coaching\", \"sale_date\": \"2025-06-14\", \"commission_rate\": \"5%\", \"original_amount\": 100.0, \"referral_amount\": 95.0, \"platform_commission\": 5.0}', 'service_sale', 1, '2025-06-14 21:36:49', '2025-06-14 21:36:49'),
(5, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"20\", \"item_name\": \"Mentorias\", \"sale_date\": \"2025-06-14 22:13:50\", \"commission_rate\": \"5.00%\", \"original_amount\": 20, \"referral_amount\": 19, \"payment_intent_id\": \"pi_3Ra2KXIIBS14AMq30W5H6yOf\", \"platform_commission\": 1}', 'service_sale', 1, '2025-06-14 20:13:50', '2025-06-14 20:13:50'),
(6, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"19\", \"item_name\": \"Finanzas\", \"sale_date\": \"2025-06-14 22:14:05\", \"commission_rate\": \"5.00%\", \"original_amount\": 15, \"referral_amount\": 14.25, \"payment_intent_id\": \"pi_3Ra2KlIIBS14AMq31vJeuTXY\", \"platform_commission\": 0.75}', 'product_sale', 1, '2025-06-14 20:14:05', '2025-06-14 20:14:05'),
(7, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"20\", \"item_name\": \"Mentorias\", \"sale_date\": \"2025-06-14 22:15:14\", \"commission_rate\": \"5.00%\", \"original_amount\": 20, \"referral_amount\": 19, \"payment_intent_id\": \"pi_3Ra2LtIIBS14AMq31SOrU7ZK\", \"platform_commission\": 1}', 'service_sale', 1, '2025-06-14 20:15:14', '2025-06-14 20:15:14'),
(8, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"20\", \"item_name\": \"Mentorias\", \"sale_date\": \"2025-06-14 22:46:31\", \"commission_rate\": \"5.00%\", \"original_amount\": 20, \"referral_amount\": 19, \"payment_intent_id\": \"pi_3Ra1ukIIBS14AMq303cJn1lg\", \"platform_commission\": 1}', 'service_sale', 1, '2025-06-14 20:46:31', '2025-06-14 20:46:31'),
(9, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"19\", \"item_name\": \"Finanzas\", \"sale_date\": \"2025-06-14 22:48:14\", \"commission_rate\": \"5.00%\", \"original_amount\": 15, \"referral_amount\": 14.25, \"payment_intent_id\": \"pi_3Ra1voIIBS14AMq30dC7Ui1X\", \"platform_commission\": 0.75}', 'product_sale', 1, '2025-06-14 20:48:14', '2025-06-14 20:48:14'),
(10, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"19\", \"item_name\": \"Finanzas\", \"sale_date\": \"2025-06-14 22:53:39\", \"commission_rate\": \"5.00%\", \"original_amount\": 15, \"referral_amount\": 14.25, \"payment_intent_id\": \"pi_3Ra21xIIBS14AMq30WFz0VFk\", \"platform_commission\": 0.75}', 'product_sale', 1, '2025-06-14 20:53:39', '2025-06-14 20:53:39'),
(11, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"20\", \"item_name\": \"Mentorias\", \"sale_date\": \"2025-06-14 22:54:53\", \"commission_rate\": \"5.00%\", \"original_amount\": 20, \"referral_amount\": 19, \"payment_intent_id\": \"pi_3Ra21dIIBS14AMq31C51HL6s\", \"platform_commission\": 1}', 'service_sale', 1, '2025-06-14 20:54:53', '2025-06-14 20:54:53'),
(12, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"20\", \"item_name\": \"Mentorias\", \"sale_date\": \"2025-06-15 12:34:41\", \"commission_rate\": \"5.00%\", \"original_amount\": 20, \"referral_amount\": 19, \"payment_intent_id\": \"pi_3RaFlaIIBS14AMq30VrC2sr4\", \"platform_commission\": 1}', 'service_sale', 1, '2025-06-15 10:34:41', '2025-06-15 10:34:41'),
(13, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"20\", \"item_name\": \"Mentorias\", \"sale_date\": \"2025-06-15 12:36:01\", \"commission_rate\": \"5.00%\", \"original_amount\": 20, \"referral_amount\": 19, \"payment_intent_id\": \"pi_3RaFmtIIBS14AMq31zUFrudP\", \"platform_commission\": 1}', 'service_sale', 1, '2025-06-15 10:36:01', '2025-06-15 10:36:01'),
(14, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"20\", \"item_name\": \"Mentorias\", \"sale_date\": \"2025-06-15 12:55:00\", \"commission_rate\": \"5.00%\", \"original_amount\": 20, \"referral_amount\": 19, \"payment_intent_id\": \"pi_3RaG59IIBS14AMq30TbR2t4q\", \"platform_commission\": 1}', 'service_sale', 1, '2025-06-15 10:55:00', '2025-06-15 10:55:00'),
(15, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"21\", \"item_name\": \"Consultas\", \"sale_date\": \"2025-06-17 20:58:40\", \"commission_rate\": \"5.00%\", \"original_amount\": 50, \"referral_amount\": 47.5, \"payment_intent_id\": \"pi_3Rb6aOIIBS14AMq30ZgE8PKR\", \"platform_commission\": 2.5}', 'service_sale', 1, '2025-06-17 18:58:40', '2025-06-17 18:58:40'),
(16, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"21\", \"item_name\": \"Consultas\", \"sale_date\": \"2025-06-17 21:16:28\", \"commission_rate\": \"5.00%\", \"original_amount\": 50, \"referral_amount\": 47.5, \"payment_intent_id\": \"pi_3Rb6rcIIBS14AMq30fKI426t\", \"platform_commission\": 2.5}', 'service_sale', 1, '2025-06-17 19:16:28', '2025-06-17 19:16:28'),
(17, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"20\", \"item_name\": \"Curso Digital\", \"sale_date\": \"2025-06-17 21:30:03\", \"commission_rate\": \"5.00%\", \"original_amount\": 25, \"referral_amount\": 23.75, \"payment_intent_id\": \"pi_3Rb74nIIBS14AMq30jBmKE2g\", \"platform_commission\": 1.25}', 'product_sale', 1, '2025-06-17 19:30:03', '2025-06-17 19:30:03'),
(18, '68475dc954ad5', NULL, 1, 1, '{\"item_id\": \"20\", \"item_name\": \"Curso Digital\", \"sale_date\": \"2025-06-17 21:44:29\", \"commission_rate\": \"5.00%\", \"original_amount\": 25, \"referral_amount\": 23.75, \"payment_intent_id\": \"pi_3Rb7IlIIBS14AMq31nZNsMhx\", \"platform_commission\": 1.25}', 'product_sale', 1, '2025-06-17 19:44:29', '2025-06-17 19:44:29');

-- --------------------------------------------------------

--
-- Table structure for table `referral_withdraw_requests`
--

CREATE TABLE `referral_withdraw_requests` (
  `id` int UNSIGNED NOT NULL,
  `referral_withdraw_request_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `bank_details` json NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payment_status` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `referral_withdraw_requests`
--

INSERT INTO `referral_withdraw_requests` (`id`, `referral_withdraw_request_id`, `user_id`, `amount`, `bank_details`, `notes`, `payment_status`, `status`, `created_at`, `updated_at`) VALUES
(1, 'REQ297410884465530622251870', '68475dc954ad5', 52.25, '\"<p>ES12 1234 1234 1234 12334</p>\"', 'Solicito un retiro, de prueba', 1, 1, '2025-06-14 20:29:38', '2025-06-14 20:33:03');

-- --------------------------------------------------------

--
-- Table structure for table `referral_withdraw_transactions`
--

CREATE TABLE `referral_withdraw_transactions` (
  `id` int UNSIGNED NOT NULL,
  `referral_withdraw_request_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `transfer_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payment_status` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` bigint UNSIGNED NOT NULL,
  `role_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `role_slug`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin', NULL, NULL),
(2, 'User', 'user', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int UNSIGNED NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `enable_enquiry` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `card_id`, `service_name`, `service_image`, `service_description`, `price`, `currency`, `enable_enquiry`, `status`, `created_at`, `updated_at`) VALUES
(1, '684761d3646f6', 'Serivio de pago', 'images/68475dc954ad5-68476272f0985.png', 'Mi primer servicio', 0.00, 'USD', 'Disabled', '1', '2025-06-09 20:39:10', '2025-06-09 20:39:10'),
(2, '68486e2777417', 'Maquillaje pro', 'https://images.unsplash.com/photo-1503236823255-94609f598e71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw0fHxtYWtlfGVufDB8MHx8fDE3NDk1NjExMjh8MA&ixlib=rb-4.1.0&q=80&w=1080', 'Para maquilllar', 0.00, 'USD', 'Enabled', '1', '2025-06-10 16:03:17', '2025-06-10 16:03:17'),
(3, '68486e2777417', 'Maquillaje pro', 'https://images.unsplash.com/photo-1503236823255-94609f598e71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw0fHxtYWtlfGVufDB8MHx8fDE3NDk1NjExMjh8MA&ixlib=rb-4.1.0&q=80&w=1080', 'Para maquilllar', 0.00, 'USD', 'Enabled', '1', '2025-06-10 16:04:35', '2025-06-10 16:04:35'),
(4, '68489dcbcdb95', 'prueba', 'https://images.unsplash.com/photo-1593614201641-6f16f8e41a4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyfHxtYWtpfGVufDB8MHx8fDE3NDk1ODk0NjV8MA&ixlib=rb-4.1.0&q=80&w=1080', 'prueba', 0.00, 'USD', 'Enabled', '1', '2025-06-10 19:04:36', '2025-06-10 19:04:36'),
(5, '6848b203bab8e', 'prueba 2', 'https://images.unsplash.com/photo-1455637350775-730a9e5a8310?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyNnx8aGFwcHl8ZW58MHwwfHx8MTc0OTU5NDY0Mnww&ixlib=rb-4.1.0&q=80&w=1080', 'pruebas 2', 0.00, 'USD', 'Enabled', '1', '2025-06-10 20:31:12', '2025-06-10 20:31:12'),
(6, '6848b203bab8e', 'prueba 2', 'https://images.unsplash.com/photo-1458172594959-b57570af4d0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwzfHxsYW1wfGVufDB8MHx8fDE3NDk1OTQ2NTR8MA&ixlib=rb-4.1.0&q=80&w=1080', 'prueba 2', 0.00, 'USD', 'Enabled', '1', '2025-06-10 20:31:12', '2025-06-10 20:31:12'),
(7, '6848c3c0ed312', 'Servicios de maquillaje', 'https://images.unsplash.com/photo-1646640727046-57cdf6e9a577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyfHxzZXJ2aWNpb3N8ZW58MHwwfHx8MTc0OTU5OTE3OHww&ixlib=rb-4.1.0&q=80&w=1080', 'servicios', 0.00, 'USD', 'Enabled', '1', '2025-06-10 21:46:32', '2025-06-10 21:46:32'),
(8, '6848c9bb3abd8', 'Servicios de maquillaje', 'https://images.unsplash.com/photo-1601783667247-8ced00ce94b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwzMHx8c2VydmljaW98ZW58MHwwfHx8MTc0OTYwMzA0OHww&ixlib=rb-4.1.0&q=80&w=1080', 'Servicio de prueba', 0.00, 'USD', 'Disabled', '1', '2025-06-10 22:51:01', '2025-06-10 22:51:01'),
(9, '684a83bb9488a', 'Servicios de maquillaje', 'https://images.unsplash.com/photo-1694800626799-75f210b1030a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwzfHxzZXJ2aWNpb3N8ZW58MHwwfHx8MTc0OTcxMzg2NXww&ixlib=rb-4.1.0&q=80&w=1080', 'prueba', 20.00, 'USD', 'Disabled', '1', '2025-06-12 05:40:22', '2025-06-12 05:40:22'),
(10, '684a951cce2a0', 'Nombre del servicio', 'https://images.unsplash.com/photo-1646640727046-57cdf6e9a577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyfHxzZXJ2aWNpb3N8ZW58MHwwfHx8MTc0OTcxMzg2NXww&ixlib=rb-4.1.0&q=80&w=1080', 'Descripcion del servicio', 20.00, 'USD', 'Disabled', '1', '2025-06-12 06:52:41', '2025-06-12 06:52:41'),
(11, '684af7a916852', 'noimbre de servicios', 'https://images.unsplash.com/photo-1605152276897-4f618f831968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyfHxzZXJ2aWNpb3xlbnwwfDB8fHwxNzQ5NzQzNTM5fDA&ixlib=rb-4.1.0&q=80&w=1080', 'descricion servicio', 20.00, 'USD', 'Disabled', '1', '2025-06-12 13:55:37', '2025-06-12 13:55:37'),
(13, '684b013b7a0c1', 'nombre de servicio', 'https://images.unsplash.com/photo-1694800626799-75f210b1030a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwzfHxzZXJ2aWNpb3N8ZW58MHwwfHx8MTc0OTcxMzg2NXww&ixlib=rb-4.1.0&q=80&w=1080', 'Dexripcion', 20.00, 'USD', 'Disabled', '1', '2025-06-12 14:34:25', '2025-06-12 14:34:25'),
(14, '684b106b1f1ca', 'Nombre de servicio', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwxfHxzZXJ2aWNpb3N8ZW58MHwwfHx8MTc0OTcxMzg2NXww&ixlib=rb-4.1.0&q=80&w=1080', 'Descripcion de servicio', 20.00, 'USD', 'Disabled', '1', '2025-06-12 15:38:14', '2025-06-12 15:38:14'),
(20, '684d41ea87467', 'Mentorias', 'https://images.unsplash.com/photo-1641189684174-16e53d9cc829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw2fHxtZW50b3JpYXxlbnwwfDB8fHwxNzQ5ODkzNjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'Mentoria financiera 1 hora', 20.00, 'USD', 'Disabled', '1', '2025-06-14 07:34:45', '2025-06-14 07:34:45'),
(21, '6851d1e43a2dc', 'Consultas', 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwyfHxsaW1waWV6YXxlbnwwfDB8fHwxNzUwMTkyNjIzfDA&ixlib=rb-4.1.0&q=80&w=1080', 'Consultoria', 50.00, 'USD', 'Disabled', '1', '2025-06-17 18:37:41', '2025-06-17 18:37:41'),
(22, '687e028d5d758', 'nAME SERVICE', 'images/68475dc954ad5-684b13bc6fe5f.jpg', 'MY FIRST PRODUCT', 0.00, 'USD', 'Disabled', '1', '2025-07-21 07:06:45', '2025-07-21 07:06:45');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int UNSIGNED NOT NULL,
  `google_key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_analytics_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_adsense_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `site_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `site_logo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `favicon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tawk_chat_bot_key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom_css` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `custom_scripts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `google_key`, `google_analytics_id`, `google_adsense_code`, `site_name`, `site_logo`, `favicon`, `tawk_chat_bot_key`, `custom_css`, `custom_scripts`, `status`, `created_at`, `updated_at`) VALUES
(1, '', NULL, NULL, 'Tu creador de tienda', '/images/web/elements/68519c3b4b33e.png', '/images/web/elements/68519c3b4bf4b.png', NULL, '', '', '1', '2025-06-09 22:16:32', '2025-06-17 15:31:55');

-- --------------------------------------------------------

--
-- Table structure for table `store_business_hours`
--

CREATE TABLE `store_business_hours` (
  `id` int UNSIGNED NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_hours_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_hours` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `store_categories`
--

CREATE TABLE `store_categories` (
  `id` int UNSIGNED NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `store_orders`
--

CREATE TABLE `store_orders` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_item` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_method` enum('order for delivery','take away','dine in') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'order for delivery',
  `delivery_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cash',
  `payment_trans_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_total` double NOT NULL,
  `invoice_prefix` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payment_status` enum('pending','processing','paid','failed','cancelled','refunded','partially_refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `order_status` enum('pending','processing','shipped','out for delivery','delivered','cancelled','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `order_notes` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `store_products`
--

CREATE TABLE `store_products` (
  `id` int UNSIGNED NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `badge` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `product_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_short_description` text COLLATE utf8mb4_unicode_ci,
  `product_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `regular_price` decimal(15,2) DEFAULT NULL,
  `sales_price` decimal(15,2) NOT NULL,
  `product_status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int UNSIGNED NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewer_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewer_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `review_subtext` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `review` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `card_id`, `reviewer_image`, `reviewer_name`, `review_subtext`, `review`, `status`, `created_at`, `updated_at`) VALUES
(1, '684d41ea87467', 'images/68475dc954ad5-684b13bc6fe5f.jpg', 'Jhon Doe', 'Un libro en toda regla, estupendo', 'RECOMENDADO', '1', '2025-06-14 07:36:48', '2025-06-14 07:36:48'),
(2, '6851d1e43a2dc', 'images/68475dc954ad5-684b13bc6fe5f.jpg', 'Alejandro', 'RECOMENDADO', 'Es muy bueno el servicio, me gusta mucho', '1', '2025-06-17 19:35:41', '2025-06-17 19:35:41');

-- --------------------------------------------------------

--
-- Table structure for table `themes`
--

CREATE TABLE `themes` (
  `id` int UNSIGNED NOT NULL,
  `theme_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme_thumbnail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme_description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme_price` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `themes`
--

INSERT INTO `themes` (`id`, `theme_id`, `theme_code`, `theme_thumbnail`, `theme_name`, `theme_description`, `theme_price`, `status`, `created_at`, `updated_at`) VALUES
(1, '588969111070', 'modern-store-light-blue', 'modern-store-light-blue.png', 'Modern Blue Light', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(2, '588969111071', 'modern-store-light-indigo', 'modern-store-light-indigo.png', 'Modern Indigo Light', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(3, '588969111072', 'modern-store-light-green', 'modern-store-light-green.png', 'Modern Green Light', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(4, '588969111073', 'modern-store-light-yellow', 'modern-store-light-yellow.png', 'Modern Yellow Light', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(5, '588969111074', 'modern-store-light-red', 'modern-store-light-red.png', 'Modern Red Light', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(6, '588969111075', 'modern-store-light-purple', 'modern-store-light-purple.png', 'Modern Purple Light', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(7, '588969111076', 'modern-store-light-pink', 'modern-store-light-pink.png', 'Modern Pink Light', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(8, '588969111077', 'modern-store-light-gray', 'modern-store-light-gray.png', 'Modern Gray Light', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(9, '588969111078', 'modern-store-dark-blue', 'modern-store-dark-blue.png', 'Modern Blue Dark', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(10, '588969111079', 'modern-store-dark-indigo', 'modern-store-dark-indigo.png', 'Modern Indigo Dark', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(11, '588969111080', 'modern-store-dark-green', 'modern-store-dark-green.png', 'Modern Green Dark', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(12, '588969111081', 'modern-store-dark-yellow', 'modern-store-dark-yellow.png', 'Modern Yellow Dark', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(13, '588969111082', 'modern-store-dark-red', 'modern-store-dark-red.png', 'Modern Red Dark', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(14, '588969111083', 'modern-store-dark-purple', 'modern-store-dark-purple.png', 'Modern Purple Dark', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(15, '588969111084', 'modern-store-dark-pink', 'modern-store-dark-pink.png', 'Modern Pink Dark', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(16, '588969111085', 'modern-store-dark-gray', 'modern-store-dark-gray.png', 'Modern Gray Dark', 'WhatsApp Store', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(17, '588969110990', 'template-1-blue', 'template-1-blue.png', 'Basic Blue', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(18, '588969110991', 'template-1-indigo', 'template-1-indigo.png', 'Basic Indigo', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(19, '588969110992', 'template-1-green', 'template-1-green.png', 'Basic Green', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(20, '588969110993', 'template-1-yellow', 'template-1-yellow.png', 'Basic Yellow', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(21, '588969110994', 'template-1-red', 'template-1-red.png', 'Basic Red', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(22, '588969110995', 'template-1-purple', 'template-1-purple.png', 'Basic Purple', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(23, '588969110996', 'template-1-pink', 'template-1-pink.png', 'Basic Pink', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(24, '588969110997', 'template-1-gray', 'template-1-gray.png', 'Basic Gray', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(25, '588969110998', 'template-2-blue', 'template-2-blue.png', 'Flat Blue', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(26, '588969110999', 'template-2-indigo', 'template-2-indigo.png', 'Flat Indigo', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(27, '588969111000', 'template-2-green', 'template-2-green.png', 'Flat Green', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(28, '588969111001', 'template-2-yellow', 'template-2-yellow.png', 'Flat Yellow', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(29, '588969111002', 'template-2-red', 'template-2-red.png', 'Flat Red', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(30, '588969111003', 'template-2-purple', 'template-2-purple.png', 'Flat Purple', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(31, '588969111004', 'template-2-pink', 'template-2-pink.png', 'Flat Pink', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(32, '588969111005', 'template-2-gray', 'template-2-gray.png', 'Flat Gray', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(33, '588969111006', 'template-3-blue', 'template-3-blue.png', 'Retro Blue', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(34, '588969111007', 'template-3-indigo', 'template-3-indigo.png', 'Retro Indigo', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(35, '588969111008', 'template-3-green', 'template-3-green.png', 'Retro Green', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(36, '588969111009', 'template-3-yellow', 'template-3-yellow.png', 'Retro Yellow', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(37, '588969111010', 'template-3-red', 'template-3-red.png', 'Retro Red', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(38, '588969111011', 'template-3-purple', 'template-3-purple.png', 'Retro Purple', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(39, '588969111012', 'template-3-pink', 'template-3-pink.png', 'Retro Pink', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(40, '588969111013', 'template-3-gray', 'template-3-gray.png', 'Retro Gray', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(41, '588969111014', 'personal-blue', 'personal-blue.png', 'Personal Blue', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(42, '588969111015', 'personal-indigo', 'personal-indigo.png', 'Personal Indigo', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(43, '588969111016', 'personal-green', 'personal-green.png', 'Personal Green', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(44, '588969111017', 'personal-yellow', 'personal-yellow.png', 'Personal Yellow', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(45, '588969111018', 'personal-red', 'personal-red.png', 'Personal Red', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(46, '588969111019', 'personal-purple', 'personal-purple.png', 'Personal Purple', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(47, '588969111020', 'personal-pink', 'personal-pink.png', 'Personal Pink', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(48, '588969111021', 'personal-gray', 'personal-gray.png', 'Personal Gray', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(49, '588969111022', 'modern-vcard-light-blue', 'modern-light-blue.png', 'Modern Blue Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(50, '588969111023', 'modern-vcard-light-indigo', 'modern-light-indigo.png', 'Modern Indigo Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(51, '588969111024', 'modern-vcard-light-green', 'modern-light-green.png', 'Modern Green Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(52, '588969111025', 'modern-vcard-light-yellow', 'modern-light-yellow.png', 'Modern Yellow Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(53, '588969111026', 'modern-vcard-light-red', 'modern-light-red.png', 'Modern Red Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(54, '588969111027', 'modern-vcard-light-purple', 'modern-light-purple.png', 'Modern Purple Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(55, '588969111028', 'modern-vcard-light-pink', 'modern-light-pink.png', 'Modern Pink Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(56, '588969111029', 'modern-vcard-light-gray', 'modern-light-gray.png', 'Modern Gray Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(57, '588969111030', 'modern-vcard-dark-blue', 'modern-dark-blue.png', 'Modern Blue Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(58, '588969111031', 'modern-vcard-dark-indigo', 'modern-dark-indigo.png', 'Modern Indigo Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(59, '588969111032', 'modern-vcard-dark-green', 'modern-dark-green.png', 'Modern Green Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(60, '588969111033', 'modern-vcard-dark-yellow', 'modern-dark-yellow.png', 'Modern Yellow Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(61, '588969111034', 'modern-vcard-dark-red', 'modern-dark-red.png', 'Modern Red Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(62, '588969111035', 'modern-vcard-dark-purple', 'modern-dark-purple.png', 'Modern Purple Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(63, '588969111036', 'modern-vcard-dark-pink', 'modern-dark-pink.png', 'Modern Pink Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(64, '588969111037', 'modern-vcard-dark-gray', 'modern-dark-gray.png', 'Modern Gray Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(65, '588969111038', 'classic-light-blue', 'classic-light-blue.png', 'Classic Blue Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(66, '588969111039', 'classic-light-indigo', 'classic-light-indigo.png', 'Classic Indigo Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(67, '588969111040', 'classic-light-green', 'classic-light-green.png', 'Classic Green Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(68, '588969111041', 'classic-light-yellow', 'classic-light-yellow.png', 'Classic Yellow Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(69, '588969111042', 'classic-light-red', 'classic-light-red.png', 'Classic Red Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(70, '588969111043', 'classic-light-purple', 'classic-light-purple.png', 'Classic Purple Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(71, '588969111044', 'classic-light-pink', 'classic-light-pink.png', 'Classic Pink Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(72, '588969111045', 'classic-light-gray', 'classic-light-gray.png', 'Classic Gray Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(73, '588969111046', 'classic-dark-blue', 'classic-dark-blue.png', 'Classic Blue Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(74, '588969111047', 'classic-dark-indigo', 'classic-dark-indigo.png', 'Classic Indigo Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(75, '588969111048', 'classic-dark-green', 'classic-dark-green.png', 'Classic Green Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(76, '588969111049', 'classic-dark-yellow', 'classic-dark-yellow.png', 'Classic Yellow Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(77, '588969111050', 'classic-dark-red', 'classic-dark-red.png', 'Classic Red Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(78, '588969111051', 'classic-dark-purple', 'classic-dark-purple.png', 'Classic Purple Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(79, '588969111052', 'classic-dark-pink', 'classic-dark-pink.png', 'Classic Pink Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(80, '588969111053', 'classic-dark-gray', 'classic-dark-gray.png', 'Classic Gray Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(81, '588969111054', 'metro-light-blue', 'metro-light-blue.png', 'Metro Blue Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(82, '588969111055', 'metro-light-indigo', 'metro-light-indigo.png', 'Metro Indigo Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(83, '588969111056', 'metro-light-green', 'metro-light-green.png', 'Metro Green Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(84, '588969111057', 'metro-light-yellow', 'metro-light-yellow.png', 'Metro Yellow Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(85, '588969111058', 'metro-light-red', 'metro-light-red.png', 'Metro Red Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(86, '588969111059', 'metro-light-purple', 'metro-light-purple.png', 'Metro Purple Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(87, '588969111060', 'metro-light-pink', 'metro-light-pink.png', 'Metro Pink Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(88, '588969111061', 'metro-light-gray', 'metro-light-gray.png', 'Metro Gray Light', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(89, '588969111062', 'metro-dark-blue', 'metro-dark-blue.png', 'Metro Blue Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(90, '588969111063', 'metro-dark-indigo', 'metro-dark-indigo.png', 'Metro Indigo Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(91, '588969111064', 'metro-dark-green', 'metro-dark-green.png', 'Metro Green Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(92, '588969111065', 'metro-dark-yellow', 'metro-dark-yellow.png', 'Metro Yellow Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(93, '588969111066', 'metro-dark-red', 'metro-dark-red.png', 'Metro Red Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(94, '588969111067', 'metro-dark-purple', 'metro-dark-purple.png', 'Metro Purple Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(95, '588969111068', 'metro-dark-pink', 'metro-dark-pink.png', 'Metro Pink Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(96, '588969111069', 'metro-dark-gray', 'metro-dark-gray.png', 'Metro Gray Dark', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(97, '588969111094', 'premium-1', 'premium-1.png', 'Elite Red', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(98, '588969111095', 'lime-blue', 'lime-blue.png', 'Gradient Lime', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(99, '588969111093', 'ultra-premium-pink', 'ultra-premium-pink.png', 'Neo Pink', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(100, '588969111092', 'ultra-premium-red', 'ultra-premium-red.png', 'Neo Red', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(101, '588969111091', 'ultra-premium-indigo', 'ultra-premium-indigo.png', 'Neo Indigo', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(102, '588969111090', 'ultra-premium-black', 'ultra-premium-black.png', 'Neo Black', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(103, '588969111089', 'premium-pink', 'premium-pink.png', 'Urban Pink', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(104, '588969111088', 'premium-red', 'premium-red.png', 'Urban Red', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(105, '588969111087', 'premium-indigo', 'premium-indigo.png', 'Urban Indigo', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(106, '588969111086', 'premium-black', 'premium-black.png', 'Urban Black', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(107, '588969111125', 'makeup', 'makeup-artist.png', 'Makeup Artist', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(108, '588969111126', 'chef', 'chef.png', 'Chef', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(109, '588969111127', 'developer', 'developer.png', 'Developer', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(110, '588969111128', 'lawyer', 'lawyer.png', 'Lawyer', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(111, '588969111129', 'doctor', 'doctor.png', 'Doctor', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(112, '588969111130', 'spa', 'spa.png', 'Spa', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(113, '588969111131', 'interior', 'interior.png', 'Interior', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(114, '588969111133', 'gym', 'gym.png', 'Gym', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(115, '588969111132', 'architect', 'architect.png', 'Architect', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(116, '588969111134', 'yoga', 'yoga.png', 'Yoga', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(117, '588969111135', 'taxi', 'taxi.png', 'Taxi', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(118, '588969111136', 'restaurant', 'restaurant.png', 'Restaurant', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(119, '588969111137', 'wedding-1', 'wedding-1.png', 'Wedding-1', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(120, '588969111138', 'wedding-2', 'wedding-2.png', 'Wedding-2', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(121, '588969111139', 'school', 'school.png', 'School', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(122, '588969111140', 'youtuber', 'youtuber.png', 'Youtuber', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(123, '588969111142', 'love', 'love.png', 'Love', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(124, '588969111141', 'instagram-influencer', 'instagram-influencer.png', 'Instagram Influencer', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(125, '588969111143', 'tiktoker', 'tiktoker.png', 'TikToker', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(126, '588969111144', 'musician', 'musician.png', 'Musician', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(127, '588969111145', 'photographer', 'photographer.png', 'Photographer', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(128, '588969111146', 'flowershop', 'flowershop.png', 'Flower Shop', 'vCard', 'Free', '1', '2025-06-09 22:16:32', '2025-06-09 22:16:32'),
(129, '588969111147', 'custom', 'custom.png', 'Custom', 'vCard', 'Free', '1', '2025-06-22 20:10:34', '2025-06-22 20:10:34'),
(130, '588969111148', 'travel-agency', 'travel_agency.png', 'Travel Agency', 'vCard', 'Free', '1', '2025-06-22 20:10:34', '2025-06-22 20:10:34'),
(131, '588969111149', 'cosmetics', 'cosmetics.png', 'Cosmetics', 'WhatsApp Store', 'Free', '1', '2025-06-22 20:10:34', '2025-06-22 20:10:34'),
(132, '588969111150', 'jewellery-shop', 'jewellery-shop.png', 'Jewellery Shop', 'WhatsApp Store', 'Free', '1', '2025-06-22 20:10:34', '2025-06-22 20:10:34'),
(133, '588969111151', 'fashion', 'fashion.png', 'Fashion', 'WhatsApp Store', 'Free', '1', '2025-06-22 20:10:34', '2025-06-22 20:10:34');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int UNSIGNED NOT NULL,
  `gobiz_transaction_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_date` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `desciption` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_gateway_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_currency` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_amount` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_prefix` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `gobiz_transaction_id`, `transaction_date`, `transaction_id`, `user_id`, `plan_id`, `desciption`, `payment_gateway_name`, `transaction_currency`, `transaction_amount`, `invoice_number`, `invoice_prefix`, `invoice_details`, `payment_status`, `status`, `created_at`, `updated_at`) VALUES
(1, '68475dd4e2b65', '2025-06-09 22:19:00', '68475dd4e2b91', '2', '60673288f0d35', 'Beginner Plan', 'FREE', 'USD', '0', NULL, NULL, '{\"from_billing_name\":\"GoBiz\",\"from_billing_address\":\"123\",\"from_billing_city\":\"Chennai\",\"from_billing_state\":\"Tamilnadu\",\"from_billing_zipcode\":\"600001\",\"from_billing_country\":\"India\",\"from_vat_number\":\"SPN125553322\",\"from_billing_phone\":\"+919876543210\",\"from_billing_email\":\"sales@gobiz.goapps.online\",\"to_billing_name\":\"Junior testing\",\"to_billing_address\":null,\"to_billing_city\":null,\"to_billing_state\":null,\"to_billing_zipcode\":null,\"to_billing_country\":null,\"to_billing_phone\":null,\"to_billing_email\":\"featjunior@gmail.com\",\"to_vat_number\":null,\"tax_name\":\"Goods and Service Tax\",\"tax_type\":\"exclusive\",\"tax_value\":\"18\",\"invoice_amount\":0,\"subtotal\":0,\"tax_amount\":0}', 'SUCCESS', '1', '2025-06-09 20:19:00', '2025-06-09 20:19:00'),
(2, '6851ad9e7297e', '2025-06-17 18:02:06', 'pi_3Rb3piIIBS14AMq30DrHyhVQ', '2', '6851972806ff9', 'Testing Plan', 'Stripe', 'USD', '12.1', '1', 'INV-', '{\"from_billing_name\":\"Click My Link\",\"from_billing_address\":\"123\",\"from_billing_city\":\"Barcelona\",\"from_billing_state\":\"Barcelona\",\"from_billing_zipcode\":\"600001\",\"from_billing_country\":\"Espa\\u00f1a\",\"from_vat_number\":\"CIF\",\"from_billing_phone\":\"+34666666666\",\"from_billing_email\":\"sales@clickmy.link\",\"to_billing_name\":\"Junior testing\",\"to_billing_address\":\"Direcci\\u00f3n\",\"to_billing_city\":\"Madrid\",\"to_billing_state\":\"Esoala\",\"to_billing_zipcode\":\"\",\"to_billing_country\":\"Spain\",\"to_billing_phone\":\"\",\"to_billing_email\":\"featjunior@gmail.com\",\"to_vat_number\":\"\",\"subtotal\":10,\"tax_name\":\"IVA\",\"tax_type\":\"exclusive\",\"tax_value\":\"21\",\"tax_amount\":2.100000000000000088817841970012523233890533447265625,\"applied_coupon\":null,\"discounted_price\":0,\"invoice_amount\":12.0999999999999996447286321199499070644378662109375}', 'SUCCESS', '1', '2025-06-17 16:02:06', '2025-06-17 16:02:21'),
(3, '687defd7e5245', '2025-07-21 07:44:24', 'pi_3RnEOaIIBS14AMq31WhdDa5t', '2', '6851972806ff9', 'Testing Plan', 'Stripe', 'USD', '12.1', '2', 'INV-', '{\"from_billing_name\":\"Click My Link\",\"from_billing_address\":\"123\",\"from_billing_city\":\"Barcelona\",\"from_billing_state\":\"Barcelona\",\"from_billing_zipcode\":\"600001\",\"from_billing_country\":\"Espa\\u00f1a\",\"from_vat_number\":\"CIF\",\"from_billing_phone\":\"+34666666666\",\"from_billing_email\":\"sales@clickmy.link\",\"to_billing_name\":\"Junior testing\",\"to_billing_address\":\"Direcci\\u00f3n\",\"to_billing_city\":\"Madrid\",\"to_billing_state\":\"Esoala\",\"to_billing_zipcode\":\"\",\"to_billing_country\":\"Spain\",\"to_billing_phone\":\"\",\"to_billing_email\":\"featjunior@gmail.com\",\"to_vat_number\":\"\",\"subtotal\":10,\"tax_name\":\"IVA\",\"tax_type\":\"exclusive\",\"tax_value\":\"21\",\"tax_amount\":2.100000000000000088817841970012523233890533447265625,\"applied_coupon\":null,\"discounted_price\":0,\"invoice_amount\":12.0999999999999996447286321199499070644378662109375}', 'SUCCESS', '1', '2025-07-21 05:44:24', '2025-07-21 05:45:03');

-- --------------------------------------------------------

--
-- Table structure for table `translations`
--

CREATE TABLE `translations` (
  `id` int UNSIGNED NOT NULL,
  `language_id` int UNSIGNED NOT NULL,
  `group` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `key` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `choosed_theme` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'light',
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_id` bigint NOT NULL DEFAULT '2',
  `permissions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `auth_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `plan_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `term` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trial` int NOT NULL DEFAULT '0',
  `plan_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `plan_validity` datetime DEFAULT NULL,
  `plan_activation_date` timestamp NULL DEFAULT NULL,
  `billing_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vat_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `billing_city` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_state` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_zipcode` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_country` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int NOT NULL DEFAULT '1',
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `stripe_account_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stripe_onboarding_completed` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `choosed_theme`, `user_id`, `name`, `email`, `mobile_number`, `whatsapp_number`, `role_id`, `permissions`, `email_verified_at`, `password`, `auth_type`, `profile_image`, `plan_id`, `term`, `trial`, `plan_details`, `plan_validity`, `plan_activation_date`, `billing_name`, `type`, `vat_number`, `billing_address`, `billing_city`, `billing_state`, `billing_zipcode`, `billing_country`, `billing_phone`, `billing_email`, `bank_details`, `status`, `remember_token`, `created_at`, `updated_at`, `stripe_account_id`, `stripe_onboarding_completed`) VALUES
(1, 'light', '609c03880ee47', 'GoBiz', 'admin@admin.com', NULL, NULL, 1, '{\"coupons\":1,\"custom_domain\":1,\"marketing\":1,\"maintenance_mode\":1,\"demo_mode\":1,\"backup\":1,\"nfc_card_design\":1,\"nfc_card_orders\":1,\"nfc_card_order_transactions\":1,\"nfc_card_key_generations\":1,\"email_templates\":1,\"plugins\":1,\"referral_system\":1,\"blogs\":1,\"pages\":1,\"plans\":1,\"users\":1,\"themes\":1,\"sitemap\":1,\"customers\":1,\"invoice_tax\":1,\"transactions\":1,\"translations\":1,\"payment_methods\":1,\"software_update\":1,\"general_settings\":1}', NULL, '$2y$10$COgqIuniTdHfS6woppOyPOa8eDRGxnJKq0EaDKYIj3J1rmGpxJb0e', 'Email', NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-06-09 22:16:32', '2025-06-17 14:51:56', NULL, 0),
(2, 'light', '68475dc954ad5', 'Junior testing', 'featjunior@gmail.com', '', '', 2, NULL, '2025-06-09 20:18:49', '$2y$10$qe.1NX7fHR.sIq7herrwYOzUMkBuq426686.4Rhf9xkK3bQ81PW2a', 'Email', NULL, '6851972806ff9', '30', 0, '{\"id\":4,\"plan_id\":\"6851972806ff9\",\"plan_type\":\"VCARD\",\"plan_name\":\"Testing\",\"plan_description\":\"Esto es un plan de prueba\",\"plan_price\":10,\"commission_rate\":\"5.00\",\"validity\":30,\"trial\":0,\"no_of_vcards\":2,\"no_of_services\":2,\"no_of_vcard_products\":2,\"no_of_links\":5,\"no_of_payments\":2,\"no_of_galleries\":5,\"no_testimonials\":5,\"business_hours\":0,\"contact_form\":1,\"appointment\":0,\"custom_domain\":1,\"nfc_card\":1,\"no_of_enquires\":0,\"no_of_stores\":null,\"no_of_categories\":null,\"no_of_store_products\":null,\"pwa\":1,\"password_protected\":1,\"advanced_settings\":1,\"storage\":100,\"additional_tools\":0,\"personalized_link\":1,\"hide_branding\":1,\"free_setup\":1,\"free_support\":1,\"recommended\":1,\"is_private\":0,\"status\":1,\"created_at\":\"2025-06-17T16:26:16.000000Z\",\"updated_at\":\"2025-06-22T20:14:30.000000Z\"}', '2025-08-20 07:45:03', '2025-07-21 05:45:03', 'Junior testing', 'personal', '', 'Dirección', 'Madrid', 'Esoala', '', 'Spain', '', 'featjunior@gmail.com', '<p>ES12 1234 1234 1234 12334</p>', 1, NULL, '2025-06-09 20:18:49', '2025-07-21 05:45:03', NULL, 0),
(3, 'light', '685199ef8fd10', 'Alejandro', 'aletoh@gmail.com', NULL, NULL, 3, '{\"coupons\":1,\"custom_domain\":1,\"marketing\":1,\"maintenance_mode\":0,\"demo_mode\":0,\"backup\":0,\"nfc_card_design\":0,\"nfc_card_orders\":0,\"nfc_card_order_transactions\":0,\"nfc_card_key_generations\":0,\"email_templates\":1,\"plugins\":0,\"referral_system\":1,\"themes\":1,\"plans\":1,\"customers\":1,\"payment_methods\":1,\"transactions\":1,\"pages\":1,\"blogs\":1,\"users\":1,\"general_settings\":1,\"translations\":1,\"sitemap\":1,\"invoice_tax\":1,\"software_update\":0}', '2025-06-17 14:38:07', '$2y$10$S6WU7Qz/Bsp/VEvtTWNmseRVbyQRrkfQp.kKsy7bvrd9pfR01chhW', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-06-17 14:38:07', '2025-08-08 14:42:45', NULL, 0),
(4, 'light', '689c74dbb9493', 'Pablo Bon', 'pablobonillagiraldo@gmail.com', NULL, NULL, 2, NULL, '2025-08-13 09:19:55', '$2y$10$O9.JQa0OKuJCPPoqMdy46OaEFWp9aTyDbvVeSzLXMBWAU5k5epjQi', 'Email', NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-08-13 09:19:55', '2025-08-13 09:19:55', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `vcard_products`
--

CREATE TABLE `vcard_products` (
  `id` int UNSIGNED NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `badge` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `regular_price` double NOT NULL,
  `sales_price` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `stripe_product_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `digital_product_file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vcard_products`
--

INSERT INTO `vcard_products` (`id`, `card_id`, `product_id`, `badge`, `currency`, `product_image`, `product_name`, `product_description`, `regular_price`, `sales_price`, `created_at`, `updated_at`, `stripe_product_id`, `digital_product_file`) VALUES
(1, '6848bb885567e', '6848c0de9d46a', 'Badge', 'EUR', 'https://images.unsplash.com/photo-1520399636535-24741e71b160?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw3fHxjb2FjaHxlbnwwfDB8fHwxNzQ5NTk4MzY1fDA&ixlib=rb-4.1.0&q=80&w=1080', 'nombre de producto', 'Pruducto subtitulo', 10, 10, '2025-06-10 21:33:50', '2025-06-10 21:33:50', NULL, NULL),
(2, '6848bb885567e', '6848c0de9d821', 'badge', 'EUR', 'https://images.unsplash.com/photo-1707409464190-026d1cc0bab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw2fHxsYW1wYXJhfGVufDB8MHx8fDE3NDk1OTg0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080', 'Nombre', 'Si subtitulo', 5, 20, '2025-06-10 21:33:50', '2025-06-10 21:33:50', NULL, NULL),
(3, '684a83bb9488a', 'test123', 'New', 'USD', 'https://via.placeholder.com/300', 'Test Product', 'Test Description', 10, 10, '2025-06-12 08:12:00', '2025-06-12 08:12:00', NULL, NULL),
(4, '684a951cce2a0', '684aa862daaa6', 'A la venta', 'EUR', 'https://images.unsplash.com/photo-1682915849577-00445f49cfe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwxNnx8cHJvZHVjdG98ZW58MHwwfHx8MTc0OTcxODQwM3ww&ixlib=rb-4.1.0&q=80&w=1080', 'Nombre de producto', 'Subtitulo de producto', 10, 20, '2025-06-12 08:13:54', '2025-06-12 08:13:54', NULL, NULL),
(5, '684af7a916852', '684af899ca70d', 'en venta', 'EUR', 'https://images.unsplash.com/photo-1654018334224-4887d9e85ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwxNXx8cHJvZHVjdG98ZW58MHwwfHx8MTc0OTcxODQwM3ww&ixlib=rb-4.1.0&q=80&w=1080', 'Nombre de producto', 'Titulo', 20, 10, '2025-06-12 13:56:09', '2025-06-12 13:56:09', NULL, NULL),
(6, '684af962179c2', '684afa17a2dca', 'En venta', 'EUR', 'images/68475dc954ad5-68487d9c0f750.png', 'Nombre de producto', 'Subtitulo de producto', 50, 25, '2025-06-12 14:02:31', '2025-06-12 14:02:31', NULL, NULL),
(7, '684b106b1f1ca', '684b10a5499d5', 'En venta', 'EUR', 'https://images.unsplash.com/photo-1535986057686-8302eb74360e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwxMHx8aW1hZ2VufGVufDB8MHx8fDE3NDk3NDk5MjF8MA&ixlib=rb-4.1.0&q=80&w=1080', 'Nombre de producto', 'Subtitulo de procuto', 50, 10, '2025-06-12 15:38:45', '2025-06-12 15:38:45', NULL, NULL),
(8, '684b106b1f1ca', '684b16fcda936', 'prudocto de prueba2', 'EUR', 'images/68475dc954ad5-68476272f0985.png', 'prudocto de prueba2', 'prudocto de prueba2', 50, 20, '2025-06-12 16:05:48', '2025-06-12 16:05:48', NULL, NULL),
(9, '684b29c30af53', '684b29fd89985', 'PRUEBA 3', 'EUR', 'https://images.unsplash.com/photo-1707589884842-a308e0d7d2e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHwxMXx8U0VSVklDSU98ZW58MHwwfHx8MTc0OTc1NjM3NXww&ixlib=rb-4.1.0&q=80&w=1080', 'PRUEBA 3', 'PRUEBA 3', 50, 20, '2025-06-12 17:26:53', '2025-06-12 17:26:53', NULL, NULL),
(10, '684b29c30af53', '684b29fd89d09', 'PRUEBA 4', 'EUR', 'images/68475dc954ad5-684af6254fc27.jpg', 'PRUEBA 4', 'PRUEBA 4', 80, 50, '2025-06-12 17:26:53', '2025-06-12 17:26:53', NULL, NULL),
(11, '684b29c30af53', '684b2b399bcd9', 'PRUEBA 4', 'EUR', 'images/68475dc954ad5-684af6254fc27.jpg', 'PRUEBA 5', 'PRUEBA 5', 80, 50, '2025-06-12 17:32:09', '2025-06-12 17:32:09', NULL, NULL),
(14, '684b49afc8f2b', '684b548c14a69', 'producto creado desde modal', 'EUR', 'images/68475dc954ad5-684b073171529.jpg', 'producto creado desde modal', 'producto creado desde modal', 50, 10, '2025-06-12 20:28:28', '2025-06-12 20:28:28', NULL, NULL),
(15, '684b49afc8f2b', '684d3010cf625', 'badge product', 'EUR', 'images/68475dc954ad5-684b5bf2c74b1.jpg', 'nombre de producto desde modal', 'nombre de producto desde modal', 50, 20, '2025-06-14 06:17:20', '2025-06-14 06:17:20', NULL, NULL),
(19, '684d41ea87467', '684d428986f06', 'El mas valorado', 'EUR', 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw5fHxsaWJyb3xlbnwwfDB8fHwxNzQ5ODkzNzExfDA&ixlib=rb-4.1.0&q=80&w=1080', 'Finanzas', 'Con este e-book de finanzas puedes aprender a mejorar tu situación financiera.', 80, 15, '2025-06-14 07:36:09', '2025-06-14 07:44:45', NULL, NULL),
(20, '6851d1e43a2dc', '6851d2384bfdf', 'Online', 'EUR', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTkxOTN8MHwxfHNlYXJjaHw1fHxkaWdpdGFsfGVufDB8MHx8fDE3NTAxOTI2ODd8MA&ixlib=rb-4.1.0&q=80&w=1080', 'Curso Digital', 'Esto es una prueba de un curso digital', 50, 25, '2025-06-17 18:38:16', '2025-06-17 18:38:16', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `visitors`
--

CREATE TABLE `visitors` (
  `id` int UNSIGNED NOT NULL,
  `card_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `device` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `visitors`
--

INSERT INTO `visitors` (`id`, `card_id`, `type`, `ip_address`, `device`, `platform`, `language`, `user_agent`, `status`, `created_at`, `updated_at`) VALUES
(1, '684a716a87168', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-12 05:23:23', '2025-06-12 05:23:23'),
(2, '684a83bb9488a', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-12 05:40:45', '2025-06-12 05:40:45'),
(3, '684a83bb9488a', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-12 05:51:26', '2025-06-12 05:51:26'),
(4, '684a83bb9488a', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-12 05:51:35', '2025-06-12 05:51:35'),
(5, '684a83bb9488a', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-12 06:32:34', '2025-06-12 06:32:34'),
(6, '684a83bb9488a', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 06:43:34', '2025-06-12 06:43:34'),
(7, '684a83bb9488a', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-12 06:46:08', '2025-06-12 06:46:08'),
(8, '684a951cce2a0', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-12 08:14:13', '2025-06-12 08:14:13'),
(9, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 08:39:43', '2025-06-12 08:39:43'),
(10, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 08:48:35', '2025-06-12 08:48:35'),
(11, '684a951cce2a0', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-12 08:49:28', '2025-06-12 08:49:28'),
(12, '684a951cce2a0', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-12 08:50:07', '2025-06-12 08:50:07'),
(13, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 09:08:45', '2025-06-12 09:08:45'),
(14, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 09:08:51', '2025-06-12 09:08:51'),
(15, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 09:10:56', '2025-06-12 09:10:56'),
(16, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 10:06:29', '2025-06-12 10:06:29'),
(17, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 10:10:54', '2025-06-12 10:10:54'),
(18, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:11:35', '2025-06-12 11:11:35'),
(19, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:12:50', '2025-06-12 11:12:50'),
(20, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:15:25', '2025-06-12 11:15:25'),
(21, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:17:23', '2025-06-12 11:17:23'),
(22, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:26:35', '2025-06-12 11:26:35'),
(23, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:28:16', '2025-06-12 11:28:16'),
(24, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:28:20', '2025-06-12 11:28:20'),
(25, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:28:23', '2025-06-12 11:28:23'),
(26, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:28:23', '2025-06-12 11:28:23'),
(27, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:28:23', '2025-06-12 11:28:23'),
(28, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:29:12', '2025-06-12 11:29:12'),
(29, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:29:17', '2025-06-12 11:29:17'),
(30, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:29:47', '2025-06-12 11:29:47'),
(31, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:29:59', '2025-06-12 11:29:59'),
(32, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:30:45', '2025-06-12 11:30:45'),
(33, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:31:29', '2025-06-12 11:31:29'),
(34, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:31:33', '2025-06-12 11:31:33'),
(35, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:32:21', '2025-06-12 11:32:21'),
(36, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:32:21', '2025-06-12 11:32:21'),
(37, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:32:21', '2025-06-12 11:32:21'),
(38, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:33:42', '2025-06-12 11:33:42'),
(39, '684a951cce2a0', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-12 11:33:42', '2025-06-12 11:33:42'),
(40, '684a951cce2a0', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-12 11:34:45', '2025-06-12 11:34:45'),
(41, '684ad9809812a', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-12 13:03:13', '2025-06-12 13:03:13'),
(42, '684d316c2de95', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-14 07:31:35', '2025-06-14 07:31:35'),
(43, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 07:38:23', '2025-06-14 07:38:23'),
(44, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 07:38:36', '2025-06-14 07:38:36'),
(45, '684d41ea87467', 'vcard', '213.94.50.249', 'Samsung', 'AndroidOS', 'es-es', 'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36', '1', '2025-06-14 07:39:34', '2025-06-14 07:39:34'),
(46, '684d41ea87467', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-14 07:40:19', '2025-06-14 07:40:19'),
(47, '684d41ea87467', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-14 07:40:51', '2025-06-14 07:40:51'),
(48, '684d41ea87467', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-14 07:42:47', '2025-06-14 07:42:47'),
(49, '684d41ea87467', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-14 07:43:02', '2025-06-14 07:43:02'),
(50, '684d41ea87467', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-14 07:45:27', '2025-06-14 07:45:27'),
(51, '684d41ea87467', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-14 07:45:31', '2025-06-14 07:45:31'),
(52, '684d41ea87467', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-14 08:00:16', '2025-06-14 08:00:16'),
(53, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 08:33:08', '2025-06-14 08:33:08'),
(54, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 09:17:30', '2025-06-14 09:17:30'),
(55, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 10:13:20', '2025-06-14 10:13:20'),
(56, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 10:14:01', '2025-06-14 10:14:01'),
(57, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 10:21:43', '2025-06-14 10:21:43'),
(58, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 10:22:54', '2025-06-14 10:22:54'),
(59, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 10:28:48', '2025-06-14 10:28:48'),
(60, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 10:46:21', '2025-06-14 10:46:21'),
(61, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:19:59', '2025-06-14 11:19:59'),
(62, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:21:16', '2025-06-14 11:21:16'),
(63, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:21:24', '2025-06-14 11:21:24'),
(64, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:21:45', '2025-06-14 11:21:45'),
(65, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:22:14', '2025-06-14 11:22:14'),
(66, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:22:30', '2025-06-14 11:22:30'),
(67, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:24:52', '2025-06-14 11:24:52'),
(68, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:25:08', '2025-06-14 11:25:08'),
(69, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:30:48', '2025-06-14 11:30:48'),
(70, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:31:20', '2025-06-14 11:31:20'),
(71, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:31:26', '2025-06-14 11:31:26'),
(72, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:35:00', '2025-06-14 11:35:00'),
(73, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:36:39', '2025-06-14 11:36:39'),
(74, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:36:55', '2025-06-14 11:36:55'),
(75, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:53:24', '2025-06-14 11:53:24'),
(76, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 11:53:39', '2025-06-14 11:53:39'),
(77, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:12:39', '2025-06-14 12:12:39'),
(78, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:12:58', '2025-06-14 12:12:58'),
(79, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:18:34', '2025-06-14 12:18:34'),
(80, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:19:27', '2025-06-14 12:19:27'),
(81, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:19:42', '2025-06-14 12:19:42'),
(82, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:24:49', '2025-06-14 12:24:49'),
(83, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:25:11', '2025-06-14 12:25:11'),
(84, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:25:20', '2025-06-14 12:25:20'),
(85, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:30:57', '2025-06-14 12:30:57'),
(86, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:32:13', '2025-06-14 12:32:13'),
(87, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:32:33', '2025-06-14 12:32:33'),
(88, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:32:53', '2025-06-14 12:32:53'),
(89, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:32:59', '2025-06-14 12:32:59'),
(90, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:33:16', '2025-06-14 12:33:16'),
(91, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:33:50', '2025-06-14 12:33:50'),
(92, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:37:24', '2025-06-14 12:37:24'),
(93, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:37:27', '2025-06-14 12:37:27'),
(94, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:38:11', '2025-06-14 12:38:11'),
(95, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:38:27', '2025-06-14 12:38:27'),
(96, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:38:44', '2025-06-14 12:38:44'),
(97, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:41:07', '2025-06-14 12:41:07'),
(98, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 12:59:06', '2025-06-14 12:59:06'),
(99, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 13:03:00', '2025-06-14 13:03:00'),
(100, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 13:06:18', '2025-06-14 13:06:18'),
(101, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 13:10:16', '2025-06-14 13:10:16'),
(102, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 13:57:28', '2025-06-14 13:57:28'),
(103, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 14:01:53', '2025-06-14 14:01:53'),
(104, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 14:44:51', '2025-06-14 14:44:51'),
(105, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 14:52:03', '2025-06-14 14:52:03'),
(106, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 14:52:36', '2025-06-14 14:52:36'),
(107, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 15:12:09', '2025-06-14 15:12:09'),
(108, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 15:14:53', '2025-06-14 15:14:53'),
(109, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 15:18:46', '2025-06-14 15:18:46'),
(110, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 15:25:36', '2025-06-14 15:25:36'),
(111, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 15:27:00', '2025-06-14 15:27:00'),
(112, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 15:33:50', '2025-06-14 15:33:50'),
(113, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 15:39:10', '2025-06-14 15:39:10'),
(114, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 15:40:03', '2025-06-14 15:40:03'),
(115, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 18:07:38', '2025-06-14 18:07:38'),
(116, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 18:08:14', '2025-06-14 18:08:14'),
(117, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 19:35:47', '2025-06-14 19:35:47'),
(118, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 19:36:04', '2025-06-14 19:36:04'),
(119, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 19:46:57', '2025-06-14 19:46:57'),
(120, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 19:48:05', '2025-06-14 19:48:05'),
(121, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 19:54:06', '2025-06-14 19:54:06'),
(122, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 19:54:27', '2025-06-14 19:54:27'),
(123, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 20:02:25', '2025-06-14 20:02:25'),
(124, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 20:02:40', '2025-06-14 20:02:40'),
(125, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 20:13:38', '2025-06-14 20:13:38'),
(126, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 20:13:52', '2025-06-14 20:13:52'),
(127, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-14 20:15:03', '2025-06-14 20:15:03'),
(128, '684d41ea87467', 'vcard', '213.94.50.249', 'WebKit', 'Windows', 'en-gb', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '1', '2025-06-15 06:20:41', '2025-06-15 06:20:41'),
(129, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 07:27:10', '2025-06-15 07:27:10'),
(130, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 07:28:00', '2025-06-15 07:28:00'),
(131, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 07:42:03', '2025-06-15 07:42:03'),
(132, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 07:42:19', '2025-06-15 07:42:19'),
(133, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 07:51:33', '2025-06-15 07:51:33'),
(134, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 07:59:45', '2025-06-15 07:59:45'),
(135, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 07:59:57', '2025-06-15 07:59:57'),
(136, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 08:01:28', '2025-06-15 08:01:28'),
(137, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 08:03:51', '2025-06-15 08:03:51'),
(138, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 08:08:00', '2025-06-15 08:08:00'),
(139, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 08:29:07', '2025-06-15 08:29:07'),
(140, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 08:29:16', '2025-06-15 08:29:16'),
(141, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 08:35:13', '2025-06-15 08:35:13'),
(142, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 08:39:58', '2025-06-15 08:39:58'),
(143, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 08:41:53', '2025-06-15 08:41:53'),
(144, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:04:53', '2025-06-15 09:04:53'),
(145, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:07:11', '2025-06-15 09:07:11'),
(146, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:10:32', '2025-06-15 09:10:32'),
(147, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:10:49', '2025-06-15 09:10:49'),
(148, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:16:06', '2025-06-15 09:16:06'),
(149, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:16:10', '2025-06-15 09:16:10'),
(150, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:17:13', '2025-06-15 09:17:13'),
(151, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:17:33', '2025-06-15 09:17:33'),
(152, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:18:04', '2025-06-15 09:18:04'),
(153, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:28:54', '2025-06-15 09:28:54'),
(154, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:29:09', '2025-06-15 09:29:09'),
(155, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:31:22', '2025-06-15 09:31:22'),
(156, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:32:55', '2025-06-15 09:32:55'),
(157, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:35:20', '2025-06-15 09:35:20'),
(158, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:36:47', '2025-06-15 09:36:47'),
(159, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:45:45', '2025-06-15 09:45:45'),
(160, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 09:51:19', '2025-06-15 09:51:19'),
(161, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 10:14:33', '2025-06-15 10:14:33'),
(162, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 10:16:33', '2025-06-15 10:16:33'),
(163, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 10:22:47', '2025-06-15 10:22:47'),
(164, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 10:32:23', '2025-06-15 10:32:23'),
(165, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 10:34:19', '2025-06-15 10:34:19'),
(166, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 10:35:48', '2025-06-15 10:35:48'),
(167, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 10:54:38', '2025-06-15 10:54:38'),
(168, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 10:55:09', '2025-06-15 10:55:09'),
(169, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 17:09:30', '2025-06-15 17:09:30'),
(170, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 17:55:17', '2025-06-15 17:55:17'),
(171, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 17:55:52', '2025-06-15 17:55:52'),
(172, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 21:55:13', '2025-06-15 21:55:13'),
(173, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 21:58:48', '2025-06-15 21:58:48'),
(174, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 22:00:41', '2025-06-15 22:00:41'),
(175, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 22:05:35', '2025-06-15 22:05:35'),
(176, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 22:05:52', '2025-06-15 22:05:52'),
(177, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 22:10:40', '2025-06-15 22:10:40'),
(178, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 22:14:43', '2025-06-15 22:14:43'),
(179, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 22:17:59', '2025-06-15 22:17:59'),
(180, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-15 22:18:18', '2025-06-15 22:18:18'),
(181, '684d41ea87467', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-16 13:38:24', '2025-06-16 13:38:24'),
(182, 'tarjeta-de-prueba-final', 'vcard', '31.221.240.189', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-17 18:38:27', '2025-06-17 18:38:27'),
(183, 'tarjeta-de-prueba-final', 'vcard', '31.221.240.189', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-17 18:39:10', '2025-06-17 18:39:10'),
(184, 'tarjeta-de-prueba-final', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-17 18:46:11', '2025-06-17 18:46:11'),
(185, 'tarjeta-de-prueba-final', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-17 18:58:02', '2025-06-17 18:58:02'),
(186, 'tarjeta-de-prueba-final', 'vcard', '31.221.240.189', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-17 18:58:21', '2025-06-17 18:58:21'),
(187, 'tarjeta-de-prueba-final', 'vcard', '31.221.240.189', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-17 19:00:29', '2025-06-17 19:00:29'),
(188, 'tarjeta-de-prueba-final', 'vcard', '31.221.240.189', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-17 19:16:10', '2025-06-17 19:16:10'),
(189, 'tarjeta-de-prueba-final', 'vcard', '31.221.240.189', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-17 19:29:44', '2025-06-17 19:29:44'),
(190, 'tarjeta-de-prueba-final', 'vcard', '31.221.240.189', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-17 19:42:34', '2025-06-17 19:42:34'),
(191, 'tarjeta-de-prueba-final', 'vcard', '31.221.240.189', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-17 19:42:59', '2025-06-17 19:42:59'),
(192, 'tarjeta-de-prueba-final', 'vcard', '149.154.161.202', 'Bot', '0', 'en-us', 'TelegramBot (like TwitterBot)', '1', '2025-06-17 19:46:14', '2025-06-17 19:46:14'),
(193, '685a3f5f76667', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-24 04:09:15', '2025-06-24 04:09:15'),
(194, '685a3f5f76667', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-24 04:12:23', '2025-06-24 04:12:23'),
(195, '685a3f5f76667', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0', '1', '2025-06-24 04:22:49', '2025-06-24 04:22:49'),
(196, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 01:04:22', '2025-06-25 01:04:22'),
(197, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 01:16:13', '2025-06-25 01:16:13'),
(198, '685b65e8d5cfc', 'vcard', '213.94.50.249', '0', 'Windows', 'es-es', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0', '1', '2025-06-25 02:07:05', '2025-06-25 02:07:05'),
(199, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 02:09:01', '2025-06-25 02:09:01'),
(200, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 02:09:23', '2025-06-25 02:09:23'),
(201, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 02:43:24', '2025-06-25 02:43:24'),
(202, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 02:43:47', '2025-06-25 02:43:47'),
(203, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 03:06:50', '2025-06-25 03:06:50'),
(204, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 03:40:59', '2025-06-25 03:40:59'),
(205, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 03:43:11', '2025-06-25 03:43:11'),
(206, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 03:44:15', '2025-06-25 03:44:15'),
(207, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 03:47:20', '2025-06-25 03:47:20'),
(208, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 03:47:50', '2025-06-25 03:47:50'),
(209, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 03:48:10', '2025-06-25 03:48:10'),
(210, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 03:52:14', '2025-06-25 03:52:14'),
(211, '685b65e8d5cfc', 'vcard', '35.214.145.168', '0', '0', 'en', 'curl/8.9.1', '1', '2025-06-25 20:02:23', '2025-06-25 20:02:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applied_coupons`
--
ALTER TABLE `applied_coupons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `backups`
--
ALTER TABLE `backups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `booked_appointments`
--
ALTER TABLE `booked_appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `business_cards`
--
ALTER TABLE `business_cards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `business_fields`
--
ALTER TABLE `business_fields`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `business_hours`
--
ALTER TABLE `business_hours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `campaign_emails`
--
ALTER TABLE `campaign_emails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `card_appointment_times`
--
ALTER TABLE `card_appointment_times`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_forms`
--
ALTER TABLE `contact_forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `custom_domain_requests`
--
ALTER TABLE `custom_domain_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gateways`
--
ALTER TABLE `gateways`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `health_check_result_history_items`
--
ALTER TABLE `health_check_result_history_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `health_check_result_history_items_created_at_index` (`created_at`),
  ADD KEY `health_check_result_history_items_batch_index` (`batch`);

--
-- Indexes for table `information_pops`
--
ALTER TABLE `information_pops`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medias`
--
ALTER TABLE `medias`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `newsletters`
--
ALTER TABLE `newsletters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nfc_card_designs`
--
ALTER TABLE `nfc_card_designs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nfc_card_keys`
--
ALTER TABLE `nfc_card_keys`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nfc_card_orders`
--
ALTER TABLE `nfc_card_orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nfc_card_order_transactions`
--
ALTER TABLE `nfc_card_order_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pending_user_emails`
--
ALTER TABLE `pending_user_emails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pending_user_emails_user_type_user_id_index` (`user_type`,`user_id`),
  ADD KEY `pending_user_emails_email_index` (`email`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_orders`
--
ALTER TABLE `product_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`);

--
-- Indexes for table `referrals`
--
ALTER TABLE `referrals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_earning_type` (`user_id`,`earning_type`);

--
-- Indexes for table `referral_withdraw_requests`
--
ALTER TABLE `referral_withdraw_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `referral_withdraw_transactions`
--
ALTER TABLE `referral_withdraw_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `store_business_hours`
--
ALTER TABLE `store_business_hours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `store_categories`
--
ALTER TABLE `store_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `store_orders`
--
ALTER TABLE `store_orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `store_products`
--
ALTER TABLE `store_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `themes`
--
ALTER TABLE `themes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `translations`
--
ALTER TABLE `translations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `translations_language_id_foreign` (`language_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `vcard_products`
--
ALTER TABLE `vcard_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visitors`
--
ALTER TABLE `visitors`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applied_coupons`
--
ALTER TABLE `applied_coupons`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `backups`
--
ALTER TABLE `backups`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `booked_appointments`
--
ALTER TABLE `booked_appointments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `business_cards`
--
ALTER TABLE `business_cards`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `business_fields`
--
ALTER TABLE `business_fields`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `business_hours`
--
ALTER TABLE `business_hours`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `campaigns`
--
ALTER TABLE `campaigns`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `campaign_emails`
--
ALTER TABLE `campaign_emails`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `card_appointment_times`
--
ALTER TABLE `card_appointment_times`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `config`
--
ALTER TABLE `config`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `contact_forms`
--
ALTER TABLE `contact_forms`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=240;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;

--
-- AUTO_INCREMENT for table `custom_domain_requests`
--
ALTER TABLE `custom_domain_requests`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `gateways`
--
ALTER TABLE `gateways`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `health_check_result_history_items`
--
ALTER TABLE `health_check_result_history_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `information_pops`
--
ALTER TABLE `information_pops`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `medias`
--
ALTER TABLE `medias`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `newsletters`
--
ALTER TABLE `newsletters`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nfc_card_designs`
--
ALTER TABLE `nfc_card_designs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nfc_card_keys`
--
ALTER TABLE `nfc_card_keys`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nfc_card_orders`
--
ALTER TABLE `nfc_card_orders`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nfc_card_order_transactions`
--
ALTER TABLE `nfc_card_order_transactions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=220;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pending_user_emails`
--
ALTER TABLE `pending_user_emails`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_orders`
--
ALTER TABLE `product_orders`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `referrals`
--
ALTER TABLE `referrals`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `referral_withdraw_requests`
--
ALTER TABLE `referral_withdraw_requests`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `referral_withdraw_transactions`
--
ALTER TABLE `referral_withdraw_transactions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `store_business_hours`
--
ALTER TABLE `store_business_hours`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_categories`
--
ALTER TABLE `store_categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_orders`
--
ALTER TABLE `store_orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_products`
--
ALTER TABLE `store_products`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `themes`
--
ALTER TABLE `themes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `translations`
--
ALTER TABLE `translations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `vcard_products`
--
ALTER TABLE `vcard_products`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `visitors`
--
ALTER TABLE `visitors`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `translations`
--
ALTER TABLE `translations`
  ADD CONSTRAINT `translations_language_id_foreign` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
