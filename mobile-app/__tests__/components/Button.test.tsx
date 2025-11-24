/**
 * Button Component Tests
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '@/components/atoms';

describe('Button', () => {
  describe('rendering', () => {
    it('renders with title', () => {
      render(<Button title="Click me" />);
      expect(screen.getByText('Click me')).toBeTruthy();
    });

    it('renders all variants correctly', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;

      variants.forEach((variant) => {
        const { unmount } = render(
          <Button title={`${variant} button`} variant={variant} />
        );
        expect(screen.getByText(`${variant} button`)).toBeTruthy();
        unmount();
      });
    });

    it('renders all sizes correctly', () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      sizes.forEach((size) => {
        const { unmount } = render(
          <Button title={`${size} button`} size={size} />
        );
        expect(screen.getByText(`${size} button`)).toBeTruthy();
        unmount();
      });
    });

    it('renders fullWidth button', () => {
      render(<Button title="Full Width" fullWidth />);
      expect(screen.getByText('Full Width')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('calls onPress when pressed', () => {
      const onPressMock = jest.fn();
      render(<Button title="Press me" onPress={onPressMock} />);

      fireEvent.press(screen.getByText('Press me'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPressMock = jest.fn();
      render(<Button title="Disabled" onPress={onPressMock} disabled />);

      fireEvent.press(screen.getByText('Disabled'));
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
      const onPressMock = jest.fn();
      render(<Button title="Loading" onPress={onPressMock} loading />);

      // Button title is hidden when loading, so find by role
      const button = screen.getByRole('button');
      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('states', () => {
    it('shows loading indicator when loading', () => {
      render(<Button title="Loading" loading />);
      // When loading, the ActivityIndicator should be present
      expect(screen.getByRole('button')).toBeTruthy();
    });

    it('applies disabled state correctly', () => {
      render(<Button title="Disabled" disabled />);
      const button = screen.getByRole('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('has correct accessibility role', () => {
      render(<Button title="Accessible" />);
      expect(screen.getByRole('button')).toBeTruthy();
    });

    it('uses title as accessibility label by default', () => {
      render(<Button title="My Button" />);
      expect(screen.getByLabelText('My Button')).toBeTruthy();
    });

    it('allows custom accessibility label', () => {
      render(
        <Button title="Click" accessibilityLabel="Custom label" />
      );
      expect(screen.getByLabelText('Custom label')).toBeTruthy();
    });

    it('indicates disabled state to screen readers', () => {
      render(<Button title="Disabled" disabled />);
      const button = screen.getByRole('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });
});
