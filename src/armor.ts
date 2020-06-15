export namespace Armor {
    export type Type = "20" | "19" |  "18" | "17" | "16" | "15" | "14" | "13" | "12" | "11" | "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2" | "1"

    export function getTypeFromString(type: string): Type {
        if (type == "20") return type
        if (type == "19") return type
        if (type == "18") return type
        if (type == "17") return type
        if (type == "16") return type
        if (type == "15") return type
        if (type == "14") return type
        if (type == "13") return type
        if (type == "12") return type
        if (type == "11") return type
        if (type == "10") return type
        if (type == "9") return type
        if (type == "8") return type
        if (type == "7") return type
        if (type == "6") return type
        if (type == "5") return type
        if (type == "4") return type
        if (type == "3") return type
        if (type == "2") return type
        if (type == "1") return type
        throw new Error(`Armor typpe ${type} is undefined`)
    }
}