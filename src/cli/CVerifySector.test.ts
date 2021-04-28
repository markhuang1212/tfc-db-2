import CGetSector from "./CGetSector"
import CVerifySector from "./CVerifySector"

test('Verify Sector', async () => {
    const sectors = await CGetSector.shared.getAllSectors();
    const ret1 = await CVerifySector.shared.verifySector('some-random-sector', '1234');
    expect(ret1).toBe(false)

    const ret2 = await CVerifySector.shared.verifySector(sectors[0], '1234')
    expect(ret2).toBe(true)
})