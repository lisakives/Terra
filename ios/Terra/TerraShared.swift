import Foundation

/// Data shared with the Terra widget through the App Group "group.<bundle id>".
/// Needs the App Groups capability on both targets (paid Apple Developer account).
/// Without it, writes stay in the app and the widget shows its calm greeting instead.
extension Notification.Name {
    static let terraOpenLink = Notification.Name("terraOpenLink")
}

enum TerraShared {
    static let widgetKey = "terra.widget"
    /// Steps ticked off in the widget ("yyyy-MM-dd|stepId"), handed to the page when Terra opens.
    static let widgetDoneKey = "terra.widget.done"
    static var group: String { "group." + (Bundle.main.bundleIdentifier ?? "terra") }
    static var defaults: UserDefaults { UserDefaults(suiteName: group) ?? .standard }
}
