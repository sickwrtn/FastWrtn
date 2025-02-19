import { wrtn_api_class } from "../tools/sdk";
import * as env from "../.env/env";
import * as interfaces from "../interface/interfaces";
import { compileCss } from "../Fast Css/compiler";
import {debug} from "../tools/debug";

const wrtn: interfaces.wrtn_api_class = new wrtn_api_class();


var keys = [];
var bar_c_list = []; //단축 내용 및 목록

function keysPressed(e) {
    keys[e.keyCode] = true;
    for (let i = 0; i < 58; i++) {
            if (keys[17] && keys[49 + i] && bar_c_list.length > i) {
            const vsm = document.getElementsByTagName("textarea").item(0);
            vsm.value = bar_c_list[i][1];
            e.preventDefault();	 // prevent default browser behavior
        }
    }
}
function keysReleased(e) {
    keys[e.keyCode] = false;
}

function onClickClose(modal: HTMLDivElement,usernote_modal_textarea: HTMLTextAreaElement,usernote_modal: HTMLDivElement): void{
    modal.appendChild(usernote_modal);
    usernote_modal_textarea.value = wrtn.getChatroom(document.URL.split("/")[7].split("?")[0]).getUsernote();
    debug("after_usernote_event",0);
}

function startAutoSummation(usernote_modal_textarea: HTMLTextAreaElement){
    /* 작동방식
    설정해둔 자동요약을 수행할 캐챗 id이랑 연동이 가능하도록 방을 만듦
    그리고 생성버튼을 누를시 요약할 유저노트내용을 textarea에서 가져온 후 캐챗에게 전송
    캐챗에게 응답을 받아온 후 그걸 다시 textarea에 기입하는 방식
    로컬스토리지에는 판 방의 id가 저장됨 그렇게 안하면 매번 방을 파서 보내야 하잖음
    업데이트 버튼은 캐챗이 업데이트 됬을경우 그걸 적용하기 위해서
    기존의 방을 버리고 새방을 파서 그 방의 id를 로컬 스토리지에 저장함
        */
    //처음 사용하면 로컬스토리지에 chatid가 없을꺼니 추가하기위해 판별하는 조건문
    if (localStorage.getItem(env.local_usernote) == null) {
        // auto_summation_characterChatId의 캐챗방을 팜
        var new_chatroom = wrtn.createChatroom(env.auto_summation_characterChatId);
        //로컬스토리지에 판 방의 id를 저장
        localStorage.setItem(env.local_usernote, new_chatroom.json._id);
        //메세지를 보냄
        var created_msg = new_chatroom.send(usernote_modal_textarea.textContent, false);
        usernote_modal_textarea.value = created_msg.get(); //textarea에 값을 반영
    } else {
        var created_chatId = localStorage.getItem(env.local_usernote); //이미 파진 채팅방을 가져옴
        //그 방에 textarea값 즉 요약할 유저노트내용을 보냄
        var created_msg = wrtn.getChatroom(created_chatId).send(usernote_modal_textarea.textContent, false);
        usernote_modal_textarea.value = created_msg.get(); //textarea에 값을 반영
    }
    debug("usernote_modal_btn",3);
}

function updateAutoSummation(){
    //새로운 방을 팜
    var new_chatroom = wrtn.createChatroom(env.auto_summation_characterChatId);
    localStorage.setItem(env.local_usernote, new_chatroom.json._id); //스토리지에 방 id 저장
    debug("usernote_modal_update_btn",3);
    alert("업데이트 되었습니다! (채팅방 확인)");
}

function onClickX(usernote: HTMLDivElement,modal: HTMLDivElement, usernote_modal: HTMLDivElement,usernote_modal_textarea: HTMLTextAreaElement){
    //메뉴의 유저노트 버튼에 이벤트 리스너 삽입
    usernote.addEventListener('click', () => onClickClose(modal,usernote_modal_textarea,usernote_modal), { once : true });
    modal.childNodes.item(0).remove(); //모달 팝업 닫기
    debug("usernote_modal_x",3)
}

