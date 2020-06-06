import {SAXParser} from "sax-ts/build/src/sax";
import {Tag} from "sax";


export class CriticalStrike {
    severity: CriticalStrike.Severity
    type: CriticalStrike.Type
    span: CriticalStrike.Span
    effect: CriticalStrike.Effect

    constructor(type: CriticalStrike.Type,
                severity: CriticalStrike.Severity,
                span: CriticalStrike.Span,
                effect: CriticalStrike.Effect) {
        this.severity = severity
        this.type = type
        this.span = span
        this.effect = effect
    }

}

export namespace CriticalStrike {
    let map: Map<string, CriticalStrike> = new Map<string, CriticalStrike>()

    export type Severity = "A" | "B" | "C" | "D" | "E"

    export type Type = "Heat" | "slash"

    export type Span = [number, number]

    export type Effect = string


    export function add(critical: CriticalStrike) {
        const min: number = critical.span[0]
        const max: number = critical.span[1]
        for(let i: number = min; i <= max; i++) {
             map.set([critical.type, critical.severity, i].join(","), critical)
        }
    }

    export function get(type: Type, severity: Severity, result: number): CriticalStrike | undefined {
        return map.get([type, severity, result].join(","))
    }

    export function parse(xml: string):Array<CriticalStrike> {
        let criticals: Array<CriticalStrike> = []
        let type: string
        let severity: string = ""

        const parser = new SAXParser(true, {});

        parser.onerror = function (error: string) {
            console.error(error)
        };

        parser.onopentag = function (node: Tag) {
            switch(node.name) {
                case "criticalTable": type = node.attributes["name"]; break
                case "column": severity = node.attributes["severity"]; break
                case "row": {
                    const critical: CriticalStrike = new CriticalStrike(
                        type as Type,
                        severity as Severity,
                        [+node.attributes["low"], +node.attributes["high"]],
                        node.attributes["damage"])
                    criticals.push(critical)
                }
            }
        };

        parser.write(xml).close();
        return criticals;
    }

    export function initialize() {
        // fs.readdir(testFolder, (err, files) => {
        //     files.forEach(file => {
        //         console.log(file);
        //     });
        // });
    }


}