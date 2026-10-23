/**
 * Build-time GitHub pull request metadata for PullRequestCard.
 * Fetched at build and cached per PR for the process lifetime.
 */

export type PrState = "open" | "merged" | "closed" | "draft" | "unknown";

export interface PrInfo {
	owner: string;
	repo: string;
	number: number;
	title: string;
	state: PrState;
}

interface PrRef {
	owner: string;
	repo: string;
	number: number;
}

export function parsePrUrl(url: string): PrRef {
	const match = url.match(
		/^https?:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)\/?$/,
	);
	if (!match) throw new Error(`Not a GitHub pull request URL: "${url}"`);
	return { owner: match[1], repo: match[2], number: Number(match[3]) };
}

interface FetchedPr {
	title?: string;
	state?: PrState;
}

/** Dedupes API calls when several cards reference the same PR. */
const cache = new Map<string, Promise<FetchedPr>>();

async function fetchPr(ref: PrRef): Promise<FetchedPr> {
	const key = `${ref.owner}/${ref.repo}#${ref.number}`;
	let pending = cache.get(key);
	if (!pending) {
		pending = (async (): Promise<FetchedPr> => {
			const headers: Record<string, string> = {
				Accept: "application/vnd.github+json",
				"User-Agent": "cuprate.org build",
			};
			// Optional token raising the unauthenticated 60 req/h rate limit.
			const token = import.meta.env.GITHUB_TOKEN;
			if (token) headers.Authorization = `Bearer ${token}`;

			const res = await fetch(
				`https://api.github.com/repos/${ref.owner}/${ref.repo}/pulls/${ref.number}`,
				{ headers },
			);
			if (!res.ok) throw new Error(`GitHub API returned ${res.status} for ${key}`);
			const data = await res.json();
			const state: PrState = data.merged_at
				? "merged"
				: data.draft
					? "draft"
					: data.state === "open"
						? "open"
						: "closed";
			return { title: data.title, state };
		})().catch((err: Error) => {
			console.warn(`[pr-card] ${err.message}; rendering without API data`);
			return {};
		});
		cache.set(key, pending);
	}
	return pending;
}

/** Title/state props take precedence over the API values */
export async function resolvePr(
	url: string,
	overrides: { title?: string; state?: PrState } = {},
): Promise<PrInfo> {
	const ref = parsePrUrl(url);
	const fetched = overrides.title && overrides.state ? {} : await fetchPr(ref);
	return {
		...ref,
		title: overrides.title ?? fetched.title ?? `${ref.owner}/${ref.repo}`,
		state: overrides.state ?? fetched.state ?? "unknown",
	};
}
