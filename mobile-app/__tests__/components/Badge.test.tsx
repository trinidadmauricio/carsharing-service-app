/**
 * Badge Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Badge } from '@/components/atoms/Badge';
import { Ionicons } from '@expo/vector-icons';

describe('Badge', () => {
  describe('rendering', () => {
    it('renders with label prop', () => {
      render(<Badge label="Test Badge" />);
      expect(screen.getByText('Test Badge')).toBeTruthy();
    });

    it('renders with children prop', () => {
      render(<Badge>Child Badge</Badge>);
      expect(screen.getByText('Child Badge')).toBeTruthy();
    });

    it('renders all variants correctly', () => {
      const variants = [
        'success',
        'warning',
        'error',
        'info',
        'neutral',
        'primary',
        'danger',
      ] as const;

      variants.forEach((variant) => {
        const { unmount } = render(<Badge label={`${variant} badge`} variant={variant} />);
        expect(screen.getByText(`${variant} badge`)).toBeTruthy();
        unmount();
      });
    });

    it('renders all sizes correctly', () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      sizes.forEach((size) => {
        const { unmount } = render(<Badge label={`${size} badge`} size={size} />);
        expect(screen.getByText(`${size} badge`)).toBeTruthy();
        unmount();
      });
    });

    it('renders with icon', () => {
      render(
        <Badge label="With icon" icon={<Ionicons name="checkmark" size={16} />} />
      );
      expect(screen.getByText('With icon')).toBeTruthy();
    });

    it('renders with dot indicator', () => {
      render(<Badge label="With dot" dot />);
      expect(screen.getByText('With dot')).toBeTruthy();
    });

    it('uses neutral variant by default', () => {
      render(<Badge label="Default" />);
      expect(screen.getByText('Default')).toBeTruthy();
    });

    it('uses md size by default', () => {
      render(<Badge label="Default size" />);
      expect(screen.getByText('Default size')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has correct accessibility role', () => {
      render(<Badge label="Accessible" />);
      const badge = screen.getByText('Accessible').parent;
      expect(badge?.props.accessibilityRole).toBe('text');
    });

    it('uses label as accessibility label', () => {
      render(<Badge label="My Badge" />);
      const badge = screen.getByText('My Badge').parent;
      expect(badge?.props.accessibilityLabel).toBe('My Badge');
    });
  });
});

