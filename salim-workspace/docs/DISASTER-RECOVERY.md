# Salim Disaster Recovery & Founder-Absence Protocol

**Version:** 1.0
**Snapshot date:** 2026-10-28
**Classification:** Operational; locations only, no credential values

> No password, token, recovery code, private key, certificate, customer record, precise route, or database dump belongs in this file or in chat. The Founder owns the actual credentials and recovery factors.

## 1. Credential and asset inventory (locations only)

| Asset | Approved location / system | Current status |
|---|---|---|
| GitHub source and CI | GitHub repository `burn8887/Whisco-TV-`, Salim files under `salim-workspace/`; session branch `arena/74afd701-whisco-tv` | Branch PR open; ensure at least two Founder-controlled maintainers and an offline clone/backup |
| Android upload key + passwords | GitHub Environment `salim-release` secrets; offline encrypted Founder backup outside all source checkouts | Secret values must never be copied into this repository or chat; exact backup status NOT IN DATA |
| Apple signing/profile material | GitHub `salim-release` environment and Founder-controlled secure storage as documented in `RELEASE-SIGNING.md` | Do not reuse Whisco assets; current exact backup/recovery status NOT IN DATA |
| Google Play | Founder-controlled Play Console account and its recovery controls | Account is reported active; account type, recovery owner and recovery test NOT IN DATA |
| Apple Developer / App Store Connect | Founder-controlled Apple account and account recovery controls | Reported active; recovery owner and recovery test NOT IN DATA |
| Domain and DNS | Founder-selected registrar/DNS account for `www.salimdrive.com` | Domain is not live as of snapshot; registrar, renewal date and recovery details NOT IN DATA |
| Support/legal email | Provider accounts for `support@salimdrive.com` and `legal@salimdrive.com` | Delivery and recovery controls NOT IN DATA |
| AdMob | Google AdMob account; non-secret identifiers in approved GitHub repository variables | Identifiers reported configured; account owner/recovery not verified |
| Camera-report service | No production host currently; source and deployment instructions under `salim-workspace/report-service/` | Not deployed; no live DB, API token, moderator console, or user report corpus should exist |
| Business finance/tax | Founder-designated business banking/accounting provider after entity verification | Provider, owner, and recovery process NOT IN DATA |

## 2. Recovery order

### A. Repository / CI unavailable

1. Founder authenticates to GitHub using personal account recovery; never send credentials to an agent.
2. Clone the repository to a clean machine and confirm branch/commit identity. Work only on `arena/74afd701-whisco-tv` for this project session; never switch or push to another branch without explicit Founder direction.
3. Verify Salim files are confined to `salim-workspace/` and Salim-specific workflow files. Do not use broad scripts against the host Whisco application.
4. Run the checks in `salim-workspace/docs/BUILDING-LOCALLY.md` and CI. Compare source commit and artifact checksum before any release.

### B. Android build or signing unavailable

1. Follow `BUILDING-LOCALLY.md` to prepare an isolated Salim-only build tree for this repository layout.
2. Build unsigned debug/test artifacts first. A debug APK or unsigned AAB is never a Play upload.
3. For a signed release, use only the manual, environment-gated Salim signing workflow and the `salim-release` environment. Confirm application ID `com.salimdrive.app`, version code, certificate fingerprint, ads configuration, and current privacy declarations.
4. If the upload key may be exposed, stop releases, preserve the key evidence privately, and follow Play Console upload-key reset/rotation procedures with the account owner. Do not rotate the Play App Signing key without a separate impact assessment.

### C. iOS build or signing unavailable

1. Build/test on authorized macOS/Xcode as documented in `BUILDING-LOCALLY.md`.
2. Verify bundle ID `com.salimdrive.app`, Apple team, profile, certificate, entitlements, privacy manifest, and archive contents before distribution.
3. If signing material is lost or compromised, revoke/replace using Apple Developer account controls; reassess installed apps and release continuity. Do not paste certificate/private-key content into tickets or chat.

### D. Domain/email unavailable

1. Founder recovers the registrar/provider account directly using its approved recovery method.
2. Verify ownership and DNS with the registrar and a second independent check before publishing a privacy/support URL.
3. Keep reporting disabled until the public endpoint, TLS, privacy disclosures, support mailbox, and moderator operations are verified end to end.
4. Do not redirect to an unrelated Whisco domain or use a substitute domain without Founder approval.

### E. Future report-service incident

The service is currently not deployed. If activated later: disable submission/approval endpoint first if integrity or privacy is uncertain; preserve a minimal incident log; notify the designated privacy/security owner; rotate service/moderator credentials in the hosting secret manager; restore from the last verified encrypted database backup; run integrity tests; reconcile audit events; re-enable only after a documented human decision. Never publish database dumps or exact user locations in the repo.

## 3. Founder-absence protocol

If the Founder is unavailable:

- No agent or contractor may sign a release, publish to a store, spend money, accept a contract, alter legal identity, or enable reporting based solely on this document.
- A pre-named successor can perform only reversible service-preservation tasks (e.g., pause a deployment or revoke an exposed secret) if the Founder has documented authority in the relevant account. The successor's identity, scope, and contact path are **NOT IN DATA** and must be designated by the Founder.
- If a safety-critical alert defect, wrong-coordinate cluster, privacy/security incident, or unsafe ad appears, pause the affected feed/feature or release using the documented platform control. Preserve evidence and stop public claims until reviewed.
- If no authorized successor exists, use platform support/recovery channels and keep the product/service disabled rather than improvising access.

## 4. Recovery drills still needed

- [ ] Verify that the Founder can recover GitHub, Play, Apple, domain, email, and finance accounts without the current device.
- [ ] Record registrar, renewal dates, app account owner, and designated successor (no secret values).
- [ ] Test rebuilding Salim from a clean clone and retrieving artifacts from CI.
- [ ] Create and test encrypted offsite backups for any future service database before launch.
- [ ] Document breach contacts, moderator incident contacts, counsel, and insurer if applicable; all currently NOT IN DATA.
- [ ] Rehearse Founder-unavailable release stop and report-service-disable procedures before any live user collection.
