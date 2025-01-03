'use client';

import { Box, Typography, Breadcrumbs } from '@mui/material';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export default function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && (
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => 
            crumb.href ? (
              <Link key={index} href={crumb.href}>
                {crumb.label}
              </Link>
            ) : (
              <Typography key={index} color="text.primary">
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
    </Box>
  );
} 