// @ts-nocheck
import { DataSource } from 'typeorm';
import { mainCategoriesData, subcategoriesData } from './data/categories.data.en';

export async function seedCategories(dataSource: DataSource) {
  console.log('🌱 Starting categories seeding...');

  try {
    // 1. Checking the connection
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    // 2. Clearing categories
    console.log('🗑️  Clearing all categories...');
    await dataSource.query('DELETE FROM categories');
    console.log('✅ Categories cleared');

    // 3. Create main (parent) categories
    console.log('\n📝 Creating main categories...');

    const savedCategories = {};

    for (let i = 0; i < mainCategoriesData.length; i++) {
      const catData = mainCategoriesData[i];
      console.log(`[${i + 1}/${mainCategoriesData.length}] Creating: ${catData.name}`);

      try {
        const result = await dataSource.query(`
          INSERT INTO categories (
            "id", "name", "slug", "description", "status", "order", 
            "metaTitle", "metaDescription", "createdAt", "updatedAt"
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9
          ) RETURNING id, name, slug
        `, [
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

        savedCategories[catData.slug] = result[0];
        console.log(`   ✅ Created: ${catData.name} (ID: ${result[0].id})`);

      } catch (error) {
        console.error(`   ❌ Failed to create category ${catData.name}:`, error.message);
        throw error;
      }
    }

    console.log(`\n✅ Created ${mainCategoriesData.length} main categories`);

    // 4. Creating subcategories
    console.log('\n📝 Creating subcategories...');
    let totalSubcategories = 0;

    // We go through all the main categories and create subcategories
    for (const mainCategorySlug in subcategoriesData) {
      if (savedCategories[mainCategorySlug]) {
        const parentCategory = savedCategories[mainCategorySlug];
        const subcategories = subcategoriesData[mainCategorySlug];

        console.log(`\n📋 Creating subcategories for "${parentCategory.name}"...`);

        for (const subcat of subcategories) {
          await dataSource.query(`
            INSERT INTO categories (
              "id", "name", "slug", "description", "status", "order", 
              "parentId", "createdAt", "updatedAt"
            ) VALUES (
              gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8
            )
          `, [
            subcat.name,
            subcat.slug,
            `${parentCategory.name} subcategory: ${subcat.name}`,
            'active',
            subcat.order,
            parentCategory.id,
            new Date(),
            new Date()
          ]);

          console.log(`   ✅ Created subcategory: ${subcat.name}`);
          totalSubcategories++;
        }
      } else {
        console.log(`⚠️  Parent category not found for slug: ${mainCategorySlug}`);
      }
    }

    // 5. Final check and output of results
    console.log('\n📊 Final database state:');

    const totalCount = await dataSource.query('SELECT COUNT(*) FROM categories');
    const parentCount = await dataSource.query('SELECT COUNT(*) FROM categories WHERE "parentId" IS NULL');
    const childCount = await dataSource.query('SELECT COUNT(*) FROM categories WHERE "parentId" IS NOT NULL');

    console.log(`✅ Total categories: ${parseInt(totalCount[0].count)}`);
    console.log(`✅ Parent categories: ${parseInt(parentCount[0].count)}`);
    console.log(`✅ Child categories: ${parseInt(childCount[0].count)}`);
    console.log(`✅ Subcategories created: ${totalSubcategories}`);

    // 6. Display category tree
    await displayCategoryTree(dataSource);

    console.log('\n🎉 Categories seeding completed successfully!');

  } catch (error) {
    console.error('\n❌ CATEGORIES SEEDING FAILED:');
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    throw error;
  }
}

async function displayCategoryTree(dataSource) {
  console.log('\n🌳 Category structure:');

  const parents = await dataSource.query(`
    SELECT id, name, slug 
    FROM categories 
    WHERE "parentId" IS NULL 
    ORDER BY "order"
  `);

  for (const parent of parents) {
    console.log(`├── ${parent.name} (${parent.slug})`);

    const children = await dataSource.query(`
      SELECT name 
      FROM categories 
      WHERE "parentId" = $1 
      ORDER BY "order"
    `, [parent.id]);

    children.forEach((child, index) => {
      const prefix = index === children.length - 1 ? '└──' : '├──';
      console.log(`│   ${prefix} ${child.name}`);
    });
  }
}