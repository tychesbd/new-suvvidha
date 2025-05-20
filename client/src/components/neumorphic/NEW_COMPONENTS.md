# Neumorphic UI Component Library - New Components

This document describes the newly added neumorphic components and how to use them in your application.

## List Component

The List component displays data in a soft, extruded list format with subtle shadows.

```jsx
import { List } from '../components/neumorphic';

<List variant="flat" spacing="md" dividers={true}>
  <List.Item>
    <List.ItemIcon>
      <i className="fas fa-user"></i>
    </List.ItemIcon>
    <List.ItemText 
      primary="John Doe" 
      secondary="Customer since 2022" 
    />
  </List.Item>
  <List.Item>
    <List.ItemIcon>
      <i className="fas fa-user"></i>
    </List.ItemIcon>
    <List.ItemText 
      primary="Jane Smith" 
      secondary="Customer since 2023" 
    />
  </List.Item>
</List>
```

**Props:**
- `variant`: 'flat', 'pressed', 'concave', 'convex'
- `spacing`: 'xs', 'sm', 'md', 'lg', 'xl'
- `dividers`: boolean
- `backgroundColor`: string (color code)

## Badge Component

The Badge component is a small status indicator with neumorphic styling.

```jsx
import { Badge, Avatar } from '../components/neumorphic';

// Standalone badge
<Badge content={5} color="primary" />

// Badge with content
<Badge content={3} color="error" overlap={true}>
  <Avatar>JD</Avatar>
</Badge>
```

**Props:**
- `variant`: 'flat', 'pressed', 'concave', 'convex'
- `color`: 'primary', 'secondary', 'success', 'warning', 'error', 'info' or custom color
- `size`: 'small', 'medium', 'large'
- `content`: string or number
- `max`: number (maximum value to display before showing '+' suffix)
- `showZero`: boolean
- `overlap`: boolean (position badge on top-right of children)

## Pagination Component

The Pagination component provides navigation through paginated data with neumorphic styling.

```jsx
import { Pagination } from '../components/neumorphic';
import { useState } from 'react';

const PaginationExample = () => {
  const [page, setPage] = useState(1);
  
  const handleChange = (event, value) => {
    setPage(value);
  };
  
  return (
    <Pagination 
      count={10} 
      page={page} 
      onChange={handleChange}
      variant="flat"
      size="medium"
      showFirstButton
      showLastButton
    />
  );
};
```

**Props:**
- `count`: number (required - total number of pages)
- `page`: number (required - current page)
- `onChange`: function(event, page) (callback when page changes)
- `variant`: 'flat', 'pressed', 'concave', 'convex'
- `size`: 'small', 'medium', 'large'
- `showFirstButton`: boolean
- `showLastButton`: boolean
- `siblingCount`: number (how many siblings to show)
- `boundaryCount`: number (how many boundary pages to show)

## Usage in Dashboard

These components are designed to work seamlessly with the NeumorphicDashboardLayout:

```jsx
import { List, Badge, Pagination } from '../components/neumorphic';
import NeumorphicDashboardLayout from '../components/layout/NeumorphicDashboardLayout';

const Dashboard = () => {
  return (
    <NeumorphicDashboardLayout>
      {/* Your dashboard content using the new components */}
    </NeumorphicDashboardLayout>
  );
};
```

The components are already integrated into the main neumorphic component library and can be imported directly from there.