# Salim camera reports (operator-hosted service)

This is an independently deployable, standard-library Python service for camera reports, distinct-device community confirmations, public human-approved camera additions/overrides, and an authenticated moderation queue. It is not deployed by this repository and is not a Vercel serverless function: SQLite must live on persistent storage. Do not describe reports as shared until this service is deployed, configured, reachable over HTTPS, and tested from both native apps.

## Safety and verification model

- Every report is `PENDING`. Reports and votes never create or change an alert by themselves.
- A moderator must approve with a type-appropriate resolution. Only approvals publish a new camera or a camera override.
- Confirm/dispute votes are unique per pseudonymous installation identifier and report. A secret HMAC pepper is used; the raw installation identifier is not stored. The reporter cannot vote on their own report. This is **device-level pseudonymous abuse resistance**, not proof of a person's legal identity, device integrity, physical presence, or GPS accuracy. Do not call it identity verification.
- There are rate limits (12 reports and 30 votes per HMAC identifier per rolling day), duplicate checks, strict payload bounds, no free-text comments, and no IP/user-agent logging in this application. A determined person can reset/reinstall or use multiple devices; human review remains required.
- Location proposals require a reported accuracy of 50 m or better, but the server cannot independently attest that the client GPS is truthful. Moderators must check authoritative evidence; no community vote can establish official status.
- Data covers road-awareness cameras only. No police/patrol or covert-detection report types exist.
- Reports, votes, and review history are purged after 365 days. Approved camera rows/overrides remain until changed or removed by a moderator. The database contains camera coordinates, optional road labels, report identifiers, and HMAC contributor pseudonyms during the retention period; it does not request names, emails, phone numbers, or precise reporter tracking routes.

## Run tests

```sh
python3 -m unittest discover -s salim-workspace/report-service -p 'test_*.py' -v
```

Tests use a temporary local SQLite database and fake secrets. They do not connect to or modify production services.

## Host setup

Use a Linux host with Docker Compose, a persistent disk, TLS, backups, and an operator responsible for the moderation queue. Configure DNS and HTTPS for the approved Salim domain first. The service container listens only on `127.0.0.1:8080`; put a reverse proxy in front of it and route `/v1/*`, `/admin`, `/admin.js`, and `/health` to this container. If the public site is on `www.salimdrive.com`, keep the public API at `https://www.salimdrive.com/v1` (or have the reverse proxy map `/api/v1` to `/v1` and configure both native clients consistently). Do not substitute `salim-tan.vercel.app` or another domain for the approved domain.

Create a private `.env` file in this directory (never commit it):

```dotenv
SALIM_REPORT_PEPPER=<unique random 32+ character secret>
SALIM_MODERATOR_TOKEN=<unique random 32+ character secret>
SALIM_REPORT_ORIGIN=https://www.salimdrive.com
```

Store those secrets in the host's secret manager. Do not put them in app builds, GitHub source, chat, logs, or the moderator web bundle. Start with `docker compose up -d --build`. Verify `https://www.salimdrive.com/health` and `https://www.salimdrive.com/admin` after TLS/routing are live. Back up the named `salim_reports` volume with encryption and test restoration before real submissions.

Example Caddy site block after DNS points to the host (configure access logs off; the application intentionally does not log client addresses):

```caddyfile
www.salimdrive.com {
    reverse_proxy 127.0.0.1:8080
}
```

The host still needs ordinary security updates, firewall rules, encrypted backups, monitoring, token rotation, and a named human moderator. The repository alone does not supply these services.

## Moderator queue

Open `/admin` over HTTPS. Paste the moderator token into the password field; it is held in `sessionStorage` for the current browser tab session and never saved to local storage. Review the submitted camera reference, country, pin, claimed accuracy, independent confirmations/disputes, and audit history. Check official/provider evidence and map alignment before approval. Approval choices deliberately differ by report type. Reject or mark for further review when evidence is insufficient. Never approve solely because a vote threshold is met.

## API outline

- `GET /health`
- `POST /v1/reports`: `ADD_CAMERA`, `VERIFY_PRESENT`, `FLAG_LOCATION`, `FLAG_REMOVED`, or `FLAG_TYPE`.
- `POST /v1/reports/{uuid}/votes`: independent `CONFIRM` or `DISPUTE` vote.
- `GET /v1/reports/{uuid}`: status and aggregate vote counts only.
- `GET /v1/cameras?country=BH`: human-approved community additions only.
- `GET /v1/camera-overrides?country=BH`: human-approved status/location overrides for all reviewed camera IDs in one GCC country; alternatively `?ids=...` returns a specific set of up to 100 IDs.
- `GET /v1/admin/reports?status=PENDING`: authenticated queue.
- `GET /v1/admin/reports/{uuid}/history`: authenticated review history.
- `POST /v1/admin/reports/{uuid}/decision`: authenticated human decision and resolution.

This is a service foundation, not a live backend. Native app integration, published privacy disclosures, endpoint configuration, production hosting, backups, moderator training, and end-to-end testing against the real HTTPS endpoint are required before store submission. Do not collect live submissions until those steps are complete.
