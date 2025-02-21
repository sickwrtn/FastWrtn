
//#region 파라미터 함수 규격
//#region chatroom_menus_class의 item: Array<[string,string,interfaces.onClickChatroom_menus,string]>
export interface onClickChatroom_menus extends EventListener{ 
    /**
     * 채팅방 메뉴의 기능을 눌렀을 경우 실행되는 함수
     * @param {chatroom_menus_class} menus 현재 등록되있는 메뉴들이 들어있는 클래스
     */
    (menus?: chatroom_menus_class): void 
}

//#region feed_class의 item: Array<[string,interfaces.filter_character_list,boolean,interfaces.stopLine,interfaces.onStopped]>
export interface filter_character_list {
    /**
     * 피드에 올라갈 캐릭터를 기준에 따라 필터링하는 함수
     * @param {character} character 필터링할 캐릭터
     * @param {any} text 필터링중에 진행도를 피드의 제목에 실시간으로 보여주기 위해 피드의 제목부분을 가져옴
     * @returns {boolean} true면 피드에 올라감 
     */ 
    (character: character, text?: any): boolean 
}
export interface stopLine { 
    /**
     * 조회를 중간에 멈추는 함수
     * @param {character} character 현재 마지막으로조회된 캐릭터의 정보
     * @returns {boolean} true면 조회를 멈춤
     */
    (character?: character): boolean 
}
export interface onStopped { 
    /**
     * 조회를 멈추면 실행되는 함수
     * @param {characters} characters 피드에 올라간 캐릭터의 리스트
     * @param {any} feed 피드
     * @param {text} text 필터링중에 진행도를 피드의 제목에 실시간으로 보여주기 위해 피드의 제목부분을 가져옴
     */
    (characters?: Array<character>,feed?: any, text?: any): void
}

//#region dropdown_class의 item: Array<[string,interfaces.onClickDropdown]>;
export interface onClickDropdown { 
    /**
     * 드랍다운의 버튼을 누를시 실행되는 함수
     * @param {myCharacter} character 현재 선택된 캐릭터 
     */
    (character?: myCharacter): void; 
}

//#region 클래스 규격
export interface chatroom_menus_class {
    /**
     * 채팅방 메뉴에 추가될 기능 리스트
     */
    item: Array<[string,string,onClickChatroom_menus,string]>;
    /**
     * 현재 채팅방 메뉴에 올라가있는 기능 리스트
     */
    listeners: Array<HTMLButtonElement>;
    /**
     * 채팅방 메뉴 Element
     */
    menu: HTMLDivElement;
    /**
     * 채팅방 메뉴에 기능을 추가하는 함수
     * @param {string} name 추가할 메뉴의 이름
     * @param {string} svg  추가할 메뉴의 svd.path 의 d
     * @param {onClickChatroom_menus} func 메뉴를 누를시 실행되는 함수
     * @param {string} color 추가할 메뉴의 색깔
     */
    add(name: string,svg: string,func: onClickChatroom_menus,color?: string): void;
    /**
     * 추가된 메뉴중 name에 하당하는 Element를 가져옴
     * @param {string} name 가져올 메뉴 이름 
     * @return {any | undefined} Element 반환
     */
    get(name: string): any | undefined;
    /**
     * 실제로 적용시키는 함수
     * @param {any} menu 현재 메뉴 Element 
     */
    apply(menu: HTMLDivElement): void;
}

export interface dropdown_class {
    /**
     * 추가된 드랍다운 리스트
     */
    item: Array<[string,onClickDropdown]>;
    /**
     * 드랍다운을 추가하는 함수
     * @param {string} name 추가될 드랍다운의 이름
     * @param {onClickChatroom_menus} funtion 드랍다운 클릭시 실행되는 함수
     */
    add(name: string,funtion: onClickDropdown): void;
    /**
     * 실제로 적용 시키는 함수
     * @param {any} tipbar 드랍다운 div Element 
     * @param {any} tipbar_struct 양식용 드랍다운 Element
     * @param {number} selected 현재 몇번째 캐릭터를 선택중인지
     */
    listen(tipbar: HTMLCollectionOf<Element>,tipbar_struct: HTMLButtonElement,selected: number): void;
}

