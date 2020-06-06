import {CriticalStrike} from "../src/critical-strike";
import * as fs from "fs";

const critical1 = new CriticalStrike("Heat","E", [21,35], "Minor burns. Foe must parry for 2 rnds. 2 hits per rnd. +9 hits.")
const critical2 = new CriticalStrike("Heat","E", [66,66], "Head strike. If foe has helm, he is knocked out and takes 5 hits per rnd. If not, foe is killed instantly, his head fully vaporized. Fine aim.")
const critical3 = new CriticalStrike("Slash","B", [1,5], "Weak strike. +0 hits. ")

test('critical strikes storing', async (done) => {
    const critical: CriticalStrike = new CriticalStrike(
        "Heat",
        "A",
        [1, 5],
        "" )
    CriticalStrike.add(critical)
    expect(CriticalStrike.get("Heat", "A", 0)).toBe(undefined)
    expect(CriticalStrike.get("Heat", "A", 1)).toBe(critical)
    expect(CriticalStrike.get("Heat", "A", 2)).toBe(critical)
    expect(CriticalStrike.get("Heat", "A", 3)).toBe(critical)
    expect(CriticalStrike.get("Heat", "A", 4)).toBe(critical)
    expect(CriticalStrike.get("Heat", "A", 5)).toBe(critical)
    expect(CriticalStrike.get("Heat", "A", 6)).toBe(undefined)

    done()
}, 10)

test('parse ERA critical strike table', async (done) => {
    const xml: string = fs.readFileSync(__dirname+"/../resources/critical-strike-tables/heat.xml").toString()
    const criticals = CriticalStrike.parse(xml)
    criticals.map(critical => CriticalStrike.add(critical))
    expect(CriticalStrike.get("Heat", "E", 21)).toStrictEqual(critical1)
    expect(CriticalStrike.get("Heat", "E", 66)).toStrictEqual(critical2)
    done()
}, 10)

test('initialize Critical Strike Tables', async (done) => {
    CriticalStrike.initialize()
    expect(CriticalStrike.get("Heat", "E", 21)).toStrictEqual(critical1)
    expect(CriticalStrike.get("Heat", "E", 66)).toStrictEqual(critical2)
    expect(CriticalStrike.get("Slash", "B", 3)).toStrictEqual(critical3)
    done()
}, 10)