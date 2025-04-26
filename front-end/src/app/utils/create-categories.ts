import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const categories = [
  {
    name: 'Men',
    description: 'Men\'s clothing and accessories',
    isActive: true
  },
  {
    name: 'Women',
    description: 'Women\'s clothing and accessories',
    isActive: true
  },
  {
    name: 'Unisex',
    description: 'Unisex clothing and accessories',
    isActive: true
  }
];

export async function createCategories(http: HttpClient) {
  const apiUrl = 'http://localhost:5000/api/category/categories';
  
  for (const category of categories) {
    try {
      await firstValueFrom(http.post(apiUrl, category));
      console.log(`Created category: ${category.name}`);
    } catch (error) {
      console.error(`Error creating category ${category.name}:`, error);
    }
  }
} 