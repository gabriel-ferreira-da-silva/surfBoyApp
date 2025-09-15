const express = require('express');
require('dotenv').config();
const cors = require('cors'); 
const { Builder, By, until } = require('selenium-webdriver');
const { InferenceClient } = require('@huggingface/inference');
const chrome = require('selenium-webdriver/chrome');

const app = express();
app.use(express.json());
app.use(cors()); 


app.post('/api/tide', async (req, res) => {
  let driver;
  const cidade = req.body.cidade || "olinda";
  const estado = req.body.estado || "pernambuco";

  try {
    console.log("Iniciando o scraping...");
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.get(`https://surfguru.com.br/previsao/brasil/${estado}/${cidade}/oceanica?tipo=tabela`);

    const sumarioDasOndas = await driver.wait(
      until.elementLocated(By.id('sumario_dia1')),
      10000
    );

    const seaElements = await sumarioDasOndas.findElements(By.className('sea0'));

    const htmls = [];
    for (let el of seaElements) {
      const html = await el.getAttribute("outerHTML");
      htmls.push(html);
    }

    res.json({ htmls });

  } catch (error) {
    console.error('Erro no scraping:', error);
    res.status(500).json({ error: 'Erro ao consultar dados da maré' });
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
});



app.post('/api/aisurvey', async (req, res) => {
  const html = req.body.htmls;
const cidade = req.body.cidade || "";

  try {
    const client = new InferenceClient(process.env.HF_ACCESS_TOKEN);
    const response = await client.chatCompletion({
      provider: "novita",
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [
        {
          role: "user",
          content: `escreva de forma breve em texto corrido, sem usar markdown, um resumo das informações presentes neste html
          indicando a evolução das ondas e maré e dê insights sobre as condições para surfar. Seja breve, mas claro e objetivo.
          a cidade da praia é ${cidade}.
          
          HTML: \`${html}
          \n`,
        },
      ],
    });
    const result = response.choices[0].message.content;
    console.log("Resposta da AI:", result); 
    return res.json({ result });

  } catch (error) {
    console.error('Erro na ai ', error);
    res.status(500).json({ error: 'Erro ao consultar dados da maré' });
  } finally {
   
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