function onClickUsernoteInMenu(modal: HTMLDivElement,usernote_modal: HTMLDivElement,usernote_modal_textarea: HTMLTextAreaElement){
    modal.appendChild(usernote_modal);
    usernote_modal_textarea.value = wrtn.getChatroom(document.URL.split("/")[7].split("?")[0]).getUsernote();
    debug("after_usernote_event",0);
}

function onClickCloseInBottum(usernote: HTMLDivElement,modal: HTMLDivElement, usernote_modal: HTMLDivElement,usernote_modal_textarea: HTMLTextAreaElement){
    //메뉴의 유저노트 버튼에 이벤트 리스너 삽입
    usernote.addEventListener('click', () => onClickUsernoteInMenu(modal,usernote_modal,usernote_modal_textarea),{ once : true });
    modal.childNodes.item(0).remove(); //모달 팝업 닫기
    debug("usernote_modal_new_close_btn",3)
}

function applyUsernoteSummation(usernote_modal: HTMLDivElement,usernote_modal_struct: HTMLDivElement){
    usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes.item(1).textContent = env.usernote_description;
    /*
    textarea의 내부값을 수정해도 적용이 안되는 문제가 있어서
    모달 팝업 내의 모든 버튼 이벤트 리스너를 바꿔버림
    기능이 정상작동 가능하도록
        */
    const usernote_modal_btn_c = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[2].childNodes.item(0) as HTMLButtonElement; //닫기 버튼 형식
    const usernote_modal_btn_x = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes.item(1) as HTMLButtonElement; //x 버튼 형식
    const usernote_modal_x = usernote_modal_btn_x.cloneNode(true) as HTMLButtonElement; // x 버튼 형식을 기반으로 버튼을 새로 만듦
    const usernote_modal_btn = usernote_modal_btn_c.cloneNode(true) as HTMLButtonElement; // 닫기 버튼 형식 기반으로 버튼을 새로만듬
    const usernote_modal_textarea = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes.item(1) as HTMLTextAreaElement; //textarea
    usernote_modal_textarea.value = wrtn.getChatroom(document.URL.split("/")[7].split("?")[0]).getUsernote();
    const usernote_modal_apply_btn_struct = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[2].childNodes.item(1) as HTMLButtonElement; // 수정 버튼 형식
    /*
    닫기 버튼 기반으로 새로운 수정 버튼을 만드는 이유는 수정버튼을 기존 수정버튼 형식으로 만들시 이벤트 리스너가 적용되지 않는 문제가 있음
    수정 버튼을 누르고 모달팝업이 사라진후 유저노트의 이벤트 리스너가 사라지는 기이한 현상이 생김 그래서
    수정 버튼을 한번 누르고 난 후에는 유저노트에 모달팝업을 띄워주는 이벤트 리스너를 넣음
    그래서 모달팝업의 모든 버튼 이벤트는 확장프로그램이 제어하게 설정함
        */
    const usernote_modal_apply_btn: any = usernote_modal_btn.cloneNode(true) as HTMLButtonElement; //닫기 버튼 형식 기반으로 수정 버튼을 새로만듦
    const usernote_modal_update_btn: any = usernote_modal_btn.cloneNode(true) as HTMLButtonElement; //닫기 버튼 형식 기반으로 업데이트 버튼을 만듦
    const usernote_modal_new_close_btn: any = usernote_modal_btn.cloneNode(true) as HTMLButtonElement; //닫기 버튼형식으로 새로운 닫기버튼을 만듦
    var modal = document.getElementById("web-modal") as HTMLDivElement; //모달 팝업을 가져옴
    var usernote = document.getElementsByClassName(env.usernoteModalspaceClass).item(0).childNodes.item(0) as HTMLDivElement; //유저노트를 가져옴
    debug("usernote",1);
    //메뉴속 유저노트 버튼을 누를시 모달팝업을 띄워주는 함수
    //css 수동 동기화 (닫기 버튼을 수정버튼으로 만들기 위함)
    usernote_modal_apply_btn.removeAttribute("class");
    usernote_modal_apply_btn.setAttribute("style", "    border-radius: 5px;\n" +
        "    -webkit-box-pack: center;\n" +
        "    justify-content: center;\n" +
        "    -webkit-box-align: center;\n" +
        "    align-items: center;\n" +
        "    display: flex;\n" +
        "    flex-direction: row;\n" +
        "    gap: 8px;\n" +
        "    width: fit-content;\n" +
        "    border: 1px solid transparent;\n" +
        "    padding: 0px 20px;\n" +
        "    height: 40px;\n" +
        "    background-color: var(--color_surface_primary);\n" +
        "    color: var(--color_text_ivory);\n" +
        "    font-size: 16px;\n" +
        "    line-height: 100%;\n" +
        "    font-weight: 600;\n" +
        "    cursor: pointer;");
    //수정 버튼을 누를시
    usernote_modal_apply_btn.addEventListener('click', () => {
        //해당 채팅방에 할당된 유저노트의 값을 api로 변경
        wrtn.getChatroom(document.URL.split("/")[7].split("?")[0]).setUsernote(usernote_modal_textarea.value);
        //메뉴의 유저노트 버튼에 이벤트 리스너 삽입
        usernote.addEventListener('click', () => onClickClose(modal,usernote_modal_textarea,usernote_modal),{ once : true });
        modal.childNodes.item(0).remove(); //모달 팝업 닫기
        debug("usernote_modal_apply_btn",3)
        alert("유저노트에 반영되었습니다!");
    })
    //닫기 버튼 누를시
    usernote_modal_new_close_btn.addEventListener('click', () => onClickCloseInBottum(usernote,modal,usernote_modal,usernote_modal_textarea));

    //x 버튼 누를시
    usernote_modal_x.addEventListener('click', () => onClickX(usernote,modal,usernote_modal,usernote_modal_textarea));
    usernote_modal_apply_btn.childNodes.item(0).textContent = "수정"; //버튼 이름을 변경
    //자동생성 버튼을 누를시
    usernote_modal_btn.addEventListener('click', () => startAutoSummation(usernote_modal_textarea));
    usernote_modal_update_btn.addEventListener('click', updateAutoSummation);
    /*
    밑의 코드는 기존 버튼들을 삭제후 새로운 버튼으로 대체하는 내용임
        */
    usernote_modal_btn_c.remove();
    usernote_modal_apply_btn_struct.remove();
    usernote_modal_btn_x.remove();
    usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(0).appendChild(usernote_modal_x);
    usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(2).appendChild(usernote_modal_new_close_btn);
    usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(2).appendChild(usernote_modal_apply_btn);
    usernote_modal_btn.childNodes.item(0).textContent = env.auto_summation;
    usernote_modal_update_btn.childNodes.item(0).textContent = env.auto_summation_update;
    usernote_modal_struct.appendChild(usernote_modal_update_btn);
    usernote_modal_struct.appendChild(usernote_modal_btn);
}

