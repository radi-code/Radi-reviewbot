'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number; // 0 to 5
  maxRating?: number;
  size?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 14,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < Math.round(rating);
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              'transition-colors',
              isFilled
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-100 text-slate-300'
            )}
          />
        );
      })}
    </div>
  );
};
