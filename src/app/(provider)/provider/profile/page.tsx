'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Role } from '@/types';
import AuthGuard from '@/components/providers/AuthGuard';
import { Button, Input, Textarea } from '@/components/ui';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
});

const providerProfileSchema = z.object({
  restaurantName: z.string().min(2, 'Restaurant name is required'),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  openingHours: z.string().optional(),
  closingHours: z.string().optional(),
  cuisineType: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProfileForm = z.infer<typeof profileSchema>;
type ProviderProfileForm = z.infer<typeof providerProfileSchema>;

export default function ProviderProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingProvider, setIsUpdatingProvider] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerProvider,
    handleSubmit: handleProviderSubmit,
    formState: { errors: providerErrors },
    reset: resetProvider,
  } = useForm<ProviderProfileForm>({
    resolver: zodResolver(providerProfileSchema),
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        phone: user.phone || '',
      });

      if (user.providerProfile) {
        resetProvider({
          restaurantName: user.providerProfile.restaurantName,
          description: user.providerProfile.description || '',
          address: user.providerProfile.address,
          openingHours: user.providerProfile.openingHours || '09:00',
          closingHours: user.providerProfile.closingHours || '22:00',
          cuisineType: user.providerProfile.cuisineType || '',
          imageUrl: user.providerProfile.imageUrl || '',
        });
      }
    }
  }, [user, resetProfile, resetProvider]);

  const onProfileSubmit = async (data: ProfileForm) => {
    setIsUpdatingProfile(true);
    try {
      const response = await authApi.updateProfile(data);
      updateUser(response.data.data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onProviderSubmit = async (data: ProviderProfileForm) => {
    setIsUpdatingProvider(true);
    try {
      const response = await authApi.updateProviderProfile({
        ...data,
        imageUrl: data.imageUrl || undefined,
      });
      updateUser({ providerProfile: response.data.data });
      toast.success('Restaurant profile updated successfully');
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || 'Failed to update restaurant profile',
      );
    } finally {
      setIsUpdatingProvider(false);
    }
  };

  return (
    <AuthGuard allowedRoles={[Role.PROVIDER]}>
      <div className="page-container">
        <h1 className="page-title">Profile Settings</h1>

        <div className="max-w-2xl space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <form
              onSubmit={handleProfileSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <Input
                label="Your Name"
                {...registerProfile('name')}
                error={profileErrors.name?.message}
              />
              <Input
                label="Phone Number"
                type="tel"
                {...registerProfile('phone')}
                error={profileErrors.phone?.message}
              />
              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-2">
                  Email: {user?.email}
                </p>
              </div>
              <Button
                type="submit"
                variant="primary"
                isLoading={isUpdatingProfile}
              >
                Save Changes
              </Button>
            </form>
          </div>

          {/* Restaurant Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Restaurant Information
            </h2>
            <form
              onSubmit={handleProviderSubmit(onProviderSubmit)}
              className="space-y-4"
            >
              <Input
                label="Restaurant Name"
                {...registerProvider('restaurantName')}
                error={providerErrors.restaurantName?.message}
              />

              <Textarea
                label="Description"
                rows={3}
                placeholder="Tell customers about your restaurant..."
                {...registerProvider('description')}
                error={providerErrors.description?.message}
              />

              <Input
                label="Address"
                {...registerProvider('address')}
                error={providerErrors.address?.message}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Opening Hours"
                  type="time"
                  {...registerProvider('openingHours')}
                />
                <Input
                  label="Closing Hours"
                  type="time"
                  {...registerProvider('closingHours')}
                />
              </div>

              <Input
                label="Cuisine Type"
                placeholder="e.g., Italian, Mexican, Asian"
                {...registerProvider('cuisineType')}
              />

              <Input
                label="Restaurant Image URL"
                type="url"
                placeholder="https://example.com/image.jpg"
                {...registerProvider('imageUrl')}
                error={providerErrors.imageUrl?.message}
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isUpdatingProvider}
              >
                Save Restaurant Info
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
