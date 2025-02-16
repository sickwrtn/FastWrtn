import * as interfaces from "../interface/interfaces";
import * as env from "../.env/env";
import * as requests from "./requests";
import { debug } from "./debug";
import { getCookie } from "./functions";

//Wrtn Api Control Class
//캐챗
class my_struct implements interfaces.my_struct{
    json: interfaces.myCharacter;
    constructor(data: interfaces.myCharacter){
        this.json = data;
    }
    //this.json 업데이트
    reload(): interfaces.response{
        let request = requests.getAfetch(env.wrtn_api + `/characters/me/${this.json._id}`);
        this.json = request.data;
        return request;
    }
    //json 화된 캐챗 가져오기
    get(): interfaces.myCharacter{
        let request = requests.getAfetch(env.wrtn_api + `/characters/me/${this.json._id}`);
        return request.data;
    }
    //캐챗을 입력한 json으로 변경
    set(json_data: interfaces.myCharacter): interfaces.response{
        for (const a of json_data.startingSets) {
            delete a._id;
        }
        let request = requests.patchAfetch(env.wrtn_api + `/characters/${this.json._id}`,{
            name: json_data.name,
            description: json_data.description,
            profileImageUrl: json_data.profileImage.origin,
            model: json_data.model,
            initialMessages: json_data.initialMessages,
            characterDetails: json_data.characterDetails,
            replySuggestions: json_data.replySuggestions,
            chatExamples: json_data.chatExamples,
            situationImages: json_data.situationImages,
            categoryIds: [json_data.categories[0]._id],
            tags: json_data.tags,
            visibility: json_data.visibility,
            promptTemplate: json_data.promptTemplate.template,
            isCommentBlocked: json_data.isCommentBlocked,
            defaultStartingSetName: json_data.defaultStartingSetName,
            startingSets: json_data.startingSets,
            keywordBook: json_data.keywordBook,
            customPrompt: json_data.customPrompt,
            defaultStartingSetSituationPrompt: json_data.defaultStartingSetSituationPrompt,
        });
        return request;
    }
    //캐챗 삭제
    remove(): boolean{
        let request = requests.deleteAfetch(env.wrtn_api + `/characters/${this.json._id}`);
        return request;
    }
    //캐챗을 공개
    publish(visibility:string): interfaces.response{
        let json_data = this.get(); //기본 캐챗의 json데이터
        //startingSets의 _id가 있으면 안되서 지움
        for (const a of json_data.startingSets) {
            delete a._id;
        }
        /*
        새로운 캐릭터챗을 만들때랑
        기존 캐릭터챗을 수정하는거랑
        보내야되는 json 데이터가 다름
        거기다 보내야 되는 내용에 startingSets가 []이면 안되더라
        startingSets가 없거나 아면 요소가 하나 이상 있어야됨
            */
        //위의 내용에 의거하여 startingSets가 []인지 아닌지 판별
        if (json_data.startingSets.length == 0){
            let Set_json = {
                name: json_data.name,
                description: json_data.description,
                profileImageUrl: json_data.profileImage.origin,
                model: json_data.model,
                initialMessages: json_data.initialMessages,
                characterDetails: json_data.characterDetails,
                replySuggestions: json_data.replySuggestions,
                chatExamples: json_data.chatExamples,
                situationImages: json_data.situationImages,
                categoryIds: [json_data.categories[0]._id],
                tags: json_data.tags,
                visibility: visibility,
                promptTemplate: json_data.promptTemplate.template,
                isCommentBlocked: json_data.isCommentBlocked,
                defaultStartingSetName: json_data.defaultStartingSetName,
                keywordBook: json_data.keywordBook,
                customPrompt: json_data.customPrompt,
                defaultStartingSetSituationPrompt: json_data.defaultStartingSetSituationPrompt,
                isAdult: json_data.isAdult,
            }
            var request = requests.postAfetch(env.wrtn_api + "/characters",Set_json);
        }
        else{
            let NoSet_json = {
                name: json_data.name,
                description: json_data.description,
                profileImageUrl: json_data.profileImage.origin,
                model: json_data.model,
                initialMessages: json_data.initialMessages,
                characterDetails: json_data.characterDetails,
                replySuggestions: json_data.replySuggestions,
                chatExamples: json_data.chatExamples,
                situationImages: json_data.situationImages,
                categoryIds: [json_data.categories[0]._id],
                tags: json_data.tags,
                visibility: visibility,
                promptTemplate: json_data.promptTemplate.template,
                isCommentBlocked: json_data.isCommentBlocked,
                defaultStartingSetName: json_data.defaultStartingSetName,
                startingSets: json_data.startingSets,
                keywordBook: json_data.keywordBook,
                customPrompt: json_data.customPrompt,
                defaultStartingSetSituationPrompt: json_data.defaultStartingSetSituationPrompt,
                isAdult: json_data.isAdult,
            }
            var request = requests.postAfetch(env.wrtn_api + "/characters",NoSet_json);
        }
        return request;
    }
  }
  
 class character_struct implements interfaces.character_struct{
    getHeader: RequestInit;
    postHeader: RequestInit;
    json: interfaces.character;
    constructor(data: interfaces.character){
        this.getHeader = {method : "GET", headers : {"Authorization": `Bearer ${getCookie(env.token_key)}`}};
        this.postHeader = {method : "POST",headers : {"Authorization": `Bearer ${getCookie(env.token_key)}`,"Content-Type": "application/json"},body:null};
        this.json = data;
    }
    //this.json 업데이트
    reload(): interfaces.response{
        let request = this.get()
        this.json = request.data;
        return request;
    }
    //json화된 캐릭터 가져오기
    get(): interfaces.response{
        let request = requests.getAfetch(env.wrtn_api + `/characters/${this.json._id}`)
        return request;
    }
    //댓글 가져오기
    async getComments(cursor: string,sort: string,load_limit: number) : Promise<interfaces.response | null>{
        if (cursor != "") {
            var request = await fetch(env.wrtn_api + `/characters/${this.json._id}/comments?sort=${sort}&cursor=${cursor}&limit=${load_limit}`, this.getHeader);
            debug(`GET ${env.wrtn_api + `/characters/${this.json._id}/comments?sort=${sort}&cursor=${cursor}&limit=${load_limit}`}`,2);
        }
        if (cursor == null){
            return null;
        }
        else {
            var request = await fetch(env.wrtn_api + `/characters/${this.json._id}/comments?sort=${sort}&&limit=${load_limit}`, this.getHeader);
            debug(`GET ${env.wrtn_api + `/characters/${this.json._id}/comments?sort=${sort}&&limit=${load_limit}`}`,2);
        }
        let comment = await request.json();
        return comment;
    }
  }
  
  //메세지
 class message_struct implements interfaces.message_struct{
    json: interfaces.message;
    constructor(data: interfaces.message){
        this.json = data;
    }
    //this.json 업데이트
    reload(): interfaces.response{
        let request = requests.putAfetch(env.wrtn_api + `/message/${this.json._id}`,{});
        this.json = request.data;
        return request;
    }
    //message 내용 가져오기
    get(): string{
        let request = requests.putAfetch(env.wrtn_api + `/message/${this.json._id}`,{});
        return request.data.content;
    }
    //message 내용 수정
    set(content: string): interfaces.response{
        let request = requests.patchAfetch(env.wrtn_api2 + `/characters/chat/${this.json.chatId}/message/${this.json._id}`,{
            message:content
        });
        return request;
    }
    //message 삭제
    remove(): boolean{
        let request = requests.deleteAfetch(env.wrtn_api2 + `/characters/chat/${this.json.chatId}/message/${this.json._id}`);
        return request;
    }
  }
  
  //채팅방
  class chatroom_struct implements interfaces.chatroom_struct{
    getHeader: RequestInit;
    postHeader: RequestInit;
    json: interfaces.chatroom;
    constructor(data){
        this.getHeader = {method : "GET", headers : {"Authorization": `Bearer ${getCookie(env.token_key)}`}};
        this.postHeader = {method : "POST",headers : {"Authorization": `Bearer ${getCookie(env.token_key)}`,"Content-Type": "application/json"},body:null};
        this.json = data;
    }
    //this.json 업데이트
    reload(): interfaces.response {
        let request = requests.getAfetch(env.wrtn_api2 + `/api/v2/chat-room/${this.json._id}`)
        this.json = request.data;
        return request;
    }
    //챗방 삭제
    remove(): interfaces.response{
        let request = requests.putAfetch(env.wrtn_api + '/api/v2/chat/delete',{chatIds:[this.json._id]})
        return request;
    }
    //챗방의 메시지 조회
    async getMessages(cursor: string="",load_limit: number): Promise<interfaces.response | null>{
        if (cursor != "") {
            var request = await fetch(env.wrtn_api2 + `/api/v2/chat-room/${this.json._id}/messages?limit=${load_limit}&cursor=${cursor}`, this.getHeader);
            debug(`GET ${env.wrtn_api2 + `/api/v2/chat-room/${this.json._id}/messages?limit=${load_limit}&cursor=${cursor}`}`,2);
        }
        if (cursor == null){
            return null;
        }
        else {
            var request = await fetch(env.wrtn_api2 + `/api/v2/chat-room/${this.json._id}/messages?limit=${load_limit}`, this.getHeader);
            debug(`GET ${env.wrtn_api + `/api/v2/chat-room/${this.json._id}/messages?limit=${load_limit}`}`,2);
        }
        let messages = await request.json();
        return messages;
    }
    //메시지 보내고 bind
    send(content: string,IsSuperMode: boolean): interfaces.message_struct{
        let created_msg = requests.postAfetch(env.wrtn_api2 + `/characters/chat/${this.json._id}/message`, {
            message: content,
            reroll: false,
            images: [],
            isSuperMode: IsSuperMode
        }).data;
        requests.getAfetch(env.wrtn_api2 + `/characters/chat/${this.json._id}/message/${created_msg}`);
        let recontent = requests.getAfetch(env.wrtn_api2 + `/characters/chat/${this.json._id}/message/${created_msg}/result`);
        return new message_struct(recontent.data);
    }
    //유저노트 가져오기
    getUsernote(): string{
        let request = requests.getAfetch(env.wrtn_api2 + `/api/v2/chat-room/${this.json._id}`);
        return request.data.character.userNote.content
    }
    //유저노트 입력
    setUsernote(content: string): interfaces.response{
        let request = requests.putAfetch(env.wrtn_william + `/chat-room/${this.json._id}`,{userNote: {"content":content}});
        return request;
    }
  }
  
  //메인 api class
  export class wrtn_api_class implements interfaces.wrtn_api_class{
    getHeader: RequestInit;
    postHeader: RequestInit;
    constructor(){
        this.getHeader = {method : "GET", headers : {"Authorization": `Bearer ${getCookie(env.token_key)}`}};
        this.postHeader = {method : "POST",headers : {"Authorization": `Bearer ${getCookie(env.token_key)}`,"Content-Type": "application/json"},body:null};
    }
    //유저 정보 조회
    getUser(): interfaces.response{
        let request = requests.getAfetch(env.wrtn_api + '/user');
        return request;
    }
    //슈퍼챗 관련 조회
    getSuperchat(): interfaces.response{
        let request = requests.getAfetch(env.wrtn_api + '/character-super-mode');
        return request;
    }
    //페르소나 조회
    getPersona(): Array<interfaces.characterChatProfile>{
        let wrtn_uid = requests.getAfetch(env.wrtn_api + '/user').data.wrtnUid;
        let user_pid = requests.getAfetch(env.wrtn_api + `/character-profiles/${wrtn_uid}`).data._id;
        let character_profiles = requests.getAfetch(env.wrtn_api + `/character-profiles/${user_pid}/character-chat-profiles`).data.characterChatProfiles;
        return character_profiles;
    }
    //대표프로필 조회
    getRepresentativePersona(): interfaces.characterChatProfile | null{
        let wrtn_uid = requests.getAfetch(env.wrtn_api + '/user').data.wrtnUid;
        let user_pid = requests.getAfetch(env.wrtn_api + `/character-profiles/${wrtn_uid}`).data._id;
        let character_profiles = requests.getAfetch(env.wrtn_api + `/character-profiles/${user_pid}/character-chat-profiles`).data.characterChatProfiles;
        //대표 프로필 가져오기
        for (const dpi of character_profiles) {
            if (dpi.isRepresentative == true){
                return dpi;
            }
        }
        return null;
    }
    setPersona(personaId: string,name: string,information: string,isRepresentative: boolean): interfaces.response{
        let wrtn_uid = requests.getAfetch(env.wrtn_api + '/user').data.wrtnUid;
        let user_pid = requests.getAfetch(env.wrtn_api + `/character-profiles/${wrtn_uid}`).data._id;
        let result = requests.patchAfetch(env.wrtn_api  + `/character-profiles/${user_pid}/character-chat-profiles/${personaId}`,{
            isRepresentative: isRepresentative,
            name: name,
            information: information,
        });
        return result;
    }
    //채팅방 목록
    async getChatrooms(cursor: string,load_limit:number,type: string): Promise<interfaces.response | null>{
        if (cursor != "") {
            var request = await fetch(env.wrtn_api + `/api/v2/chat?type=${type}&limit=${load_limit}&cursor=${cursor}`, this.getHeader);
            debug(`GET ${env.wrtn_api + `/api/v2/chat?type=${type}&limit=${load_limit}&cursor=${cursor}`}`,2);
        }
        if (cursor == null){
            return null;
        }
        else {
            var request = await fetch(env.wrtn_api + `/api/v2/chat?type=${type}&limit=${load_limit}`,this.getHeader);
            debug(`GET ${env.wrtn_api + `/api/v2/chat?type=${type}&limit=${load_limit}`}`,2);
        }
        let chatrooms = await request.json();
        return chatrooms;
    }
    //제작한 캐릭터 목록
    async getMycharacters(cursor: string,load_limit: number): Promise<interfaces.response | null> {
        if (cursor != ""){
            var request = await fetch(env.wrtn_api + `/characters/me?limit=${load_limit}&cursor=${cursor}`, this.getHeader);
            debug("GET " + env.wrtn_api + `/characters/me?limit=${load_limit}&cursor=${cursor}`,2);
        }
        else if (cursor == null){
            return null;
        }
        else{
            var request = await fetch(env.wrtn_api + `/characters/me?limit=${load_limit}`, this.getHeader);
            debug("GET " + env.wrtn_api + `/characters/me?limit=${load_limit}`,2);
        }
        let characters = await request.json();
        return characters;
    }
    //query를 사용한 캐릭터 조회
    async character_search(query: string,cursor: string,sort: string,load_limit: number): Promise<interfaces.response | null>{
        if (cursor != ""){
            var request = await fetch(env.wrtn_api + `/characters/search?limit=${load_limit}&query=${query}&sort=${sort}&cursor=${cursor}`);
            debug("GET " + env.wrtn_api + `/characters/search?limit=${load_limit}&query=${query}&sort=${sort}&cursor=${cursor}`,2);
        }
        else if (cursor == null){
            return null;
        }
        else{
            var request = await fetch(env.wrtn_api + `/characters/search?limit=${load_limit}&query=${query}&sort=${sort}`);
            debug("GET " + env.wrtn_api + `/characters/search?limit=${load_limit}&query=${query}&sort=${sort}`,2);
        }
        let result = await request.json();
        return result;
    }
    //query를 사용한 유저 조회
    async user_search(query: string,cursor: string,load_limit: number): Promise<interfaces.response | null>{
        if (cursor != ""){
            var request = await fetch(env.wrtn_api + `/character-profiles/search?limit=${load_limit}&query=${query}&cursor=${cursor}`);
            debug("GET " + env.wrtn_api + `/character-profiles/search?limit=${load_limit}&query=${query}&cursor=${cursor}`,2);
        }
        else if (cursor == null){
            return null;
        }
        else{
            var request = await fetch(env.wrtn_api + `/character-profiles/search?limit=${load_limit}&query=${query}`);
            debug("GET " + env.wrtn_api + `/character-profiles/search?limit=${load_limit}&query=${query}`,2);
        }
        let result = await request.json();
        return result;
    }
    //챗룸 생성
    createChatroom(charId: string): interfaces.chatroom_struct{
        let created_chatId = requests.postAfetch(env.wrtn_api + "/chat", { 
            unitId: charId,
            type: "character",
            userNote: {"content": ""}
        }).data._id;
        return this.getChatroom(created_chatId);
    }
    //캐릭터 가져오기
    getCharacter(charId: string): interfaces.character_struct{
        let request = requests.getAfetch(env.wrtn_api + `/characters/${charId}`);
        return new character_struct(request.data);
    }
    //제작한 캐릭터 불러오기
    getMycharacter(charId: string): interfaces.my_struct{
        let request = requests.getAfetch(env.wrtn_api + `/characters/me/${charId}`);
        return new my_struct(request.data);
    }
    //메시지 불러오기
    getMessage(msgId): interfaces.message_struct{
        let request = requests.putAfetch(env.wrtn_api + `/message/${msgId}`,{});
        return new message_struct(request.data);
    }
    //채팅방 불러오기
    getChatroom(chatId: string): interfaces.chatroom_struct{
        let request = requests.getAfetch(env.wrtn_api2 + `/api/v2/chat-room/${chatId}`);
        return new chatroom_struct(request.data);
    }
  }