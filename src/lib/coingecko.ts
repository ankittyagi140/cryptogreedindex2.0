const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

interface FetchOptions extends RequestInit {
  searchParams?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, searchParams?: FetchOptions["searchParams"]) {
  const url = new URL(path, COINGECKO_BASE_URL);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function fetchFromCoinGecko<T>(
  path: string,
  { searchParams, headers, ...init }: FetchOptions = {},
): Promise<T> {
  const url = buildUrl(path, searchParams);

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(headers ?? {}),
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `CoinGecko request failed (${response.status} ${response.statusText}): ${detail || "No response body"}`,
    );
  }

  return response.json() as Promise<T>;
}

