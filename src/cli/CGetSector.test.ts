import CGetSector from "./CGetSector"

test('Get All Sectors', async () => {
    const ret = await CGetSector.shared.getAllSectors();
    expect(ret.length).toBeGreaterThan(10);
    for(const afid of ret){
        expect(typeof afid).toBe('string')
    }
})