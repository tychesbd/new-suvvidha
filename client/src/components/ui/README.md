# Dashboard UI Components

This directory contains modern UI components used to enhance the dashboard interfaces across the application. These components replace Material UI with more attractive and precise UI elements.

## Components

### DashboardCard

A modern, visually appealing card component for displaying statistics and metrics on dashboards.

```jsx
<DashboardCard 
  title="Users" 
  value={100} 
  icon={<PeopleIcon fontSize="large" />} 
  color="primary" 
/>
```

**Props:**
- `title`: The title of the card
- `value`: The value to display (number or formatted string)
- `icon`: The icon to display
- `color`: The color theme (primary, secondary, error, warning, info, success)

### SubscriptionStatusCard

A comprehensive card for displaying subscription information with visual indicators.

```jsx
<SubscriptionStatusCard subscription={subscriptionData} />
```

**Props:**
- `subscription`: An object containing subscription details

### Utils

Utility functions for UI components.

```jsx
import { formatCurrency, cn } from './utils';

// Format currency
formatCurrency(1000); // ₹1,000

// Combine class names with Tailwind CSS
cn('text-red-500', isActive && 'font-bold');
```

## Usage

These components are designed to create more attractive and precise dashboards. They are used in the admin, vendor, and customer dashboard interfaces.

## Implementation

The components use Material UI as a base but enhance it with modern styling techniques to create a more visually appealing interface. Future updates may fully transition to Shadcn UI components.