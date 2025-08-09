'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Simple carousel placeholder without embla-carousel dependency
export const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative', className)}
    role="region"
    aria-roledescription="carousel"
    {...props}
  >
    {children}
  </div>
));
Carousel.displayName = 'Carousel';

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('overflow-hidden', className)}
    {...props}
  />
));
CarouselContent.displayName = 'CarouselContent';

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
    {...props}
  />
));
CarouselItem.displayName = 'CarouselItem';

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'absolute h-8 w-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      'left-4 top-1/2 -translate-y-1/2',
      className
    )}
    {...props}
  >
    ←
  </button>
));
CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'absolute h-8 w-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      'right-4 top-1/2 -translate-y-1/2',
      className
    )}
    {...props}
  >
    →
  </button>
));
CarouselNext.displayName = 'CarouselNext';
