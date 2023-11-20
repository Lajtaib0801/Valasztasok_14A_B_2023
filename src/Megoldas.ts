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
            if (x.nev == nev)
                return x.szavazatok;
        }
        return -1;
        // this.#eredmenyek.forEach(x => {
        //     if (x.nev == nev)
        //         return x.szavazatok;
        // })
        // return -1;
    }

    jeloltSzavazatainakSzama(nev: string): string {
        let vanIlyenJelolt: boolean = false;
        this.#eredmenyek.forEach(x => {
            if (x.nev == nev)
                vanIlyenJelolt = true;
        });
        if (!vanIlyenJelolt)
            return "Ilyen nevű képviselőjelölt nem szerepel a nyilvántartásban!";
        return `${nev} ${this.#adottJeloltSzavazatainakSzama(nev.trim())} szavazatot kapott`;
    }
}
