import { getAccessToken } from "@/auth/useAuth";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
type JsonBody = Record<string, unknown> | unknown[];
type ApiBody = BodyInit | JsonBody | null | undefined;
type ApiFetchOptions = Omit<RequestInit, "body"> & { body?: ApiBody };

function buildUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}

function shouldSetJsonContentType(body: ApiBody): boolean {
  if (!body) return true;
  return !(body instanceof FormData);
}

function shouldStringifyBody(body: ApiBody): body is JsonBody {
  if (!body) return false;
  if (typeof body === "string") return false;
  if (body instanceof FormData) return false;
  if (body instanceof URLSearchParams) return false;
  if (body instanceof Blob) return false;
  if (body instanceof ArrayBuffer) return false;
  if (ArrayBuffer.isView(body)) return false;
  return true;
}

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  const token = getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const bodyCandidate = options.body;
  if (!headers.has("Content-Type") && shouldSetJsonContentType(bodyCandidate)) {
    headers.set("Content-Type", "application/json");
  }

  const body = shouldStringifyBody(bodyCandidate)
    ? JSON.stringify(bodyCandidate)
    : (bodyCandidate as BodyInit | null | undefined);

  return fetch(buildUrl(path), {
    ...options,
    headers,
    body,
  });
}
