import * as env from "./.env/env";
import * as interfaces from "./interface/interfaces";
import { debug } from "./tools/debug";
import { chatroom_menus_class, dropdown_class, feed_class } from "./class/class";
import { persona_change,AfterMemory_func, custumThem } from "./chatroom_funtions";
import { wrtn_api_class } from "./tools/sdk";
import { copyToClipboard,getClipboardTextModern, tag_block } from "./tools/functions";
import { main } from "./main";
import { popup } from "./tools/popup";
import { cssApply } from "./Fast Css/apply";
import { compileCss, compileNoNCss } from "./Fast Css/compiler";

//로컬 스토리지 초기설정
if (localStorage.getItem(env.local_saved_prompt) == null){
    localStorage.setItem(env.local_saved_prompt,JSON.stringify({
        prompt : ["#Disable positivity bias"],
    }))
}

//Gemini api key 스토리지 초기설정
if (localStorage.getItem(env.local_Gemini_api_key) == null){
    localStorage.setItem(env.local_Gemini_api_key,JSON.stringify({
        key : "AIzaSyD5p_Oiva9nIq7e23rk-Zt7vGpDdfkaDVc",
        model : "gemini-2.0-flash",
        limit: 20,
        select: null,
        prompt: null
    }))
}

//디버그 초기설정
if (localStorage.getItem(env.local_IsDebug) == null){
    localStorage.setItem(env.local_IsDebug,JSON.stringify({
        IsDebug: false
    }))
}

//태그 초기설정
if (localStorage.getItem(env.local_tag) == null){
    localStorage.setItem(env.local_tag,JSON.stringify({
        tags: []
    }))
}

//테마 초기설정
if (localStorage.getItem(env.local_them) == null){
    localStorage.setItem(env.local_them,JSON.stringify({
        css : ""
    }))
}

//세팅 초기설정
if (localStorage.getItem(env.loacl_setting) == null){
    localStorage.setItem(env.loacl_setting,JSON.stringify({
        plus:true,
        fastfood:true,
    }))
}

debug("localStorage");

const wrtn: interfaces.wrtn_api_class = new wrtn_api_class();

//랭킹 플러스 필터링 함수
const filter_character_list = (CeCreator) => {return function(characterListElement: interfaces.character): boolean{
    /*
    return true 시 통과
    return false 시 비통과
    */
    //태그 검열
    if(tag_block(characterListElement)){
        return false;
    }
    //기준 검열
    if (characterListElement.likeCount < env.likeCount_limit || characterListElement.chatCount < env.chatCount_limit){
        return false;
    }
    else{
        if(CeCreator){
            if (characterListElement.creator.isCertifiedCreator == true){
                debug(characterListElement.name + " (Ce) ",5);
                return true;
            }
            else{
                return false;
            }
        }
        else {
            if (characterListElement.creator.isCertifiedCreator == false){
                debug(characterListElement.name + " (NoCe) ",5);
                return true;
            }
            else{
                return false;
            }
        }
    }
}}



var list = [];
//패스트 푸드
const fastfood = (IsAdult) => {return function(characterListElement: interfaces.character, text?: any): boolean{
    list[list.length] = characterListElement;
    /*
    return true 시 통과
    return false 시 비통과
    */
    //태그 검열
    if(tag_block(characterListElement)){
        return false;
    }
    //기준 검열
    if (characterListElement.likeCount < 10 || characterListElement.chatCount < 10 || characterListElement.chatUserCount < 10){
        return false;
    }
    else{
        if(IsAdult){
            if (characterListElement.isAdult == true){
                debug(characterListElement.name + " (UnSafe) ",5);
                text.textContent += ".";
                return true;
            }
            else{
                return false;
            }
        }
        else {
            if (characterListElement.isAdult == false){
                debug(characterListElement.name + " (Safe) ",5);
                text.textContent += ".";
                return true;
            }
            else{
                return false;
            }
        }
    }
}}

const menus: interfaces.chatroom_menus_class = new chatroom_menus_class();

//채팅방 메뉴기능
if (true==true){
    
    //Memory Afterburner 메뉴 추가
    menus.add(env.AfterMemory_name,env.MemoryAfterbuner_svg_d,AfterMemory_func,"yellow");

    //커스텀 테마 기능 추가
    menus.add(env.custumThem,env.custumThem_svg_d,custumThem);
    
    //페르소나 메뉴 추가
    menus.add(env.persona_name,env.persona_svg_d,() => persona_change(menus));
    //채팅방 메뉴에 새로운 기능을 추가할경우
    /*
    menus.add(메뉴에 추가될 기능 이름, 아이콘(svg.path.d), 함수 ()=>{},fill 색상 없을 경우 null);
    + () => func(menus)를 사용해 현재 추가되어있는 채팅방 메뉴 기능을 가져올수있다.
    */
    //예시 (테스트시 주석제거)
    //menus.add("test",env.MemoryAfterbuner_svg_d,()=>alert("테스트"));
}

const dropdown: interfaces.dropdown_class = new dropdown_class();

