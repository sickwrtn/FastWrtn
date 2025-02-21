import * as modalHtml from "../.env/modalHtml";
import * as interfaces from "../interface/interfaces";

class popupElement implements interfaces.popupElement {
    label: HTMLLabelElement;
    textarea: HTMLTextAreaElement;
    constructor(label: HTMLLabelElement, textarea: HTMLTextAreaElement){
        this.label = label;
        this.textarea = textarea;
    }
    set(placeholder?: string,textareaInformaition?: string | null,maxlength?: number,height?:number,width?: number): void{
        if (textareaInformaition != undefined){
            this.label.innerHTML += modalHtml.textareaInfo;
            this.label.childNodes.item(1).textContent = textareaInformaition;
        }
        if (width != undefined) this.textarea.style.cssText += `width: ${width}px;`;
        if (height != undefined) this.textarea.style.cssText += `height: ${height}px;`;
        if (placeholder != undefined) this.textarea.placeholder = placeholder;
        if (maxlength != undefined) this.textarea.setAttribute("maxlength",String(maxlength));
    }
    getValue(): string {
        return this.textarea.value
    }
    setValue(content: string): void{
        this.textarea.value = content;
    }
}

class popupCheckElement implements interfaces.popupCheckElement{
    check : HTMLDivElement;
    Event : [string,EventListener];
    constructor(check : HTMLDivElement){
        this.check = check;
    }
    set(name:string,informaition:string,is?:boolean): void{
        this.check.childNodes[0].childNodes.item(0).textContent = name;
        this.check.childNodes[0].childNodes.item(1).textContent = informaition;
        if (is != undefined) {
            if (is){
                this.check.id = "true";
            }
            else {
                this.check.id = "false";
            }
        }
    }
    setValue(is:boolean): void{
        let struct = document.createElement("div"); 
        if (is){
            struct.innerHTML = modalHtml.checkOn;
            let new_check = struct.childNodes.item(0) as HTMLDivElement;
            new_check.childNodes.item(1).addEventListener(this.Event[0],this.Event[1]);
            this.check.childNodes.item(1).remove();
            this.check.appendChild(new_check.childNodes.item(1));
            this.check.id = "true";
        }
        else{
            struct.innerHTML = modalHtml.checkOff;
            let new_check = struct.childNodes.item(0) as HTMLDivElement;
            new_check.childNodes.item(1).addEventListener(this.Event[0],this.Event[1]);
            this.check.childNodes.item(1).remove();
            this.check.appendChild(new_check.childNodes.item(1));
            this.check.id = "false";
        }
    }
    getValue(): boolean{
        if(this.check.id == "true"){
            return true;
        }
        else {
            return false;
        }
    }
    setEventListener(type:string,func: EventListener){
        this.check.childNodes.item(1).addEventListener(type,func);
        this.Event = [type,func];
    }

}

export class popup implements interfaces.popup{
    modal: Element;
    tabs: HTMLDivElement;
    top: HTMLDivElement;
    middle: HTMLDivElement;
    bottum: HTMLDivElement;
    constructor(name: string){
        this.modal = document.createElement("modal") as Element;
        this.modal.innerHTML = modalHtml.basic;
        this.tabs = this.modal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(0) as HTMLDivElement;
        this.top = this.tabs.childNodes.item(0) as HTMLDivElement;
        this.middle = this.tabs.childNodes.item(1) as HTMLDivElement;
        this.bottum = this.tabs.childNodes.item(2) as HTMLDivElement;
        this.top.childNodes.item(0).textContent = name;
    }
    open(): void{
        this.modal.setAttribute("style","position: relative !important;\n" +"    z-index: 11 !important;");
        document.body.appendChild(this.modal);
    }
    close(): void{
        this.modal.remove();
    }
    setSumbit(name: string,func: EventListener): void{
        this.bottum.childNodes[1].childNodes.item(0).textContent = name;
        if (func != undefined){
            this.bottum.childNodes.item(1).addEventListener('click',func);
        }
    }
    setClose(name: string,func:EventListener): void{
        this.bottum.childNodes[0].childNodes.item(0).textContent = name;
        if (func != undefined){
            this.bottum.childNodes.item(0).addEventListener('click',func);
            this.top.childNodes.item(1).addEventListener('click',func);
        }
    }
    addTextarea(name: string,placeholder?: string,textareaInformaition?: string | null,maxlength?: number,height?: number,width?: number): popupElement{
        var struct = document.createElement("div");
        struct.innerHTML += modalHtml.label + modalHtml.textarea
        var new_label: any = struct.childNodes.item(0) as HTMLLabelElement;
        var new_textarea: any = struct.childNodes.item(1) as HTMLTextAreaElement;
        new_label.childNodes.item(0).textContent = name;
        if (textareaInformaition != undefined){
            new_label.innerHTML += modalHtml.textareaInfo;
            new_label.childNodes.item(1).textContent = textareaInformaition;
        }
        if (width != undefined) new_textarea.style.cssText += `width: ${width}px;`;
        if (height != undefined) new_textarea.style.cssText += `height: ${height}px;`;
        if (placeholder != undefined) new_textarea.placeholder = placeholder;
        if (maxlength != undefined) new_textarea.setAttribute("maxlength",maxlength);
        this.middle.appendChild(new_label);
        this.middle.appendChild(new_textarea);
        return new popupElement(new_label,new_textarea);
    }
    addCheck(name: string,informaition:string, is:boolean){
        var struct = document.createElement("div");
        if (is){
            struct.innerHTML = modalHtml.checkOn;
        }
        else{
            struct.innerHTML = modalHtml.checkOff;
        }
        var new_check = struct.childNodes.item(0) as HTMLDivElement;
        if (is){
            new_check.id = "true";
        }
        else{
            new_check.id = "false";
        }
        new_check.childNodes[0].childNodes.item(0).textContent = name;
        new_check.childNodes[0].childNodes.item(1).textContent = informaition;
        this.middle.appendChild(new_check);
        return new popupCheckElement(new_check);
    }
}