export interface feed_class {
    /**
     * 추가된 피드 리스트
     */
    item: Array<[string,filter_character_list,boolean,stopLine?,onStopped?]>;
    /**
     * 피드를 추가하는 함수
     * @param {string} name 추가될 피드의 이름
     * @param {filter_character_list} filter_character_list 추가될 피드의 캐릭터가 올라가는 기준 함수
     * @param {boolean} CeCreator 크리에이터 뱃지 여부
     * @param {stopLine} stopLine 캐릭터 조회가 멈추는 기준함수
     * @param {onStopped} onStopped 캐릭터 조회가 끝나면 실행되는함수
     */
    add(name: string, filter_character_list: filter_character_list, CeCreator: boolean, stopLine?: stopLine, onStopped? : onStopped): void;
    /**
     * 실제로 적용 시키는 함수
     * @param {any} Tfeed 피드 Element
     */
    listen(Tfeed: HTMLDivElement): void;
}

export interface my_struct {
    /**
     * 캐릭터의 json 데이터
     */
    json: myCharacter;
    /**
     * 캐릭터의 json 데이터를 세로고침
     */
    reload(): response;
    /**
     * 캐릭터의 json 데이터를 가져옴
     */
    get(): myCharacter;
    /**
     * 캐릭터를 json 데이터로 덮어씌움
     * @param {myCharacter} json_data 덮어씌울 json 데이터  
     */
    set(json_data: myCharacter): response;
    /**
     * 캐릭터 삭제
     * @returns 성공시 true 아니면 false
     */
    remove(): boolean
    /**
     * 캐릭터를 새로 만들어서 공개범위를 설정해 공개
     * @param {string} visibility 공개범위는 public,private,linkonly 가있음 
     */
    publish(visibility:string): response
}

export interface character_struct {
    getHeader: RequestInit;
    postHeader: RequestInit;
    /**
     * 캐릭터의 json 데이터
     */
    json: character;
    /**
     * 캐릭터의 json 데이터를 새로고침
     */
    reload(): response;
    /**
     * 캐릭터의 json 데이터를 가져옴
     */
    get(): response;
    /**
     * 캐릭터의 댓글 목록을 가져옴 (비동기 함수)
     * @param {string} cursor 커서 
     * @param {string} sort createdAt, likeCount 가져오는 기준
     * @param {number} load_limit 가져올 개수
     */
    getComments(cursor: string,sort: string,load_limit: number): Promise<response | null>;
}

export interface message_struct{
    /**
     * 메세지의 json 데이터
     */
    json: message;
    /**
     * 메세지의 json 데이터를 새로고침
     */
    reload(): response;
    /**
     * 메시지 내용을 가져옴
     * @returns message.content
     */
    get(): string;
    /**
     * 메시지의 내용을 수정함
     * @param {string} content 수정할내용 
     */
    set(content: string): response;
    /**
     * 메시지 삭제
     * @returns 삭제 성공시 true 아니면 fasle
     */
    remove(): boolean;
}

export interface chatroom_struct{
    getHeader: RequestInit;
    postHeader: RequestInit;
    /**
     * 채팅방의 json 데이터
     */
    json: chatroom;
    /**
     * 채팅방의 json 데이터 새로고침
     */
    reload(): response;
    /**
     * 채팅방 삭제
     */
    remove(): response;
    /**
     * 
     * @param {string} cursor 커서
     * @param {number} load_limit 가져올 개수
     */
    getMessages(cursor: string,load_limit: number): Promise<response | null>;
    /**
     * 해당 채팅방에 message를 보내고 받아옴
     * @param {string} content 보낼 내용 
     * @param {boolean} IsSuperMode 슈퍼챗 사용 여부
     * @returns {message_struct} 보낸후 응답을 message_struct에 담아서 반환 
     */
    send(content: string, IsSuperMode: boolean): message_struct;
    /**
     * 유저노트 가져오기
     */
    getUsernote(): string;
    /**
     * 유저노트 설정
     * @param {string} content 설정할 유저노트 내용  
     */
    setUsernote(content: string): response;
}