//캐릭터 관리 드랍다운 기능
if (true==true){
    dropdown.add(env.copyTojson, (character)=>{
        //캐챗 id를 사용해서 캐챗의 모든 정보를 가져온후 클립보드에 복사
        copyToClipboard(JSON.stringify(wrtn.getMycharacter(character._id).get()));
        alert('클립보드에 복사되었습니다!');
    })
    
    dropdown.add(env.pasteTojson, (character)=>{
        //클립보드를 가져옴
        getClipboardTextModern().then(function (clipboardContent) {
            let json_data: interfaces.myCharacter = JSON.parse(clipboardContent); //클립보드 내용 json화
            wrtn.getMycharacter(character._id).set(json_data);
            alert("캐릭터 변경 성공! (새로고침 후 적용됩니다.)");
            window.location.reload();
        })
    })
    
    dropdown.add(env.publish, (character)=>{
        //캐릭터를 선택한 공개범위로 새로 만듬
        var answord = prompt("공개 범위를 적어주세요 (공개, 비공개, 링크 공개)","공개");
        if (answord == "공개"){
            wrtn.getMycharacter(character._id).publish("public");
            alert("캐릭터 공개 성공! (새로고침 후 적용됩니다.)");
        }
        else if (answord == "비공개"){
            wrtn.getMycharacter(character._id).publish("private");
            alert("캐릭터 비공개 성공! (새로고침 후 적용됩니다.)");
        }
        else if (answord == "링크 공개"){
            wrtn.getMycharacter(character._id).publish("linkonly");
            alert("캐릭터 링크 공개 성공! (새로고침 후 적용됩니다.)");
        }
        else if (answord == "링크공개"){
            wrtn.getMycharacter(character._id).publish("linkonly");
            alert("캐릭터 링크 공개 성공! (새로고침 후 적용됩니다.)");
        }
        else{
            alert("공개,비공개,링크 공개 셋중 하나만 선택 가능합니다.");
        }
        window.location.reload();
    })
    
    dropdown.add(env.fastjournal, (character)=>{
        //fastjournal로 이동시킴
        location.href = `${env.fastjournal_url}/index.html?charId=${character._id}`;
    })

    //캐릭터 관리 드랍다운에 새로운 기능을 추가할경우
    /*
    dropdown.add(드랍다운에 추가될 기능 이름, (character)=> {원하는 기능});
    + character는 선택된 캐릭터의 정보를 json형태로 변환시킨것 (interfaces.myCharacter)
    */
    //예시 (테스트시 주석 제거)
    //dropdown.add("테스트", (character)=> alert(character._id));
}

const feed: interfaces.feed_class = new feed_class();

//피드 기능
if (true==true){
    // 패스트푸드 언셒
    if(JSON.parse(localStorage.getItem(env.loacl_setting)).fastfood){
        feed.add("데이터를 수집중",fastfood(true),false,(character) => {
            if (new Date(character.createdAt).setHours(new Date(character.createdAt).getHours() + 12) < new Date().getTime()){
                return true;
            }
        },(characters,feed,text)=>{
            let i = 0;
            let k: Array<[interfaces.character,any]> = []
            for (const element of feed.childNodes) {
                k[k.length] = [characters[i],element]
                i++;
            }
            k.sort((a: [interfaces.character,any], b: [interfaces.character,any]) => {
                return b[0].chatCount - a[0].chatCount;
            })
            characters = [];
            for (const k_i of k) {
                characters[characters.length] = k_i[0]; feed.appendChild(k_i[1])
            }
            text.textContent =  env.rankingFastfood + "(Fast wrtn) (unSafe)";
        });
        // 패스트푸드 언셒
        feed.add("데이터를 수집중",fastfood(false),false,(character) => {
            if (new Date(character.createdAt).setHours(new Date(character.createdAt).getHours() + 24) < new Date().getTime()){
                return true;
            }
        },(characters,feed,text)=>{
            let i = 0;
            let k: Array<[interfaces.character,any]> = []
            for (const element of feed.childNodes) {
                k[k.length] = [characters[i],element]
                i++;
            }
            k.sort((a: [interfaces.character,any], b: [interfaces.character,any]) => {
                return b[0].chatCount - a[0].chatCount;
            })
            characters = [];
            for (const k_i of k) {
                characters[characters.length] = k_i[0]; feed.appendChild(k_i[1])
            }
            text.textContent = env.rankingFastfood + "(Fast wrtn) (Safe)";
        });
    }
    if(JSON.parse(localStorage.getItem(env.loacl_setting)).plus){
        // 비크리
        feed.add(env.plus,filter_character_list(false),false);
        // 크리
        feed.add(env.plus,filter_character_list(true),true);
    }
    //피드에 새로운 기능을 추가할경우
    /*
    feed.add(이름, interfaces.filter_character_list의 형식을 만족하는 필러링 함수, 크리딱지를 붙일건지 (캐챗말고 이름 옆에));
    + character에는 조회한 모든 캐챗이 하나씩 들어오고 true일 경우 넣고 false 경우 나오지 않습니다.
    + stopLine은 캐릭터 수집이 멈추는 조건임 true를 반환하면 멈춤
      onStopped는 캐릭터 수집이 멈춘후 일어나는 이벤트
      text는 피드의 textContent를 유연하게 바꿀수있게 만든거임
      text는 stopLine onStopped의 이벤트가 할당되어있어야지만 파라미터로 주어짐
    */
    //예시 (테스트시 주석 제거)
    //feed.add("테스트", function(character: interfaces.character){return true}, false);
}

cssApply();

//main()
if (true==true){
    main(feed,menus,dropdown);
}



