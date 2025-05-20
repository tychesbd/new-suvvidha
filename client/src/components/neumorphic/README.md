# Neumorphic UI Component Library

A custom UI component library implementing the Neumorphic design style with soft, extruded elements that appear to push through the surface. This design system uses subtle dual shadows (both light and dark) to create a physical, tactile feel.

## Design Principles

- **Soft Extrusion**: Elements appear to be extruded from the background surface
- **Subtle Shadows**: Uses both light and dark shadows to create depth
- **Monochromatic**: Primarily uses a light gray (#e0e0e0) background with minimal color accents
- **Tactile Feel**: Interactive elements have soft pressed effects on interaction
- **No Hard Borders**: Elements are defined by shadows rather than borders

## Components

### Button

A soft, extruded button with subtle shadows and pressed effect on interaction.

```jsx
import { Button } from '../components/neumorphic';

<Button variant="primary" onClick={handleClick}>Click Me</Button>
```

**Props:**
- `variant`: 'primary', 'secondary', 'success', 'error', 'warning', 'info', 'text'
- `size`: 'small', 'medium', 'large'
- `disabled`: boolean
- `fullWidth`: boolean

### Card

A soft, extruded card container with subtle shadows.

```jsx
import { Card } from '../components/neumorphic';

<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>
```

**Props:**
- `variant`: 'flat', 'pressed', 'concave', 'convex'
- `elevation`: 'small', 'medium', 'large'
- `backgroundColor`: string (color code)
- `padding`: string (CSS padding value)

### TextField

A soft, inset text input with subtle shadows.

```jsx
import { TextField } from '../components/neumorphic';

<TextField 
  label="Username" 
  value={username} 
  onChange={(e) => setUsername(e.target.value)} 
/>
```

**Props:**
- `label`: string
- `value`: string or number
- `onChange`: function
- `placeholder`: string
- `type`: string (HTML input type)
- `disabled`: boolean
- `fullWidth`: boolean
- `error`: boolean
- `helperText`: string

### Table

A soft, extruded table with subtle shadows and monochromatic styling.

```jsx
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '../components/neumorphic';

<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell header>Name</TableCell>
        <TableCell header>Email</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>John Doe</TableCell>
        <TableCell>john@example.com</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
```

### Chip

A soft, extruded chip with subtle shadows for status indicators and tags.

```jsx
import { Chip } from '../components/neumorphic';

<Chip label="Active" variant="success" />
```

**Props:**
- `label`: string or node
- `variant`: 'default', 'primary', 'secondary', 'success', 'error', 'warning', 'info'
- `size`: 'small', 'medium', 'large'
- `onDelete`: function (optional)
- `icon`: node (optional)

## Theme and Utilities

The library includes a theme object with colors, shadows, spacing, and utility functions:

```jsx
import { colors, shadows, borderRadius, spacing, createNeumorphicStyle } from '../components/neumorphic';

// Example custom component with neumorphic styling
const customStyle = {
  ...createNeumorphicStyle('flat'),
  padding: spacing.md,
  color: colors.text.primary
};
```

## Global Styles

Import the global neumorphic styles in your application:

```jsx
import '../neumorphic.css';
```

You can also use the provided CSS classes:

- `.neumorphic-container`: For extruded container elements
- `.neumorphic-inset`: For inset/pressed elements
- `.neumorphic-button`: For button elements with hover/active effects

## Usage Example

To see a complete implementation, check out the `NeumorphicDashboard.js` component which showcases the neumorphic UI design system.

Access the demo at: `/neumorphic-dashboard` (requires admin login)