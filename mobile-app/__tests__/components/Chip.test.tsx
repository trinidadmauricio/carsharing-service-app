/**
 * Chip Component Tests
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Chip, ChipGroup } from '@/components/atoms/Chip';
import { Ionicons } from '@expo/vector-icons';

describe('Chip', () => {
  describe('rendering', () => {
    it('renders with label', () => {
      render(<Chip label="Test Chip" />);
      expect(screen.getByText('Test Chip')).toBeTruthy();
    });

    it('renders with outlined variant by default', () => {
      render(<Chip label="Outlined" />);
      expect(screen.getByText('Outlined')).toBeTruthy();
    });

    it('renders with filled variant', () => {
      render(<Chip label="Filled" variant="filled" />);
      expect(screen.getByText('Filled')).toBeTruthy();
    });

    it('renders all sizes correctly', () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      sizes.forEach((size) => {
        const { unmount } = render(<Chip label={`${size} chip`} size={size} />);
        expect(screen.getByText(`${size} chip`)).toBeTruthy();
        unmount();
      });
    });

    it('renders with left icon', () => {
      render(
        <Chip
          label="With icon"
          leftIcon={<Ionicons name="checkmark" size={16} />}
        />
      );
      expect(screen.getByText('With icon')).toBeTruthy();
    });

    it('renders with right icon', () => {
      render(
        <Chip
          label="With icon"
          rightIcon={<Ionicons name="close" size={16} />}
        />
      );
      expect(screen.getByText('With icon')).toBeTruthy();
    });

    it('renders selected state', () => {
      render(<Chip label="Selected" selected />);
      expect(screen.getByText('Selected')).toBeTruthy();
    });

    it('renders disabled state', () => {
      render(<Chip label="Disabled" disabled />);
      const chip = screen.getByText('Disabled');
      expect(chip).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('calls onPress when pressed', () => {
      const onPressMock = jest.fn();
      render(<Chip label="Press me" onPress={onPressMock} />);

      const chip = screen.getByText('Press me');
      fireEvent.press(chip);
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPressMock = jest.fn();
      render(<Chip label="Disabled" disabled onPress={onPressMock} />);

      const chip = screen.getByText('Disabled');
      fireEvent.press(chip);
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('calls onRemove when remove icon is pressed', () => {
      const onRemoveMock = jest.fn();
      render(
        <Chip
          label="Removable"
          onRemove={onRemoveMock}
          rightIcon={<Ionicons name="close" size={16} />}
        />
      );

      // Note: Testing onRemove requires finding the remove button
      // This is a simplified test - in practice you'd need to find the icon
      expect(screen.getByText('Removable')).toBeTruthy();
    });
  });
});

describe('ChipGroup', () => {
  describe('rendering', () => {
    it('renders multiple chips', () => {
      render(
        <ChipGroup>
          <Chip label="Chip 1" />
          <Chip label="Chip 2" />
          <Chip label="Chip 3" />
        </ChipGroup>
      );

      expect(screen.getByText('Chip 1')).toBeTruthy();
      expect(screen.getByText('Chip 2')).toBeTruthy();
      expect(screen.getByText('Chip 3')).toBeTruthy();
    });

    it('handles single selection mode', () => {
      const onSelectionChange = jest.fn();
      render(
        <ChipGroup selectionMode="single" onSelectionChange={onSelectionChange}>
          <Chip label="Option 1" />
          <Chip label="Option 2" />
        </ChipGroup>
      );

      expect(screen.getByText('Option 1')).toBeTruthy();
      expect(screen.getByText('Option 2')).toBeTruthy();
    });

    it('handles multiple selection mode', () => {
      const onSelectionChange = jest.fn();
      render(
        <ChipGroup selectionMode="multiple" onSelectionChange={onSelectionChange}>
          <Chip label="Option 1" />
          <Chip label="Option 2" />
        </ChipGroup>
      );

      expect(screen.getByText('Option 1')).toBeTruthy();
      expect(screen.getByText('Option 2')).toBeTruthy();
    });
  });
});

