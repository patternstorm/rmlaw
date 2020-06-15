declare module '*-attack-table.json' {
    import {Attack} from "./attack";
    const content: {attacks: Array<Attack>};
    export default content;
}