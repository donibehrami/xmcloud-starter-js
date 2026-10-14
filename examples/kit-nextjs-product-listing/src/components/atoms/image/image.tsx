'use client';

import * as React from 'react';

import type { ImageFieldSchema } from '@sitecore-content-sdk/nextjs/atoms';

import { cn, getImageFieldValue } from '@/lib/atoms-utils';

const IMAGE_SOURCE_TYPES = ['url', 'mediaLibrary', 'upload'] as const;
const IMAGE_SHAPES = ['none', 'rounded', 'circle'] as const;
const IMAGE_ASPECT_RATIOS = ['auto', '1:1', '4:3', '16:9', '3:4', '21:9'] as const;

type ImageSourceType = (typeof IMAGE_SOURCE_TYPES)[number];
type ImageShape = (typeof IMAGE_SHAPES)[number];
type ImageAspectRatio = (typeof IMAGE_ASPECT_RATIOS)[number];

export type ResponsiveImageSource = {
  srcSet: string;
  media?: string;
  type?: string;
};

export type ImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'loading' | 'width' | 'height'
> & {
  /** Sitecore Image field. */
  image?: ImageFieldSchema;
  sourceType?: ImageSourceType;
  showAltText?: boolean;
  altTextRequired?: boolean;
  shape?: ImageShape;
  aspectRatio?: ImageAspectRatio;
  fallbackSrc?: string;
  lazyLoad?: boolean;
  responsiveSources?: ResponsiveImageSource[];
};

const shapeClasses: Record<ImageShape, string> = {
  none: '',
  rounded: 'rounded-md',
  circle: 'rounded-full aspect-square object-cover',
};

const aspectRatioClasses: Record<ImageAspectRatio, string> = {
  auto: '',
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
  '3:4': 'aspect-[3/4]',
  '21:9': 'aspect-[21/9]',
};

function Image({
  className,
  image,
  sourceType = 'url',
  showAltText = true,
  altTextRequired = true,
  shape = 'none',
  aspectRatio = 'auto',
  fallbackSrc,
  lazyLoad = true,
  responsiveSources,
  onError,
  ...props
}: ImageProps) {
  const imageValue = getImageFieldValue(image);
  const src = imageValue?.src?.trim() ?? '';
  const [currentSrc, setCurrentSrc] = React.useState(src || fallbackSrc || '');

  React.useEffect(() => {
    setCurrentSrc(src || fallbackSrc || '');
  }, [src, fallbackSrc]);

  const resolvedAlt = showAltText ? (imageValue?.alt ?? '') : '';

  if (
    process.env.NODE_ENV !== 'production' &&
    showAltText &&
    altTextRequired &&
    currentSrc &&
    !resolvedAlt.trim()
  ) {
    console.warn('Image atom is configured to require alt text, but no alt text was provided.');
  }

  const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    onError?.(event);
  };

  if (!currentSrc) {
    return null;
  }

  const imageElement = (
    <img
      {...props}
      data-slot="image"
      data-source-type={sourceType}
      className={cn(
        'block h-auto w-full',
        aspectRatioClasses[aspectRatio],
        shapeClasses[shape],
        className
      )}
      src={currentSrc}
      alt={resolvedAlt}
      width={imageValue?.width}
      height={imageValue?.height}
      loading={lazyLoad ? 'lazy' : 'eager'}
      onError={handleError}
    />
  );

  if (!responsiveSources?.length) {
    return imageElement;
  }

  return (
    <picture data-slot="image-picture">
      {responsiveSources.map((source) => (
        <source
          key={`${source.srcSet}-${source.media ?? 'all'}-${source.type ?? 'default'}`}
          srcSet={source.srcSet}
          media={source.media}
          type={source.type}
        />
      ))}
      {imageElement}
    </picture>
  );
}

export { Image };
