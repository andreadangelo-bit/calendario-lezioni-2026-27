// data-core.js — configurazione, dati e funzioni di caricamento condivise
// tra index.html (calendario studenti) e riepilogo.html (panoramica per la
// segreteria). Modificare qui l'ID del foglio Google: entrambe le pagine lo
// useranno automaticamente. Vedi ISTRUZIONI.md per i dettagli.

/* =========================================================================
   CONFIGURAZIONE — l'UNICA cosa da modificare nel codice, una volta sola.
   Inserisci qui l'ID del Google Sheet gestito dalla segreteria e il numero
   della scheda (vedi ISTRUZIONI.md per i passaggi). Dopo questo passaggio
   iniziale, ogni modifica futura ai corsi si fa SOLO nel foglio Google,
   senza più toccare questo file.

   I dati vengono caricati con una tecnica chiamata JSONP (uno script
   caricato dinamicamente, non una fetch() diretta): a differenza sia del
   link "Pubblica sul web" sia di una normale fetch() al link CSV, questa
   tecnica NON è soggetta al blocco del browser per motivi di sicurezza
   (CORS) che può impedire la lettura dei dati da un sito esterno come
   GitHub Pages, perché non passa da fetch()/XHR.

   Richiede una sola cosa sul foglio Google (vedi ISTRUZIONI.md):
   File → Condividi → Condivisione generale → "Chiunque abbia il link"
   con ruolo "Visualizzatore".

   Dove trovare i due valori: apri il foglio Google e guarda l'indirizzo
   nella barra del browser, es.
   "https://docs.google.com/spreadsheets/d/1AbCdEfGh.../edit?gid=243963684#gid=243963684"
   - GOOGLE_SHEET_ID è la parte tra "/d/" e "/edit" (qui: "1AbCdEfGh...")
   - GOOGLE_SHEET_GID è il numero dopo "gid=" (qui: "243963684")
   ========================================================================= */
const GOOGLE_SHEET_ID = "1vSXutv2sD-RgxVWn6e-F_bvR6r8Zm0jFFeTvpg5dqaI";
const GOOGLE_SHEET_GID = "243963684";
/* ========================================================================= */

const GIORNI = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];
const GIORNO_ORDINE = {"Lunedì":1, "Martedì":2, "Mercoledì":3, "Giovedì":4, "Venerdì":5};
const INDIRIZZO_TRE_LINGUE = "Mediazione linguistica in tre lingue";


