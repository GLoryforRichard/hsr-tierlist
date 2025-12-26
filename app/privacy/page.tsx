import { Metadata } from 'next';
import { getSiteConfig } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Privacy Policy',
};

export default function PrivacyPage() {
    const site = getSiteConfig();
    return (
        <div className="max-w-3xl mx-auto prose prose-invert">
            <h1>Privacy Policy</h1>
            <p>Last Updated: {site.lastUpdated}</p>
            <p>This is a placeholder privacy policy for the MVP foundation. We respect your privacy and do not collect personal data beyond standard analytics.</p>
        </div>
    );
}
