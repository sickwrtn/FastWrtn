import { wrtn_api_class } from "./tools/sdk";
import { debug } from "./tools/debug";
import { one_by_one_character_prompt, simulation_prompt, focus_on_important_cases_prompt} from "./.env/MAprompt";
import * as requests from "./tools/requests";
import * as tools from "./tools/functions";
import * as frontHtml from "./.env/fronthtml";
import * as env from "./.env/env";
import * as interfaces from "./interface/interfaces";
import { popup } from "./tools/popup";
import { compileNoNCss } from "./Fast Css/compiler";
import { cssApply, cssNoIntervalApply, directCssApply } from "./Fast Css/apply";

const wrtn: interfaces.wrtn_api_class = new wrtn_api_class();

//페르소나 목록을 누를시
function persona_modal_func(menus: interfaces.chatroom_menus_class,data: Array<interfaces.characterChatProfile>,personaL: any){
    var m_i = 0;
    for (const m of data) {
        if (`${m_i}` == personaL.id) {
            var mpid = m._id; //뭔지 모르겠지만 혹시몰라서 안지움
            var name = m.name; //페르소나 이름 가져오기
            var information = m.information; //페르소나 정보 가져오기
        }
        m_i++;
    }
    const persona_popup = new popup("페르소나");
    persona_popup.open();
    var personal_modal_name = persona_popup.addTextarea("이름","나의 이름","캐릭터가 불러줄 나의 이름을 입력해 주세요",12); 
    personal_modal_name.setValue(name);
    var personal_modal_info = persona_popup.addTextarea("정보","성별,나이,외형 등","캐릭터가 기억할 나의 정보를 입력해주세요",100,100);
    personal_modal_info.setValue(information);
    //모달 등록버튼을 눌렀을시
    persona_popup.setSumbit("등록",()=>{
        //모달의 내용을 조합해 페르소나 등록 및 대표프로필로 설정
        var re = wrtn.setPersona(mpid,personal_modal_name.getValue(),personal_modal_info.getValue(),true);
        if (re.result == "SUCCESS"){
            alert("페르소나 등록 성공!");
            persona_popup.close();
            persona_change(menus);
        }
        else{
            alert("페르소나 등록 실패!");
            persona_popup.close();
        }
    })
    persona_popup.setClose("닫기",()=>{
        persona_popup.close()
        debug("personal_modal_Cbtn",3);
    })
    debug("personaL",3);
}