// Snapshot di riserva: usato solo se GOOGLE_SHEET_ID non è configurato,
// oppure se il foglio online non è raggiungibile in questo momento.
const FALLBACK_DATA = [{"id": "P01", "anno": "Primo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "09:00–11:00", "oraSort": 540, "titolo": "Russo - Fondamenti della lingua I", "lingua": "Russo", "livello": null, "docente": "Mikshina", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": "dal 11/09 (no lezione il 26/10)"}, {"id": "P02", "anno": "Primo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "09:30–11:00", "oraSort": 570, "titolo": "Francese - Tavoli di negoziazione e trattativa linguistica", "lingua": "Francese", "livello": null, "docente": "Oliva", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "dal 14/09 (no lezione il 26/10)"}, {"id": "P03", "anno": "Primo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "12:00–15:00", "oraSort": 720, "titolo": "Inglese - Approfondimento della lingua I + Tecniche e strategie di scrittura", "lingua": "Inglese", "livello": null, "docente": "Prezioso / Razavi", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "dal 14/09"}, {"id": "P04", "anno": "Primo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "15:30–18:30", "oraSort": 930, "titolo": "Psicologia del consumatore e dell'acquisto", "lingua": null, "livello": null, "docente": "Pierguidi", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Marketing e comunicazione", "Fashion & Luxury Management"], "gruppo": null, "note": null}, {"id": "P05", "anno": "Primo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "16:00–19:15", "oraSort": 960, "titolo": "Metodologia della ricerca documentale", "lingua": null, "livello": null, "docente": "Giorgi", "emailDocente": null, "modalita": "Online", "indirizzi": ["Mediazione linguistica in tre lingue"], "gruppo": null, "note": "online da 28/09"}, {"id": "P06", "anno": "Primo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "16:30–19:20", "oraSort": 990, "titolo": "Analisi della geopolitica internazionale", "lingua": null, "livello": null, "docente": "Damjanovski", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Relazioni internazionali e diplomatiche"], "gruppo": null, "note": null}, {"id": "P07", "anno": "Primo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "da confermare", "oraSort": 9999, "titolo": "Cinese (da B1) - Tavoli di negoziazione", "lingua": "Cinese", "livello": "da B1", "docente": "Macchi", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": "giorno e orario da confermare"}, {"id": "P08", "anno": "Primo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "10:00–13:00", "oraSort": 600, "titolo": "Psicologia clinico-forense e valutativa", "lingua": null, "livello": null, "docente": "Currò", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Criminologia investigativa e forense"], "gruppo": null, "note": null}, {"id": "P09", "anno": "Primo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "10:00–12:00", "oraSort": 600, "titolo": "Tedesco – Uso critico e applicato del testo", "lingua": "Tedesco", "livello": null, "docente": "Bardeck", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "P10", "anno": "Primo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "13:30–14:30", "oraSort": 810, "titolo": "Spagnolo – Uso critico e applicato del testo", "lingua": "Spagnolo", "livello": null, "docente": "Semeghini", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "P11", "anno": "Primo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "14:30–15:30", "oraSort": 870, "titolo": "Spagnolo – Tavoli di negoziazione", "lingua": "Spagnolo", "livello": null, "docente": "Magnanego", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "dal 15/09"}, {"id": "P12", "anno": "Primo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "15:30–16:30", "oraSort": 930, "titolo": "Spagnolo – Strategie di memorizzazione e note-taking", "lingua": "Spagnolo", "livello": null, "docente": "Magnanego", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "dal 15/09"}, {"id": "P13", "anno": "Primo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "16:30–18:00", "oraSort": 990, "titolo": "Francese - Approfondimento della lingua I + Tecniche e strategie di scrittura", "lingua": "Francese", "livello": null, "docente": "Bariller", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "P14", "anno": "Primo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "08:30–11:10", "oraSort": 510, "titolo": "Marketing", "lingua": null, "livello": null, "docente": "de Leonardis", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Marketing e comunicazione", "Fashion & Luxury Management", "Management del turismo e dei beni culturali"], "gruppo": null, "note": null}, {"id": "P15", "anno": "Primo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "09:00–13:00", "oraSort": 540, "titolo": "Relazioni internazionali e governance globale", "lingua": null, "livello": null, "docente": "Mancini", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Relazioni internazionali e diplomatiche"], "gruppo": null, "note": null}, {"id": "P16", "anno": "Primo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "13:30–15:30", "oraSort": 810, "titolo": "Spagnolo – Approfondimento della lingua I + Tecniche di scrittura", "lingua": "Spagnolo", "livello": null, "docente": "Acero", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "P17", "anno": "Primo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "15:30–18:30", "oraSort": 930, "titolo": "Storia delle relazioni internazionali e diplomatiche", "lingua": null, "livello": null, "docente": "Milli", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Relazioni internazionali e diplomatiche"], "gruppo": null, "note": null}, {"id": "P18", "anno": "Primo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "15:30–18:30", "oraSort": 930, "titolo": "Comunicazione di impresa", "lingua": null, "livello": null, "docente": "Bonafoni", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Marketing e comunicazione"], "gruppo": null, "note": null}, {"id": "P19", "anno": "Primo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "09:00–11:00 (gr.2) / 11:00–13:00 (gr.1)", "oraSort": 540, "titolo": "Inglese – Uso critico e applicato del testo", "lingua": "Inglese", "livello": null, "docente": "Oliveri", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": "gr.1 e gr.2 (orari invertiti)", "note": "dal 17/09 a settimane alterne"}, {"id": "P20", "anno": "Primo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "09:30–11:00 (gr.1) / 11:00–12:30 (gr.2)", "oraSort": 570, "titolo": "Inglese – Tavoli di negoziazione", "lingua": "Inglese", "livello": null, "docente": "Borghi", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": "gr.1 e gr.2 (orari invertiti)", "note": null}, {"id": "P21", "anno": "Primo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "09:30–11:00 (gr.2) / 11:00–12:30 (gr.1)", "oraSort": 570, "titolo": "Inglese – Strategie di memorizzazione e note-taking", "lingua": "Inglese", "livello": null, "docente": "Valente", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": "gr.1 e gr.2 (orari invertiti)", "note": "a settimane alterne"}, {"id": "P22", "anno": "Primo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "14:30–17:30", "oraSort": 870, "titolo": "Storia delle arti e delle culture visive", "lingua": null, "livello": null, "docente": "Galli", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Management del turismo e dei beni culturali"], "gruppo": null, "note": null}, {"id": "P23", "anno": "Primo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "14:30–17:30", "oraSort": 870, "titolo": "Elementi di diritto penale e penitenziario", "lingua": null, "livello": null, "docente": "Di Pietro", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Criminologia investigativa e forense"], "gruppo": null, "note": null}, {"id": "P24", "anno": "Primo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "09:00–12:00", "oraSort": 540, "titolo": "Tedesco – Approfondimento della lingua I + Tecniche di scrittura", "lingua": "Tedesco", "livello": null, "docente": "Giacoma", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "P25", "anno": "Primo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "09:00–11:00", "oraSort": 540, "titolo": "Russo - Fondamenti della lingua I", "lingua": "Russo", "livello": null, "docente": "Mikshina", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": "inizia 11/09"}, {"id": "P26", "anno": "Primo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "09:30–12:30", "oraSort": 570, "titolo": "Sociologia della devianza e criminogenesi", "lingua": null, "livello": null, "docente": "Baglioni", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Criminologia investigativa e forense"], "gruppo": null, "note": null}, {"id": "P27", "anno": "Primo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "12:00–13:00", "oraSort": 720, "titolo": "Cinese (da B1) – Approfondimento della lingua I + Tecniche di scrittura", "lingua": "Cinese", "livello": "da B1", "docente": "Zhang", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "P28", "anno": "Primo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "15:00–16:00", "oraSort": 900, "titolo": "Cinese (da B1) – Strategie di memorizzazione e note-taking", "lingua": "Cinese", "livello": "da B1", "docente": "Leoni", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": "da 02/10"}, {"id": "P29", "anno": "Primo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "14:00–15:30", "oraSort": 840, "titolo": "Francese – Strategie di memorizzazione e note-taking", "lingua": "Francese", "livello": null, "docente": "Bendoni", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "P30", "anno": "Primo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "13:00–14:00 e 15:30–18:00", "oraSort": 780, "titolo": "Cinese (da A0) - Fondamenti della lingua I", "lingua": "Cinese", "livello": "da A0", "docente": "Bozzano", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S01", "anno": "Secondo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "09:00–11:00", "oraSort": 540, "titolo": "Arabo - Laboratorio applicato di traduzione intermedio", "lingua": "Arabo", "livello": null, "docente": "Boella", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S02", "anno": "Secondo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "10:00–11:30", "oraSort": 600, "titolo": "Russo - Laboratorio applicato di interpretazione intermedio", "lingua": "Russo", "livello": null, "docente": "Saturni", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S03", "anno": "Secondo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "09:00–12:00", "oraSort": 540, "titolo": "Cinese - Cultura, civiltà e istituzioni", "lingua": "Cinese", "livello": null, "docente": "Picerni", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S04", "anno": "Secondo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "13:30–15:00", "oraSort": 810, "titolo": "Francese - Laboratorio applicato di traduzione intermedio", "lingua": "Francese", "livello": null, "docente": "Oliva", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "dal 14/09"}, {"id": "S05", "anno": "Secondo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "15:15–18:15", "oraSort": 915, "titolo": "Inglese - Cultura, civiltà e istituzioni", "lingua": "Inglese", "livello": null, "docente": "Andreani", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "inizio 14/09"}, {"id": "S06", "anno": "Secondo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "16:00–19:15", "oraSort": 960, "titolo": "Metodologia della ricerca documentale", "lingua": null, "livello": null, "docente": "Giorgi", "emailDocente": null, "modalita": "Online", "indirizzi": ["Mediazione linguistica in tre lingue"], "gruppo": null, "note": "online dal 28/09"}, {"id": "S07", "anno": "Secondo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "09:00-11:00", "oraSort": 540, "titolo": "Tedesco – Laboratorio applicato di traduzione intermedio", "lingua": "Tedesco", "livello": null, "docente": "Groeger", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S08", "anno": "Secondo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "09:00–12:00", "oraSort": 540, "titolo": "Russo - Lingua 2", "lingua": "Russo", "livello": null, "docente": "Mikshina", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S09", "anno": "Secondo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "10:00–12:00", "oraSort": 600, "titolo": "Spagnolo – Laboratorio applicato di interpretazione intermedio", "lingua": "Spagnolo", "livello": null, "docente": "Semeghini", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S10", "anno": "Secondo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "12:00–14:00", "oraSort": 720, "titolo": "Spagnolo – Laboratorio applicato di traduzione intermedio", "lingua": "Spagnolo", "livello": null, "docente": "Magnanego", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "inizio 15/09"}, {"id": "S11", "anno": "Secondo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "09:30–12:30", "oraSort": 570, "titolo": "Gestione e direzione di eventi", "lingua": null, "livello": null, "docente": "Bonafoni", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Fashion & Luxury Management", "Management per turismo, arte e cultura", "Marketing e comunicazione"], "gruppo": null, "note": null}, {"id": "S12", "anno": "Secondo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "09:30–12:30", "oraSort": 570, "titolo": "Analisi del cybercrime & security", "lingua": null, "livello": null, "docente": "Biasiotti", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Relazioni internazionali e diplomatiche", "Criminologia e Cybersecurity"], "gruppo": null, "note": null}, {"id": "S13", "anno": "Secondo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "14:00–15:30", "oraSort": 840, "titolo": "Arabo – Laboratorio applicato di interpretazione intermedio", "lingua": "Arabo", "livello": null, "docente": "Gadri", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S14", "anno": "Secondo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "13:00–15:00", "oraSort": 780, "titolo": "Cinese - Laboratorio applicato di traduzione intermedio", "lingua": "Cinese", "livello": null, "docente": "Macchi", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S15", "anno": "Secondo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "15:30–18:00", "oraSort": 930, "titolo": "Spagnolo - Lingua 2", "lingua": "Spagnolo", "livello": null, "docente": "Acero", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S16", "anno": "Secondo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "16:00–18:00", "oraSort": 960, "titolo": "Russo – Laboratorio applicato di traduzione intermedio", "lingua": "Russo", "livello": null, "docente": "Sudakova", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S17", "anno": "Secondo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "16:00–18:00", "oraSort": 960, "titolo": "Tedesco - Lingua 2", "lingua": "Tedesco", "livello": null, "docente": "Aurigi-Eberhart", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S18", "anno": "Secondo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "09:00–12:10", "oraSort": 540, "titolo": "Inglese - Lingua 2", "lingua": "Inglese", "livello": null, "docente": "Sandford", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "inizio 1 ottobre"}, {"id": "S19", "anno": "Secondo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "13:00–15:00", "oraSort": 780, "titolo": "Francese - Lingua 2", "lingua": "Francese", "livello": null, "docente": "Vandamme", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S20", "anno": "Secondo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "13:30–15:30", "oraSort": 810, "titolo": "Inglese – Laboratorio applicato di interpretazione intermedio (GR1)", "lingua": "Inglese", "livello": null, "docente": "Borghi", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": "GR1", "note": null}, {"id": "S21", "anno": "Secondo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "15:30–17:30", "oraSort": 930, "titolo": "Inglese – Laboratorio applicato di interpretazione intermedio (GR2)", "lingua": "Inglese", "livello": null, "docente": "Borghi", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": "GR2", "note": null}, {"id": "S22", "anno": "Secondo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "08:30–10:00", "oraSort": 510, "titolo": "Arabo - Lingua 2", "lingua": "Arabo", "livello": null, "docente": "Baccini", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S23", "anno": "Secondo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "09:00–12:00", "oraSort": 540, "titolo": "Food, Wine & Hospitality Management", "lingua": null, "livello": null, "docente": "Rosati", "emailDocente": null, "modalita": "In presenza", "indirizzi": ["Management per turismo, arte e cultura"], "gruppo": null, "note": null}, {"id": "S24", "anno": "Secondo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "10:30–12:00", "oraSort": 630, "titolo": "Arabo - Laboratorio applicato di interpretazione intermedio", "lingua": "Arabo", "livello": null, "docente": "Gadri", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S25", "anno": "Secondo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "12:00–14:00", "oraSort": 720, "titolo": "Francese – Laboratorio applicato di interpretazione intermedio", "lingua": "Francese", "livello": null, "docente": "Bendoni", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S26", "anno": "Secondo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "13:00–15:00", "oraSort": 780, "titolo": "Tedesco - Laboratorio applicato di interpretazione intermedio", "lingua": "Tedesco", "livello": null, "docente": "Bertazzoni", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": "online inizio 25/09"}, {"id": "S27", "anno": "Secondo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "14:00–15:30", "oraSort": 840, "titolo": "Cinese - Lingua 2", "lingua": "Cinese", "livello": null, "docente": "Bozzano", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "S28", "anno": "Secondo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "15:30-17:30", "oraSort": 930, "titolo": "Inglese – Laboratorio applicato di traduzione intermedio", "lingua": "Inglese", "livello": null, "docente": "Laurenzi", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T01", "anno": "Terzo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "08:30–10:00", "oraSort": 510, "titolo": "Russo – Laboratorio applicato di interpretazione 3", "lingua": "Russo", "livello": null, "docente": "Saturni", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T02", "anno": "Terzo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "09:00–11:00", "oraSort": 540, "titolo": "Arabo – Laboratorio applicato di interpretazione 3", "lingua": "Arabo", "livello": null, "docente": "Gadri", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T03", "anno": "Terzo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "11:00–13:00", "oraSort": 660, "titolo": "Francese – Laboratorio applicato di traduzione 3", "lingua": "Francese", "livello": null, "docente": "Oliva", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "dal 14/09"}, {"id": "T04", "anno": "Terzo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "13:00–15:00", "oraSort": 780, "titolo": "Arabo – Laboratorio applicato di traduzione 3", "lingua": "Arabo", "livello": null, "docente": "Boella", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T05", "anno": "Terzo Anno", "giorno": "Lunedì", "giornoOrd": 1, "orario": "17:00–19:00", "oraSort": 1020, "titolo": "Inglese - Lingua 3 - tutti", "lingua": "Inglese", "livello": null, "docente": "Grandolfo", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": "Tutti", "note": "inizia 11/09; più si veda calendario ad hoc"}, {"id": "T06", "anno": "Terzo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "09:00–10:00", "oraSort": 540, "titolo": "Spagnolo – Laboratorio applicato di traduzione 3", "lingua": "Spagnolo", "livello": null, "docente": "Semeghini", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T07", "anno": "Terzo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "11:00–12:00", "oraSort": 660, "titolo": "Spagnolo – Laboratorio applicato di interpretazione 3", "lingua": "Spagnolo", "livello": null, "docente": "Magnanego", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "inizio 15/09"}, {"id": "T08", "anno": "Terzo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "12:00–13:30", "oraSort": 720, "titolo": "Spagnolo – Laboratorio applicato di interpretazione 3", "lingua": "Spagnolo", "livello": null, "docente": "Semeghini", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T09", "anno": "Terzo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "13:30–15:30", "oraSort": 810, "titolo": "Arabo Lingua 3", "lingua": "Arabo", "livello": null, "docente": "Mutlak", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": "no lezione 15/09"}, {"id": "T10", "anno": "Terzo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "13:30–15:30", "oraSort": 810, "titolo": "Russo Lingua 3", "lingua": "Russo", "livello": null, "docente": "Sudakova", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": "no lezione 15/09"}, {"id": "T11", "anno": "Terzo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "15:00–17:00", "oraSort": 900, "titolo": "Cinese (da A0) - Lingua 3", "lingua": "Cinese", "livello": "da A0", "docente": "Bozzano", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "no lezione 15/09"}, {"id": "T12", "anno": "Terzo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "17:00–18:30", "oraSort": 1020, "titolo": "Cinese (da A0) – Laboratorio applicato di interpretazione 3", "lingua": "Cinese", "livello": "da A0", "docente": "Macchi", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T13", "anno": "Terzo Anno", "giorno": "Martedì", "giornoOrd": 2, "orario": "17:00–19:00", "oraSort": 1020, "titolo": "Tedesco – Laboratorio applicato di traduzione 3", "lingua": "Tedesco", "livello": null, "docente": "Ragazzi", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T14", "anno": "Terzo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "09:00–11:00", "oraSort": 540, "titolo": "Spagnolo Lingua 3", "lingua": "Spagnolo", "livello": null, "docente": "Acero", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T15", "anno": "Terzo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "11:00–13:00", "oraSort": 660, "titolo": "Spagnolo – Laboratorio applicato di traduzione 3", "lingua": "Spagnolo", "livello": null, "docente": "Acero", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T16", "anno": "Terzo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "13:30–15:30", "oraSort": 810, "titolo": "Tedesco Lingua 3", "lingua": "Tedesco", "livello": null, "docente": "Aurigi-Eberhart", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T17", "anno": "Terzo Anno", "giorno": "Mercoledì", "giornoOrd": 3, "orario": "15:30–17:00", "oraSort": 930, "titolo": "Inglese – Laboratorio di traduzione 3 - tutti", "lingua": "Inglese", "livello": null, "docente": "Staton", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": "Tutti", "note": null}, {"id": "T18", "anno": "Terzo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "08:30–10:00", "oraSort": 510, "titolo": "Russo – Laboratorio applicato di traduzione 3", "lingua": "Russo", "livello": null, "docente": "Mikshina", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T19", "anno": "Terzo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "10:00–12:00", "oraSort": 600, "titolo": "Francese Lingua 3", "lingua": "Francese", "livello": null, "docente": "Vandamme", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "no lezione 17/09"}, {"id": "T20", "anno": "Terzo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "13:00–14:30", "oraSort": 780, "titolo": "Inglese – Laboratorio applicato di traduzione 3 - tutti", "lingua": "Inglese", "livello": null, "docente": "Oliveri", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": "Tutti", "note": "dal 17/09 a settimane alterne"}, {"id": "T21", "anno": "Terzo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "13:00–15:00", "oraSort": 780, "titolo": "Inglese – Laboratorio applicato di interpretazione 3 gruppo Valente", "lingua": "Inglese", "livello": null, "docente": "Valente", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": "Gruppo Valente", "note": "dal 10/09 a settimane alterne"}, {"id": "T22", "anno": "Terzo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "14:30–17:00", "oraSort": 870, "titolo": "Inglese – Laboratorio di interpretazione 3 gruppo Oliveri", "lingua": "Inglese", "livello": null, "docente": "Oliveri", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": "Gruppo Oliveri", "note": "dal 17/09 a settimane alterne"}, {"id": "T23", "anno": "Terzo Anno", "giorno": "Giovedì", "giornoOrd": 4, "orario": "15:30–17:30", "oraSort": 930, "titolo": "Tedesco – Laboratorio applicato di interpretazione 3", "lingua": "Tedesco", "livello": null, "docente": "Valente", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": "dal 10/09 a settimane alterne"}, {"id": "T24", "anno": "Terzo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "09:00–11:00", "oraSort": 540, "titolo": "Cinese (da B1) - Laboratorio applicato di interpretazione 3", "lingua": "Cinese", "livello": "da B1", "docente": "Leoni", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": "online dal 02/10"}, {"id": "T25", "anno": "Terzo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "09:00–11:30", "oraSort": 540, "titolo": "Francese – Laboratorio applicato di interpretazione 3", "lingua": "Francese", "livello": null, "docente": "Bendoni", "emailDocente": null, "modalita": "In presenza", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T26", "anno": "Terzo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "14:30–16:30", "oraSort": 870, "titolo": "Cinese (da B1) - Lingua 3", "lingua": "Cinese", "livello": "da B1", "docente": "Zhang", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": null, "note": null}, {"id": "T27", "anno": "Terzo Anno", "giorno": "Venerdì", "giornoOrd": 5, "orario": "17:00–19:00", "oraSort": 1020, "titolo": "Inglese - Lingua 3 - tutti", "lingua": "Inglese", "livello": null, "docente": "Grandolfo", "emailDocente": null, "modalita": "Online", "indirizzi": null, "gruppo": "Tutti", "note": "inizia 11/09; più si veda calendario ad hoc"}];
const FALLBACK_TIMESTAMP = "26/08/2026";

/* ---------- Parser CSV robusto (gestisce virgolette e virgole nei campi) ---------- */
function parseCSV(text){
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (let i = 0; i < text.length; i++){
    const ch = text[i];
    if (inQuotes){
      if (ch === '"'){
        if (text[i+1] === '"'){ field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"'){
        inQuotes = true;
      } else if (ch === ','){
        row.push(field); field = '';
      } else if (ch === '\n'){
        row.push(field); field = '';
        rows.push(row); row = [];
      } else {
        field += ch;
      }
    }
  }
  if (field.length > 0 || row.length > 0){
    row.push(field);
    rows.push(row);
  }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

function sortKeyTime(orario){
  const m = /(\d{1,2}):(\d{2})/.exec(orario || '');
  return m ? (parseInt(m[1],10)*60 + parseInt(m[2],10)) : 9999;
}

function rowsToCourses(rows){
  if (rows.length === 0) return [];
  const headers = rows[0].map(h => h.trim());
  const idx = {};
  headers.forEach((h,i) => idx[h] = i);
  const required = ["Anno di Corso","Giorno","Orario","Titolo Corso","Docente","Modalità","Indirizzo/i"];
  for (const req of required){
    if (!(req in idx)) throw new Error(`Colonna mancante nel foglio dati: "${req}"`);
  }
  const get = (cols, name) => (idx[name] !== undefined ? (cols[idx[name]] || '').trim() : '');

  const out = [];
  for (let i = 1; i < rows.length; i++){
    const cols = rows[i];
    if (cols.every(c => (c||'').trim() === '')) continue;
    const anno = get(cols, "Anno di Corso");
    const giorno = get(cols, "Giorno");
    if (!anno || !giorno) continue;
    const indRaw = get(cols, "Indirizzo/i");
    const indirizzi = (!indRaw || indRaw.toLowerCase() === 'tutti gli indirizzi')
      ? null
      : indRaw.split(';').map(s => s.trim()).filter(Boolean);
    out.push({
      id: get(cols, "ID"),
      anno: anno,
      giorno: giorno,
      giornoOrd: GIORNO_ORDINE[giorno] || 99,
      orario: get(cols, "Orario"),
      oraSort: sortKeyTime(get(cols, "Orario")),
      titolo: get(cols, "Titolo Corso"),
      lingua: get(cols, "Lingua") || null,
      livello: get(cols, "Livello Lingua") || null,
      docente: get(cols, "Docente"),
      emailDocente: get(cols, "Email Docente") || null,
      modalita: get(cols, "Modalità"),
      indirizzi: indirizzi,
      gruppo: get(cols, "Gruppo") || null,
      note: get(cols, "Note") || null,
    });
  }
  return out;
}

// Carica i dati di un Google Sheet pubblico via JSONP (script dinamico),
// invece che con fetch(): questa tecnica non è soggetta al blocco del
// browser per motivi di sicurezza (CORS) che può bloccare una fetch()
// diretta verso Google da un altro sito, perché il browser non applica
// CORS al caricamento di uno <script>.
function loadSheetJSONP(sheetId, gid, timeoutMs){
  return new Promise((resolve, reject) => {
    const cbName = '__gsheetCB_' + Math.random().toString(36).slice(2);
    let done = false;
    const script = document.createElement('script');
    const cleanup = () => {
      clearTimeout(timer);
      delete window[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      cleanup();
      reject(new Error('Timeout: nessuna risposta da Google Sheets entro ' + (timeoutMs/1000) + ' secondi.'));
    }, timeoutMs);
    window[cbName] = (response) => {
      if (done) return;
      done = true;
      cleanup();
      if (!response || response.status === 'error'){
        const msg = (response && response.errors && response.errors[0] && response.errors[0].detailed_message)
          || 'Il foglio Google ha risposto con un errore (controlla ID foglio, numero scheda e condivisione).';
        reject(new Error(msg));
        return;
      }
      resolve(response.table);
    };
    script.onerror = () => {
      if (done) return;
      done = true;
      cleanup();
      reject(new Error('Impossibile contattare Google Sheets (rete assente o ID foglio non valido).'));
    };
    const tqx = encodeURIComponent('out:json;responseHandler:' + cbName);
    script.src = 'https://docs.google.com/spreadsheets/d/' + encodeURIComponent(sheetId) +
      '/gviz/tq?gid=' + encodeURIComponent(gid) + '&headers=1&tqx=' + tqx + '&cachebust=' + Date.now();
    document.head.appendChild(script);
  });
}

function gvizCellText(cell){
  if (!cell) return '';
  if (cell.f != null) return String(cell.f);
  if (cell.v != null) return String(cell.v);
  return '';
}

function uniqueSorted(arr){
  return [...new Set(arr)].sort((a,b)=>a.localeCompare(b, 'it'));
}

const ANNO_ORDER = ["Primo Anno", "Secondo Anno", "Terzo Anno"];

function escapeHtml(str){
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* Loader generico: prova a leggere dal foglio Google via JSONP; se fallisce (o
   se GOOGLE_SHEET_ID non è configurato) ricade sui dati di fallback incorporati
   qui sopra. Restituisce sempre un array di corsi pronto all'uso, più
   informazioni su come è stato ottenuto (per mostrare avvisi nella pagina). */
async function loadCourseData(timeoutMs){
  if (!GOOGLE_SHEET_ID){
    return { courses: FALLBACK_DATA, source: 'no-config' };
  }
  try{
    const table = await loadSheetJSONP(GOOGLE_SHEET_ID, GOOGLE_SHEET_GID, timeoutMs || 12000);
    const headerRow = (table.cols || []).map(c => (c && c.label) ? c.label : '');
    const dataRows = (table.rows || []).map(r => (r.c || []).map(gvizCellText));
    const parsed = rowsToCourses([headerRow, ...dataRows]);
    if (parsed.length === 0) throw new Error('Il foglio è stato letto ma non contiene righe valide.');
    return { courses: parsed, source: 'sheet' };
  } catch(err){
    return { courses: FALLBACK_DATA, source: 'error', error: err };
  }
}

/* Converte un testo "Orario" nella sua durata effettiva in ore (numero, es.
   1.5), usata da riepilogo.html per calcolare le ore di lezione. Regole,
   dedotte dai formati realmente usati nel foglio:
   - "09:00–11:00"                              -> una sola fascia: la durata è quella.
   - "09:00–11:00 (gr.2) / 11:00–13:00 (gr.1)"  -> fasce alternative (gruppi diversi
     nello stesso corso): uno studente ne segue una sola, e nei dati attuali hanno
     sempre la stessa durata, quindi si usa la prima fascia come rappresentativa.
   - "13:00–14:00 e 15:30–18:00"                 -> fasce che si sommano davvero
     (stesso giorno, stesso corso, entrambe frequentate): durate sommate.
   - "da confermare" o testo senza orari         -> restituisce null (non calcolabile:
     va escluso dai totali ore, non trattato come zero).
   Non modifica né dipende da altri dati: è una funzione pura, riusabile ovunque. */
function parseOrarioHours(orario){
  if (!orario) return null;
  const firstAlternative = orario.split('/')[0];
  const segments = firstAlternative.split(/\s+e\s+/i);
  const re = /(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/;
  let totalMinutes = 0, found = false;
  for (const seg of segments){
    const m = re.exec(seg);
    if (!m) continue;
    found = true;
    const start = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    const end = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
    if (end > start) totalMinutes += (end - start);
  }
  return found ? Math.round((totalMinutes / 60) * 100) / 100 : null;
}