function checkUsernote(usernote_modal: HTMLDivElement){
    if (usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes.item(0).textContent != "유저 노트"){
        return true;
    }
    if (document.URL.split("/")[7] == undefined) {
        var e = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes.item(1) as Element;
        if (e.textContent == "캐릭터가 이 채팅방에서 반드시 기억해 줬으면 하는 내용을 적어주세요"){
            e.textContent = env.usernote_for_error;
        }
        return true;
    }
    const usernote_modal_struct = usernote_modal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes.item(0) as HTMLDivElement; //유저노트 모달팝업 구조 형식
    if (usernote_modal_struct.childNodes.length >= 3) {
        return true;
    }
    applyUsernoteSummation(usernote_modal,usernote_modal_struct);
}

//+버튼 클릭시
function clicked(targetDiv: HTMLDivElement,NBS_E: HTMLButtonElement,NS: HTMLButtonElement) {
    if (bar_c_list.length == 9){
        return alert("9개가 최대 입니다.");
    }
    const vsm = document.getElementsByTagName("textarea").item(0) as HTMLTextAreaElement; //채팅바
    if (vsm.value == ''){
        return alert("내용 입력후 추가해주세요");
    }
    const vsmc = document.createElement("div"); // 1~9버튼 추가
    vsmc.setAttribute("display","flex");
    vsmc.setAttribute("class","css-13yljkq");
    vsmc.setAttribute("id",`${bar_c_list.length}`);
    vsmc.append(`${bar_c_list.length + 1}`);
    bar_c_list[bar_c_list.length] = [bar_c_list.length,vsm.value]
    // 1~9 버튼 클릭시
    function v_clicked() {
        const vsm2 = document.getElementsByTagName("textarea").item(0) as HTMLTextAreaElement;;
        vsm2.value = bar_c_list[vsmc.id][1];
        debug(`vsmc`,3);
    }
    vsmc.addEventListener("click",v_clicked);
    targetDiv.appendChild(vsmc);
    targetDiv.appendChild(NBS_E);
    targetDiv.appendChild(NS);
    debug(`NBS`,3);
}

