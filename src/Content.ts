import fs from "fs"; //  https://nodejs.org/docs/latest-v14.x/api/fs.html
import http from "http"; //  https://nodejs.org/docs/latest-v14.x/api/http.html
import url from "url"; //  https://nodejs.org/docs/latest-v14.x/api/url.html
import ValasztasiEredmeny from "./ValasztasiEredmeny";
import Megoldas from "./Megoldas";

export default function content(req: http.IncomingMessage, res: http.ServerResponse): void {
    // favicon.ico kérés kiszolgálása:
    if (req.url === "/favicon.ico") {
        res.writeHead(200, { "Content-Type": "image/x-icon" });
        fs.createReadStream("favicon.ico").pipe(res);
        return;
    }
    // Weboldal inicializálása + head rész:
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<!DOCTYPE html>");
    res.write("<html lang='hu'>");
    res.write("<head>");
    res.write("<meta charset='utf-8'>");
    res.write("<style>input, pre {font-family:monospace; font-size:1em; font-weight:bold;}</style>");
    res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
    res.write("<title>Jedlik Ts Template</title>");
    res.write("</head>");
    res.write("<body><form><pre>");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const params = new url.URL(req.url as string, `http://${req.headers.host}/`).searchParams;

    // Kezd a kódolást innen -->
    const m: Megoldas = new Megoldas("szavazatok.txt");
    res.write(`2. feladat:\n`);
    res.write(`A helyhatósági választáson ${m.jeloltekSzama()} képviselőjelölt indult.\n`);
    res.write(`\n`);
    //res.write("Egyszerű Hello World! (2023/2024)\n");
    res.write(`3. feladat:\n`);
    // Tetszőleges html teg-ek és attribútumok beépítése:
    //res.write("<span style='color: blue;'><i>Színes és dőlt Hello World!'</i></span>\n");

    // Próbáljuk számra konvertálni a "kor" paraméter (http://localhost:8080/?kor=16) értékét:
    let nev = params.get("nev") as string;
    if (!nev) nev = "Fasirt Ferenc";
    // Ha nincs "kor" paraméter megadva, vagy nem lehet számra konvertálni értékét,
    // akkor a "korod" változóba NaN érték kerül, ilyenkor legyen 18 év az értéke:
    //if (isNaN(korod)) korod = 18;

    res.write(`<label>Adja meg egy képviselő nevét: <input type='text' name='nev' value="${nev}" style='max-width:100px;' onChange='this.form.submit();'></label>\n`);

    res.write(`${m.jeloltSzavazatainakSzama(nev)}\n`);

    res.write(`\n4. feladat:\n`);
    res.write(`A választáson ${m.szavazottakSzama()} állampolgár, a jogosultak ${m.
    szavazottArany()}%-a vett részt.\n`);
    res.write(`\n5. feladat\n`);
    for (let [key, value] of m.partokraLeadottSzavazatokAranya().entries()) {
        res.write(`${key}= ${value} %\n`);
    }
    res.write(`\n6. feladat\n`);
    for (const item of m.maxSzavazatosJelolt()) {
        res.write(`${item.nev} ${item.pártJel2}\n`);
    }


    // <---- Fejezd be a kódolást

    res.write("</pre></form></body></html>");
    res.end();
}
