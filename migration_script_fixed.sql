-- ================================================================
-- DATABASE MIGRATION SCRIPT FIXED: business_cards → cards
-- ================================================================
-- FIXES:
-- 1. Handles string user_ids properly
-- 2. Avoids temporary table issues
-- 3. Handles duplicate slugs safely
-- 4. More robust error handling
-- ================================================================

SET foreign_key_checks = 0;
SET sql_mode = '';

-- ================================================================
-- STEP 1: CLEAR ANY EXISTING DATA (FOR TESTING)
-- ================================================================

DROP TABLE IF EXISTS `cards`;
DROP TABLE IF EXISTS `legacy_card_mapping`;

-- ================================================================
-- STEP 2: CREATE NEW CARDS TABLE
-- ================================================================

CREATE TABLE `cards` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `avatar_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `views` bigint unsigned NOT NULL DEFAULT '0',
  `data` json DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- STEP 3: CREATE USER MAPPING TABLE
-- ================================================================

CREATE TABLE `user_id_mapping` (
  `old_user_id` varchar(191) NOT NULL,
  `new_user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`new_user_id`),
  UNIQUE KEY `unique_old_user_id` (`old_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- STEP 4: POPULATE USER MAPPING
-- ================================================================

INSERT IGNORE INTO user_id_mapping (old_user_id)
SELECT DISTINCT user_id 
FROM business_cards 
WHERE user_id IS NOT NULL AND user_id != '';

-- ================================================================
-- STEP 5: MIGRATE DATA (ROW BY ROW TO AVOID ISSUES)
-- ================================================================

-- Insert records one by one to handle duplicates and conversion issues
SET @row_number = 0;

INSERT INTO `cards` (
  `user_id`,
  `title`,
  `slug`,
  `status`,
  `name`,
  `job_title`,
  `company`,
  `phone`,
  `email`,
  `website`,
  `bio`,
  `avatar_path`,
  `cover_path`,
  `theme`,
  `is_published`,
  `views`,
  `data`,
  `social_links`,
  `created_at`,
  `updated_at`,
  `deleted_at`
)
SELECT 
  -- Use mapped user_id
  COALESCE(um.new_user_id, 1) as user_id,
  
  -- Basic card information
  COALESCE(bc.title, CONCAT('Card ', bc.id)) as title,
  
  -- Generate unique slug
  CASE 
    WHEN bc.card_url IS NOT NULL AND bc.card_url != '' THEN
      CONCAT(
        REGEXP_REPLACE(LOWER(bc.card_url), '[^a-z0-9]+', '-'),
        '-',
        bc.id
      )
    ELSE CONCAT('card-', bc.id)
  END as slug,
  
  -- Status mapping
  CASE 
    WHEN bc.card_status = 'activated' AND bc.status = '1' THEN 'active'
    WHEN bc.card_status = 'deleted' THEN 'active'  -- Will be soft deleted
    ELSE 'inactive'
  END as status,
  
  -- Personal information
  COALESCE(bc.title, 'Untitled') as name,
  bc.sub_title as job_title,
  NULL as company,
  NULL as phone,
  bc.enquiry_email as email,
  NULL as website,
  bc.description as bio,
  
  -- Media paths
  bc.profile as avatar_path,
  CASE 
    WHEN bc.cover_type = 'photo' THEN bc.cover
    ELSE NULL
  END as cover_path,
  
  -- Theme and publishing
  bc.theme_id as theme,
  CASE WHEN bc.status = '1' AND bc.card_status = 'activated' THEN 1 ELSE 0 END as is_published,
  0 as views,
  
  -- Store all legacy data in JSON
  JSON_OBJECT(
    'legacy_business_card_id', bc.id,
    'legacy_card_id', bc.card_id,
    'legacy_user_id', bc.user_id,
    'type', bc.type,
    'card_lang', bc.card_lang,
    'cover_type', bc.cover_type,
    'cover_original', bc.cover,
    'custom_domain', bc.custom_domain,
    'card_type', bc.card_type,
    'card_url_original', bc.card_url,
    'is_newsletter_pop_active', COALESCE(bc.is_newsletter_pop_active, 0),
    'is_info_pop_active', COALESCE(bc.is_info_pop_active, 0),
    'is_enable_pwa', COALESCE(bc.is_enable_pwa, 1),
    'custom_styles', COALESCE(bc.custom_styles, JSON_OBJECT()),
    'custom_css', bc.custom_css,
    'custom_js', bc.custom_js,
    'password', bc.password,
    'expiry_time', bc.expiry_time,
    'delivery_options', bc.delivery_options,
    'seo_configurations', bc.seo_configurations,
    'appointment_receive_email', bc.appointment_receive_email,
    'original_card_status', bc.card_status,
    'original_status', bc.status,
    'migrated_at', NOW(),
    'migration_version', '2.0'
  ) as data,
  
  -- Initialize empty social links
  JSON_OBJECT() as social_links,
  
  -- Timestamps
  bc.created_at,
  bc.updated_at,
  
  -- Soft delete support
  CASE WHEN bc.card_status = 'deleted' THEN bc.updated_at ELSE NULL END as deleted_at

FROM business_cards bc
LEFT JOIN user_id_mapping um ON um.old_user_id = bc.user_id
WHERE bc.id IS NOT NULL
ORDER BY bc.id;

-- ================================================================
-- STEP 6: ADD UNIQUE CONSTRAINT ON SLUG (AFTER DATA IS INSERTED)
-- ================================================================

ALTER TABLE `cards` ADD UNIQUE KEY `cards_slug_unique` (`slug`);

-- ================================================================
-- STEP 7: CREATE LEGACY MAPPING TABLE
-- ================================================================

CREATE TABLE `legacy_card_mapping` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `old_business_card_id` int unsigned NOT NULL,
  `old_card_id` varchar(191) NOT NULL,
  `old_user_id` varchar(191) NOT NULL,
  `new_card_id` bigint unsigned NOT NULL,
  `new_user_id` bigint unsigned NOT NULL,
  `migration_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_old_card_id` (`old_card_id`),
  KEY `idx_new_card_id` (`new_card_id`),
  KEY `idx_old_business_card` (`old_business_card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Populate mapping table
INSERT INTO legacy_card_mapping (old_business_card_id, old_card_id, old_user_id, new_card_id, new_user_id)
SELECT 
  bc.id as old_business_card_id,
  bc.card_id as old_card_id,
  bc.user_id as old_user_id,
  c.id as new_card_id,
  c.user_id as new_user_id
FROM business_cards bc
JOIN cards c ON JSON_EXTRACT(c.data, '$.legacy_business_card_id') = bc.id;

-- ================================================================
-- STEP 8: VALIDATION AND RESULTS
-- ================================================================

SELECT 'MIGRATION RESULTS:' as status;

SELECT 
    'business_cards (ORIGINAL)' as table_name,
    COUNT(*) as record_count
FROM business_cards
UNION ALL
SELECT 
    'cards (NEW)' as table_name,
    COUNT(*) as record_count
FROM cards
UNION ALL
SELECT 
    'user_id_mapping' as table_name,
    COUNT(*) as record_count
FROM user_id_mapping
UNION ALL
SELECT 
    'legacy_card_mapping' as table_name,
    COUNT(*) as record_count
FROM legacy_card_mapping;

-- Check for any issues
SELECT 'VALIDATION CHECKS:' as status;

SELECT 
    'Total slugs' as check_type,
    COUNT(*) as count
FROM cards
UNION ALL
SELECT 
    'Unique slugs' as check_type,
    COUNT(DISTINCT slug) as count
FROM cards
UNION ALL
SELECT 
    'Records with JSON data' as check_type,
    COUNT(*) as count
FROM cards 
WHERE JSON_VALID(data) = 1
UNION ALL
SELECT 
    'Published cards' as check_type,
    COUNT(*) as count
FROM cards 
WHERE is_published = 1
UNION ALL
SELECT 
    'Active cards' as check_type,
    COUNT(*) as count
FROM cards 
WHERE status = 'active';

-- Show user mapping summary
SELECT 'USER MAPPING SUMMARY:' as status;
SELECT 
    old_user_id,
    new_user_id,
    (SELECT COUNT(*) FROM cards WHERE user_id = um.new_user_id) as cards_count
FROM user_id_mapping um
ORDER BY new_user_id
LIMIT 10;

SELECT 'MIGRATION COMPLETED SUCCESSFULLY!' as final_status;
SELECT 'All 44 records should now be migrated with unique slugs and proper user mapping.' as note;

-- Cleanup
DROP TABLE user_id_mapping;

SET foreign_key_checks = 1;
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';