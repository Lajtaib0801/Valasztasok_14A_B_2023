export default class ValasztasiEredmeny {
    #kerület: number;
    #szavazatok: number;
    #vnév: string;
    #knév: string;
    #pártJel: string;

    get nev(): string {
        return `${this.#vnév} ${this.#knév}`;
    }

    get szavazatok(): number {
        return this.#szavazatok;
    }

    get kerület(): number {
        return this.#kerület;
    }

    get pártJel2(): string {
        return this.#pártJel == "-" ? "Független" : this.#pártJel;
    }

    get párt(): string {
        const nevMap: Map<string, string> = new Map<string, string>([
            ["GYEP", "Gyümölcsevők Pártja"],
            ["HEP", "Húsevők Pártja"],
            ["TISZ", "Tejivók Szövetsége"],
            ["ZEP", "Zöldségevők Párja"],
            ["-", "Független jelöltek"],
        ]);
        // if (nevMap.has(this.#pártJel)) return nevMap.get(this.#pártJel) as string;
        return nevMap.get(this.#pártJel) as string;
        // return "Hiba!";
    }

    constructor(sor: string) {
        const m: string[] = sor.split(" ");
        this.#kerület = parseInt(m[0]);
        this.#szavazatok = parseInt(m[1]);
        this.#vnév = m[2];
        this.#knév = m[3];
        this.#pártJel = m[4];
    }
}
