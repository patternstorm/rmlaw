import { PageViewActivity } from "typescene";
import view from "./view";
import {CriticalStrike} from "../../critical-strike";
import {Attack} from "../../attack";

export default class MainActivity extends PageViewActivity.with(view) {
  path = "/";
  effect: string = "no effect"

  constructor() {
    super()
    console.log("MainActivity created");
    CriticalStrike.initialize()
    Attack.initialize()
  }

  nextEffect() {
    const result = Math.floor(Math.random() * 100) + 1
    const critical: CriticalStrike = CriticalStrike.get("Heat","C",result) as CriticalStrike
    this.effect = JSON.stringify(critical)
  }

  prevEffect() {
    const result = Math.floor(Math.random() * 150) + 1
    const attack: Attack = Attack.get("Broadsword","1",result) as Attack
    this.effect = JSON.stringify(attack)
  }

  async onManagedStateActiveAsync() {
    await super.onManagedStateActiveAsync();
    console.log("MainActivity is now active");
  }
}
