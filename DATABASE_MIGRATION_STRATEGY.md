# Database Migration Strategy: business_cards → cards

## 🚨 CRITICAL ISSUE IDENTIFIED

**Problem:** Production database desynchronization causing application failures.

**Root Cause:** Laravel application has been refactored to use a new `cards` table structure, but the production database still contains only the legacy `business_cards` table.

## 📊 SCHEMA ANALYSIS

### Current Production Database (OLD - dbzyigrezaix7n.sql)
```sql
business_cards:
- id (int unsigned, auto_increment)
- card_id (varchar(191)) - Custom string ID like '684761d3646f6'
- user_id (varchar(191)) - String user ID
- type (varchar(191)) - 'business'/'personal'
- theme_id (varchar(191))
- card_lang (varchar(191)) - 'en'/'es'
- cover (text) - Image path or URL
- cover_type (varchar(191)) - 'photo'/'youtube'
- profile (varchar(191)) - Profile image path
- card_url (varchar(191)) - URL slug
- custom_domain (text)
- card_type (varchar(191)) - 'vcard'
- title (varchar(191))
- sub_title (longtext)
- description (longtext)
- enquiry_email (text)
- appointment_receive_email (text)
- is_newsletter_pop_active (tinyint(1))
- is_info_pop_active (tinyint(1))
- is_enable_pwa (tinyint(1)) - UNIQUE TO OLD SCHEMA
- custom_styles (json)
- custom_css (text)
- custom_js (text)
- password (text)
- expiry_time (timestamp)
- delivery_options (text)
- seo_configurations (text)
- card_status (varchar(191)) - 'activated'/'inactive'/'deleted'
- status (varchar(191)) - '1'
- created_at (timestamp)
- updated_at (timestamp)
```

### New Expected Database (NEW - Dump20250821.sql)
```sql
cards:
- id (bigint unsigned, auto_increment) - Laravel standard
- user_id (bigint unsigned) - Laravel foreign key
- title (varchar(191))
- slug (varchar(191), unique) - URL-friendly identifier
- status (varchar(16)) - 'active'
- name (varchar(191))
- job_title (varchar(191))
- company (varchar(191))
- phone (varchar(191))
- email (varchar(191))
- website (varchar(191))
- bio (text)
- avatar_path (varchar(191))
- cover_path (varchar(191))
- theme (varchar(191))
- is_published (tinyint(1))
- views (bigint unsigned)
- data (json) - Flexible data structure
- social_links (json) - Social media links
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp) - SoftDeletes support
```

## 🔍 KEY DIFFERENCES

### 1. **Primary Key & ID Structure**
- **OLD:** `int` auto-increment + custom `card_id` string field
- **NEW:** `bigint` auto-increment (Laravel standard)

### 2. **User Reference**
- **OLD:** `user_id` as string
- **NEW:** `user_id` as `bigint unsigned` (proper foreign key)

### 3. **URL Handling**
- **OLD:** `card_url` field with custom string
- **NEW:** `slug` field with unique constraint

### 4. **Data Storage**
- **OLD:** Multiple specific fields (cover, cover_type, profile, custom_styles, etc.)
- **NEW:** Simplified structure with JSON fields for flexible data

### 5. **Status Management**
- **OLD:** `card_status` + `status` fields with complex values
- **NEW:** Simple `status` + `is_published` boolean + SoftDeletes

### 6. **Missing Fields in New Structure**
- `is_enable_pwa`
- `custom_domain`
- `enquiry_email`
- `appointment_receive_email`
- `password`
- `expiry_time`
- `delivery_options`
- `seo_configurations`
- Various newsletter/popup flags

## 🛠 MIGRATION STRATEGY

### Phase 1: Pre-Migration Analysis
1. **Data Inventory:**
   - Count total records in `business_cards`
   - Identify unique `user_id` values and their data types
   - Check for NULL values in critical fields
   - Analyze `card_url` patterns for slug conversion

2. **User ID Mapping:**
   - Determine if `user_id` strings can be mapped to integers
   - Create mapping table if needed

