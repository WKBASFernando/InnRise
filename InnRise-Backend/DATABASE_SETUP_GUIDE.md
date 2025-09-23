# InnRise Database Setup Guide

## Foreign Key Constraint Error Resolution

If you encounter the error:
```
Cannot add or update a child row: a foreign key constraint fails (`innrise`.`#sql-1ea4_67d`, CONSTRAINT `FK1m1qn3edjeuhxd21p502t9rs4` FOREIGN KEY (`hotel_id`) REFERENCES `hotel` (`hotel_id`))
```

This means there's existing data in your database that violates foreign key constraints. Here are the solutions:

## Solution 1: Clean Database Setup (Recommended)

### Step 1: Run the Database Cleanup Script
```bash
mysql -u root -p < database_cleanup.sql
```

### Step 2: Use Development Profile
Run the application with the development profile:
```bash
java -jar target/InnRise-Backend-1.0.0.jar --spring.profiles.active=dev
```

This will:
- Use `create-drop` mode which recreates the database schema cleanly
- Automatically populate with sample data

## Solution 2: Manual Database Reset

### Step 1: Drop and Recreate Database
```sql
DROP DATABASE IF EXISTS innRise;
CREATE DATABASE innRise;
USE innRise;
```

### Step 2: Run Sample Data Script
```bash
mysql -u root -p < sample_data_improved.sql
```

## Solution 3: Fix Existing Data

If you want to keep existing data, run these SQL commands:

```sql
USE innRise;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Remove invalid hotel_id references from user table
UPDATE user SET hotel_id = NULL WHERE hotel_id NOT IN (SELECT hotel_id FROM hotel);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
```

## Solution 4: Application Properties Update

Update your `application.properties` to use `create-drop` for development:

```properties
# Change this line:
spring.jpa.hibernate.ddl-auto=update

# To this:
spring.jpa.hibernate.ddl-auto=create-drop
```

**Note:** `create-drop` will delete all data when the application stops, so only use this for development.

## Production Setup

For production, use:
```properties
spring.jpa.hibernate.ddl-auto=validate
```

And ensure your database schema is properly set up with the sample data script.

## Troubleshooting

### If you still get foreign key errors:

1. **Check for orphaned records:**
   ```sql
   SELECT * FROM user WHERE hotel_id IS NOT NULL AND hotel_id NOT IN (SELECT hotel_id FROM hotel);
   ```

2. **Verify table structure:**
   ```sql
   SHOW CREATE TABLE user;
   SHOW CREATE TABLE hotel;
   ```

3. **Check foreign key constraints:**
   ```sql
   SELECT * FROM information_schema.KEY_COLUMN_USAGE 
   WHERE TABLE_SCHEMA = 'innRise' AND CONSTRAINT_NAME LIKE 'FK%';
   ```

## Sample Data

The updated sample data includes:
- ✅ Fixed hotel prices (reduced to realistic LKR amounts)
- ✅ Corrected room ID references in booking data
- ✅ Consistent foreign key relationships
- ✅ Proper price ranges (0-5,000, 5,000-10,000, 10,000-20,000, 20,000+ LKR)

## Quick Start Commands

```bash
# Clean setup (recommended)
mysql -u root -p < database_cleanup.sql
java -jar target/InnRise-Backend-1.0.0.jar --spring.profiles.active=dev

# Or with sample data
mysql -u root -p < sample_data_improved.sql
java -jar target/InnRise-Backend-1.0.0.jar
```
