import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Company } from './company/company.entity';
import { Product } from './product/product.entity';
import { Category } from './category/category.entity';
import { Subcategory } from './subcategory/subcategory.entity';

export const databaseConfig = {
  get: (key: string) => {
    const env = {
      'app.database.host': 'localhost',
      'app.database.port': 3306,
      'app.database.user': 'root',
      'app.database.password': '',
      'app.database.name': 'shopping',
    };
    return env[key];
  },
};

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: databaseConfig.get('app.database.host'),
  port: databaseConfig.get('app.database.port'),
  username: databaseConfig.get('app.database.user'),
  password: '',
  database: databaseConfig.get('app.database.name'),
  entities: [User, Company, Product, Category, Subcategory],
  migrations: ['./migrations/*.ts'],
  synchronize: false,
});
