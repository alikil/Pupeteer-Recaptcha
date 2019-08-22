const axios = require('axios');
exports.solveService = (sitekey,pageurl,ip,apikey) =>{
    return new Promise(async(resolve, reject) => {  

        if (sitekey.length < 5){reject("sitekey Length "+sitekey)}
        if (pageurl.length < 5){reject("pageurl Length "+pageurl)}

        const postCaptcha = async() => {        
            return new Promise(async(resolve, reject) => {
                const data = `http://${ip}/in.php?key=${apikey}&method=userrecaptcha&googlekey=${sitekey}&pageurl=${pageurl}&json=1`
                const res = await axios.get(data)   
                if (res.data.request == "ERROR_GOOGLEKEY"){reject(res.data.request)}
                if (res.data.request == "ERROR_PAGEURL"){reject(res.data.request)}
                if (res.data.request == "ERROR_KEY_DOES_NOT_EXIST"){reject(res.data.request)}
                if (res.data.status != 1){reject(res.data.request,res.data.status)}
                if (res.data.request == undefined){
                    reject(res.data)
                }
                if (res.data.status == 1){resolve(res.data.request)}                
            });
        }

        const waitAnswer = async(capid) => {
            return new Promise(async(resolve, reject) => {
                function delay() {return new Promise (resolve => setTimeout(resolve,10000))}
                const waitAnswer2 = async(capid) =>{        
                    const data = `http://${ip}/res.php?key=${apikey}&action=get&id=${capid}&json=0`
                    const answer = await axios.get(data)
                    if (answer.data == "ERROR_CAPTCHA_UNSOLVABLE"){reject(answer.data)}
                    if (answer.data == "ERROR_NO_SUCH_CAPCHA_ID"){reject(answer.data)}
                    if (answer.data == "ERROR"){reject(answer.data)}
                    if (answer.data == "sorry"){reject(answer.data)}
                    if (answer.data == "ERROR_PROXY_BANNED"){reject(answer.data)}
                    if (answer.data.includes("ERROR_RECAPTCHA_TIMEOUT")){reject(answer.data)}
                    if (answer.data == "CAPCHA_NOT_READY"){
                        await delay()
                        await waitAnswer2(capid)
                    }
                    if (answer.data.includes("OK")){
                        resolve(answer.data)
                    }
                }
                const answer = await waitAnswer2(capid)
                resolve(answer)
            });                        
        }

        const takeAnswer = async(answer) => {
            return new Promise(async(resolve, reject) => {
                const greg = await answer.match(/OK\|(.*)/)
                const grecaptchakey = greg[1]
                resolve(grecaptchakey)
            });
        }

        const captchaid = await postCaptcha()
        const answer = await waitAnswer(captchaid)
        const grecaptchakey = await takeAnswer(answer)
        await resolve(grecaptchakey)
    });
}