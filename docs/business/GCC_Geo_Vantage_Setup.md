# GCC geo vantage — setup guide

**Status:** approved by the founder 2026-09-14 (item 1 of the pending list). Paid/free tier choice is the founder's; everything after account creation is done by the exec.

## ✅ LIVE as of 2026-09-14 06:35 (Bahrain) — and no Google credential was ever handed over

| | |
|---|---|
| Instance | `gcc-geo-vantage`, zone `me-central1-a` (**Doha, Qatar**), `e2-micro`, Ubuntu 24.04, RUNNING |
| Address | `34.18.218.174` (kept in GitHub Actions secrets, not in this repo) |
| Access | SSH key only; **no service account, no scopes** on the box — it is a dumb exit node |
| Verified exit | `34.18.218.174 — Doha, Baladiyat ad Dawhah, QA` |
| Wiring | GitHub secrets `GCC_VPS_HOST` / `GCC_VPS_USER` / `GCC_VPS_SSH_KEY` set; workflow `gcc-geo-probe` ran green end-to-end |
| Cost | inside the approved band; see the estimate note below |

**Dammam was abandoned, not debugged:** Google's `me-central2` is gated commercially (KSA customers must buy via CNTXT; non-KSA need Invoiced Billing). Doha has no such gate.

**Cosmetic known issue:** the secret holding the SSH username is the string `geo`, so GitHub's log masker redacts every occurrence of `geo` in this workflow's logs — command names appear as `gcc_***_probe.mjs` and the exit IP prints as `***`. Nothing is broken; it is the masker doing its job on a very short secret value. Not worth a metadata change to fix.

## First results from inside the Gulf (2026-09-14)

Read-only run through the tunnel, from the sandbox and again from a GitHub runner:

| Title | Reading from Doha | Meaning |
|---|---|---|
| `kurulus-osman` (**control**) | list of 161–162 countries, **all six GCC present** | genuinely available in the Gulf — the control behaves as expected, and this is the first *positive* availability evidence we have ever had |
| `leyla` | list of 223 countries, **zero GCC** | blocked across the Gulf — third independent confirmation |
| `sahipsizler` | list of 231 countries, **zero GCC** | blocked across the Gulf — third independent confirmation |
| `kizilcik-serbeti` | list of 227 countries, **zero GCC** | blocked across the Gulf — third independent confirmation |
| `the-man-from-elysian-fields` | list of **11** countries, zero GCC | blocked — a real restore error from 2026-09-13, now hidden |
| `maniac-cop-2` | list of 247 countries, all six GCC present | legitimately available — its restore was correct |
| `maniac-cop-iii-badge-of-silence` | list of 236 countries, all six GCC present | legitimately available — its restore was correct |
| `the-dick-van-dyke-show` S5E26 | list of 249 countries, all six GCC present | legitimately available — its restore was correct |

**So of the four titles re-activated on 2026-09-13, three were correct and one was an error that is now corrected.** The vantage also settled two more open items the same way:

- The two titles a scheduled run restored at 03:30 (three-stooges-failed-pilot-2, thriller-the-return-of-andrew-bentley) are **archive.org public-domain items**, not geo-restricted at all. Both were re-verified by range request: `206 video/mp4`. **Legitimate restores, no regression** — and a reminder that a restore is only suspicious when the source is YouTube.
- Running the probe from a datacenter IP works: YouTube returns the normal page, no consent wall, no 429 at verification scale.

## Why this exists (one paragraph)

Our geo checks ask YouTube "is this video watchable in the Gulf?" The answer only appears on the watch page **when the video is unplayable from wherever we are asking**. Our production sweep runs from a US region, so a title that is playable in the United States and blocked in the Gulf returns a page with **no availability list at all** — which tells us nothing, and once caused three GCC-blocked titles to be restored to the live site (2026-09-14) and four more to be re-activated the evening before (2026-09-13). From a vantage **inside** the Gulf the reading becomes meaningful in both directions:

