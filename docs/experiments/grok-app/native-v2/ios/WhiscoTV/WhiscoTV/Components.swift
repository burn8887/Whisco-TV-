import SwiftUI

struct PosterView: View {
    let title: CatalogTitle
    var body: some View {
        NavigationLink(value: title) {
            VStack(alignment: .leading, spacing: 6) {
                ZStack(alignment: .bottomLeading) {
                    AsyncImage(url: URL(string: title.posterUrl ?? "")) { phase in
                        switch phase {
                        case .success(let img): img.resizable().scaledToFill()
                        default: WhiscoTheme.elevated
                        }
                    }
                    .frame(width: 168, height: 94)
                    .clipped()
                    LinearGradient(colors: [.clear, WhiscoTheme.bg.opacity(0.9)], startPoint: .center, endPoint: .bottom)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(title.name).font(.caption.weight(.medium)).lineLimit(2).foregroundStyle(WhiscoTheme.fg)
                        Text([title.language, title.releaseYear.map(String.init)].compactMap { $0 }.joined(separator: " · "))
                            .font(.caption2)
                            .foregroundStyle(WhiscoTheme.muted)
                    }
                    .padding(8)
                }
                .frame(width: 168, height: 94)
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel(title.name)
    }
}

struct HeroCard: View {
    let title: CatalogTitle
    var body: some View {
        NavigationLink(value: title) {
            ZStack(alignment: .bottomLeading) {
                AsyncImage(url: URL(string: title.backdropUrl ?? title.posterUrl ?? "")) { phase in
                    switch phase {
                    case .success(let img): img.resizable().scaledToFill()
                    default: WhiscoTheme.elevated
                    }
                }
                LinearGradient(colors: [.clear, WhiscoTheme.bg], startPoint: .center, endPoint: .bottom)
                VStack(alignment: .leading, spacing: 4) {
                    Text(title.collection ?? "Featured")
                        .font(.caption2)
                        .textCase(.uppercase)
                        .tracking(1.4)
                        .foregroundStyle(WhiscoTheme.muted)
                    Text(title.name).font(.title.bold())
                }
                .padding(20)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 220)
            .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

struct ChannelChip: View {
    let channel: Channel
    var body: some View {
        HStack(spacing: 10) {
            ZStack(alignment: .topTrailing) {
                logo
                    .frame(width: 44, height: 44)
                    .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                Circle().fill(WhiscoTheme.live).frame(width: 8, height: 8).offset(x: 2, y: -2)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(channel.name).font(.subheadline.weight(.semibold)).lineLimit(1)
                Text([channel.language, channel.country, channel.category].compactMap { $0 }.joined(separator: " · "))
                    .font(.caption2)
                    .foregroundStyle(WhiscoTheme.muted)
                    .lineLimit(1)
                TimelineView(.periodic(from: .now, by: 15)) { context in
                    Text(HomeTime.channelLabel(channel, now: context.date))
                        .font(.caption2)
                        .foregroundStyle(WhiscoTheme.subtle)
                        .monospacedDigit()
                }
            }
            Spacer(minLength: 0)
        }
        .padding(12)
        .background(WhiscoTheme.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    @ViewBuilder private var logo: some View {
        if let s = channel.logoUrl, let u = URL(string: s) {
            AsyncImage(url: u) { phase in
                switch phase {
                case .success(let img): img.resizable().scaledToFill()
                default: WhiscoTheme.elevated
                }
            }
        } else {
            WhiscoTheme.elevated.overlay(Text("TV").font(.caption2).foregroundStyle(WhiscoTheme.muted))
        }
    }
}

struct MosaicCell: View {
    let channel: Channel
    var body: some View {
        NavigationLink(value: channel) {
            VStack(alignment: .leading, spacing: 6) {
                ZStack(alignment: .topTrailing) {
                    logo.aspectRatio(1, contentMode: .fill)
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    Circle().fill(WhiscoTheme.live).frame(width: 8, height: 8).padding(6)
                }
                Text(channel.name).font(.caption2.weight(.medium)).lineLimit(2).foregroundStyle(WhiscoTheme.fg)
                TimelineView(.periodic(from: .now, by: 15)) { context in
                    Text(HomeTime.channelLabel(channel, now: context.date))
                        .font(.caption2)
                        .foregroundStyle(WhiscoTheme.subtle)
                        .lineLimit(1)
                        .monospacedDigit()
                }
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(channel.name), live")
    }

    @ViewBuilder private var logo: some View {
        if let s = channel.logoUrl, let u = URL(string: s) {
            AsyncImage(url: u) { phase in
                switch phase {
                case .success(let img): img.resizable().scaledToFill()
                default: WhiscoTheme.elevated
                }
            }
        } else {
            WhiscoTheme.elevated
        }
    }
}

struct Chip: View {
    let label: String
    let selected: Bool
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.subheadline)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(selected ? WhiscoTheme.accent.opacity(0.18) : Color.clear, in: Capsule())
                .overlay(Capsule().stroke(selected ? WhiscoTheme.accent.opacity(0.5) : WhiscoTheme.muted.opacity(0.25)))
                .foregroundStyle(selected ? WhiscoTheme.fg : WhiscoTheme.muted)
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(selected ? [.isSelected] : [])
    }
}

struct EmptyState: View {
    var title: String
    var detail: String
    var body: some View {
        VStack(spacing: 12) {
            Image("WhiscoSit")
                .resizable()
                .scaledToFit()
                .frame(width: 88, height: 88)
                .accessibilityHidden(true)
            Text(title).font(.headline)
            Text(detail).font(.subheadline).foregroundStyle(WhiscoTheme.muted).multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 32)
    }
}
