# Publishing Meyouu to Google Play Store via Trusted Web Activity (TWA)

This document explains how to publish the Meyouu marketplace web app as an Android application on the Google Play Store using a Trusted Web Activity (TWA) wrapper.

## What This Project Provides

This repository includes all the necessary PWA (Progressive Web App) assets for Meyouu:

- **Web App Manifest** (`frontend/public/manifest.webmanifest`) with app metadata
- **Service Worker** (`frontend/public/service-worker.js`) for offline support
- **PWA Icons** (192x192, 512x512, maskable) for Android install prompts
- **Apple Touch Icon** (180x180) for iOS devices
- **Offline Fallback Page** for when network is unavailable

## What Is NOT Included

This repository does **not** produce:

- Android App Bundle (AAB) or APK files
- Google Play Console listing and metadata
- App signing keys or certificates
- TWA wrapper code (you'll use a tool to generate this)

## Meyouu App Details

Use these values when setting up your TWA:

- **App Name**: Meyouu
- **Short Name**: Meyouu
- **Description**: Buy and sell your items on Meyouu marketplace
- **Start URL**: `https://your-deployed-domain.com/` (replace with your actual production URL)
- **Package Name**: `com.meyouu.app` (or your preferred package name following reverse domain notation)
- **Theme Color**: `#f97316` (orange)
- **Background Color**: `#ffffff` (white)

## Steps to Publish on Google Play Store

### 1. Deploy Your Web App

First, deploy the Meyouu web app to a production server with HTTPS enabled. The Internet Computer deployment URL can be used directly.

**Requirements:**
- HTTPS enabled (required for PWA and TWA)
- Service worker accessible at `/service-worker.js`
- Manifest accessible at `/manifest.webmanifest`
- All PWA icons accessible under `/assets/generated/`

### 2. Generate TWA Wrapper

Use one of these tools to generate an Android TWA wrapper:

#### Option A: Bubblewrap CLI (Recommended)

