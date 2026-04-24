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
    width: 3rem;
    height: auto;
  }

  .site-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .site-nav__link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: var(--muted);
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid transparent;
    background: transparent;
    font-size: 0.95rem;
    text-align: center;
    transition:
      border-color 0.18s ease,
      background 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .site-nav__link:hover,
  .site-nav__link:focus-visible {
    border-color: rgba(22, 34, 45, 0.08);
    background: rgba(22, 34, 45, 0.05);
    color: var(--ink);
    box-shadow: inset 0 -1px 0 rgba(22, 34, 45, 0.03);
  }

  .site-nav__link:focus-visible {
    outline: var(--interactive-outline);
    outline-offset: 2px;
  }

  .site-nav__link[aria-current="page"] {
    border-color: rgba(173, 123, 58, 0.12);
    background: rgba(173, 123, 58, 0.05);
    color: var(--ink);
    box-shadow: inset 0 -1px 0 rgba(173, 123, 58, 0.34);
  }

  .site-nav__link[aria-current="page"]:hover,
  .site-nav__link[aria-current="page"]:focus-visible {
    border-color: rgba(173, 123, 58, 0.16);
    background: rgba(173, 123, 58, 0.07);
    color: var(--ink);
    box-shadow: inset 0 -1px 0 rgba(173, 123, 58, 0.46);
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

  @media (max-width: 900px) {
    .site-header__inner {
      display: grid;
      justify-content: stretch;
      gap: 10px;
    }

    .site-header__controls {
      min-width: 0;
      justify-content: center;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .site-header__controls::-webkit-scrollbar {
      display: none;
    }

    .site-brand {
      justify-self: center;
    }

    .site-brand__logo {
      width: 3rem;
    }

    .site-nav {
      width: max-content;
      max-width: 100%;
      flex-wrap: nowrap;
      gap: 8px;
      padding-bottom: 2px;
    }

    .site-nav__link {
      flex: 0 0 auto;
      padding: 8px 11px;
    }
  }

  @media (max-width: 640px) {
    .site-header {
      position: static;
    }

    .site-main {
      padding: 24px 16px 48px;
    }

    .site-footer,
    .site-header__inner {
      padding-left: 16px;
      padding-right: 16px;
    }

    .site-footer {
      display: grid;
      gap: 4px;
      justify-items: center;
      padding-top: 16px;
      padding-bottom: 28px;
    }

    .site-footer__divider {
      display: none;
    }
  }

  @media (max-width: 380px) {
    .site-header__inner {
      padding-top: 12px;
      padding-bottom: 12px;
    }

    .site-header__controls {
      overflow: visible;
    }

    .site-brand__logo {
      width: 2.85rem;
    }

    .site-nav {
      width: 100%;
      max-width: 20rem;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
      padding-bottom: 0;
    }

    .site-nav__link {
      min-width: 0;
      padding: 8px 10px;
      font-size: 0.86rem;
      line-height: 1.2;
    }
  }
`;
