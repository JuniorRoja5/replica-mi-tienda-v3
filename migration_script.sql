-- ================================================================
-- DATABASE MIGRATION SCRIPT: business_cards → cards
-- ================================================================
-- WARNING: BACKUP YOUR DATABASE BEFORE RUNNING THIS SCRIPT
-- 
-- This script migrates data from the legacy business_cards table
-- to the new cards table expected by the Laravel application.
-- ================================================================

SET foreign_key_checks = 0;

-- ================================================================
-- STEP 1: CREATE NEW CARDS TABLE
-- ================================================================

CREATE TABLE IF NOT EXISTS `cards` (
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `cards_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- STEP 2: PRE-MIGRATION VALIDATION
-- ================================================================

-- Check for user_id conversion issues
SELECT 'Checking user_id conversion compatibility...' as status;

-- Find user_ids that cannot be converted to integers
SELECT COUNT(*) as invalid_user_ids 
FROM business_cards 
WHERE user_id NOT REGEXP '^[0-9]+$';

-- Check for duplicate card_url values that will become slugs
SELECT 'Checking for duplicate slugs...' as status;

SELECT card_url, COUNT(*) as count 
FROM business_cards 
GROUP BY card_url 
HAVING COUNT(*) > 1
LIMIT 10;

-- ================================================================
-- STEP 3: HANDLE DUPLICATE SLUGS
-- ================================================================

-- Create temporary table to assign unique slugs
CREATE TEMPORARY TABLE temp_slug_mapping AS
SELECT 
    id,
    card_url as original_slug,
    CASE 
        WHEN card_url IS NULL OR card_url = '' THEN CONCAT('card-', id)
        ELSE card_url
    END as base_slug
FROM business_cards;

-- Add unique suffix for duplicates
UPDATE temp_slug_mapping t1
SET base_slug = CONCAT(base_slug, '-', (
    SELECT COUNT(*) 
    FROM temp_slug_mapping t2 
    WHERE t2.base_slug = t1.base_slug AND t2.id <= t1.id
))
WHERE (
    SELECT COUNT(*) 
    FROM temp_slug_mapping t3 
    WHERE t3.base_slug = t1.base_slug
) > 1;

-- ================================================================
-- STEP 4: MIGRATE DATA
-- ================================================================

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
  -- Convert user_id to bigint (handle conversion carefully)
  CASE 
    WHEN bc.user_id REGEXP '^[0-9]+$' THEN CAST(bc.user_id AS UNSIGNED)
    ELSE 1  -- Default to user ID 1 if conversion fails
  END as user_id,
  
  -- Basic card information
  COALESCE(bc.title, 'Untitled Card') as title,
  tsm.base_slug as slug,
  
  -- Status mapping
  CASE 
    WHEN bc.card_status = 'activated' AND bc.status = '1' THEN 'active'
    WHEN bc.card_status = 'deleted' THEN 'active'  -- Will be soft deleted
    ELSE 'inactive'
  END as status,
  
  -- Personal information
  bc.title as name,
  bc.sub_title as job_title,
  NULL as company,  -- No direct mapping available
  NULL as phone,    -- No direct mapping available
  bc.enquiry_email as email,
  NULL as website,  -- No direct mapping available
  bc.description as bio,
  
  -- Media paths
  bc.profile as avatar_path,
  CASE 
    WHEN bc.cover_type = 'photo' THEN bc.cover
    ELSE NULL  -- Don't migrate YouTube covers to cover_path
  END as cover_path,
  
  -- Theme and publishing
  bc.theme_id as theme,
  CASE WHEN bc.status = '1' AND bc.card_status = 'activated' THEN 1 ELSE 0 END as is_published,
  0 as views,  -- Start fresh with views
  
  -- Store complex data in JSON format
  JSON_OBJECT(
    'legacy_data', JSON_OBJECT(
      'card_id', bc.card_id,
      'type', bc.type,
      'card_lang', bc.card_lang,
      'cover_type', bc.cover_type,
      'cover_original', bc.cover,
      'custom_domain', bc.custom_domain,
      'card_type', bc.card_type,
      'is_newsletter_pop_active', bc.is_newsletter_pop_active,
      'is_info_pop_active', bc.is_info_pop_active,
      'is_enable_pwa', COALESCE(bc.is_enable_pwa, 1),
      'custom_css', bc.custom_css,
      'custom_js', bc.custom_js,
      'password', bc.password,
      'expiry_time', bc.expiry_time,
      'delivery_options', bc.delivery_options,
      'seo_configurations', bc.seo_configurations,
      'appointment_receive_email', bc.appointment_receive_email
    ),
    'custom_styles', COALESCE(bc.custom_styles, JSON_OBJECT()),
    'migrated_at', NOW(),
    'migration_version', '1.0'
  ) as data,
  
  -- Initialize empty social links
  JSON_OBJECT() as social_links,
  
  -- Timestamps
  bc.created_at,
  bc.updated_at,
  
  -- Soft delete support
  CASE WHEN bc.card_status = 'deleted' THEN bc.updated_at ELSE NULL END as deleted_at

FROM business_cards bc
JOIN temp_slug_mapping tsm ON bc.id = tsm.id
WHERE bc.id IS NOT NULL
ORDER BY bc.id;

-- ================================================================
-- STEP 5: POST-MIGRATION VALIDATION
-- ================================================================

-- Check migration results
SELECT 'Migration completed. Validation results:' as status;

SELECT 
    'business_cards' as table_name,
    COUNT(*) as record_count
FROM business_cards
UNION ALL
SELECT 
    'cards' as table_name,
    COUNT(*) as record_count
FROM cards;

-- Check for any data integrity issues
SELECT 'Checking for potential issues...' as status;

-- Find records with conversion issues
SELECT COUNT(*) as records_with_user_id_1 
FROM cards 
WHERE user_id = 1;

-- Check slug uniqueness
SELECT COUNT(*) as total_slugs, COUNT(DISTINCT slug) as unique_slugs 
FROM cards;

-- Check JSON data integrity
SELECT COUNT(*) as records_with_json_data 
FROM cards 
WHERE JSON_VALID(data) = 1;

-- ================================================================
-- STEP 6: CREATE REFERENCE TABLE FOR LEGACY MAPPING
-- ================================================================

-- Create mapping table for reference
CREATE TABLE IF NOT EXISTS `legacy_card_mapping` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `old_business_card_id` int unsigned NOT NULL,
  `old_card_id` varchar(191) NOT NULL,
  `new_card_id` bigint unsigned NOT NULL,
  `migration_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_old_card_id` (`old_card_id`),
  KEY `idx_new_card_id` (`new_card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Populate mapping table
INSERT INTO legacy_card_mapping (old_business_card_id, old_card_id, new_card_id)
SELECT 
  bc.id as old_business_card_id,
  bc.card_id as old_card_id,
  c.id as new_card_id
FROM business_cards bc
JOIN cards c ON c.slug = COALESCE(bc.card_url, CONCAT('card-', bc.id))
WHERE bc.id IS NOT NULL;

-- ================================================================
-- FINAL NOTES
-- ================================================================

SELECT 'MIGRATION COMPLETED SUCCESSFULLY!' as status;
SELECT 'Next steps:' as status;
SELECT '1. Test your Laravel application' as step;
SELECT '2. Verify card functionality works' as step;
SELECT '3. Check that all data is accessible' as step;
SELECT '4. Keep business_cards table as backup' as step;
SELECT '5. Monitor application for any issues' as step;

-- Cleanup temporary table
DROP TEMPORARY TABLE temp_slug_mapping;

SET foreign_key_checks = 1;

-- ================================================================
-- ROLLBACK SCRIPT (KEEP FOR EMERGENCY)
-- ================================================================

/*
-- EMERGENCY ROLLBACK SCRIPT (DO NOT RUN UNLESS ISSUES OCCUR)
-- This will drop the new cards table and restore the original state

DROP TABLE IF EXISTS `cards`;
DROP TABLE IF EXISTS `legacy_card_mapping`;

-- Your original business_cards table should remain intact
SELECT COUNT(*) as business_cards_count FROM business_cards;
*/