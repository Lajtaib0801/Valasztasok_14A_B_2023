import VálasztásiEredmény from "./ValasztasiEredmeny";
import fs from "fs";

export default class Megoldás {
    #ve: VálasztásiEredmény[] = [];

    get képviselőjelöltekSzáma(): number {
        return this.#ve.length;
    }

    get #megjelentekSzáma(): number {
        let szumMegjelent: number = 0;
        for (const e of this.#ve) {
            szumMegjelent += e.szavazatok;
        }
        return szumMegjelent;
    }

    get #megjelentekAránya(): string {
        const arány: number = this.#megjelentekSzáma / 12345;
        return `${(arány * 100).toFixed(2)}%`;
    }

    get részvételiStatisztika(): string {
        return `A választáson ${this.#megjelentekSzáma} állampolgár, a jogosultak ${this.#megjelentekAránya}-a vett részt.\n`;
    }

    get #pártStat(): Map<string, number> {
        const stat: Map<string, number> = new Map<string, number>();
        this.#ve.forEach(e => {
            if (stat.has(e.párt)) {
                // Ha a párt már szerepel a szótár kulcsai között:
                const régiÉrték: number = stat.get(e.párt) as number;
                const újÉrték: number = régiÉrték + e.szavazatok;
                stat.set(e.párt, újÉrték);
            } else {
                // Ha a párt még nincs a szótárban
                stat.set(e.párt, e.szavazatok);
            }
        });
        return stat;
    }

    get pártStat(): string {
        let vissza: string = "";
        // map bejárása a forEach() metódussal:
        this.#pártStat.forEach((value, key) => {
            vissza += `${key}= ${((value / this.#megjelentekSzáma) * 100).toFixed(2)} %\n`;
        });
        // vagy for-of ciklussal
        // for (const [key, value] of this.#pártStat) {
        //     vissza += `${key}= ${((value / this.#megjelentekSzáma) * 100).toFixed(2)} %\n`;
        // }
        return vissza;
    }

    get #legtöbbSzavazat(): number {
        let max = -1;
        this.#ve.forEach(e => {
            if (e.szavazatok > max) {
                max = e.szavazatok;
            }
        });
        return max;
    }

    get #legtöbbSzavazat2(): number {
        return Math.max(...this.#ve.map(x => x.szavazatok));
    }

    get legtöbbSzavazat(): string {
        let vissza: string = "";
        for (const e of this.#ve) {
            if (e.szavazatok == this.#legtöbbSzavazat2) {
                vissza += `${e.nev} ${e.pártJel2}\n`;
            }
        }
        return vissza;
    }

    get #állománytÖsszeállít(): string {
        const ki: string[] = [];
        for (let kerület = 1; kerület <= 8; kerület++) {
            const ve: VálasztásiEredmény | null = this.#nyertesKépviselő(kerület);
            if (ve != null) {
                ki.push(`${kerület}. ${ve.nev} ${ve.pártJel2}`);
            }
        }
        return ki.join("\r\n") + "\r\n";
    }

    constructor(fájl_neve: string) {
        fs.readFileSync(fájl_neve)
            .toString()
            .split("\n")
            .forEach(sor => {
                const aktSor: string = sor.trim();
                if (aktSor.length > 0) this.#ve.push(new VálasztásiEredmény(aktSor));
            });
    }

    szavazatokSzáma(név: string): string {
        for (const e of this.#ve) {
            if (e.nev == név) {
                return `${név} ${e.szavazatok} szavazatot kapott.`;
            }
        }
        return "Ilyen nevű képviselőjelölt nem szerepel a nyilvántartásban.";
    }

    #nyertesKépviselő(kerület: number): VálasztásiEredmény | null {
        let nyertes: VálasztásiEredmény | null = null; // null értékű ha a keresett kerületben nem indult senki
        for (const e of this.#ve) {
            if (e.kerület == kerület) {
                if (nyertes == null) {
                    nyertes = e;
                } else {
                    if (e.szavazatok > nyertes.szavazatok) {
                        nyertes = e;
                    }
                }
            }
        }
        return nyertes;
    }

    állománybaÍr(állományNeve: string): void {
        try {
            fs.writeFileSync(állományNeve, this.#állománytÖsszeállít);
        } catch (error) {
            // console.log((error as Error).message);
            throw Error((error as Error).message);
        }
    }

    állománytOlvas(állományNeve: string): string {
        try {
            return fs.readFileSync(állományNeve)
            .toString();
        } catch (error) {
            throw Error((error as Error).message)
        }
    }
}