import { Metadata, Route } from 'next';
import { getSiteConfig } from '@/lib/api';

export default function robots() {
    const site = getSiteConfig();
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/api/'], // Block API routes if any internal ones exist, usually fine
        },
        sitemap: `${site.domain}/sitemap.xml`,
    };
}
