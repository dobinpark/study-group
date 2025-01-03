'use client';

import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs.length > 0 && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-sm text-gray-900">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center space-x-4">{actions}</div>}
      </div>
    </div>
  );
} 