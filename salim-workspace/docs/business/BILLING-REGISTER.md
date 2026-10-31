# Salim — Billing Register

**Version:** 1.0
**Snapshot:** 2026-10-28
**Owner:** Founder / designated finance owner (NOT IN DATA)
**Purpose:** Record actual vendor obligations, renewal/cancellation controls and reconciled payments. This is not evidence that any bill has been paid. Founder-provided planning input added 2026-10-28: USD 20,000/month available for Year 1 (USD 240,000 annualized), not transaction-specific authorization.

## Control rules

- Do not store card/bank details, passwords, tokens, private invoices, personal identity documents, or account recovery information in this Git library.
- Preserve invoices/receipts privately under the Founder-controlled financial records system; store only a safe locator, document date, vendor, invoice/reference ID with sensitive portions redacted, currency, amount, tax, payment status and reviewer here.
- Every new paid transaction, renewal, contract, trial that converts to paid, or advertising spend requires written transaction-specific Founder approval. Record the maximum amount, currency, purpose, start/end dates, renewal date, cancellation window and stop owner before acceptance.
- A free tier is not a permanent price guarantee. Record usage limits, overage behavior, data retention, export/termination and billing alerts.
- Distinguish amount invoiced, amount paid, refund/credit, tax, exchange rate, bank/card FX fee and cost center. Convert to BHD only with a recorded conversion source and date; FX method is **NOT IN DATA**.
- If a value cannot be verified, write `NOT IN DATA`, not zero. Do not infer spend from an account being active.

## Current vendor and obligation inventory

| Vendor / obligation | Service / purpose | Actual amount / currency / cadence | Status / evidence | Next action / owner |
|---|---|---|---|---|
| Founder-provided Year 1 operating envelope | Planning ceiling/availability, not a vendor expense or payment | USD 20,000/month; USD 240,000 annualized | Founder input recorded 2026-10-28; actual cash balance, committed spend and transaction approvals NOT IN DATA | Track actual approved spend separately; confirm rollover/meaning and Years 2–3 budgets |
| Apple Developer Program | iOS development, TestFlight/App Store distribution | **NOT IN DATA** | Developer account reported active; invoice, membership type, paid-through date, renewal and receipt are not supplied | Founder verifies account membership and receipt privately; record renewal/cancellation path |
| Google Play Console | Android distribution | **NOT IN DATA** | Developer account reported active; actual payment receipt/account standing not supplied. Google documents a US$25 one-time registration fee for a new account; this is a public reference, not proof of Salim's payment or any recurring charge. [Official registration guide](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en) | Founder reconciles the original receipt privately; confirm no additional recurring account obligation |
| Google AdMob | Potential advertising monetization | **NOT IN DATA** | Four repository variables are reported set in project context; this does not prove that an AdMob account is active, that ads serve, or that revenue exists. No settlement evidence supplied | Verify account, payment threshold/status, tax forms, consent settings and test/production units privately; actual revenue `$0` until verified receipt |
| `www.salimdrive.com` domain / DNS | Required public web domain | **NOT IN DATA** | Project snapshot says domain is not live; registrar, registration date, renewal, DNS/hosting and invoice are unknown | Founder verifies registrar and renewal privately; no substitute domain authorized |
| `support@salimdrive.com` / `legal@salimdrive.com` | Support and legal contact | **NOT IN DATA** | Founder-designated addresses; provider, mailbox status, monitoring and subscription unknown | Verify delivery, recovery and renewal without sharing credentials |
| Hosting / API / monitoring / backups | Production and shared reports if later approved | **NOT IN DATA** | Report service is source-only and not deployed; no vendor or contract evidenced | Do not provision until architecture, privacy/security, moderator, backup/restore and Founder approval exist |
| Map / route / geocoding SDKs or data | Map display / navigation / data | **NOT IN DATA** | No verified contract, country rights, usage tier or invoice included here | Inventory product dependencies and rights before release; obtain quotes only with Founder approval |
| Camera dataset / validation vendor | Potential country-specific licensed data | **NOT IN DATA** | No licensed/redistribution-cleared GCC dataset evidenced; G5 closed | No purchase until scope, rights, provenance, quality, update SLA and termination/export are verified |
| Analytics / consent / crash reporting | Product diagnostics and privacy-compliant measurement | **NOT IN DATA** | Services, SDK terms, data location, consent configuration and bills not verified | Map data flows and obtain privacy/security review before any new service |
| GitHub / CI / developer tools | Source control and builds | **NOT IN DATA** | Repository exists; account plan, usage, minutes/overages and invoices not supplied | Review billing dashboard and usage alerts; do not infer free or paid from repository access |
| Legal / accounting / tax / privacy counsel | Entity, commercial, privacy and tax review | **NOT IN DATA** | No engagements or invoices documented in this register | Obtain written scope and fee quote only after Founder approval |
| Research / marketing / user acquisition | Customer discovery and distribution | **NOT IN DATA** | No purchase or paid campaign evidenced; paid acquisition not authorized before G3 | Use no-cost discovery where lawful; require capped plan, attribution, and stop rule before spend |

## Payment and renewal ledger

No verified transaction records were provided for this snapshot. Add one row per invoice, credit, reimbursement, renewal, or settlement; never overwrite a historical amount. Keep private receipt files outside Git and use a non-sensitive reference.

| Transaction date | Vendor | Invoice/reference (redacted) | Purpose / approved cap | Amount / currency | Tax / FX / fees | Paid / due / credited | Renewal / cancellation deadline | Private evidence locator | Approver / reconciler |
|---|---|---|---|---|---|---|---|---|---|
| — | — | No verified transactions supplied | — | — | — | — | — | — | — |

## Monthly close checklist

- [ ] Reconcile every vendor statement and receipt to the approved amount and bank/card record; retain private source evidence.
- [ ] Update actual billing, credits, tax, FX and payment status; do not mix forecast with actual.
- [ ] Review upcoming renewals and cancellation windows; obtain written Founder approval before renewing.
- [ ] Review usage, overage alerts, API/data license terms and data retention; pause unused services only after preservation/export/security check.
- [ ] Match app-store/ad settlements to bank receipts; record gross sales, refunds, store/network fees, tax and net cash separately.
- [ ] Refresh forecast only from actual invoice history and measured usage; mark any assumed future load `[EST]` and show method.
- [ ] Record `NOT IN DATA` when statements, invoices or account access are unavailable.

## Founder inputs required

1. Who is the approved finance register owner and private evidence storage location? (Do not supply credentials.)
2. The Founder provided USD 20,000/month available in Year 1. Is this a hard maximum or planning envelope, and what one-off/recurring/emergency transaction approval process applies? Do not infer authorization for individual spend; further limits remain **NOT IN DATA**.
3. Are the Apple membership and Google Play registration receipts available for private reconciliation? Amount paid and paid-through/renewal facts remain **NOT IN DATA**.
4. Who monitors domain, support/legal mailbox and vendor renewals? Owner and alerts remain **NOT IN DATA**.
5. What accounting base currency/FX source and reporting period should be used? BHD is the proposed operating presentation currency; formal FX policy is **NOT IN DATA**.
