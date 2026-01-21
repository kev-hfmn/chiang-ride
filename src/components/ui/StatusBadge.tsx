'use client'

import type { BookingStatus } from '@/lib/types/custom';
import { BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from '@/lib/constants/booking-status';

interface StatusBadgeProps {
  status: BookingStatus;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, showDot = true, size = 'md' }: StatusBadgeProps) {
  const colors = BOOKING_STATUS_COLORS[status];
  const label = BOOKING_STATUS_LABELS[status];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${colors.bg} ${colors.text} ${sizeClasses[size]}`}
    >
      {showDot && <span className={`rounded-full ${colors.dot} ${dotSizeClasses[size]}`} />}
      {label}
    </span>
  );
}
