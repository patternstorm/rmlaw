import * as fs from "fs";
import {Attack} from "../src/attack";

const attack1: Attack = {
    critical_severity: "B",
    critical_type: "Krush",
    span: [133,133],
    hits: 9,
    armor: "19",
    type: "Broadsword"
}

const attack2: Attack = {
    critical_severity: undefined,
    critical_type: undefined,
    span: [73,73],
    hits: 7,
    armor: "7",
    type: "Broadsword"
}

const attack3: Attack = {
    span: [73,73],
    hits: 7,
    armor: "7",
    type: "Broadsword"
}

test('attacks storing', async (done) => {
    const attack: Attack = {
        critical_severity: "E",
        critical_type: "Heat",
        span: [60,62],
        hits: 13,
        armor: "13",
        type: "Broadsword",
    }
    Attack.add(attack)
    expect(Attack.get("Broadsword", "13", 59)).toBe(undefined)
    expect(Attack.get("Broadsword", "13", 60)).toBe(attack)
    expect(Attack.get("Broadsword", "13", 61)).toBe(attack)
    expect(Attack.get("Broadsword", "13", 62)).toBe(attack)
    expect(Attack.get("Broadsword", "13", 63)).toBe(undefined)
    expect(Attack.get("Composite Bow", "13", 62)).toBe(undefined)
    expect(Attack.get("Broadsword", "20", 62)).toBe(undefined)
    done()
}, 10)

test('parse ERA attack table', async (done) => {
    const xml: string = fs.readFileSync(__dirname+"/../resources/attack-tables/broadsword.xml").toString()
    const attacks = Attack.parse(xml)
    attacks.map(attack => Attack.add(attack))
    expect(Attack.get("Broadsword", "19", 133)).toStrictEqual(attack1)
    expect(Attack.get("Broadsword", "7", 73)).toStrictEqual(attack2)
    done()
}, 10)

test('initialize Attack Tables', async (done) => {
    Attack.initialize()
    expect(Attack.get("Broadsword", "19", 133)).toStrictEqual(attack1)
    expect(Attack.get("Broadsword", "7", 73)).toStrictEqual(attack3)
    console.log(Attack.toJSON())
    done()
}, 10)