//Afrburning Memory 버튼 이벤트 함수
export function AfterMemory_func(){
    debug("AfterMemory",3);
    const AfterMemory_modal: any = document.createElement("modal");//Afterburning Memory 모달 팝업
    AfterMemory_modal.innerHTML = frontHtml.AfterMemory_front_html;
    const AfterMemory_tabs: any = AfterMemory_modal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(0); //주요 탭
    AfterMemory_modal.setAttribute("style","position: relative !important;\n" +
        "    z-index: 11 !important;") //이게 있어야 모달이 작동함
    const AfterMemory_textarea: any = AfterMemory_tabs.childNodes[1].childNodes.item(1); //Gemini Api key 부분
    const AfterMemory_select: any = AfterMemory_tabs.childNodes[1].childNodes[0].childNodes[1].childNodes.item(0); //select 박스
    const AfterMemory_model_textarea: any = AfterMemory_tabs.childNodes[2].childNodes.item(1); //model 부분
    const AfterMemory_limit_textarea: any = AfterMemory_tabs.childNodes[3].childNodes.item(1); //limit 부분
    const AfterMemory_btn: any = AfterMemory_tabs.childNodes[4].childNodes.item(1) //시작 버튼
    const AfterMemory_x: any = AfterMemory_tabs.childNodes[0].childNodes.item(1); //x 버튼
    const AfterMemory_close: any = AfterMemory_tabs.childNodes[4].childNodes.item(0); //닫기 버튼
    debug("AfterMemory_func",1);
    function close(){
        AfterMemory_modal.remove();   
        debug("AfterMemory_close",3);
    }
    //스토리지 가져오기
    if (JSON.parse(localStorage.getItem(env.local_Gemini_api_key)).key != null) {
        AfterMemory_textarea.value = JSON.parse(localStorage.getItem(env.local_Gemini_api_key)).key;
    }
    if (JSON.parse(localStorage.getItem(env.local_Gemini_api_key)).model != null) {
        AfterMemory_model_textarea.value = JSON.parse(localStorage.getItem(env.local_Gemini_api_key)).model;
    }
    if (JSON.parse(localStorage.getItem(env.local_Gemini_api_key)).limit != null) {
        AfterMemory_limit_textarea.value = JSON.parse(localStorage.getItem(env.local_Gemini_api_key)).limit;
    }
    if (JSON.parse(localStorage.getItem(env.local_Gemini_api_key)).select != null) {
        var sel2 = AfterMemory_select.options;
        for (let i=0; i<sel2.length; i++) {
            if (sel2[i].value == JSON.parse(localStorage.getItem(env.local_Gemini_api_key)).select) sel2[i].selected = true;
        }
    }
    //prompt textarea를 추가하기 위함
    setInterval(()=>{
        if (AfterMemory_select.value == "3"){
            if (AfterMemory_tabs.childNodes.length < 6){
                var AfterMemoryPrompt = document.createElement("div");
                AfterMemoryPrompt.innerHTML = frontHtml.AfterMemory_textarea_front_html;
                if (JSON.parse(localStorage.getItem(env.local_Gemini_api_key)).prompt != null){
                    const customPrompt: any = AfterMemoryPrompt.childNodes[0].childNodes.item(1);
                    customPrompt.value = JSON.parse(localStorage.getItem(env.local_Gemini_api_key)).prompt;
                }
                AfterMemory_tabs.insertBefore(AfterMemoryPrompt,AfterMemory_tabs.childNodes.item(2));
            }
        }
        else{
            if (AfterMemory_tabs.childNodes.length > 5){
                AfterMemory_tabs.childNodes.item(2).remove();
            }
        }
    },100)
    //이벤트 리스너 추가
    AfterMemory_close.addEventListener('click',close);
    AfterMemory_x.addEventListener('click',close);
    AfterMemory_btn.addEventListener('click',()=>{
        //limit 판단
        if (Number(AfterMemory_limit_textarea.value) > 50 || Number(AfterMemory_limit_textarea.value) < 0){
            alert("limit는 0 이상 50 이하여야 합니다.");
            return true;
        }
        alert("시간이 많이 소요되니 당황하시지말고 기다려 주세요... (확인을 누르셔야 진행됩니다.)");
        //현재 상태 로컬스토리지 저장
        if (AfterMemory_select.value == "3"){
            localStorage.setItem(env.local_Gemini_api_key,JSON.stringify({
                key : AfterMemory_textarea.value,
                model : AfterMemory_model_textarea.value,
                limit : AfterMemory_limit_textarea.value,
                select : AfterMemory_select.value,
                prompt : AfterMemory_tabs.childNodes[2].childNodes[0].childNodes.item(1).value
            }));
        }
        else{
            localStorage.setItem(env.local_Gemini_api_key,JSON.stringify({
                key : AfterMemory_textarea.value,
                model : AfterMemory_model_textarea.value,
                limit : AfterMemory_limit_textarea.value,
                select : AfterMemory_select.value,
                prompt : null
            }));
        }
        debug(`limited ${AfterMemory_limit_textarea.value}`);
        //채팅내역 + 페르소나 불러오기
        wrtn.getChatroom(document.URL.split("/")[7].split("?")[0]).getMessages("",Number(AfterMemory_limit_textarea.value) * 2).then(res => {
            var chatlog = res.data.list;
            try{
                var usernmae = wrtn.getRepresentativePersona().name;
            }
            catch{
                alert("대표프로필을 설정해주세요");
                return true;
            }
            debug("character_profiles",4);
            //select 박스 설정
            if (AfterMemory_select.value == "0"){
                var promptTemp: any = one_by_one_character_prompt;                      
                debug("selected 1 : 1 캐릭터챗");
            }
            else if (AfterMemory_select.value == "1"){
                var promptTemp: any = simulation_prompt;
                debug("selected 시뮬레이션");
            }
            else if (AfterMemory_select.value == "2"){
                var promptTemp: any = focus_on_important_cases_prompt;
                debug("selected 주요사건 위주");
            }
            else if (AfterMemory_select.value == "3"){
                var promptTemp: any = AfterMemory_tabs.childNodes[2].childNodes[0].childNodes.item(1).value;
                debug("selected 커스텀");
            }
            //gemini에게 보낼 json
            var lastContent = {
                content: []
            } 
            for (const element of chatlog) {
                if (element.role == "user"){
                    lastContent.content[lastContent.content.length] = {
                        message: element.content,
                        role: "user",
                        username: usernmae
                    }
                }
                else if (element.role == "assistant"){
                    lastContent.content[lastContent.content.length] = {
                        message: element.content,
                        role: "assistant"
                    }
                }
            }
            debug("chatlog",4);
            //프롬 추가
            if (AfterMemory_select.value != "3"){
                promptTemp.chat_log = lastContent.content;
                var gemini_text = JSON.stringify(promptTemp);
            }
            else{
                var gemini_text = promptTemp + `[대화내역]\n${JSON.stringify(lastContent)}`;
            }
            //제미니 전송
            var result = requests.out_postAfetch(env.gemini_api_url + `/v1beta/models/${AfterMemory_model_textarea.value}:generateContent?key=${AfterMemory_textarea.value}`,{
                contents: {
                    parts : [
                        {text: gemini_text}
                    ]
                }
            }).candidates[0].content.parts[0].text;
            debug("gemini compeleted");
            //뤼튼 메시지 전송은 sendLimit자 이상 보낼시 too large request 에러가 발생해서 예외처리
            if (result.length > env.sendLimit){
                if(!confirm("요약본이 너무 깁니다. 요약본을 나눠서 전송하겠습니다. 진행하시겠습니까?")){
                    return true;
                }
                var dp = Math.ceil(result.length / env.sendLimit);
                for (let index = 0; index < dp; index++) {
                    if (index != dp-1){
                        wrtn.getChatroom(document.URL.split("/")[7].split("?")[0]).send("_",false).set(result.substring(env.sendLimit * index,env.sendLimit * (index + 1)));
                    }
                    else{
                        wrtn.getChatroom(document.URL.split("/")[7].split("?")[0]).send("_",false).set(result.substring(env.sendLimit * index));
                    }
                    if(!confirm(`메시지를 나눠서 보내는중... (${index + 1}/${dp})`)){
                        return true;
                    }
                }
                debug("result DP",4);
            }
            else{
                //채팅 보내고 삭제
                wrtn.getChatroom(document.URL.split("/")[7].split("?")[0]).send("_",false).set(result);
            }
            debug("wrtn.ai message sended");
            debug("Afterburning completed");
            alert("Afterburning complete!");
            //새로고침
            document.location.reload();
            debug("AfterMemory_func",0);
        })
    })
    document.body.appendChild(AfterMemory_modal);
}

