'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { DayPicker } from 'react-day-picker'; // Not installed

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

// export type CalendarProps = React.ComponentProps<typeof DayPicker>; // Not available
export type CalendarProps = any;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className={cn('p-3', className)}>
      <div className="text-center text-sm text-muted-foreground">
        Calendar component not available (react-day-picker not installed)
      </div>
    </div>
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
