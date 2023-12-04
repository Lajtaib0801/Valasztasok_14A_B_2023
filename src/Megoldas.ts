import ValasztasiEredmeny from "./ValasztasiEredmeny";
import fs from "fs";

export default class Megoldas {
    #eredmenyek: Array<ValasztasiEredmeny> = Array();

    constructor(forrás: string) {
        fs.readFileSync(forrás, "utf-8")
            .split("\n")
            .forEach(sor => {
                const aktSor: string = sor.trim();
                if (aktSor.length > 0) this.#eredmenyek.push(new ValasztasiEredmeny(aktSor));
            });
    }

    jeloltekSzama(): number {
        return this.#eredmenyek.length;
    }

    #adottJeloltSzavazatainakSzama(nev: string): number {
        for (const x of this.#eredmenyek) {
            if (x.nev == nev) return x.szavazatok;
        }
        return -1;
    }

    jeloltSzavazatainakSzama(nev: string): string {
        let vanIlyenJelolt: boolean = false;
        this.#eredmenyek.forEach(x => {
            if (x.nev == nev) vanIlyenJelolt = true;
        });
        if (!vanIlyenJelolt) return "Ilyen nevű képviselőjelölt nem szerepel a nyilvántartásban!";
        return `${nev} ${this.#adottJeloltSzavazatainakSzama(nev.trim())} szavazatot kapott`;
    }

    szavazottakSzama(): number {
        let szavazatok: number = 0;
        this.#eredmenyek.forEach(x => (szavazatok += x.szavazatok));
        return szavazatok;
    }
    szavazottArany(): string {
        return ((this.szavazottakSzama() / 12345) * 100).toFixed(2);
    }

    partokraLeadottSzavazatokAranya(): Map<string, string> {
        let sumGyep: number = 0;
        this.#eredmenyek.filter(x => x.pártJel2 == "GYEP").forEach(x => (sumGyep += x.szavazatok));
        let sumHep: number = 0;
        this.#eredmenyek.filter(x => x.pártJel2 == "HEP").forEach(x => (sumHep += x.szavazatok));
        let sumTisz: number = 0;
        this.#eredmenyek.filter(x => x.pártJel2 == "TISZ").forEach(x => (sumTisz += x.szavazatok));
        let sumZep: number = 0;
        this.#eredmenyek.filter(x => x.pártJel2 == "ZEP").forEach(x => (sumZep += x.szavazatok));
        let sumFuggetlen: number = 0;
        this.#eredmenyek.filter(x => x.pártJel2 == "Független").forEach(x => (sumFuggetlen += x.szavazatok));

        const partok: Map<string, string> = new Map<string, string>([
            ["Gyümölcsevők Pártja", ((sumGyep / this.szavazottakSzama()) * 100).toFixed(2)],
            ["Húsevők Pártja", ((sumHep / this.szavazottakSzama()) * 100).toFixed(2)],
            ["Tejivók Szövetsége", ((sumTisz / this.szavazottakSzama()) * 100).toFixed(2)],
            ["Zöldségevők Párja", ((sumZep / this.szavazottakSzama()) * 100).toFixed(2)],
            ["Független jelöltek", ((sumFuggetlen / this.szavazottakSzama()) * 100).toFixed(2)],
        ]);
        return partok;
    }

    toSzazalek(szam: number): number {
        return (szam / this.szavazottakSzama()) * 100;
    }

    partokraLeadottSzavazatokAranya2(): Map<string, number> {
        const partok: Map<string, number> = new Map<string, number>();
        this.#eredmenyek.forEach(element => {
            if (!partok.has(element.párt)) partok.set(element.párt, 0);
        });
        for (const [key, value] of partok) {
            let sum: number = value;
            this.#eredmenyek.forEach(x => {
                if (x.párt == key) {
                    sum += x.szavazatok;
                    partok.set(key, sum);
                }
            });
        }
        for (const [key, value] of partok) {
            partok.set(key, this.toSzazalek(value));
        }
        return partok;
    }

    #maxSzavazatszam(): number {
        // let maxSzavazatok: number = 0;
        // for (const item of this.#eredmenyek) {
        //     if (item.szavazatok > maxSzavazatok) maxSzavazatok = item.szavazatok;
        // }
        // return maxSzavazatok;
        return Math.max(...this.#eredmenyek.map(x => x.szavazatok));
    }

    maxSzavazatosJelolt(): Array<ValasztasiEredmeny> {
        let maxosJelolt: Array<ValasztasiEredmeny> = Array();
        for (const item of this.#eredmenyek) {
            if (item.szavazatok == this.#maxSzavazatszam()) maxosJelolt.push(item);
        }
        return maxosJelolt;
    }

    #nyertesKepviselo(kerület: number): ValasztasiEredmeny | null {
        let nyertes: ValasztasiEredmeny | null = null;
        for (const iterator of this.#eredmenyek) {
            if (iterator.kerület == kerület) {
                if (nyertes == null) {
                    nyertes = iterator
                }
                else if (nyertes.szavazatok < iterator.szavazatok) {
                    nyertes = iterator
                }
            }
        }
        return nyertes;
    }

    #kepviselokLettek(): Map<number, ValasztasiEredmeny | null> {
        const kepviselok: Map<number, ValasztasiEredmeny | null> = new Map<number, ValasztasiEredmeny | null>([
            [1, null],
            [2, null],
            [3, null],
            [4, null],
            [5, null],
            [6, null],
            [7, null],
            [8, null],
        ]);
        for (const [key, value] of kepviselok) {
            for (const szavazat of this.#eredmenyek) {
                if (szavazat.kerület == key) {
                    if (value == null) {
                        kepviselok.set(key, szavazat);
                    } else if (value.szavazatok < szavazat.szavazatok) {
                        kepviselok.set(key, szavazat);
                    }
                }
            }
        }
        return kepviselok;
    }

    txtLetrehoz(): void {
        const ki: Array<string> = Array();
        for (const [k, v] of this.#kepviselokLettek()) {
            ki.push(`${v?.kerület}.kerület: ${v?.nev} ${v?.pártJel2}`);
        }
        const output: string = ki.join("\r\n");
        try {
            fs.writeFileSync("kepviselok.txt", output);
        } catch (error) {
            throw Error((error as Error).message)
        }
    }
}
