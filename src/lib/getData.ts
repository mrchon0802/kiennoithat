// lib/getData.ts
const apiUrl = process.env.SERVER_API_URL || "http://localhost:5000";

export async function getData(
  endpoint: string,
  revalidateTime = 0,
  retries = 2,
) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        next: { revalidate: revalidateTime },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        console.error(`Failed to fetch ${endpoint}: ${res.status}`);
        return [];
      }

      return res.json();
    } catch (error) {
      const isLastAttempt = attempt === retries;
      console.error(
        `Error fetching ${endpoint} (attempt ${attempt + 1}/${retries + 1}):`,
        error,
      );

      if (isLastAttempt) return [];

      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }

  return [];
}
