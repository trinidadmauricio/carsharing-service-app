/**
 * Input Component Tests
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Input } from '@/components/atoms';

describe('Input', () => {
  describe('rendering', () => {
    it('renders with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeTruthy();
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter your email" />);
      expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
    });

    it('renders required indicator', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeTruthy();
    });

    it('renders helper text', () => {
      render(<Input label="Email" helperText="We will never share your email" />);
      expect(screen.getByText('We will never share your email')).toBeTruthy();
    });

    it('renders error message', () => {
      render(<Input label="Email" error="Email is required" />);
      expect(screen.getByText('Email is required')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('calls onChangeText when text changes', () => {
      const onChangeMock = jest.fn();
      render(<Input label="Email" onChangeText={onChangeMock} />);

      const input = screen.getByLabelText('Email');
      fireEvent.changeText(input, 'test@example.com');

      expect(onChangeMock).toHaveBeenCalledWith('test@example.com');
    });

    it('calls onBlur when input loses focus', () => {
      const onBlurMock = jest.fn();
      render(<Input label="Email" onBlur={onBlurMock} />);

      const input = screen.getByLabelText('Email');
      fireEvent(input, 'blur');

      expect(onBlurMock).toHaveBeenCalled();
    });

    it('calls onFocus when input gains focus', () => {
      const onFocusMock = jest.fn();
      render(<Input label="Email" onFocus={onFocusMock} />);

      const input = screen.getByLabelText('Email');
      fireEvent(input, 'focus');

      expect(onFocusMock).toHaveBeenCalled();
    });
  });

  describe('value handling', () => {
    it('displays controlled value', () => {
      render(<Input label="Email" value="test@example.com" />);
      expect(screen.getByDisplayValue('test@example.com')).toBeTruthy();
    });

    it('handles empty value', () => {
      render(<Input label="Email" value="" />);
      const input = screen.getByLabelText('Email');
      expect(input.props.value).toBe('');
    });
  });

  describe('states', () => {
    it('applies error state styling', () => {
      render(<Input label="Email" error="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeTruthy();
    });

    it('applies success state', () => {
      render(<Input label="Email" success />);
      const input = screen.getByLabelText('Email');
      expect(input).toBeTruthy();
    });

    it('handles disabled state', () => {
      render(<Input label="Email" editable={false} />);
      const input = screen.getByLabelText('Email');
      expect(input.props.editable).toBe(false);
    });
  });

  describe('keyboard types', () => {
    it('uses email keyboard type', () => {
      render(<Input label="Email" keyboardType="email-address" />);
      const input = screen.getByLabelText('Email');
      expect(input.props.keyboardType).toBe('email-address');
    });

    it('uses numeric keyboard type', () => {
      render(<Input label="Phone" keyboardType="phone-pad" />);
      const input = screen.getByLabelText('Phone');
      expect(input.props.keyboardType).toBe('phone-pad');
    });
  });

  describe('secure text entry', () => {
    it('hides text when secureTextEntry is true', () => {
      render(<Input label="Password" secureTextEntry />);
      const input = screen.getByLabelText('Password');
      expect(input.props.secureTextEntry).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('has correct accessibility label from label prop', () => {
      render(<Input label="Email Address" />);
      expect(screen.getByLabelText('Email Address')).toBeTruthy();
    });

    it('uses custom accessibilityLabel when provided', () => {
      render(<Input label="Email" accessibilityLabel="Email input field" />);
      expect(screen.getByLabelText('Email input field')).toBeTruthy();
    });
  });
});
