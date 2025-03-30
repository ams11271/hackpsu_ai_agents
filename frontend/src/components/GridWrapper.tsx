import React from 'react';
import Box from '@mui/material/Box';

type CustomGridProps = {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  sx?: any;
  spacing?: number;
};

// Simple flex-based alternative to Grid
export const GridItem: React.FC<CustomGridProps> = ({
  children,
  xs = 12,
  sm,
  md,
  lg,
  sx = {},
  ...rest
}) => {
  // Calculate width based on breakpoints (simple implementation)
  const width = {
    xs: `${(xs / 12) * 100}%`,
    ...(sm && { sm: `${(sm / 12) * 100}%` }),
    ...(md && { md: `${(md / 12) * 100}%` }),
    ...(lg && { lg: `${(lg / 12) * 100}%` }),
  };

  return (
    <Box
      sx={{
        flexGrow: 0,
        maxWidth: width,
        flexBasis: width,
        padding: 1,
        ...sx
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export const GridContainer: React.FC<CustomGridProps> = ({
  children,
  spacing = 2,
  sx = {},
  ...rest
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        margin: -spacing / 2,
        width: 'calc(100% + ${spacing}px)',
        ...sx
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}; 