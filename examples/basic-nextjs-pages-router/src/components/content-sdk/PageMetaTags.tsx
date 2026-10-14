import Head from 'next/head';
import type { PageMetaTagsProps } from './PageMetaTags.props';

export function PageMetaTags({ route, defaultTitle = 'Page' }: PageMetaTagsProps) {
  const fields = route?.fields;
  const image = fields?.baseOgImage?.value;
  const type = fields?.baseOgType?.value;
  const creationTag =
    type === 'article'
      ? 'article:published_time'
      : type === 'book'
        ? 'book:release_date'
        : type === 'music.album'
          ? 'music:release_date'
          : type === 'video.movie' || type === 'video.episode'
            ? 'video:release_date'
            : undefined;

  return (
    <Head>
      <title>{fields?.Title?.value?.toString() || defaultTitle}</title>
      {fields?.baseMetadataTitle?.value && (
        <meta name="title" content={fields.baseMetadataTitle.value} />
      )}
      {fields?.baseMetadataDescription?.value && (
        <meta name="description" content={fields.baseMetadataDescription.value} />
      )}
      {fields?.baseMetadataKeywords?.value && (
        <meta name="keywords" content={fields.baseMetadataKeywords.value} />
      )}
      {fields?.baseMetadataAuthor?.value && (
        <meta name="author" content={fields.baseMetadataAuthor.value} />
      )}
      {fields?.baseOgTitle?.value && (
        <meta property="og:title" content={fields.baseOgTitle.value} />
      )}
      {fields?.baseOgDescription?.value && (
        <meta property="og:description" content={fields.baseOgDescription.value} />
      )}
      {image?.src && <meta property="og:image" content={image.src} />}
      {image?.src && (typeof image.width === 'string' || typeof image.width === 'number') && (
        <meta property="og:image:width" content={String(image.width)} />
      )}
      {image?.src && (typeof image.height === 'string' || typeof image.height === 'number') && (
        <meta property="og:image:height" content={String(image.height)} />
      )}
      {image?.src && typeof image.alt === 'string' && image.alt && (
        <meta property="og:image:alt" content={image.alt} />
      )}
      {type && <meta property="og:type" content={type} />}
      {creationTag && route?.published && <meta property={creationTag} content={route.published} />}
      {type === 'article' && route?.updated && (
        <meta property="article:modified_time" content={route.updated} />
      )}
    </Head>
  );
}
