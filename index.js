const Koa = require('koa');
const Router = require('koa-router');
const axios = require('axios');
const cheerio = require('cheerio');
const app = new Koa();
const router = new Router();

let instance = axios.create({
    headers:{"User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
    }
})

router.get('/api/allnode',async (ctx,next)=>{
    const res = await instance.get('https://v2ex.com/?tab=nodes');
    if(res.status == '200'){
        const html = res.data;
        const $ = cheerio.load(html);
        const cell = $("#Main .box:last-child .cell");
        let nodeArr=[];
        for (let i = 1; i < cell.length; i++) {
            let parentNode = $(cell[i]).find('tr td:first-child span').text();
            let subNodes = [];
            $(cell[i]).find('tr td:last-child a').map(function (index,item) {
                let name = $(item).attr('href').split('/')[2].toString();
                let title = $(item).text();
                subNodes.push({name,title});
            })
            nodeArr.push({parentNode,subNodes})
        }
        ctx.body = nodeArr;
    }

})

app.use(router.routes());

app.listen(3000);
console.log("app started listen port 3000");
