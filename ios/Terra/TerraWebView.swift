import SwiftUI
import WebKit
import UserNotifications
import WidgetKit

/// Shows index.html from the app bundle and listens for messages from the page
/// (window.webkit.messageHandlers.terra.postMessage({...})).
/// A web view that reports its safe-area insets. WKWebView does not give the page env(safe-area-inset-*)
/// when it runs edge to edge, so the insets are passed to the page as CSS variables instead.
final class InsetWebView: WKWebView {
    var onInsets: ((UIEdgeInsets) -> Void)?
    override func safeAreaInsetsDidChange() {
        super.safeAreaInsetsDidChange()
        onInsets?(safeAreaInsets)
    }
}

struct TerraWebView: UIViewRepresentable {
    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.websiteDataStore = .default() // keeps the person's data (localStorage) between launches
        config.userContentController.add(context.coordinator, name: "terra")
        config.allowsInlineMediaPlayback = true

        let web = InsetWebView(frame: .zero, configuration: config)
        let bg = UIColor(red: 7 / 255, green: 6 / 255, blue: 11 / 255, alpha: 1)
        web.isOpaque = false
        web.backgroundColor = bg
        web.scrollView.backgroundColor = bg
        web.scrollView.contentInsetAdjustmentBehavior = .never // the page handles the notch and home bar itself
        web.allowsBackForwardNavigationGestures = false
        // No zooming: pinch and double-tap zoom made the top of the page slip under the status bar.
        web.scrollView.minimumZoomScale = 1
        web.scrollView.maximumZoomScale = 1
        web.scrollView.bouncesZoom = false
        web.scrollView.delegate = context.coordinator
        // After the keyboard closes, iOS can leave the page shifted up. Put it back.
        NotificationCenter.default.addObserver(forName: UIResponder.keyboardWillHideNotification, object: nil, queue: .main) { [weak web] _ in
            guard let sv = web?.scrollView else { return }
            sv.setZoomScale(1, animated: false)
            let maxY = max(0, sv.contentSize.height - sv.bounds.height)
            if sv.contentOffset.y > maxY { sv.setContentOffset(CGPoint(x: 0, y: maxY), animated: true) }
        }
        // A step ticked off in the Live Activity while Terra is open goes straight to the page.
        NotificationCenter.default.addObserver(forName: Notification.Name("terraLiveDone"), object: nil, queue: .main) { [weak coord = context.coordinator] _ in
            coord?.flushWidgetDone()
        }
        // Widget quick buttons: open the right place in the page.
        NotificationCenter.default.addObserver(forName: .terraOpenLink, object: nil, queue: .main) { [weak coord = context.coordinator] n in
            if let url = n.object as? URL { coord?.openLink(url) }
        }
        // Steps ticked off in the widget while Terra was closed.
        NotificationCenter.default.addObserver(forName: UIApplication.didBecomeActiveNotification, object: nil, queue: .main) { [weak coord = context.coordinator] _ in
            coord?.flushWidgetDone()
        }
        web.navigationDelegate = context.coordinator
        web.uiDelegate = context.coordinator
        context.coordinator.webView = web
        // The web view runs edge to edge, so tell the page the real notch and home-bar sizes.
        web.onInsets = { [weak coord = context.coordinator] insets in coord?.pushInsets(insets) }

