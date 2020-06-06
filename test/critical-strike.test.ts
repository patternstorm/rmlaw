import {CriticalStrike} from "../src/critical-strike";
import * as fs from "fs";

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
    const xml: string = fs.readFileSync("/Users/cpani/Documents/dev/patternstorm/rmlaw/resources/critical-strike-tables/heat.xml").toString()
    const criticals = CriticalStrike.parse(xml)
    console.log(criticals)
    done()
}, 10)