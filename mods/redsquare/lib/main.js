const RedSquareMainTemplate = require("./main.template");

class RedSquareMain {

  constructor(app, mod, container = "") {
    this.app = app;
    this.mod = mod;
    this.container = container;
    this.name = "RedSquareMain";
  }

  render() {

    //
    // replace element or insert into page
    //
    if (document.querySelector(".saito-container")) {
      app.browser.replaceElementBySelector(RedSquareMainTemplate(this.app, this.mod), ".saito-container");
    } else {
      if (this.container) {
        app.browser.addElementToSelector(RedSquareMainTemplate(this.app, this.mod), this.container);
      } else {
        app.browser.addElementToDom(RedSquareMainTemplate(this.app, this.mod));
      }
    }

    this.attachEvents(app, mod);
  }  

  attachEvents(app, mod) {

  }

}

module.exports = RedSquareMain;

