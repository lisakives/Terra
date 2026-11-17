import Foundation
import SwiftUI

#if canImport(AlarmKit)
import AlarmKit
import ActivityKit // AlertConfiguration (the alarm sound) lives here
import AppIntents

/// Terra's wake-up alarm (iOS 26+, AlarmKit): rings like the Clock app, through silent mode and Focus.
/// There is exactly one alarm. Stopping it opens Terra, where the "twist" waits.
/// Until the task is done in Terra, the alarm comes back every minute.
@available(iOS 26.0, *)
struct TerraAlarmData: AlarmMetadata {}

@available(iOS 26.0, *)
enum TerraAlarm {
    static let mainID = UUID(uuidString: "6E7A1B2C-0D3E-4F50-8A61-72B83C94D0A5")!
    static let followID = UUID(uuidString: "6E7A1B2C-0D3E-4F50-8A61-72B83C94D0A6")!
    static let doneKey = "terra.alarm.doneDay"
    static let titleKey = "terra.alarm.title"

    static var manager: AlarmManager { AlarmManager.shared }

    static func authorize() async -> Bool {
        switch manager.authorizationState {
        case .authorized: return true
        case .notDetermined: return (try? await manager.requestAuthorization()) == .authorized
        default: return false
        }
    }

    /// Terra's own wake-up tone (terra-alarm.wav, ~26 s, bundled). Without this AlarmKit plays Apple's default alarm tone.
    static var sound: AlertConfiguration.AlertSound { .named("terra-alarm.wav") }

    static func attributes(_ title: String) -> AlarmAttributes<TerraAlarmData> {
        let alert = AlarmPresentation.Alert(
            title: LocalizedStringResource(stringLiteral: title),
            stopButton: AlarmButton(text: "Open Terra", textColor: .white, systemImageName: "sun.max.fill")
        )
        return AlarmAttributes(presentation: AlarmPresentation(alert: alert),
                               metadata: TerraAlarmData(),
                               tintColor: Color(red: 1.0, green: 0.62, blue: 0.36))
    }

    /// Schedules the one daily alarm. Returns false when AlarmKit can't be used, so the app falls back to a notification.
    static func set(hour: Int, minute: Int, title: String) async -> Bool {
        guard await authorize() else { return false }
        UserDefaults.standard.set(title, forKey: titleKey)
        cancelAll()
        let everyDay: [Locale.Weekday] = [.sunday, .monday, .tuesday, .wednesday, .thursday, .friday, .saturday]
        let schedule = Alarm.Schedule.relative(.init(time: .init(hour: hour, minute: minute), repeats: .weekly(everyDay)))
        let config = AlarmManager.AlarmConfiguration<TerraAlarmData>.alarm(schedule: schedule,
                                                           attributes: attributes(title),
                                                           stopIntent: TerraAlarmStopIntent(),
                                                           secondaryIntent: nil,
                                                           sound: sound)
        do { _ = try await manager.schedule(id: mainID, configuration: config); return true } catch { return false }
    }

    /// Rings again in a minute (used when the alarm was stopped but the twist isn't done yet).
    static func ringAgainSoon() async {
        let title = UserDefaults.standard.string(forKey: titleKey) ?? "Good morning"
        try? manager.cancel(id: followID)
        let config = AlarmManager.AlarmConfiguration<TerraAlarmData>.alarm(schedule: .fixed(Date().addingTimeInterval(60)),
                                                           attributes: attributes(title),
                                                           stopIntent: TerraAlarmStopIntent(),
                                                           secondaryIntent: nil,
                                                           sound: sound)
        _ = try? await manager.schedule(id: followID, configuration: config)
    }

    /// The tasks are done: the alarm stays quiet while Terra waits for the "Am I really awake?" check.
    /// If the person doesn't confirm in Terra by then, it rings again at the end of the window.
    static func holdUntilCheck(seconds: Int) async {
        let title = UserDefaults.standard.string(forKey: titleKey) ?? "Good morning"
        try? manager.cancel(id: followID)
        let config = AlarmManager.AlarmConfiguration<TerraAlarmData>.alarm(schedule: .fixed(Date().addingTimeInterval(TimeInterval(max(30, seconds)))),
                                                           attributes: attributes(title),
                                                           stopIntent: TerraAlarmStopIntent(),
                                                           secondaryIntent: nil,
                                                           sound: sound)
        _ = try? await manager.schedule(id: followID, configuration: config)
    }

    /// The twist was done in Terra: no more ringing today.
    static func twistDone() {
        UserDefaults.standard.set(todayKey(), forKey: doneKey)
        try? manager.cancel(id: followID)
    }

    static func cancelAll() {
        try? manager.cancel(id: mainID)
        try? manager.cancel(id: followID)
    }

    static func todayKey() -> String {
        let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd"; return f.string(from: Date())
    }
}

/// Runs when the alarm's button is pressed: opens Terra, and keeps the alarm coming back until the twist is done.
@available(iOS 26.0, *)
struct TerraAlarmStopIntent: LiveActivityIntent {
    static var title: LocalizedStringResource = "Open Terra"
    static var openAppWhenRun: Bool = true

    init() {}

    func perform() async throws -> some IntentResult {
        if UserDefaults.standard.string(forKey: TerraAlarm.doneKey) != TerraAlarm.todayKey() {
            await TerraAlarm.ringAgainSoon()
        }
        return .result()
    }
}
#endif
