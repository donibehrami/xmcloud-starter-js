'use client';

import { defineAtomsRegistry } from '@sitecore-content-sdk/nextjs/atoms';

import { Button } from '@/components/atoms/button/button';
import { Heading } from '@/components/atoms/heading/heading';
import { Image } from '@/components/atoms/image/image';
import { NumericInput } from '@/components/atoms/number/number';
import { Paragraph } from '@/components/atoms/paragraph/paragraph';

import { Layout } from '@/components/atoms/layout/layout';
import { SuperLayout } from '@/components/atoms/super-layout/super-layout';

import { catalog } from './catalog';

export const registry = defineAtomsRegistry(catalog, {
  components: {
    Layout: ({ props, children, slots }) => (
      <Layout {...props} slots={slots}>
        {children}
      </Layout>
    ),
    SuperLayout: ({ props, children }) => (
      <SuperLayout {...props}>{children}</SuperLayout>
    ),
    Button: ({ props, children }) => <Button {...props}>{children}</Button>,
    Heading: ({ props, children }) => <Heading {...props}>{children}</Heading>,
    Paragraph: ({ props, children }) => (
      <Paragraph {...props}>{children}</Paragraph>
    ),
    Image: ({ props }) => <Image {...props} />,
    Number: ({ props }) => <NumericInput {...props} />,
  },
  actions: {},
});
