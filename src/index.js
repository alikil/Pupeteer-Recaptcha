process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const fs = require('fs');
const registrator = require('./components/registration')

const getPage = async(targetPage) =>{
    if (!fs.existsSync(`env/bese.json`)) {
        console.log("add accounts in json to 'env/bese.json' in root")
        process.exit()
    }
    const solverServise = JSON.parse(fs.readFileSync(`env/bese.json`,'utf8'))    
    const [ip,key] = [solverServise.ip,solverServise.apikey]
    const createPathAndFiles = () => {
        return new Promise((resolve, reject) => {
        if (!fs.existsSync(`./screenshots`)){fs.mkdirSync(`./screenshots`);}        
        resolve("ready")
        });
    }

await createPathAndFiles()    
await registrator.forms(targetPage,ip,key)
process.exit()
}    
getPage("https://www.google.com/recaptcha/api2/demo");   



