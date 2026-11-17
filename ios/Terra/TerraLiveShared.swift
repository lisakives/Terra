import Foundation
import ActivityKit
import AppIntents
import WidgetKit

// Terra's Live Activity: today's routine on the Lock Screen (in the notification list) and in the Dynamic Island.
// This file is identical in the app and in the widget extension: the widget draws the activity,
// the app starts, updates and ends it, and the Done button's intent runs in the app.

@available(iOS 16.1, *)
struct TerraLiveAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var routine: String
        var next: String
        var nextId: String
        var done: Int
        var total: Int
        var queue: [TerraLiveStep]
    }
    var title: String
}

struct TerraLiveStep: Codable, Hashable {
    var id: String
    var text: String
    var routine: String
}

enum TerraLiveStore {
    /// "group.<app bundle id>" seen from either the app or the widget (whose id ends in ".widget")
    static var group: String {
        var id = Bundle.main.bundleIdentifier ?? "terra"
        if id.hasSuffix(".widget") { id = String(id.dropLast(".widget".count)) }
        return "group." + id
    }
    static func todayKey() -> String {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian); f.locale = Locale(identifier: "en_US_POSIX"); f.dateFormat = "yyyy-MM-dd"
        return f.string(from: Date())
    }
    /// The same queue the home screen widget's Done button uses; Terra applies it when it opens.
    static func markDone(_ id: String) {
        let d = UserDefaults(suiteName: group)
        var all = d?.stringArray(forKey: "terra.widget.done") ?? []
        let e = todayKey() + "|" + id
        if !all.contains(e) { all.append(e) }
        d?.set(all, forKey: "terra.widget.done")
    }
}

/// Done in the Live Activity: ticks the step off and moves the next one up, without opening Terra.
@available(iOS 17.0, *)
struct TerraLiveDoneIntent: LiveActivityIntent {
    static let title: LocalizedStringResource = "Mark step done"
    static let isDiscoverable: Bool = false
    @Parameter(title: "Step") var stepId: String
    init() {}
    init(stepId: String) { self.stepId = stepId }

    func perform() async throws -> some IntentResult {
        TerraLiveStore.markDone(stepId)
        for activity in Activity<TerraLiveAttributes>.activities {
            var s = activity.content.state
            s.queue.removeAll { $0.id == stepId }
            s.done = min(s.total, s.done + 1)
            if let n = s.queue.first {
                s.next = n.text; s.nextId = n.id; s.routine = n.routine
                await activity.update(ActivityContent(state: s, staleDate: nil))
            } else {
                s.next = ""; s.nextId = ""
                await activity.end(ActivityContent(state: s, staleDate: nil), dismissalPolicy: .after(Date().addingTimeInterval(120)))
            }
        }
        WidgetCenter.shared.reloadAllTimelines()
        NotificationCenter.default.post(name: Notification.Name("terraLiveDone"), object: nil)
        return .result()
    }
}
