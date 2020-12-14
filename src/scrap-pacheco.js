/**
 * quando: 12:30-14/12/2020
 * farmacia: DROGPACHECO
 * nome:Deocil Sl Diffucap 10 Comprimidos
 * preco:28,49
 * link:https://www.drogariaspacheco.com.br/deocil-sl-diffucap-10-comprimidos/p
 */

const urlalvo = 'https://www.drogariaspacheco.com.br/medicamentos/dor-e-febre/anti-inflamatorios';

const axios = require('axios');
const cheerio = require('cheerio');
const UserAgent = require('user-agents');
const time = require('./mod/time');
const classmongo = require('./mod/classmongo');

let dados = {};

async function scrap(url){
    const horadata = time();
    await classmongo.start()
    const userAgent = await new UserAgent();
    const {data} = await axios.get(url,{
        'User-Agent':userAgent.toString()
    });
    const $ = cheerio.load(data);
    $('.descricao-prateleira')
    .map((index,element)=>{
        let quando = horadata;
        let farmacia = 'DROGARIAPACHECO'
        let nome = $(element).find('.collection-link').text();
        let preco = $(element).find('.valor-por').text();
        let urlproduto = $(element).find('a').attr('href');

        dados = {quando,farmacia,nome, preco, urlproduto}

        classmongo.add(dados);
        console.log(dados);
    })
};

let totpgpai = 6
let count = 1

async function main(){
    while (count <= totpgpai) {
        const urlfilho = `https://www.drogariaspacheco.com.br/buscapagina?fq=C%3a%2f800%2f814%2f936%2f&PS=48&sl=86eeb686-cc74-4afe-8982-4f02906814e6&cc=48&sm=0&PageNumber=${count}`
        //console.log(urlfilho);
        await scrap(urlfilho);
        count ++
    }
};

main();