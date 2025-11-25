/**
 * Divider Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Divider, Spacer } from '@/components/atoms/Divider';

describe('Divider', () => {
  describe('rendering', () => {
    it('renders horizontal divider by default', () => {
      const { container } = render(<Divider />);
      expect(container).toBeTruthy();
    });

    it('renders horizontal divider explicitly', () => {
      const { container } = render(<Divider orientation="horizontal" />);
      expect(container).toBeTruthy();
    });

    it('renders vertical divider', () => {
      const { container } = render(<Divider orientation="vertical" />);
      expect(container).toBeTruthy();
    });

    it('renders with different sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      sizes.forEach((size) => {
        const { unmount, container } = render(<Divider size={size} />);
        expect(container).toBeTruthy();
        unmount();
      });
    });

    it('uses md size by default', () => {
      const { container } = render(<Divider />);
      expect(container).toBeTruthy();
    });
  });
});

describe('Spacer', () => {
  describe('rendering', () => {
    it('renders with default height', () => {
      const { container } = render(<Spacer />);
      expect(container).toBeTruthy();
    });

    it('renders with custom height', () => {
      const { container } = render(<Spacer height={20} />);
      expect(container).toBeTruthy();
    });

    it('renders with custom width', () => {
      const { container } = render(<Spacer width={20} />);
      expect(container).toBeTruthy();
    });

    it('renders with both height and width', () => {
      const { container } = render(<Spacer height={20} width={20} />);
      expect(container).toBeTruthy();
    });
  });
});