export interface wrtn_api_class{
    getHeader: RequestInit;
    postHeader: RequestInit;
    /**
     * 유저 정보 조회
     */
    getUser(): response;
    /**
     * 슈퍼챗 정보 조회
     */
    getSuperchat(): response;
    /**
     * 대화 프로필 가져오기
     */
    getPersona(): Array<characterChatProfile>;
    /**
     * 대표 대화 프로필 가져오기
     */
    getRepresentativePersona(): characterChatProfile | null;
    /**
     * 대화 프로필 수정
     * @param {string} personaId mongdb id 
     * @param {string} name 대화 프로필 이름
     * @param {string} information 대화 프로필 정보
     * @param {boolean} isRepresentative 대표 프로필로 설정할건지
     */
    setPersona(personaId: string,name: string,information: string,isRepresentative: boolean): response;
    /**
     * 채팅방 목록 가져오기 json data
     * @param {string} cursor 커서
     * @param {number} load_limit 가져올개수 
     * @param type character로 설정할것
     */
    getChatrooms(cursor: string,load_limit:number,type: string): Promise<response | null>;
    /**
     * 내 캐릭터를 가져오기
     * @param cursor 커서
     * @param load_limit 가져올 개수 
     */
    getMycharacters(cursor: string,load_limit: number): Promise<response | null>;
    /**
     * 캐릭터 검색
     * @param {string} query 검색할 내용 
     * @param {string} cursor 커서
     * @param {string} sort createdAt,likeCount,chatCount 정렬기준
     * @param {number} load_limit 가져올 개수
     */
    character_search(query: string,cursor: string,sort: string,load_limit: number): Promise<response | null>;
    /**
     * 유저 검색
     * @param query 검색할 내용 
     * @param cursor 커서
     * @param load_limit 가져올 개수
     */
    user_search(query: string,cursor: string,load_limit: number): Promise<response | null>;
    /**
     * 해당 charId의 캐릭터의 방을 만들기
     * @param {charId} charId mongodb id
     * @returns chatroom_struct
     */
    createChatroom(charId: string): chatroom_struct;
    /**
     * 해당 charId의 캐릭터 정보 가져오기
     * @param charId mongodb id
     * @returns character_struct
     */
    getCharacter(charId: string): character_struct;
    /**
     * 해당 charId의 내 캐릭터 정보 가져오기
     * @param charId mongodb id
     * @returns my_struct
     */
    getMycharacter(charId: string): my_struct;
    /**
     * 해당 msId의 메시지 정보 가져오기
     * @param msgId mongodb id
     * @returns message_struct
     */
    getMessage(msgId): message_struct;
    /**
     * 해당 chatId의 채팅방 정보 가져오기
     * @param chatId mongodb id
     * @returns chatroom_struct
     */
    getChatroom(chatId: string): chatroom_struct;
}


export interface popupElement {
    /**
     * label element
     */
    label: HTMLLabelElement;
    /**
     * textarea element
     */
    textarea: HTMLTextAreaElement;
    /**
     * element의 요소를 변경
     * @param placeholder placeholder 을 변경
     * @param textareaInformaition 라벨밑의 설명란
     * @param maxlength 최대입력글자수
     * @param height 높이
     * @param width 너비
     */
    set(placeholder?: string,textareaInformaition?: string | null,maxlength?: number,height?:number,width?: number): void;
    /**
     * textarea.value 값 가져오기
     * @returns 값
     */
    getValue(): string;
    /**
     * textarea.value 변경
     * @param content 변경할 내용
     */
    setValue(content: string): void;
}

export interface popupCheckElement {
    /**
     * checkBox div Element
     */
    check : HTMLDivElement;
    /**
     * 체크박스 설정
     * @param name 이름
     * @param informaition 설명
     * @param is boolean
     */
    set(name: string,informaition: string,is?:boolean): void;
    /**
     * 체크박스 값 설정
     * @param is boolean
     */
    setValue(is:boolean): void;
    /**
     * 체크박스 값 가져오기
     */
    getValue(): boolean;
}

export interface popup {
    /**
     * web-modal 객체
     */
    modal: Element;
    /**
     * top,middle,bottum ChildNode로 구성된 Element
     */
    tabs: HTMLDivElement;
    /**
     * 모달팝업기준 제일 상단 제목과 x버튼 부분
     */
    top: HTMLDivElement;
    /**
     * 모달팝업기준 중간의 textarea 및 label이 있는 부분
     */
    middle: HTMLDivElement;
    /**
     * 모달팝업기준 닫기, 등록하기? 등이 있는 부분
     */
    bottum: HTMLDivElement;
    /**
     * 모달팝업 띄우기
     */
    open(): void;
    /**
     * 모달팝업 닫기
     */
    close(): void;
    /**
     * 모달팝업의 등록(name으로 지정) 버튼 부분
     * @param name 버튼 이름
     * @param func 클릭시 실행될 함수
     */
    setSumbit(name: string, func: EventListener);
    /**
     * 모달팝업의 x아이콘, 닫기(name으로 지정) 버튼 부분
     * @param name 버튼 이름
     * @param func 클릭시 실행될 함수
     */
    setClose(name: string, func: EventListener)
    /**
     * label 및 textarea를 추가
     * @param name label의 내용
     * @param placeholder placeholder
     * @param textareaInformaition 라벨밑의 정보란
     * @param maxlength 최대입력글자수
     * @param height 높이
     * @param width 너비
     * @returns 만들어진 Element를 popupElement 형태로 반환
     */
    addTextarea(name: string,placeholder?: string,textareaInformaition?: string | null,maxlength?: number,height?: number,width?: number): popupElement;
    /**
     * checkBox를 추가
     * @param name 이름
     * @param informaition 정보 
     * @param is boolean
     */
    addCheck(name: string,informaition: string,is:boolean): popupCheckElement;
}


