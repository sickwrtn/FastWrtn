import * as env from "../.env/env";
import { debug } from "../tools/debug";
import { compileCss, compileNoDebugCss } from "./compiler";

export function cssApply (){
    setInterval(()=>{
        if (document.URL.includes('/character/u/')){
            if (document.getElementById('ThemCssInit') == null && document.getElementById('ThemCss') == null){
                if (JSON.parse(localStorage.getItem(env.local_them)).css != null && JSON.parse(localStorage.getItem(env.local_them)).css != ""){
                    var cssInitApply = document.createElement('style');
                    cssInitApply.setAttribute('id','ThemCssInit');
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
                    cssApply.setAttribute('id','ThemCss');
                    cssApply.innerHTML = compileCss(JSON.parse(localStorage.getItem(env.local_them)).css.split("\n").join(""));
                    document.head.appendChild(cssInitApply);
                    document.head.appendChild(cssApply);
                    debug("insert ThemCss");
                }
            }
        }
        else{
            if (document.getElementById('ThemCssInit') != null && document.getElementById('ThemCss') != null){
                document.getElementById('ThemCssInit').remove();
                document.getElementById('ThemCss').remove();
                debug("Remove ThemCss");
            }
        }
    })
}

export function cssNoIntervalApply (){
    if (document.URL.includes('/character/u/')){
        if (document.getElementById('ThemCssInit') == null && document.getElementById('ThemCss') == null){
            if (JSON.parse(localStorage.getItem(env.local_them)).css != null && JSON.parse(localStorage.getItem(env.local_them)).css != ""){
                var cssInitApply = document.createElement('style');
                cssInitApply.setAttribute('id','ThemCssInit');
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
                cssApply.setAttribute('id','ThemCss');
                cssApply.innerHTML = compileNoDebugCss(JSON.parse(localStorage.getItem(env.local_them)).css.split("\n").join(""));
                document.head.appendChild(cssInitApply);
                document.head.appendChild(cssApply);
            }
        }
    }
    else{
        if (document.getElementById('ThemCssInit') != null && document.getElementById('ThemCss') != null){
            document.getElementById('ThemCssInit').remove();
            document.getElementById('ThemCss').remove();
        }
    }
}

export function directCssApply (code:string){
    if (document.URL.includes('/character/u/')){
        if (document.getElementById('ThemCssInit') == null && document.getElementById('ThemCss') == null){
            var cssInitApply = document.createElement('style');
            cssInitApply.setAttribute('id','ThemCssInit');
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
            cssApply.setAttribute('id','ThemCss');
            cssApply.innerHTML = compileNoDebugCss(code);
            document.head.appendChild(cssInitApply);
            document.head.appendChild(cssApply);
        }
        else{
            var EcssApply = document.getElementById("ThemCss");
            EcssApply.innerHTML = compileNoDebugCss(code);
        }
    }
    else{
        if (document.getElementById('ThemCssInit') != null && document.getElementById('ThemCss') != null){
            document.getElementById('ThemCssInit').remove();
            document.getElementById('ThemCss').remove();
        }
    }
}