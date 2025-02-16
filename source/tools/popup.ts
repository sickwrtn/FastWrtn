import * as modalHtml from "../.env/modalHtml";
import * as interfaces from "../interface/interfaces";

class popupElement implements interfaces.popupElement {
    label: any;
    textarea: any
    constructor(label, textarea){
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
        if (placeholder != undefined) this.textarea.style.placeholder = placeholder;
        if (maxlength != undefined) this.textarea.style.setAttribute("maxlength",maxlength);
    }
    getValue(): string {
        return this.textarea.value
    }
    setValue(content: string): void{
        this.textarea.value = content;
    }
}

export class popup implements interfaces.popup{
    modal: any;
    tabs: any;
    top: any;
    middle: any;
    bottum: any;
    constructor(name: string){
        this.modal = document.createElement("modal");
        this.modal.innerHTML = modalHtml.basic;
        this.tabs = this.modal.childNodes[0].childNodes[0].childNodes[0].childNodes.item(0);
        this.top = this.tabs.childNodes.item(0);
        this.middle = this.tabs.childNodes.item(1);
        this.bottum = this.tabs.childNodes.item(2);
        this.top.childNodes.item(0).textContent = name;
    }
    open(): void{
        this.modal.setAttribute("style","position: relative !important;\n" +"    z-index: 11 !important;");
        document.body.appendChild(this.modal);
    }
    close(): void{
        this.modal.remove();
    }
    setSumbit(name: string,func: object): void{
        this.bottum.childNodes[1].childNodes.item(0).textContent = name;
        if (func != undefined){
            this.bottum.childNodes.item(1).addEventListener('click',func);
        }
    }
    setClose(name: string,func: object): void{
        this.bottum.childNodes[0].childNodes.item(0).textContent = name;
        if (func != undefined){
            this.bottum.childNodes.item(0).addEventListener('click',func);
            this.top.childNodes.item(1).addEventListener('click',func);
        }
    }
    addTextarea(name: string,placeholder?: string,textareaInformaition?: string | null,maxlength?: number,height?: number,width?: number): popupElement{
        var struct = document.createElement("div");
        struct.innerHTML += modalHtml.label + modalHtml.textarea
        var new_label: any = struct.childNodes.item(0);
        var new_textarea: any = struct.childNodes.item(1);
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
}