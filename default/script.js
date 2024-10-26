async function sdf34dsf(){
    async function setIntervalMax(callback, delay, timeout){    
        let resolver;
        const promise = new Promise( r => resolver = r);
        const startTime = new Date().getTime();
        const id = setInterval(async () => {
            const time = new Date().getTime();
            const result = await callback();
            
            if(result)
                resolver(result);
            else if(time - startTime >= timeout)
                resolver(false);
        }, delay);
        
        await promise;
        clearInterval(id);
        return await promise;
    }
    
    function getElement(query, timeout){
        return setIntervalMax(function(){ return document.querySelector(query)}, 100, timeout);
}
    
    function onChange(callback, old, timeout){
        return setIntervalMax(async function(){ 
            const res = await callback();
            
            return [res !== old, res];
        }, 100, timeout);
    }
    
    const sleep = delay => new Promise( r => setTimeout(r, delay))
    
    const getCompared = async () => (await getElement(config.comparedquery, config.comparedtimeout))?.outerHTML;
    
    let compared, yesButton;
    
    const hasNewCompared = () => onChange(async () => await getCompared(), compared, config.comparedtimeout);
    
    while(true){
        if(config.comparedquery){
            const [isNew, newCompared] = await hasNewCompared();
            
            if(!isNew)
                break;
            
            compared = compared;
        }

        if(config.limitquery){
            const limitEl = await getElement(config.limitquery, config.limittimeout);
            
            if(limitEl)
                break;
        }
            
        
        yesButton = await getElement(config.yesquery, config.elementtimeout);

        if(!yesButton && config.alternativequery)
            yesButton = await getElement(config.alternativequery, config.elementtimeout);
        
        if(!yesButton)
            break;
        
        await sleep(config.waitlike);
        yesButton.click();
    }
}

sdf34dsf();
