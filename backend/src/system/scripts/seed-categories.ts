import { DataSource } from 'typeorm';
import { CategoryOrmEntity } from '@infrastructure/database/postgres/categories/category.entity';

export async function seedCategories(dataSource: DataSource) {
  console.log('🌱 Starting categories seeding...');

  try {
    // 1. Checking the connection
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const categoryRepository = dataSource.getRepository(CategoryOrmEntity);

    // 2. Clearing categories
    console.log('🗑️  Clearing all categories...');
    await dataSource.query('DELETE FROM categories');
    console.log('✅ Categories cleared');

    // 3. Create main (parent) categories
    console.log('\n📝 Creating main categories...');

    const mainCategories = [
      {
        name: 'Овочі',
        slug: 'ovochi',
        description: 'Свіжі фермерські овочі з натурального господарства',
        order: 1,
        metaTitle: 'Фермерські овочі',
        metaDescription: 'Натуральні овочі без хімічних добрив та пестицидів'
      },
      {
        name: 'Фрукти',
        slug: 'frukty',
        description: 'Сезонні фрукти з власних садів',
        order: 2,
        metaTitle: 'Сезонні фрукти',
        metaDescription: 'Дозрілі на сонці фрукти з екологічно чистих регіонів'
      },
      {
        name: 'Молочні продукти',
        slug: 'molochni-produkty',
        description: 'Натуральні молочні продукти без консервантів',
        order: 3,
        metaTitle: 'Домашні молочні продукти',
        metaDescription: 'Молоко, сир, сметана та інші молочні продукти ручної роботи'
      },
      {
        name: "М'ясо та птиця",
        slug: 'm-yaso-ta-ptitsya',
        description: "Свіже фермерське м'ясо та птиця",
        order: 4,
        metaTitle: "Фермерське м'ясо",
        metaDescription: "Натуральне м'ясо відгодоване на природних кормах"
      },
      {
        name: 'Яйця',
        slug: 'yajtsya',
        description: 'Деревенські яйця від вільних курей',
        order: 5,
        metaTitle: 'Деревенські яйця',
        metaDescription: 'Яйця від курей які живуть на вільному вигулі'
      },
      {
        name: 'Хліб та випічка',
        slug: 'khlib-ta-vipichka',
        description: 'Домашній хліб на натуральній заквасці',
        order: 6,
        metaTitle: 'Домашня випічка',
        metaDescription: 'Хліб, булочки, пироги ручної роботи'
      },
      {
        name: 'Мед та бджолині продукти',
        slug: 'med-ta-bdzhilini-produkty',
        description: 'Натуральний мед з власних пасік',
        order: 7,
        metaTitle: 'Натуральний мед',
        metaDescription: 'Мед, прополіс, пилок з екологічно чистих регіонів'
      },
      {
        name: 'Консервація',
        slug: 'konservatsiya',
        description: 'Домашня консервація з сезонних овочів та фруктів',
        order: 8,
        metaTitle: 'Домашня консервація',
        metaDescription: 'Варення, соління, маринади ручної роботи'
      },
      {
        name: 'Напої',
        slug: 'napoї',
        description: 'Натуральні напої без консервантів',
        order: 9,
        metaTitle: 'Домашні напої',
        metaDescription: 'Соки, морси, квас, трав\'яні чаї'
      },
      {
        name: 'Зернові та крупи',
        slug: 'zernovi-ta-krupi',
        description: 'Натуральні крупи без штучної обробки',
        order: 10,
        metaTitle: 'Натуральні крупи',
        metaDescription: 'Гречка, рис, вівсянка, пшено з власних полів'
      },
      {
        name: 'Горіхи та сухофрукти',
        slug: 'gorikhi-ta-sukhofrukty',
        description: 'Натуральні горіхи та сухофрукти',
        order: 11,
        metaTitle: 'Горіхи та сухофрукти',
        metaDescription: 'Ядра горіхів та висушені фрукти без цукру'
      },
      {
        name: 'Рослинні олії',
        slug: 'roslinni-olii',
        description: 'Олії холодного віджиму',
        order: 12,
        metaTitle: 'Натуральні олії',
        metaDescription: 'Соняшникова, лляна, гарбузова олії холодного віджиму'
      },
      {
        name: 'Спеції та трави',
        slug: 'spetsii-ta-travi',
        description: 'Натуральні спеції та лікарські трави',
        order: 13,
        metaTitle: 'Спеції та трави',
        metaDescription: 'Сушені трави, прянощі, чайні збори'
      },
      {
        name: 'Фермерські делікатеси',
        slug: 'fermerski-delikatesi',
        description: 'Домашні ковбаси, сири та паштети',
        order: 14,
        metaTitle: 'Фермерські делікатеси',
        metaDescription: 'Ковбаси, сири, паштети ручної роботи'
      },
      {
        name: 'Дитяче харчування',
        slug: 'dityache-kharchuvannya',
        description: 'Натуральне харчування для дітей',
        order: 15,
        metaTitle: 'Дитяче харчування',
        metaDescription: 'Пюре, каші, снеки для дітей'
      },
      {
        name: 'Інше',
        slug: 'inshe',
        description: 'Інші фермерські продукти',
        order: 16,
        metaTitle: 'Інші продукти',
        metaDescription: 'Різноманітні фермерські продукти'
      }
    ];

    // Creating Basic Categories
    const savedCategories: Record<string, any> = {};

    for (let i = 0; i < mainCategories.length; i++) {
      const catData = mainCategories[i];
      console.log(`[${i + 1}/${mainCategories.length}] Creating: ${catData.name}`);

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

    console.log(`\n✅ Created ${mainCategories.length} main categories`);

    // 4. Creating subcategories
    console.log('\n📝 Creating subcategories...');

    // Подкатегории для Овочі
    if (savedCategories['ovochi']) {
      console.log('\n🥦 Creating subcategories for "Овочі"...');

      const vegetableSubcategories = [
        { name: 'Коренеплоди', slug: 'koreneplodi', order: 1 },
        { name: 'Листові овочі', slug: 'listovi-ovochi', order: 2 },
        { name: 'Пасльонові', slug: 'paslonovi', order: 3 },
        { name: 'Хрестоцвіті', slug: 'khrestotsviti', order: 4 },
        { name: 'Гарбузові', slug: 'garbuzovi', order: 5 },
        { name: 'Цибулеві', slug: 'tsibulevi', order: 6 },
      ];

      for (const subcat of vegetableSubcategories) {
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
          `Підкатегорія овочів: ${subcat.name}`,
          'active',
          subcat.order,
          savedCategories['ovochi'].id,
          new Date(),
          new Date()
        ]);

        console.log(`   ✅ Created subcategory: ${subcat.name}`);
      }
    }

    // Подкатегории для Фрукти
    if (savedCategories['frukty']) {
      console.log('\n🍎 Creating subcategories for "Фрукти"...');

      const fruitSubcategories = [
        { name: 'Ягоди', slug: 'yagodi', order: 1 },
        { name: 'Цитрусові', slug: 'tsitrusovi', order: 2 },
        { name: 'Кісточкові', slug: 'kistochkovi', order: 3 },
        { name: 'Тропічні фрукти', slug: 'tropichni-frukty', order: 4 },
        { name: 'Диняні', slug: 'dinyani', order: 5 },
        { name: 'Насіннєві', slug: 'nasinnevi', order: 6 },
      ];

      for (const subcat of fruitSubcategories) {
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
          `Підкатегорія фруктів: ${subcat.name}`,
          'active',
          subcat.order,
          savedCategories['frukty'].id,
          new Date(),
          new Date()
        ]);

        console.log(`   ✅ Created subcategory: ${subcat.name}`);
      }
    }

    // Подкатегории для Молочні продукти
    if (savedCategories['molochni-produkty']) {
      console.log('\n🥛 Creating subcategories for "Молочні продукти"...');

      const dairySubcategories = [
        { name: 'Молоко', slug: 'moloko', order: 1 },
        { name: 'Сир', slug: 'sir', order: 2 },
        { name: 'Йогурт', slug: 'yogurt', order: 3 },
        { name: 'Масло вершкове', slug: 'maslo-vershkove', order: 4 },
        { name: 'Вершки', slug: 'vershki', order: 5 },
        { name: 'Кисломолочні продукти', slug: 'kislomolochni-produkty', order: 6 },
      ];

      for (const subcat of dairySubcategories) {
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
          `Підкатегорія молочних продуктів: ${subcat.name}`,
          'active',
          subcat.order,
          savedCategories['molochni-produkty'].id,
          new Date(),
          new Date()
        ]);

        console.log(`   ✅ Created subcategory: ${subcat.name}`);
      }
    }

    // Подкатегории для М'ясо та птиця
    if (savedCategories['m-yaso-ta-ptitsya']) {
      console.log('\n🍗 Creating subcategories for "М\'ясо та птиця"...');

      const meatSubcategories = [
        { name: 'Свинина', slug: 'svynyna', order: 1 },
        { name: 'Яловичина', slug: 'yalovychyna', order: 2 },
        { name: 'Курятина', slug: 'kuryatyna', order: 3 },
        { name: 'Індичка', slug: 'indytychka', order: 4 },
        { name: 'Кролик', slug: 'krolyk', order: 5 },
        { name: 'Субпродукти', slug: 'subprodukty', order: 6 },
      ];

      for (const subcat of meatSubcategories) {
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
          `Підкатегорія м'яса: ${subcat.name}`,
          'active',
          subcat.order,
          savedCategories['m-yaso-ta-ptitsya'].id,
          new Date(),
          new Date()
        ]);

        console.log(`   ✅ Created subcategory: ${subcat.name}`);
      }
    }

    // Подкатегории для Хліб та випічка
    if (savedCategories['khlib-ta-vipichka']) {
      console.log('\n🥖 Creating subcategories for "Хліб та випічка"...');

      const breadSubcategories = [
        { name: 'Хліб', slug: 'khlib', order: 1 },
        { name: 'Булочки', slug: 'bulochky', order: 2 },
        { name: 'Пироги', slug: 'pyrohy', order: 3 },
        { name: 'Печиво', slug: 'pechyvo', order: 4 },
        { name: 'Торти', slug: 'torty', order: 5 },
        { name: 'Круасани', slug: 'kruasany', order: 6 },
      ];

      for (const subcat of breadSubcategories) {
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
          `Підкатегорія випічки: ${subcat.name}`,
          'active',
          subcat.order,
          savedCategories['khlib-ta-vipichka'].id,
          new Date(),
          new Date()
        ]);

        console.log(`   ✅ Created subcategory: ${subcat.name}`);
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

      children.forEach((child: any, index: number) => {
        const prefix = index === children.length - 1 ? '└──' : '├──';
        console.log(`│   ${prefix} ${child.name}`);
      });
    }

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