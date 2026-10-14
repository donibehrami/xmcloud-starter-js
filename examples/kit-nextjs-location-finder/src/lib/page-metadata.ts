import type {
  Field,
  ImageField,
  RouteData,
} from '@sitecore-content-sdk/nextjs';
import type { Metadata } from 'next';

// The Atoms beta does not yet include the stable SDK's page metadata APIs.
export interface PageMetadataFields {
  baseMetadataTitle?: Field<string>;
  baseMetadataDescription?: Field<string>;
  baseMetadataKeywords?: Field<string>;
  baseMetadataAuthor?: Field<string>;
  baseOgTitle?: Field<string>;
  baseOgDescription?: Field<string>;
  baseOgImage?: ImageField;
  baseOgType?: Field<string>;
}

type MetadataRoute = RouteData<PageMetadataFields & { Title?: Field }> & {
  published?: string;
  updated?: string;
};

export function getPageMetadata(
  route?: MetadataRoute | null,
  defaultTitle = 'Page',
): Metadata {
  const fields = route?.fields;
  const metaTitle = fields?.baseMetadataTitle?.value;
  const description = fields?.baseMetadataDescription?.value;
  const keywords = fields?.baseMetadataKeywords?.value;
  const author = fields?.baseMetadataAuthor?.value;
  const ogTitle = fields?.baseOgTitle?.value;
  const ogDescription = fields?.baseOgDescription?.value;
  const ogImage = fields?.baseOgImage?.value;
  const ogType = fields?.baseOgType?.value;
  const releaseTypes = ['book', 'music.album', 'video.movie', 'video.episode'];

  const metadata: Metadata = {
    title: fields?.Title?.value?.toString() || defaultTitle,
    ...(metaTitle && { other: { title: metaTitle } }),
    ...(description && { description }),
    ...(keywords && { keywords }),
    ...(author && { authors: [{ name: author }] }),
  };

  if (ogTitle || ogDescription || ogImage?.src || ogType) {
    const openGraph = {
      ...(ogTitle && { title: ogTitle }),
      ...(ogDescription && { description: ogDescription }),
      ...(ogImage?.src && {
        images: [
          {
            url: ogImage.src,
            ...(typeof ogImage.width === 'string' ||
            typeof ogImage.width === 'number'
              ? { width: ogImage.width }
              : {}),
            ...(typeof ogImage.height === 'string' ||
            typeof ogImage.height === 'number'
              ? { height: ogImage.height }
              : {}),
            ...(typeof ogImage.alt === 'string' &&
              ogImage.alt && { alt: ogImage.alt }),
          },
        ],
      }),
      ...(ogType && { type: ogType }),
      ...(ogType === 'article' &&
        route?.published && { publishedTime: route.published }),
      ...(ogType === 'article' &&
        route?.updated && { modifiedTime: route.updated }),
      ...(ogType &&
        releaseTypes.includes(ogType) &&
        route?.published && {
          releaseDate: route.published,
        }),
    };

    // Sitecore supplies the discriminator at runtime, as in the stable SDK.
    metadata.openGraph = openGraph as NonNullable<Metadata['openGraph']>;
  }

  return metadata;
}
