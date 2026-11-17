import WidgetKit
import SwiftUI
import ActivityKit
import AppIntents

/// Today's routine as a Live Activity: a card on the Lock Screen (it stays in the notification list)
/// and a small leaf with progress in the Dynamic Island. The ✓ button ticks off the next step without opening Terra.
struct TerraLiveWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: TerraLiveAttributes.self) { ctx in
            LiveCard(state: ctx.state)
                .activityBackgroundTint(Color(hex: 0x1F1840).opacity(0.55))
                .activitySystemActionForegroundColor(.white)
        } dynamicIsland: { ctx in
            let s = ctx.state
            return DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Label(s.routine.isEmpty ? "Terra" : s.routine, systemImage: "leaf.fill")
                        .font(.caption.weight(.semibold)).foregroundStyle(Color(hex: 0xA9E4C0)).lineLimit(1)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("\(s.done)/\(s.total)").font(.caption.weight(.bold)).monospacedDigit()
                }
                DynamicIslandExpandedRegion(.bottom) {
                    HStack(spacing: 10) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(s.next).font(.headline).lineLimit(2)
                            LiveProgress(done: s.done, total: s.total)
                        }
                        Spacer(minLength: 4)
                        LiveDoneButton(id: s.nextId)
                    }
                }
            } compactLeading: {
                Image(systemName: "leaf.fill").foregroundStyle(Color(hex: 0xA9E4C0))
            } compactTrailing: {
                Text("\(s.done)/\(s.total)").font(.caption2.weight(.bold)).monospacedDigit()
            } minimal: {
                Image(systemName: "leaf.fill").foregroundStyle(Color(hex: 0xA9E4C0))
            }
            .widgetURL(URL(string: "terra://today"))
        }
    }
}

struct LiveCard: View {
    let state: TerraLiveAttributes.ContentState
    var body: some View {
        let tod = Tod(Date())
        ZStack {
            SceneBackground(tod: tod)
            LinearGradient(colors: [.black.opacity(0.35), .clear], startPoint: .leading, endPoint: .trailing)
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 6) {
                    Label(state.routine.isEmpty ? "Terra" : state.routine, systemImage: tod.symbol)
                        .font(.caption.weight(.semibold)).opacity(0.9)
                    if state.next.isEmpty {
                        Text("✓").font(.title2.weight(.bold))
                    } else {
                        Text(state.next).font(.headline).lineLimit(2)
                    }
                    HStack(spacing: 8) {
                        LiveProgress(done: state.done, total: state.total)
                        Text("\(state.done)/\(state.total)").font(.caption.weight(.bold)).monospacedDigit()
                    }
                }
                .softShadow()
                Spacer(minLength: 6)
                if !state.nextId.isEmpty { LiveDoneButton(id: state.nextId) }
            }
            .padding(14)
        }
        .foregroundStyle(.white)
        .widgetURL(URL(string: "terra://today"))
    }
}

struct LiveProgress: View {
    let done: Int, total: Int
    var body: some View {
        GeometryReader { g in
            ZStack(alignment: .leading) {
                Capsule().fill(Color.white.opacity(0.25))
                Capsule().fill(Color(hex: 0xA9E4C0))
                    .frame(width: total > 0 ? g.size.width * CGFloat(done) / CGFloat(total) : 0)
            }
        }
        .frame(height: 6)
    }
}

struct LiveDoneButton: View {
    let id: String
    var body: some View {
        Button(intent: TerraLiveDoneIntent(stepId: id)) {
            Image(systemName: "checkmark").font(.system(size: 18, weight: .bold))
                .frame(width: 44, height: 44)
                .background(Circle().fill(Color(hex: 0xA9E4C0)))
                .foregroundStyle(Color(hex: 0x1F3D2E))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Done")
    }
}