- **list present** → the video is blocked where we asked, and the list itself shows which Gulf countries *can* watch it
- **list absent** → the video **is playable in that country** — positive evidence, not silence

This also lets the exec's sandbox probe YouTube without hitting the HTTP-429 wall that killed every per-title sweep from a single IP.

## What it does NOT cover (honest limit — do not over-claim)

One vantage detects blocks that **include that country**, plus all GCC-wide blocks (the common case for licensing deals). It cannot see a block that excludes only *another* Gulf country. Full six-country coverage would need one vantage per country; that is a later decision, not this one.

## First, the reason Bahrain/UAE-AWS are off the table

Searched 2026-09-14: **AWS Middle East (Bahrain) `me-south-1` is unavailable** — AWS suspended billing there after conflict damage and told customers to recover elsewhere; UAE `me-central-1` is only partially available. So no AWS Bahrain/UAE for this.

## Recommended: Google Cloud, Dammam — Saudi Arabia (`me-central2`)

Chosen because Saudi Arabia is the Gulf market where content restrictions are most common, capacity is deterministic, and it needs no new vendor account beyond a billing profile.

### Steps (about 10 minutes, all in the browser)

1. Go to **https://console.cloud.google.com** and sign in with the Google account already used for Search Console / Play / AdSense.
2. Accept the terms and create a project: name it **`whisco-gcc-geo`** (any billing account name is fine).
3. Activate billing when prompted (**Billing → Link a billing account → Add payment method**). A card is required; the VM below costs roughly **$7–8/month [EST]** plus pennies of traffic. *The console shows the exact price on the create screen before you click Create — check it there.*
4. Go to **Compute Engine → VM instances → Create instance**.
5. Fill the form exactly:
   - **Name:** `gcc-geo-vantage`
   - **Region:** `me-central2 (Dammam)` — zone `me-central2-a`
   - **Machine type:** `e2-micro` (2 vCPU burst / 1 GB) — under "Machine type", pick **E2** series, then `e2-micro`
   - **Boot disk:** `Ubuntu 24.04 LTS`, `10 GB` standard persistent disk (the default size is larger; 10 GB is plenty)
   - **Firewall:** leave **both** "Allow HTTP traffic" and "Allow HTTPS traffic" **unchecked** (SSH is already allowed)
6. Open **Advanced options → Security → SSH keys → Add manually generated SSH keys** and paste the public key below. Save.
7. Click **Create**. When the instance shows a green check, copy its **External IP** from the list.

### The public key to paste (this is the only long value to enter)

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIkGonCxMU+BsUult8MMrx+Jzd2cPPoj5F9rT8Dx/MKY geo
```

The trailing word `geo` becomes the login user, so the login is `geo@<external IP>`. The matching **private** key is held out of the repo and never printed; if the key is ever lost, the fix is one new key line in the console — no rebuild.

If the paste field is not offered at create time, add it afterwards instead: **Compute Engine → Metadata → SSH Keys tab → Add SSH key → paste → Save**, then wait a few seconds.

### Then hand over one thing

Paste me the instance's **External IP**. Nothing else. I add it (plus the private key and user) to GitHub Actions secrets, and everything after that is mine.

## UPDATE 2026-09-14 — service-account keys are blocked on this org; use Cloud Shell

Founder hit **`iam.disableServiceAccountKeyCreation`** when trying to make the setup key JSON: an Organization Policy on the org (a "Secure by Default" style enforcement) blocks service-account key creation. This is Google deliberately closing the long-lived-credential path, and it is the right default — so the plan changed rather than fought it.

**Consequence: no Google credential of any kind needs to be handed over.** The VM is created from **Cloud Shell** (the founder's own browser session, no key, no token), and the exec receives only the instance's external IP. Everything after that runs over SSH with the tunnel keypair already held.

**The one paste (Cloud Shell, project = whatever the console selector shows, billing must be linked):**

```
gcloud services enable compute.googleapis.com && gcloud compute instances create gcc-geo-vantage --zone=me-central2-a --machine-type=e2-micro --image-family=ubuntu-2404-lts-amd64 --image-project=ubuntu-os-cloud --boot-disk-size=10GB --no-service-account --no-scopes --metadata=ssh-keys='geo:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIkGonCxMU+BsUult8MMrx+Jzd2cPPoj5F9rT8Dx/MKY geo' && echo "=== YOUR IP ===" && gcloud compute instances describe gcc-geo-vantage --zone=me-central2-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

