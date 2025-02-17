import { debug } from "../tools/debug";
import * as env from "../.env/env";
import * as fronHtml from "../.env/fronthtml";
import { getCookie } from "../tools/functions";
import * as requests from "../tools/requests";
import * as interfaces from "../interface/interfaces"


//랭플 cursor 조회
function load_character_func(cursorL: string,feed_struct_element: any,filter_character_list: interfaces.filter_character_list,character_list: Array<interfaces.character>,loaded,feed_struct_elements,stopLine?: interfaces.stopLine, onStopped?: interfaces.onStopped, text? : any){
    /* /character response
    {
        "result":"SUCCESS",
        "data":{[{data},{data},],"nextCursor":null/cursor}
    }
    */
    fetch(env.wrtn_api + `/characters?limit=${env.limit}&sort=createdAt&cursor=${cursorL}`,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${getCookie(env.token_key)}`,
    }}).then(res => res.json()).then(data => {
        for (const element of data.data.characters) {
            if(function(){if (stopLine != undefined && onStopped != undefined) return filter_character_list(element, text);else return filter_character_list(element)}()){
                const fe = feed_struct_element.cloneNode(true);
                character_list[character_list.length] = element;
                if (fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(1) != null) {
                    fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(1).remove();
                }
                fe.setAttribute("id", loaded);
                fe.setAttribute("src", element._id)
                try {
                    fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(0).src = element.profileImage.w600;
                } catch {
                    console.log("image");
                }
                try {
                    fe.childNodes[0].childNodes[1].childNodes.item(0).textContent = element.name;
                } catch {
                    console.log("name");
                }
                try {
                    fe.childNodes[0].childNodes[1].childNodes.item(1).textContent = element.description;
                } catch {
                    console.log("info");
                }
                try {
                    fe.childNodes[1].childNodes.item(1).textContent = element.creator.nickname;
                } catch {
                    console.log("creater");
                }
                try {
                    //팝업 이벤트 리스너
                    const fe_event_bar = fe.childNodes.item(0);
                    const fe_creator_event_bar = fe.childNodes.item(1);
                    fe_creator_event_bar.addEventListener('click',()=>{
                        window.location.href = `https://wrtn.ai/character/profile/${character_list[fe.id].creator.wrtnUid}`;
                    })
                    fe_event_bar.addEventListener("click", () => {
                        const isModal = document.getElementById("web-modal");
                        //모달 존재 여부
                        if (isModal == null){
                            plus_modal_yes(character_list,fe);
                        }
                        else{
                            plus_modal_no(isModal,character_list,fe);
                        }
                    })
                } catch {
                    console.log("link");
                }
                try {
                    if (!character_list[loaded].creator.isCertifiedCreator) {
                        fe.childNodes[1].childNodes.item(2).remove();
                    }
                } catch {
                    console.log("isCertifiedCreator");
                }
                try {
                    if (!character_list[loaded].isAdult) {
                        fe.childNodes[0].childNodes[0].childNodes[2].childNodes.item(0).remove();
                    }
                } catch {
                    console.log("isCertifiedCreator");
                }
                feed_struct_elements.appendChild(fe);
                loaded++;  
            }
        }
        if (loaded < env.load_limit){
            if (stopLine != undefined && character_list.length != 0){
                if (stopLine(character_list[character_list.length - 1])){
                    onStopped(character_list,feed_struct_elements,text);
                    return true;
                }
            }
            load_character_func(data.data.nextCursor,feed_struct_element,filter_character_list,character_list,loaded,feed_struct_elements,stopLine,onStopped,text);
        }
    })
}

