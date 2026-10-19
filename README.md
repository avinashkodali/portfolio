# Avinash Kodali — Portfolio

A responsive, buildless portfolio for Java full-stack development and data engineering.

## Structure

- index.html — semantic content and page structure
- assets/styles.css — responsive light/dark themes and reduced-motion support
- assets/app.js — filters, keyboard-operated tabs, theme switch, case-study routing, and clipboard controls
- assets/Avinash_Kodali_Resume.pdf — supplied resume

## Preview

Serve this directory with a static HTTP server. For example: python -m http.server 4173
Then open http://localhost:4173/ . No dependency installation or build step is required.

## Share a case study

Use ?case=pipeline#work, ?case=events#work, ?case=research#work, or ?case=simulation#work. The case-study dialog opens on initial load. The copy-link control uses the current site origin, so links work on the deployed GitHub Pages URL.

## Content

Employment descriptions and metrics follow the supplied resume. Projected savings are labeled separately from achieved results. The public AWS image-recognition sample is linked to the existing MS-Projects repository and credits the app-tier contribution described in its README. Professional-work diagrams are conceptual.

## Deployment

The relative asset paths support GitHub Pages at /portfolio/. Serve index.html and assets together from the selected Pages branch root.