Verified before handing over: `ubuntu-2404-lts-amd64` / `ubuntu-os-cloud` are the correct family and project (Canonical + Google docs), and `me-central2` carries zones `-a`, `-b`, `-c`. `--no-service-account` requires `--no-scopes`; both are included so the box holds no Google identity at all.

### Second attempt failed: Cloud Shell had no project selected

`ERROR: (gcloud.services.enable) The required property [project] is not currently set.` Cloud Shell starts with an empty active config, so the very first command in the chain aborted — **nothing was created**. The command below discovers the project, pins it, then builds.

**v2 — the paste that works (one line):**

```
P=$(gcloud projects list --format='value(projectId)' | head -1); echo "USING PROJECT: $P"; gcloud config set project "$P"; gcloud services enable compute.googleapis.com; gcloud compute instances create gcc-geo-vantage --zone=me-central2-a --machine-type=e2-micro --image-family=ubuntu-2404-lts-amd64 --image-project=ubuntu-os-cloud --boot-disk-size=10GB --no-service-account --no-scopes --metadata=ssh-keys='geo:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIkGonCxMU+BsUult8MMrx+Jzd2cPPoj5F9rT8Dx/MKY geo'; echo "=== YOUR IP ==="; gcloud compute instances describe gcc-geo-vantage --zone=me-central2-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

`;` separators (not `&&`) so one failed step still lets the later ones report their own error instead of hiding it. If the account holds several projects, the output line `USING PROJECT: <id>` says which one was used — tell me if it picked the wrong one and I will move it.

### Dammam (me-central2) is a dead end — switch the zone to Doha (me-central1-a)

Founder's third attempt created nothing and returned:

```
ERROR: (gcloud.compute.instances.create) Could not fetch resource:
 - Permission denied on 'locations/me-central2-a' (or it may not exist).
```

Cause found in Google's own docs (`cloud.google.com/docs/dammam-region-access`), not guessed: **the Dammam region is gated. KSA-based customers must buy through CNTXT, Google's exclusive reseller for the Kingdom; non-KSA customers can only use it on Invoiced Billing.** A self-serve credit-card account gets exactly the error above. There is no IAM fix — it is a commercial gate, and switching to invoiced billing to get a $5 proxy would be absurd.

**Fix: use Doha, Qatar — `me-central1-a`.** No equivalent gate is documented for `me-central1`, and the region launched with E2 VMs in all three zones. Qatar is a GCC state, so the vantage works for what we need. Everything else in the command is unchanged.

```
P=$(gcloud projects list --format='value(projectId)' | head -1); echo "USING PROJECT: $P"; gcloud config set project "$P"; gcloud compute instances create gcc-geo-vantage --zone=me-central1-a --machine-type=e2-micro --image-family=ubuntu-2404-lts-amd64 --image-project=ubuntu-os-cloud --boot-disk-size=10GB --no-service-account --no-scopes --metadata=ssh-keys='geo:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIkGonCxMU+BsUult8MMrx+Jzd2cPPoj5F9rT8Dx/MKY geo'; echo "=== YOUR IP ==="; gcloud compute instances describe gcc-geo-vantage --zone=me-central1-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

If `me-central1` is also refused, the fallback order is: **Oracle Cloud Dubai or Jeddah** (Always Free, no reseller gate) then **Azure Qatar Central**. Do not chase Dammam; it is not a technical problem.

