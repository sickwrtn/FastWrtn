![](https://img.shields.io/chrome-web-store/rating/lmahnfafkefebiibmcdnnopdojipbonh?logo=chromewebstore)

# FastWrtn Dev Version
뤼튼 편의성 개선 확장 프로그램 개발자 버전
# 사용법

압축해제후 아래 gif 대로 해주세요

![크롬 확장프로그램 개발자모드](https://github.com/user-attachments/assets/2e8f63be-ea11-49d3-940a-478867f947c3)

# 기능들
## 단축키 기능

단축키를 저장합니다. (최대 9개)

채팅바에 저장할 내용을 입력후 +버튼을 누르면 추가됩니다.

ctl + 1~9 단축키 사용 가능합니다.

![단축키 기능](https://github.com/user-attachments/assets/fbf24b27-1d2a-48e1-98f2-089ae94dde65)

## 페르소나 기능

메뉴에 페르소나 항목이 생깁니다.

페르소나를 채팅방에서 빠르게 수정 가능합니다.

![페르소나](https://github.com/user-attachments/assets/81e4dc27-0af0-49cc-a0d3-66b82d41cd32)

## 유저노트 요약 기능

유저노트를 요약해서 저장해줍니다. (업데이트는 주기적으로 해주세요.)

![유저노트 요약기능](https://github.com/user-attachments/assets/5a5e7010-088e-420f-92c8-1b4bd969ceee)

## Memory Afterburner 기능

진행 내용을 저장해 기억을 향상기키는 기능입니다.

템플릿별 프롬프트 선택이 가능합니다. (1 : 1 캐릭터챗,시뮬레이션,커스텀)

![Memory Afterburner](https://github.com/user-attachments/assets/d6a4876b-13e1-4c66-a09b-5bb028230191)


## 랭킹 플러스 기능

좋아요가 10개 이상 채팅수가 30개 이상인 모든 캐릭터챗을 불러옵니다.

개념글 같은 기능이라 생각하시면 됩니다.

![랭킹 플러스](https://github.com/user-attachments/assets/22270260-7996-4507-82a8-60d5fe4f62b2)

## (제작기능) 캐챗 복붙 기능

캐릭터 챗을 json화 시켜 복사 붙혀넣기가 가능하게 만들어 줍니다.

![copy to json paste to json](https://github.com/user-attachments/assets/d58cfef4-20b9-4a4a-a3f5-f2628107886e)

## (제작기능) publish 기능

비공개인 캐챗을 공개 상태로 복제해 개시합니다.

![publish 기능](https://github.com/user-attachments/assets/aed52d20-a0a1-48eb-b27f-221e163fa7cf)

## (제작기능) 프롬프트 저장 및 복사 기능

프롬프트를 저장할수있는 기능입니다.

![제작 기능](https://github.com/user-attachments/assets/bd43b088-efaa-4840-b49f-047c56fb2024)

# SDK

[뤼튼 api SDK](https://github.com/sickwrtn/FastWrtn/blob/main/source/tools/sdk.ts)

## fast

```js
const wrtn = new wrtn_api_class();
console.log(wrtn.getUser());
```

## wrtn_api_class

```js
wrtn_api_class.getUser() // 유저 정보 조회
wrtn_api_class.getSuperchat() // 슈퍼챗 관련 정보 조회
wrtn_api_class.getPersona() // 페르소나 조회
wrtn_api_class.getRepresentativePersona() // 대표프로필 조회
async wrtn_api_class.getChatrooms(cursor="",load_limit=40,type="character") // 채팅방 조회
async wrtn_api_class.getMycharacters(cursor="",load_limit=40) // 제작한 캐릭터 조회
async wrtn_api_class.character_search(query,cursor="",sort="score",load_limit=40) // 캐릭터 검색
async wrtn_api_class.user_search(query,cursor="",load_limit=40) // 유저 검색
wrtn_api_class.getMycharacter(charId) // 캐릭터 가져오기 return new my_struct
wrtn_api_class.getMessage(msgId) // 메시기 가져오기 return new message_struct
wrtn_api_class.getChatroom(chatId) // 채팅방 가져오기 return new chatroom_struct
```

## my_struct

```js
my_struct.get() // json화 된 캐릭터 정보를 조회
my_struct.set(json_data) // json화 된 캐릭터 정보로 캐챗 수정
my_struct.remove() // 캐릭터 삭제
my_struct.publish() // 캐릭터 공개
```

## message_struct

```js
message_struct.get() // 메시지 내용 가져오기
message_struct.set(content) // 메시지 내용 수정
message_struct.remove() // 메시지 삭제
```

## chatroom_struct

```js
chatroom_struct.chatroom_struct.remove()  // 채팅방 삭제
async chatroom_struct.getMessages(cursor="",load_limit = 40) // 채팅방 메시지 조회
chatroom_struct.send(content,IsSuperMode = false) // 메시지 보내기 return new message_struct
chatroom_struct.getUsernote() // 유저 노트 가져오기
chatroom_struct.setUsernote(content) // 유저 노트 변경
```

# 패치노트

[2.0.1v] 캐릭터 관리 cursor 조회 추가, Memory Afterburner 기능 추가

[2.0.0v] 랭킹플러스 cusor 조회 추가, 디버그 기능 추가

[1.4.1v] 랭킹 플러스 크레이터,비크레이터를 나눔

[1.4.0v] publish 기능, 프롬프트 저장 기능, 랭킹 플러스 기능, 유저노트 요약 기능 추가 코드 주석 추가

[1.3.4v] 캐릭터 관리기능중 스크롤된 캐릭터는 복사 붙혀넣기가 안되는 버그 픽스

[1.3.3v] 제작자 기능 정상작동﻿

[1.3.2v] 1.2v 문제 수정후 배포 (아직 작동은 안하고 1.3.3v에서 작동예정)

[1.3.1v] 1.2v 문제로 1.1v으로 롤백

[1.2v] 새로고침해야 적용되는 문제 고침(func main + setInterval) + 코드 주석 추가





