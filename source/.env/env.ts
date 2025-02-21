import { debug } from "../tools/debug";

//environment variables
export const wrtn_api: string = "https://api.wrtn.ai/be"; //api
export const wrtn_api2: string = "https://api2.wrtn.ai/terry"; //api1
export const wrtn_william: string = "https://william.wow.wrtn.ai"; //william
export const gemini_api_url: string = "https://generativelanguage.googleapis.com";
export const fastjournal_url: string= "https://www.fastwrtn.com";
export const scroll_all_amount: number = 300 // <  > 누를시 이동할 스크롤 양
export const scroll_amount: number = 10; // 끊어서 스크롤 되는 양
export const limit: number = 30 // 불러올 캐챗수
export const load_limit: number = 100; //불러올 기준을 만족하는 캐챗수
export const forced_limit: number = 40; //me?limite={}
export const likeCount_limit: number = 10; // 좋아요수가 10개 이상
export const chatCount_limit: number = 30; // 채팅수가 30개 이상 이면 올라옴
export const sendLimit: number = 1100; // MA기능 글자수 나눠서 보내기
export const auto_summation_characterChatId: string = "6787aecf65c02321daf25b0d"; // 자동요약기능을 수행할 캐챗 id
export const local_IsDebug: string = "debug"; //로컬스토리지 디버그 위치
export const local_Gemini_api_key: string = "Gemini Api Key"; //로컬스토리지 제미니 키 + 모델 + limit + select 저장위치
export const local_saved_prompt: string = "saved_prompt"; //로컬스토리지 프롬프트 저장 위치
export const local_usernote: string = "usernote"; //로컬스토리지 유저노트용 캐챗방 id 저장 위치
export const local_tag: string = "tags"; //로컬스토리지 태그 차단 키워드 저장 위치
export const local_them: string = "them"; //테마 css 저장 위치;
export const loacl_setting : string = "setting";
export const token_key: string = "access_token"; //쿠키중 가져올 토큰값 (조회 및 수정용 토큰 정보를 수집하지 않음)

//namespace
export const auto_summation: string = "자동요약"; //자동요약 버튼
export const auto_summation_update: string = "업데이트"; //업데이트 버튼
export const plus: string = "랭킹 플러스 (Fast wrtn)"; //랭킹플러스
export const custumThem : string = "커스텀 테마";
export const rankingFastfood: string = "패스트 푸드 ";
export const persona_name: string = "페르소나"; //페르소나
export const AfterMemory_name: string = "Memory Afterburner"; //AfterMemory 버튼
export const copyTojson: string = "copy to json"; //캐릭터 복사기능
export const pasteTojson: string = "paste to json"; //캐릭터 븥여넣기 기능
export const publish: string = "publish"; //공개 기능
export const fastjournal: string = "FastJournal"; //FastJournal 기능
export const usernote_description: string = "(Fast wrtn) 자동요약기능을 활용해 글자수를 절약해보세요! 업데이트는 가끔씩 해주시는게 좋아요!"; //유저노트 설명칸
export const usernote_for_error: string = "(Fast wrtn) 유저노트 요약기능은 새로운 캐챗이 아닌 진행중인 캐챗에서만 적용됩니다."; //처음 사용 유저노트 설명칸
export const MemoryAfterbuner_svg_d: string = "M12 2.5l2.66 6.46 6.91.6c.81.07 1.14 1.06.55 1.58l-5.21 4.53 1.56 6.73c.18.78-.68 1.42-1.35.97L12 18.86l-5.12 3.51c-.67.46-1.53-.19-1.35-.97l1.56-6.73-5.21-4.53c-.59-.51-.26-1.5.55-1.58l6.91-.6L12 2.5z";
export const persona_svg_d: string = "M 12 2 C 7 2 4 4 4 7 V 11 C 4 16 8 20 12 20 C 16 20 20 16 20 11 V 7 C 20 4 17 2 12 2 Z Z Z M 9 14 C 9 13.5 10.5 13 12 13 C 13.5 13 15 13.5 15 14 C 15 14.5 14 15 12 15 C 10 15 9 14.5 9 14 Z M 6 9 L 8 8 C 8 8 9 8 10 9 C 9.3333 9.3333 9 10 8 10 L 8 10 C 7 10 6 10 6 9 C 6 9 6 9 6 9 C 6 9 7 8 8 8 M 14 9 C 15 8 16 8 16 8 C 17 8 18 9 18 9 C 18 10 17 10 16 10 C 15 10 14.6667 9.3333 14 9";
export const custumThem_svg_d: string = "M14 2C9.58 2 6 5.58 6 10C6 14.42 9.58 18 14 18C18.42 18 22 14.42 22 10C22 5.58 18.42 2 14 2ZM14 16C10.69 16 8 13.31 8 10C8 6.69 10.69 4 14 4C17.31 4 20 6.69 20 10C20 13.31 17.31 16 14 16Z";

//class Names
export const profileBoxClass: string = "css-e5sxrv";
export const profileBoxMenuClass: string = "css-1chjrq6";
export const mainFeedClass: string = "css-1go39bq";
export const chatroomMenuClass: string = "css-1diwz7b";
export const chatbarClass: string = "css-d7pngb";
export const chatbarPointbuttonClass: string = "css-13yljkq";
export const chatbarPointbutton_inactiveClass: string = "css-oewmjm";
export const usernoteModalClass: string = "css-f3xxdk";
export const usernoteModalspaceClass: string = "css-uxwch2";
export const threeDotButtonClass: string = "css-j7qwjs";
export const dropdownClass: string = "css-1w2weol";
export const dropdownListClass: string = "css-1wh9bd4";
export const dropdownListClassWhite: string = "css-zklud";
export const myCharactersClass: string = "css-j7qwjs";
export const builderMenuClass: string = "css-xxmugq";
export const targetDivClass: string = "css-d7pngb";

try{
    debug("env");
}
catch{
    console.log("[FAST WRTN][DEBUG] [No IsDebug] env loaded");
}