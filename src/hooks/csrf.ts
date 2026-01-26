// CSRF token management hook

export function getCSRFToken(): string | null {
  return sessionStorage.getItem("csrfToken");
}

export function setCSRFToken(token: string): void {
  sessionStorage.setItem("csrfToken", token);
}

export function clearCSRFToken(): void {
  sessionStorage.removeItem("csrfToken");
}
