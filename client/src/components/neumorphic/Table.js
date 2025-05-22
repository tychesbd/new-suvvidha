import React from 'react';
import PropTypes from 'prop-types';
import theme from './theme';

const {  colors, borderRadius, spacing, createNeumorphicStyle } = theme;


/**
 * Neumorphic Table Component
 * A soft, extruded table with subtle shadows and monochromatic styling
 */
const Table = ({ children, style, className, ...props }) => {
  const tableStyles = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    ...style,
  };

  return (
    <div style={createNeumorphicStyle('flat')}>
      <table style={tableStyles} className={className} {...props}>
        {children}
      </table>
    </div>
  );
};

const TableHead = ({ children, style, className, ...props }) => {
  const theadStyles = {
    ...style,
  };

  return (
    <thead style={theadStyles} className={className} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, style, className, ...props }) => {
  const tbodyStyles = {
    ...style,
  };

  return (
    <tbody style={tbodyStyles} className={className} {...props}>
      {children}
    </tbody>
  );
};

const TableRow = ({ children, style, className, ...props }) => {
  const trStyles = {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
    ...style,
  };

  return (
    <tr style={trStyles} className={className} {...props}>
      {children}
    </tr>
  );
};

const TableCell = ({ children, header = false, style, className, ...props }) => {
  const cellStyles = {
    padding: spacing.md,
    textAlign: 'left',
    borderBottom: `1px solid ${colors.background}`,
    color: header ? colors.text.primary : colors.text.secondary,
    fontWeight: header ? 600 : 400,
    ...style,
  };

  if (header) {
    return (
      <th style={cellStyles} className={className} {...props}>
        {children}
      </th>
    );
  }

  return (
    <td style={cellStyles} className={className} {...props}>
      {children}
    </td>
  );
};

const TableContainer = ({ children, style, className, ...props }) => {
  const containerStyles = {
    overflowX: 'auto',
    borderRadius: borderRadius.medium,
    ...createNeumorphicStyle('flat'),
    ...style,
  };

  return (
    <div style={containerStyles} className={className} {...props}>
      {children}
    </div>
  );
};

Table.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

TableHead.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

TableBody.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

TableRow.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

TableCell.propTypes = {
  children: PropTypes.node,
  header: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

TableContainer.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.Container = TableContainer;

export { TableHead, TableBody, TableRow, TableCell, TableContainer };
export default Table;