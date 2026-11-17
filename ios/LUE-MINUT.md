# Terra iPhonelle – Xcode-projekti (versio 1.1)

Tämä on valmis Xcode-projekti. Sovelluksen ulkoasu on sama kuin web-versiossa, koska sama koodi (`Terra/index.html`) pyörii iPhonen omassa selainmoottorissa. Swift-koodi lisää vain sen, mitä puhelinsovellus tarvitsee.

**Projekti toimii ilmaisella Apple ID:llä.** Se ei käytä yhtään maksullista palvelua: muistutukset ovat paikallisia ilmoituksia, joita puhelin ajastaa itse, eikä niihin tarvita push-palvelua tai erityisoikeuksia.

## Ajaminen omalla iPhonella (ilmainen Apple ID)

1. Pura zip Macille ja avaa `Terra.xcodeproj`. Tarvitset **Xcode 16:n tai uudemman** (ilmainen App Storesta).
2. **Xcode › Settings › Accounts**: lisää Apple ID:si plus-napista. Xcode luo siitä ilmaisen *Personal Team* -tiimin.
3. Valitse vasemmalta **Terra**-projekti, sitten **Signing & Capabilities**:
   - **Team:** valitse oma nimesi *(Personal Team)*.
   - **Bundle Identifier:** vaihda `com.yourname.terra` omaksesi, esim. `fi.roni.terra`. Sen pitää olla yksilöllinen.
4. Kytke iPhone kaapelilla, valitse se ylhäältä laitteeksi ja paina ▶ (Run).
5. Ensimmäisellä kerralla iPhonessa:
   - **Asetukset › Tietosuoja ja turvallisuus › Kehittäjätila** päälle (puhelin käynnistyy uudelleen).
   - **Asetukset › Yleiset › VPN ja laitehallinta**: hyväksy oma Apple ID:si kehittäjäksi.

Simulaattorissa (ei puhelinta) riittää kohta 1 ja ▶, ilman Apple ID:tä.

## Ilmaisen Apple ID:n rajat

- **7 päivää:** asennus vanhenee viikossa. Kytke puhelin ja paina ▶ uudelleen, niin se jatkuu. Tiedot säilyvät.
- **Vain omat laitteet:** sovellusta ei voi jakaa muille.
- **Ei TestFlightia eikä App Storea:** ne vaativat maksullisen Apple Developer Programin (99 USD/v). Hanki se vasta, kun haluat julkaista.
- Kaikki Terran ominaisuudet toimivat silti: ilmoitukset, tietojen vienti, kalenterilinkit ja Terra AI (kun palvelin on käytössä).

## Terra AI suoraan sovelluksessa (omaan puhelimeen)

Terra AI toimii joko Clauden tai DeepSeekin avaimella. Yksi avain riittää.

1. Avaa Xcodessa vasemmalta `Terra › Secrets.plist`.
2. Liitä avaimesi jompaankumpaan kohtaan (Value-sarake):
   - **ANTHROPIC_API_KEY**: Terra AI käyttää Claudea.
   - **DEEPSEEK_API_KEY**: Terra AI käyttää DeepSeekiä (`deepseek-flash`). Tätä käytetään vain, jos Anthropic-kenttä on tyhjä.
3. Paina ▶. Terra AI -välilehti herää.

Avain pysyy sovelluksen natiivikoodissa, eikä sitä näe sovelluksen näkymissä. **Älä jaa tätä tiedostoa tai sovellusta muille**, koska avaimen voi kaivaa sovelluspaketista esiin. Kun julkaiset sovelluksen, tyhjennä kentät ja käytä Terra AI -palvelinta (`terra-ai-server.zip`).

## Oma ilmoitusääni

Muistutukset soittavat Terran oman pehmeän kaksisävyisen äänen (`terra-chime.wav`). Voit vaihtaa sen korvaamalla tiedoston samannimisellä, alle 30 sekunnin `.wav`-, `.aiff`- tai `.caf`-tiedostolla. Jos puhelin on äänettömällä, ilmoitus tulee ilman ääntä, kuten muillakin sovelluksilla.

## Herätys (iOS 26 ja uudempi)

