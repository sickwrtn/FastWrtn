
//debug function
export class fconsole{
    constructor(IsDebug){
        this.IsDebug = IsDebug;
    }
    debug(content,code = null){
        if (this.IsDebug){
            if (code == 0){
                console.log(`[FAST WRTN][DEBUG](function) ${content} loaded`);
            }
            else if(code == 1){
                console.log(`[FAST WRTN][DEBUG](body value) ${content} loaded`);
            }
            else if(code == 2){
                console.log(`[FAST WRTN][DEBUG](request) ${content} loaded`);
            }
            else if(code == 3){
                console.log(`[FAST WRTN][DEBUG](event) ${content} evented`)
            }
            else if(code == 4){
                console.log(`[FAST WRTN][DEBUG](for) ${content} completed`)
            }
            else if(code == 5){
                console.log(`[FAST WRTN][DEBUG](add) ${content} added`)
            }
            else{
                console.log(`[FAST WRTN][DEBUG] ${content}`);
            }
        }
    }
}