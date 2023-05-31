//npm install ejs --save

const path = require('path');
const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const ejs = require('ejs');
const path = require('path');

let data = {content: "<h1>Analytics</h1>"};

class Analytics extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Analytics";

    this.description = "TBD";
    this.categories = "";
    this.header = null;
    return this;
  }

  initializeHompage(app) {

  }


  returnRendered() {   
    console.log("returnRendered");
        
    let p = `${__dirname}/stub.ejs`;
    console.log(">> " + p);
    //let data = {content: "<h1>TEST Analytics</h1>"};
    let data = {content: "<h1>TEST Analytics</h1>"};

    ejs.renderFile(p, {}, {}, function(err, str){
      // str contains the rendered string
      console.log("str " + str);
      console.log("err " + err);
      return str;
    });
  }


  initialize(app) {
  }

  returnIndexHTML(app) {
    //var html = this.returnHead() + this.returnHeader() + this.returnIndexMain() + this.returnPageClose();
    var html = this.returnRendered();
    return html;
  } 
  
  webServer(app, expressapp, express) {
    var aself = app.modules.returnModule("Analytics");

    expressapp.use("/", express.static(`${__dirname}/../../mods/${this.dirname}/web`));
   

    expressapp.use("/analytics/", function (req, res) {
      

      //console.log(" ? " + app);
      let pub = app.wallet.returnPublicKey();
      let bal = app.wallet.returnBalance();

      console.log(" ?tx " + app.mempool.transactions);
      console.log(" ?tx " + app.blockchain.blocks);
      let latest_block_id = app.blockring.returnLatestBlockId();
      console.log(" ?latest_block_id " + latest_block_id);
      
      // console.log(" ? " + this.app.mempool);
      // console.log(" ? " + this.app.wallet);
      // console.log(" ? " + this.app.mempool.transactions);
      // let tx = this.app.mempool.mempool.transactions;
      // let bal = this.app.wallet.returnBalance()
      // //app.blockring.returnLongestChainBlockHashAtBlockId(mb)
      // //explorer_self.app.blockring.returnBlockHashesAtBlockId(mb)
      // //this.app.mempool.mempool.transactions
      // //let block = explorer_self.app.blockchain.blocks.get(hashes_at_block_id[i]);

      // console.log("tx " + tx);
      // console.log("bal " + bal);

      let data = {content: "Analytics", publickey: pub, balance: bal, latest_block_id: latest_block_id};

      ejs.renderFile(path.join(__dirname, 'stub.ejs'), data, {}, function(err, str){
          if(err) {
              console.log(err);
              res.status(500).send('An error occurred');
              return;
          }
  
          res.set("Content-type", "text/html");
          res.charset = "UTF-8";
          res.send(str); // send the rendered HTML
      });
  });
  }

}
module.exports = Analytics;