Terran herätys käyttää Applen AlarmKitiä, joten se soi kuten Kello-sovellus, myös äänettömällä ja Keskittymisen läpi.

- Ensimmäisellä kerralla iPhone kysyy luvan herätyksille. Vastaa **Salli**.
- Herätyksen napista **Avaa Terra** aukeaa sovellus, ja siellä odottaa twisti.
- Jos sammutat herätyksen etkä tee twistiä, se soi uudelleen 3 minuutin päästä, kunnes twisti on tehty.
- Herätys tarvitsee **Xcode 26:n** ja iPhonen, jossa on **iOS 26**. Vanhemmalla iOS:llä herätys tulee tavallisena ilmoituksena Terran omalla äänellä.
- Toimii ilmaisella Apple ID:llä.

## Widgetit (koti- ja lukitusnäyttö)

Projektissa on nyt toinen kohde, **TerraWidgetExtension**. Se tuo Terran widgetit:

- **Kotinäyttö ja Tänään-näkymä** (pyyhkäisy oikealle): pieni ja keskikokoinen widget. Taustalla on sama maisema kuin sovelluksessa, ja se vaihtuu vuorokaudenajan mukaan (aamu, päivä, ilta, yö).
- **Lukitusnäyttö**: suorakaide (seuraava askel), ympyrä (päivän edistyminen) ja rivi kellon yläpuolella.

**Ennen ▶-painallusta:** valitse vasemmalta Terra-projekti, sitten kohde **TerraWidgetExtension** › Signing & Capabilities:
- **Team:** sama kuin sovelluksessa.
- **Bundle Identifier:** sovelluksen tunnus + `.widget`, esim. `fi.roni.terra.widget`. Sen pitää alkaa täsmälleen samalla kuin sovelluksen tunnus.

Widget lisätään puhelimessa tavalliseen tapaan: pidä kotinäyttöä painettuna › Muokkaa › Lisää widget › Terra. Widgetit vaativat iOS 17:n.

**Ilmaisella Apple ID:llä** widget näyttää maiseman, tervehdyksen ja lauseen "Yksi pieni askel kerrallaan". Sovelluksen tiedot (seuraava askel, edistyminen, putki ja seuraava muistutus) kulkevat widgetille **App Groupin** kautta, ja Apple sallii sen vain maksullisella kehittäjätilillä. Koodi on jo valmiina:

1. Lisää molempiin kohteisiin (Terra ja TerraWidgetExtension) Signing & Capabilities › **+ Capability** › **App Groups**.
2. Lisää ryhmä nimeltä `group.` + sovelluksen tunnus, esim. `group.fi.roni.terra`, ja ruksaa se molemmissa.
3. Paina ▶. Widget näyttää nyt oikeat tiedot, ja ne päivittyvät aina kun teet jotain sovelluksessa.

## Mitä toimii

- Kaikki web-version ominaisuudet ja ulkoasu, myös latausnäkymä.
- Widgetit koti- ja lukitusnäytölle.
- **Muistutukset tulevat oikeina iPhone-ilmoituksina**, myös kun Terra on kiinni.
- **Tietojen vienti** avaa iPhonen jakonäkymän.
- Kalenterilinkit aukeavat Safarissa.
- Tiedot tallentuvat puhelimeen ja säilyvät sovelluksen sulkemisen yli.

## Ennen App Store -julkaisua (myöhemmin)

- Maksullinen Apple Developer Program.
- **Tilaukset:** Pro/Ultimate ja kokeilu ovat nyt vain sovelluksen sisäisiä merkintöjä. Apple vaatii oikeat sovelluksen sisäiset ostot (StoreKit), muuten sovellus hylätään.
- **Promokoodit** korvataan Applen Offer Codeilla.
- **Tietosuojaseloste** ja App Storen tietosuojamerkinnät (kierto- ja mielialatiedot).

## Sovelluksen päivittäminen

Kun web-versio muuttuu, korvaa `Terra/index.html` uudella koontiversiolla ja paina ▶.

Fontit ladataan netistä. Ilman verkkoyhteyttä sovellus käyttää iPhonen omia fontteja.