//플러스 랭크 내부 캐릭터 클릭시 팝업
export function plus_modal_func(Tfeed: any,filter_character_list: interfaces.filter_character_list,name:string ,CeCreator: boolean, stopLine?: interfaces.stopLine, onStopped?: interfaces.onStopped){
    const feed_struct = Tfeed.childNodes.item(1).cloneNode(true) as HTMLDivElement; //피드의 제일위에서 2번째 요소를 가져와서 형식만 가져옴
    const feed_struct_text = feed_struct.childNodes[0].childNodes[0].childNodes.item(0) as HTMLTextAreaElement; //랭킹 플러스 (Fast wrtn) <- 이거 들어간 텍스트 구역
    const feed_struct_scroll = feed_struct.childNodes[1].childNodes[0].childNodes.item(0) as HTMLDivElement; //스크롤 가져오기
    const feed_struct_elements = feed_struct.childNodes[1].childNodes[0].childNodes[0].childNodes.item(0) as HTMLDivElement; //형식에 들어있던 캐챗 목록 가져오기
    const feed_struct_element = feed_struct_elements.childNodes.item(0).cloneNode(true) as HTMLDivElement; //형식에 들어있던 캐챗중 제일 첫번째걸 형식 삼아 가져옴
    feed_struct_element.innerHTML = fronHtml.feed_struct_element_front_html;
    feed_struct_text.textContent = name;
    try {
        var feed_struct_scroll_btn = feed_struct.childNodes[1].childNodes[0].childNodes[1].childNodes.item(0) as HTMLButtonElement; // > 버튼
    }
    catch{
        var feed_struct_scroll_btn: HTMLButtonElement = null;
    }
    const feed_struct_scroll_btn_l: HTMLDivElement = document.createElement("div"); // < 버튼
    debug("plus_modal_func",1);
    feed_struct_scroll_btn_l.setAttribute("width", "61px");
    feed_struct_scroll_btn_l.setAttribute("style", "    width: 61px;\n" +
        "    height: 100%;\n" +
        "    position: absolute;\n" +
        "    top: 0px;\n" +
        "    left: -1px;\n" +
        "    z-index: 2;\n" +
        "    background: linear-gradient(90deg, rgb(26, 25, 24) 0%, rgba(26, 25, 24, 0) 100%);");
    feed_struct_scroll_btn_l.innerHTML = fronHtml.feed_front_html_scroll;
    const feed_struct_six = feed_struct.childNodes[1].childNodes.item(0) as HTMLDivElement; // < 버튼.
    // > 버튼 누를시
    if (feed_struct_scroll_btn != null){
        feed_struct_scroll_btn.addEventListener('click', () => {
            scroll_func(feed_struct_scroll,feed_struct_six,feed_struct_scroll_btn_l);
            debug("feed_struct_scroll_btn",3);
        })
    }
    /* 이 부분 부터는 랭킹 플러스 내부에 자격을 만족하는 캐릭터챗을 추가하는 기능
    근대 웃긴게 캐릭터챗을 불러오는데 시간이 걸려서 (원래 형식에 들어있어야할 캐챗을 불러오는거 말하는거임)
    한번에 알잘딱갈센으로 삭제가 안됨 그래서 기존에 남아있던 캐챗이 전부 삭제될때까지 for문 돌림
    */
    //character_list에 불러와진 캐챗이 실제 랭킹플러스에 추가됬는지 확인하기위한 배열
    var character_list = [];
    var loaded = 0;
    var IsLoaded = false;
    var cursor = "";
    var jm = setInterval(() => {
        if (document.URL != "https://wrtn.ai/character") {
            clearInterval(jm);
        }
        if (feed_struct_element.childNodes.length != 0) {
            if (feed_struct_elements.childNodes.item(0) != null){
                if ((feed_struct_elements.childNodes.item(0) as HTMLDivElement).id == "") {
                    for (const feedStructElementElement of Array.from(feed_struct_elements.childNodes)) {
                        if ((feedStructElementElement as HTMLDivElement).id == "") {
                            feedStructElementElement.remove();
                        }
                    }
                    if (!IsLoaded){
                        fetch(env.wrtn_api + `/characters?limit=${env.limit}&sort=createdAt`,{
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${getCookie(env.token_key)}`,
                        }}).then(res => res.json()).then(data => {
                            for (const element of data.data.characters) {
                                if(function(){if (stopLine != undefined && onStopped != undefined) return filter_character_list(element, feed_struct_text);else return filter_character_list(element)}()){
                                    const fe = feed_struct_element.cloneNode(true) as HTMLDivElement;
                                    character_list[character_list.length] = element;
                                    if (fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(1) != null) {
                                        fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(1).remove();
                                    }
                                    fe.setAttribute("id", String(loaded));
                                    fe.setAttribute("src", element._id)
                                    try {
                                        (fe.childNodes[0].childNodes[0].childNodes[0].childNodes.item(0) as HTMLImageElement).src = element.profileImage.w600;
                                    } catch {
                                        console.log("image");
                                    }
                                    try {
                                        fe.childNodes[0].childNodes[1].childNodes.item(0).textContent = element.name;
                                    } catch {
                                        console.log("name");
                                    }
                                    try {
                                        fe.childNodes[0].childNodes[1].childNodes.item(1).textContent = element.description;
                                    } catch {
                                        console.log("info");
                                    }
                                    try {
                                        fe.childNodes[1].childNodes.item(1).textContent = element.creator.nickname;
                                    } catch {
                                        console.log("creater");
                                    }
                                    try {
                                        //팝업 이벤트 리스너
                                        const fe_event_bar = fe.childNodes.item(0) as HTMLDivElement;
                                        const fe_creator_event_bar = fe.childNodes.item(1) as HTMLDivElement;
                                        fe_creator_event_bar.addEventListener('click',()=>{
                                            window.location.href = `https://wrtn.ai/character/profile/${character_list[fe.id].creator.wrtnUid}`;
                                        })
                                        fe_event_bar.addEventListener("click", () => {
                                            const isModal = document.getElementById("web-modal");
                                            //모달 존재 여부
                                            if (isModal == null){
                                                plus_modal_yes(character_list,fe);
                                            }
                                            else{
                                                plus_modal_no(isModal,character_list,fe);
                                            }
                                        })
                                    } catch {
                                        console.log("link");
                                    }
                                    try {
                                        if (!character_list[loaded].creator.isCertifiedCreator) {
                                            fe.childNodes[1].childNodes.item(2).remove();
                                        }
                                    } catch {
                                        console.log("isCertifiedCreator");
                                    }
                                    try {
                                        if (!character_list[loaded].isAdult) {
                                            fe.childNodes[0].childNodes[0].childNodes[2].childNodes.item(0).remove();
                                        }
                                    } catch {
                                        console.log("isCertifiedCreator");
                                    }
                                    feed_struct_elements.appendChild(fe);
                                    loaded++;
                                }
                            }
                            debug("first_charcter_section",2)
                            cursor = data.data.nextCursor;
                            load_character_func(cursor,feed_struct_element,filter_character_list,character_list,loaded,feed_struct_elements,stopLine,onStopped,feed_struct_text);
                        })
                        IsLoaded = true;
                        debug("character");
                    }
                }
            }
        }
    })
    if (feed_struct.childNodes[0].childNodes[0].childNodes.item(1) != null){
        feed_struct.childNodes[0].childNodes[0].childNodes.item(1).remove();
    }
    if (CeCreator){
        feed_struct.childNodes[0].childNodes.item(0).appendChild(feed_struct_element.childNodes[1].childNodes.item(2).cloneNode(true));
    }
    Tfeed.prepend(feed_struct);
    debug("plus_modal_func",0);
}

