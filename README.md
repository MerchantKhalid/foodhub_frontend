# FoodHub Frontend

A modern, responsive Next.js application for a food delivery platform with role-based dashboards for Customers, Providers, and Admins.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI, Heroicons
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Notifications:** React Hot Toast
- **Date Utilities:** date-fns

## Features

### Customer Features

- Browse meals by category and dietary preferences
- Advanced filtering (price, rating, dietary info)
- View provider profiles and menus
- Add items to cart and place orders
- Track order status in real-time
- Write and manage reviews
- User profile management

### Provider Features

- Restaurant profile management
- Menu management (add, edit, delete meals)
- Order management and status updates
- View customer reviews
- Dashboard with analytics
- Opening hours configuration

### Admin Features

- User management (view, suspend, delete)
- Order oversight
- Category management
- Review moderation
- System-wide analytics

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd foodhub/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

### Development

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (admin)/             # Admin dashboard routes
│   │   │   └── admin/
│   │   │       ├── categories/
│   │   │       ├── orders/
│   │   │       ├── reviews/
│   │   │       ├── users/
│   │   │       └── page.tsx
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (customer)/          # Customer routes
│   │   │   ├── orders/
│   │   │   ├── profile/
│   │   │   └── reviews/
│   │   ├── (provider)/          # Provider dashboard routes
│   │   │   └── provider/
│   │   │       ├── dashboard/
│   │   │       ├── menu/
│   │   │       ├── orders/
│   │   │       ├── profile/
│   │   │       └── reviews/
│   │   ├── cart/                # Shopping cart
│   │   ├── checkout/            # Checkout process
│   │   ├── meals/               # Meal browsing
│   │   ├── providers/           # Provider listings
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/              # React components
│   │   ├── layouts/             # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── meals/               # Meal-related components
│   │   │   ├── MealCard.tsx
│   │   │   └── MealFilters.tsx
│   │   ├── orders/              # Order components
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   └── OrderStatusTracker.tsx
│   │   ├── providers/           # Provider components
│   │   │   └── AuthGuard.tsx
│   │   └── ui/                  # Reusable UI components
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Pagination.tsx
│   │       ├── Select.tsx
│   │       ├── Spinner.tsx
│   │       ├── StarRating.tsx
│   │       ├── Textarea.tsx
│   │       └── index.ts
│   ├── lib/                     # Utilities and configurations
│   │   ├── api.ts               # API client and endpoints
│   │   ├── store.ts             # Zustand state management
│   │   └── tailwind-merge.ts    # Tailwind utility
│   └── types/                   # TypeScript type definitions
│       ├── api.types            # API response types
│       └── index.ts             # Shared types
├── public/                      # Static assets
├── .env.example                 # Environment variables template
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## Key Features Explained

### Authentication

- JWT-based authentication
- Automatic token refresh
- Protected routes with AuthGuard
- Role-based access control

### State Management

The application uses Zustand for global state management:

- User authentication state
- Shopping cart
- UI preferences

### API Integration

All API calls are centralized in `src/lib/api.ts`:

- Automatic token injection
- Error handling
- Response type safety

### Routing

Uses Next.js 14 App Router with route groups:

- `(auth)` - Authentication pages (public)
- `(customer)` - Customer-only pages
- `(provider)` - Provider-only pages
- `(admin)` - Admin-only pages

### Styling

- Tailwind CSS for utility-first styling
- Responsive design (mobile-first)
- Dark mode support ready
- Custom color palette

## User Flows

### Customer Journey

1. Browse meals/providers on home page
2. Filter by category, price, or dietary preferences
3. View meal details and reviews
4. Add items to cart
5. Proceed to checkout
6. Track order status
7. Leave reviews after delivery

### Provider Journey

1. Create provider profile
2. Set up restaurant information
3. Add meals to menu
4. Manage meal availability
5. Receive and process orders
6. Update order status
7. View customer reviews

### Admin Journey

1. Monitor all users
2. Manage categories
3. Oversee all orders
4. Moderate reviews
5. Suspend/delete users if needed

## Environment Variables

```env
NEXT_PUBLIC_API_URL          # Backend API URL
```

## Components Guide

### UI Components

#### Button

```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

#### Input

```tsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

#### Modal

```tsx
<Modal isOpen={isOpen} onClose={closeModal} title="Confirm Action">
  <p>Are you sure?</p>
</Modal>
```

#### StarRating

```tsx
<StarRating rating={4.5} size="md" showValue />
```

## API Client Usage

```typescript
import { api } from '@/lib/api';

// Get all meals
const meals = await api.meals.getAll({ category: 'pizza' });

// Create order
const order = await api.orders.create({
  items: cartItems,
  deliveryAddress: address,
  contactPhone: phone,
});

// Update order status
await api.orders.updateStatus(orderId, 'CONFIRMED');
```

## State Management

```typescript
import { useStore } from '@/lib/store';

function Component() {
  const { user, cart, addToCart, removeFromCart } = useStore();

  // Use state...
}
```

## Forms

Forms use React Hook Form with Zod validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});
```

## Notifications

```typescript
import toast from 'react-hot-toast';

toast.success('Order placed successfully!');
toast.error('Failed to update profile');
toast.loading('Processing...');
```

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Extract reusable logic to custom hooks
   - Use TypeScript for type safety

2. **Performance**
   - Use Next.js Image component for images
   - Implement code splitting
   - Lazy load heavy components

3. **Accessibility**
   - Use semantic HTML
   - Include ARIA labels
   - Ensure keyboard navigation

4. **Security**
   - Never store sensitive data in localStorage
   - Validate all user inputs
   - Use HTTPS in production

## Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
```

### Other Platforms

```bash
npm run build
npm start
```

## Troubleshooting

### Common Issues

**API Connection Failed**

- Ensure backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings in backend

**Authentication Issues**

- Clear browser cache and cookies
- Check token expiration
- Verify JWT_SECRET matches backend

**Build Errors**

- Clear `.next` folder: `rm -rf .next`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
