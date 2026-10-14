'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import {
  SearchService,
  type SearchDocument,
  type SearchResponse,
  type SuggestResponse,
} from '@sitecore-content-sdk/search';

type SearchOptions = {
  searchIndexId: string;
  query?: string;
  seedItemUrl?: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
};

type SearchState<T extends SearchDocument> = SearchResponse<T> & {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: Error | null;
};

function useSearchService() {
  const { api } = useSitecore();
  const contextId = api?.edge?.clientContextId;
  const edgeUrl = api?.edge?.edgeUrl;
  return useMemo(
    () => (contextId ? new SearchService({ contextId, edgeUrl }) : null),
    [contextId, edgeUrl]
  );
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Search request failed.', { cause: error });
}

// Keep autocomplete and More Like This on the stable search service while using the Atoms provider.
function useSearchQuery<T extends SearchDocument>(
  { searchIndexId, query, seedItemUrl, page = 1, pageSize = 10, enabled = true }: SearchOptions,
  infinite: boolean
) {
  const service = useSearchService();
  const [state, setState] = useState<SearchState<T>>({
    results: [],
    total: 0,
    status: 'idle',
    error: null,
  });
  const queryKey = JSON.stringify([searchIndexId, query, seedItemUrl, pageSize, enabled]);
  const [pagination, setPagination] = useState({ key: queryKey, extraPages: 0 });
  const extraPages = pagination.key === queryKey ? pagination.extraPages : 0;

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();

    async function search() {
      setState((previous) => ({
        results: infinite && extraPages > 0 ? previous.results : [],
        total: infinite && extraPages > 0 ? previous.total : 0,
        status: 'loading',
        error: null,
      }));
      try {
        if (!service || !searchIndexId) {
          throw new Error('Search requires a public Edge context ID and a search index ID.');
        }
        const response = await service.search<T>(
          {
            searchIndexId,
            ...(seedItemUrl ? { seedItemUrl } : { keyphrase: query }),
            limit: pageSize,
            offset: infinite ? extraPages * pageSize : (page - 1) * pageSize,
          },
          { signal: controller.signal }
        );
        if (controller.signal.aborted) return;
        setState((previous) => ({
          ...response,
          results:
            infinite && extraPages > 0
              ? [...previous.results, ...response.results]
              : response.results,
          status: 'success',
          error: null,
        }));
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({ results: [], total: 0, status: 'error', error: toError(error) });
      }
    }

    void search();
    return () => controller.abort();
  }, [service, searchIndexId, query, seedItemUrl, page, pageSize, enabled, infinite, extraPages]);

  const hasNextPage = state.results.length < state.total;
  const loadMore = useCallback(() => {
    if (enabled && hasNextPage && state.status === 'success') {
      setPagination({ key: queryKey, extraPages: extraPages + 1 });
    }
  }, [enabled, hasNextPage, state.status, queryKey, extraPages]);

  return {
    ...state,
    totalPages: Math.ceil(state.total / pageSize),
    isLoading: state.status === 'loading' && (!infinite || extraPages === 0),
    isLoadingMore: infinite && state.status === 'loading' && extraPages > 0,
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    hasNextPage,
    loadMore,
  };
}

export function useSearch<T extends SearchDocument>(options: SearchOptions) {
  return useSearchQuery<T>(options, false);
}

export function useInfiniteSearch<T extends SearchDocument>(options: SearchOptions) {
  return useSearchQuery<T>(options, true);
}

export function useSuggest<T extends SearchDocument>({
  searchIndexId,
  query,
  enabled = true,
}: Pick<SearchOptions, 'searchIndexId' | 'query' | 'enabled'>) {
  const service = useSearchService();
  const keyphrase = query?.trim() || '';
  const [state, setState] = useState<SuggestResponse<T> & { error: Error | null }>({
    querySuggestions: [],
    previewResults: [],
    error: null,
  });

  useEffect(() => {
    setState({ querySuggestions: [], previewResults: [], error: null });
    if (!enabled || !keyphrase) return;
    const controller = new AbortController();

    async function suggest() {
      try {
        if (!service || !searchIndexId) {
          throw new Error('Suggestions require a public Edge context ID and a search index ID.');
        }
        const response = await service.suggest<T>(
          { searchIndexId, keyphrase },
          { signal: controller.signal }
        );
        if (!controller.signal.aborted) setState({ ...response, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        const failure = toError(error);
        console.error('Search suggestions failed:', failure);
        setState({ querySuggestions: [], previewResults: [], error: failure });
      }
    }

    void suggest();
    return () => controller.abort();
  }, [service, searchIndexId, keyphrase, enabled]);

  return state;
}
