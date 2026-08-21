import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Whisco TV handles your data: what we collect, how advertising works, and your choices.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-zinc-300 leading-relaxed">
      <h1 className="text-3xl font-extrabold text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated: August 2026</p>

      <div className="space-y-8 text-sm">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">Who we are</h2>
          <p>
            Whisco TV is a free, ad-supported streaming service. We never charge for content — the service is funded by
            advertising, which is why this policy explains both what we collect and how ads work.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">What we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="text-white font-medium">Account data (optional):</span> if you create a free account, we
              store your name, email address, and a hashed password. Accounts are only used for profiles, watchlists, and
              resume-watching.
            </li>
            <li>
              <span className="text-white font-medium">Watch progress:</span> if you use profiles, we store playback
              positions so you can continue where you left off.
            </li>
            <li>
              <span className="text-white font-medium">Technical logs:</span> our hosting provider (Vercel) processes
              standard request logs (IP address, browser type) to serve and secure the site.
            </li>
          </ul>
          <p className="mt-2">We do not sell your personal information.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Advertising & cookies</h2>
          <p>
            Whisco TV shows ads from third-party advertising partners, including Google AdSense. These partners may use
            cookies and similar technologies (such as the DoubleClick cookie) to show ads based on your prior visits to
            this and other websites, measure ad performance, and prevent fraud.
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              Google&apos;s use of advertising cookies is described at{" "}
              <a className="text-orange-400 hover:underline" href="https://policies.google.com/technologies/ads" rel="noopener noreferrer" target="_blank">
                policies.google.com/technologies/ads
              </a>
              .
            </li>
            <li>
              You can opt out of personalized advertising at{" "}
              <a className="text-orange-400 hover:underline" href="https://www.google.com/settings/ads" rel="noopener noreferrer" target="_blank">
                Google Ads Settings
              </a>{" "}
              or{" "}
              <a className="text-orange-400 hover:underline" href="https://www.aboutads.info" rel="noopener noreferrer" target="_blank">
                aboutads.info
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Third-party content</h2>
          <p>
            Some videos and live channels play through embedded players from the original broadcasters (for example,
            official YouTube channel embeds). Those players are governed by the respective platform&apos;s own privacy
            policy — e.g.{" "}
            <a className="text-orange-400 hover:underline" href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">
              Google/YouTube&apos;s privacy policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Your choices</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You can use Whisco TV without an account.</li>
            <li>You can delete your account and profiles at any time from the Account page.</li>
            <li>You can control cookies through your browser settings and the ad-personalization links above.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Children</h2>
          <p>
            Whisco TV is a general-audience service and is not directed at children under 13. Kids profiles are a
            content-filtering convenience for parents, not a children&apos;s service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Contact</h2>
          <p>Questions about this policy? Contact us at privacy@whisco.tv.</p>
        </section>
      </div>
    </div>
  );
}
