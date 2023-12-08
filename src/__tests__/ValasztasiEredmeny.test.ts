import VálasztásiEredmény from "../ValasztasiEredmeny";

describe("VálasztásiEredmény osztály unit tesztek", () => {
    const eredmény1 = new VálasztásiEredmény("5 19 Ablak Antal -");
    const eredmény2 = new VálasztásiEredmény("1 120 Alma Dalma GYEP");
    const eredmény3 = new VálasztásiEredmény("7 162 Bab Zsuzsanna ZEP");

    it("VálasztásiEredmény osztálypéldány ellenőrzése", async () => {
        expect(eredmény1).toBeInstanceOf(VálasztásiEredmény);
        expect(eredmény2).toBeInstanceOf(VálasztásiEredmény);
        expect(eredmény3).toBeInstanceOf(VálasztásiEredmény);
    });

    it("Név jellemző ellenőrzése", async () => {
        expect(eredmény1.nev).toBe("Ablak Antal");
        expect(eredmény2.nev).toBe("Alma Dalma");
        expect(eredmény3.nev).toBe("Bab Zsuzsanna");
    });

    it("Szavazatok jellemző ellenőrzése", async () => {
        expect(eredmény1.szavazatok).toBe(19);
        expect(eredmény2.szavazatok).toBe(120);
        expect(eredmény3.szavazatok).toBe(162);
    });

    it("Kerület jellemző ellenőrzése", async () => {
        expect(eredmény1.kerület).toBe(5);
        expect(eredmény2.kerület).toBe(1);
        expect(eredmény3.kerület).toBe(7);
    });

    it("Pártjel2 jellemző ellenőrzése", async () => {
        expect(eredmény1.pártJel2).toBe("Független");
        expect(eredmény2.pártJel2).toBe("GYEP");
        expect(eredmény3.pártJel2).toBe("ZEP");
    });

    it("Párt jellemző ellenőrzése", async () => {
        expect(eredmény1.párt).toBe("Független jelöltek");
        expect(eredmény2.párt).toBe("Gyümölcsevők Pártja");
        expect(eredmény3.párt).toBe("Zöldségevők Pártja");
    });
});