const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
const PLACEHOLDER_URL = "/avatar-placeholder.svg";

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function normalizePhotoPath(value: string): string {
  const slashNormalized = value.replace(/\\/g, "/").trim();
  const withoutLeadingSlash = slashNormalized.replace(/^\/+/, "");

  // Collapse repeated uploads prefixes like uploads/uploads/file.jpg
  return withoutLeadingSlash.replace(/^(uploads\/)+/i, "uploads/");
}

export function resolveProfilePhotoUrl(path: string | null): string {
  if (!path) {
    return PLACEHOLDER_URL;
  }

  if (isAbsoluteUrl(path)) {
    return path;
  }

  const cleanPath = normalizePhotoPath(path);
  if (!cleanPath) {
    return PLACEHOLDER_URL;
  }

  return API_BASE_URL ? `${API_BASE_URL}/${cleanPath}` : `/${cleanPath}`;
}
