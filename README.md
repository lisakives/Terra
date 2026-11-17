# Terra

Rauhallinen rutiinisovellus ADHD-arkeen: pienet askeleet, muistutukset, herätys tehtävällä, treenit ja GymTrack.

| Kansio | Mitä |
|---|---|
| `web/` | Sovelluksen lähdekoodi. `python3 build.py` kokoaa sivun. |
| `server/` | Cloudflare Worker: jakaa web-sovelluksen, pitää Terra AI:n avaimen salassa ja lähettää push-muistutukset. |
| `ios/` | iPhone-sovellus (Xcode): sama sivu WKWebView'ssa, widgetit, Live Activity ja AlarmKit-herätys. |

## Kokoaminen

```
cd web
python3 build.py
```

Tämä kirjoittaa `server/public/index.html` (verkkoversio) ja `ios/Terra/index.html` (iPhone).

## Verkkoversio ja muistutukset (GitHub Pages + GymTrackin push-palvelin)

Terra-verkkosovellus on kansiossa `docs/`, ja sen voi julkaista GitHub Pagesissa puhelimellakin:
**Settings → Pages → Branch: `main`, kansio `/docs` → Save.** Osoite on `https://lisakives.github.io/Terra/`.

Muistutukset kulkevat **GymTrackin Cloudflare-push-palvelimen** kautta samalla protokollalla kuin GymTrackissa
(`/api/vapid`, `/api/subscribe`, `/api/sync`). Terralla on palvelimella oma tunniste. Palvelimen osoite asetetaan
`web/build.py`:n `PUSH_SERVER`-riville.

Avaa sivu iPhonen Safarissa → **Jaa → Lisää Koti-valikkoon** → avaa Terra Koti-valikosta → **Asetukset → Ilmoitukset** päälle.

## Vaihtoehto: oma Cloudflare Worker (noin 10 minuuttia)

Tarvitset ilmaisen Cloudflare-tilin ja Node.js:n. Aja `server`-kansiossa:

```
npx wrangler login
npx wrangler kv namespace create TERRA
```

Kopioi tulostettu `id` tiedostoon `server/wrangler.toml` kohtaan `PASTE_KV_ID_HERE`. Sitten:

```
npx wrangler deploy
npx wrangler secret put ANTHROPIC_API_KEY
```

- `deploy` tulostaa osoitteen, esim. `https://terra.<nimi>.workers.dev`. Siitä aukeaa Terra.
- `secret put` kysyy Terra AI:n avaimen. Liitä se terminaaliin, ei chattiin eikä tiedostoon.

### Muistutukset puhelimeen

1. Avaa osoite Safarissa, napauta **Jaa → Lisää Koti-valikkoon**.
2. Avaa Terra Koti-valikosta ja laita **Asetukset → Ilmoitukset** päälle.
3. Palvelin lähettää muistutukset oikeaan aikaan sinun aikavyöhykkeelläsi, myös kun Terra on kiinni.
   Illalla klo 20.30 tulee kannustus vain, jos päivän askeleita ei ole vielä tehty.

Palvelin tallentaa vain muistutuslistan, aikavyöhykkeen ja päivän askelmäärän, putken ja "miksi aloitin" -lauseen. Rutiinit, mieliala, treenit ja muut tiedot pysyvät puhelimessa.

## iPhone (Xcode)

Avaa `ios/Terra.xcodeproj`. Jos haluat Terra AI:n suoraan sovellukseen omalla puhelimellasi, kopioi `ios/Terra/Secrets.example.plist` nimelle `Secrets.plist` ja lisää avain. `Secrets.plist` ei koskaan päädy GitHubiin.
