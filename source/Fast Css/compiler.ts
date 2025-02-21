import {compileKeywords} from "../.env/compile";
import { debug } from "../tools/debug";

export function compileCss(css : string): string{
    let result = css.replace(/\n/g,"");
    for (const i of compileKeywords) {
        debug(`replaced ${i[0]} -> ${i[1]}`);
        let target = new RegExp(i[0],"g");
        result = result.replace(target,i[1]);
    }
    return result;
}

export function compileNoDebugCss(css : string): string{
    let result = css.replace(/\n/g,"");
    for (const i of compileKeywords) {
        let target = new RegExp(i[0],"g");
        result = result.replace(target,i[1]);
    }
    return result;
}

export function compileNoNCss(css : string): string{
    let result = css;
    for (const i of compileKeywords) {
        let target = new RegExp(i[0],"g");
        result = result.replace(target,i[1]);
    }
    return result;
}