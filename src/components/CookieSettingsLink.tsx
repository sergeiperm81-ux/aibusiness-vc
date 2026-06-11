"use client";

/** Footer link that reopens the cookie consent banner so visitors can change/withdraw consent. */
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
      className="hover:text-foreground"
    >
      Cookie preferences
    </button>
  );
}