//페르소나 버튼 누를시
export function persona_change(menus){
    try{
        var data: Array<interfaces.characterChatProfile> = wrtn.getPersona();
        console.log(data);
        if (data.length == 0){
            alert("대화프로필을 만들어 해주세요.");
            return true;
        }
    }
    catch{
        alert("대화프로필을 만들어 해주세요.");
        return true;
    }
    let c: number = 0;
    if (document.getElementById("personas") != null){
        document.getElementById("personas").remove();
    }
    var persona_div = document.createElement("div");
    persona_div.setAttribute("id","personas");
    for (const datum of data) {
        const personaL = menus.get(env.persona_name).cloneNode(true);
        const for_personaL = document.createElement("div");//페르소나 한칸 띄우기
        personaL.insertBefore(for_personaL,personaL.childNodes[0]);
        const personaL_p = personaL.childNodes.item(2); //페르소나 text
        //대표 프로필일 경우 '<-' 붙이기 아니면 없음
        if (datum.isRepresentative){
            personaL_p.textContent = `${datum.name} <-`;
        }
        else {
            personaL_p.textContent = datum.name;
        }
        personaL.setAttribute("id",`${c}`) //페르소나 요소 id 지정
        personaL.addEventListener('click',() => persona_modal_func(menus,data,personaL));
        persona_div.appendChild(personaL);
        c++;
    }
    tools.insertAfter(document.getElementsByClassName("css-uxwch2").item(0),document.getElementsByClassName("css-uxwch2").item(0).childNodes.item(3),persona_div);
    debug("persona",0);
}

export function custumThem():void {
    const them_popup = new popup("커스텀 테마");
    them_popup.open();
    them_popup.setClose("닫기",()=>{
        clearInterval(directEntry);
        clearInterval(directApply);
        if (document.getElementById("ThemCssInit") != null){
            document.getElementById("ThemCssInit").remove();
        }
        if (document.getElementById("ThemCss") != null){
            document.getElementById("ThemCss").remove();
        }
        cssNoIntervalApply();
        them_popup.close();
    });
    them_popup.setSumbit("적용", ()=>{
        localStorage.setItem(env.local_them,JSON.stringify({
            css : css.getValue()
        }));
        alert("css가 적용되었습니다!");
        clearInterval(directEntry);
        clearInterval(directApply);
        them_popup.close();
        window.location.reload();
    })
    const css = them_popup.addTextarea("Fast Css 코드","ChatBackground {\nbackground:green;\n}\n주석은 /**/ 만 사용가능합니다.","원하는 Fast Css 스타일 코드을 입력해주세요. (css와 문법적 차이가 있습니다.)",undefined,300);
    css.setValue(JSON.parse(localStorage.getItem(env.local_them)).css);
    const css2 = them_popup.addTextarea("compiled Fast Css","","유효성을 검사하세요!",undefined,300);
    css2.textarea.setAttribute("disabled",null);
    const check = them_popup.addCheck("DirectlyApply","테마 제작자용 Css 실시간 적용 (저장은 적용 버튼 눌러야함, 성능 많이 잡아먹음)",false);
    check.setEventListener('click',()=>{
        if(check.getValue()){
            check.setValue(false);
            if (document.getElementById("ThemCssInit") != null){
                document.getElementById("ThemCssInit").remove();
            }
            if (document.getElementById("ThemCss") != null){
                document.getElementById("ThemCss").remove();
            }
            cssNoIntervalApply();
        }
        else{
            check.setValue(true);
        }
    })
    let directEntry = setInterval(()=>{
        css2.setValue(compileNoNCss(css.getValue()));
    },100)
    let directApply = setInterval(()=>{
        if (check.getValue()){
            directCssApply(css.getValue());
        }
    },300)
}