# Specification

## Summary
**Goal:** Add Progressive Web App (PWA) support to Meyouu so it can be installed on Android and packaged for Google Play via a Trusted Web Activity (TWA) workflow.

**Planned changes:**
- Add and link a Web App Manifest with Meyouu name/branding, standalone display mode, theme/background colors, and icon configuration.
- Add and register a service worker to cache the app shell and provide a basic offline fallback message/page.
- Ensure installed-app launches and deep links work for existing routes (/, /listing/:id, /create, /my-listings) without blank pages on refresh.
- Add Play Store-suitable PWA icon assets (including maskable and apple-touch-icon) under public assets and reference them from the manifest.
- Add an in-app “Install app” entry point that appears when installation is supported, otherwise shows brief English guidance.
- Add repository documentation describing how to publish the PWA as an Android app using a TWA wrapper, including Meyouu-specific placeholder values (app name, start URL, package name) and what is/not produced by this repo.

**User-visible outcome:** Users on Android can install Meyouu from the browser into a standalone app-like experience with Meyouu branding, basic offline fallback behavior, working deep links, and guidance for installing; the repo includes instructions for packaging the PWA for Play Store via TWA.
