import * as interfaces from "../interface/interfaces";
import { load_in_cursor } from "../tools/functions";
import { debug } from "../tools/debug";
import { wrtn_api_class } from "../tools/sdk";
import { plus_modal_func } from "../core/feed";

const wrtn: interfaces.wrtn_api_class = new wrtn_api_class();


export class chatroom_menus_class implements interfaces.chatroom_menus_class{
    item: Array<[string,string,interfaces.onClickChatroom_menus,string]>;
    listeners: Array<HTMLButtonElement>;
    menu: HTMLDivElement
    constructor(){
        this.item = [];
        this.listeners = [];
    }
    add(name: string,svg: string,func: interfaces.onClickChatroom_menus,color?:string): void{
        this.item[this.item.length] = [name,svg,func,color];
    }
    get(name: string): HTMLButtonElement | undefined{
        for (const i of this.listeners) {
            if (i.childNodes.item(1).textContent == name){
                return i
            }       }
        return undefined
    }
    apply(menu: HTMLDivElement): void{
        this.menu = menu;
        for (const i of this.item){
            const new_item = menu.childNodes.item(0).cloneNode(true) as HTMLButtonElement;
            new_item.childNodes.item(1).textContent = i[0];
            for (let i = 0; i < 4; i++) {
                new_item.childNodes[0].childNodes[1].remove();
            }
            (new_item.childNodes[0].childNodes.item(0) as HTMLElement).setAttribute("d",i[1]);
            if (i[3] != undefined){
                (new_item.childNodes[0].childNodes.item(0) as HTMLElement).setAttribute("fill",i[3]);
            }
            new_item.addEventListener('click',i[2]);
            this.listeners[this.listeners.length] = new_item;
            menu.appendChild(new_item);
        }
    }
}

function myDropdown(tipbar: HTMLCollectionOf<Element>,tipbar_struct_I: HTMLButtonElement,textContent: string,selected: number,func: interfaces.onClickDropdown): void | true{
    tipbar_struct_I.childNodes.item(0).textContent = textContent;
    tipbar_struct_I.addEventListener("click",()=> {
        debug(`selected ${selected}`);
        debug(`tipbar_struct`,3);
        if (confirm("진짜 계속 진행 하시겠습니까?")){
            load_in_cursor("",[],wrtn,"my",(my_character_list: Array<interfaces.myCharacter>)=>{
                let i=0;
                for (const character of my_character_list) {
                    //조회한 캐챗을 가져옴
                    if (i == selected){
                        func(character);
                    }
                    i++;
                }
            })
        }
        else{
            return true;
        }
    })
    tipbar.item(0).appendChild(tipbar_struct_I);
}

//character/my dropdown 클래스
export class dropdown_class implements interfaces.dropdown_class{
    item: Array<[string,interfaces.onClickDropdown]>;
    constructor(){
        this.item = [];
    }
    add(name: string,funtion: interfaces.onClickDropdown): void{
        this.item[this.item.length] = [name,funtion]; 
    }
    listen(tipbar: HTMLCollectionOf<Element>,tipbar_struct: HTMLButtonElement,selected: number): void{
        if (tipbar.item(0).childNodes.length < this.item.length + 2) {
            for (const element of this.item) {
                const new_tipbar = tipbar_struct.cloneNode(true) as HTMLButtonElement;
                myDropdown(tipbar,new_tipbar,element[0],selected,(character: interfaces.myCharacter)=>{
                    element[1](character);
                })
            }
        }
    }
}

export class feed_class implements interfaces.feed_class{
    item: Array<[string,interfaces.filter_character_list,boolean,interfaces.stopLine,interfaces.onStopped]>;
    constructor(){
        this.item = [];
    }
    add(name: string, filter_character_list: interfaces.filter_character_list, CeCreator: boolean, stopLine?: interfaces.stopLine,onStopped?: interfaces.onStopped): void{
        this.item[this.item.length] = [name,filter_character_list,CeCreator,stopLine,onStopped];
    }
    listen(Tfeed: HTMLDivElement): void{
        for (const element of this.item) {
            plus_modal_func(Tfeed,element[1],element[0],element[2],element[3],element[4]);
        }
    }
}