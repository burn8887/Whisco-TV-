# Privacy Publication Status & Source Audit

**Version:** 1.1
**Reviewed:** 2026-10-28
**Status:** Internal audit note only. No privacy-page wording is approved for publication.
**Primary Phase 4 draft:** [PRIVACY-POLICY-DRAFT.md](PRIVACY-POLICY-DRAFT.md)

## Publication hold

The approved domain `www.salimdrive.com` is not live in the current project record. The two checked-in HTML privacy pages contain different operator-identity states and must not be treated as one verified or published policy:

- `site/privacy.html` names an individual operator and lists `legal@salimdrive.com` and `support@salimdrive.com`.
- `deploy/privacy.html` still contains an operating-entity placeholder.
- The legal operator, CR, controller, public identity, mailbox ownership/deliverability/monitoring, and legal approval are **NOT IN DATA**. Neither page’s identity/contact assertions are verified facts.

These HTML pages were inspected for this documentation review but **not edited**. Do not publish, deploy, link to, or cite them as the approved Salim policy. Do not insert “Whisco Media W.L.L” or a Founder name as a replacement without verified evidence and explicit approval.

## Limited source observations — not a complete data inventory

A limited source review found Android fine/coarse location declarations and foreground location-service permission, an iOS location usage description, a Google Mobile Ads dependency, and an iOS notice describing AdMob banners on Overview/Settings while no drive is active plus UMP consent handling. These observations do not prove the behavior of a signed production binary, current SDK configuration, all transitive dependencies, network traffic, data retention, processor roles, transfers, or store privacy declarations.

Other product records describe local location use, purchases, map data, and a source-only community-report service. Those design notes are not a substitute for validating the exact release candidate, all providers, server configuration, and operational settings. The report service is recorded as not deployed and shared reporting inactive; no community-report collection should be claimed or enabled based solely on source code.

## Required before publication

1. Verify legal entity/controller identity from current CR records and obtain Founder approval for public naming.
2. Verify that each support/privacy contact is owned, monitored, secure, staffed, and able to handle rights requests.
3. Complete Android and iOS release-binary, SDK, network, storage, backup, provider, retention and transfer audits.
4. Obtain Bahrain counsel/privacy review for PDPA notification/authorization, lawful bases, rights, transfers, security and breach procedures; separately assess each GCC country before service there.
5. Complete [PRIVACY-POLICY-DRAFT.md](PRIVACY-POLICY-DRAFT.md), remove placeholders from evidence, reconcile with platform privacy forms, and have Arabic/English wording reviewed.
6. Verify live HTTPS publication URL and ensure website, app notices, store listings, entity details and actual operation all match.
7. Obtain explicit Founder approval before any publication or website/app code change.

This file documents the publication gate. It is not itself a privacy policy, a statement of legal compliance, or permission to edit/deploy website or app files.
