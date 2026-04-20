export const shellStyles = `
  .site-header {
    position: sticky;
    top: 0;
    z-index: 20;
    backdrop-filter: blur(18px);
    background: rgba(251, 248, 242, 0.8);
    border-bottom: 1px solid rgba(22, 34, 45, 0.08);
  }

  .site-header__inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .site-header__controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
  }

  .site-brand {
    display: inline-flex;
    align-items: center;
    color: var(--ink);
    text-decoration: none;
    white-space: nowrap;
  }

  .site-brand__logo {
    display: block;
    width: 7rem;
    height: auto;
  }

  .site-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .site-nav__link {
    text-decoration: none;
    color: var(--muted);
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 0.95rem;
  }

  .site-nav__link[aria-current="page"] {
    color: var(--ink);
    background: rgba(22, 34, 45, 0.06);
  }

  .site-main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 32px 24px 64px;
  }

  .site-footer {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 18px 24px 34px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-top: 1px solid rgba(22, 34, 45, 0.08);
    color: var(--muted);
    font-size: 0.88rem;
    line-height: 1.5;
    text-align: center;
  }

  .site-footer__name {
    color: var(--ink);
    font-weight: 600;
  }

  .site-footer__divider {
    color: rgba(22, 34, 45, 0.32);
  }
`;
