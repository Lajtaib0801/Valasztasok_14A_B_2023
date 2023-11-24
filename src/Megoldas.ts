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
            ["Gyümölcsevők Pártja", (sumGyep / this.szavazottakSzama() * 100).toFixed(2)],
            ["Húsevők Pártja", (sumHep / this.szavazottakSzama() * 100).toFixed(2)],
            ["Tejivók Szövetsége", (sumTisz / this.szavazottakSzama() * 100).toFixed(2)],
            ["Zöldségevők Párja", (sumZep / this.szavazottakSzama() * 100).toFixed(2)],
            ["Független jelöltek", (sumFuggetlen / this.szavazottakSzama() * 100).toFixed(2)],
        ]);
        return partok;
    }
}
