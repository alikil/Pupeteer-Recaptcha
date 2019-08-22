exports.parse = (target,parseFirstPart,parseSecondPart) =>{
    return new Promise((resolve, reject) => {        
    regexnamereg = `${parseFirstPart}(.*?)${parseSecondPart}`  
    const matchtarget = target.match(regexnamereg)
    if (matchtarget == null){
        reject("null")
    } else {
        const parsedData = matchtarget[1].toString().trim()
        resolve(parsedData)
    }
    });
}
exports.parseAll = (target,FirstPart,SecondPart) =>{
    return new Promise((resolve, reject) => {
    const next = ""
    arr = []
        function tryUse(next) {
        const regexnamereg = `${next}(.*?)${FirstPart}(.*?)${SecondPart}`
        const matchtarget = target.match(regexnamereg)
            if (matchtarget != null || undefined){                      
                arr.push(matchtarget[2].toString().trim())
                const next = `${FirstPart}${matchtarget[2]}${SecondPart}`
                tryUse(next)
            } else { 
                resolve(arr)
            }  
        }
       tryUse(next)
    });
}