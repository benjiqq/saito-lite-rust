//const GameCryptoTransferManagerTemplate = require('./game-crypto-transfer-manager.template'); //Not Used
const GameCryptoTransferManagerSendTemplate = require('./game-crypto-transfer-manager-send.template');
const GameCryptoTransferManagerReceiveTemplate = require('./game-crypto-transfer-manager-receive.template');
const GameCryptoTransferManagerBalanceTemplate = require('./game-crypto-transfer-manager-balance.template');
const GameCryptoTransferManagerStakeTemplate = require('./game-crypto-transfer-manager-stake.template');
const SaitoOverlay = require('./../saito-overlay/saito-overlay');

/**
 * A tool, integrated in GameTemplate, to facilitate the transfer of cryptos 
 * by populating an overlay with basic forms and getting confirmation from the user
 * 
 * 
 */ 
class GameCryptoTransferManager {

/**
 * @constructor
 * @param app - the Saito Application
 */ 
    constructor(app) {
      this.app = app;
      this.overlay = new SaitoOverlay(app, false);
    }

/**
 * Not used
 */ 
    render(app, mod) {
    }

/**
 * Not used
 */ 
    attachEvents(app, mod, mycallback=null) {
    }


  async confirmBalance(app, mod, crypto, amount){
      let selected_crypto_ticker = app.wallet.returnCryptoModuleByTicker(crypto).ticker; //is this really necessary?
      let preferred_crypto_ticker = app.wallet.returnPreferredCrypto().ticker;
      if (selected_crypto_ticker === preferred_crypto_ticker) {
        let my_address = app.wallet.returnPreferredCrypto().returnAddress();

        let current_balance = await this.returnBalance(
          app,
          mod,
          my_address,
          crypto,
          function () { }
        );
        console.log("Current balance", current_balance);

        try {
          if (BigInt(current_balance) < BigInt(amount)) {
            salert("You do not have enough " + crypto + "! Balance: " + current_balance);
            return false;
          }
        } catch (err) {
          if (parseFloat(current_balance) < parseFloat(amount)) {
            salert("You do not have enough " + crypto + "! Balance: " + current_balance);
            return false;
          }
        }
        
      } else {
        salert(
          `${crypto} must be set as your preferred crypto to create or join a game using ${crypto}`
        );
        return false;
      }

      return true;
  }


/**
 * Display an overlay with the given public key address and ticker (currency)
 * @param app - the Saito application
 * @param mod - the containing module
 * @param address - a public key address
 * @param ticker {string} - name of a currency
 * @mycallback - an optional callback function that never gets called
 */ 
    async returnBalance(app, mod, address, ticker, mycallback=null) {

      try{
        let sobj = {};
            sobj.address = address;
            sobj.ticker = ticker;

        this.overlay.closebox = false; 
        this.overlay.show(app, mod, GameCryptoTransferManagerBalanceTemplate(app, sobj));
        this.overlay.blockClose();
        let cryptoMod = app.wallet.returnCryptoModuleByTicker(ticker);
        let current_balance = await cryptoMod.returnBalance();

        let spinner = document.querySelector(".spinner");
        if (spinner) {spinner.remove();}

        let balanceDiv = document.querySelector("#crypto_balance");
        let confirmBtn = document.querySelector("#crypto_balance_btn");

        if (balanceDiv){
          balanceDiv.textContent = (current_balance) ? sanitize(current_balance) : "Crypto unavailable";
          balanceDiv.classList.remove("hidden");  
        }
        
        if (confirmBtn){
          confirmBtn.classList.remove("hidden");
          confirmBtn.onclick = (e) =>{
            this.hideOverlay(mycallback);
          };         
        }else{
          this.hideOverlay(mycallback);  
        }
        return current_balance;
      }catch(err){
        console.log(err);
      }
      
    }


/**
 * Display an overlay to confirm a crypto transfer
 * @param app - the Saito application
 * @param mod - the containing module
 * @param sender - a public key address of sender
 * @param receiver - public key address of receiver
 * @param amount - the amount of crypto
 * @param ts (unused)
 * @param ticker {string} - name of a currency
 * @mycallback - an optional callback function to run on confirmation
 */ 
    sendPayment(app, mod, sender, receiver, amount, ts, ticker, mycallback=null) {

      try{
        let sobj = {};
          sobj.amount = amount;
          sobj.from = sender;
          sobj.to = receiver;
          sobj.ticker = ticker;

        this.overlay.closebox = false; 
        this.overlay.show(app, mod, GameCryptoTransferManagerSendTemplate(app, sobj));
        this.overlay.blockClose();
        document.querySelector(".crypto_transfer_btn").onclick = (e) => {
	   let ignore_checkbox = document.querySelector(".ignore_checkbox");
	   if (ignore_checkbox.checked) {
	     mod.game.state.crypto_auto_settle = 1;
	   }
           this.hideOverlay(mycallback);
        };  
      } catch(err) {
        console.log(err);
      }
      

    }


/**
 * Display an overlay to confirm a crypto transfer
 * @param app - the Saito application
 * @param mod - the containing module
 * @param sender - a public key address of sender
 * @param receiver - public key address of receiver
 * @param amount - the amount of crypto
 * @param ts (unused)
 * @param ticker {string} - name of a currency
 * @mycallback - an optional callback function to run on confirmation
 */ 
    async receivePayment(app, mod, sender, receiver, amount, ts, ticker, mycallback=null) {

      try{
        let sobj = {};
        sobj.amount = amount;
        sobj.from = sender;
        sobj.to = receiver;
        sobj.ticker = ticker;

        this.overlay.closebox = true;  //include a way to close in case the receive funds hangs
        this.overlay.show(app, mod, GameCryptoTransferManagerReceiveTemplate(app, sobj));
        this.overlay.blockClose();

        //We want to automatically run the callback so that the overlay
        //can update when it detects a received payment
        
        if (mycallback != null) { mycallback(document.querySelector("#cryptoManagerFeedback")); }

        let confirmBtn = document.querySelector("#crypto_receipt_btn");
        let ignoreBtn = document.querySelector(".ignore_checkbox");

        if (confirmBtn) {
          confirmBtn.onclick = (e) =>{
	    let ignore_checkbox = document.querySelector(".ignore_checkbox");
	    if (ignore_checkbox.checked) {
	      mod.game.state.crypto_auto_settle = 1;
	    }
            this.hideOverlay();
          };         
        }

        if (ignoreBtn) {
          ingoreBtn.onchange = (e) =>{
	    let ignore_checkbox = document.querySelector(".ignore_checkbox");
	    if (ignore_checkbox.checked) {
	      mod.game.state.crypto_auto_settle = 1;
	    }
            this.hideOverlay();
          };       
        }

      } catch(err) {
        console.log(err);
      }

    }




/**
 * Display an overlay to confirm in-game crypto functionality
 * @param app - the Saito application
 * @param mod - the containing module
 * @param ticker - the web3 crypto
 * @param stake - the amount of crypto
 * @param sigs - any sigs from other players (passed to proposeGameStake()
 * @param ts - timestamp of original request (if exists)
 * @param ticker {string} - name of a currency
 * @mycallback - an optional callback function to run on confirmation
 */
    async approveGameStake(app, mod, ticker, stake, sigs=[], ts=new Date().getTime(), mycallback=null) {


      try{

console.log("ACTIVE MODULE: " + mod.name);

        let sobj = {};
        sobj.ticker = ticker;
        sobj.stake = stake;
console.log("CRYPTO MSG: 1 " + mod.crypto_msg);
console.log("CRYPTO MSG: " + mod.game.crypto_msg);
        sobj.crypto_msg = mod.crypto_msg;
        sobj.sigs = sigs;

        this.overlay.closebox = true;  //include a way to close in case the receive funds hangs
        this.overlay.show(app, mod, GameCryptoTransferManagerStakeTemplate(app, sobj));
        this.overlay.blockClose();

        document.querySelector("#enable_staking_yes").onclick = (e) =>{
	  mod.proposeGameStake(ticker, stake, sigs, ts);
          this.hideOverlay();
        };         
        document.querySelector("#enable_staking_no").onclick = (e) =>{
          this.hideOverlay();
        };         
      } catch(err) {
        console.log(err);
      }
    }





    /**
     *  Programmatically close the overlay
     */
    hideOverlay(mycallback = null) {
      this.overlay.hide();
      if (mycallback){
        mycallback();
      }
    }

}

module.exports = GameCryptoTransferManager;