        if let page = Bundle.main.url(forResource: "index", withExtension: "html") {
            web.loadFileURL(page, allowingReadAccessTo: page.deletingLastPathComponent())
        }
        return web
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate, UIScrollViewDelegate {
        weak var webView: WKWebView?
        private let reminderPrefix = "terra.rem."

        // MARK: Safe area for the page

        func pushInsets(_ v: UIEdgeInsets) {
            // The web view runs edge to edge, so its own insets can come back as zero; the window always knows the notch and home bar.
            let w = webView?.window?.safeAreaInsets ?? .zero
            let i = UIEdgeInsets(top: max(v.top, w.top), left: max(v.left, w.left), bottom: max(v.bottom, w.bottom), right: max(v.right, w.right))
            let js = "var s=document.documentElement.style;s.setProperty('--sai-top','\(i.top)px');s.setProperty('--sai-bottom','\(i.bottom)px');s.setProperty('--sai-left','\(i.left)px');s.setProperty('--sai-right','\(i.right)px');"
            webView?.evaluateJavaScript(js, completionHandler: nil)
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            pushInsets(webView.safeAreaInsets)
            flushWidgetDone()
            pageLoaded = true
            if let k = pendingLink { pendingLink = nil; runLink(k) }
        }

        // MARK: Links from the widget (terra://add-reminder, terra://new-routine, terra://log-workout, terra://breathe)

        private var pageLoaded = false
        private var pendingLink: String?

        func openLink(_ url: URL) {
            guard url.scheme == "terra" else { return }
            let k = String((url.host ?? "").filter { $0.isLetter || $0 == "-" })
            if pageLoaded { runLink(k) } else { pendingLink = k }
        }

        private func runLink(_ k: String) {
            webView?.evaluateJavaScript("window.terraOpen && window.terraOpen('\(k)'); true", completionHandler: nil)
        }

        // MARK: Steps ticked off in the widget

        func flushWidgetDone() {
            let d = TerraShared.defaults
            let all = d.stringArray(forKey: TerraShared.widgetDoneKey) ?? []
            guard !all.isEmpty, let web = webView else { return }
            let f = DateFormatter()
            f.calendar = Calendar(identifier: .gregorian); f.locale = Locale(identifier: "en_US_POSIX"); f.dateFormat = "yyyy-MM-dd"
            let today = f.string(from: Date())
            let ids = all.compactMap { e -> String? in
                let p = e.split(separator: "|", maxSplits: 1)
                return p.count == 2 && String(p[0]) == today ? String(p[1]) : nil
            }
            if ids.isEmpty { d.removeObject(forKey: TerraShared.widgetDoneKey); return }
            guard let data = try? JSONSerialization.data(withJSONObject: ids), let json = String(data: data, encoding: .utf8) else { return }
            // Only clear the queue once the page has really taken the steps.
            let js = "typeof window.terraWidgetDone === 'function' ? (window.terraWidgetDone(\(json)), 1) : 0"
            web.evaluateJavaScript(js) { result, _ in
                if (result as? Int) == 1 || (result as? NSNumber)?.intValue == 1 { d.removeObject(forKey: TerraShared.widgetDoneKey) }
            }
        }

        // MARK: Zoom off

        func viewForZooming(in scrollView: UIScrollView) -> UIView? { nil }
        func scrollViewDidZoom(_ scrollView: UIScrollView) { if scrollView.zoomScale != 1 { scrollView.setZoomScale(1, animated: false) } }

        // MARK: Messages from the page

        func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
            guard let body = message.body as? [String: Any], let type = body["type"] as? String else { return }
            let callId = body["id"] as? String

            switch type {
            case "notifyPermission":
                UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
                    DispatchQueue.main.async { self.reply(callId, granted) }
                }
            case "reminders":
                let list = body["reminders"] as? [[String: Any]] ?? []
                let title = body["title"] as? String ?? "Terra"
                scheduleReminders(list, title: title)
            case "share":
                let name = body["filename"] as? String ?? "terra-data.json"
                let text = body["data"] as? String ?? ""
                share(filename: name, text: text)
            case "openClock":
                // Alarms live in the iPhone Clock app; this opens its Alarms tab.
                if let url = URL(string: "clock-alarm://") { UIApplication.shared.open(url) }
            case "alarm":
                // One daily wake-up alarm through AlarmKit (iOS 26+). Replies false so the page uses a notification instead.
                let on = body["on"] as? Bool ?? false
                let parts = (body["time"] as? String ?? "").split(separator: ":").compactMap { Int($0) }
                let title = body["title"] as? String ?? "Good morning"
                #if canImport(AlarmKit)
                if #available(iOS 26.0, *) {
                    Task {
                        var ok = false
                        if on, parts.count == 2 { ok = await TerraAlarm.set(hour: parts[0], minute: parts[1], title: title) }
                        else { TerraAlarm.cancelAll() }
                        await MainActor.run { self.reply(callId, on ? ok : false) }
                    }
                    return
                }
                #endif
                reply(callId, false)
            case "widget":
                // Today's next step and progress for the home screen and lock screen widgets.
                if let json = body["data"] as? String {
                    TerraShared.defaults.set(json, forKey: TerraShared.widgetKey)
                    WidgetCenter.shared.reloadAllTimelines()
                    TerraLiveManager.sync(json: json) // Lock Screen and Dynamic Island
                }
            case "alarmHold":
                // Tasks done: ring again at the end of the awake-check window unless Terra gets the confirmation first.
                #if canImport(AlarmKit)
                if #available(iOS 26.0, *) { let secs = body["seconds"] as? Int ?? 240; Task { await TerraAlarm.holdUntilCheck(seconds: secs) } }
                #endif
            case "alarmDone":
                #if canImport(AlarmKit)
                if #available(iOS 26.0, *) { TerraAlarm.twistDone() }
                #endif
            case "aiAvailable":
                reply(callId, !Secrets.anthropicKey.isEmpty || !Secrets.deepseekKey.isEmpty)
            case "ai":
                askClaude(callId, request: body["request"] as? String ?? "{}")
            default:
                break
            }
        }

        // MARK: Terra AI straight from the app (key in Secrets.plist, for your own phone only)

        private func askClaude(_ callId: String?, request: String) {
            // Claude when an Anthropic key is set, otherwise DeepSeek through its Anthropic-compatible API (same request format).
            let deepseek = Secrets.anthropicKey.isEmpty && !Secrets.deepseekKey.isEmpty
            let key = deepseek ? Secrets.deepseekKey : Secrets.anthropicKey
            guard !key.isEmpty,
                  let data = request.data(using: .utf8),
                  let req = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any],
                  let messages = req["messages"] as? [Any], !messages.isEmpty else {
                replyJSON(callId, status: 400, raw: nil); return
            }
            // Same limits as the Terra server: the model and the answer length are decided here.
            var payload: [String: Any] = [
                "model": deepseek ? "deepseek-flash" : ((req["tier"] as? String) == "quick" ? "claude-haiku-5-5" : "claude-sonnet-5-5"),
                "max_tokens": 1024,
                "messages": messages.suffix(40).map { $0 },
            ]
            if let system = req["system"] as? String { payload["system"] = String(system.prefix(20_000)) }
            if let tools = req["tools"] as? [Any], !tools.isEmpty { payload["tools"] = Array(tools.prefix(5)) }

            let endpoint = deepseek ? "https://api.deepseek.com/anthropic/v1/messages" : "https://api.anthropic.com/v1/messages"
            var http = URLRequest(url: URL(string: endpoint)!)
            http.httpMethod = "POST"
            http.timeoutInterval = 80
            http.setValue("application/json", forHTTPHeaderField: "content-type")
            http.setValue(key, forHTTPHeaderField: "x-api-key")
            http.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")
            http.httpBody = try? JSONSerialization.data(withJSONObject: payload)

            URLSession.shared.dataTask(with: http) { data, response, _ in
                let status = (response as? HTTPURLResponse)?.statusCode ?? 0
                let raw = data.flatMap { String(data: $0, encoding: .utf8) }
                DispatchQueue.main.async { self.replyJSON(callId, status: status, raw: raw) }
            }.resume()
        }

        /// Sends {status, data} back to the page. `raw` is the API's JSON answer, passed through as-is.
        private func replyJSON(_ callId: String?, status: Int, raw: String?) {
            guard let callId, let web = webView else { return }
            let safeId = callId.filter { $0.isLetter || $0.isNumber }
            var dataJSON = "null"
            if let raw, let bytes = raw.data(using: .utf8), (try? JSONSerialization.jsonObject(with: bytes)) != nil { dataJSON = raw }
            web.evaluateJavaScript("window.terraNativeReply && window.terraNativeReply('\(safeId)', {\"status\":\(status),\"data\":\(dataJSON)})")
        }

        private func reply(_ callId: String?, _ value: Bool) {
            guard let callId, let web = webView else { return }
            let safeId = callId.filter { $0.isLetter || $0.isNumber }
            web.evaluateJavaScript("window.terraNativeReply && window.terraNativeReply('\(safeId)', \(value))")
        }

        // MARK: Reminders as real notifications (they arrive even when Terra is closed)

        private func scheduleReminders(_ list: [[String: Any]], title: String) {
            let center = UNUserNotificationCenter.current()
            center.getPendingNotificationRequests { pending in
                let old = pending.map(\.identifier).filter { $0.hasPrefix(self.reminderPrefix) }
                center.removePendingNotificationRequests(withIdentifiers: old)

                for item in list {
                    guard let id = item["id"] as? String,
                          let text = item["text"] as? String,
                          let time = item["time"] as? String else { continue }
                    let parts = time.split(separator: ":").compactMap { Int($0) }
                    guard parts.count == 2, (0...23).contains(parts[0]), (0...59).contains(parts[1]) else { continue }

                    var when = DateComponents()
                    when.hour = parts[0]
                    when.minute = parts[1]

                    let content = UNMutableNotificationContent()
                    // Each reminder brings its own heading (the reminder text); "Terra" is only the fallback.
                    content.title = (item["title"] as? String).flatMap { $0.isEmpty ? nil : $0 } ?? title
                    content.body = text
                    // The standard iOS notification sound. Users can still change it per app in Settings › Notifications › Terra.
                    content.sound = .default

                    // A day moved by the wake-up question: one-off notifications for the coming week
                    // (today at the moved time, then the usual time); Terra refreshes them whenever it opens.
                    if let once = item["once"] as? [[String: Any]], !once.isEmpty {
                        for (i, o) in once.enumerated() {
                            guard let d = o["d"] as? String, let t = o["t"] as? String else { continue }
                            let dp = d.split(separator: "-").compactMap { Int($0) }, tp = t.split(separator: ":").compactMap { Int($0) }
                            guard dp.count == 3, tp.count == 2 else { continue }
                            var c = DateComponents(); c.year = dp[0]; c.month = dp[1]; c.day = dp[2]; c.hour = tp[0]; c.minute = tp[1]
                            if let at = Calendar.current.date(from: c), at < Date() { continue }
                            let trig = UNCalendarNotificationTrigger(dateMatching: c, repeats: false)
                            center.add(UNNotificationRequest(identifier: self.reminderPrefix + id + "-\(i)", content: content, trigger: trig))
                        }
                        continue
                    }
                    let trigger = UNCalendarNotificationTrigger(dateMatching: when, repeats: true)
                    center.add(UNNotificationRequest(identifier: self.reminderPrefix + id, content: content, trigger: trigger))
                }
            }
        }

        // MARK: Data export through the iPhone share sheet

        private func share(filename: String, text: String) {
            let safeName = filename.replacingOccurrences(of: "/", with: "-")
            let url = FileManager.default.temporaryDirectory.appendingPathComponent(safeName)
            do { try text.write(to: url, atomically: true, encoding: .utf8) } catch { return }

            guard let web = webView, var top = web.window?.rootViewController else { return }
            while let presented = top.presentedViewController { top = presented }
            let sheet = UIActivityViewController(activityItems: [url], applicationActivities: nil)
            sheet.popoverPresentationController?.sourceView = web
            top.present(sheet, animated: true)
        }

        // MARK: Links (for example Google Calendar) open in Safari, not inside Terra

        func webView(
            _ webView: WKWebView,
            decidePolicyFor navigationAction: WKNavigationAction,
            decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
        ) {
            if let url = navigationAction.request.url,
               ["http", "https", "mailto", "tel"].contains(url.scheme?.lowercased() ?? ""),
               navigationAction.navigationType == .linkActivated {
                UIApplication.shared.open(url)
                decisionHandler(.cancel)
                return
            }
            decisionHandler(.allow)
        }

        func webView(
            _ webView: WKWebView,
            createWebViewWith configuration: WKWebViewConfiguration,
            for navigationAction: WKNavigationAction,
            windowFeatures: WKWindowFeatures
        ) -> WKWebView? {
            if let url = navigationAction.request.url { UIApplication.shared.open(url) }
            return nil
        }
    }
}
