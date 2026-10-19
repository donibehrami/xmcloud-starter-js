import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { catalog, registry } from '@/atoms';
import { Layout } from '@/components/atoms/layout/layout';
import { layoutCatalogDefinition } from '@/components/atoms/layout/layout.schema';
import { Heading } from '@/components/atoms/heading/heading';
import { Button } from '@/components/atoms/button/button';

jest.mock('@sitecore-feaas/clientside/react', () => ({}));

describe('Layout Atom', () => {
  it('validates a document with independently authored column content', () => {
    expect(
      catalog.validate({
        root: 'layout',
        elements: {
          layout: {
            type: 'Layout',
            props: {
              columns: 2,
              direction: 'vertical',
              gap: 'medium',
              padding: 'medium',
            },
            children: ['first'],
            slots: { column2: ['second'] },
          },
          first: {
            type: 'Heading',
            props: { text: { value: 'First' } },
            children: [],
          },
          second: {
            type: 'Heading',
            props: { text: { value: 'Second' } },
            children: [],
          },
        },
      }).success,
    ).toBe(true);
  });

  it.each([1, 2, 3, 4, 5, 6])(
    'renders %i column drop zones stacked on mobile',
    (columns) => {
      const { container } = render(<Layout columns={columns} />);
      expect(container.querySelectorAll('[data-layout-slot]')).toHaveLength(
        columns,
      );
      expect(container.firstChild).toHaveClass(
        'grid',
        'grid-cols-1',
        `md:grid-cols-${columns}`,
      );
      expect(layoutCatalogDefinition.props.parse({ columns }).columns).toBe(
        columns,
      );
    },
  );

  it('preserves populated extra slots when the column count is reduced', () => {
    const { container, rerender } = render(
      <Layout columns={6} slots={{ column6: <Heading text="Keep me" /> }} />,
    );
    rerender(
      <Layout columns={2} slots={{ column6: <Heading text="Keep me" /> }} />,
    );
    expect(container.firstChild).toHaveClass('md:grid-cols-2');
    expect(
      screen.getByRole('heading', { name: 'Keep me' }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll('[data-layout-slot]')).toHaveLength(6);
  });

  it('forwards named slots through the registry and preserves the default children', () => {
    const RegisteredLayout = registry.registry.Layout;
    const { container } = render(
      <RegisteredLayout
        element={{ type: 'Layout', props: { columns: 2 }, children: [] }}
        slots={{ column2: <Heading text="Second column" /> }}
        emit={jest.fn()}
        on={() => ({
          shouldPreventDefault: false,
          bound: false,
          emit: jest.fn(),
        })}
      >
        <Button>First column</Button>
      </RegisteredLayout>,
    );
    expect(
      container.querySelector('[data-layout-slot="default"]'),
    ).toContainElement(screen.getByRole('button'));
    expect(
      container.querySelector('[data-layout-slot="column2"]'),
    ).toContainElement(screen.getByRole('heading'));
  });

  it('does not lose named slot content in legacy flex mode', () => {
    render(<Layout slots={{ column3: <Heading text="Named content" /> }} />);
    expect(screen.getByRole('heading')).toHaveTextContent('Named content');
  });

  it.each([0, 7, 1.5, '2'])('rejects invalid column count %s', (columns) => {
    expect(layoutCatalogDefinition.props.safeParse({ columns }).success).toBe(
      false,
    );
  });

  it('passes editor props and children through the registered renderer', () => {
    const RegisteredLayout = registry.registry.Layout;
    const { container } = render(
      <RegisteredLayout
        element={{
          type: 'Layout',
          props: { direction: 'horizontal', gap: 'large', padding: 'none' },
          children: [],
        }}
        emit={jest.fn()}
        on={() => ({
          shouldPreventDefault: false,
          bound: false,
          emit: jest.fn(),
        })}
      >
        <Heading text="Registered child" />
      </RegisteredLayout>,
    );
    expect(container.querySelector('[data-slot="layout"]')).toHaveClass(
      'flex-row',
      'gap-8',
      'p-0',
    );
    expect(
      screen.getByRole('heading', { name: 'Registered child' }),
    ).toBeInTheDocument();
  });

  it('validates an authored document with nested Layouts and child Atoms', () => {
    const result = catalog.validate({
      root: 'container',
      elements: {
        container: {
          type: 'Layout',
          props: { direction: 'vertical', gap: 'medium', padding: 'medium' },
          children: ['row'],
        },
        row: {
          type: 'Layout',
          props: { direction: 'horizontal', gap: 'small', padding: 'none' },
          children: ['heading'],
        },
        heading: {
          type: 'Heading',
          props: { text: { value: 'Nested heading' } },
          children: [],
        },
      },
    });
    expect(result.success).toBe(true);
  });

  it('exposes a default drop slot without restricting child or parent types', () => {
    expect(layoutCatalogDefinition.slots).toEqual([
      'default',
      'column2',
      'column3',
      'column4',
      'column5',
      'column6',
    ]);
    expect(layoutCatalogDefinition.allowedChildren).toBeUndefined();
    expect(layoutCatalogDefinition.allowedParents).toBeUndefined();
    expect(registry.registry.Layout).toBeDefined();
  });

  it('uses the same defaults in the component and editor schema', () => {
    expect(layoutCatalogDefinition.props.parse({})).toEqual({
      direction: 'vertical',
      gap: 'medium',
      padding: 'medium',
    });
    render(<Layout data-testid="layout" />);
    expect(screen.getByTestId('layout')).toHaveClass(
      'flex',
      'flex-col',
      'gap-4',
      'p-4',
      'min-h-12',
    );
    expect(screen.getByTestId('layout')).toBeEmptyDOMElement();
  });

  it('renders nested containers and interactive children in authored order', () => {
    const { container } = render(
      <Layout data-testid="outer">
        <Heading text="Title" />
        <Layout
          direction="horizontal"
          gap="small"
          padding="none"
          data-testid="inner"
        >
          <Button>Continue</Button>
        </Layout>
      </Layout>,
    );
    expect(screen.getByTestId('outer')).toContainElement(
      screen.getByRole('heading'),
    );
    expect(screen.getByTestId('inner')).toContainElement(
      screen.getByRole('button'),
    );
    expect(screen.getByTestId('inner')).toHaveClass(
      'flex-row',
      'flex-wrap',
      'gap-2',
      'p-0',
    );
    expect(
      container.querySelector('[data-slot="layout"]')?.firstElementChild
        ?.tagName,
    ).toBe('H1');
  });

  it.each([
    ['none', 'gap-0', 'p-0'],
    ['small', 'gap-2', 'p-2'],
    ['medium', 'gap-4', 'p-4'],
    ['large', 'gap-8', 'p-8'],
  ] as const)(
    'renders the %s spacing choice',
    (spacing, gapClass, paddingClass) => {
      render(<Layout gap={spacing} padding={spacing} data-testid="layout" />);
      expect(screen.getByTestId('layout')).toHaveClass(gapClass, paddingClass);
    },
  );

  it('preserves DOM attributes and allows consumer styling overrides', () => {
    render(
      <Layout
        id="custom"
        aria-label="Content"
        className="gap-8 p-0"
        data-testid="layout"
      />,
    );
    expect(screen.getByTestId('layout')).toHaveAttribute('id', 'custom');
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'aria-label',
      'Content',
    );
    expect(screen.getByTestId('layout')).toHaveClass('gap-8', 'p-0');
    expect(screen.getByTestId('layout')).not.toHaveClass('gap-4', 'p-4');
  });

  it.each([{ direction: 'diagonal' }, { gap: 'huge' }, { padding: -1 }])(
    'rejects unsupported editor configuration %j',
    (props) => {
      expect(layoutCatalogDefinition.props.safeParse(props).success).toBe(
        false,
      );
    },
  );
});