//< > 스크롤 기능 구현
function scroll_func(feed_struct_scroll: HTMLDivElement,feed_struct_six: HTMLDivElement, feed_struct_scroll_btn_l: HTMLDivElement){
    /*
    < > 버튼이 유동적으로 삭제될수있게끔 수정 해야함
    */
    //만약 예상되는 스크롤양이 한계를 넘어선경우 제한시킴
    if (feed_struct_scroll.scrollLeft + env.scroll_all_amount > feed_struct_scroll.scrollWidth - feed_struct_scroll.clientWidth) {
        var wanted_scroll: number = feed_struct_scroll.scrollWidth - feed_struct_scroll.clientWidth;
    } else {
        var wanted_scroll: number = feed_struct_scroll.scrollLeft + env.scroll_all_amount;
    }
    var a = setInterval(() => {
        //만약 > 버튼을 눌렀을시 < 버튼이 생기게 함 length는 < 버튼이 하나만 생기도록 제한
        if (0 < feed_struct_scroll.scrollLeft && feed_struct_six.childNodes.length < 3) {
            // < 버튼을 눌렀을시
            feed_struct_scroll_btn_l.addEventListener('click', () => {
                if (feed_struct_scroll.scrollLeft - env.scroll_all_amount < 0) {
                    wanted_scroll = feed_struct_scroll.scrollWidth - feed_struct_scroll.clientWidth;
                } else {
                    wanted_scroll = feed_struct_scroll.scrollLeft - env.scroll_all_amount;
                }
                var j = setInterval(() => {
                    if (wanted_scroll == 0) {
                        feed_struct_scroll.scrollLeft = 0;
                    } else if (feed_struct_scroll.scrollLeft > wanted_scroll) {
                        feed_struct_scroll.scrollLeft -= env.scroll_amount;
                    } else {
                        clearInterval(j);
                    }
                },)
                debug("left croll_func",3);
            })
            // < 버튼을 만듦
            feed_struct_six.insertBefore(feed_struct_scroll_btn_l, feed_struct_six.childNodes.item(0));
        }
        if (feed_struct_scroll.scrollLeft < wanted_scroll) {
            feed_struct_scroll.scrollLeft += env.scroll_amount;
        } else {
            clearInterval(a);
        }
    },)
    debug("scroll_func",0);
}
//제작자의 다른 캐릭터 보기 기능
function plus_modal_recommand_creator_func(creator_character,plus_modal_recommand_creator: HTMLDivElement,isModal){
    //최상위 엘리먼트
    const creator_character_top = plus_modal_recommand_creator.childNodes[1].childNodes.item(0) as HTMLDivElement;
    //캐챗엘리먼트 구조
    const creator_character_struct = creator_character_top.childNodes.item(0) as HTMLDivElement;
    // < 버튼,캐챗,> 버튼 상위 엘리먼트
    const creator_character_six = plus_modal_recommand_creator.childNodes.item(1) as HTMLDivElement;
    // 스크롤 양
    const creator_character_scroll = creator_character_six.childNodes.item(0) as HTMLDivElement;
    // > 버튼
    const creator_character_btn = creator_character_six.childNodes[1].childNodes.item(0) as HTMLButtonElement;
    // < 버튼
    const creater_character_struct_scroll_btn_l = document.createElement("div"); // < 버튼
    debug("plus_modal_recommand_creator_func",1);
    creater_character_struct_scroll_btn_l.setAttribute("width", "61px");
    creater_character_struct_scroll_btn_l.setAttribute("style", "    width: 61px;\n" +
        "    height: 100%;\n" +
        "    position: absolute;\n" +
        "    top: 0px;\n" +
        "    left: -1px;\n" +
        "    z-index: 2;\n" +
        "    background: linear-gradient(90deg, rgb(26, 25, 24) 0%, rgba(26, 25, 24, 0) 100%);");
    creater_character_struct_scroll_btn_l.innerHTML = fronHtml.feed_front_html_scroll;
    //버튼 클릭시 scroll 되게끔
    creator_character_btn.addEventListener('click',()=>{
        scroll_func(creator_character_scroll,creator_character_six,creater_character_struct_scroll_btn_l);
        debug("creator_character_btn",3)
    })
    var i: number = 0;
    //내부에 캐릭터 삽입
    for (const element of creator_character) {
        const creator_character_elment = creator_character_struct.cloneNode(true) as HTMLDivElement;
        creator_character_elment.setAttribute("id",String(i));
        creator_character_elment.setAttribute("src",element._id);
        (creator_character_elment.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes.item(0) as HTMLImageElement).src = element.profileImage.w600;
        creator_character_elment.childNodes[0].childNodes[0].childNodes[1].childNodes.item(0).textContent = element.name;
        creator_character_elment.childNodes[0].childNodes[0].childNodes[1].childNodes.item(1).textContent = element.description;
        creator_character_elment.childNodes[0].childNodes[1].childNodes[1].textContent = element.creator.nickname;
        if (!element.creator.isCertifiedCreator){
            creator_character_elment.childNodes[0].childNodes[1].childNodes[2].remove();
        }
        if (!element.isAdult){
            creator_character_elment.childNodes[0].childNodes[0].childNodes[0].childNodes[2].childNodes.item(0).remove();
        }
        creator_character_elment.childNodes[0].childNodes.item(0).addEventListener('click',()=>{
            plus_modal_no(isModal,creator_character,creator_character_elment);
        })
        creator_character_elment.childNodes[0].childNodes.item(1).addEventListener('click',()=>{
            window.location.href = `https://wrtn.ai/character/profile/${creator_character[creator_character_elment.id].creator.wrtnUid}`
        })
        creator_character_top.appendChild(creator_character_elment);
        i++
    }
    debug("creator_character",4);
    creator_character_struct.remove();
    debug("plus_modal_recommand_creator_func",0);
}

