import { getPageMetadata } from '@/lib/page-metadata';
import { DEFAULT_LLMS_TXT, LLMS_TXT_CONTENT_TYPE, getLlmsTxt } from '@/lib/llms-txt';

describe('Atoms SDK compatibility', () => {
  it('keeps the title distinct from the metadata title and preserves authored metadata', () => {
    expect(
      getPageMetadata({
        name: 'page',
        placeholders: {},
        published: '2026-01-01',
        updated: '2026-02-01',
        fields: {
          Title: { value: 'Page title' },
          baseMetadataTitle: { value: 'Meta title' },
          baseMetadataDescription: { value: 'Description' },
          baseMetadataKeywords: { value: 'one,two' },
          baseMetadataAuthor: { value: 'Author' },
          baseOgTitle: { value: 'OG title' },
          baseOgDescription: { value: 'OG description' },
          baseOgType: { value: 'article' },
          baseOgImage: { value: { src: '/photo.jpg', width: '640', height: '480', alt: 'Photo' } },
        },
      })
    ).toEqual({
      title: 'Page title',
      other: { title: 'Meta title' },
      description: 'Description',
      keywords: 'one,two',
      authors: [{ name: 'Author' }],
      openGraph: {
        title: 'OG title',
        description: 'OG description',
        type: 'article',
        images: [{ url: '/photo.jpg', width: '640', height: '480', alt: 'Photo' }],
        publishedTime: '2026-01-01',
        modifiedTime: '2026-02-01',
      },
    });
  });

  it('omits missing tags without inventing cross-field fallbacks', () => {
    expect(getPageMetadata(null)).toEqual({ title: 'Page' });
    expect(
      getPageMetadata(
        {
          name: 'page',
          placeholders: {},
          fields: { baseMetadataTitle: { value: 'Not the page title' } },
        },
        'Fallback'
      )
    ).toEqual({ title: 'Fallback', other: { title: 'Not the page title' } });
  });

  it.each(['book', 'music.album', 'video.movie', 'video.episode'])(
    'preserves the %s release date',
    (type) => {
      expect(
        getPageMetadata({
          name: 'page',
          placeholders: {},
          published: '2026-01-01',
          fields: { baseOgType: { value: type } },
        }).openGraph
      ).toEqual({ type, releaseDate: '2026-01-01' });
    }
  );

  it('fetches authored llms.txt using the configured client and site', async () => {
    const getData = jest.fn().mockResolvedValue({ site: { siteInfo: { llmsTxt: '# Site' } } });
    await expect(getLlmsTxt({ getData }, 'site')).resolves.toBe('# Site');
    expect(getData).toHaveBeenCalledWith(expect.stringContaining('llmsTxt'), { siteName: 'site' });
    expect(LLMS_TXT_CONTENT_TYPE).toBe('text/markdown; charset=utf-8');
    expect(DEFAULT_LLMS_TXT).toBe('# llms.txt\n\n> No llms.txt content configured for this site.');
  });

  it('returns null only when the site has no authored llms.txt', async () => {
    const getData = jest.fn().mockResolvedValue({ site: { siteInfo: { llmsTxt: '' } } });
    await expect(getLlmsTxt({ getData }, 'site')).resolves.toBeNull();
  });

  it('propagates GraphQL failures to the route error handler', async () => {
    const failure = new Error('GraphQL failed');
    const getData = jest.fn().mockRejectedValue(failure);
    await expect(getLlmsTxt({ getData }, 'site')).rejects.toBe(failure);
  });

  it('rejects an empty site name without making a request', async () => {
    const getData = jest.fn();
    await expect(getLlmsTxt({ getData }, '')).rejects.toThrow('site name');
    expect(getData).not.toHaveBeenCalled();
  });
});
