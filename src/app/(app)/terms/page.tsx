import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of Whisco TV's free, ad-supported streaming service.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-zinc-300 leading-relaxed">
      <h1 className="text-3xl font-extrabold text-white mb-2">Terms of Use</h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated: August 2026</p>

      <div className="space-y-8 text-sm">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. The service</h2>
          <p>
            Whisco TV provides free, ad-supported access to live TV channels and on-demand video. There are no
            subscriptions, fees, or paid tiers. By using the service you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. Content sources</h2>
          <p>
            Whisco TV catalogs and plays content from legitimate sources: free-to-air broadcaster streams, official
            broadcaster channel embeds (e.g. YouTube players operated by the rights holders, who retain their own
            advertising), and public-domain or freely licensed on-demand titles. We do not host pirated content. Rights
            holders who wish to have a source reviewed or removed can contact us at legal@whiscotv.com and we will
            respond promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. Acceptable use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Don&apos;t attempt to rip, re-stream, or redistribute streams from the service.</li>
            <li>Don&apos;t circumvent, scrape, or overload the service or its ad delivery.</li>
            <li>Don&apos;t use the service where doing so would violate your local laws.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">4. Availability</h2>
          <p>
            Channels and titles come from third-party sources that can change or go offline. We monitor the catalog
            automatically and remove dead sources, but we make no guarantee of uninterrupted availability of any
            particular channel or title.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">5. Accounts</h2>
          <p>
            Accounts are optional and free. You are responsible for keeping your password secure. We may remove accounts
            used to abuse the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">6. Disclaimer & liability</h2>
          <p>
            The service is provided &quot;as is&quot; without warranties of any kind. To the maximum extent permitted by
            law, Whisco TV is not liable for indirect or consequential damages arising from use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">7. Changes</h2>
          <p>
            We may update these terms as the service evolves; the &quot;last updated&quot; date above will change when we
            do. Continued use after changes means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Contact</h2>
          <p>Questions? Contact us at legal@whiscotv.com.</p>
        </section>
      </div>
    </div>
  );
}
