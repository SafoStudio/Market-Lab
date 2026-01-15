import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProductStore } from '@/core/store/productStore';
import { useAuthStore } from '@/core/store/authStore';
import { productApi } from '@/core/api/product-api';

import {
  CreateProductDto,
  UpdateProductDto,
  RestockProductDto,
  ProductStatus,
} from '@/core/types/productTypes';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: any) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  supplierProducts: () => [...productKeys.all, 'supplier'] as const,
  ownership: (id: string) => [...productKeys.detail(id), 'ownership'] as const,
} as const;

/**
 * Hook for getting supplier's products
 */
export const useMyProducts = () => {
  const { token } = useAuthStore();
  const { setProducts, setLoading, setError } = useProductStore();

  return useQuery({
    queryKey: productKeys.supplierProducts(),
    queryFn: async () => {
      setLoading(true);
      try {
        const products = await productApi.getMyProducts(token!);
        setProducts(products);
        return products;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load products');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for creating a new product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const { addProduct, setLoading, setError, setSuccessMessage } = useProductStore();

  return useMutation({
    mutationFn: async (payload: { data: CreateProductDto; images: File[] }) => {
      setLoading(true);
      try {
        const product = await productApi.createProduct(
          payload.data,
          payload.images,
          token!
        );
        addProduct(product);
        setSuccessMessage('Product created successfully');
        return product;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to create product');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.supplierProducts() });
    },
  });
};

/**
 * Hook for updating a product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const { updateProduct, setLoading, setError, setSuccessMessage } = useProductStore();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      data: UpdateProductDto;
      images?: File[];
    }) => {
      setLoading(true);
      try {
        const product = await productApi.updateProduct(
          payload.id,
          payload.data,
          payload.images || [],
          token!
        );
        updateProduct(payload.id, product);
        setSuccessMessage('Product updated successfully');
        return product;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update product');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.supplierProducts() });
    },
  });
};

/**
 * Hook for deleting a product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const { deleteProduct, setLoading, setError, setSuccessMessage } = useProductStore();

  return useMutation({
    mutationFn: async (id: string) => {
      setLoading(true);
      try {
        await productApi.deleteProduct(id, token!);
        deleteProduct(id);
        setSuccessMessage('Product deleted successfully');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to delete product');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.supplierProducts() });
    },
  });
};

/**
 * Hook for updating product status
 */
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const { toggleProductStatus, setLoading, setError, setSuccessMessage } = useProductStore();

  return useMutation({
    mutationFn: async (payload: { id: string; status: ProductStatus }) => {
      setLoading(true);
      try {
        const product = await productApi.updateProductStatus(
          payload.id,
          payload.status,
          token!
        );
        toggleProductStatus(payload.id, payload.status);
        setSuccessMessage(`Product ${payload.status === 'active' ? 'activated' : 'deactivated'}`);
        return product;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update product status');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.supplierProducts() });
    },
  });
};

/**
 * Hook for restocking a product
 */
export const useRestockProduct = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const { restockProduct, setLoading, setError, setSuccessMessage } = useProductStore();

  return useMutation({
    mutationFn: async (payload: { id: string; data: RestockProductDto }) => {
      setLoading(true);
      try {
        const product = await productApi.restockProduct(
          payload.id,
          payload.data,
          token!
        );
        restockProduct(payload.id, payload.data.quantity);
        setSuccessMessage(`Restocked ${payload.data.quantity} units`);
        return product;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to restock product');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.supplierProducts() });
    },
  });
};

/**
 * Hook for adding images to product
 */
export const useAddProductImages = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const { updateProduct, setLoading, setError, setSuccessMessage } = useProductStore();

  return useMutation({
    mutationFn: async (payload: { id: string; images: File[] }) => {
      setLoading(true);
      try {
        const result = await productApi.addProductImages(
          payload.id,
          payload.images,
          token!
        );

        // Update product images in store
        const { products } = useProductStore.getState();
        const product = products.find(p => p.id === payload.id);
        if (product) {
          updateProduct(payload.id, {
            images: [...product.images, ...result.urls]
          });
        }

        setSuccessMessage(`${result.urls.length} image(s) added successfully`);
        return result;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to add images');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
};