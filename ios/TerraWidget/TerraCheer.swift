import WidgetKit
import SwiftUI

// MARK: - Cheer: a Duolingo-style nudge from Terra's little character.
// The line changes with the time of day, today's progress and the streak: proud when you're done,
// curious when nothing has happened yet, and a little worried in the evening when the streak is at risk.

enum CheerMood { case proud, hype, nudge, worried, sleepy }

struct Cheer {
    let text: String
    let mood: CheerMood

    init(_ d: TerraWidgetData?, date: Date, stale: Bool) {
        let fi = Words(d).fi
        let h = Calendar.current.component(.hour, from: date)
        let tod = Tod(date)
        let v = h % 3 // a different line now and then, so it doesn't feel canned
        let name = (d?.name ?? "").trimmingCharacters(in: .whitespaces)
        let n = name.isEmpty ? "" : ", \(name)"
        func pick(_ fiList: [String], _ enList: [String]) -> String { let l = fi ? fiList : enList; return l[v % l.count] }

        guard let d, !stale, d.total > 0 else {
            mood = tod == .night ? .sleepy : .hype
            text = tod == .night
                ? pick(["Huomenna uusi alku 🌙", "Lepää hyvin\(n). Nähdään aamulla!"], ["Tomorrow is a fresh start 🌙", "Rest well\(n). See you in the morning!"])
                : pick(["Huomenta\(n)! Avaa Terra ja aloitetaan 🌱", "Uusi päivä, uusi putki 🔥", "Yksi pieni askel riittää alkuun!"],
                       ["Morning\(n)! Open Terra and let's begin 🌱", "New day, new streak 🔥", "One tiny step is enough to start!"])
            return
        }
        let left = max(0, d.total - d.done), s = d.streak
        let why = (d.why ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        // On a harder moment, every other hour, Terra quotes your own reason back to you.
        if !why.isEmpty && left > 0 && d.done == 0 && tod != .dawn && h % 2 == 0 {
            mood = tod == .day ? .nudge : .worried
            text = (fi ? "Muista miksi aloitit: “" : "Remember why you started: “") + why + "”"
            return
        }
        if left == 0 {
            mood = .proud
            text = s > 1
                ? pick(["🔥 \(s) päivää putkeen! Olet huippu", "Kaikki tehty! Putki jatkuu: \(s) pv 🔥", "Teit sen taas! \(s) päivää 🎉"],
                       ["🔥 \(s) days in a row! You're amazing", "All done! Streak: \(s) days 🔥", "You did it again! \(s) days 🎉"])
                : pick(["Kaikki tehty! Olen niin ylpeä 🎉", "Teit sen! Nyt saa levätä 🌿", "Täydellinen päivä ✨"],
                       ["All done! So proud of you 🎉", "You did it! Time to rest 🌿", "A perfect day ✨"])
            return
        }
        if d.done == 0 && (tod == .dusk || tod == .night) {
            mood = .worried
            text = s > 0
                ? pick(["Putkesi on vaarassa 😬 Yksi askel pelastaa sen!", "Vielä ehtii! \(s) pv putki odottaa 🔥", "Älä jätä minua tänne yksin… 🥺 Yksi askel?"],
                       ["Your streak is in danger 😬 One step saves it!", "There's still time! Your \(s)-day streak is waiting 🔥", "Don't leave me hanging… 🥺 Just one step?"])
                : pick(["Yksi askel ennen unta? 🌙", "Aloitetaan uusi putki tänään 🌱", "Pieni askel, iso fiilis. Kokeillaan?"],
                       ["One step before bed? 🌙", "Let's start a new streak tonight 🌱", "Tiny step, big feeling. Shall we?"])
            return
        }
        if d.done == 0 {
            mood = tod == .day ? .nudge : .hype
            text = tod == .day
                ? pick(["Hei\(n)… en ole nähnyt sinua tänään 👀", "Yksi pieni askel? Lupaan ettei satu.", "Rutiini odottaa sinua 🌱"],
                       ["Hey\(n)… haven't seen you today 👀", "One tiny step? I promise it won't hurt.", "Your routine is waiting 🌱"])
                : pick(["Huomenta\(n)! Ensimmäinen askel vie minuutin ☀️", "Aloitetaan! Putki jatkuu yhdellä askeleella 🔥", "Valmiina? Minä ainakin olen! 🌱"],
                       ["Morning\(n)! The first step takes a minute ☀️", "Let's go! One step keeps the streak 🔥", "Ready? I sure am! 🌱"])
            return
        }
        mood = .hype
        text = left == 1
            ? pick(["Enää yksi! Melkein valmista 👀", "Viimeinen askel, sinä pystyt 💪", "Yksi jäljellä, älä luovuta nyt!"],
                   ["Just one left! Almost there 👀", "Last step, you've got this 💪", "One to go, don't stop now!"])
            : pick(["Hyvä vauhti! Enää \(left) askelta 💪", "\(d.done)/\(d.total) tehty, jatketaan! 🔥", "Sinä rokkaat! \(left) jäljellä"],
                   ["Great pace! \(left) steps to go 💪", "\(d.done)/\(d.total) done, keep going! 🔥", "You're on a roll! \(left) left"])
    }

    var emoji: String {
        switch mood { case .proud: return "🎉"; case .hype: return "💪"; case .nudge: return "👀"; case .worried: return "🥺"; case .sleepy: return "🌙" }
    }
}

/// Flame and streak count, like the badge in the app.
struct StreakFlame: View {
    let streak: Int
    var size: CGFloat = 13
    var body: some View {
        HStack(spacing: 2) {
            Text("🔥").font(.system(size: size))
            Text("\(streak)").font(.system(size: size, weight: .heavy, design: .rounded)).monospacedDigit()
        }
        .padding(.horizontal, 7).padding(.vertical, 3)
        .background(Capsule().fill(Color(hex: 0xFF8A3D).opacity(streak > 0 ? 0.9 : 0.35)))
        .foregroundStyle(.white)
    }
}

/// The character's little speech bubble, with a tail pointing at it.
struct CheerBubble: View {
    let text: String
    var size: CGFloat = 13
    var lines: Int = 2
    var tailLeft = true
    var body: some View {
        Text(text)
            .font(.system(size: size, weight: .bold, design: .rounded))
            .lineLimit(lines).minimumScaleFactor(0.75)
            .foregroundStyle(Color(hex: 0x241A3A))
            .padding(.horizontal, 10).padding(.vertical, 7)
            .background(
                ZStack(alignment: tailLeft ? .bottomLeading : .bottomTrailing) {
                    RoundedRectangle(cornerRadius: 14, style: .continuous).fill(Color.white.opacity(0.94))
                    Triangle().fill(Color.white.opacity(0.94)).frame(width: 12, height: 9)
                        .rotationEffect(.degrees(tailLeft ? 90 : -90)).offset(x: tailLeft ? -7 : 7, y: -6)
                }
            )
            .shadow(color: .black.opacity(0.15), radius: 3, y: 1)
    }
}

struct Triangle: Shape {
    func path(in r: CGRect) -> Path {
        var p = Path(); p.move(to: CGPoint(x: r.midX, y: r.minY)); p.addLine(to: CGPoint(x: r.maxX, y: r.maxY)); p.addLine(to: CGPoint(x: r.minX, y: r.maxY)); p.closeSubpath(); return p
    }
}

/// The character, with a gentle bounce pose when it's happy.
struct CheerCharacter: View {
    let tod: Tod
    let mood: CheerMood
    var height: CGFloat
    var body: some View {
        if let img = (mood == .worried || mood == .sleepy) ? TerraArt.hug : TerraArt.lean {
            Image(uiImage: img).resizable().scaledToFit().frame(height: height)
                .rotationEffect(.degrees(mood == .proud ? -6 : mood == .nudge ? 4 : 0))
                .overlay(alignment: .topTrailing) {
                    Text(Cheer.moodBadge(mood)).font(.system(size: height * 0.22)).offset(x: height * 0.08, y: -height * 0.06)
                }
        }
    }
}

extension Cheer {
    static func moodBadge(_ m: CheerMood) -> String {
        switch m { case .proud: return "✨"; case .hype: return ""; case .nudge: return "❔"; case .worried: return "💦"; case .sleepy: return "💤" }
    }
}

// MARK: - The cheer widget itself: the character, its line and your streak.

struct CheerView: View {
    @Environment(\.widgetFamily) var family
    let entry: TerraEntry
    var body: some View {
        let d = entry.today
        let c = Cheer(entry.data, date: entry.date, stale: entry.isStale)
        let tod = entry.tod
        GeometryReader { g in
            if family == .systemSmall {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Spacer()
                        StreakFlame(streak: d?.streak ?? 0, size: 12)
                    }
                    CheerBubble(text: c.text, size: 12, lines: 3)
                    Spacer(minLength: 0)
                }
                .overlay(alignment: .bottomLeading) {
                    CheerCharacter(tod: tod, mood: c.mood, height: g.size.height * 0.42).offset(x: -4, y: 6)
                }
            } else {
                HStack(alignment: .bottom, spacing: 8) {
                    CheerCharacter(tod: tod, mood: c.mood, height: g.size.height * 0.92).offset(y: 8)
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text("Terra").font(.system(size: 12, weight: .bold, design: .rounded)).foregroundStyle(tod.ink).opacity(0.8)
                            Spacer()
                            StreakFlame(streak: d?.streak ?? 0)
                        }
                        CheerBubble(text: c.text, size: 15, lines: 3)
                        Spacer(minLength: 0)
                        if let d, d.total > 0 {
                            HStack(spacing: 8) {
                                ProgressCapsule(done: d.done, total: d.total, ink: tod.ink)
                                Text("\(d.done)/\(d.total)").font(.system(size: 12, weight: .bold, design: .rounded)).monospacedDigit().foregroundStyle(tod.ink)
                                if let id = d.nextId, !id.isEmpty, !d.next.isEmpty { DoneButton(id: id, label: Words(entry.data).done, size: 30) }
                            }
                        }
                    }
                }
            }
        }
        .containerBackground(for: .widget) { SceneBackground(tod: tod) }
        .widgetURL(URL(string: "terra://today"))
    }
}

struct TerraCheerWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "TerraCheer", provider: TerraProvider()) { entry in
            CheerView(entry: entry)
        }
        .configurationDisplayName("Terra-kannustin")
        .description("Terra cheers you on, keeps your streak alive and nudges you when it's at risk.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
