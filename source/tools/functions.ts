import * as env from "../.env/env";
import * as interfaces from "../interface/interfaces";
import {debug} from "./debug";

//쿠키 가져오는 함수
export function getCookie(name): string | undefined {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// 클립보드의 텍스트를 가져오기
export function getClipboardTextModern(): Promise<string>{
    debug("getClipboardTextModern",0);
    return navigator.clipboard.readText(); // 붙여넣기
}

// 텍스트를 클립보드에 복사하기
export function copyToClipboard(text): void{
    navigator.clipboard.writeText(text); // 복사하기
    debug("copyToClipboard",0);
}

export function insertAfter(referenceNode,targetNode, newNode): void{
    referenceNode.insertBefore(newNode, targetNode);
    referenceNode.insertBefore(targetNode, newNode);
}

export function tag_block(characterListElement: interfaces.character): boolean{
    if (JSON.parse(localStorage.getItem(env.local_tag)).tags.length != 0){
    for (var element of JSON.parse(localStorage.getItem(env.local_tag)).tags) {
            for (var element2 of characterListElement.tags) {
                if (element == element2){
                    return true;
                }   
            }
        }
    }
    return false;
}

//cursor
export function load_in_cursor(cursor="",target_list,Target,method="",w_func): boolean | void{
    /* /character/me response
    {
        "result":"SUCCESS",
        "data":{[{data},{data},],"nextCursor":null/cursor}
    }
    */
   //cursor 구현은 재귀함수로 구현함cursor가 null일때까지 반복
   //테스트 완
    if (cursor == null){
        w_func(target_list);
        debug("load_in_cursor",0);
        return true;
    }
    if (method == "my"){
        Target.getMycharacters(cursor,env.forced_limit).then(data => {
            for (const element of data.data.characters) {
                target_list[target_list.length] = element;
            }
            load_in_cursor(data.data.nextCursor,target_list,Target,method,w_func);
        })
    }
    else if (method == "chatrooms"){
        Target.getChatrooms(cursor,env.forced_limit,"character").then(data => {
            for (const element of data.data.characters) {
                target_list[target_list.length] = element;
            }
            load_in_cursor(data.data.nextCursor,target_list,Target,method,w_func);
        })
    }
    else if (method == "messages"){
        Target.getMessages(cursor,env.forced_limit).then(data => {
            for (const element of data.data.list) {
                target_list[target_list.length] = element;
            }
            load_in_cursor(data.data.nextCursor,target_list,Target,method,w_func);
        })
    }
    else if (method == "comments"){
        Target.getComments(cursor,env.forced_limit,"likeCount").then(data => {
            for (const element of data.data.list) {
                target_list[target_list.length] = element;
            }
            load_in_cursor(data.data.nextCursor,target_list,Target,method,w_func);
        })
    }
}