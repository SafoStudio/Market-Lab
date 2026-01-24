// @ts-nocheck
import { DataSource } from 'typeorm';
import { mainCategoriesDataEn, subcategoriesDataEn } from './data/categories.data.en';
import { mainCategoriesDataUk, subcategoriesDataUk } from './data/categories.data.uk';

export async function seedCategories(dataSource: DataSource) {
  console.log('🌱 Starting categories seeding with translations...');

  try {
    // 1. Checking the connection
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    // 2. Clearing existing data
    console.log('🗑️  Clearing all existing data...');
    await dataSource.query('DELETE FROM translations WHERE "entityType" = $1', ['category']);
    await dataSource.query('DELETE FROM categories');
    console.log('✅ All categories and translations cleared');

    // 3. Create main (parent) categories with English data
    console.log('\n📝 Creating main categories...');
    const savedCategories = {};

    for (let i = 0; i < mainCategoriesDataEn.length; i++) {
      const catData = mainCategoriesDataEn[i];
      const catDataUk = mainCategoriesDataUk.find(c => c.slug === catData.slug);

      console.log(`[${i + 1}/${mainCategoriesDataEn.length}] Creating: ${catData.name}`);

      try {
        // Generate UUID for category
        const categoryId = crypto.randomUUID();

        // Insert category with English data
        await dataSource.query(`
          INSERT INTO categories (
            "id", "name", "slug", "description", "status", "order", 
            "metaTitle", "metaDescription", "createdAt", "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          categoryId,
          catData.name,
          catData.slug,
          catData.description,
          'active',
          catData.order,
          catData.metaTitle,
          catData.metaDescription,
          new Date(),
          new Date()
        ]);

        // Save category info for creating subcategories
        savedCategories[catData.slug] = {
          id: categoryId,
          name: catData.name,
          slug: catData.slug
        };

        // Insert Ukrainian translations if available
        if (catDataUk) {
          await insertCategoryTranslations(dataSource, categoryId, catDataUk);
          console.log(`   ✅ Created with UK translations: ${catData.name} (ID: ${categoryId})`);
        } else {
          console.log(`   ✅ Created (EN only): ${catData.name} (ID: ${categoryId})`);
        }

      } catch (error) {
        console.error(`   ❌ Failed to create category ${catData.name}:`, error.message);
        throw error;
      }
    }

    console.log(`\n✅ Created ${mainCategoriesDataEn.length} main categories`);

    // 4. Creating subcategories with translations
    console.log('\n📝 Creating subcategories...');
    let totalSubcategories = 0;

    for (const mainCategorySlug in subcategoriesDataEn) {
      if (savedCategories[mainCategorySlug]) {
        const parentCategory = savedCategories[mainCategorySlug];
        const subcategoriesEn = subcategoriesDataEn[mainCategorySlug];
        const subcategoriesUk = subcategoriesDataUk?.[mainCategorySlug] || [];

        console.log(`\n📋 Creating subcategories for "${parentCategory.name}"...`);

        for (let i = 0; i < subcategoriesEn.length; i++) {
          const subcatEn = subcategoriesEn[i];
          const subcatUk = subcategoriesUk[i] || { name: subcatEn.name };

          const subcategoryId = crypto.randomUUID();

          // Find Ukrainian subcategory with matching slug
          const matchingUkSubcat = subcategoriesUk.find(s => s.slug === subcatEn.slug);

          try {
            // Insert subcategory with English data
            await dataSource.query(`
              INSERT INTO categories (
                "id", "name", "slug", "description", "status", "order", 
                "parentId", "createdAt", "updatedAt"
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [
              subcategoryId,
              subcatEn.name,
              subcatEn.slug,
              `Subcategory of ${parentCategory.name}: ${subcatEn.name}`,
              'active',
              subcatEn.order,
              parentCategory.id,
              new Date(),
              new Date()
            ]);

            // Insert Ukrainian translations for subcategory
            const ukSubcatData = {
              name: matchingUkSubcat?.name || subcatUk.name,
              slug: subcatEn.slug // Slug остается английским
            };

            await insertCategoryTranslations(dataSource, subcategoryId, ukSubcatData);

            console.log(`   ✅ Created subcategory: ${subcatEn.name}`);
            totalSubcategories++;

          } catch (error) {
            console.error(`   ❌ Failed to create subcategory ${subcatEn.name}:`, error.message);
            throw error;
          }
        }
      } else {
        console.log(`⚠️  Parent category not found for slug: ${mainCategorySlug}`);
      }
    }

    // 5. Final statistics
    console.log('\n📊 Final database state:');

    const totalCategories = await dataSource.query('SELECT COUNT(*) FROM categories');
    const parentCategories = await dataSource.query('SELECT COUNT(*) FROM categories WHERE "parentId" IS NULL');
    const childCategories = await dataSource.query('SELECT COUNT(*) FROM categories WHERE "parentId" IS NOT NULL');
    const translationsCount = await dataSource.query('SELECT COUNT(*) FROM translations WHERE "entityType" = $1', ['category']);

    console.log(`✅ Total categories: ${parseInt(totalCategories[0].count)}`);
    console.log(`✅ Parent categories: ${parseInt(parentCategories[0].count)}`);
    console.log(`✅ Child categories: ${parseInt(childCategories[0].count)}`);
    console.log(`✅ Translations created: ${parseInt(translationsCount[0].count)}`);
    console.log(`✅ Subcategories created: ${totalSubcategories}`);

    // 6. Display category tree with translations info
    await displayCategoryTreeWithTranslations(dataSource);

    console.log('\n🎉 Categories seeding with translations completed successfully!');

  } catch (error) {
    console.error('\n❌ CATEGORIES SEEDING FAILED:');
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    throw error;
  }
}

