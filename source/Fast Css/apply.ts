import * as env from "../.env/env";
import { compileCss } from "./compiler";

export function cssApply (){
    if (JSON.parse(localStorage.getItem(env.local_them)).css != null && JSON.parse(localStorage.getItem(env.local_them)).css != ""){
        var cssInitApply = document.createElement('style');
        cssInitApply.innerHTML = `
            .css-1ah7q4v {
            background : transparent;
            }
            .css-1e3ks9w {
            background : transparent;
            }
            .css-dorp2h {
            background : transparent;
            }`;
        var cssApply = document.createElement('style');
        cssApply.innerHTML = compileCss(JSON.parse(localStorage.getItem(env.local_them)).css.split("\n").join(""));
        document.head.appendChild(cssInitApply);
        document.head.appendChild(cssApply);
    }
}