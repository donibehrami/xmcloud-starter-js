"use client";

import { defineAtomsRegistry } from "@sitecore-content-sdk/nextjs/atoms";

import { Button } from "@/components/atoms/button/button";
import { Heading } from "@/components/atoms/heading/heading";
import { Image } from "@/components/atoms/image/image";
import { NumericInput } from "@/components/atoms/number/number";
import { Paragraph } from "@/components/atoms/paragraph/paragraph";
import { Container } from "@/components/atoms/container/container";
import { Card } from "@/components/atoms/card/card";
import { CardTitle } from "@/components/atoms/card-title/card-title";
import { CardContent } from "@/components/atoms/card-content/card-content";
import { CardFooter } from "@/components/atoms/card-footer/card-footer";

import { catalog } from "./catalog";

export const registry = defineAtomsRegistry(catalog, {
  components: {
    Container: ({ props, children }) => (
      <Container {...props}>{children}</Container>
    ),
    Card: ({ props, children,slots }) => <Card {...props} slots={slots}>{children}</Card>,
    CardTitle: ({ props, children }) => (
      <CardTitle {...props}>{children}</CardTitle>
    ),
    CardContent: ({ props, children }) => (
      <CardContent {...props}>{children}</CardContent>
    ),
    CardFooter: ({ props, children }) => (
      <CardFooter {...props}>{children}</CardFooter>
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
