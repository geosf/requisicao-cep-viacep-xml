const cors = require('cors');
const bodyParser = require('body-parser');

const express = require('express');
const { render } = require('ejs');

const app = express();

const start = async ()=>{
  const listacep = [];
  
  //evitar erros no cors
  var corsOptions = {
    origin: 'http:/localhost:3000',
    optionsSuccessStatus: 200
  }
  app.use(cors(corsOptions))

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));

  app.set('view engine', 'ejs');

  app.get('/', (req, res)=>{
    res.render('index')
  })

  app.post('/', (req, res)=>{
    if (listacep.length < 1){
    listacep.push(req.body);
    
    }
    else{
      listacep.length = 0;
      listacep.push(req.body)
    }
    console.log(listacep)
    res.redirect('/show')
  })

  app.get('/show', (req, res)=>{
    const axios = require('axios');
    const xml2js = require('xml2js');
    var requisicao = listacep[0].cepinput

    console.log(requisicao)
    axios.get(`https://viacep.com.br/ws/${requisicao}/xml/`)
    .then((response)=>{
      var xml = response.data;
      console.log(xml)
      xml2js.parseString(xml, (err, result) => {
        if (err){
          res.send(500, '<h2>CEP não encontrado!</h2><br><br> <a href="/">Retornar a pagina inicial</a>')
          throw Error;
        }
    
        const json = JSON.stringify(result.xmlcep);

        console.log(json.length)
        
        if (json.length < 100){
          res.send(500, '<h2>CEP não encontrado!</h2><br><br> <a href="/">Retornar a pagina inicial</a>')
          throw Error;
    }
        

        const rua = JSON.stringify(result.xmlcep.logradouro[0]);
        const bairro = JSON.stringify(result.xmlcep.bairro[0]);
        const localidade = JSON.stringify(result.xmlcep.localidade[0]);
        const uf = JSON.stringify(result.xmlcep.uf[0]);
        console.log(`
                  rua: ${rua}
                  bairro: ${bairro}
                  localidade: ${localidade}
                  uf: ${uf}
      `)

        res.render('show', {data: [
          {'rua': `${rua}`, 
          'bairro': `${bairro}`,
          'localidade':`${localidade}`,
          'uf':`${uf}`}
        ]})
      })  
    })
    .catch((erro)=>{
      res.send(400, '<h2>CEP não encontrado!</h2><br><br> <a href="/">Retornar a pagina inicial</a>')
          throw Error;
    })
  })
  
  

  app.listen(3000, ()=>{
    console.log('Server rodando no localhost:3000')
  })
  
  
}

start();