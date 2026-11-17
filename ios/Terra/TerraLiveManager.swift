import Foundation
import ActivityKit

/// Starts, updates and ends Terra's Live Activity from the same data the home screen widget gets.
/// iOS only lets an app start a Live Activity while it is open, so it begins the first time Terra is opened
/// on a day with steps left, and then follows along until everything is done.
enum TerraLiveManager {
    private static var lastJSON = ""
    static func sync(json: String) {
        guard #available(iOS 17.0, *) else { return }
        if json == lastJSON && !Activity<TerraLiveAttributes>.activities.isEmpty { return }
        lastJSON = json
        guard let data = json.data(using: .utf8),
              let o = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else { return }
        let next = o["next"] as? String ?? ""
        let nextId = o["nextId"] as? String ?? ""
        let done = o["done"] as? Int ?? 0
        let total = o["total"] as? Int ?? 0
        let list = (o["list"] as? [[String: Any]] ?? []).compactMap { d -> TerraLiveStep? in
            guard let id = d["id"] as? String, let text = d["text"] as? String else { return nil }
            return TerraLiveStep(id: id, text: text, routine: d["routine"] as? String ?? "")
        }
        let state = TerraLiveAttributes.ContentState(routine: o["routine"] as? String ?? "", next: next, nextId: nextId, done: done, total: total, queue: list)
        let current = Activity<TerraLiveAttributes>.activities
        let endOfDay = Calendar.current.startOfDay(for: Date()).addingTimeInterval(86_400)
        Task {
            if next.isEmpty || total == 0 {
                for a in current { await a.end(ActivityContent(state: state, staleDate: nil), dismissalPolicy: .after(Date().addingTimeInterval(120))) }
                return
            }
            if let a = current.first {
                await a.update(ActivityContent(state: state, staleDate: endOfDay))
                for extra in current.dropFirst() { await extra.end(nil, dismissalPolicy: .immediate) }
            } else if ActivityAuthorizationInfo().areActivitiesEnabled {
                _ = try? Activity.request(attributes: TerraLiveAttributes(title: "Terra"), content: ActivityContent(state: state, staleDate: endOfDay))
            }
        }
    }
}
