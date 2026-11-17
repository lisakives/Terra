import Foundation

/// Reads keys from Secrets.plist in the app bundle. Add ONE of them in Xcode:
/// - ANTHROPIC_API_KEY: Terra AI uses Claude.
/// - DEEPSEEK_API_KEY: Terra AI uses DeepSeek (used only when the Anthropic key is empty).
/// Only for running Terra on your own phone: a key inside an app can be dug out of it,
/// so an App Store version uses the Terra server instead (see terra-ai-server).
enum Secrets {
    private static let dict: [String: Any] = {
        guard let url = Bundle.main.url(forResource: "Secrets", withExtension: "plist"),
              let data = try? Data(contentsOf: url),
              let d = try? PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any] else { return [:] }
        return d
    }()
    private static func value(_ name: String) -> String {
        (dict[name] as? String ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
    }
    static let anthropicKey = value("ANTHROPIC_API_KEY")
    static let deepseekKey = value("DEEPSEEK_API_KEY")
}
