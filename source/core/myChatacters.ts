import * as env from "../.env/env";
import * as interfaces from "../interface/interfaces";
import { debug } from "../tools/debug";


export function my(dropdown_class: interfaces.dropdown_class){
    /*
    여러번 수정 끝에 만들어 낸거임
    계속 copy to json,copy to paste 버튼을 누르면 selected가 요소 인덱스 범위보다 1더 커지는 문제가 생김
    이유를 알수가 없음
    도대체 왜?
    open 변수로 커버함
        */
    var selected: number = 0; //점 세개 퍼튼이 어떤 요소의 버튼인지 판별하는 번수
    var opend: boolean = false; //구원자
    setInterval(()=>{
        var myTdiv = document.getElementsByClassName(env.threeDotButtonClass); //점 세개 버튼
        var tipbar = document.getElementsByClassName(env.dropdownClass); //dropdown 목록
        //드랍다운이 있는지 없는지
        if (tipbar != null){
            var tipbar_struct = document.getElementsByClassName(env.dropdownListClass).item(0) as HTMLButtonElement; //드랍다운 내부 요소 (형식용)
            //화이트 테마일시
            if (tipbar_struct == null){
                tipbar_struct = document.getElementsByClassName(env.dropdownListClassWhite).item(0) as HTMLButtonElement; //화이트 테마용 드랍다운 내부요소 (형식용)
            }
            //드랍다운 내부에 copy to json, copy to paste, publish 추가
            if (tipbar_struct != null){
                dropdown_class.listen(tipbar,tipbar_struct,selected);
                opend=true;
                debug("dropdown event");
            }
            else {
                opend = false;
            }
        }
        else{
        }
        //모든 점세개에 클릭 이벤트리스너를 추가
        var i=0;
        for (const myTdivElement of Array.from(myTdiv)) {
            if (myTdivElement.id == ""){
                myTdivElement.setAttribute("id",String(i))
                myTdivElement.addEventListener('click',()=>{
                    var j: number=0;
                    var myTdiv2: any = document.getElementsByClassName(env.myCharactersClass);
                    for (const argument of myTdiv2) {
                        if (argument==myTdivElement){
                            if (j != myTdiv2.length){
                                if (!opend){
                                    selected = j;
                                }
                            }
                        }
                        j++;
                    }
                    debug("three dot button event");
                })
            }
            i++;
        }
    })
    debug("my",0);
}