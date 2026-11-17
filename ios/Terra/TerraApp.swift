import SwiftUI
import UserNotifications

/// Terra for iPhone. The whole app UI lives in index.html and runs in a web view,
/// so it looks exactly like the web version. Swift only adds what a phone app needs:
/// real notifications for reminders and the share sheet for data export.
@main
struct TerraApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate

    var body: some Scene {
        WindowGroup {
            // The web view stays inside the safe area, so the page's own safe-area padding (env(safe-area-inset-*)) is real.
            // Only the background runs edge to edge, so the status bar and home bar areas keep the Terra colour.
            TerraWebView()
                .ignoresSafeArea()
                .background(Color.terraBackground.ignoresSafeArea())
                .preferredColorScheme(.dark)
                // Quick buttons in the widget open terra://add-reminder and similar links.
                .onOpenURL { url in NotificationCenter.default.post(name: .terraOpenLink, object: url) }
                // Ask for notifications and alarms right at the start, so reminders and the wake-up alarm work from day one.
                .task { await TerraPermissions.askAtStart() }
        }
    }
}

/// iOS shows each permission dialog only once; asking again does nothing, so this is safe on every launch.
enum TerraPermissions {
    static func askAtStart() async {
        let center = UNUserNotificationCenter.current()
        if await center.notificationSettings().authorizationStatus == .notDetermined {
            _ = try? await center.requestAuthorization(options: [.alert, .sound, .badge])
        }
        #if canImport(AlarmKit)
        if #available(iOS 26.0, *) { _ = await TerraAlarm.authorize() }
        #endif
    }
}

extension Color {
    /// Matches --bg in the app's stylesheet (#07060b), so there is no flash while loading.
    static let terraBackground = Color(red: 7 / 255, green: 6 / 255, blue: 11 / 255)
}

final class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        return true
    }

    /// While Terra is open it shows its own gentle in-app banner,
    /// so the system notification only goes quietly to Notification Center.
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        completionHandler([.list])
    }
}
