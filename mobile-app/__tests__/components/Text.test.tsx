/**
 * Text Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text, Heading, Body, Label, Caption } from '@/components/atoms/Text';

describe('Text', () => {
  describe('rendering', () => {
    it('renders text content', () => {
      render(<Text>Hello World</Text>);
      expect(screen.getByText('Hello World')).toBeTruthy();
    });

    it('uses bodyMedium variant by default', () => {
      render(<Text>Default text</Text>);
      expect(screen.getByText('Default text')).toBeTruthy();
    });

    it('renders with different variants', () => {
      const variants = [
        'h1',
        'h2',
        'h3',
        'h4',
        'bodyLarge',
        'bodyMedium',
        'bodySmall',
        'labelLarge',
        'labelMedium',
        'labelSmall',
        'caption',
      ] as const;

      variants.forEach((variant) => {
        const { unmount } = render(<Text variant={variant}>{variant} text</Text>);
        expect(screen.getByText(`${variant} text`)).toBeTruthy();
        unmount();
      });
    });

    it('renders with different colors', () => {
      const colors = ['primary', 'secondary', 'tertiary', 'inverse', 'link', 'error', 'success'] as const;

      colors.forEach((color) => {
        const { unmount } = render(<Text color={color}>{color} text</Text>);
        expect(screen.getByText(`${color} text`)).toBeTruthy();
        unmount();
      });
    });

    it('renders with different alignments', () => {
      const alignments = ['left', 'center', 'right'] as const;

      alignments.forEach((align) => {
        const { unmount } = render(<Text align={align}>{align} aligned</Text>);
        expect(screen.getByText(`${align} aligned`)).toBeTruthy();
        unmount();
      });
    });

    it('applies numberOfLines prop', () => {
      render(
        <Text numberOfLines={2}>
          This is a very long text that should be truncated after two lines
        </Text>
      );
      const text = screen.getByText(/This is a very long text/);
      expect(text.props.numberOfLines).toBe(2);
    });
  });

  describe('Heading component', () => {
    it('renders heading level 1', () => {
      render(<Heading level={1}>Heading 1</Heading>);
      expect(screen.getByText('Heading 1')).toBeTruthy();
    });

    it('renders heading level 2', () => {
      render(<Heading level={2}>Heading 2</Heading>);
      expect(screen.getByText('Heading 2')).toBeTruthy();
    });

    it('renders heading level 3', () => {
      render(<Heading level={3}>Heading 3</Heading>);
      expect(screen.getByText('Heading 3')).toBeTruthy();
    });

    it('renders heading level 4', () => {
      render(<Heading level={4}>Heading 4</Heading>);
      expect(screen.getByText('Heading 4')).toBeTruthy();
    });
  });

  describe('Body component', () => {
    it('renders body with small size', () => {
      render(<Body size="sm">Small body</Body>);
      expect(screen.getByText('Small body')).toBeTruthy();
    });

    it('renders body with medium size by default', () => {
      render(<Body>Medium body</Body>);
      expect(screen.getByText('Medium body')).toBeTruthy();
    });

    it('renders body with large size', () => {
      render(<Body size="lg">Large body</Body>);
      expect(screen.getByText('Large body')).toBeTruthy();
    });
  });

  describe('Label component', () => {
    it('renders label with small size', () => {
      render(<Label size="sm">Small label</Label>);
      expect(screen.getByText('Small label')).toBeTruthy();
    });

    it('renders label with medium size by default', () => {
      render(<Label>Medium label</Label>);
      expect(screen.getByText('Medium label')).toBeTruthy();
    });

    it('renders label with large size', () => {
      render(<Label size="lg">Large label</Label>);
      expect(screen.getByText('Large label')).toBeTruthy();
    });
  });

  describe('Caption component', () => {
    it('renders caption text', () => {
      render(<Caption>Caption text</Caption>);
      expect(screen.getByText('Caption text')).toBeTruthy();
    });

    it('uses secondary color by default', () => {
      render(<Caption>Caption</Caption>);
      expect(screen.getByText('Caption')).toBeTruthy();
    });
  });
});

