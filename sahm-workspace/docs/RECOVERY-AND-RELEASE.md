# Recovery and release status

## Restored and tracked in this PR

- Isolated source capsule, loss-resistant materializer, refusal to overwrite unrelated data or runtime edits.
- Responsive Sahm dashboard, illustrative Bahrain map, search, layers, simulated driving/voice alert, trip history, local report drafts, offline demo download, settings and safety disclosure.
- Reference proximity engine with spatial cells, direction/orientation filtering, GPS quality rejection, dynamic radius and repeat suppression.
- Dependency lockfile and repeatable preview build.

## Not claimed as recovered or release-ready

The prior expanded native workspace and its ZIP were lost during an environment reset. This PR does not substitute remembered test counts for present source. SwiftUI/Kotlin apps, SQLite/delta integration, section-control integration, vehicle/watch/car-display adapters and billing must be restored into **tracked** source and reverified. No APK/AAB/IPA is included and no store upload has occurred.

## Prioritized next work

1. Restore native Android source and executable engine contracts; restore SQLite and section control with expiry/reset tests.
2. Build with the complete Android SDK; exercise permission denial/revocation, foreground-service start/stop, cached/no-network operation, audio focus and accurate-GPS degradation on devices.
3. Produce an independently signed Android closed-test bundle only after confirming Sahm-specific package/signing identity, target-SDK policy, privacy disclosure and test-data labelling.
4. Restore SwiftUI/watchOS source, compile on an authorized Mac, test location/audio lifecycle and prepare an independently signed TestFlight demonstration.
5. Complete car-display approvals, Bluetooth/companion-device restrictions, billing sandbox flows, verified data integration and 3D/navigation provider work. Flags must never be presented as finished integrations.

Core road-awareness functionality must not depend on network availability or premium flags. No implementation can guarantee background GPS after OS force-stop, or unrestricted silent iOS Bluetooth startup. Demonstration data must never be sold as authoritative camera coverage.

## Founder isolation constraint

No Whisco app code, root package/configuration, workflows, cloud services, secrets, store entries, DNS or production deployments are changed by the Sahm source capsule. GitHub's existing integrations may inspect a PR; they are not reconfigured. The PR remains draft and is not merged automatically.
