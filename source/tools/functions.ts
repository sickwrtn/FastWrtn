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

function transformData(input) {
    const output = [];
  
    for (let i = 0; i < input.length; i++) {
      const currentArray = input[i];
  
      if (currentArray.length === 1) {
        // 섹션만 있는 경우 다음 배열의 첫 번째 요소를 코드로 사용
        if (i + 1 < input.length && input[i + 1].length > 0) {
            output.push([currentArray[0], input[i + 1][0]]);
            //사용한 code는 다음 반복문에서 제외하기 위해 빈 배열로 만들어준다.
            input[i+1].shift();
        } else {
          // 섹션만 있고 다음에 코드가 없는 경우 (에러 처리 또는 기본값 설정 가능)
          output.push([currentArray[0], ""]); // 빈 문자열을 코드 값으로 사용
        }
      } else if (currentArray.length === 2) {
        // 섹션과 코드가 함께 있는 경우
        output.push(currentArray);
      }
    }
  
    return output;
  }
  

export function compileCss(css : string){
    let s = css.split("\n").join("");
    let s_f = s.split("{");
    let m = [];
    for (const element of s_f) {
        m[m.length] = element.split("}");
    }
    let trans = transformData(m);
    for (let index = 0; index < trans.length; index++) {
        trans[index][0] = trans[index][0].replace(" ","");
    }
    trans.pop();
    let result = {};
    for (const i of trans) {
        result[i[0]] = i[1];
    }
    return result;
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