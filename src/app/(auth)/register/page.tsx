'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Role } from '@/types';
import { Button, Input, Select, Textarea } from '@/components/ui';

const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name is required'),
    phone: z.string().optional(),
    role: z.enum(['CUSTOMER', 'PROVIDER']),
    // Provider fields
    restaurantName: z.string().optional(),
    restaurantAddress: z.string().optional(),
    restaurantDescription: z.string().optional(),
    cuisineType: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.role === 'PROVIDER') {
        return data.restaurantName && data.restaurantAddress;
      }
      return true;
    },
    {
      message: 'Restaurant name and address are required for providers',
      path: ['restaurantName'],
    },
  );

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const {
        confirmPassword,
        restaurantAddress,
        restaurantDescription,
        cuisineType,
        ...rest
      } = data;

      const registerData = {
        ...rest,
        role: data.role as Role,

        restaurantAddress: restaurantAddress,
        description: restaurantDescription,
      };

      const response = await authApi.register(registerData);
      const { user, token } = response.data.data;

      setAuth(user, token);
      toast.success('Registration successful!');

      if (user.role === Role.PROVIDER) {
        router.push('/provider/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'CUSTOMER', label: 'Customer - Order delicious meals' },
    { value: 'PROVIDER', label: 'Provider - Sell your food' },
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Join FoodHub today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Select
              label="I want to..."
              options={roleOptions}
              {...register('role')}
              error={errors.role?.message}
            />

            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
            />

            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
            />

            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            {/* Provider-specific fields */}
            {selectedRole === 'PROVIDER' && (
              <div className="border-t pt-4 mt-4 space-y-4">
                <h3 className="font-medium text-gray-900">
                  Restaurant Information
                </h3>

                <Input
                  label="Restaurant Name"
                  {...register('restaurantName')}
                  error={errors.restaurantName?.message}
                />

                <Input
                  label="Restaurant Address"
                  {...register('restaurantAddress')}
                  error={errors.restaurantAddress?.message}
                />

                <Input
                  label="Cuisine Type"
                  placeholder="e.g., Italian, Mexican, Asian"
                  {...register('cuisineType')}
                />

                <Textarea
                  label="Description (Optional)"
                  rows={3}
                  placeholder="Tell customers about your restaurant..."
                  {...register('restaurantDescription')}
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Create Account
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
