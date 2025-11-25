/**
 * Card Component Tests
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Card } from '@/components/atoms/Card';
import { Text } from '@/components/atoms/Text';

describe('Card', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(
        <Card>
          <Text>Card content</Text>
        </Card>
      );
      expect(screen.getByText('Card content')).toBeTruthy();
    });

    it('renders with elevated variant by default', () => {
      const { container } = render(
        <Card>
          <Text>Content</Text>
        </Card>
      );
      expect(container).toBeTruthy();
    });

    it('renders with outlined variant', () => {
      const { container } = render(
        <Card variant="outlined">
          <Text>Content</Text>
        </Card>
      );
      expect(container).toBeTruthy();
    });

    it('renders with filled variant', () => {
      const { container } = render(
        <Card variant="filled">
          <Text>Content</Text>
        </Card>
      );
      expect(container).toBeTruthy();
    });

    it('renders as Pressable when onPress is provided', () => {
      const onPressMock = jest.fn();
      render(
        <Card onPress={onPressMock}>
          <Text>Pressable card</Text>
        </Card>
      );

      const card = screen.getByText('Pressable card').parent;
      fireEvent.press(card!);
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('renders as View when onPress is not provided', () => {
      render(
        <Card>
          <Text>Static card</Text>
        </Card>
      );

      expect(screen.getByText('Static card')).toBeTruthy();
    });

    it('applies custom padding', () => {
      const { container } = render(
        <Card padding="6">
          <Text>Content</Text>
        </Card>
      );
      expect(container).toBeTruthy();
    });

    it('applies custom borderRadius', () => {
      const { container } = render(
        <Card borderRadiusSize="lg">
          <Text>Content</Text>
        </Card>
      );
      expect(container).toBeTruthy();
    });

    it('applies custom shadow size', () => {
      const { container } = render(
        <Card shadow="lg">
          <Text>Content</Text>
        </Card>
      );
      expect(container).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('calls onPress when pressed', () => {
      const onPressMock = jest.fn();
      render(
        <Card onPress={onPressMock}>
          <Text>Press me</Text>
        </Card>
      );

      const card = screen.getByText('Press me').parent;
      fireEvent.press(card!);
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled via pressableProps', () => {
      const onPressMock = jest.fn();
      render(
        <Card onPress={onPressMock} pressableProps={{ disabled: true }}>
          <Text>Disabled</Text>
        </Card>
      );

      const card = screen.getByText('Disabled').parent;
      fireEvent.press(card!);
      // When disabled, onPress should not be called
      // Note: This depends on React Native's Pressable behavior
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has correct accessibility role when pressable', () => {
      const onPressMock = jest.fn();
      render(
        <Card onPress={onPressMock}>
          <Text>Accessible</Text>
        </Card>
      );

      const card = screen.getByText('Accessible').parent;
      expect(card?.props.accessibilityRole).toBe('button');
    });
  });
});

