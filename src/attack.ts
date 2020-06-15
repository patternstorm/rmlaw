import {SAXParser} from "sax-ts/build/src/sax";
import {Tag} from "sax";
import * as fs from "fs";
import {CriticalStrike} from "./critical-strike";
import {Armor} from "./armor";
import broadsword from "../resources/attack-tables/broadsword-attack-table.json"
import compositebow from "../resources/attack-tables/compositebow-attack-table.json"


export interface Attack {
    critical_severity?: CriticalStrike.Severity
    critical_type?: CriticalStrike.Type
    span: CriticalStrike.Span
    hits: Attack.Hits
    armor: Armor.Type
    type: Attack.Type
}

export namespace Attack {
    let map: Map<string, Attack> = new Map<string, Attack>()

    type Table = { attacks: Array<Attack> }

    const tables: Array<Table> = [broadsword, compositebow]

    export type Type = "Broadsword" | "Composite Bow"

    export type Span = [number, number]

    export type Hits = number

    export function getTypeFromString(type: string): Type {
        if (type == "Broadsword") return type;
        if (type == "Composite Bow") return type;
        throw new Error(`Attack type ${type} is undefined`)
    }

    export function add(attack: Attack) {
        const min: number = attack.span[0]
        const max: number = attack.span[1]
        for (let i: number = min; i <= max; i++) {
            map.set([attack.type, attack.armor, i].join(","), attack)
        }
    }

    export function get(type: Type, armor: Armor.Type, result: number): Attack | undefined {
        return map.get([type, armor, result].join(","))
    }

    export function parse(xml: string): Array<Attack> {
        let attacks: Array<Attack> = []
        let type: Type
        let critical_default_type: CriticalStrike.Type | undefined
        let critical_type: CriticalStrike.Type | undefined
        let critical_severity: CriticalStrike.Severity | undefined
        let armor: Armor.Type

        const parser = new SAXParser(true, {});

        parser.onerror = function (error: string) {
            console.error(error)
        };

        parser.onopentag = function (node: Tag) {
            switch (node.name) {
                case "attackTable":
                    type = Attack.getTypeFromString(node.attributes["weapon"]);
                    try {
                        critical_default_type = CriticalStrike.getTypeFromString(node.attributes["defaultCriticalType"])
                    } catch(e) {
                        critical_default_type = undefined
                    }
                    break
                case "column":
                    armor = Armor.getTypeFromString(node.attributes["AT"]);
                    break
                case "row": {
                    if (node.attributes["criticalSeverity"] == undefined) {
                        critical_type = undefined
                        critical_severity = undefined
                    } else {
                         try {
                            critical_type = CriticalStrike.getTypeFromString(node.attributes["criticalType"])
                        } catch (e) {
                            if (critical_default_type == undefined) throw e
                            else critical_type = critical_default_type
                        }
                        critical_severity = CriticalStrike.getSeverityFromString(node.attributes["criticalSeverity"])
                    }
                    const attack: Attack = {
                        critical_severity: critical_severity,
                        span: [+node.attributes["low"], +node.attributes["high"]],
                        hits: +node.attributes["hits"],
                        armor: armor,
                        type: type,
                        critical_type: critical_type
                    }
                    attacks.push(attack)
                }
            }
        };

        parser.write(xml).close();
        return attacks;
    }

    export function initialize() {
        map.clear()
        tables.map(table => {
            const array: Table = table
            array.attacks.forEach(attack => Attack.add(attack))
        })
    }

    export function pack() {
        const resources = __dirname+"/../resources/attack-tables/"
        const files = fs.readdirSync(resources).filter(fn => fn.endsWith('.xml'))
        files.map(file => {
            const xml: string = fs.readFileSync(resources + file).toString()
            const attacks: Array<Attack> = Attack.parse(xml)
            fs.writeFileSync(resources + file.split(".")[0] +"-attack-table.json",'{ "attacks":'+JSON.stringify(attacks)+'}')
        })
    }

    export function toJSON(): string {
        return JSON.stringify(Array.from(map.entries()))
    }

}