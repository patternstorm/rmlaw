import { HMR } from "@typescene/webapp";
import JSX, {bind} from "typescene/JSX";

export default HMR.enableViewReload(
  module,
    <flowcell
        margin="auto"
        padding={16}
        dropShadow={0.5}
        borderRadius={8}
    >
        <row>
            <h3>Counter</h3>
        </row>
        <row>
            <label>The current effect is {bind("effect")}</label>
        </row>
        <spacer />
        <row>
            <outlinebutton onClick="nextEffect()">
                Up
            </outlinebutton>
            <outlinebutton onClick="prevEffect()">
                Down
            </outlinebutton>
        </row>
    </flowcell>
);