### Cost revised upward, honestly

The earlier **$7–8/mo [EST]** covered compute only. Google now bills external IPv4 addresses that are attached and in use, which this box needs for SSH — allow **~$3–4/mo [EST]** on top, so budget **~$10–12/mo [EST]** total. Still inside the approved band and Tier 0. The console's own estimate on the instance screen is authoritative; the only hard figure to date is the **$0.01 budget alert** I will ask for.

**If the org policy is ever lifted and a key is preferred instead:** IAM & Admin → Organization Policies → filter for "Disable service account key creation" → Edit → *Override parent's policy* → Enforcement **Off** → Set policy. Needs the Organization Policy Administrator role, weakens the posture org-wide, and the key should still be revoked immediately after setup. Not the recommended route.

## Alternative if you would rather pay nothing: Oracle Cloud Always Free

- **Sign-up:** https://signup.cloud.oracle.com — pick **Home region: Saudi Arabia West (Jeddah)** *or* **UAE East (Dubai)** at signup. **The home region cannot be changed afterwards**, and Always Free resources only run there — this is the one step that cannot be undone, so choose deliberately.
- **Create:** Compute → Instances → Create → image `Canonical Ubuntu 24.04`, shape **VM.Standard.A1.Flex**, **1 OCPU / 6 GB**, add the same public key above under "Add SSH keys".
- **Known friction, honestly:** "Out of host capacity" is common on the free tier. The community fix is to upgrade the account to **pay-as-you-go** (card on file, still $0 while inside the Always Free limits: 4 OCPU / 24 GB ARM total, 10 TB outbound). Set a **budget alert** at $0.01 if you do.
- Cost: **$0/mo**.

Either provider works with the tooling already written — only the IP changes.

## What happens after the handover (exec side)

1. Add secrets `GCC_VPS_HOST`, `GCC_VPS_USER`, `GCC_VPS_SSH_KEY` (private key never in the repo).
2. Run the new workflow `gcc-geo-probe` with no targets first: it prints the tunnel's exit IP, city and country.
   **Gate:** nothing is ever written unless that exit is confirmed to be a GCC country — a non-GCC reading is exactly the ambiguity that caused the regression, and the script refuses to write on it.
3. Probe the control + the suspects in one run: `kurulus-osman` (known available — expected "playable where we asked"), the three Turkish titles, the four titles re-activated on 2026-09-13, and any raw video IDs as a second control.
4. Hide only on a **clean, list-backed BLOCKED-ALL-GCC** verdict; re-label the Turkish three honestly if the Gulf reading confirms the block.
5. Wire it into the audit cadence: channel-level sweep from the Gulf vantage (~110 channel probes instead of ~8,400 title probes), so a full availability re-check stops being a 15-day job.
6. Keep the US-side production sweep as-is: it is a **regression guard**, not a detector.

## Security posture

- The box runs **nothing of ours** — it is an SSH exit node. No database URL, no tokens, no code.
- SSH key only, no passwords; the repo holds the private key as an encrypted secret; nothing is printed to logs.
- Only port 22 is reachable; no web ports open.
- If the key or box is ever suspected compromised: replace the key line in the console, rotate the GitHub secret, done — no data lives on the box.

## Cost summary

| Item | Cost |
|---|---|
| GCP `e2-micro` (Dammam) | **~$7–8/mo [EST]** — exact figure shown by the console before Create |
| Egress (audits only, ~1.3 MB per probe) | **pennies/mo [EST]** — e.g. 500 probes ≈ 0.65 GB |
| 10 GB boot disk | included in the estimate above |
| Oracle Always Free (alternative) | **$0/mo** |
| AWS Bahrain / UAE | **not viable** — regional outage, AWS told customers to recover elsewhere |

Within the approved band and inside Tier 0; recurring, so it stays on the monthly cost line.
