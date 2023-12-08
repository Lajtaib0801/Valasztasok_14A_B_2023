export default class VálasztásiEredmény {
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

    public get pártJel2(): string {
        return this.#pártJel == "-" ? "Független" : this.#pártJel;
    }

    get párt(): string {
        const nevMap: Map<string, string> = new Map<string, string>([
            ["GYEP", "Gyümölcsevők Pártja"],
            ["HEP", "Húsevők Pártja"],
            ["TISZ", "Tejivók Szövetsége"],
            ["ZEP", "Zöldségevők Pártja"],
            ["-", "Független jelöltek"],
        ]);
        return nevMap.get(this.#pártJel) as string;
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