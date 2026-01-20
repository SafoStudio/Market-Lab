import { apiFetch } from '@/core/utils/api-utils';
import { SUPPLIER_ENDPOINTS } from '@/core/constants/api-config';
import {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierDocument,
  SuppliersResponse,
  SupplierSearchParams,
  SupplierStatus
} from '@/core/types/supplierTypes';

/**
 * Supplier management API client
 * Includes both public and protected endpoints
 */
export const supplierApi = {
  /**
   * PUBLIC: Get list of active suppliers
   */
  getActiveSuppliers: async (): Promise<Supplier[]> => {
    return apiFetch<Supplier[]>(
      SUPPLIER_ENDPOINTS.PUBLIC_ACTIVE,
      { method: 'GET' }
    );
  },

  /**
   * PUBLIC: Get supplier by ID (public info)
   */
  getSupplierPublic: async (id: string): Promise<Supplier> => {
    return apiFetch<Supplier>(
      SUPPLIER_ENDPOINTS.PUBLIC_BY_ID(id),
      { method: 'GET' }
    );
  },

  /**
   * ADMIN: Get suppliers list with pagination and filters (admin only)
   */
  getSuppliersAdmin: async (
    token: string,
    params?: {
      page?: number;
      limit?: number;
      status?: SupplierStatus;
      companyName?: string;
      registrationNumber?: string;
    }
  ): Promise<SuppliersResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.companyName) searchParams.append('companyName', params.companyName);
    if (params?.registrationNumber) searchParams.append('registrationNumber', params.registrationNumber);

    const queryString = searchParams.toString();
    const url = queryString
      ? `${SUPPLIER_ENDPOINTS.ADMIN_LIST}?${queryString}`
      : SUPPLIER_ENDPOINTS.ADMIN_LIST;

    return apiFetch<SuppliersResponse>(
      url,
      { method: 'GET' },
      { token }
    );
  },

  /**
   * Get supplier by ID (requires auth - supplier or admin)
   */
  getSupplier: async (id: string, token: string): Promise<Supplier> => {
    return apiFetch<Supplier>(
      SUPPLIER_ENDPOINTS.SUPPLIER_BY_ID(id),
      { method: 'GET' },
      { token }
    );
  },

  /**
   * Get current supplier's profile (my profile)
   */
  getMyProfile: async (token: string): Promise<Supplier> => {
    return apiFetch<Supplier>(
      SUPPLIER_ENDPOINTS.PROFILE_MY,
      { method: 'GET' },
      { token }
    );
  },

  /**
   * Update current supplier's own profile
   */
  updateMyProfile: async (
    data: UpdateSupplierDto,
    token: string
  ): Promise<Supplier> => {
    return apiFetch<Supplier>(
      SUPPLIER_ENDPOINTS.PROFILE_UPDATE_SELF,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      { token }
    );
  },

  /**
   * Update any supplier profile (admin or owner)
   */
  updateSupplier: async (
    id: string,
    data: UpdateSupplierDto,
    token: string
  ): Promise<Supplier> => {
    return apiFetch<Supplier>(
      SUPPLIER_ENDPOINTS.SUPPLIER_UPDATE(id),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      { token }
    );
  },

  /**
   * ADMIN: Update supplier status (admin only)
   */
  updateSupplierStatus: async (
    id: string,
    status: SupplierStatus,
    token: string,
    reason?: string
  ): Promise<Supplier> => {
    return apiFetch<Supplier>(
      SUPPLIER_ENDPOINTS.ADMIN_UPDATE_STATUS(id),
      {
        method: 'PUT',
        body: JSON.stringify({ status, reason }),
      },
      { token }
    );
  },

  /**
   * Upload document for supplier
   */
  uploadDocuments: async (
    supplierId: string,
    files: File[],
    token: string
  ): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => { formData.append('files', file) });

    return apiFetch<{ urls: string[] }>(
      SUPPLIER_ENDPOINTS.DOCUMENTS_UPLOAD(supplierId),
      {
        method: 'POST',
        body: formData,
      },
      { token }
    ).then(response => response.urls);
  },

  /**
   * Get supplier documents
   */
  getDocuments: async (
    supplierId: string,
    token: string
  ): Promise<string[]> => {
    return apiFetch<string[]>(
      SUPPLIER_ENDPOINTS.DOCUMENTS_GET(supplierId),
      { method: 'GET' },
      { token }
    );
  },

  /**
   * Delete supplier document
   */
  deleteDocument: async (
    supplierId: string,
    documentUrl: string,
    token: string
  ): Promise<void> => {
    const encodedUrl = encodeURIComponent(documentUrl);

    return apiFetch<void>(
      SUPPLIER_ENDPOINTS.DOCUMENT_DELETE(supplierId, encodedUrl),
      { method: 'DELETE' },
      { token }
    );
  },

  /**
   * Delete supplier (admin or owner)
   */
  deleteSupplier: async (id: string, token: string): Promise<void> => {
    return apiFetch<void>(
      SUPPLIER_ENDPOINTS.SUPPLIER_DELETE(id),
      { method: 'DELETE' },
      { token }
    );
  },

} as const;