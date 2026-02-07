'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';
import { User, Role, UserStatus } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import {
  Button,
  Badge,
  Spinner,
  Pagination,
  Select,
  Input,
  Modal,
} from '@/components/ui';

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    user: User | null;
    action: 'suspend' | 'activate' | 'delete' | null;
  }>({ open: false, user: null, action: null });
  const [processing, setProcessing] = useState(false);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = { page, limit: pagination.limit };
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const response = await adminApi.getUsers(params);
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1);
  };

  // const handleAction = async () => {
  //   if (!actionModal.user || !actionModal.action) return;

  //   setProcessing(true);
  //   try {
  //     if (actionModal.action === 'delete') {
  //       await adminApi.deleteUser(actionModal.user.id);
  //       toast.success('User deleted successfully');
  //     } else {
  //       const newStatus =
  //         actionModal.action === 'suspend' ? 'SUSPENDED' : 'ACTIVE';
  //       await adminApi.updateUserStatus(actionModal.user.id, newStatus);
  //       toast.success(
  //         `User ${actionModal.action === 'suspend' ? 'suspended' : 'activated'} successfully`,
  //       );
  //     }
  //     setActionModal({ open: false, user: null, action: null });
  //     fetchUsers(pagination.page);
  //   } catch (error: any) {
  //     toast.error(error.response?.data?.error || 'Action failed');
  //   } finally {
  //     setProcessing(false);
  //   }
  // };

  const handleAction = async () => {
    if (!actionModal.user || !actionModal.action) return;

    setProcessing(true);
    try {
      if (actionModal.action === 'delete') {
        await adminApi.deleteUser(actionModal.user.id);
        toast.success('User deleted successfully');
      } else {
        const newStatus =
          actionModal.action === 'suspend'
            ? UserStatus.SUSPENDED
            : UserStatus.ACTIVE;
        await adminApi.updateUserStatus(actionModal.user.id, newStatus);
        toast.success(
          `User ${actionModal.action === 'suspend' ? 'suspended' : 'activated'} successfully`,
        );
      }
      setActionModal({ open: false, user: null, action: null });
      fetchUsers(pagination.page);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: Role.CUSTOMER, label: 'Customers' },
    { value: Role.PROVIDER, label: 'Providers' },
    { value: Role.ADMIN, label: 'Admins' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: UserStatus.ACTIVE, label: 'Active' },
    { value: UserStatus.SUSPENDED, label: 'Suspended' },
  ];

  return (
    <AuthGuard allowedRoles={[Role.ADMIN]}>
      <div className="page-container">
        <h1 className="page-title">User Management</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-40">
              <Select
                options={roleOptions}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-40">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </form>
        </div>

        {loading ? (
          <Spinner className="py-12" />
        ) : users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                            {user.providerProfile && (
                              <div className="text-xs text-primary-600">
                                {user.providerProfile.restaurantName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              user.role === Role.ADMIN
                                ? 'danger'
                                : user.role === Role.PROVIDER
                                  ? 'info'
                                  : 'default'
                            }
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              user.status === UserStatus.ACTIVE
                                ? 'success'
                                : 'danger'
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {user.role !== Role.ADMIN && (
                            <div className="flex justify-end gap-2">
                              {user.status === UserStatus.ACTIVE ? (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    setActionModal({
                                      open: true,
                                      user,
                                      action: 'suspend',
                                    })
                                  }
                                >
                                  Suspend
                                </Button>
                              ) : (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() =>
                                    setActionModal({
                                      open: true,
                                      user,
                                      action: 'activate',
                                    })
                                  }
                                >
                                  Activate
                                </Button>
                              )}
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  setActionModal({
                                    open: true,
                                    user,
                                    action: 'delete',
                                  })
                                }
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={fetchUsers}
                />
              </div>
            )}
          </>
        )}

        {/* Action Modal */}
        <Modal
          isOpen={actionModal.open}
          onClose={() =>
            setActionModal({ open: false, user: null, action: null })
          }
          title={
            actionModal.action === 'delete'
              ? 'Delete User'
              : actionModal.action === 'suspend'
                ? 'Suspend User'
                : 'Activate User'
          }
        >
          <div className="mt-2">
            <p className="text-gray-600">
              Are you sure you want to{' '}
              {actionModal.action === 'delete'
                ? 'permanently delete'
                : actionModal.action === 'suspend'
                  ? 'suspend'
                  : 'activate'}{' '}
              <strong>{actionModal.user?.name}</strong>?
              {actionModal.action === 'delete' &&
                ' This action cannot be undone.'}
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() =>
                setActionModal({ open: false, user: null, action: null })
              }
            >
              Cancel
            </Button>
            <Button
              variant={actionModal.action === 'activate' ? 'success' : 'danger'}
              onClick={handleAction}
              isLoading={processing}
            >
              {actionModal.action === 'delete'
                ? 'Delete'
                : actionModal.action === 'suspend'
                  ? 'Suspend'
                  : 'Activate'}
            </Button>
          </div>
        </Modal>
      </div>
    </AuthGuard>
  );
}
