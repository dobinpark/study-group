export const CACHE_CONSTANTS = {
    // Default values
    DEFAULT_TTL: 60,
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,

    // Limits
    MAX_CACHE_ITEMS: 100,
    MAX_QUERY_LENGTH: 100,
    MAX_LIMIT: 100,

    // TTL values
    DETAIL_TTL: 300,
    SEARCH_TTL: 30,
} as const;
