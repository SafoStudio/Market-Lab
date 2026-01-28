import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductStatus } from '@/core/types/productTypes';

interface ProductStoreState {
  // Selected product (ID only)
  selectedProductId: string | null;

  // Filters
  searchQuery: string;
  selectedCategory: string | null;
  statusFilter: ProductStatus | 'all';

  // Sorting
  sortBy: 'name' | 'price' | 'stock' | 'createdAt';
  sortOrder: 'asc' | 'desc';

  // UI state
  loading: boolean;
  error: string | null;
  successMessage: string | null;

  // Actions
  setSelectedProductId: (productId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setStatusFilter: (status: ProductStatus | 'all') => void;
  setSort: (sortBy: 'name' | 'price' | 'stock' | 'createdAt', sortOrder?: 'asc' | 'desc') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  clearMessages: () => void;
  resetFilters: () => void;
}

const getInitialState = (): Omit<ProductStoreState,
  'setSelectedProductId' | 'setSearchQuery' | 'setSelectedCategory' |
  'setStatusFilter' | 'setSort' | 'setLoading' | 'setError' |
  'setSuccessMessage' | 'clearMessages' | 'resetFilters'
> => ({
  selectedProductId: null,
  searchQuery: '',
  selectedCategory: null,
  statusFilter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  loading: false,
  error: null,
  successMessage: null,
});

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setSelectedProductId: (productId) => set({ selectedProductId: productId }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      setStatusFilter: (status) => set({ statusFilter: status }),

      setSort: (sortBy, sortOrder = 'desc') => set({ sortBy, sortOrder }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      setSuccessMessage: (message) => set({ successMessage: message }),

      clearMessages: () => set({ error: null, successMessage: null }),

      resetFilters: () => set({
        searchQuery: '',
        selectedCategory: null,
        statusFilter: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    }),
    {
      name: 'product-filters-storage',
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory,
        statusFilter: state.statusFilter,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);