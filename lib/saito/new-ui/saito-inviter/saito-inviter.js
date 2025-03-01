const SaitoInviterTemplate = require("./saito-inviter.template");
const SaitoOverlay = require("./../saito-overlay/saito-overlay");


class SaitoInviter {

  constructor(app, mod) {

    this.app 		= app;
    this.name 		= "SaitoInviter";
    this.overlay        = new SaitoOverlay(app);
    this.mycallback     = null;
    this.options        = {};

  }

  render(app, mod, mycallback=null) {

    if (mycallback != null) { this.mycallback = mycallback; }
    this.overlay.show(app, mod, SaitoInviterTemplate(app, mod, this.options));
    this.attachEvents(app, mod, this.mycallback);

  }


  attachEvents(app, mod, mycallback){

    document.querySelector(".saito-public-invitation").onclick = (e) => {
      this.overlay.hide();
      if (mycallback != null) { mycallback("public"); }
    };

    document.querySelector(".saito-private-invitation").onclick = (e) => {

      document.querySelectorAll(".saito-invite").forEach(el => {
	el.remove();
      });

      let html = `
	<input type="text" placeholder="address" id="saito-invite-address" class="saito-invite-address" />
	<div class="saito-button-secondary small saito-invite-button" id="saito-invite-button">invite</div>
      `;

      app.browser.addElementToSelector(html, ".saito-inviter");

      document.getElementById("saito-invite-button").onclick = (e) => {
	let address = document.getElementById("saito-invite-address").value;
	if (app.crypto.isPublicKey(address)) {
	  this.overlay.hide();
          if (mycallback != null) { mycallback(address); }
	} else {
	  alert("Not a public key / Saito address");
	}
      }

    };

  }

}

module.exports = SaitoInviter;

