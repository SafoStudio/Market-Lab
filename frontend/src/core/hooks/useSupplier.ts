import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupplierStore } from '@/core/store/supplierStore';
import { useAuthStore } from '@/core/store/authStore';
import { supplierApi } from '@/core/api/supplier-api';
import {
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierSearchParams,
  SupplierStatus,
} from '@/core/types/supplierTypes';

// Query keys
export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (filters: any) => [...supplierKeys.lists(), filters] as const,
  adminList: (filters: any) => [...supplierKeys.all, 'admin', 'list', filters] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
  profile: () => [...supplierKeys.all, 'profile'] as const,
  documents: (supplierId: string) => [...supplierKeys.detail(supplierId), 'documents'] as const,
  public: (id: string) => [...supplierKeys.all, 'public', id] as const,
  active: () => [...supplierKeys.all, 'active'] as const,
} as const;

/**
 * Hook for getting active suppliers (public)
 */
export const useActiveSuppliers = () => {
  return useQuery({
    queryKey: supplierKeys.active(),
    queryFn: () => supplierApi.getActiveSuppliers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for getting supplier public info
 */
export const useSupplierPublic = (id: string) => {
  return useQuery({
    queryKey: supplierKeys.public(id),
    queryFn: () => supplierApi.getSupplierPublic(id),
    enabled: !!id,
  });
};

/**
 * ADMIN: Hook for getting suppliers list with pagination and filters (admin only)
 */
export const useAdminSuppliers = (filters?: {
  page?: number;
  limit?: number;
  status?: SupplierStatus;
  companyName?: string;
  registrationNumber?: string;
}) => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: supplierKeys.adminList(filters || {}),
    queryFn: async () => {
      return await supplierApi.getSuppliersAdmin(token!, filters);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for getting specific supplier
 */
export const useSupplier = (id: string) => {
  const { token } = useAuthStore();
  const { setSelectedSupplier } = useSupplierStore();

  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: async () => {
      const data = await supplierApi.getSupplier(id, token!);
      setSelectedSupplier(data);
      return data;
    },
    enabled: !!token && !!id,
  });
};

/**
 * Hook for getting current supplier profile
 */
export const useMySupplierProfile = () => {
  const { token } = useAuthStore();
  const { setCurrentSupplier } = useSupplierStore();

  return useQuery({
    queryKey: supplierKeys.profile(),
    queryFn: async () => {
      const data = await supplierApi.getMyProfile(token!);
      setCurrentSupplier(data);
      return data;
    },
    enabled: !!token,
    retry: 1,
  });
};

/**
 * Hook for updating current supplier's own profile
 */
export const useUpdateMySupplierProfile = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const { setCurrentSupplier } = useSupplierStore();

  return useMutation({
    mutationFn: (data: UpdateSupplierDto) =>
      supplierApi.updateMyProfile(data, token!),
    onSuccess: (updatedSupplier) => {
      setCurrentSupplier(updatedSupplier);
      queryClient.invalidateQueries({ queryKey: supplierKeys.profile() });
      queryClient.invalidateQueries({
        queryKey: supplierKeys.detail(updatedSupplier.id)
      });
    },
  });
};

/**
 * Hook for updating any supplier profile (admin or owner)
 */
export const useUpdateSupplier = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupplierDto }) =>
      supplierApi.updateSupplier(id, data, token!),
    onSuccess: (updatedSupplier) => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.detail(updatedSupplier.id)
      });
      queryClient.invalidateQueries({
        queryKey: supplierKeys.adminList({})
      });
    },
  });
};

/**
 * Hook for updating supplier status (admin only) - NEW VERSION
 */
export const useUpdateSupplierStatus = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      reason
    }: {
      id: string;
      status: SupplierStatus;
      reason?: string;
    }) => supplierApi.updateSupplierStatus(id, status, reason || '', token!),
    onSuccess: (updatedSupplier) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.adminList({}) });
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: supplierKeys.detail(updatedSupplier.id)
      });
      queryClient.invalidateQueries({ queryKey: supplierKeys.profile() });
    },
  });
};

/**
 * Hook for uploading supplier document
 */
export const useUploadSupplierDocuments = () => {
  const { token } = useAuthStore();
  const { currentSupplier, addDocuments } = useSupplierStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => {
      if (!currentSupplier) throw new Error('No current supplier');
      return supplierApi.uploadDocuments(currentSupplier.id, files, token!);
    },
    onSuccess: (urls) => {
      addDocuments(urls);
      if (currentSupplier) {
        queryClient.invalidateQueries({
          queryKey: supplierKeys.documents(currentSupplier.id)
        });
        queryClient.invalidateQueries({
          queryKey: supplierKeys.profile()
        });
      }
    },
  });
};

/**
 * Hook for getting supplier documents
 */
export const useSupplierDocuments = (supplierId: string) => {
  const { token } = useAuthStore();
  const { setDocuments } = useSupplierStore();

  return useQuery({
    queryKey: supplierKeys.documents(supplierId),
    queryFn: async () => {
      const documents = await supplierApi.getDocuments(supplierId, token!);
      setDocuments(documents);
      return documents;
    },
    enabled: !!token && !!supplierId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook for deleting supplier document
 */
export const useDeleteSupplierDocument = () => {
  const { token } = useAuthStore();
  const { currentSupplier, removeDocumentByUrl } = useSupplierStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentUrl: string) => {
      if (!currentSupplier) throw new Error('No current supplier');
      return supplierApi.deleteDocument(
        currentSupplier.id,
        documentUrl,
        token!
      );
    },
    onSuccess: (_, documentUrl) => {
      removeDocumentByUrl(documentUrl);
      if (currentSupplier) {
        queryClient.invalidateQueries({
          queryKey: supplierKeys.documents(currentSupplier.id)
        });
        queryClient.invalidateQueries({
          queryKey: supplierKeys.profile()
        });
      }
    },
  });
};

/**
 * Hook for deleting supplier (admin or owner)
 */
export const useDeleteSupplier = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supplierApi.deleteSupplier(id, token!),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.adminList({}) });
      queryClient.invalidateQueries({
        queryKey: supplierKeys.detail(id)
      });
    },
  });
};


/**
 * Hook for bulk supplier approval (admin only)
 */
export const useBulkApproveSuppliers = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      supplierIds,
      reason = 'Bulk approval'
    }: {
      supplierIds: string[];
      reason?: string;
    }) => {
      const promises = supplierIds.map(id =>
        supplierApi.updateSupplierStatus(id, 'approved', reason, token!)
      );
      return await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.adminList({}) });
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
};

/**
 * Hook for supplier statistics (admin only)
 */
export const useSupplierStatistics = () => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: [...supplierKeys.all, 'statistics'],
    queryFn: async () => {
      // Получаем все статусы для подсчета статистики
      const [pending, approved, rejected, suspended] = await Promise.all([
        supplierApi.getSuppliersAdmin(token!, { status: 'pending', limit: 1 }),
        supplierApi.getSuppliersAdmin(token!, { status: 'approved', limit: 1 }),
        supplierApi.getSuppliersAdmin(token!, { status: 'rejected', limit: 1 }),
        supplierApi.getSuppliersAdmin(token!, { status: 'suspended', limit: 1 }),
      ]);

      return {
        pending: pending.pagination?.total || 0,
        approved: approved.pagination?.total || 0,
        rejected: rejected.pagination?.total || 0,
        suspended: suspended.pagination?.total || 0,
        total: [pending, approved, rejected, suspended]
          .reduce((sum, data) => sum + (data.pagination?.total || 0), 0)
      };
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};