//팝업 내부의 업데이트와 댓글
function date_and_comment(plus_modal_date_and_comment_struct: HTMLDivElement,comment){
    if (comment.writer.profileImage == undefined){
        var guest: any  = document.createElement('div');
        //프로필사진 없는 유저의 프로필사진 대용 svg
        guest.innerHTML = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 25\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" color=\"#85837dff\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M21.7968 14.4524C20.8644 19.0092 16.8325 22.437 12 22.437C11.6548 22.437 11.3137 22.4195 10.9776 22.3854C5.935 21.8733 2 17.6147 2 12.437C2 6.91416 6.47715 2.43701 12 2.43701C17.5228 2.43701 22 6.91416 22 12.437C22 13.1274 21.93 13.8014 21.7968 14.4524ZM16 9.43701C16 11.6462 14.2091 13.437 12 13.437C9.79086 13.437 8 11.6462 8 9.43701C8 7.22787 9.79086 5.43701 12 5.43701C14.2091 5.43701 16 7.22787 16 9.43701ZM18.5786 16.9904C17.1344 19.0731 14.7265 20.437 12 20.437C9.27351 20.437 6.86558 19.0731 5.42131 16.9903C5.79777 16.4264 6.28345 15.9604 6.86686 15.5891C8.2895 14.6837 10.1521 14.437 11.9999 14.437C13.8478 14.437 15.7104 14.6837 17.133 15.5891C17.7165 15.9604 18.2022 16.4264 18.5786 16.9904Z\" fill=\"currentColor\"></path></svg>";
        guest = guest.childNodes.item(0);
        //기존 프로필사진이 들어가는 공간 삭제
        plus_modal_date_and_comment_struct.childNodes[1].childNodes[1].childNodes[0].remove();
        plus_modal_date_and_comment_struct.childNodes[1].childNodes[1].insertBefore(guest,plus_modal_date_and_comment_struct.childNodes[1].childNodes[1].childNodes.item(0));
    }
    else{
        //모달에 뜨는 댓글의 이미지
        (plus_modal_date_and_comment_struct.childNodes[1].childNodes[1].childNodes[0].childNodes.item(0) as HTMLImageElement).src = comment.writer.profileImage.w200;
    }
    //댓글 내용
    plus_modal_date_and_comment_struct.childNodes[1].childNodes[1].childNodes.item(1).textContent = comment.content;
    debug("date_and_comment",0);
}

