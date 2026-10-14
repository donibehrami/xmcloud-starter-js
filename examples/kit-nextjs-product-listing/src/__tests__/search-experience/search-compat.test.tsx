import { act, renderHook, waitFor } from '@testing-library/react';
import { useSearch, useInfiniteSearch, useSuggest } from '@/lib/search-compat';

const mockSearch = jest.fn();
const mockSuggest = jest.fn();

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({ api: { edge: { clientContextId: 'public-context' } } }),
}));

jest.mock('@sitecore-content-sdk/search', () => ({
  SearchService: jest.fn().mockImplementation(() => ({
    search: mockSearch,
    suggest: mockSuggest,
  })),
}));

describe('Atoms beta search compatibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearch.mockResolvedValue({ results: [{ id: 'first' }], total: 2 });
    mockSuggest.mockResolvedValue({
      querySuggestions: [{ text: 'audio', queryPlusText: 'audio' }],
      previewResults: [{ id: 'preview' }],
    });
  });

  it('preserves keyword pagination', async () => {
    const { result } = renderHook(() =>
      useSearch({
        searchIndexId: 'index',
        query: 'audio',
        page: 2,
        pageSize: 1,
      })
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSearch).toHaveBeenCalledWith(
      { searchIndexId: 'index', keyphrase: 'audio', limit: 1, offset: 1 },
      { signal: expect.any(AbortSignal) }
    );
    expect(result.current.totalPages).toBe(2);
  });

  it('sends the MLT seed without a keyword query', async () => {
    const { result } = renderHook(() =>
      useSearch({
        searchIndexId: 'index',
        seedItemUrl: 'https://example.com/product',
        pageSize: 3,
      })
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSearch).toHaveBeenCalledWith(
      { searchIndexId: 'index', seedItemUrl: 'https://example.com/product', limit: 3, offset: 0 },
      { signal: expect.any(AbortSignal) }
    );
  });

  it('appends load-more results and resets pagination when the query changes', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useInfiniteSearch({ searchIndexId: 'index', query, pageSize: 1 }),
      { initialProps: { query: 'audio' } }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    mockSearch.mockResolvedValueOnce({ results: [{ id: 'second' }], total: 2 });
    act(() => result.current.loadMore());
    await waitFor(() =>
      expect(result.current.results).toEqual([{ id: 'first' }, { id: 'second' }])
    );
    expect(result.current.hasNextPage).toBe(false);

    rerender({ query: 'headphones' });
    await waitFor(() => expect(result.current.results).toEqual([{ id: 'first' }]));
    expect(mockSearch).toHaveBeenLastCalledWith(
      { searchIndexId: 'index', keyphrase: 'headphones', limit: 1, offset: 0 },
      { signal: expect.any(AbortSignal) }
    );
  });

  it('does not issue requests when search is disabled', () => {
    renderHook(() => useSearch({ searchIndexId: 'index', enabled: false }));
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('exposes search failures for the existing error UI', async () => {
    const error = new Error('Search unavailable');
    mockSearch.mockRejectedValueOnce(error);
    const { result } = renderHook(() => useSearch({ searchIndexId: 'index' }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
  });

  it('preserves autocomplete terms and preview documents', async () => {
    const { result } = renderHook(() => useSuggest({ searchIndexId: 'index', query: ' au ' }));
    await waitFor(() => expect(result.current.previewResults).toEqual([{ id: 'preview' }]));
    expect(result.current.querySuggestions).toEqual([{ text: 'audio', queryPlusText: 'audio' }]);
    expect(mockSuggest).toHaveBeenCalledWith(
      { searchIndexId: 'index', keyphrase: 'au' },
      { signal: expect.any(AbortSignal) }
    );
  });

  it('clears suggestions and aborts the old request when the query is emptied', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useSuggest({ searchIndexId: 'index', query }),
      { initialProps: { query: 'au' } }
    );
    await waitFor(() => expect(result.current.previewResults).toHaveLength(1));
    const signal = mockSuggest.mock.calls[0][1].signal as AbortSignal;
    rerender({ query: '' });
    expect(signal.aborted).toBe(true);
    expect(result.current.previewResults).toEqual([]);
    expect(mockSuggest).toHaveBeenCalledTimes(1);
  });

  it('reports suggestion errors explicitly', async () => {
    const error = new Error('Suggestions unavailable');
    mockSuggest.mockRejectedValueOnce(error);
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { result } = renderHook(() => useSuggest({ searchIndexId: 'index', query: 'au' }));
      await waitFor(() => expect(result.current.error).toBe(error));
      expect(log).toHaveBeenCalledWith('Search suggestions failed:', error);
    } finally {
      log.mockRestore();
    }
  });
});
