# Come funziona e come aggiornarla

Questa pagina mostra agli studenti il proprio orario settimanale in base a **anno di corso**, **indirizzo** e **lingua**. I dati dei corsi non sono scritti nel codice della pagina: vengono letti da un **foglio Google** che la segreteria può modificare in autonomia, come farebbe con un file Excel. Non serve più toccare il codice per aggiungere, correggere o rimuovere una lezione.

C'è un solo passaggio tecnico iniziale (da fare una volta sola, non dalla segreteria) per collegare la pagina al foglio. Dopo quel passaggio, tutte le modifiche successive si fanno solo nel foglio Google.

---

## Parte 1 — Configurazione iniziale (una volta sola)

### 1. Pubblicare la pagina su GitHub Pages

1. Crea un repository su GitHub (pubblico, altrimenti GitHub Pages gratuito non funziona).
2. Carica **entrambi** i file `index.html` e `data-core.js` nella radice del repository (e, se vuoi anche la panoramica per la segreteria, anche `riepilogo.html` — vedi Parte 3 più sotto). Devono stare tutti nella stessa cartella: `data-core.js` contiene la configurazione e i dati condivisi da entrambe le pagine HTML, che lo caricano automaticamente.
3. Vai su **Settings → Pages**, imposta "Deploy from a branch", scegli il branch principale e la cartella `/ (root)`, salva.
4. Dopo qualche minuto la pagina sarà visibile a un indirizzo del tipo `https://<tuo-utente>.github.io/<nome-repo>/`.

### 2. Creare il foglio Google con i dati dei corsi

