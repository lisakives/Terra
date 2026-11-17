/* ============ Terra: language (English / Suomi) ============ */
/* The UI is written in English. In Finnish mode, every rendered text node and label is
   translated through FI (exact phrases) and FI_RX (phrases with numbers or names).
   User-written text (chat messages, inputs) is never touched. */
const LANGS = { en: 'English', fi: 'Suomi' };
let LANG = (() => { try { const s = JSON.parse(localStorage.getItem('terra.v1') || '{}'); if (s.settings?.lang) return s.settings.lang; const l = localStorage.getItem('terra.lang'); if (l) return l; } catch (e) {} return (navigator.language || '').toLowerCase().startsWith('fi') ? 'fi' : 'en'; })();
const LOC = () => LANG === 'fi' ? 'fi-FI' : 'en-GB';
const WD = () => LANG === 'fi' ? ['M', 'T', 'K', 'T', 'P', 'L', 'S'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const LANG_NAME = () => LANG === 'fi' ? 'Finnish' : 'English';

const FI = {
  'A bonsai tree whose leaves breathe slowly': 'Bonsai-puu, jonka lehdet hengittävät hitaasti',
  'Water and fuel': 'Vesi ja energia',
  'Eat something small': 'Syö jotain pientä',
  'You': 'Sinä', 'Build with Terra AI': 'Rakenna Terra AI:n kanssa', 'Open Terra AI': 'Avaa Terra AI', 'Log and weekly goal': 'Kirjaus ja viikkotavoite', 'Mood and stress': 'Mieliala ja stressi', 'Check-ins and stress load': 'Kirjaukset ja kuormitus', 'Phases and symptoms': 'Vaiheet ja oireet', 'Screen time': 'Ruutuaika', 'Time spent in Terra': 'Terrassa vietetty aika', 'Plan, alarm, privacy, language': 'Tilaus, herätys, yksityisyys, kieli', 'Your routines and reminders, all in one place.': 'Rutiinit ja muistutukset samassa paikassa.', 'A breathing break and your stress meter, whenever things feel like too much.': 'Hengitystauko ja stressimittari aina, kun kaikkea tuntuu olevan liikaa.', 'Every step earns *XP*. See your rank and progress here. Settings live here too.': 'Jokainen askel tuo *XP*:tä. Täältä näet rankisi ja edistymisesi. Myös asetukset löytyvät täältä.',
  'Good morning. Time for your twist.': 'Hyvää huomenta. Twistin aika.',
  'Press and hold': 'Pidä pohjassa',
  'Alarm': 'Herätys', 'Wake-up alarm': 'Herätys', 'One alarm. A small twist switches it off.': 'Yksi herätys. Pieni twisti sammuttaa sen.', 'when your first routine starts': 'kun ensimmäinen rutiini alkaa', 'your own time': 'oma aika', 'First routine': 'Ensimmäinen rutiini', 'Own time': 'Oma aika', 'Alarm time': 'Herätysaika', 'Twist to switch it off': 'Twisti, jolla herätys sammuu', 'Tap 1–4 in order': 'Napauta 1–4 järjestyksessä', 'Wakes your eyes and hands': 'Herättää silmät ja kädet', 'Hold for three breaths': 'Pidä pohjassa kolme hengitystä', 'Calm, slow start': 'Rauhallinen, hidas alku', 'Solve a small sum': 'Ratkaise pieni lasku', 'Wakes up your head': 'Herättää pään', 'Try it now': 'Kokeile nyt', 'Good morning': 'Hyvää huomenta', 'Almost. Try again.': 'Melkein. Yritä uudelleen.', 'Good morning! First step:': 'Hyvää huomenta! Ensimmäinen askel:', 'Good morning!': 'Hyvää huomenta!', 'Alarm set for': 'Herätys asetettu klo', 'Good morning. Open Terra to switch off your alarm.': 'Hyvää huomenta. Avaa Terra ja sammuta herätys.', 'Set an alarm for tomorrow?': 'Laitetaanko herätys huomiseksi?',
  'A gentle check': 'Lempeä tarkistus', 'Make it smaller': 'Tee siitä pienempi', 'It\'s fine': 'Ihan ok', 'Smaller now. Two tiny steps is plenty.': 'Nyt pienempi. Kaksi pientä askelta riittää hyvin.', 'My routine': 'Rutiinini', 'feels hard to keep up with lately. Can you help me make it easier?': 'on tuntunut viime aikoina vaikealta pitää yllä. Voitko auttaa tekemään siitä helpomman?', 'Routines on track': 'Rutiinit sujuvat', 'Routines hard to keep up with': 'Rutiineja vaikea pitää yllä',
  'Reminder moved to': 'Muistutus siirretty klo',
  'Stress meter': 'Stressimittari', 'See how much is weighing on you': 'Näe, kuinka paljon sinulla on kuormaa', 'One tap a day about how you feel. Saved only on this device.': 'Yksi napautus päivässä siitä, miltä tuntuu. Tallentuu vain tälle laitteelle.', 'How are you today?': 'Miten voit tänään?', 'Tap how you feel to start the meter.': 'Napauta, miltä tuntuu, niin mittari käynnistyy.', 'Open stress details': 'Avaa kuormituksen tiedot',
  'Better fitness': 'Parempi kunto', 'Building muscle': 'Lihasmassan kasvatus', 'Fitness boost': 'Kuntohetki', 'Strength start': 'Voimaa pienestä', 'When I get home': 'Kun tulen kotiin', 'Put on your training clothes': 'Pue treenivaatteet', 'Walk briskly for five minutes': 'Kävele reippaasti viisi minuuttia', 'Do ten squats': 'Tee kymmenen kyykkyä', 'Log it in Track': 'Kirjaa se Seurantaan', 'Do ten push-ups, knees down is fine': 'Tee kymmenen punnerrusta, polvet maassa käy hyvin', 'Do fifteen squats': 'Tee viisitoista kyykkyä', 'Hold a plank for 20 seconds': 'Pidä lankkua 20 sekuntia', 'Eat something with protein': 'Syö jotain proteiinipitoista',
  'Change': 'Muuta',
  'Start my rhythm': 'Aloita rytmini',
  'Your answers': 'Vastauksesi', 'Change what Terra knows about your day': 'Muuta sitä, mitä Terra tietää päivästäsi', 'Retake': 'Vastaa uudelleen',
  'What does your day look like?': 'Millainen päiväsi on?', 'Pick the closest times. Terra plans your steps and reminders around them.': 'Valitse lähimmät ajat. Terra ajoittaa askeleet ja muistutukset niiden mukaan.', 'I usually get up': 'Herään yleensä', 'I usually go to bed': 'Menen yleensä nukkumaan', 'Your answers stay private. Delete them anytime.': 'Vastauksesi pysyvät yksityisinä. Voit poistaa ne milloin tahansa.', 'Support for daily life, not medical care.': 'Tukea arkeen, ei lääketieteellistä hoitoa.', 'Skip questions': 'Ohita kysymykset',
  'Terra AI isn\'t connected yet': 'Terra AI ei ole vielä yhdistetty', 'It wakes up as soon as Terra\'s server is online. Your routines, reminders and Moments work without it.': 'Se herää heti, kun Terran palvelin on käynnissä. Rutiinit, muistutukset ja hetket toimivat ilman sitäkin.',
  'Stress load': 'Kuormitus', 'Light': 'Kevyt', 'Moderate': 'Kohtalainen', 'High': 'Korkea', 'Not enough check-ins yet': 'Merkintöjä on vielä liian vähän', 'Based on the last 3 days': 'Kolmen viime päivän perusteella', 'Steady. Keep doing what works.': 'Tasaista. Jatka sitä, mikä toimii.', 'Some things are adding up. One small thing at a time.': 'Asioita kertyy. Yksi pieni asia kerrallaan.', 'A lot on you right now. A one-minute Moment can help you reset.': 'Sinulla on nyt paljon kannettavaa. Minuutin hetki voi auttaa palautumaan.', 'Feeling scattered, low or tired': 'Hajanainen, alakuloinen tai väsynyt olo', 'Feeling calm or good': 'Rauhallinen tai hyvä olo', 'More screen time than usual': 'Tavallista enemmän ruutuaikaa', 'Breathing breaks': 'Hengitystauot', 'Movement': 'Liikunta', 'Take a 1-minute Moment': 'Ota minuutin hetki', 'Check in a few times, and Terra shows how much seems to be weighing on you.': 'Kirjaa olosi muutaman kerran, niin Terra näyttää, kuinka paljon sinulla näyttää olevan kuormaa.', 'An estimate from your own check-ins, not a measurement of cortisol or your health.': 'Arvio omista merkinnöistäsi. Se ei mittaa kortisolia eikä terveyttäsi.',
  'Mark this step done': 'Merkitse tämä askel tehdyksi', 'A woman hugging her knees, calm': 'Rauhallinen nainen halaa polviaan', 'A woman leaning back, looking up, calm': 'Rauhallinen nainen nojaa taaksepäin ja katsoo ylös', 'A woman resting her chin on her hands, dreaming': 'Nainen nojaa leukaansa käsiin ja haaveilee', 'A woman lying down with her feet up, resting': 'Nainen makaa vatsallaan jalat ylhäällä ja lepää', 'A happy woman lying on her front, kicking her feet up': 'Iloinen nainen makaa vatsallaan ja heiluttaa jalkojaan', 'Terra, a calm woman with long purple hair leaning back and looking up': 'Terra, rauhallinen pitkähiuksinen nainen, nojaa taaksepäin ja katsoo ylös',
  'Unlimited routines and 3-minute Moments': 'Rajattomasti rutiineja ja 3 minuutin hetket', 'Everything, with longer Moments and box breathing': 'Kaikki, pidemmät hetket ja laatikkohengitys mukana', 'Everything is open: longer Moments and box breathing.': 'Kaikki on auki: pidemmät hetket ja laatikkohengitys.', 'Unlimited routines and 3-minute Moments are yours.': 'Rajattomat rutiinit ja 3 minuutin hetket ovat nyt sinun.',
  'What tends to trip you up?': 'Mikä yleensä kampittaa?', 'Pick everything that sounds like you. No judging.': 'Valitse kaikki, jotka kuulostavat sinulta. Ei arvostelua.', 'Even small things are hard to begin': 'Pienikin asia on vaikea aloittaa', 'Things slip my mind': 'Asiat unohtuvat', 'Time just disappears': 'Aika vain katoaa', 'Everything feels urgent': 'Kaikki tuntuu kiireelliseltä', 'I start strong, then it fades': 'Aloitan innolla, sitten se hiipuu', 'Forgetting to eat or drink': 'Unohdan syödä tai juoda', 'I notice I\'m hungry way too late': 'Huomaan nälän aivan liian myöhään', 'Hard to switch off at night': 'Illalla on vaikea rauhoittua', 'Pick the time closest to a normal morning. Your first steps start from here.': 'Valitse tavallista aamuasi lähin aika. Ensimmäiset askeleet alkavat siitä.', 'And when do you usually go to bed?': 'Entä milloin yleensä menet nukkumaan?', 'Terra reminds you to wind down about 45 minutes before.': 'Terra muistuttaa rauhoittumaan noin 45 minuuttia ennen.', 'Before 22:00': 'Ennen klo 22.00', '22:00 to 23:30': 'Klo 22.00–23.30', 'After 23:30': 'Klo 23.30 jälkeen', 'It varies a lot': 'Vaihtelee paljon', 'Less stress': 'Vähemmän stressiä', 'How much should Terra remind you?': 'Kuinka paljon Terra saa muistuttaa?', 'Reminders help most when there are just enough of them.': 'Muistutukset auttavat eniten, kun niitä on juuri sopivasti.', 'A few gentle nudges': 'Muutama lempeä tönäisy', 'About two a day': 'Noin kaksi päivässä', 'Keep me on track': 'Pidä minut kartalla', 'Up to four a day, at the moments that matter': 'Enintään neljä päivässä, tärkeinä hetkinä', 'Only what I set myself': 'Vain omat muistutukseni', 'Terra won\'t add any reminders for you': 'Terra ei lisää muistutuksia puolestasi', 'How big should we start?': 'Kuinka isosti aloitetaan?', 'Smaller is easier to keep. You can always add more later.': 'Pienestä on helpompi pitää kiinni. Lisää voi aina ottaa myöhemmin.', 'Tiny': 'Tosi pienesti', 'Two steps per routine': 'Kaksi askelta per rutiini', 'Small': 'Pienesti', 'Three steps per routine': 'Kolme askelta per rutiini', 'A bit more': 'Vähän enemmän', 'Up to four steps per routine': 'Enintään neljä askelta per rutiini', 'Calm pause': 'Rauhoittumistauko', 'Take three slow breaths': 'Hengitä kolme kertaa hitaasti', 'Do a one-minute Moment': 'Tee minuutin hengityshetki', 'Time for water and a bite': 'Vettä ja jotain pientä syötävää', 'Check today\'s one important thing': 'Katso päivän yksi tärkeä asia', 'One slow breath, then one thing': 'Yksi hidas hengitys, sitten yksi asia', 'A few quick questions': 'Muutama nopea kysymys', 'About your day, like when it starts and ends and what feels hard. It takes about a minute.': 'Päivästäsi, esimerkiksi milloin se alkaa ja päättyy ja mikä tuntuu vaikealta. Vie noin minuutin.',
  'Terra AI is coming soon': 'Terra AI tulossa pian', 'Your routines, reminders and Moments work without it.': 'Rutiinit, muistutukset ja hetket toimivat ilman sitäkin.',
  'Remove': 'Poista', 
  // navigation & shell
  'Today': 'Tänään', 'Routines': 'Rutiinit', 'Track': 'Seuranta', 'Moment': 'Hetki', 'Terra AI': 'Terra AI', 'Settings': 'Asetukset', 'Sections': 'Osiot',
  'Good morning,': 'Huomenta,', 'Good afternoon,': 'Hyvää iltapäivää,', 'Good evening,': 'Hyvää iltaa,', 'Good night,': 'Hyvää yötä,',
  'Make room for what does you good.': 'Tee tilaa sille, mikä tekee hyvää.',
  // today
  'Your next tiny step': 'Seuraava pieni askel', 'Next tiny step': 'Seuraava pieni askel', 'Done': 'Tehty', 'Not now, show me another': 'Ei nyt, näytä toinen',
  "Today's progress": 'Päivän edistyminen', 'One step today starts your rhythm.': 'Yksi askel tänään aloittaa rytmisi.',
  'Start here': 'Aloita tästä', 'Create your first tiny routine': 'Luo ensimmäinen pieni rutiinisi', 'New routine': 'Uusi rutiini',
  'All steps done': 'Kaikki askeleet tehty', "That's your rhythm for today.": 'Siinä päivän rytmisi.', 'Rest counts too. See you tomorrow.': 'Lepokin on tärkeää. Nähdään huomenna.',
  'A small thought for today': 'Päivän pieni ajatus', 'Week rhythm': 'Viikon rytmi', 'Small steps add up to a direction.': 'Pienistä askeleista syntyy suunta.',
  'Reminders': 'Muistutukset', 'Add': 'Lisää', 'No reminders yet. Add one for something you tend to forget.': 'Ei vielä muistutuksia. Lisää sellaiselle, mikä usein unohtuu.',
  'Change time': 'Vaihda aika', 'Delete reminder': 'Poista muistutus', 'Add to calendar': 'Lisää kalenteriin', 'All done today': 'Kaikki tehty tänään', 'Rest counts too': 'Lepokin on tärkeää',
  // tips & wins
  'Put the thing you need where you will see it. A visible cue does the remembering for you.': 'Laita tarvitsemasi tavara näkyville. Näkyvä vihje muistaa puolestasi.',
  'Make the step so small it feels almost silly. Two minutes is enough to start.': 'Tee askeleesta niin pieni, että se tuntuu melkein hassulta. Kaksi minuuttia riittää alkuun.',
  'Link a new habit to one you already have: after I ___, I will ___.': 'Liitä uusi tapa vanhaan: kun olen ___, teen ___.',
  'Never miss twice. One off day is normal. Just come back tomorrow.': 'Yksi väliin jäänyt päivä on normaalia. Palaa huomenna.',
  'Make it pleasant. Pair a habit with music, tea or a cozy spot.': 'Tee siitä mukavaa. Yhdistä tapaan musiikki, tee tai kodikas paikka.',
  'Get things ready the night before. Tomorrow-you will thank you.': 'Valmistele asiat edellisenä iltana. Huomisen sinä kiittää.',
  'Every small step is a vote for the person you want to be.': 'Jokainen pieni askel vie kohti sitä, millainen haluat olla.',
  'Remove one obstacle. Fewer steps between you and the habit means less friction.': 'Poista yksi este. Mitä vähemmän vaiheita, sitä helpompi aloittaa.',
  'Start, then decide. Once you begin, continuing is much easier.': 'Aloita ja päätä sitten. Kun olet alkanut, jatkaminen on helpompaa.',
  'Track it where you can see it. Seeing progress makes you want to keep it going.': 'Seuraa näkyvästi. Kun näet edistyksen, haluat jatkaa.',
  'Nice. That counts.': 'Hienoa. Se lasketaan.', 'One step done. That is a real win.': 'Yksi askel tehty. Se on oikea voitto.', 'Small and done beats big and someday.': 'Pieni ja tehty voittaa ison ja joskus.',
  'Look at you go.': 'Katso sinua.', 'Your future self says thanks.': 'Tuleva sinä kiittää.', 'Done. Breathe it in for a second.': 'Tehty. Hengitä se hetkeksi sisään.', 'That is how routines are built.': 'Näin rutiinit rakentuvat.',
  'Every step you took today counts. Be proud of that.': 'Jokainen tämän päivän askel lasketaan. Ole siitä ylpeä.',
  // slots
  'Morning': 'Aamu', 'Daytime': 'Päivä', 'Evening': 'Ilta',
  // routines
  'Your rhythm': 'Sinun rytmisi', 'Tiny steps, linked to things you already do.': 'Pieniä askelia, liitettynä asioihin, joita jo teet.',
  'Add step': 'Lisää askel', 'A step under 2 minutes': 'Alle 2 minuutin askel', 'Remove step': 'Poista askel', 'Delete routine': 'Poista rutiini',
  'Delete this routine?': 'Poistetaanko rutiini?', 'Delete': 'Poista', 'Keep': 'Säilytä', 'Ask Terra AI': 'Kysy Terra AI:lta', 'Upgrade': 'Päivitä',
  'No routines yet. Start with one small routine for the part of the day that feels hardest.': 'Ei vielä rutiineja. Aloita yhdellä pienellä rutiinilla päivän vaikeimpaan kohtaan.',
  'Name': 'Nimi', 'Morning start': 'Aamun aloitus', 'When': 'Milloin', 'Link it to something you already do': 'Liitä se johonkin, mitä jo teet',
  'After I turn off my alarm': 'Kun olen sammuttanut herätyksen', 'Tiny steps, one per line': 'Pienet askeleet, yksi per rivi',
  'Drink a glass of water\nOpen the curtains\nStretch for one minute': 'Juo lasi vettä\nAvaa verhot\nVenyttele minuutti', 'Save routine': 'Tallenna rutiini',
  'New reminder': 'Uusi muistutus', 'Edit reminder': 'Muokkaa muistutusta', 'Reminder': 'Muistutus', 'Take vitamins': 'Ota vitamiinit', 'Time': 'Aika', 'Save reminder': 'Tallenna muistutus',
  'Routine deleted': 'Rutiini poistettu', 'Reminder deleted': 'Muistutus poistettu', 'Undo': 'Kumoa',
  // templates & plan content
  'Gentle morning': 'Lempeä aamu', 'Drink a glass of water': 'Juo lasi vettä', 'Open the curtains': 'Avaa verhot', 'Stretch for one minute': 'Venyttele minuutti', 'Look at the one important thing for today': 'Katso päivän yksi tärkein asia',
  'Fuel up': 'Energiaa päivään', 'When I sit down to work': 'Kun istun töihin', 'Fill your water bottle': 'Täytä vesipullo', 'Eat something small before noon': 'Syö jotain pientä ennen puoltapäivää', 'Drink a glass of water with lunch': 'Juo lasi vettä lounaalla', 'Put a snack where you can see it': 'Laita välipala näkyville',
  'Ten-minute reset': 'Kymmenen minuutin siivous', 'After dinner': 'Päivällisen jälkeen', 'Put five things back where they belong': 'Laita viisi tavaraa paikoilleen', 'Clear one surface': 'Tyhjennä yksi taso', 'Wash three dishes': 'Pese kolme astiaa', 'Take out one bag of trash': 'Vie yksi roskapussi',
  'Evening wind-down': 'Illan rauhoittuminen', 'After I brush my teeth': 'Kun olen pessyt hampaat', 'Dim the lights': 'Himmennä valot', 'Put your phone to charge away from the bed': 'Laita puhelin lataukseen kauas sängystä', 'Write down one thing that went well': 'Kirjoita ylös yksi asia, joka meni hyvin', 'Lights off at the same time': 'Valot pois samaan aikaan',
  'Focus start': 'Keskittymisen alku', 'When I open my laptop': 'Kun avaan läppärin', 'Write the one task on a sticky note': 'Kirjoita yksi tehtävä muistilapulle', 'Put your phone in another room': 'Vie puhelin toiseen huoneeseen', 'Set a 10-minute timer and begin': 'Laita 10 minuutin ajastin ja aloita', 'Take a short break when it rings': 'Pidä lyhyt tauko, kun se soi',
  'Move a little': 'Liiku vähän', 'After lunch': 'Lounaan jälkeen', 'Put on your shoes': 'Laita kengät jalkaan', 'Walk to the end of the street': 'Kävele kadun päähän', 'Stretch your arms for one minute': 'Venyttele käsiä minuutti', 'Drink some water': 'Juo vähän vettä',
  'Start your morning steps': 'Aloita aamun askeleet', 'Pause and check what\'s next': 'Pysähdy ja katso, mitä seuraavaksi', 'Start winding down': 'Aloita rauhoittuminen',
  'Rest-day lift': 'Lepopäivän piristys', "On days I don't work out": 'Päivinä, jolloin en treenaa', 'Walk outside for 10 minutes': 'Kävele ulkona 10 minuuttia', 'Roll out a mat or towel': 'Levitä matto tai pyyhe', 'Stretch slowly for 5 minutes': 'Venyttele rauhassa 5 minuuttia', 'Open the Moment tab': 'Avaa Hetki-välilehti', 'Breathe slowly for one minute': 'Hengitä rauhassa minuutti',
  'Rest-day lift added to Routines': 'Lepopäivän piristys lisätty rutiineihin',
  // moment
  'Drop your shoulders': 'Laske hartiat', 'This moment is for you.': 'Tämä hetki on sinua varten.', 'Ready to begin?': 'Valmis aloittamaan?', 'breathe': 'hengitä',
  'Start': 'Aloita', 'Pause': 'Tauko', 'Continue': 'Jatka', 'Paused': 'Tauolla', 'Start over': 'Aloita alusta', 'Length': 'Kesto', 'Breathing pattern': 'Hengitystapa',
  'Calm': 'Rauhallinen', 'Box breathing': 'Laatikkohengitys', 'In for 4 · hold for 2 · out for 6': 'Sisään 4 · pidätä 2 · ulos 6', 'In 4 · hold 4 · out 4 · hold 4': 'Sisään 4 · pidätä 4 · ulos 4 · pidätä 4',
  'Breathe in': 'Hengitä sisään', 'Hold': 'Pidätä', 'Breathe out': 'Hengitä ulos', 'breathe in': 'hengitä sisään', 'hold': 'pidätä', 'breathe out': 'hengitä ulos', 'done': 'valmis',
  'Well done. Notice how you feel.': 'Hienoa. Huomaa, miltä nyt tuntuu.', 'Moment complete': 'Hetki valmis',
  '3-minute Moments are part of Pro.': '3 minuutin hetket kuuluvat Pro-tasoon.', 'Longer Moments are part of Ultimate.': 'Pidemmät hetket kuuluvat Ultimate-tasoon.', 'Box breathing is part of Ultimate.': 'Laatikkohengitys kuuluu Ultimate-tasoon.',
  // terra ai
  'Think out loud': 'Ajattele ääneen', "Tell me about your day. We'll shape it together.": 'Kerro päivästäsi. Muotoillaan se yhdessä.',
  "Let's take it slow": 'Otetaan rauhassa', 'Try saying: "Remember that my mornings are busy."': 'Kokeile: "Muista, että aamuni ovat kiireisiä."', 'Try these': 'Kokeile näitä',
  'Create a morning routine': 'Luo aamurutiini', 'Add a reminder': 'Lisää muistutus', 'Help me calm down': 'Auta minua rauhoittumaan',
  'Terra helps with routines, reminders and calm. Short memory.': 'Terra auttaa rutiineissa, muistutuksissa ja rauhoittumisessa. Lyhyt muisti.',
  'Terra helps with routines, reminders and calm. Extended memory is on.': 'Terra auttaa rutiineissa, muistutuksissa ja rauhoittumisessa. Laajennettu muisti on päällä.',
  'Start a new conversation': 'Aloita uusi keskustelu', 'Let Terra build routines with you': 'Rakenna rutiineja yhdessä Terran kanssa',
  'Tell Terra about your day in your own words. It creates tiny steps and reminders that fit you.': 'Kerro Terralle päivästäsi omin sanoin. Se luo sinulle sopivia pieniä askelia ja muistutuksia.',
  'See plans': 'Katso tilaukset', 'Terra AI is resting': 'Terra AI lepää', 'Connecting…': 'Yhdistetään…',
  "Terra AI needs access to Claude, which isn't available in this view. Open Terra in the Claude app while signed in to chat.": 'Terra AI tarvitsee yhteyden Claudeen, jota tässä näkymässä ei ole. Avaa Terra Claude-sovelluksessa kirjautuneena keskustellaksesi.',
  'Message Terra AI': 'Viesti Terra AI:lle', 'Write a message to Terra AI…': 'Kirjoita viesti Terra AI:lle…', 'Send': 'Lähetä',
  'Terra needs a short pause. Try again in a little while.': 'Terra tarvitsee pienen tauon. Yritä hetken päästä uudelleen.',
  "Let's keep to routines, reminders and calm. What would help your day right now?": 'Pysytään rutiineissa, muistutuksissa ja rauhoittumisessa. Mikä auttaisi päivääsi juuri nyt?',
  "Terra AI isn't allowed in this view yet. You can allow it from the page permissions.": 'Terra AI:ta ei ole vielä sallittu tässä näkymässä. Voit sallia sen sivun käyttöoikeuksista.',
  "Claude isn't available for this account, so Terra AI can't reply here.": 'Claude ei ole käytettävissä tällä tilillä, joten Terra AI ei voi vastata tässä.',
  'Please sign in again to keep chatting.': 'Kirjaudu uudelleen jatkaaksesi keskustelua.', 'Something interrupted the reply. Try sending it again.': 'Jokin keskeytti vastauksen. Yritä lähettää uudelleen.',
  // settings
  'Plan': 'Tilaus', 'Current plan': 'Nykyinen tilaus', 'Ultimate free trial': 'Ultimate-kokeilu', 'Trial': 'Kokeilu', 'Prices': 'Hinnat',
  '3 routines, reminders, widget and 1-minute breathing': '3 rutiinia, muistutukset, widget ja 1 minuutin hengitys',
  'Unlimited routines, Terra AI and 3-minute Moments': 'Rajattomasti rutiineja, Terra AI ja 3 minuutin hetket',
  'Everything, with extended AI memory and longer Moments': 'Kaikki, laajennettu AI-muisti ja pidemmät hetket',
  'Profile': 'Profiili', 'Your name': 'Nimesi', 'What should Terra call you?': 'Miksi Terra saa kutsua sinua?', 'Your check-in': 'Vastauksesi', 'Not answered yet': 'Ei vielä vastattu', 'Retake check-in': 'Vastaa kysymyksiin uudelleen',
  'Experience': 'Käyttökokemus', 'Notifications': 'Ilmoitukset', 'On. Gentle nudges for your reminders and next steps': 'Päällä. Lempeät muistutukset ja seuraavat askeleet',
  'Off. Turn on to get reminders when they are due': 'Pois. Laita päälle, niin saat muistutukset ajallaan', 'Turn off': 'Laita pois', 'Turn on': 'Laita päälle',
  'Reminder banners': 'Muistutusbannerit', 'Shows a gentle banner when a reminder is due while Terra is open': 'Näyttää lempeän bannerin, kun muistutus on ajankohtainen ja Terra on auki',
  'Soft sounds': 'Pehmeät äänet', 'Chimes for finished steps and breathing': 'Kilahdukset tehdyistä askeleista ja hengityksestä', 'Still mode': 'Hiljainen tila', 'Turns off animations for a quieter screen': 'Poistaa animaatiot rauhallisempaa näkymää varten',
  'App tour': 'Esittelykierros', 'A 30-second look at what everything does': '30 sekunnin katsaus siihen, mitä kaikki tekee', 'Replay': 'Katso uudelleen', 'Language': 'Kieli', 'App language': 'Sovelluksen kieli',
  'Home screen widget · preview': 'Kotinäytön widget · esikatselu', 'Widgets arrive with the iOS app.': 'Widgetit tulevat iOS-sovelluksen mukana.', 'All done': 'Kaikki tehty',
  // privacy
  'Privacy and your data': 'Tietosuoja ja tietosi', 'Synced to your account': 'Synkataan tilillesi', 'Name, check-in answers, routines, reminders, workouts, XP and plan.': 'Nimi, vastaukset, rutiinit, muistutukset, treenit, XP ja tilaus.',
  'Only on this device': 'Vain tällä laitteella', 'Mood check-ins, cycle dates, symptoms and screen time. Never synced. Kept for up to 400 days, screen time for 60.': 'Mielialakirjaukset, kierron päivät, oireet ja ruutuaika. Ei koskaan synkata. Säilytetään enintään 400 päivää, ruutuaika 60.',
  'Mood check-ins': 'Mielialakirjaukset', 'One-tap "How do you feel?" after Moments': 'Yhden napautuksen "Miltä tuntuu?" hetkien jälkeen',
  'Cycle tracking': 'Kierron seuranta', 'Period dates, phases and symptoms. Needs your consent': 'Kuukautisten päivät, vaiheet ja oireet. Vaatii suostumuksesi',
  'Personal insights': 'Omat havainnot', 'Finds patterns on this device. No automated decisions': 'Etsii toistuvia kuvioita laitteella. Ei automaattisia päätöksiä',
  'Share a summary with Terra AI': 'Jaa yhteenveto Terra AI:lle', 'Sends workout count and mood totals with your messages. Never cycle data': 'Lähettää treenien määrän ja mielialojen yhteenvedon viestiesi mukana. Ei koskaan kiertotietoja',
  'Export my data': 'Vie tietoni', 'Delete health data': 'Poista terveystiedot', 'Delete mood, cycle and screen time data from this device?': 'Poistetaanko mieliala-, kierto- ja ruutuaikatiedot tältä laitteelta?', 'Cancel': 'Peruuta',
  'Terra AI only receives what it needs to reply. Terra supports daily life. It isn\'t medical care or a replacement for treatment. Questions about your data: contact the Terra team.': 'Terra AI saa vain sen, mitä se tarvitsee vastatakseen. Terra tukee arkea, mutta se ei ole terveydenhoitoa eikä korvaa hoitoa. Kysymykset tiedoistasi: ota yhteyttä Terra-tiimiin.',
  'Delete all my data': 'Poista kaikki tietoni', 'This deletes your routines, reminders, workouts and all health data.': 'Tämä poistaa rutiinisi, muistutuksesi, treenisi ja kaikki terveystiedot.', 'Delete everything': 'Poista kaikki',
  'Turning this off deletes all your check-ins from this device.': 'Tämän poistaminen käytöstä poistaa kaikki kirjauksesi tältä laitteelta.',
  'Turning this off deletes all cycle dates and symptoms from this device.': 'Tämän poistaminen käytöstä poistaa kaikki kierron päivät ja oireet tältä laitteelta.',
  'Turn off and delete': 'Poista käytöstä ja poista tiedot', 'Health data deleted from this device.': 'Terveystiedot poistettu tältä laitteelta.',
  'Check-ins are off and deleted.': 'Kirjaukset on poistettu käytöstä ja poistettu.', 'Cycle tracking is off and the data is deleted.': 'Kierron seuranta on pois ja tiedot poistettu.',
  'Your data is ready.': 'Tietosi ovat valmiina.', 'Export works when Terra is opened in the Claude app.': 'Vienti toimii, kun Terra avataan Claude-sovelluksessa.', 'One moment, then try again.': 'Hetki, ja yritä sitten uudelleen.', "Export isn't available in this view.": 'Vienti ei ole käytettävissä tässä näkymässä.',
  // paywall
  'Plans': 'Tilaukset', 'Close': 'Sulje', 'Choose your rhythm': 'Valitse rytmisi', 'Start free. Upgrade when you want more.': 'Aloita ilmaiseksi. Päivitä, kun haluat enemmän.',
  'Monthly': 'Kuukausittain', 'Yearly': 'Vuosittain', 'Your plan': 'Sinun tilauksesi', 'Everything in Free': 'Kaikki Free-tason ominaisuudet', 'Unlimited routines': 'Rajattomasti rutiineja',
  'Terra AI with short memory': 'Terra AI lyhyellä muistilla', '3-minute Moments': '3 minuutin hetket', 'Everything in Pro': 'Kaikki Pro-tason ominaisuudet',
  'Extended AI memory and conversation context': 'Laajennettu AI-muisti ja keskusteluhistoria', '5 and 10-minute Moments': '5 ja 10 minuutin hetket', '14 days free': '14 päivää ilmaiseksi',
  'Have a promo code?': 'Onko sinulla tarjouskoodi?', 'Promo code': 'Tarjouskoodi', 'Enter code': 'Syötä koodi', 'Redeem': 'Lunasta', 'vs. monthly': 'kuukausihintaan verrattuna',
  'Free stays free: 3 routines, reminders, widget and short breathing Moments.': 'Free pysyy ilmaisena: 3 rutiinia, muistutukset, widget ja lyhyet hengityshetket.',
  'Start 14-day free trial': 'Aloita 14 päivän ilmainen kokeilu', 'Purchases open with the App Store release': 'Ostot avautuvat App Store -julkaisun myötä',
  'Continue with Free': 'Jatka Free-tasolla', 'Continue with your trial': 'Jatka kokeilua', 'Subscriptions will be billed and managed through your Apple ID.': 'Tilaukset laskutetaan ja hallitaan Apple ID:si kautta.',
  'Type a code first.': 'Kirjoita ensin koodi.', "That code doesn't match an active offer. Check the spelling and try again.": 'Koodi ei vastaa voimassa olevaa tarjousta. Tarkista kirjoitusasu ja yritä uudelleen.',
  'Free includes 3 routines. Pro gives you as many as you need.': 'Free sisältää 3 rutiinia. Pro antaa niitä niin monta kuin tarvitset.',
  'Ultimate trial started': 'Ultimate-kokeilu alkoi', 'Your Ultimate trial has ended. You\'re back on Free.': 'Ultimate-kokeilusi päättyi. Olet taas Free-tasolla.',
  'Everything is open: Terra AI with extended memory, longer Moments and box breathing.': 'Kaikki on auki: Terra AI laajennetulla muistilla, pidemmät hetket ja laatikkohengitys.',
  'Unlimited routines, Terra AI and 3-minute Moments are yours.': 'Rajattomat rutiinit, Terra AI ja 3 minuutin hetket ovat nyt sinun.',
  // onboarding
  'Welcome to Terra': 'Tervetuloa Terraan', "Hi, I'm Terra.": 'Hei, olen Terra.', 'I help you build small routines that stick, one tiny step at a time. No guilt, no pressure.': 'Autan sinua rakentamaan pieniä rutiineja, jotka pysyvät. Yksi pieni askel kerrallaan, ilman syyllisyyttä ja painetta.',
  "Let's start": 'Aloitetaan', 'Before we begin': 'Ennen kuin aloitetaan', 'A few honest words': 'Muutama rehellinen sana', 'Five quick questions': 'Viisi nopeaa kysymystä',
  'About your everyday life, like what feels hard and when your day starts.': 'Arjestasi, kuten mikä tuntuu vaikealta ja milloin päiväsi alkaa.',
  'One thing and three wins': 'Yksi asia ja kolme onnistumista', "Today's one thing": 'Päivän yksi asia', 'Pick the one thing that matters most today. In the evening, write down three things that went well.': 'Valitse päivän tärkein asia. Kirjoita illalla kolme asiaa, jotka menivät hyvin.', "Write today's one important thing and what went well": 'Kirjaa päivän tärkein asia ja mikä meni hyvin', 'wins': 'onnistumista',
  'A small start is enough.': 'Pieni alku riittää.', 'Just the first step. The rest can wait.': 'Vain ensimmäinen askel. Loput voi odottaa.', 'One small thing, then you can rest.': 'Yksi pieni asia, sitten saat levätä.', 'Open Terra to switch off your alarm.': 'Avaa Terra ja sammuta herätys.',
  'Pure black': 'Puhdas musta', 'A plain black background': 'Yksivärinen musta tausta', 'Green theme': 'Vihreä teema', 'A fresh green accent instead of violet': 'Raikas vihreä korostusväri violetin sijaan',
  "Today's one thing and three wins": 'Päivän yksi asia ja kolme onnistumista', 'The one important thing': 'Yksi tärkeä asia', 'E.g. send the invoice': 'Esim. lähetä lasku', 'Something that went well': 'Jotain, mikä meni hyvin', 'Saved for today': 'Tallennettu tälle päivälle',
  'Your answers stay yours':'Vastauksesi pysyvät sinun', "They're only used to personalize Terra, saved privately to your account. You can delete them anytime in Settings.": 'Niitä käytetään vain Terran personointiin, ja ne tallennetaan yksityisesti tilillesi. Voit poistaa ne milloin tahansa asetuksista.',
  'Support, not treatment': 'Tukea, ei hoitoa', "Terra helps with daily life. It isn't medical care or a replacement for treatment.": 'Terra auttaa arjessa. Se ei ole terveydenhoitoa eikä korvaa hoitoa.',
  'I agree, continue': 'Hyväksyn, jatketaan', 'Back': 'Takaisin', 'Skip': 'Ohita',
  'What should I call you?': 'Miksi saan kutsua sinua?', 'Just a first name or nickname is fine. Terra uses it to greet you.': 'Etunimi tai lempinimi riittää. Terra käyttää sitä tervehtiessään.',
  'What feels hardest right now?': 'Mikä tuntuu nyt vaikeimmalta?', 'Pick one or more.': 'Valitse yksi tai useampi.',
  'Getting started': 'Aloittaminen', 'Remembering things': 'Asioiden muistaminen', 'Losing track of time': 'Ajantajun katoaminen', 'Too much at once': 'Liikaa kerralla', 'Keeping it going': 'Jatkaminen', 'Evenings and sleep': 'Illat ja uni',
  'What time do you usually get up?': 'Mihin aikaan yleensä heräät?', 'Pick the clock time closest to your normal morning. Terra times your first steps around it.': 'Valitse kellonaika, joka on lähimpänä tavallista aamuasi. Terra ajoittaa ensimmäiset askeleesi sen mukaan.',
  'Before 07:00': 'Ennen klo 07.00', '07:00 to 09:00': 'Klo 07.00–09.00', '09:00 to 11:00': 'Klo 09.00–11.00', 'After 11:00, or it varies': 'Klo 11.00 jälkeen, tai vaihtelee',
  'What would make the biggest difference?': 'Mikä tekisi suurimman eron?', "Pick up to three. We'll start there.": 'Valitse enintään kolme. Aloitetaan niistä.',
  'Calmer mornings': 'Rauhallisemmat aamut', 'Eating and drinking regularly': 'Säännöllinen syöminen ja juominen', 'Cleaner home': 'Siistimpi koti', 'Better sleep': 'Parempi uni', 'Focus for work or study': 'Keskittyminen töihin tai opiskeluun', 'Moving my body': 'Liikkuminen',
  'How much energy do you have for new habits?': 'Kuinka paljon sinulla on energiaa uusiin tapoihin?', 'Be honest. Small is the point.': 'Ole rehellinen. Pienuus on koko juttu.',
  'Just a little': 'Vain vähän', 'Start me with the tiniest steps': 'Aloitetaan pienimmillä askelilla', 'Some': 'Jonkin verran', 'A few small steps a day': 'Muutama pieni askel päivässä', 'Quite a lot': 'Aika paljon', "I'm ready for a bit more": 'Olen valmis vähän isompaan',
  'Got it, thank you.': 'Selvä, kiitos.', 'Building your rhythm…': 'Rakennetaan rytmiäsi…', 'Take one slow breath while Terra puts it together.': 'Hengitä kerran rauhassa, kun Terra kokoaa sen.',
  'Reading your answers': 'Luetaan vastauksiasi', 'Making each step small enough': 'Tehdään jokaisesta askeleesta tarpeeksi pieni', 'Linking steps to your day': 'Liitetään askeleet päivääsi', 'Choosing gentle reminders': 'Valitaan lempeät muistutukset',
  'Made for you by Terra AI': 'Terra AI:n tekemä sinulle', 'Made from your answers': 'Tehty vastaustesi pohjalta', "Here's your starting rhythm": 'Tässä on aloitusrytmisi', 'Small on purpose. You can change everything later.': 'Tarkoituksella pieni. Voit muuttaa kaiken myöhemmin.',
  'Looks good': 'Näyttää hyvältä', "I'm not sure": 'En ole varma', "That's okay. What would feel easier?": 'Ei se mitään. Mikä tuntuisi helpommalta?',
  'Make it even smaller': 'Tee siitä vielä pienempi', 'Two tiny steps per routine': 'Kaksi pientä askelta per rutiini', 'Start with just one routine': 'Aloita vain yhdellä rutiinilla', 'Add more when it feels easy': 'Lisää, kun se tuntuu helpolta',
  'Change my answers': 'Muuta vastauksiani', 'Go back to the questions': 'Palaa kysymyksiin', 'Keep this plan': 'Pidä tämä suunnitelma',
  'Even smaller. Two tiny steps each is plenty to start.': 'Vielä pienempi. Kaksi pientä askelta riittää alkuun.', 'One routine to begin with. You can add more whenever it feels easy.': 'Yksi rutiini alkuun. Voit lisätä lisää, kun se tuntuu helpolta.',
  'One last thing': 'Vielä yksi asia', 'Can Terra give you a gentle nudge?': 'Saako Terra muistuttaa sinua lempeästi?', 'Reminders only help if they reach you. You choose the times, and you can change this anytime.': 'Muistutukset auttavat vain, jos ne tavoittavat sinut. Sinä valitset ajat, ja voit muuttaa tätä milloin tahansa.',
  'Your reminders and next steps': 'Muistutuksesi ja seuraavat askeleet', 'At the times you set. Nothing random, no ads.': 'Asettamiisi aikoihin. Ei mitään satunnaista eikä mainoksia.',
  'Quiet at night': 'Hiljaista yöllä', "Terra's own nudges pause from 22:00 to 07:00. Only reminders you set yourself come through.": 'Terran omat muistutukset ovat tauolla klo 22–07. Vain itse asettamasi muistutukset tulevat perille.',
  'Calendar and Screen Time': 'Kalenteri ja ruutuaika', 'Asked separately later, only if you turn those features on.': 'Kysytään erikseen myöhemmin, vain jos otat ne käyttöön.',
  'Allow notifications': 'Salli ilmoitukset', 'Not now': 'Ei nyt', 'Notifications are on. Terra will keep it gentle.': 'Ilmoitukset ovat päällä. Terra pitää ne lempeinä.', 'Okay. You can turn notifications on in Settings.': 'Selvä. Voit laittaa ilmoitukset päälle asetuksista.',
  'Notifications are on.': 'Ilmoitukset ovat päällä.', 'Notifications are blocked here. You can allow them in your device or browser settings.': 'Ilmoitukset on estetty täällä. Voit sallia ne laitteen tai selaimen asetuksista.',
  'Your first tiny win': 'Ensimmäinen pieni voittosi', "Let's do one step right now": 'Tehdään yksi askel heti', "It takes about a minute. Tap Done when it's done.": 'Se vie noin minuutin. Napauta Tehty, kun se on tehty.',
  "I'll do it later": 'Teen sen myöhemmin', 'Take one slow breath': 'Hengitä kerran rauhassa', "That's how it starts. One small step, and you did it.": 'Näin se alkaa. Yksi pieni askel, ja teit sen.',
  // tour
  'A 30-second tour': '30 sekunnin kierros', 'Let me show you around. You can skip anytime.': 'Näytän, mitä täältä löytyy. Voit ohittaa milloin tahansa.', 'Show me': 'Näytä', 'Next': 'Seuraava', 'Skip tour': 'Ohita kierros',
  "One small thing at a time. Tap Done when it's done, or \"Not now\" to see another step.": 'Yksi pieni asia kerrallaan. Napauta Tehty, kun se on tehty, tai "Ei nyt" nähdäksesi toisen askeleen.',
  'Earn *XP* with every step': 'Ansaitse *XP:tä* joka askeleella', 'Every step, workout and Moment earns *XP*. Collect *XP* to climb from Beginner 🌱 all the way to Legend 👑.': 'Jokainen askel, treeni ja hetki tuo *XP:tä.* Kerää *XP:tä* ja nouse Aloittelijasta 🌱 aina Legendaksi 👑.',
  'Your lists of tiny steps, linked to things you already do. Add them to your calendar too.': 'Pienten askelten listasi, liitettynä asioihin, joita jo teet. Lisää ne myös kalenteriin.',
  'Log workouts, check in on how you feel, follow your cycle and see your screen time.': 'Kirjaa treenit, kerro miltä tuntuu, seuraa kiertoasi ja näe ruutuaikasi.',
  'A calm breathing break whenever things feel like too much.': 'Rauhallinen hengitystauko aina, kun kaikki tuntuu liialta.',
  'Tell Terra about your day in your own words. It builds routines and reminders with you.': 'Kerro Terralle päivästäsi omin sanoin. Se rakentaa rutiineja ja muistutuksia kanssasi.',
  'Settings and privacy': 'Asetukset ja tietosuoja', 'Your plan, promo codes, and exactly what is saved where. You can replay this tour here.': 'Tilauksesi, tarjouskoodit ja tarkalleen mitä tallennetaan minne. Voit katsoa tämän kierroksen uudelleen täältä.',
  "You're all set": 'Kaikki valmista', "Start with one tiny step. That's all it takes.": 'Aloita yhdellä pienellä askeleella. Muuta ei tarvita.', "Let's go": 'Mennään',
  // track
  'Your progress': 'Edistymisesi', 'Notice what does you good. No judging.': 'Huomaa, mikä tekee hyvää. Ilman arvostelua.', 'Your rank': 'Tasosi', 'Track sections': 'Seurannan osiot',
  'Beginner': 'Aloittelija', 'Starter': 'Matkalla', 'Builder': 'Rakentaja', 'Steady': 'Vakaa', 'Athlete': 'Urheilija', 'Warrior': 'Soturi', 'Legend': 'Legenda',
  "Earn XP: step +5 · reminder +3 · workout +20 · Moment +10 · check-in +2. It's only you against yesterday-you.": 'Ansaitse XP:tä: askel +5 · muistutus +3 · treeni +20 · hetki +10 · kirjaus +2. Kilpailet vain eilisen itsesi kanssa.',
  'Workouts': 'Treenit', 'Mood': 'Mieliala', 'Cycle': 'Kierto', 'Screen': 'Ruutuaika',
  'This week': 'Tällä viikolla', 'Log a workout': 'Kirjaa treeni', 'this month': 'tässä kuussa', 'minutes this month': 'minuuttia tässä kuussa', 'week on goal': 'viikko tavoitteessa', 'weeks on goal': 'viikkoa tavoitteessa',
  'Weekly goal': 'Viikkotavoite', 'Lower goal': 'Laske tavoitetta', 'Raise goal': 'Nosta tavoitetta', 'Recent': 'Viimeisimmät', 'Delete workout': 'Poista treeni', 'Workout deleted': 'Treeni poistettu',
  'No workouts yet. A 10-minute walk counts.': 'Ei vielä treenejä. 10 minuutin kävelykin lasketaan.',
  'What did you do?': 'Mitä teit?', 'How long?': 'Kuinka kauan?', 'How did it feel?': 'Miltä se tuntui?', 'When?': 'Milloin?', 'Yesterday': 'Eilen', 'Save workout': 'Tallenna treeni',
  'Easy': 'Kevyt', 'Medium': 'Keskiraskas', 'Hard': 'Raskas',
  'Walk': 'Kävely', 'Run': 'Juoksu', 'Gym': 'Sali', 'Yoga': 'Jooga', 'Cycling': 'Pyöräily', 'Swim': 'Uinti', 'Home workout': 'Kotitreeni', 'Other': 'Muu',
  'Weekly goal reached': 'Viikkotavoite saavutettu',
  // mood
  'Check-in': 'Kirjaus', 'Check-ins': 'Kirjaukset', 'How are you right now?': 'Miten voit juuri nyt?', 'How do you feel right now?': 'Miltä sinusta tuntuu juuri nyt?', 'After your Moment': 'Hetken jälkeen',
  'Energized': 'Energinen', 'Happy': 'Iloinen', 'Tired': 'Väsynyt', 'Scattered': 'Hajallaan', 'Low': 'Alakuloinen',
  'Saved only on this device': 'Tallennetaan vain tälle laitteelle', 'Last 14 days': 'Viimeiset 14 päivää', 'Last 30 days': 'Viimeiset 30 päivää', '🏃 = workout day': '🏃 = treenipäivä', 'No check-ins yet.': 'Ei vielä kirjauksia.',
  'See what lifts you': 'Näe, mikä piristää sinua', 'Answer one tap, "How do you feel?", after a Moment or whenever you like. Saved only on this device.': 'Vastaa yhdellä napautuksella "Miltä tuntuu?" hetken jälkeen tai milloin haluat. Tallennetaan vain tälle laitteelle.',
  'Turn on check-ins': 'Ota kirjaukset käyttöön', 'Track how you feel?': 'Seurataanko oloasi?', 'Terra can ask how you feel, for example after a Moment. Over time you\'ll see what lifts your mood and energy.': 'Terra voi kysyä, miltä sinusta tuntuu, esimerkiksi hetken jälkeen. Ajan myötä näet, mikä nostaa mielialaasi ja energiaasi.',
  'Check-ins are not synced and not sent to Terra AI.': 'Kirjauksia ei synkata eikä lähetetä Terra AI:lle.', 'Yours to stop': 'Voit lopettaa milloin vain', 'Turn it off in Settings → Privacy. That also deletes your check-ins.': 'Poista käytöstä kohdassa Asetukset → Tietosuoja. Se poistaa myös kirjauksesi.',
  'Yes, save my check-ins': 'Kyllä, tallenna kirjaukseni',
  'Love that energy. Use it on one small thing.': 'Ihana energia. Käytä se yhteen pieneen asiaan.', 'Nice. Notice what helped today.': 'Hienoa. Huomaa, mikä auttoi tänään.', 'Calm is a good place to be.': 'Rauhallisuus on hyvä paikka olla.',
  'Thanks for noticing. Rest counts too.': 'Kiitos, että huomasit. Lepokin on tärkeää.', 'Okay. Pick just one tiny next step.': 'Selvä. Valitse vain yksi pieni seuraava askel.', 'Thanks for telling me. Be gentle with yourself today.': 'Kiitos, että kerroit. Ole tänään lempeä itsellesi.',
  // cycle
  'Understand your cycle': 'Ymmärrä kiertoasi', "See which phase you're in, what usually happens in your body, and how it may affect your energy, mood and focus.": 'Näe, missä vaiheessa olet, mitä kehossasi yleensä tapahtuu ja miten se voi vaikuttaa energiaan, mielialaan ja keskittymiseen.',
  'Turn on cycle tracking': 'Ota kierron seuranta käyttöön', 'Your consent': 'Suostumuksesi', 'Cycle dates and symptoms are health information, so Terra asks for your explicit consent.': 'Kierron päivät ja oireet ovat terveystietoja, joten Terra pyytää nimenomaisen suostumuksesi.',
  'Never synced to your account and never sent to Terra AI.': 'Ei koskaan synkata tilillesi eikä lähetetä Terra AI:lle.', 'One purpose': 'Yksi käyttötarkoitus', 'Only used to show your phase and your own insights. Never for ads.': 'Käytetään vain vaiheesi ja omien havaintojesi näyttämiseen. Ei koskaan mainontaan.',
  'Estimates, not medicine': 'Arvioita, ei lääketiedettä', 'Not contraception and not a diagnosis.': 'Ei ehkäisy eikä diagnoosi.', 'Stop anytime': 'Lopeta milloin vain', 'Turning it off in Settings → Privacy deletes all cycle data.': 'Poistaminen käytöstä kohdassa Asetukset → Tietosuoja poistaa kaikki kiertotiedot.',
  'I agree, turn it on': 'Hyväksyn, ota käyttöön', 'When did your last period start?': 'Milloin viimeiset kuukautisesi alkoivat?', 'First day of your last period': 'Viimeisten kuukautisten ensimmäinen päivä',
  'Usual cycle length (days)': 'Tavallinen kierron pituus (päivää)', 'Usual period length (days)': 'Tavallinen kuukautisten kesto (päivää)', 'Save': 'Tallenna',
  'Not sure? Leave 28 and 5. Terra learns your real length from the dates you log.': 'Etkö ole varma? Jätä 28 ja 5. Terra oppii todellisen pituuden kirjaamistasi päivistä.',
  'Now': 'Nyt', 'Next period around': 'Seuraavat kuukautiset noin', 'day': 'päivä', "What's happening.": 'Mitä tapahtuu.', 'You might notice': 'Saatat huomata',
  'Period': 'Kuukautiset', 'Follicular phase': 'Follikkelivaihe', 'Ovulation window': 'Ovulaatioikkuna', 'Luteal phase': 'Luteaalivaihe',
  'The lining of the uterus sheds. Estrogen and progesterone are at their lowest.': 'Kohdun limakalvo irtoaa. Estrogeeni ja progesteroni ovat matalimmillaan.',
  'Cramps or lower back pain': 'Kramppeja tai alaselkäkipua', 'Tiredness and lower energy': 'Väsymystä ja vähemmän energiaa', 'Headaches': 'Päänsärkyä', 'Mood changes': 'Mielialan vaihtelua',
  'Warmth, rest and gentle movement such as walking or stretching often feel good. Lighter plans are fine.': 'Lämpö, lepo ja kevyt liike, kuten kävely tai venyttely, tuntuvat usein hyvältä. Kevyemmät suunnitelmat ovat ihan ok.',
  'Your body prepares an egg to be released, and estrogen rises steadily.': 'Keho valmistelee munasolun irtoamista, ja estrogeeni nousee tasaisesti.',
  'Energy often returns': 'Energia palaa usein', 'Mood and motivation may lift': 'Mieliala ja motivaatio voivat nousta', 'Many find focus easier': 'Monelle keskittyminen on helpompaa',
  'A good window to start something new or try a harder workout, if you feel like it.': 'Hyvä hetki aloittaa jotain uutta tai kokeilla raskaampaa treeniä, jos siltä tuntuu.',
  'A surge of the hormone LH releases an egg. Estrogen peaks around now.': 'LH-hormonin nousu irrottaa munasolun. Estrogeeni on nyt huipussaan.',
  'A twinge on one side of the lower belly': 'Pistoksia alavatsan toisella puolella', 'Clearer, stretchier discharge': 'Kirkkaampaa, venyvämpää vuotoa', 'Higher energy or libido': 'Enemmän energiaa tai seksuaalista halua',
  'Energy is often high. This window is an estimate, so it is not a reliable way to prevent or plan pregnancy.': 'Energiaa on usein paljon. Ikkuna on arvio, joten se ei ole luotettava tapa ehkäistä tai suunnitella raskautta.',
  'Progesterone rises after ovulation. If there is no pregnancy, both hormones fall in the last days before your period.': 'Progesteroni nousee ovulaation jälkeen. Jos raskautta ei ole, molemmat hormonit laskevat viimeisinä päivinä ennen kuukautisia.',
  'Bloating or tender breasts': 'Turvotusta tai rintojen arkuutta', 'Irritability or low mood': 'Ärtyneisyyttä tai alakuloa', 'Cravings and poorer sleep': 'Mielitekoja ja huonompaa unta',
  'Some people with ADHD find focus harder in the days before a period': 'Osa ADHD-ihmisistä kokee keskittymisen vaikeammaksi kuukautisia edeltävinä päivinä',
  'Go easier on your plans. Regular meals, sleep and smaller steps help.': 'Ota suunnitelmat kevyemmin. Säännölliset ateriat, uni ja pienemmät askeleet auttavat.',
  'Period started today': 'Kuukautiset alkoivat tänään', 'Other date': 'Muu päivä', 'Log a period start': 'Kirjaa kuukautisten alku', 'First day of the period': 'Kuukautisten ensimmäinen päivä',
  'Logged. Take it easy today.': 'Kirjattu. Ota tänään rauhallisesti.', "How's your body today?": 'Miltä kehosi tuntuu tänään?', 'Tap any that fit': 'Napauta sopivia',
  'Cramps': 'Krampit', 'Headache': 'Päänsärky', 'Bloating': 'Turvotus', 'Tender breasts': 'Arat rinnat', 'Mood swings': 'Mielialan vaihtelut', 'Low mood': 'Alakulo', 'Irritable': 'Ärtyisä', 'Cravings': 'Mielihalut', 'Poor sleep': 'Huono uni', 'Acne': 'Akne', 'Hard to focus': 'Vaikea keskittyä',
  'Logged periods': 'Kirjatut kuukautiset', 'Delete this date': 'Poista tämä päivä',
  'Phases and dates are estimates based on what you log. Terra is not contraception and not a medical tool. See a doctor if periods are very painful or heavy, stop for three months without pregnancy, or if your mood before a period makes daily life hard.': 'Vaiheet ja päivät ovat arvioita kirjaamiesi tietojen perusteella. Terra ei ole ehkäisy eikä lääkinnällinen työkalu. Hakeudu lääkäriin, jos kuukautiset ovat hyvin kivuliaat tai runsaat, ne jäävät pois kolmeksi kuukaudeksi ilman raskautta tai jos mielialasi ennen kuukautisia vaikeuttaa arkea.',
  'Share with a partner': 'Jaa kumppanin kanssa', 'Coming later': 'Tulossa myöhemmin', 'Share your phase with a partner and keep a shared calendar. Both of you will have to agree, and either can stop sharing at any time.': 'Jaa vaiheesi kumppanin kanssa ja pidä yhteistä kalenteria. Molempien täytyy hyväksyä, ja kumpi tahansa voi lopettaa jakamisen milloin vain.',
  // screen
  'Time in Terra today': 'Aika Terrassa tänään', 'Comparison appears after two weeks': 'Vertailu näkyy kahden viikon jälkeen', 'Gentle nudge': 'Lempeä muistutus',
  'A soft note to look up, stretch or breathe. At most once an hour, never while you breathe.': 'Pehmeä muistutus katsoa ylös, venytellä tai hengittää. Enintään kerran tunnissa, ei koskaan hengitysharjoituksen aikana.',
  'Nudge after': 'Muistuta jälkeen', 'Off': 'Pois', 'Whole-phone screen time': 'Koko puhelimen ruutuaika', 'iOS app': 'iOS-sovellus',
  "With your permission, Terra will use Apple's Screen Time to notice long stretches on your phone and send the same gentle nudge. Apple keeps the detailed numbers private on your phone.": 'Luvallasi Terra käyttää Applen Screen Timea huomatakseen pitkät rupeamat puhelimella ja lähettää saman lempeän muistutuksen. Apple pitää tarkat luvut yksityisinä puhelimellasi.',
  "You've been here a while. Time to stretch or take a breath?": 'Olet ollut täällä hetken. Venytelläänkö tai hengitetäänkö?', 'Breathe': 'Hengitä',
  // insights
  'Terra noticed': 'Terra huomasi', 'A gentle note': 'Lempeä huomio', 'Personal insights ': 'Omat havainnot', 'Let Terra spot patterns': 'Anna Terran huomata kuvioita',
  'Like "workout days feel brighter". Calculated on this device from your workouts and check-ins.': 'Esimerkiksi "treenipäivät tuntuvat valoisammilta". Lasketaan tällä laitteella treeneistäsi ja kirjauksistasi.',
  'Turn on insights': 'Ota havainnot käyttöön', 'No clear pattern right now. Terra keeps watching gently.': 'Ei selvää kuviota juuri nyt. Terra seuraa lempeästi.',
  'Not quite right': 'Ei ihan osunut', 'Talk it through': 'Juttele siitä', 'Hide for a week': 'Piilota viikoksi', 'Thanks. Terra will look at that differently.': 'Kiitos. Terra katsoo sitä jatkossa eri tavalla.',
  'Workout days look brighter': 'Treenipäivät näyttävät valoisammilta',
  'On days you work out, you usually check in feeling energized or happy. On rest days it tends to dip. Want to add something light to rest days?': 'Treenipäivinä kirjaat yleensä olevasi energinen tai iloinen. Lepopäivinä fiilis laskee. Lisätäänkö lepopäiviin jotain kevyttä?',
  'On days you work out, you usually check in feeling energized or happy. On rest days it tends to dip. Your cycle may play a part too. Want to add something light to rest days?': 'Treenipäivinä kirjaat yleensä olevasi energinen tai iloinen. Lepopäivinä fiilis laskee. Myös kiertosi voi vaikuttaa. Lisätäänkö lepopäiviin jotain kevyttä?',
  '🚶 10-minute walk': '🚶 10 minuutin kävely', '🤸 Gentle stretch': '🤸 Kevyt venyttely', '🌬️ Short Moment': '🌬️ Lyhyt hetki',
  'Rest seems to suit you': 'Lepo näyttää sopivan sinulle', 'Your check-ins are often brighter on days without a workout. Rest is part of the rhythm too.': 'Kirjauksesi ovat usein valoisampia päivinä ilman treeniä. Lepokin kuuluu rytmiin.',
  'Moments help you settle': 'Hetket auttavat rauhoittumaan', 'Lower days before your period': 'Matalampia päiviä ennen kuukautisia',
  "Your lower check-ins often fall in the days before your period. That's common. Planning lighter days then can help.": 'Matalammat kirjauksesi osuvat usein kuukautisia edeltäviin päiviin. Se on yleistä. Kevyempien päivien suunnittelu silloin voi auttaa.',
  "You've felt low on many days lately": 'Olet tuntenut olosi alakuloiseksi monena päivänä viime aikoina',
  "That's worth talking about with someone you trust or a doctor. In Finland, MIELI's Crisis Helpline is open around the clock at 09 2525 0111. If you are in danger right now, call 112.": 'Siitä kannattaa puhua jonkun luotetun ihmisen tai lääkärin kanssa. MIELI ry:n Kriisipuhelin palvelee ympäri vuorokauden numerossa 09 2525 0111. Jos olet vaarassa juuri nyt, soita 112.',
  // calendar
  'Calendar': 'Kalenteri', 'Add to your calendar': 'Lisää kalenteriisi', 'Open in Google Calendar': 'Avaa Google-kalenterissa',
  'Google Calendar opens with a daily event filled in. Check it and tap Save there. Terra never reads your calendar.': 'Google-kalenteri avautuu valmiiksi täytetyn päivittäisen tapahtuman kanssa. Tarkista se ja tallenna siellä. Terra ei koskaan lue kalenteriasi.',
  'Apple Calendar': 'Apple-kalenteri', 'Arrives with the iPhone app, together with automatic two-way sync and a shared calendar with a partner.': 'Tulee iPhone-sovelluksen mukana yhdessä automaattisen kaksisuuntaisen synkan ja kumppanin kanssa jaetun kalenterin kanssa.',
  // illustrations
  'A woman with long flowing purple hair sitting and hugging her knees, face lifted': 'Nainen, jolla on pitkät violetit hiukset, istuu ja halaa polviaan kasvot kohotettuina',
  'A woman sitting and leaning back on her hands, face lifted to the sky, hair flowing in the wind': 'Nainen istuu nojaten käsiinsä, kasvot taivasta kohti ja hiukset tuulessa',
  'A woman sitting on the ground with her legs stretched out and knees softly bent, chin resting on her hand, eyes closed, dreaming': 'Nainen istuu maassa jalat ojennettuina, leuka käden varassa, silmät kiinni haaveillen',
  'A smiling woman with long purple hair sitting on the ground with her legs stretched out, waving hello': 'Hymyilevä nainen istuu maassa jalat ojennettuina ja vilkuttaa',
  'A joyful woman jumping with both arms raised and her hair flying': 'Iloinen nainen hyppää kädet ylhäällä hiukset hulmuten',
  'A woman lying on the grass, eyes closed and resting, hair spread out behind her': 'Nainen makaa nurmella silmät kiinni lepäämässä',
  'A smiling woman with long purple hair standing and waving hello': 'Hymyilevä nainen seisoo ja vilkuttaa',
  'A eucalyptus sprig swaying gently while soft breath drifts past': 'Eukalyptuksen oksa keinuu hiljaa, ja pehmeä henkäys kulkee ohi',
  'A softly ringing bell with small leaves': 'Hiljaa kilisevä kello ja pieniä lehtiä',
  // prompts sent to Terra AI from buttons
  'Help me create a calm, simple morning routine.': 'Auta minua luomaan rauhallinen ja yksinkertainen aamurutiini.',
  'Add a reminder to drink water every morning at 10.': 'Lisää muistutus juoda vettä joka aamu klo 10.',
  'I feel overwhelmed right now. Help me calm down.': 'Minulla on juuri nyt liikaa kaikkea. Auta minua rauhoittumaan.',
  'Help me create a new routine that fits my day.': 'Auta minua luomaan uusi rutiini, joka sopii päivääni.',
  // misc
  'Free': 'Free', 'Pro': 'Pro', 'Ultimate': 'Ultimate', 'Terra': 'Terra', 'Yes': 'Kyllä', 'No': 'Ei',
  'Your Ultimate trial has ended. You’re back on Free.': 'Ultimate-kokeilusi päättyi. Olet taas Free-tasolla.',
};

const FI_RX = [
  [/^Edit (.+)$/, (m, a) => `Muokkaa: ${tr(a)}`],
  [/^Rings at (\d{2}:\d{2}), when your morning steps begin\. Change it by retaking your answers\.$/, (m, a) => `Soi klo ${a}, kun aamun askeleet alkavat. Voit muuttaa sitä vastaamalla kysymyksiin uudelleen.`],
  [/^(\d{2}:\d{2}) · (.+)$/, (m, a, b) => `${a} · ${tr(b)}`],
  [/^Your first routine starts at (\d{2}:\d{2})\. A small twist switches it off, so you really get up\.$/, (m, a) => `Ensimmäinen rutiini alkaa klo ${a}. Pieni twisti sammuttaa herätyksen, joten nouset oikeasti ylös.`],
  [/^Set alarm for (\d{2}:\d{2})$/, (m, a) => `Laita herätys klo ${a}`],
  [/^Is “(.+)” feeling like a lot\?$/, (m, a) => `Tuntuuko ”${tr(a)}” raskaalta?`],
  [/^Lately you've done about (\d+) of (\d+) steps on most days\. That's okay\. Smaller often sticks better\.$/, (m, a, b) => `Viime päivinä olet tehnyt useimpina päivinä noin ${a}/${b} askelta. Se on ihan ok. Pienempi pysyy usein paremmin.`],
  [/^Stress load (\d+) of 100$/, (m, a) => `Kuormitus ${a}/100`],
  [/^(\d+) of (\d+)$/, (m, a, b) => `${a}/${b}`],
  [/^Show (\d+) more$/, (m, a) => `Näytä ${a} lisää`],
  [/^(\d+)\/(\d+) today$/, (m, a, b) => `${a}/${b} tänään`],
  [/^(\d+) check-ins$/, (m, a) => `${a} kirjausta`],
  [/^(\d+)-day rhythm\. Nice pace\.$/, (m, a) => `${a} päivän rytmi. Hyvä tahti.`],
  [/^(\d+) in total$/, (m, a) => `yhteensä ${a}`],
  [/^(\d+) days ago$/, (m, a) => `${a} päivää sitten`],
  [/^(\d+) of (\d+) routines on Free$/, (m, a, b) => `${a}/${b} rutiinia Free-tasolla`],
  [/^(\d+) to (\S+)$/, (m, a, b) => `${a} seuraavaan: ${tr(b)}`],
  [/^(\d+) XP to (\S+)$/, (m, a, b) => `${a} XP seuraavaan: ${tr(b)}`],
  [/^· (\d+) XP to (\S+)$/, (m, a, b) => `· ${a} XP seuraavaan: ${tr(b)}`],
  [/^(\d+) XP to (\S+) · (.+)$/, (m, a, b) => `${a} XP tasoon ${tr(b)}`],
  [/^top rank$/, () => 'ylin taso'],
  [/^· You reached the top\. Keep your rhythm\.$/, () => '· Olet huipulla. Pidä rytmisi.'],
  [/^(\d+) days? left, ends (.+)\. Then (.+)\/month unless you cancel\.$/, (m, a, d, p) => `${a} päivää jäljellä, päättyy ${d}. Sen jälkeen ${p}/kk, ellet peru.`],
  [/^About (\d+) min · (.+)$/, (m, a, b) => `Noin ${a} min · ${tr(b)}`],
  [/^Added reminder: (.+) at (.+)$/, (m, a, b) => `Muistutus lisätty: ${tr(a)} klo ${b}`],
  [/^Added routine: (.+) \((\d+) steps\)$/, (m, a, b) => `Rutiini lisätty: ${tr(a)} (${b} askelta)`],
  [/^Logged workout: (.+), (\d+) min$/, (m, a, b) => `Treeni kirjattu: ${tr(a)}, ${b} min`],
  [/^Avg cycle (\d+) days$/, (m, a) => `Keskim. kierto ${a} pv`],
  [/^Collecting\. (\d+) of about (\d+) days with a check-in so far\. Patterns appear after a few weeks\.$/, (m, a, b) => `Kerätään. ${a}/${b} päivää kirjauksineen tähän mennessä. Kuviot näkyvät muutaman viikon jälkeen.`],
  [/^Daily average (.+?) · (.+)$/, (m, a, b) => `Keskimäärin ${a} päivässä · ${tr(b)}`],
  [/^(\d+)% less than the week before$/, (m, a) => `${a} % vähemmän kuin edellisellä viikolla`],
  [/^(\d+)% more than the week before$/, (m, a) => `${a} % enemmän kuin edellisellä viikolla`],
  [/^Day starts (.+)$/, (m, a) => `Päivä alkaa ${tr(a).replace(/^Klo /, 'klo ').replace(/^Ennen /, 'ennen ')}`],
  [/^(.+) energy$/, (m, a) => `Energiaa: ${tr(a).toLowerCase()}`],
  [/^(.+) · step (\d+) of (\d+)$/, (m, a, b, c) => `${tr(a)} · askel ${b}/${c}`],
  [/^(.+) · every day at (.+)$/, (m, a, b) => `${tr(a)} · joka päivä klo ${b}`],
  [/^Free for (\d+) days, then (.+)\/month$/, (m, a, b) => `${a} päivää ilmaiseksi, sitten ${b}/kk`],
  [/^Free for (\d+) days, then (.+)\/year$/, (m, a, b) => `${a} päivää ilmaiseksi, sitten ${b}/v`],
  [/^Ultimate is free for (\d+) days, then (.+)\/(month|year)\. Cancel anytime before the trial ends and you won't be charged\.$/, (m, a, b, c) => `Ultimate on ilmainen ${a} päivää, sen jälkeen ${b}/${c === 'month' ? 'kk' : 'v'}. Peru milloin tahansa ennen kokeilun loppua, niin sinua ei veloiteta.`],
  [/^Ultimate trial active · (\d+) days left$/, (m, a) => `Ultimate-kokeilu käynnissä · ${a} päivää jäljellä`],
  [/^Trial · (\d+) days left$/, (m, a) => `Kokeilu · ${a} päivää jäljellä`],
  [/^Mark (.+) done$/, (m, a) => `Merkitse tehdyksi: ${tr(a)}`],
  [/^Or (.+)\/year and save (\d+)%$/, (m, a, b) => `Tai ${a}/v ja säästä ${b} %`],
  [/^Ovulation window around (.+) to (.+)$/, (m, a, b) => `Ovulaatioikkuna noin ${a}–${b}`],
  [/^Pro from (.+)\/month · Ultimate from (.+)\/month, billed yearly$/, (m, a, b) => `Pro alk. ${a}/kk · Ultimate alk. ${b}/kk vuosilaskutuksella`],
  [/^Question (\d+) of (\d+)$/, (m, a, b) => `Kysymys ${a}/${b}`],
  [/^Rank stairs: you are on step (\d+) of (\d+), (.+)$/, (m, a, b, c) => `Tasoportaat: olet portaalla ${a}/${b}, ${tr(c)}`],
  [/^Routine: (.+)$/, (m, a) => `Rutiini: ${tr(a)}`],
  [/^Same as last time · (.+), (\d+) min$/, (m, a, b) => `Sama kuin viimeksi · ${tr(a)}, ${b} min`],
  [/^Save (\d+)%$/, (m, a) => `Säästä ${a} %`],
  [/^Save up to (\d+)%$/, (m, a) => `Säästä jopa ${a} %`],
  [/^(.+)\/month ·$/, (m, a) => `${a}/kk ·`],
  [/^(.+)\/month$/, (m, a) => `${a}/kk`],
  [/^(.+)\/year$/, (m, a) => `${a}/v`],
  [/^Your period is (\d+) days? later than estimated\. Cycles vary, and that's often normal\.$/, (m, a) => `Kuukautisesi ovat ${a} päivää arvioitua myöhässä. Kierrot vaihtelevat, ja se on usein normaalia.`],
  [/^(\d+) workouts? this week\. Your body says thanks\.$/, (m, a) => `${a} treeniä tällä viikolla. Kehosi kiittää.`],
  [/^(\d+) calm minutes? for you\. That counts toward your rhythm\.$/, (m, a) => `${a} rauhallista minuuttia sinulle. Se lasketaan rytmiisi.`],
  [/^Everything is open for (\d+) days\. After that it's (.+)\/month, and you can cancel anytime before\.$/, (m, a, b) => `Kaikki on auki ${a} päivää. Sen jälkeen ${b}/kk, ja voit perua milloin tahansa ennen sitä.`],
  [/^You're now (\S+) (\S+)$/, (m, a, b) => `Olet nyt ${tr(a)} ${b}`],
  [/^(\d+) XP, all from small steps\. Every one of them counted\.$/, (m, a) => `${a} XP, kaikki pienistä askelista. Jokainen niistä laski.`],
  [/^(Free|Pro|Ultimate) unlocked$/, (m, a) => `${a} avattu`],
  [/^(Free|Pro|Ultimate) is unlocked\.$/, (m, a) => `${a} on avattu.`],
  [/^Continue with (Pro|Ultimate)$/, (m, a) => `Jatka ${a}-tasolla`],
  [/^(\S+) (.+) logged · \+(\d+) XP$/, (m, e, a, b) => `${e} ${tr(a)} kirjattu · +${b} XP`],
  [/^Okay\. A gentle nudge after (\d+) minutes\.$/, (m, a) => `Selvä. Lempeä muistutus ${a} minuutin jälkeen.`],
  [/^After your last (\d+) Moments you mostly felt calm, happy or energized\. A short breath could be your reset button\.$/, (m, a) => `Viimeisten ${a} hetken jälkeen olit useimmiten rauhallinen, iloinen tai energinen. Lyhyt hengitys voisi olla sinun nollausnappisi.`],
  [/^of (\d+) workouts$/, (m, a) => `/ ${a} treenistä`],
  [/^(.+) workouts$/, (m, a) => `${a}: treenit`],
  [/^(.+) done$/, (m, a) => `${tr(a)} tehty`],
  [/^(.+) added$/, (m, a) => `${tr(a)} lisätty`],
  [/^(\d+) h (\d+) min$/, (m, a, b) => `${a} h ${b} min`],
  [/^Okay\. Terra will/, m => m],
];

const _rev = new Set(Object.values(FI));
function tr(str) {
  if (LANG !== 'fi' || str == null) return str;
  const s = String(str); const t = s.trim(); if (!t) return s;
  const lead = s.slice(0, s.indexOf(t)), trail = s.slice(s.indexOf(t) + t.length);
  const out = tr1(t);
  return out === t ? s : lead + out + trail;
}
function tr1(t) {
  if (Object.prototype.hasOwnProperty.call(FI, t)) return FI[t];
  if (_rev.has(t)) return t;
  for (const [rx, fn] of FI_RX) { const m = t.match(rx); if (m) return fn(...m); }
  if (t.includes(' · ')) { const parts = t.split(' · '); const tp = parts.map(p => tr1(p)); if (tp.some((p, i) => p !== parts[i])) return tp.join(' · '); }
  const em = t.match(/^(\p{Extended_Pictographic}[️‍\p{Extended_Pictographic}]*)\s+(.+)$/u);
  if (em) { const r = tr1(em[2]); if (r !== em[2]) return `${em[1]} ${r}`; }
  const lp = t.match(/^(.+?)(\s*[…:])$/); if (lp && FI[lp[1]]) return FI[lp[1]] + lp[2];
  return t;
}
const SKIP_TR = '.msg:not(.added), script, style, input, textarea, [data-notr]';
function trTree(root) {
  if (LANG !== 'fi' || !root) return;
  if (root.nodeType === 3) { trText(root); return; }
  if (root.nodeType !== 1) return;
  if (root.closest && root.closest(SKIP_TR) && !root.closest('.added') && !root.matches('input,textarea')) return;
  trAttrs(root);
  root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(trAttrs);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) trText(n);
}
function trText(n) { const p = n.parentElement; if (!p || (p.closest(SKIP_TR) && !p.closest('.added'))) return; const v = n.nodeValue; if (!v || !v.trim()) return; const o = tr(v); if (o !== v) n.nodeValue = o; }
function trAttrs(el) { if (el.closest && el.closest('.msg')) return; for (const a of ['placeholder', 'aria-label', 'title']) { const v = el.getAttribute?.(a); if (v) { const o = tr(v); if (o !== v) el.setAttribute(a, o); } } }
const TR_OBS = new MutationObserver(muts => {
  if (LANG !== 'fi') return;
  for (const m of muts) {
    if (m.type === 'characterData') trText(m.target);
    else if (m.type === 'attributes') trAttrs(m.target);
    else m.addedNodes.forEach(trTree);
  }
});
function startTranslator() { TR_OBS.disconnect(); if (LANG === 'fi') { trTree(document.body); TR_OBS.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'aria-label', 'title'] }); } document.documentElement.lang = LANG; }
function setLang(l) {
  if (!LANGS[l]) return; LANG = l; try { localStorage.setItem('terra.lang', l); } catch (e) {}
  if (typeof S !== 'undefined') { S.settings.lang = l; save(); }
  startTranslator(); render(); if ($('#paywall')) renderPaywall(); if (TR) tourShow();
}
document.addEventListener('click', e => { const b = e.target.closest('[data-act=lang]'); if (b) setLang(b.dataset.k); });
function langSwitch(cls = '') { return `<div class="seg lang-seg ${cls}" role="group" aria-label="${LANG === 'fi' ? 'Kieli' : 'Language'}" data-notr>${Object.entries(LANGS).map(([k, l]) => `<button type="button" data-act="lang" data-k="${k}" class="${LANG === k ? 'on' : ''}" aria-pressed="${LANG === k}">${l}</button>`).join('')}</div>`; }
/* Your world + seasons */
Object.assign(FI, {
  'Dark season: a smaller day is enough': 'Pimeä kausi: pienempikin päivä riittää',
  'Your world': 'Sinun maailmasi',
  'Every small step you finish grows something here, and the path climbs a little further.': 'Jokainen tekemäsi pieni askel kasvattaa tänne jotain, ja polku nousee vähän pidemmälle.',
  'small steps': 'pientä askelta',
  'things growing': 'kasvaa maailmassasi',
  'One more step and something new grows.': 'Vielä yksi askel, niin jotain uutta kasvaa.',
  'Your world is in full bloom.': 'Maailmasi on täydessä kukassa.',
  'Nothing ever wilts. A missed day is just a quiet day.': 'Mikään ei koskaan kuihdu. Väliin jäänyt päivä on vain hiljainen päivä.',
  'Autumn: The hills turn to autumn colours and leaves drift down.': 'Syksy: kukkulat saavat ruskan värit ja lehdet leijailevat alas.',
  'Winter: Snow settles on the hills and the trees.': 'Talvi: lumi peittää kukkulat ja puut.',
  'Spring: Blossoms open and petals float by.': 'Kevät: kukat aukeavat ja terälehdet leijailevat.',
  'Summer: Everything is green and the light stays long.': 'Kesä: kaikki on vihreää ja valoa riittää myöhään.',
  "It's the dark season. Less light means less energy for many people, so a smaller day is enough. Even one step counts.": 'Nyt on pimeä kausi. Monella vähempi valo tarkoittaa vähemmän energiaa, joten pienempikin päivä riittää. Yksikin askel on tärkeä.',
});
FI_RX.push(
  [/^(\d+) more steps and something new grows\.$/, (m, a) => `Vielä ${a} askelta, niin jotain uutta kasvaa.`],
  [/^Your world: (\d+) small steps have grown it$/, (m, a) => `Sinun maailmasi: ${a} pientä askelta on kasvattanut sitä`],
);
Object.assign(FI, { 'Delete reminder': 'Poista muistutus' });

/* Onboarding: the person's own words */
Object.assign(FI, { 'Something else, in your own words (optional)': 'Jotain muuta, omin sanoin (valinnainen)', 'E.g. I forget to take my meds': 'Esim. unohdan ottaa lääkkeeni' });

Object.assign(FI, { 'Mindfulness': 'Mindfulness', 'A one-minute breath, whenever you need it': 'Yksi minuutin hengitys, kun sitä tarvitset', 'Pause for a breath or two.': 'Pysähdy hengittämään hetkeksi.', 'Back to Today': 'Takaisin tähän päivään', 'Rest': 'Lepo', 'Routines': 'Rutiinit' });

Object.assign(FI, { 'A few small steps, each tied to something you already do.': 'Muutama pieni askel, jokainen kiinni jossain, minkä teet jo.' });

Object.assign(FI, { 'They arrive as notifications, even when Terra is closed.': 'Ne tulevat ilmoituksina, vaikka Terra olisi kiinni.', 'Tap the time to change it': 'Napauta aikaa, jos haluat vaihtaa sen' });

Object.assign(FI, { 'They arrive as notifications, even when Terra is closed. Tap a time to change it.': 'Ne tulevat ilmoituksina, vaikka Terra olisi kiinni. Napauta aikaa vaihtaaksesi sen.' });

Object.assign(FI, { 'No morning routine yet.': 'Ei vielä aamurutiinia.', 'No daytime routine yet.': 'Ei vielä päivärutiinia.', 'No evening routine yet.': 'Ei vielä iltarutiinia.' });

Object.assign(FI, { 'Move': 'Liike', 'Log what you did. Every bit of movement counts.': 'Kirjaa mitä teit. Jokainen liike lasketaan.' });

Object.assign(FI, { 'Start from an idea, or write your own below': 'Aloita ideasta tai kirjoita omasi alle', 'Steps': 'Askeleet', 'Write each step as one clear thing to do.': 'Yksi selkeä tekeminen per askel.', 'E.g. Drink a glass of water': 'Esim. juo lasi vettä', 'Add at least one step.': 'Lisää vähintään yksi askel.', 'No steps yet. Add the first one below.': 'Ei vielä askeleita. Lisää ensimmäinen alle.', 'Up to 10 steps': 'Enintään 10 askelta', 'Cancel': 'Peruuta', 'Save changes': 'Tallenna muutokset', 'Save routine': 'Tallenna rutiini', 'Edit routine': 'Muokkaa rutiinia', 'Move step up': 'Siirrä askel ylös' });

Object.assign(FI, { 'Set your alarms in the iPhone Clock app. They ring reliably, even in silent mode.': 'Aseta herätykset iPhonen Kello-appiin. Ne soivat varmasti, myös äänettömällä.', '⏰ Open the Clock app': '⏰ Avaa Kello-appi' });

Object.assign(FI, { 'What Terra noticed in your answers': 'Mitä Terra huomasi vastauksistasi' });
Object.assign(FI, { 'Get dressed and leave the bedroom': 'Pukeudu ja lähde makuuhuoneesta', 'Eat something before checking your phone': 'Syö jotain ennen kuin katsot puhelinta', "Choose today's one most important task": 'Valitse päivän yksi tärkein tehtävä', "Write the day's plan on a sticky note": 'Kirjoita päivän suunnitelma muistilapulle', 'Lighter load': 'Kevyempi kuorma', 'Write down what is weighing on you': 'Kirjoita ylös, mikä painaa mieltä', 'Pick the one task that matters most': 'Valitse yksi tärkein tehtävä', 'Postpone or drop one small task': 'Siirrä tai jätä pois yksi pieni tehtävä', 'Step outside for five minutes': 'Käy ulkona viisi minuuttia' });

Object.assign(FI, { 'Take your medicine': 'Ota lääkkeesi' });

Object.assign(FI, { 'What kind of training suits you?': 'Millainen treeni sopii sinulle?', 'How often?': 'Kuinka usein?', 'When does it fit best?': 'Milloin se sopii parhaiten?', 'Walking': 'Kävely', 'Gym': 'Kuntosali', 'Running': 'Juoksu', 'Home workouts': 'Kotitreenit', 'Sports or classes': 'Laji tai ryhmäliikunta', 'Yoga or stretching': 'Jooga tai venyttely', '1–2 times a week': '1–2 kertaa viikossa', '3 times a week': '3 kertaa viikossa', '4 or more times a week': '4 kertaa tai useammin', 'Morning': 'Aamu', 'After work or school': 'Töiden tai koulun jälkeen', 'Evening': 'Ilta', "Let's fit training into your week": 'Sovitetaan treeni viikkoosi', 'Terra builds your workout routine and weekly goal from these.': 'Terra rakentaa näistä treenirutiinisi ja viikkotavoitteesi.', 'Workout time': 'Treeniaika', 'After breakfast': 'Aamiaisen jälkeen', 'When I get home': 'Kun tulen kotiin', 'After dinner': 'Päivällisen jälkeen', 'Time to train': 'Treenin aika', 'Put on your shoes': 'Laita kengät jalkaan', 'Walk briskly for 20 minutes': 'Kävele reippaasti 20 minuuttia', 'Log it in Workouts': 'Kirjaa se Treeneihin', 'Pack your gym bag': 'Pakkaa salikassi', 'Go to the gym': 'Mene salille', 'Do your planned workout': 'Tee suunniteltu treenisi', 'Put on your running clothes': 'Pue juoksuvaatteet', 'Warm up with a 5-minute walk': 'Lämmittele 5 minuutin kävelyllä', 'Run for 20 minutes': 'Juokse 20 minuuttia', 'Lay out your mat': 'Levitä matto', 'Do a 15-minute home workout': 'Tee 15 minuutin kotitreeni', 'Check the time of your next session': 'Tarkista seuraavan treenin aika', 'Pack your things': 'Pakkaa tavarasi', 'Go to your session': 'Mene treeneihin', 'Do 15 minutes of yoga or stretching': 'Tee 15 minuuttia joogaa tai venyttelyä' });

Object.assign(FI, { 'Daily walk': 'Päivän kävely', 'Walk for 20 minutes': 'Kävele 20 minuuttia', 'Fitness workout': 'Kuntotreeni', 'Do 30 minutes of cardio': 'Tee 30 minuuttia kestävyysliikuntaa', 'Strength training': 'Voimatreeni', 'Change into training clothes': 'Vaihda treenivaatteet', 'Do a 30-minute strength workout': 'Tee 30 minuutin voimatreeni', 'Eat a meal with protein': 'Syö proteiinipitoinen ateria' });

Object.assign(FI, { "Today's rhythm": 'Päivän rytmi', 'Until 11:00': 'klo 11 asti', '11:00–17:00': 'klo 11–17', 'From 17:00': 'klo 17 alkaen', 'Now': 'Nyt', 'Add a morning routine': 'Lisää aamurutiini', 'Add a daytime routine': 'Lisää päivärutiini', 'Add an evening routine': 'Lisää iltarutiini', 'Tell Terra your goal and it makes the routine for you.': 'Kerro tavoitteesi, niin Terra tekee rutiinin puolestasi.' });

Object.assign(FI, { 'Pick what you enjoy, or what you would like to try.': 'Valitse mistä pidät tai mitä haluaisit kokeilla.', 'How often do you want to train?': 'Kuinka usein haluat treenata?', 'Terra sets your weekly goal from this. Start with what feels doable.': 'Terra asettaa tästä viikkotavoitteesi. Aloita siitä, mikä tuntuu mahdolliselta.', 'When does training fit your day best?': 'Mihin kohtaan päivää treeni sopii parhaiten?', 'Your workout routine and its reminder go there.': 'Treenirutiini ja sen muistutus tulevat siihen.' });

Object.assign(FI, { 'Pick up to three, or write your own below.': 'Valitse enintään kolme tai kirjoita oma alle.' });

Object.assign(FI, { 'E.g. I want more muscle': 'Esim. haluan enemmän lihasmassaa' });

Object.assign(FI, { 'Morning routine': 'Aamurutiini', 'Daytime routine': 'Päivärutiini', 'Evening routine': 'Iltarutiini', "Start the day's most important task": 'Aloita päivän tärkein tehtävä', 'Take a short break away from the screen': 'Pidä lyhyt tauko ruudun ääreltä', 'Lay out what you need for tomorrow': 'Laita huomisen tavarat valmiiksi' });

Object.assign(FI, { 'Reminder': 'Muistutus', 'No reminder': 'Ei muistutusta', 'Terra reminds you when it is time for this routine.': 'Terra muistuttaa, kun on tämän rutiinin aika.' });

Object.assign(FI, { 'Or set the exact time': 'Tai valitse tarkka kesto' });

Object.assign(FI, { 'Weight': 'Paino', 'Biceps': 'Hauis', 'Chest': 'Rinta', 'Waist': 'Vyötärö', 'Body fat': 'Rasva', 'Body': 'Keho', 'Track your measurements': 'Seuraa mittojasi', 'Weight, biceps, waist, chest and body fat. Your figure grows with your results, drawn over your starting point.': 'Paino, hauis, vyötärö, rinta ja rasvaprosentti. Hahmosi kasvaa tulostesi mukaan, lähtötilanteesi päälle piirrettynä.', 'Add your starting point': 'Lisää lähtötilanne', 'Your progress': 'Kehityksesi', 'Now': 'Nyt', 'Starting point': 'Lähtötilanne', 'Add new measurements in a week or two and watch the figure change.': 'Lisää uudet mitat viikon tai kahden päästä ja katso, miten hahmo muuttuu.', 'Add one more measurement to see your line.': 'Lisää vielä yksi mittaus, niin näet käyrän.', 'No measurements yet.': 'Ei vielä mittauksia.', 'Add measurements': 'Lisää mitat', 'Fill in what you measured. Everything is optional.': 'Täytä mitä mittasit. Kaikki on vapaaehtoista.', 'Add at least one measurement.': 'Lisää vähintään yksi mitta.', 'Save': 'Tallenna', 'Measurement deleted': 'Mittaus poistettu', 'Measurements saved. Look at that figure!': 'Mitat tallennettu. Katso hahmoasi!', 'Starting point saved': 'Lähtötilanne tallennettu', 'Delete measurement': 'Poista mittaus', 'Your body now, drawn over your starting point': 'Kehosi nyt, lähtötilanteen päälle piirrettynä', 'Your starting point': 'Lähtötilanteesi' });

Object.assign(FI, { 'Rings every day at': 'Soi joka päivä klo', 'Terra wakes you up and shows your first step.': 'Terra herättää sinut ja näyttää ensimmäisen askeleesi.', 'Time': 'Aika', 'More alarms in the Clock app': 'Lisää herätyksiä Kello-appiin', "I'm up": 'Olen hereillä', 'Good morning. Your first step is waiting.': 'Hyvää huomenta. Ensimmäinen askeleesi odottaa.', 'Switch it off with': 'Sammuta tekemällä', 'It rings again every minute until you do the task in Terra.': 'Herätys soi uudelleen minuutin välein, kunnes teet tehtävän Terrassa.', 'Good morning. Open Terra and do the task.': 'Hyvää huomenta. Avaa Terra ja tee tehtävä.', 'Did you just wake up?': 'Heräsitkö juuri?', 'I can fit today’s routines to when you got up.': 'Voin sovittaa tämän päivän rutiinit siihen, milloin heräsit.', 'Yes, just now': 'Kyllä, juuri heräsin', 'No, I’ve been up a while': 'En, olen ollut hereillä jo hetken', 'Right on time! Today stays as planned.': 'Juuri ajallaan! Päivä menee suunnitellusti.', 'Morning moved': 'Aamua siirretty', 'Evening stays the same.': 'Ilta pysyy ennallaan.', 'Back to your usual times.': 'Palattu tavallisiin aikoihin.', 'Why are you starting?': 'Miksi aloitat?', 'Write it in your own words. Terra reminds you of it on the days when it feels hard.': 'Kirjoita omin sanoin. Terra muistuttaa siitä päivinä, kun tuntuu raskaalta.', 'E.g. I want my days to stop falling apart': 'Esim. Haluan, ettei arki kaadu päälle', 'Skip for now': 'Ohita nyt', 'I want to have more energy': 'Haluan jaksaa paremmin', 'I want my days to stop falling apart': 'Haluan, ettei arki kaadu päälle', 'I want to feel good in my body': 'Haluan voida hyvin kehossani', 'I want to be there for the people I love': 'Haluan olla läsnä läheisilleni', 'Why did you start?': 'Miksi aloitit?', 'Write it down. Terra reminds you on hard days.': 'Kirjoita se ylös. Terra muistuttaa raskaina päivinä.', 'Why I started': 'Miksi aloitin', 'Remember why you started': 'Muista miksi aloitit', 'Saved. Terra will remind you.': 'Tallennettu. Terra muistuttaa sinua.', 'Removed.': 'Poistettu.', 'Hide': 'Piilota', 'Today at': 'Tänään klo' });

Object.assign(FI, { 'Set': 'Aseta' });

/* Alarm v2 and the new personalization */
Object.assign(FI, {
  'Maths': 'Laskut', 'Spelling': 'Oikeinkirjoitus', 'Puzzle': 'Pulma', 'Photo of an object': 'Kuva esineestä',
  'Super easy': 'Tosi helppo', 'Easy': 'Helppo', 'Normal': 'Normaali', 'Hard': 'Vaikea',
  'Night': 'Yö', 'Dawn': 'Aamunkoi', 'Sky': 'Taivas', 'Sand': 'Hiekka', 'Forest': 'Metsä', 'Coral': 'Koralli',
  'That picture is too big to keep. Try another one.': 'Kuva on liian iso tallennettavaksi. Kokeile toista.',
  'To switch it off': 'Sammutus', 'awake check after': 'hereilläolon tarkistus', 'Your alarm': 'Herätyksesi',
  'It keeps ringing until the tasks are done. Each question has 30 seconds.': 'Herätys soi, kunnes tehtävät on tehty. Jokaiseen kysymykseen on 30 sekuntia.',
  'Off': 'Pois', 'On': 'Päällä', 'Tasks to switch it off': 'Tehtävät sammuttamiseen', 'Maths level': 'Laskujen taso',
  'Your object': 'Esineesi', 'Pick an object far from your bed': 'Valitse esine kaukana sängystä',
  'Every morning you take a photo of it to switch the alarm off. The coffee machine works well.': 'Joka aamu otat siitä kuvan sammuttaaksesi herätyksen. Kahvinkeitin toimii hyvin.',
  'Change photo': 'Vaihda kuva', 'Take a photo': 'Ota kuva', 'Am I really awake?': 'Olenko oikeasti hereillä?',
  'After the tasks, Terra waits this long and then asks you to type a short phrase. If you don’t, the alarm rings again.': 'Tehtävien jälkeen Terra odottaa tämän ajan ja pyytää sitten kirjoittamaan lyhyen lauseen. Jos et kirjoita, herätys soi uudelleen.',
  'Look': 'Ulkoasu', 'Your photo': 'Oma kuva', 'Text': 'Teksti', 'White': 'Valkoinen', 'Black': 'Musta', 'Done': 'Valmis',
  "I'm up and I'm full of energy": 'Olen hereillä ja täynnä energiaa',
  'Type this to confirm': 'Kirjoita tämä vahvistaaksesi', 'Confirm': 'Vahvista', 'If the time runs out, the alarm rings again.': 'Jos aika loppuu, herätys soi uudelleen.',
  'Solve it': 'Ratkaise', 'Your answer': 'Vastauksesi', 'Check': 'Tarkista', 'Spell this word': 'Kirjoita tämä sana', 'Tap 1 to 6 in order': 'Napauta 1–6 järjestyksessä',
  'Take a photo of your object': 'Ota kuva esineestäsi', 'Walk to it and take a photo from about the same angle.': 'Kävele sen luo ja ota kuva suunnilleen samasta kulmasta.',
  'It doesn’t recognise it. Give me 3 sums instead': 'Se ei tunnista kuvaa. Anna mieluummin 3 laskua', 'End the test': 'Lopeta testi',
  'Nice. Next one.': 'Hienoa. Seuraava.', 'Yes! Keep going.': 'Kyllä! Jatka.', 'Time ran out. This one starts again.': 'Aika loppui. Tämä alkaa alusta.',
  'Time ran out. One back.': 'Aika loppui. Yksi takaisin.', 'Time ran out. Here’s a new one.': 'Aika loppui. Tässä uusi.',
  'Nice! Awake check in': 'Hienoa! Hereilläolon tarkistus', 'First step:': 'Ensimmäinen askel:',
  'That’s how it works. The real one rings at': 'Näin se toimii. Oikea herätys soi klo', 'You’re up! Morning moved': 'Olet hereillä! Aamua siirretty',
  'You’re up! Have a good morning.': 'Olet hereillä! Hyvää aamua.',
  'Time ran out. In the real one, the alarm would ring again now.': 'Aika loppui. Oikeassa herätyksessä herätys soisi nyt uudelleen.',
  'No answer, so the alarm rings again.': 'Ei vastausta, joten herätys soi uudelleen.', 'You didn’t confirm, so the alarm rings again.': 'Et vahvistanut, joten herätys soi uudelleen.',
  'Awake check in': 'Tarkistus', 'Not quite. Try again.': 'Ei ihan. Yritä uudelleen.', 'Almost. Type it exactly as shown.': 'Melkein. Kirjoita täsmälleen niin kuin näkyy.',
  'Got it. That’s your morning object.': 'Selvä. Tuo on aamuesineesi.', 'That’s it! Found it.': 'Juuri se! Löytyi.',
  'That doesn’t look like your object. Try again from the same angle.': 'Tuo ei näytä esineeltäsi. Kokeile uudelleen samasta kulmasta.',
  'That picture couldn’t be opened. Try another one.': 'Kuvaa ei voitu avata. Kokeile toista.', 'First take a photo of your object.': 'Ota ensin kuva esineestäsi.',
  'Wrong order. From 1 again.': 'Väärä järjestys. Taas ykkösestä.', 'Okay, three sums instead.': 'Selvä, kolme laskua sen sijaan.', 'Try it now': 'Kokeile nyt',
  'When does your work or school day start?': 'Milloin työ- tai koulupäiväsi alkaa?', 'Terra keeps mornings short enough to fit before it.': 'Terra pitää aamut niin lyhyinä, että ne mahtuvat ennen sitä.',
  'Before 08:00': 'Ennen klo 8', '08:00 to 09:00': 'Klo 8–9', '09:00 to 10:00': 'Klo 9–10', 'Later, or it varies': 'Myöhemmin tai vaihtelee', 'I don’t work or study right now': 'En tällä hetkellä työskentele tai opiskele',
  'What do you already do every day?': 'Mitä teet jo joka päivä?', 'New steps go right after these, so you don’t have to remember them. Pick up to three.': 'Uudet askeleet tulevat näiden perään, joten niitä ei tarvitse muistaa. Valitse enintään kolme.',
  'Morning coffee or tea': 'Aamukahvi tai -tee', 'Breakfast': 'Aamupala', 'A shower': 'Suihku', 'Brushing my teeth': 'Hampaiden pesu', 'The commute': 'Työmatka', 'Lunch': 'Lounas', 'Dinner': 'Päivällinen',
  'After my morning coffee': 'Aamukahvin jälkeen', 'After breakfast': 'Aamupalan jälkeen', 'After my shower': 'Suihkun jälkeen', 'When I get to work or school': 'Kun pääsen töihin tai kouluun',
  'How not to do it': 'Näin ei kannata', 'Meet Mia. She answered in 9 seconds.': 'Tässä Mia. Hän vastasi 9 sekunnissa.', 'Skip': 'Ohita',
  '🏃 Time for your 45-minute morning run!': '🏃 Aika 45 minuutin aamulenkille!', 'Still time for that run? Go go go!': 'Ehditkö vielä lenkille? Vauhtia!',
  'Doesn’t fit my day': 'Ei sovi päivääni', 'At 07:50 Mia is already at her desk. The plan never had a chance, because Terra never learned her day.': 'Klo 7.50 Mia istuu jo työpöytänsä ääressä. Suunnitelmalla ei ollut mahdollisuutta, koska Terra ei koskaan oppinut hänen päiväänsä.',
  'Show me the good way': 'Näytä hyvä tapa', 'How to do it': 'Näin se onnistuu', 'Same Mia. This time, three calm minutes.': 'Sama Mia. Tällä kertaa kolme rauhallista minuuttia.',
  'She told Terra work starts at 08:00, she always has coffee at 07:15, and walks help her focus.': 'Hän kertoi Terralle, että työ alkaa klo 8, hän juo aina kahvia klo 7.15 ja kävely auttaa häntä keskittymään.',
  '☕ After your coffee: a glass of water and a 2-minute stretch': '☕ Kahvin jälkeen: lasi vettä ja 2 minuutin venyttely', '🚶 You said walking helps you focus. 10 minutes outside?': '🚶 Sanoit, että kävely auttaa keskittymään. 10 minuuttia ulkona?',
  'Fits my day ✓': 'Sopii päivääni ✓', 'That’s why Terra asks a few more questions. It takes about three minutes, and the plan is only as good as your answers.': 'Siksi Terra kysyy vähän enemmän. Siihen menee noin kolme minuuttia, ja suunnitelma on vain niin hyvä kuin vastauksesi.',
  'Let’s do it properly': 'Tehdään se kunnolla',
  'Speed run? 🏃 Remember Mia and her 06:30 run alarm at her desk.': 'Pikakierros? 🏃 Muista Mia ja hänen klo 6.30 lenkkimuistutuksensa työpöydän ääressä.',
  'Whoa, quick fingers. Terra can only fit your day if it knows it.': 'Vau, nopeat sormet. Terra osaa sovittaa päiväsi vain, jos se tuntee sen.',
  'That was fast! Take a breath, this one shapes your mornings.': 'Olipa nopeaa! Hengähdä, tämä vaikuttaa aamuihisi.',
  'Still speedrunning? Your plan will be as random as these answers.': 'Vieläkin kiire? Suunnitelmasta tulee yhtä sattumanvarainen kuin vastauksista.',
  'That was a speed run 🏃': 'Olipa pikakierros 🏃', 'Several answers took under two seconds. If this plan doesn’t feel like your day, remember Mia and her 06:30 run.': 'Moneen vastaukseen meni alle kaksi sekuntia. Jos suunnitelma ei tunnu sinun päivältäsi, muista Mia ja hänen klo 6.30 lenkkinsä.',
  'Answer again, calmly': 'Vastaa uudelleen rauhassa', 'Before the questions': 'Ennen kysymyksiä', 'Let’s get to know your everyday life a little.': 'Tutustutaan arkeesi hieman.', 'Terra builds your routines from your real day: when you wake up, when work starts, what you already do. First, two quick examples of why your answers matter.': 'Terra rakentaa rutiinisi oikeasta päivästäsi: milloin heräät, milloin työ alkaa ja mitä teet jo valmiiksi. Ensin kaksi nopeaa esimerkkiä siitä, miksi vastauksillasi on väliä.', 'Show me': 'Näytä', 'First:': 'Ensin:'
});
Object.assign(FI, { 'Open GymTrack': 'Avaa GymTrack', 'In progress': 'Käynnissä', 'Tomorrow': 'Huomenna', 'Your gym log': 'Salipäiväkirjasi', 'A workout is in progress. Tap to continue.': 'Treeni on kesken. Jatka napauttamalla.', 'Last:': 'Viimeksi:', 'Programs, sets, records and a rest timer.': 'Ohjelmat, sarjat, ennätykset ja palautusajastin.' });
Object.assign(FI, { 'On iPhone: tap Share → Add to Home Screen, then open Terra from there to get reminders.': 'iPhonessa: napauta Jaa → Lisää Koti-valikkoon ja avaa Terra sieltä, niin muistutukset toimivat.', 'Reminders could not be switched on. Try again in a moment.': 'Muistutuksia ei saatu päälle. Yritä hetken päästä uudelleen.' });
Object.assign(FI, { 'Reminders on this page need the Terra web app. Open it from the home screen.': 'Tämän sivun muistutukset vaativat Terra-verkkosovelluksen. Avaa se Koti-valikosta.' });
