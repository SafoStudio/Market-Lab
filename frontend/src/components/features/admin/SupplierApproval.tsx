'use client';

import { useState } from 'react';
import { useAdminSuppliers, useUpdateSupplierStatus } from '@/core/hooks/useSupplier';
import { Button } from '@/components/ui/button/Button';
import { SupplierStatus } from '@/core/types/supplierTypes';
import { formatDate, getStatusColor } from '@/core/utils';


export function SupplierApproval() {
  const [filters, setFilters] = useState({
    status: 'pending' as SupplierStatus | undefined,
    companyName: undefined as string | undefined,
    page: 1,
    limit: 20,
  });

  const { data: suppliersData, isLoading } = useAdminSuppliers(filters);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateSupplierStatus();

  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter handlers
  const handleStatusFilter = (status: SupplierStatus | 'all') => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      page: 1,
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      companyName: query || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Status update handlers
  const handleApprove = (supplierId: string) => {
    if (confirm('Approve this supplier?')) {
      updateStatus({
        id: supplierId,
        status: 'approved' as SupplierStatus,
        reason: 'Supplier approved by administrator'
      });
    }
  };

  const handleReject = (supplierId: string) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      updateStatus({
        id: supplierId,
        status: 'rejected' as SupplierStatus,
        reason: reason
      });
    }
  };

  const handleSuspend = (supplierId: string) => {
    const reason = prompt('Please enter suspension reason:');
    if (reason) {
      updateStatus({
        id: supplierId,
        status: 'suspended' as SupplierStatus,
        reason: reason
      });
    }
  };

  // Destructure data
  const suppliers = suppliersData?.suppliers || [];
  const pagination = suppliersData?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading suppliers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Supplier Approval</h2>
          <p className="text-gray-600">Review and approve pending supplier applications</p>
        </div>
        <div className="text-sm text-gray-500">Total: {pagination.total} suppliers</div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected', 'suspended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-3 py-1 rounded text-sm ${filters.status === (status === 'all' ? undefined : status)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by company name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier List */}
        <div className="lg:col-span-2 space-y-4">
          {suppliers.length === 0 ? (
            <div className="p-6 rounded-lg border bg-white text-center text-gray-500">
              No suppliers found
            </div>
          ) : (
            suppliers.map((supplier) => (
              <div key={supplier.id} className="p-6 rounded-lg border bg-white">
                <div className="flex justify-between items-start">
                  {/* Supplier Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{supplier.companyName}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(supplier.status)}`}>
                        {supplier.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Contact: {supplier.firstName} {supplier.lastName}</div>
                      <div>Email: {supplier.email}</div>
                      <div>Phone: {supplier.phone}</div>
                      <div>Registration: {supplier.registrationNumber}</div>
                      <div>Applied: {formatDate(supplier.createdAt)}</div>
                    </div>

                    {/* Documents */}
                    {supplier.documents?.length > 0 && (
                      <div className="pt-2">
                        <h4 className="font-medium text-sm mb-2">Documents:</h4>
                        <div className="flex flex-wrap gap-2">
                          {supplier.documents.map((doc: string, index: number) => (
                            <a
                              key={index}
                              href={doc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-sm rounded border bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              Document {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    {supplier.status === 'pending' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(supplier.id)}
                          disabled={isUpdating}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(supplier.id)}
                          disabled={isUpdating}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {supplier.status === 'approved' && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleSuspend(supplier.id)}
                        disabled={isUpdating}
                      >
                        Suspend
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedSupplier(
                        selectedSupplier?.id === supplier.id ? null : supplier
                      )}
                    >
                      {selectedSupplier?.id === supplier.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedSupplier?.id === supplier.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Company Information</h4>
                        <div className="text-sm space-y-1">
                          <div><span className="font-medium">Description:</span> {supplier.description || 'No description'}</div>
                          <div><span className="font-medium">Documents:</span> {supplier.documents?.length || 0} uploaded</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Verification Checklist</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" checked={supplier.documents?.length > 0} readOnly />
                            Documents uploaded
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" checked={!!supplier.registrationNumber} readOnly />
                            Registration number verified
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" checked={!!supplier.email} readOnly />
                            Email verified
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Sidebar Statistics */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-lg border bg-white sticky top-6">
            <h3 className="font-semibold text-lg mb-4">Supplier Approval Statistics</h3>

            <div className="space-y-3">
              {['pending', 'approved', 'rejected', 'suspended'].map((status) => {
                const count = suppliers.filter(s => s.status === status).length;
                return (
                  <div key={status} className="flex justify-between items-center">
                    <span className="capitalize">{status}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-2">Approval Guidelines</h4>
              <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-600">
                <li>Review all uploaded documents</li>
                <li>Verify business registration</li>
                <li>Check contact information</li>
                <li>Approve if all criteria are met</li>
                <li>Provide reason for rejection/suspension</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            disabled={filters.page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            onClick={() => handlePageChange(filters.page - 1)}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {filters.page} of {pagination.totalPages}
          </span>
          <button
            disabled={filters.page >= pagination.totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            onClick={() => handlePageChange(filters.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}