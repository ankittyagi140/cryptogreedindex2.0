const COINSTATS_BASE_URL = "https://openapiv1.coinstats.app";

interface FetchOptions extends RequestInit {
  searchParams?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, searchParams?: FetchOptions["searchParams"]) {
  const url = new URL(path, COINSTATS_BASE_URL);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function fetchCoinStatsMarket<T>(
  path: string,
  { searchParams, headers, ...init }: FetchOptions = {},
): Promise<T> {
  const apiKey = process.env.COINSTATS_API_KEY;

  if (!apiKey) {
    throw new Error("COINSTATS_API_KEY is not set");
  }

  const url = buildUrl(path, searchParams);

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
      ...(headers ?? {}),
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `CoinStats request failed (${response.status} ${response.statusText}): ${detail || "No response body"}`,
    );
  }

  return response.json() as Promise<T>;
}