1. Apri [Google Sheets](https://sheets.google.com) e crea un nuovo foglio.
2. Importa il file `corsi_template.csv` incluso in questa consegna: **File → Importa → Carica** → seleziona il file → "Sostituisci foglio di lavoro" → Importa dati.
   Questo foglio contiene già tutti i corsi di Primo, Secondo e Terzo Anno come punto di partenza: la segreteria potrà poi modificarli liberamente.
3. Rinomina il foglio/la scheda in modo chiaro, es. "Calendario" (assicurati che sia la **prima** scheda del file, o ricordati quale pubblicare al passo successivo).

### 3. Rendere il foglio leggibile dal sito (condivisione)

1. Nel foglio Google, clicca il pulsante **Condividi** in alto a destra (oppure **File → Condividi → Condividi con altri**).
2. Sotto "Accesso generale", cambia l'impostazione da "Limitato" a **"Chiunque abbia il link"**, con ruolo **Visualizzatore**.
3. Salva/Fatto.

⚠️ Questo rende il foglio leggibile pubblicamente da chiunque abbia il link (ma non modificabile: solo chi ha accesso di modifica al foglio originale può cambiarlo). Non contiene informazioni sensibili sugli studenti, solo l'orario dei corsi.

Non serve più usare "Pubblica sul web": la pagina legge i dati con un formato di link diverso (spiegato sotto), pensato apposta per essere letto da siti esterni come questo. Se avevi già pubblicato il foglio con "Pubblica sul web" in passato, non fa danno: puoi lasciarlo così o disattivarlo, è indifferente.

### 4. Collegare la pagina al foglio

1. Apri il foglio Google normalmente e guarda l'indirizzo nella barra del browser: avrà una forma simile a
   `https://docs.google.com/spreadsheets/d/1AbCdEfGhIJKLmNoPqRsTuVwXyZ/edit?gid=243963684#gid=243963684`
2. Da questo indirizzo prendi due cose:
   - **l'ID del foglio**: la parte lunga di lettere/numeri tra `/d/` e `/edit` (nell'esempio sopra: `1AbCdEfGhIJKLmNoPqRsTuVwXyZ`);
   - **il numero della scheda**: il numero dopo `gid=` (nell'esempio sopra: `243963684`).
3. Apri il file `data-core.js` (non `index.html`) con un editor di testo — anche direttamente su GitHub, cliccando sulla matita ✏️ per modificare il file — e cerca le righe vicino all'inizio:
   ```js
   const GOOGLE_SHEET_ID = "...";
   const GOOGLE_SHEET_GID = "...";
   ```
4. Sostituisci i due valori tra virgolette con quelli presi al passo 2.
5. Salva/fai commit della modifica.

Fatto! Da questo momento sia il calendario studenti (`index.html`) sia la panoramica per la segreteria (`riepilogo.html`, vedi Parte 3) leggono sempre i dati aggiornati dal foglio Google. **`data-core.js` è l'unico file del codice che va toccato, e solo una volta**: entrambe le pagine caricano la loro configurazione da lì, quindi non serve ripetere questo passaggio altrove.

#### Perché non un semplice link CSV?

La pagina non scarica i dati con una normale richiesta "fetch" a un link CSV, ma con una tecnica chiamata **JSONP** (uno `<script>` caricato dinamicamente). Il motivo è che i link CSV di Google (sia quello di "Pubblica sul web", sia quello in formato `gviz/tq`) vengono spesso bloccati dal browser quando letti via codice da un sito esterno come GitHub Pages, per un meccanismo di sicurezza chiamato **CORS** — anche se il link è pubblico e funziona perfettamente se lo apri a mano in una scheda del browser. La tecnica JSONP non passa da una richiesta soggetta a CORS (usa un normale tag `<script>`, come quando una pagina carica una libreria esterna), quindi funziona in modo affidabile anche quando i link CSV vengono bloccati.

Per questo motivo la configurazione non è più "un link da incollare" ma due valori semplici (ID del foglio + numero della scheda), che la pagina usa per costruire da sola la richiesta corretta.

#### Se non funziona

Sulla pagina, quando i dati non si aggiornano, l'avviso arancione mostra anche una riga piccola "**Dettaglio tecnico:** ...". Questo messaggio aiuta a capire cosa non va:
- `Impossibile contattare Google Sheets` → quasi sempre l'ID del foglio scritto al passo 4 non è corretto, oppure non c'è connessione internet.
- Un messaggio che parla di autorizzazione/permessi → il foglio non è condiviso come "Chiunque abbia il link" (torna al passo 3 della sezione precedente).
- `Timeout: nessuna risposta da Google Sheets` → problema temporaneo di rete: riprova con il pulsante "Riprova ora".
- `Il foglio è stato letto ma non contiene righe valide` → l'ID o il numero della scheda puntano al foglio giusto ma alla scheda/tab sbagliata, oppure le colonne non hanno i nomi previsti (vedi tabella più sotto).

Se qualcosa non è chiaro, puoi sempre copiare il testo esatto del "Dettaglio tecnico" e chiedere aiuto a chi ha configurato la pagina.

---

## Parte 2 — Uso quotidiano per la segreteria (nessun codice)

Da qui in avanti, per aggiungere, correggere o rimuovere una lezione basta modificare il foglio Google, esattamente come un file Excel. Le modifiche compaiono sul sito da sole (potrebbero volerci un paio di minuti, perché Google aggiorna la pubblicazione periodicamente).

### Colonne del foglio (non rinominarle)

| Colonna | Obbligatoria | Valori ammessi / esempio |
|---|---|---|
| `ID` | no (solo promemoria interno) | es. `P01`, `S12` |
| `Anno Accademico` | no | es. `2026/2027` |
| `Anno di Corso` | **sì** | `Primo Anno`, `Secondo Anno`, `Terzo Anno` (scrivi esattamente così) |
| `Giorno` | **sì** | `Lunedì`, `Martedì`, `Mercoledì`, `Giovedì`, `Venerdì` |
| `Orario` | **sì** | testo libero, es. `09:00–11:00` |
| `Titolo Corso` | **sì** | testo libero |
| `Lingua` | solo per corsi di lingua | es. `Inglese`, `Francese`, `Spagnolo`, `Tedesco`, `Russo`, `Arabo`, `Cinese` — lascia vuota per corsi non di lingua |
| `Livello Lingua` | solo se serve distinguere il livello di partenza | es. `da A0`, `da B1` (oggi usato solo per il Cinese) — lascia vuota altrimenti |
| `Docente` | **sì** | testo libero |
| `Email Docente` | no | es. `nome.cognome@istituto.it`, lascia vuota se non disponibile |
| `Modalità` | **sì** | `Online` oppure `In presenza` (scrivi esattamente così, altrimenti il badge colorato non compare) |
| `Indirizzo/i` | **sì** | `Tutti gli indirizzi` se il corso è aperto a tutti (tipico dei corsi di lingua), oppure il nome esatto dell'indirizzo/i. **Se un corso riguarda più indirizzi, separali con il punto e virgola `;`** (non la virgola: alcuni nomi di indirizzo, come "Management per turismo, arte e cultura", contengono già una virgola al loro interno) |
| `Gruppo` | no | es. `gr.1 e gr.2`, lascia vuota se non applicabile |
| `Note` | no | es. `dal 14/09`, orari alternati, avvisi vari |

Esempio corretto di cella `Indirizzo/i` con più indirizzi:
```
Marketing e comunicazione; Fashion & Luxury Management
```

Nota: oggi la colonna `Gruppo` è solo informativa — il suo contenuto compare come annotazione sotto la lezione, ma non viene usato per filtrare l'orario in base al gruppo dello studente.

### Il nome del docente è cliccabile

Nell'orario, cliccando sul nome di un docente si apre un piccolo pop-up con il suo nome, l'elenco di tutti gli insegnamenti che tiene (in tutti gli anni e le lingue) e la sua email, se presente.

Per far comparire l'email basta scrivere l'indirizzo nella colonna `Email Docente`, nella riga di quel corso. Se un docente insegna più corsi, ripeti la stessa email in ogni sua riga (basta che sia compilata in almeno una). Se la colonna resta vuota, il pop-up mostra semplicemente "Email non disponibile", senza causare errori: è una colonna facoltativa e può essere aggiunta al foglio in qualsiasi momento.

### Nomi degli indirizzi da usare (attenzione: diversi tra Primo Anno e anni successivi)

Gli indirizzi **non sono gli stessi** tra il Primo Anno e gli anni successivi: usa esattamente questi nomi, a seconda dell'anno che stai modificando, altrimenti il filtro dell'app non troverà il corso.

**Primo Anno:**
- Marketing e comunicazione
- Fashion & Luxury Management
- Relazioni internazionali e diplomatiche
- Criminologia investigativa e forense
- Management del turismo e dei beni culturali
- Mediazione linguistica in tre lingue

**Secondo Anno:**
- Marketing e comunicazione
- Fashion & Luxury Management
- Relazioni internazionali e diplomatiche
- Criminologia e Cybersecurity
- Management per turismo, arte e cultura
- Mediazione linguistica in tre lingue

**Terzo Anno:** nessun indirizzo previsto nel calendario attuale (solo corsi di lingua). Se in futuro verranno introdotti corsi specifici per indirizzo anche al Terzo Anno, aggiungili con `Anno di Corso = Terzo Anno` e il nome dell'indirizzo che preferisci: compariranno automaticamente nel menu a tendina "Indirizzo" quando è selezionato il Terzo Anno.

Vuoi cambiare, rinominare o aggiungere un indirizzo? Basta scriverlo nella colonna `Indirizzo/i` di uno o più corsi: il menu a tendina della pagina si aggiorna da solo, leggendo i nomi presenti nel foglio — non serve modificare altro.

### Consigli per evitare errori di digitazione

Per rendere più sicuro l'inserimento dati, in Google Sheets puoi impostare un elenco a discesa su una colonna (facoltativo ma raccomandato):
1. Seleziona la colonna (es. `Giorno`).
2. Menu **Dati → Convalida dei dati → Aggiungi regola**.
3. Scegli "Elenco di elementi" e inserisci i valori ammessi (es. `Lunedì,Martedì,Mercoledì,Giovedì,Venerdì`).

Utile soprattutto per le colonne `Giorno`, `Anno di Corso`, `Modalità` e `Lingua`.

### Cosa succede se una riga ha un errore

- Se `Anno di Corso` o `Giorno` sono vuoti, la riga viene ignorata (non compare da nessuna parte).
- Se `Modalità` non è scritta esattamente `Online` o `In presenza`, la lezione compare comunque ma senza il badge colorato corretto.
- Se un nome di indirizzo ha un errore di battitura, quel corso non risulterà per nessuno studente (perché il filtro non trova corrispondenza): controlla i nomi esatti elencati sopra.

---

## Parte 3 — Panoramica lezioni per giorno (per la segreteria)

Oltre a `index.html` (il calendario che vedono gli studenti), la consegna include `riepilogo.html`: una pagina pensata per la segreteria, raggiungibile dal link in fondo a `index.html` o direttamente all'indirizzo `https://<tuo-utente>.github.io/<nome-repo>/riepilogo.html` una volta pubblicata (vedi Parte 1, va caricata nella stessa cartella di `index.html` e `data-core.js`).

Per ogni combinazione di Anno di corso, Indirizzo e Lingue — esattamente come la sceglierebbe uno studente nel calendario — la pagina mostra quante lezioni cadono in ciascun giorno della settimana **e quante ore effettive di lezione rappresentano** (calcolate dagli orari, es. "09:00–11:00" = 2 ore; se l'orario di una lezione è ancora "da confermare" quella lezione viene comunque contata ma segnalata con un asterisco `*` e non entra nel totale ore). Ha due modalità, scelte con i due pulsanti in alto alla pagina:

**Sfoglia tutte le combinazioni** — l'elenco è generato automaticamente dai dati presenti nel foglio Google (stessa fonte di `index.html`): non serve inserire o mantenere nulla a mano. I menu a tendina in alto (Anno, Indirizzo, e tre menu "Lingua") permettono di filtrare la tabella per trovare più in fretta le righe che interessano; non limitano l'elenco generato, che resta sempre completo — sono solo un aiuto per la ricerca. I tre filtri "Lingua" si combinano tra loro (selezionandone due, es. Inglese e Francese, la tabella mostra solo le combinazioni che le includono entrambe, indipendentemente dall'ordine): utile per trovare al volo la riga esatta di una combinazione con più lingue. Ogni menu mostra solo le opzioni che portano davvero a qualche risultato in base a cosa hai già scelto negli altri: ad es. se al Primo Anno non ci sono corsi di Arabo, "Arabo" non compare più nel filtro Lingua una volta selezionato "Primo Anno" (e viceversa: scegliendo prima "Arabo", nel filtro Anno restano solo gli anni in cui quella lingua è offerta). Si può ordinare la tabella cliccando sull'intestazione di qualsiasi colonna (es. "Ore tot." per vedere subito le combinazioni più cariche). In ogni cella dei giorni il numero in alto è la quantità di lezioni e il numero in corsivo sotto sono le ore effettive.

**Incolla una lista** — pensata per vedere in un colpo solo tutte le lezioni (e le ore) di un'intera annata di studenti. Si incolla da Excel una riga per combinazione, con le colonne **Anno di Corso, Indirizzo, Lingua 1, Lingua 2, Lingua 3** (Lingua 3 vuota se lo studente ne segue solo 2; Indirizzo vuoto per il Terzo Anno, che non lo prevede); va bene incollare anche con la riga di intestazione, viene riconosciuta e ignorata da sola. Dopo aver premuto "Genera panoramica" la pagina mostra: una riga per ciascuna combinazione incollata (come nella modalità di sopra), e — più sotto — un **totale per l'intera annata**, dove ogni lezione viene contata una sola volta anche se condivisa da più combinazioni (es. una lezione di lingua aperta a più indirizzi viene tenuta una sola volta, con un solo docente e un'aula sola: contarla più volte gonfierebbe il totale). Questo secondo riquadro rappresenta quindi il carico reale — lezioni e ore — da coprire quella settimana per tutto il gruppo incollato, con il dettaglio di ogni singola lezione giorno per giorno. Se una riga incollata non viene riconosciuta (anno, indirizzo o lingua scritti in modo diverso da come compaiono nel foglio) compare un avviso che spiega quale riga e perché — quella riga viene semplicemente ignorata, senza bloccare le altre. Nota: questo formato di incolla non prevede una colonna per il livello di partenza (es. Cinese "da A0" / "da B1"): se una lingua ha più livelli in quell'anno, la panoramica include tutte le relative lezioni.

In entrambe le modalità, cliccando su **"Apri calendario →"** in una riga si apre, in una nuova scheda, lo stesso calendario (`index.html`) che vedrebbe uno studente con quel profilo già selezionato — utile per controllare nel dettaglio orari, aule e docenti di quella combinazione specifica.

Questa pagina è di sola consultazione: non permette di modificare i dati (che restano nel foglio Google, vedi Parte 2) e non serve configurarla — legge automaticamente la stessa fonte dati di `index.html` tramite `data-core.js`.

---

## Cosa vede lo studente se il foglio non è raggiungibile

Se per qualche motivo la pagina non riesce a leggere il foglio online (connessione assente, link cambiato, foglio non più pubblicato), mostra automaticamente un avviso e i dati dell'ultimo aggiornamento salvato nella pagina stessa, così il sito non si rompe mai del tutto. Un pulsante "Riprova ora" permette di ritentare senza ricaricare la pagina. Questo vale sia per `index.html` sia per `riepilogo.html`.
