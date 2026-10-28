# Salim privacy policy — publication draft

**Not yet published or legally approved.** The public text is authored at `site/privacy.html` and is intended for `https://www.salimdrive.com/privacy`; the approved domain is not live and nothing has been deployed. The operating entity and support/legal contacts are now specified in the site draft, but the Founder must review the final wording and ensure both email addresses are monitored before publication. Interim store links remain the Google Docs listed in `STORE-LISTING-DRAFT.md`; confirm they are current and publicly readable before use.

This draft reflects the current native source state. It does not establish that the apps have passed a complete build or that any service is operating.

## Current data and coverage

Salim has no account system or analytics SDK. Nearby mapped camera data may come from OpenStreetMap/Overpass and can be incomplete or inaccurate. No verified static GCC camera pack is bundled. The service package at `report-service/` is not deployed; the app build configuration is empty, so shared camera reports and confirmations cannot currently be sent. Do not collect real submissions or state that moderation is live until the approved domain, durable database, HTTPS endpoint, privacy notice, backups and human operator are verified.

## Location

A simulated drive needs no GPS permission. When the user explicitly starts a device GPS session, precise coordinates, speed, direction, accuracy and sample timing are used in memory to calculate nearby alerts. The route is not saved or uploaded to Salim. Nearby map tile or camera-data requests may reveal the viewed map tiles or a coarse search area to the respective map/data provider. End the session to stop location updates; operating-system suspension or force-quit may interrupt it.

## Future shared camera reports — disabled

Before enabling the service, publish and validate the exact endpoint and retention terms. A report may contain a camera identifier, country, camera type, proposed camera pin, user-claimed location accuracy, optional road label and a random installation identifier. That identifier is a pseudonymous abuse-control method, not identity verification, device attestation or proof of physical presence; the service stores a keyed hash rather than the raw value. Pending camera pins and aggregate independent confirmations/disputes would be visible to Community users, clearly marked unverified. No report or community vote may change alerts without human moderation. The planned retention period is 365 days for reports, votes and audit history; approved camera records may remain until a later reviewed correction or removal. Names, phone numbers and email addresses are not requested. Hosting/network providers may process connection metadata such as IP addresses, even though the report API is designed not to retain request IPs. Update this policy with the actual hosting provider, retention, moderator process, and user request/deletion mechanism before the service is enabled.

## Local storage and deletion

The apps store preferences, locally cached camera data, bounded trip summaries and general road-note drafts that users explicitly save. Android app backup is disabled; iOS local records may be included in device backups according to operating-system settings. Users can delete trip summaries and local drafts in the app. Camera report form text is not saved or transmitted in the current unconfigured build; Android may store a random installation identifier after a Community action.

## Advertising and purchases

Demo/debug builds must contain no ads. Store builds are intended to show AdMob only on eligible idle screens, never during an active drive; EEA/UK consent is required before ad requests where applicable. Google may process device identifiers, IP address, diagnostics and ad interactions under its own privacy policy. Subscriptions are handled by Google Play or Apple; Salim does not receive card details. No safety alert is paywalled. Complete platform data-safety/privacy labels only against the exact signed binary and provider SDK behavior.

## Choices, contact and rights

Users can revoke location permission, end a session, delete local history/drafts and manage subscriptions through the app stores. Privacy requests should be sent to `legal@salimdrive.com`; support requests to `support@salimdrive.com`. Verify the addresses and response process before publishing. Applicable privacy rights and required response periods depend on the user's jurisdiction.

## Release gate

The approved domain is not live, no shared-report backend is deployed, no current signed build has been verified, and complete GCC camera data is not available. This draft is not a substitute for legal review, App Store privacy details, Google Play Data Safety answers, or the disclosures required before enabling a reporting service.
