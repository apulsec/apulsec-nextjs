# Next.js template

This is a Next.js template with shadcn/ui.

## SEO and page metadata

The root layout and the home, blog, and about pages export static Next.js
Metadata API objects. `lib/metadata.ts` keeps each page's title and description
consistent with its Open Graph and Twitter summary metadata. The existing
`app/favicon.ico` is discovered through Next.js file-based metadata.

The document defaults to Simplified Chinese (`zh-CN`). English passages and
widgets use `lang="en"` so assistive technology can select the appropriate
pronunciation without changing the layout.

`app/robots.ts` allows page crawling and excludes `/api/`. This is crawler
guidance, not access control or a guarantee that a URL will not be indexed.
Preview deployments need their own indexing policy.

No production domain or dedicated sharing image has been confirmed, so this
change deliberately omits `metadataBase`, canonical URLs, `og:url`, sharing
images, and a sitemap. Once the production origin is verified:

- Set `metadataBase` and a distinct canonical/Open Graph URL for each page.
- Add `app/sitemap.ts` with the confirmed absolute URLs for `/`, `/blog`, and
  `/about`; include article URLs only when those routes actually exist.
- Advertise the sitemap's absolute URL in `app/robots.ts`.
- Add social images only after verifying the assets and their public URLs.

Check the production HTML, `/robots.txt`, any future `/sitemap.xml`, and social
previews after deployment. Local checks cannot establish live indexing or
deployment behavior.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