export interface ids {
    _id? : string;
    wrtnUid?: string;
    userId?: string;
    chatId? : string;
    turnId? : string;
    parentTurnId? : string;
    characterProfileId? : string;
}

export interface creator extends ids{
    nickname: string;
    isCertifiedCreator: boolean;
}

export interface categorie extends ids{
    name: string;
    recommendDescription: string;
}

export interface profileImage{
    origin: string;
    w200: string;
    w600: string;
}

export interface icon{
    dark: string;
    light: string;
}

export interface promptTemplate{
    name: string;
    template: string;
    icon: icon;
}

export interface chatExample{
    user: string;
    character: string;
}

export interface startingSet extends ids{
    name: string,
    initialMessages: Array<string>;
    situationPrompt: string;
    replySuggestions: Array<string>;
}

export interface keywordBook{
    name: string;
    keywords: Array<string>;
    prompt: string;
}

export interface situationImage{
    situation: string;
    keyword: string;
    imageUrl: string;
}

export interface myCharacter extends ids{
    initialMessages: Array<string>;
    creator: creator;
    name: string;
    description: string;
    categories: Array<categorie>;
    chatCount: number;
    chatUserCount: number;
    likeCount: number;
    imageCount: number;
    tags: Array<string>;
    hasImage: boolean;
    isLiked: boolean;
    isDisliked: boolean;
    countryCode: string;
    status: string;
    visibility:  string;
    profileImage: profileImage;
    replySuggestions: Array<string>;
    createdAt: string;
    updatedAt: string;
    isAdult: boolean;
    isConvertedToAdult: boolean;
    commentCount: number;
    promptTemplate: promptTemplate;
    badges: [];
    snapshotId: string;
    model: string;
    characterDetails?: string;
    customPrompt?: string;
    chatExamples: Array<chatExample>;
    situationImages: Array<situationImage>;
    dislikeCount: number;
    startingSets: Array<startingSet>;
    isCommentBlocked: boolean;
    defaultStartingSetName: string;
    keywordBook: Array<keywordBook>;
    defaultStartingSetSituationPrompt: string;
}

export interface writer extends ids{
    nickname: string;
    profileImage: profileImage;
}

export interface representativeComment extends ids {
    writer: writer;
    content: string;
}

export interface character extends ids{
    initialMessages: Array<string>;
    creator: creator;
    name: string;
    description: string;
    categories: Array<categorie>;
    chatCount: number;
    chatUserCount: number;
    likeCount: number;
    imageCount: number;
    tags: Array<string>;
    hasImage: boolean;
    isLiked: boolean;
    isDisliked: boolean;
    countryCode: boolean;
    status: string;
    visibility: string;
    profileImage: profileImage;
    replySuggestions: Array<string>;
    createdAt: string;
    updatedAt: string;
    isAdult: boolean;
    isConvertedToAdult: boolean;
    commentCount: number;
    promptTemplate: promptTemplate;
    representativeComment?: representativeComment | null;
    isCommentBlocked: boolean;
    startingSets: Array<startingSet>;
    defaultStartingSetName: string;
    deepLink: string;
}

export interface message extends ids{
    role: string;
    type: string;
    content: string;
    model: string;
    reroll: boolean;
    liked: boolean;
    diliked: boolean;
    status: string;
    isSuperMode: boolean;
}

export interface usernote extends ids{
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface chatroomCharacter extends ids{
    snapshotId: string;
    name: string;
    profileImage: profileImage;
    isAdult: boolean;
    userNote: usernote;
}

export interface chatroom extends ids{
    topic: string;
    model: string;
    character: chatroomCharacter;
    createdAt: string;
    updatedAt: string;
}

export interface characterChatProfile extends ids{
    name: string;
    information: string;
    isRepresentative: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface response{
    result: string;
    data: any;
}