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
                    const them = tag_modal.childNodes.item(0).cloneNode(true);
                    them.childNodes.item(1).textContent = "커스텀 테마";
                    them.addEventListener('click',()=>{
                        const them_popup = new popup("커스텀 테마");
                        them_popup.open();
                        them_popup.setClose("닫기",()=>them_popup.close());
                        them_popup.setSumbit("적용", ()=>{
                            localStorage.setItem(env.local_them,JSON.stringify({
                                css : css.getValue()
                            }));
                            alert("css가 적용되었습니다!");
                            them_popup.close();
                        })
                        const css = them_popup.addTextarea("Fast Css 코드","ChatBackground {\nbackground:green;\n}","원하는 Fast Css 스타일 코드을 입력해주세요. (css와 문법적 차이가 있습니다.)",undefined,300);
                        css.setValue(JSON.parse(localStorage.getItem(env.local_them)).css);
                    })
                    tag_modal.appendChild(tag_button);
                    tag_modal.appendChild(them);
                }
            }
        }
        else{
            clearInterval(debug_Interval);
        }
    },100)
    debug("debug_btn",0)
}