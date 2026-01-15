import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";

/**
 * Read auth token from cookie
 */
export function getAuthCookie(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

/**
 * Set auth cookie
 */
export function setAuthCookie(token: string) {
  Cookies.set(TOKEN_KEY, token, {
    path: "/",
    sameSite: "lax",
    expires: 24 * 60 * 60,
  });
}

/**
 * Remove auth cookie
 */
export function clearAuthCookie() {
  Cookies.remove(TOKEN_KEY, { path: "/" });
}
