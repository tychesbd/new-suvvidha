import React from 'react';
import PropTypes from 'prop-types';
import { createNeumorphicStyle, colors, spacing } from './theme';

/**
 * Neumorphic Pagination Component
 * A component for navigating through paginated data with neumorphic styling
 */
const Pagination = ({
  count,
  page,
  onChange,
  variant = 'flat',
  size = 'medium',
  showFirstButton = false,
  showLastButton = false,
  siblingCount = 1,
  boundaryCount = 1,
  style,
  ...props
}) => {
  // Size dimensions
  const sizeMap = {
    small: {
      width: '24px',
      height: '24px',
      fontSize: '0.75rem'
    },
    medium: {
      width: '32px',
      height: '32px',
      fontSize: '0.875rem'
    },
    large: {
      width: '40px',
      height: '40px',
      fontSize: '1rem'
    }
  };

  // Generate page numbers to display
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );

  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1
  );

  // Determine if ellipses are needed
  const showStartEllipsis = siblingsStart > boundaryCount + 2;
  const showEndEllipsis = siblingsEnd < count - boundaryCount - 1;

  const itemList = [
    ...(showFirstButton ? ['first'] : []),
    'previous',
    ...startPages,
    ...(showStartEllipsis ? ['start-ellipsis'] : []),
    ...range(siblingsStart, siblingsEnd),
    ...(showEndEllipsis ? ['end-ellipsis'] : []),
    ...endPages,
    'next',
    ...(showLastButton ? ['last'] : [])
  ];

  // Handle page change
  const handleClick = (event, value) => {
    if (onChange) {
      onChange(event, value);
    }
  };

  // Render pagination item
  const renderItem = (item) => {
    // Special items
    if (item === 'first') {
      return (
        <PaginationItem
          key="first"
          onClick={(e) => handleClick(e, 1)}
          disabled={page === 1}
          variant={variant}
          size={size}
          type="first"
        />
      );
    }

    if (item === 'previous') {
      return (
        <PaginationItem
          key="previous"
          onClick={(e) => handleClick(e, page - 1)}
          disabled={page === 1}
          variant={variant}
          size={size}
          type="previous"
        />
      );
    }

    if (item === 'next') {
      return (
        <PaginationItem
          key="next"
          onClick={(e) => handleClick(e, page + 1)}
          disabled={page === count}
          variant={variant}
          size={size}
          type="next"
        />
      );
    }

    if (item === 'last') {
      return (
        <PaginationItem
          key="last"
          onClick={(e) => handleClick(e, count)}
          disabled={page === count}
          variant={variant}
          size={size}
          type="last"
        />
      );
    }

    if (item === 'start-ellipsis' || item === 'end-ellipsis') {
      return (
        <PaginationItem
          key={item}
          variant={variant}
          size={size}
          type="ellipsis"
          disabled
        />
      );
    }

    // Number items
    return (
      <PaginationItem
        key={item}
        onClick={(e) => handleClick(e, item)}
        selected={item === page}
        variant={variant}
        size={size}
        type="page"
      >
        {item}
      </PaginationItem>
    );
  };

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,
        ...style
      }}
      {...props}
    >
      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          flexWrap: 'wrap'
        }}
      >
        {itemList.map((item) => renderItem(item))}
      </ul>
    </nav>
  );
};

// Pagination Item Component
const PaginationItem = ({
  children,
  onClick,
  selected,
  disabled,
  variant,
  size,
  type,
  style,
  ...props
}) => {
  const sizeMap = {
    small: {
      width: '24px',
      height: '24px',
      fontSize: '0.75rem'
    },
    medium: {
      width: '32px',
      height: '32px',
      fontSize: '0.875rem'
    },
    large: {
      width: '40px',
      height: '40px',
      fontSize: '1rem'
    }
  };

  // Icon content based on type
  const getIconContent = () => {
    switch (type) {
      case 'first':
        return '«';
      case 'previous':
        return '‹';
      case 'next':
        return '›';
      case 'last':
        return '»';
      case 'ellipsis':
        return '…';
      default:
        return children;
    }
  };

  // Determine style based on state
  let itemVariant = variant;
  if (selected) {
    itemVariant = 'pressed';
  }

  const itemStyle = {
    ...createNeumorphicStyle(itemVariant),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 4px',
    cursor: disabled ? 'default' : 'pointer',
    borderRadius: '50%',
    opacity: disabled ? 0.5 : 1,
    backgroundColor: selected ? colors.primary : colors.background,
    color: selected ? '#fff' : colors.text.primary,
    ...sizeMap[size],
    ...style
  };

  return (
    <li>
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        style={itemStyle}
        {...props}
      >
        {getIconContent()}
      </button>
    </li>
  );
};

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['flat', 'pressed', 'concave', 'convex']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showFirstButton: PropTypes.bool,
  showLastButton: PropTypes.bool,
  siblingCount: PropTypes.number,
  boundaryCount: PropTypes.number,
  style: PropTypes.object
};

PaginationItem.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['flat', 'pressed', 'concave', 'convex']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['page', 'first', 'last', 'next', 'previous', 'ellipsis']),
  style: PropTypes.object
};

export default Pagination;