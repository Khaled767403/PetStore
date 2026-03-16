import type { Product, AnimalType, ProductTypeCategory } from './types';

import dogImg from '@/assets/pets/dog.jpg';
import catImg from '@/assets/pets/cat.jpg';
import birdImg from '@/assets/pets/bird.jpg';
import fishImg from '@/assets/pets/fish.jpg';
import otherImg from '@/assets/pets/other.jpg';

export const mockAnimals: AnimalType[] = [
  {
    id: 1, name: 'Dog', imageUrl: dogImg, categories: [{ id: 1, name: 'Food', animalTypeId: 1 }, { id: 2, name: 'Toys', animalTypeId: 1 }, { id: 3, name: 'Grooming', animalTypeId: 1 }],
    slug: ''
  },
  {
    id: 2, name: 'Cat', imageUrl: catImg, categories: [{ id: 4, name: 'Food', animalTypeId: 2 }, { id: 5, name: 'Toys', animalTypeId: 2 }, { id: 6, name: 'Litter', animalTypeId: 2 }],
    slug: ''
  },
  {
    id: 3, name: 'Bird', imageUrl: birdImg, categories: [{ id: 7, name: 'Food', animalTypeId: 3 }, { id: 8, name: 'Cages', animalTypeId: 3 }],
    slug: ''
  },
  {
    id: 4, name: 'Fish', imageUrl: fishImg, categories: [{ id: 9, name: 'Food', animalTypeId: 4 }, { id: 10, name: 'Aquariums', animalTypeId: 4 }],
    slug: ''
  },
  {
    id: 5, name: 'Other', imageUrl: otherImg, categories: [{ id: 11, name: 'Food', animalTypeId: 5 }, { id: 12, name: 'Supplies', animalTypeId: 5 }],
    slug: ''
  },
];

export const mockProductTypes: ProductTypeCategory[] = [
  { id: 1, name: 'Food' },
  { id: 2, name: 'Treats' },
  { id: 3, name: 'Supplies' },
  { id: 4, name: 'Grooming' },
  { id: 5, name: 'Cleaning' },
];

const productImages = [
  'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583337130417-13104dec14a3?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
];

const titles = [
  'Premium Dog Food - Chicken & Rice',
  'Natural Cat Treats - Salmon',
  'Bird Seed Mix - Tropical',
  'Fish Flakes - Color Enhancing',
  'Dog Chew Toy - Durable Rope',
  'Cat Scratching Post - Sisal',
  'Aquarium Filter - 50 Gallon',
  'Pet Shampoo - Oatmeal Formula',
  'Dog Collar - Adjustable Nylon',
  'Cat Litter - Clumping Clay',
  'Bird Cage - Large Bamboo',
  'Fish Tank Decor - Coral Reef',
];

export const mockProducts: Product[] = titles.map((title, i) => ({
  id: i + 1,
  title,
  originalPrice: Math.floor(Math.random() * 200) + 50,
  finalPrice: Math.floor(Math.random() * 150) + 30,
  discountPercent: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : 0,
  quantityOnHand: Math.floor(Math.random() * 100) + 1,
  status: 1,
  ratingAvg: Math.round((Math.random() * 2 + 3) * 10) / 10,
  ratingCount: Math.floor(Math.random() * 200) + 5,
  mainImageUrl: productImages[i % productImages.length],
  offerSource: i % 3 === 0 ? 'Bundle' : undefined,
}));
