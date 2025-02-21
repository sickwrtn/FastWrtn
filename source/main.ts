import * as env from "./.env/env";
import * as interfaces from "./interface/interfaces";
import { debug } from "./tools/debug";
import { getCookie } from "./tools/functions";
import { chatroom } from "./core/chatroom";
import { my } from "./core/myChatacters";
import { character } from "./core/feed";
import { debug_btn } from "./core/profile";

//main()
function core(feed: interfaces.feed_class,menus: interfaces.chatroom_menus_class,dropdown: interfaces.dropdown_class): void{
    //캐릭터 플러스 랭킹 기능
    if (document.URL.split("/")[3] == "character" && document.URL.split("/").length == 4){
        debug_btn();
        character(feed);
        debug("asd");
    }

    //채팅방 기능
    if (document.URL.split("/")[4] == "u"){
        chatroom(menus);
    }

    //캐릭터 관리
    if (document.URL.split("/")[4] == "my"){
        my(dropdown);
    }

    //캐릭터 만들기
    if (document.URL.split("/")[4] != undefined){
        if (document.URL.split("/")[4].split("?")[0] == "builder"){
            //builder();
        }
    }
    debug('main',0);
}

export function main(feed: interfaces.feed_class,menus: interfaces.chatroom_menus_class,dropdown: interfaces.dropdown_class): void{
    //real-time apply
    var lastest = "";
    setInterval(()=>{
        if (getCookie(env.token_key) != undefined){
            if (lastest != document.URL){
                //character
                if (document.URL == "https://wrtn.ai/character"){
                    core(feed,menus,dropdown);
                }
                //character/builder
                if (document.URL.split("/")[4] != undefined){
                    if (document.URL.split("/")[4].split("?")[0] == "builder"){
                        core(feed,menus,dropdown);
                    }
                }
                //character/my
                if (document.URL.split("/")[4] == "my"){
                    core(feed,menus,dropdown);
                }
                debug(`${lastest} -> ${document.URL}`);
            }
            //character/u
            const targetDiv = document.getElementsByClassName(env.targetDivClass).item(0);
            if (targetDiv != null) {
                if (targetDiv.childNodes.length < 5) {
                    debug(`if targetDiv != null`);
                    core(feed,menus,dropdown);
                }
            }
        }
        lastest = document.URL;
    })
}