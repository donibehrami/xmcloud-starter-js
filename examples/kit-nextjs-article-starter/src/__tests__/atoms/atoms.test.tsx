import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { catalog, registry } from '@/atoms';
import { Button } from '@/components/atoms/button/button';
import { Heading } from '@/components/atoms/heading/heading';
import { Image } from '@/components/atoms/image/image';
import { NumericInput } from '@/components/atoms/number/number';
import { Paragraph } from '@/components/atoms/paragraph/paragraph';

jest.mock('@sitecore-feaas/clientside/react', () => ({}));

describe('Content Kit Atoms', () => {
  it('registers exactly the five installed Atoms in both wiring files', () => {
    const names = ['Button', 'Heading', 'Image', 'Number', 'Paragraph'];
    expect(catalog.componentNames.slice().sort()).toEqual(names);
    expect(Object.keys(registry.registry).sort()).toEqual(names);
  });

  it('renders an action button and invokes its click handler', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick} placeHolderText="Continue" />);
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a disabled external button link without navigating', () => {
    render(
      <Button
        link={{ value: { href: 'https://example.com', text: 'Visit' } }}
        disabled
      />,
    );
    const link = screen.getByRole('link', { name: 'Visit' });
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(fireEvent.click(link)).toBe(false);
  });

  it('renders an internal button link', () => {
    render(
      <Button link={{ value: { href: '/products', text: 'Products' } }} />,
    );
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute(
      'href',
      '/products',
    );
  });

  it('renders Sitecore heading content at the selected semantic level', () => {
    render(<Heading text={{ value: 'Welcome' }} variant="h2" />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Welcome' }),
    ).toBeInTheDocument();
  });

  it('renders a heading placeholder when no content is supplied', () => {
    render(<Heading placeHolderText="Add a heading" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Add a heading',
    );
  });

  it('renders the image field and switches to its fallback on error', () => {
    render(
      <Image
        image={{ value: { src: '/photo.jpg', alt: 'Landscape' } }}
        fallbackSrc="/fallback.jpg"
      />,
    );
    const image = screen.getByRole('img', { name: 'Landscape' });
    expect(image).toHaveAttribute('src', '/photo.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/fallback.jpg');
  });

  it('does not render an image without a source or fallback', () => {
    render(<Image />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders a labeled bounded integer input and prevents decimal separators', () => {
    render(
      <NumericInput
        label={{ value: 'Quantity' }}
        min={1}
        max={5}
        decimalsAllowed={false}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '5');
    expect(input).toHaveAttribute('step', '1');
    expect(fireEvent.keyDown(input, { key: '.' })).toBe(false);
  });

  it('renders governed rich text and removes scripts', () => {
    const { container } = render(
      <Paragraph
        body={{ value: '<strong>Hello</strong><script>alert(1)</script>' }}
      />,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(container.querySelector('strong')).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
  });

  it('renders a paragraph placeholder for missing content', () => {
    render(<Paragraph placeHolderText="Add body copy" />);
    expect(screen.getByText('Add body copy')).toBeInTheDocument();
  });
});
