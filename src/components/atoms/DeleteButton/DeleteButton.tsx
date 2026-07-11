'use client';

import * as React from 'react';
import { Button } from '@/components/atoms/Button/Button.js';

export interface DeleteButtonProps {
  label: React.ReactNode;
  onDelete?: () => void;
}

export function DeleteButton({ label, onDelete }: DeleteButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onDelete}>
      × {label}
    </Button>
  );
}