### Phase 2: Safe Migration Script
```sql
-- Step 1: Create new cards table (if not exists)
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

-- Step 2: Migrate data with field mapping
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
  CAST(bc.user_id AS UNSIGNED) as user_id,  -- Convert string to bigint
  bc.title,
  bc.card_url as slug,  -- Use card_url as slug
  CASE 
    WHEN bc.card_status = 'activated' THEN 'active'
    WHEN bc.card_status = 'inactive' THEN 'inactive'
    ELSE 'active'
  END as status,
  bc.title as name,  -- Map title to name
  bc.sub_title as job_title,  -- Map sub_title to job_title
  NULL as company,  -- No direct mapping
  NULL as phone,    -- No direct mapping
  bc.enquiry_email as email,
  NULL as website,  -- No direct mapping
  bc.description as bio,
  bc.profile as avatar_path,
  bc.cover as cover_path,
  bc.theme_id as theme,
  CASE WHEN bc.status = '1' THEN 1 ELSE 0 END as is_published,
  0 as views,  -- Default to 0
  JSON_OBJECT(
    'card_id', bc.card_id,
    'type', bc.type,
    'card_lang', bc.card_lang,
    'cover_type', bc.cover_type,
    'custom_domain', bc.custom_domain,
    'card_type', bc.card_type,
    'is_newsletter_pop_active', bc.is_newsletter_pop_active,
    'is_info_pop_active', bc.is_info_pop_active,
    'is_enable_pwa', bc.is_enable_pwa,
    'custom_styles', bc.custom_styles,
    'custom_css', bc.custom_css,
    'custom_js', bc.custom_js,
    'password', bc.password,
    'expiry_time', bc.expiry_time,
    'delivery_options', bc.delivery_options,
    'seo_configurations', bc.seo_configurations,
    'appointment_receive_email', bc.appointment_receive_email
  ) as data,
  JSON_OBJECT() as social_links,  -- Empty JSON for now
  bc.created_at,
  bc.updated_at,
  CASE WHEN bc.card_status = 'deleted' THEN bc.updated_at ELSE NULL END as deleted_at
FROM business_cards bc
WHERE bc.id IS NOT NULL;
```

### Phase 3: Validation & Testing
1. **Data Integrity Checks:**
   - Verify record count matches
   - Check for unique slug violations
   - Validate JSON data structure
   - Ensure user_id conversion success

2. **Application Testing:**
   - Test Card model functionality
   - Verify slug-based routing
   - Check data access patterns

### Phase 4: Rollback Plan
1. **Backup Strategy:**
   - Full database backup before migration
   - Keep `business_cards` table as backup
   - Document rollback procedure

2. **Rollback Steps:**
   ```sql
   -- Drop new cards table if issues occur
   DROP TABLE IF EXISTS `cards`;
   
   -- Ensure business_cards is intact
   SELECT COUNT(*) FROM business_cards;
   ```

## ⚠️ MIGRATION RISKS & CONSIDERATIONS

### 1. **User ID Conversion Risk**
- String user_ids might not convert to valid integers
- **Mitigation:** Pre-validate all user_id values

### 2. **Slug Uniqueness**
- `card_url` values might not be unique
- **Mitigation:** Handle duplicates by appending ID

### 3. **Data Loss**
- Complex fields will be moved to JSON
- **Mitigation:** Preserve all data in JSON format

### 4. **Application Dependencies**
- Related tables might reference old structure
- **Mitigation:** Update foreign key references

## 📋 RECOMMENDED EXECUTION PLAN

### For Production Server (via PuTTY):

1. **Backup Current Database:**
   ```bash
   mysqldump -u username -p database_name > backup_before_migration_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Run Migration Script:**
   - Execute migration SQL step by step
   - Validate each step before proceeding

3. **Verify Migration:**
   - Check record counts
   - Test application functionality
   - Monitor for errors

4. **Update Application:**
   - Ensure Laravel code uses Card model
   - Update any hardcoded references

## 🎯 SUCCESS CRITERIA

- [ ] All `business_cards` data successfully migrated to `cards`
- [ ] Application loads without database errors
- [ ] Card creation/editing functionality works
- [ ] No data loss in migration
- [ ] Performance remains acceptable

## 📞 NEXT STEPS

1. **User Approval:** Get confirmation to proceed with migration
2. **Backup Verification:** Confirm production backup access
3. **Migration Execution:** Run migration during maintenance window
4. **Post-Migration Testing:** Comprehensive application testing
5. **Rollback Readiness:** Keep rollback plan accessible

---

**⚠️ CRITICAL:** This migration affects core application functionality. Ensure complete backup and testing procedures before executing in production.