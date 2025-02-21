import * as env from "../.env/env";
import * as frontHtml from "../.env/fronthtml";
import * as tools from "../tools/functions";
import { debug } from "../tools/debug";
import { popup } from "../tools/popup";

//디버그 버튼
export function debug_btn(){
    var debug_Interval = setInterval(()=>{
        if (document.URL == "https://wrtn.ai/character"){
            //프로필 누르면 나오는거
            var debug_modal = document.getElementsByClassName(env.profileBoxClass).item(0);
            //태그 검열 넣을 부분
            var tag_modal = document.getElementsByClassName(env.profileBoxMenuClass).item(0);
            if (debug_modal != null){
                if (debug_modal.childNodes.length == 3){
                    //디버그 버튼
                    var debug_modal_btn = debug_modal.childNodes[2].childNodes.item(0).cloneNode(true);
                    debug_modal_btn.textContent = `debug:${JSON.parse(String(localStorage.getItem(env.local_IsDebug))).IsDebug}`;
                    debug_modal_btn.addEventListener('click',()=>{
                        if (JSON.parse(String(localStorage.getItem(env.local_IsDebug))).IsDebug){
                            localStorage.setItem(env.local_IsDebug,JSON.stringify({
                                IsDebug: false
                            }))
                            debug("debug OFF");
                            debug_modal_btn.textContent = `debug:false`;
                        }
                        else {
                            localStorage.setItem(env.local_IsDebug,JSON.stringify({
                                IsDebug: true
                            }))
                            debug("debug ON");
                            debug_modal_btn.textContent = `debug:true`;
                        }
                        debug("debug_modal_btn",3);
                    })
                    debug_modal.insertBefore(debug_modal_btn,debug_modal.childNodes.item(2));
                    debug("web-modal founded");
                }
            }
            if (tag_modal != null){
                if (tag_modal.childNodes.length == 9){
                    //태그 버튼
                    var tag_button = tag_modal.childNodes.item(0).cloneNode(true);
                    tag_button.childNodes.item(1).textContent = "태그 차단";
                    tag_button.addEventListener('click',()=>{
                        document.getElementById("web-modal").remove();
                        const tag_modal = new popup("태그 차단");
                        const tag_modal_textarea = tag_modal.addTextarea("태그 키워드 ( , 으로 구분)","태그1,태그2");
                        tag_modal.open();
                        if (JSON.parse(localStorage.getItem(env.local_tag)).tags.length != 0){
                            var tags = JSON.parse(localStorage.getItem(env.local_tag)).tags;
                            console.log(tags);
                            var s = 1
                            for (const element of tags) {
                                if (s == tags.length){
                                    tag_modal_textarea.setValue(tag_modal_textarea.getValue() + element);
                                }
                                else{
                                    tag_modal_textarea.setValue(tag_modal_textarea.getValue() + element + ",");
                                }
                                s++
                            }
                        }
                        tag_modal.setClose("이름",()=>{
                            tag_modal.close();
                        })
                        tag_modal.setSumbit("적용",()=>{
                            localStorage.setItem(env.local_tag,JSON.stringify({
                                tags : tag_modal_textarea.getValue().replace(" ","").split(",")
                            }))
                            alert("등록 성공!");
                            tag_modal.close();
                            window.location.reload();
                        })
                    })
                    var func_button = tag_modal.childNodes.item(0).cloneNode(true);
                    func_button.childNodes.item(1).textContent = "Fast Wrtn 기능 설정";
                    func_button.addEventListener('click',()=>{
                        const func_popup = new popup("설정");
                        func_popup.open();
                        func_popup.setClose("닫기",()=>{
                            func_popup.close();
                        })
                        func_popup.setSumbit("적용",()=>{
                            localStorage.setItem(env.loacl_setting,JSON.stringify({
                                plus:checkPlus.getValue(),
                                fastfood:checkFastfood.getValue(),
                            }))
                            alert("설정이 적용되었습니다!");
                            func_popup.close();
                            window.location.reload();
                        })
                        const checkPlus = func_popup.addCheck("랭킹 플러스","메인의 랭킹플러스 기능",JSON.parse(localStorage.getItem(env.loacl_setting)).plus);
                        checkPlus.setEventListener('click',()=>{
                            if(checkPlus.getValue()){
                                checkPlus.setValue(false);
                            }
                            else{
                                checkPlus.setValue(true);
                            }
                        })
                        const checkFastfood = func_popup.addCheck("패스트푸드","메인의 패스트푸드 기능",JSON.parse(localStorage.getItem(env.loacl_setting)).fastfood);
                        checkFastfood.setEventListener('click',()=>{
                            if(checkFastfood.getValue()){
                                checkFastfood.setValue(false);
                            }
                            else{
                                checkFastfood.setValue(true);
                            }
                        })
                    })
                    tag_modal.appendChild(tag_button);
                    tag_modal.appendChild(func_button);
                }
            }
        }
        else{
            clearInterval(debug_Interval);
        }
    },100)
    debug("debug_btn",0)
}