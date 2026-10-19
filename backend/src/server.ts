import {app} from "./app.js";
import {config} from "./config.js";

app.listen(config.PORT , config.HOST ,()=>{
    console.log(`API disponível em http://${config.HOST}:${config.PORT}`);
})