import {SAXParser} from "sax-ts/build/src/sax";
import {Tag} from "sax";
import heat from "../resources/critical-strike-tables/heat-critical-strike-table.json"
import puncture from "../resources/critical-strike-tables/puncture-critical-strike-table.json"
import slash from "../resources/critical-strike-tables/slash-critical-strike-table.json"
import * as fs from "fs";


export interface CriticalStrike {
    severity: CriticalStrike.Severity
    type: CriticalStrike.Type
    span: CriticalStrike.Span
    effect: CriticalStrike.Effect
}

export namespace CriticalStrike {
    let map: Map<string, CriticalStrike> = new Map<string, CriticalStrike>()

    type Table = { crits: Array<CriticalStrike> }

    const tables: Array<Table> = [heat, slash, puncture]

    export type Severity = "A" | "B" | "C" | "D" | "E"

    export type Type = "Heat" | "Slash" | "Puncture" | "Krush"

    export type Span = [number, number]

    export type Effect = string

    export function getTypeFromString(type: string): Type {
        if ((type == "H") || (type == "Heat")) return "Heat"
        if ((type == "P") || (type == "Puncture")) return "Puncture"
        if ((type == "S") || (type == "Slash")) return "Slash"
        if ((type == "K") || (type == "Krush")) return "Krush"
        throw new Error(`Critical Strike type ${type} is undefined`)
    }

    export function getSeverityFromString(severity: string): Severity {
        if (severity == "A") return severity
        if (severity == "B") return severity
        if (severity == "C") return severity
        if (severity == "D") return severity
        if (severity == "E") return severity
        throw new Error(`Critical Strike severity ${severity} is undefined`)
    }

    export function add(critical: CriticalStrike) {
        const min: number = critical.span[0]
        const max: number = critical.span[1]
        for (let i: number = min; i <= max; i++) {
            map.set([critical.type, critical.severity, i].join(","), critical)
        }
    }

    export function get(type: Type, severity: Severity, result: number): CriticalStrike | undefined {
        return map.get([type, severity, result].join(","))
    }

    export function parse(xml: string): Array<CriticalStrike> {
        let criticals: Array<CriticalStrike> = []
        let type: Type
        let severity: Severity

        const parser = new SAXParser(true, {});

        parser.onerror = function (error: string) {
            console.error(error)
        };

        parser.onopentag = function (node: Tag) {
            switch (node.name) {
                case "criticalTable":
                    type = getTypeFromString(node.attributes["name"]);
                    break
                case "column":
                    severity = getSeverityFromString(node.attributes["severity"]);
                    break
                case "row": {
                    const critical: CriticalStrike = {
                        type: type as Type,
                        severity: severity as Severity,
                        span: [+node.attributes["low"], +node.attributes["high"]],
                        effect: node.attributes["damage"]}
                    criticals.push(critical)
                }
            }
        };

        parser.write(xml).close();
        return criticals;
    }

    export function initialize() {
        map.clear()
        tables.map(table => {
            const criticals: Table = table
            criticals.crits.forEach(critical => CriticalStrike.add(critical))
        })
    }

    export function pack() {
        const resources = __dirname+"/../resources/critical-strike-tables/"
        const files = fs.readdirSync(resources).filter(fn => fn.endsWith('.xml'))
        files.map(file => {
            const xml: string = fs.readFileSync(resources + file).toString()
            const criticals: Array<CriticalStrike> = CriticalStrike.parse(xml)
            fs.writeFileSync(resources + file.split(".")[0] +"-critical-strike-table.json",'{ "crits":'+JSON.stringify(criticals)+'}')
        })
    }

    export function toJSON(): string {
        return JSON.stringify(Array.from(map.entries()))
    }


}