/**
 * Inserts Ukrainian translations for a category
 */
async function insertCategoryTranslations(
  dataSource: DataSource,
  categoryId: string,
  ukData: {
    name: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
  }
): Promise<void> {
  const translations = [
    { fieldName: 'name', translationText: ukData.name },
    { fieldName: 'description', translationText: ukData.description || '' },
    { fieldName: 'metaTitle', translationText: ukData.metaTitle || '' },
    { fieldName: 'metaDescription', translationText: ukData.metaDescription || '' }
  ];

  for (const translation of translations) {
    if (translation.translationText) {
      await dataSource.query(`
        INSERT INTO translations (
          "id", "entityId", "entityType", "languageCode", 
          "fieldName", "translationText", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        crypto.randomUUID(),
        categoryId,
        'category',
        'uk',
        translation.fieldName,
        translation.translationText,
        new Date(),
        new Date()
      ]);
    }
  }
}

/**
 * Displays category tree with translation info
 */
async function displayCategoryTreeWithTranslations(dataSource: DataSource) {
  console.log('\n🌳 Category structure with translations:');

  const parents = await dataSource.query(`
    SELECT c.id, c.name, c.slug,
    (SELECT COUNT(*) FROM translations t 
    WHERE t."entityId" = c.id AND t."entityType" = 'category') as translation_count
    FROM categories c 
    WHERE c."parentId" IS NULL 
    ORDER BY c."order"
  `);

  for (const parent of parents) {
    const hasTranslations = parseInt(parent.translation_count) > 0;
    const translationIcon = hasTranslations ? '🇺🇦' : '';

    console.log(`├── ${parent.name} ${translationIcon} (${parent.slug})`);

    const children = await dataSource.query(`
      SELECT c.name, 
      (SELECT COUNT(*) FROM translations t 
      WHERE t."entityId" = c.id AND t."entityType" = 'category') as translation_count
      FROM categories c 
      WHERE c."parentId" = $1 
      ORDER BY c."order"
    `, [parent.id]);

    children.forEach((child, index) => {
      const prefix = index === children.length - 1 ? '└──' : '├──';
      const childHasTranslations = parseInt(child.translation_count) > 0;
      const childTranslationIcon = childHasTranslations ? '🇺🇦' : '';

      console.log(`│   ${prefix} ${child.name} ${childTranslationIcon}`);
    });
  }
}