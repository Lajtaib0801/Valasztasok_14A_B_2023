import ValasztasiEredmeny from "../ValasztasiEredmeny";

describe("ValasztasiEredmeny osztály UNIT tesztek", () => {
    const ve: ValasztasiEredmeny = new ValasztasiEredmeny("5 19 Ablak Antal -");


    it("ValasztasiEredmeny osztálypéldány ellenőrzése", async () => {
        expect(ve).toBeInstanceOf(ValasztasiEredmeny);
    });
})