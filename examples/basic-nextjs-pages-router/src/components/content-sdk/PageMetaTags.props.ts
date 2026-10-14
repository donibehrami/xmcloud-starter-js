import type { Field, ImageField, RouteData } from '@sitecore-content-sdk/nextjs';

export interface PageMetaTagsFields {
  Title?: Field;
  baseMetadataTitle?: Field<string>;
  baseMetadataDescription?: Field<string>;
  baseMetadataKeywords?: Field<string>;
  baseMetadataAuthor?: Field<string>;
  baseOgTitle?: Field<string>;
  baseOgDescription?: Field<string>;
  baseOgImage?: ImageField;
  baseOgType?: Field<string>;
}

export interface PageMetaTagsProps {
  route?:
    | (RouteData<PageMetaTagsFields> & {
        published?: string;
        updated?: string;
      })
    | null;
  defaultTitle?: string;
}
