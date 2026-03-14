export interface Product {
  id: number;
  title: string;
  originalPrice: number;
  finalPrice: number;
  discountPercent: number;
  quantityOnHand: number;
  status: number;
  ratingAvg: number;
  ratingCount: number;
  mainImageUrl: string | null;
  offerSource?: string;
}

export interface ProductDetails extends Product {
  description: string | null;
  imageUrls: string[];
  animalTypeIds: number[];
  animalCategoryIds: number[];
  productTypeCategoryIds: number[];
}

export interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  title: string;
  image: string;
}

export interface TreeNodeDto {
  id: number;
  name: string;
  slug: string;
  children: TreeNodeDto[];
}

export interface AnimalCategory {
  id: number;
  name: string;
  slug?: string;
  animalTypeId: number;
  parentId?: number | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface AnimalType {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  isActive?: boolean;
  categories: AnimalCategory[];
}

export interface ProductTypeCategory {
  id: number;
  name: string;
  slug?: string;
  parentId?: number | null;
  sortOrder?: number;
  isActive?: boolean;
  children?: ProductTypeCategory[];
}

export interface AnimalTreeDto {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  categories: TreeNodeDto[];
}

export interface TreesResponse {
  animals: AnimalTreeDto[];
  productTypes: TreeNodeDto[];
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  paymentMethod: number;
  items: CartItemRequest[];
}

export interface OrderResponse {
  orderNumber: string;
  status: number;
  total: number;
  currency: string;
  paymentInstructions: string;
  whatsappUrl?: string;
  whatsAppUrl?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface Offer {
  id: number;
  scopeType: number;
  scopeId: number;
  percent: number;
  isActive: boolean;
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
}

export interface CreateOfferRequest {
  scopeType: number;
  scopeId: number;
  percent: number;
  startAt: string | null;
  endAt: string | null;
  isActive: boolean;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  status: number;
  total: number;
  createdAt: string;
  confirmedAt?: string | null;
}

export interface OrderItem {
  productId: number;
  productTitleSnapshot: string;
  productMainImageSnapshot: string | null;
  unitPriceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDetails {
  id: number;
  orderNumber: string;
  status: number;
  paymentMethod: number;
  subtotal: number;
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string | null;
  createdAt: string;
  confirmedAt: string | null;
  items: OrderItem[];
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  whatsappTemplate?: string;
  instapayHandle: string;
  walletNumber: string;
  currency: string;
}

export interface CreateAnimalTypeRequest {
  name: string;
  slug: string;
  imageUrl?: string | null;
}

export interface CreateAnimalCategoryRequest {
  animalTypeId: number;
  parentId: number | null;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface CreateProductTypeCategoryRequest {
  parentId: number | null;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface CreateProductRequest {
  title: string;
  description: string | null;
  price: number;
  discountPercent: number | null;
  quantityOnHand: number;
  status: number;
  imageUrls: string[];
  animalTypeIds: number[];
  animalCategoryIds: number[];
  productTypeCategoryIds: number[];
}

export interface UpdateProductRequest extends CreateProductRequest {}

export interface AdminAnimalTypeDto {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  isActive: boolean;
}

export interface AdminAnimalCategoryDto {
  id: number;
  animalTypeId: number;
  parentId: number | null;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AdminProductTypeCategoryDto {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
}