//modal 팝업 구역이 존재할시
function plus_modal_yes(character_list,fe: HTMLDivElement){
    //새로운 모달 팝업을 생성
    const plus_modal = document.createElement("div");
    plus_modal.setAttribute("id","web-modal");
    //모달을 활성화 하는 css
    plus_modal.setAttribute("style","position: relative !important;z-index: 11 !important;");
    plus_modal.innerHTML = fronHtml.plus_modal_front_html;
    plus_modal_no(plus_modal,character_list,fe);
    document.body.appendChild(plus_modal);
    debug("plus_modal_yes",0);
}

//modal 팝업구역이 존재하지 않을시 (기능적 요소 포함)
function plus_modal_no(isModal,character_list,fe: HTMLDivElement){
    //모달을 활성화 하는 css
    isModal.setAttribute("style","position: relative !important;z-index: 11 !important;");
    isModal.innerHTML = fronHtml.plus_modal_front_html;
    //제작자의 다른 캐릭터보기 팝업용
    const plus_modal_recommand_creator: any = document.createElement('div');
    plus_modal_recommand_creator.innerHTML = fronHtml.plus_modal_recommand_creator_front_html;
    //업데이트 시간 및 댓글 기능용
    const plus_modal_date_and_comment_struct: any = document.createElement('div');
    plus_modal_date_and_comment_struct.innerHTML = fronHtml.plus_modal_date_and_comment;
    //plus_modal_date_and_comment_struct,plus_modal_recommand_creator 삽입 위치
    const plus_modal_main_struct = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(1) as HTMLDivElement;
    //모달 내부 x 버튼
    const plus_modal_x_btn = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes.item(1) as HTMLButtonElement;
    //모달 내부 대화하기 버튼
    const plus_modal_btn = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[3].childNodes.item(0) as HTMLButtonElement;
    //모달 내부 이미지
    const plus_modal_img = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes.item(0) as HTMLImageElement;
    //이미지 내부 좋아요 버튼
    const plus_modal_img_likeCount = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes.item(1) as HTMLButtonElement;
    //모달 내부 캐릭터챗 제목
    const plus_modal_title = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes.item(0) as HTMLElement;
    //크레이터 버튼 이벤트 href
    const plus_modal_creator_link = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes.item(1) as HTMLLinkElement;
    //크레이터 요소
    const plus_modal_creator = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes.item(1);
    //크레이터 뱃지를 가리킴
    const plus_modal_IsCe = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes.item(2);
    //이미지 장수, 템플릿, 셒 언셒 들어가는 부분
    const plus_modal_tabs = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes.item(1);
    //모달 내부 캐릭터 설명
    const plus_modal_text = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[2].childNodes.item(0);
    //모달 내부 태그
    const plus_modal_tags = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[2].childNodes.item(1);
    //대화 한 유저수, 좋아요수, 댓글수 넣는부분
    const plus_modal_last = isModal.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes.item(3);
    debug("plus_modal",1);
    //제작자의 캐챗 불러오기
    var creator_character = requests.getAfetch(env.wrtn_api + `/character-profiles/${character_list[fe.id].wrtnUid}/characters?limit=10&sort=createdAt`).data.characters;
    plus_modal_recommand_creator_func(creator_character,plus_modal_recommand_creator.childNodes.item(0),isModal);
    //캐릭터챗 댓글 불러오기 (가장 좋아요 많은 댓글만)
    var comment = requests.getAfetch(env.wrtn_api + `/characters/${character_list[fe.id]._id}/comments?sort=likeCount`).data.comments[0];
    plus_modal_date_and_comment_struct.childNodes[0].childNodes[1].childNodes[0].childNodes[1].textContent = `${character_list[fe.id].commentCount}건`;
    plus_modal_date_and_comment_struct.childNodes[0].childNodes[1].childNodes[0].childNodes[3].href = `/character/detail/${character_list[fe.id]._id}`;
    var update = new Date(character_list[fe.id].updatedAt);
    plus_modal_date_and_comment_struct.childNodes[0].childNodes[0].childNodes[1].childNodes.item(0).textContent = `${update.getFullYear()}.${update.getMonth()+1}.${update.getDate()}`
    if (comment == null){
        plus_modal_date_and_comment_struct.childNodes[0].childNodes[1].remove();
    }
    else{
        date_and_comment(plus_modal_date_and_comment_struct.childNodes.item(0),comment);
    }
    plus_modal_last.childNodes[0].childNodes[0].childNodes.item(1).textContent = character_list[fe.id].chatUserCount;
    plus_modal_last.childNodes[1].childNodes[0].childNodes.item(1).textContent = character_list[fe.id].likeCount;
    plus_modal_last.childNodes[2].childNodes[0].childNodes.item(1).textContent = character_list[fe.id].commentCount;
    plus_modal_main_struct.appendChild(plus_modal_date_and_comment_struct);
    plus_modal_main_struct.appendChild(plus_modal_recommand_creator);
    plus_modal_img_likeCount.textContent = character_list[fe.id].likeCount;
    plus_modal_creator_link.href = `https://wrtn.ai/character/profile/${character_list[fe.id].creator.wrtnUid}`
    const plus_modal_tags_struct = plus_modal_tags.childNodes.item(0).cloneNode(true);
    plus_modal_tags.childNodes.item(0).remove();
    //태그 넣기
    for (const element of character_list[fe.id].tags) {
        const new_tags = plus_modal_tags_struct.cloneNode(true);
        new_tags.textContent = `#${element}`;
        plus_modal_tags.appendChild(new_tags);
    }
    debug("character_list.tags",4);
    //언셒 마크
    var plus_modal_IsAudult : any = document.createElement('div');
    plus_modal_IsAudult.innerHTML = fronHtml.plus_modal_front_html_IsAudlt;
    plus_modal_img.src = character_list[fe.id].profileImage.w600;
    plus_modal_title.textContent = character_list[fe.id].name;
    plus_modal_creator.textContent = character_list[fe.id].creator.nickname;
    plus_modal_tabs.childNodes[1].childNodes.item(1).textContent = character_list[fe.id].promptTemplate.name;
    plus_modal_text.textContent = character_list[fe.id].description;
    //언셒이면 언셒마크 추가
    if (character_list[fe.id].isAdult){
        plus_modal_tabs.appendChild(plus_modal_IsAudult);
    }
    //이미지 있으면 이미지 마크 추가
    if (!character_list[fe.id].hasImage){
        plus_modal_tabs.childNodes.item(0).remove();
    }
    else{
        plus_modal_tabs.childNodes[0].childNodes.item(1).textContent = `이미지 ${character_list[fe.id].imageCount}장`;
    }
    //크레이터면 크레이터 뱃지 추가
    if (!character_list[fe.id].creator.isCertifiedCreator){
        plus_modal_IsCe.remove();
    }
    //모달 내부 x버트 이벤트리스너
    plus_modal_x_btn.addEventListener('click',()=>{
        isModal.remove();
        debug("plus_modal_x_btn",3)
    })
    //대화하기 버튼 이벤트 리스너
    plus_modal_btn.addEventListener('click',()=>{
        window.location.href = `https://wrtn.ai/character/u/${fe.getAttribute("src")}`;
    })
    debug("plus_modal_no",0);
}

export function character(feed_class: interfaces.feed_class){
    /*
    정확한 명칭을 잘모르겠어서 일단 피드라고 했는데
    처음 들어가면 태그 반뜨 뭐 이런거 뜨잖아?
    그것들의 상위 엘리먼트임 정확하게는
        */
    var Tfeed = document.getElementsByClassName(env.mainFeedClass).item(0) as HTMLDivElement; // 피드를 가져옴
    // 랭킹 플러스 기준
    //랭킹 플러스
    if (Tfeed != null) {
        feed_class.listen(Tfeed);
    }
    debug("character",0);
}