//-버튼 클릭시
function E_clicked() {
    const a = document.getElementById(`${bar_c_list.length-1}`) as HTMLButtonElement;
    a.remove();
    bar_c_list.pop();
    debug("NBS_E",3);
}

export function chatroom(chatroom_menus_class: interfaces.chatroom_menus_class){
    try{
        const targetDiv = document.getElementsByClassName(env.chatbarClass).item(0) as HTMLDivElement; //채팅바
        var NS = document.getElementsByClassName(env.chatbarPointbuttonClass).item(0) as HTMLButtonElement; // 파란색 -> 버튼
        if (NS == null){
            NS = document.getElementsByClassName(env.chatbarPointbutton_inactiveClass).item(0) as HTMLButtonElement;
        }
        const NBS = NS.cloneNode(true) as HTMLButtonElement; // + 버튼
        const NBS_E = NS.cloneNode(true) as HTMLButtonElement; // - 버튼
        const Cm = NBS.childNodes.item(0).childNodes.item(0) as Element; // + 버튼 svg
        const Cm_E = NBS_E.childNodes.item(0).childNodes.item(0) as Element; // - 버튼 svg
        debug("chatroom",1);
        //유저노트 자동 요약 기능
        var km = setInterval(()=>{
            const usernote_modal = document.getElementsByClassName(env.usernoteModalClass).item(0) as HTMLDivElement;//유저노트 클릭시 생기는 모달 팝업
            if (usernote_modal != null){
                checkUsernote(usernote_modal);
            }
            else if (document.URL.split("/")[4] != "u"){
                clearTimeout(km);//현재 접속한 url이 대화url이 아닐경우 반복 끝냄
                debug("else usernote");
            }
        },100)

        window.addEventListener("keydown", keysPressed, false);
        window.addEventListener("keyup", keysReleased, false);

        //모든 메뉴 적용
        chatroom_menus_class.apply((document.getElementsByClassName(env.chatroomMenuClass).item(0).childNodes[1].childNodes[0].childNodes[1] as HTMLDivElement));
        // 단축버튼
        //+버튼 추가
        Cm.setAttribute("d","M 12 12 L 12 7 L 14 7 L 14 12 L 19 12 L 19 14 L 14 14 L 14 19 L 12 19 L 12 14 L 7 14 L 7 12 L 12 12");
        targetDiv.appendChild(NBS);
        NBS.addEventListener('click',() => clicked(targetDiv,NBS_E,NS));
        //-버튼 추가
        Cm_E.setAttribute("d","M 12 12 L 7 12 L 7 14 L 19 14 L 19 12 L 12 12");
        targetDiv.appendChild(NBS_E);
        NBS_E.addEventListener('click',E_clicked);
        //파란색 -> 버튼을 맨 끝으로
        targetDiv.appendChild(NS);
        
    }catch (e){
        console.log(e);
    }
    debug("chatroom",0);
}