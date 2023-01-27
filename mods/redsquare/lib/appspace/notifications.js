// const AppspaceNotificationsTemplate = require("./notifications.template");

// class AppspaceNotifications {

//   constructor(app, mod, container = "") {
//     this.app = app;
//     this.mod = mod;
//     this.container = container;
//     this.name = "RedSquareAppspaceNotifications";
//   }

//   render() {

//     //
//     // replace element or insert into page
//     //
//     if (document.querySelector(".redsquare-notifications")) {
//       this.app.browser.replaceElementBySelector(AppspaceNotificationsTemplate(), ".redsquare-notifications");
//     } else {
//       if (this.container) {
//         this.app.browser.addElementToSelector(AppspaceNotificationsTemplate(), this.container);
//       } else {
//         this.app.browser.addElementToDom(AppspaceNotificationsTemplate());
//       }
//     }

//     this.mod.menu.incrementNotifications("notifications", 0);


//     for (let i = 0; i < this.mod.notifications.length; i++) {
//       this.mod.notifications[i].container = ".redsquare-notifications";
//       if (this.processNotification(this.mod.notifications[i])) {
// 	this.mod.notifications[i].text = html;
//         this.mod.notifications[i].render();
//       }
//     }

//     this.attachEvents();

//   }  

//   attachEvents() {

//   }


//   //
//   // returns 0 (do not render) or 1 (render)
//   //
//   processNotification(tweet) {
 
//     let html = '';
//     let txmsg = tweet.tx.returnMessage();

//     if (tweet.tx.transaction.ts > this.mod.last_viewed_notifications_ts) {
//       this.mod.last_viewed_notifications_ts = tweet.tx.transaction.ts;
// //      this.mod.saveRedSquare();
//     }

//     ///////////
//     // LIKED //
//     ///////////
//     if (txmsg.request == "like tweet") {
//       let qs = `.tweet-${txmsg.data.sig}`;
//       let obj = document.querySelector(qs);
//       if (obj) {
//         obj.innerHTML = obj.innerHTML.replace("liked ", "really liked ");
//         return 0;
//       } else {
//         tweet.text = "";
// 	return 1;
//       }
//     }

//     else if (txmsg.request == "create tweet") {

//       if (txmsg.data.retweet_tx) {

//         /////////////
//         // RETWEET //
//         /////////////
//         tweet.notice = "retweeted your tweet";
// 	return 1;

//       } else {

//         ///////////
//         // REPLY //
//         ///////////
//         tweet.notice = "replied to your tweet";
// 	return 1;

//       }
//     }
//   }

// }

// module.exports = AppspaceNotifications;



const RedSquareAppspaceNotificationsTemplate = require("./notifications.template");
const Notification = require("./../notification");
const SaitoLoader = require("./../../../../lib/saito/new-ui/saito-loader/saito-loader");

class RedSquareAppspaceNotifications {

  constructor(app, mod, container = "") {
    this.app = app;
    this.mod = mod;
    this.name = "RedSquareAppspaceNotifications";
    this.saito_loader = new SaitoLoader(app, mod);
    this.increment = 1;
    this.container  = container;
  }

  render() {
    let app = this.app;
    let mod = this.mod;

    console.log('app ', app, 'mod ', mod);

       if (document.querySelector(".redsquare-notifications")) {
      this.app.browser.replaceElementBySelector(RedSquareAppspaceNotificationsTemplate(app, mod), ".redsquare-notifications");
    } else {
      if (this.container) {
        this.app.browser.addElementToSelector(RedSquareAppspaceNotificationsTemplate(app, mod), this.container);
      } else {
        this.app.browser.addElementToDom(RedSquareAppspaceNotificationsTemplate(app, mod));
      }
    }

    for (let i = 0; i < mod.notifications.length; i++) {
      console.log(mod.notifications, 'notifications')
      let notification = new Notification(app, mod, mod.notifications[i].tx);

      notification.render(app, mod, ".redsquare-notifications");
    }
    mod.notifications_number_unviewed = 0;


    this.attachEvents(app, mod);

  }

  attachEvents() {
    let app = this.app;
    let mod = this.mod
    
    notificationSelf = this;

    sel = ".tweet";

    if (document.querySelector(sel) != null) {
      document.querySelector(sel).onclick = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        notificationSelf.saito_loader.render(app, mod, 'redsquare-home-header', false);

        let el = e.target;
        let tweet_sig_id = el.getAttribute("data-id");

        document.querySelector(".redsquare-list").innerHTML = "";

        let sql = `SELECT * FROM tweets WHERE sig = '${tweet_sig_id}'`;
        mod.fetchTweets(app, mod, sql, function (app, mod) { 
          let t = mod.returnTweet(app, mod, tweet_sig_id);

          if (t == null) {
            console.log("TWEET IS NULL OR NOT STORED");
            return;
          }
          if (t.children.length > 0) {
            mod.renderWithChildren(app, mod, tweet_sig_id);
          } else {
            mod.renderWithParents(app, mod, tweet_sig_id, 1);
          }
        });

        if (!window.location.href.includes('type=tweet')) {
          let tweetUrl = window.location.href + '?tweet_id=' + tweet_sig_id;      
          window.history.pushState({}, document.title, tweetUrl);  
        }

        notificationSelf.saito_loader.remove();
      };
    }
  }

}

module.exports = RedSquareAppspaceNotifications;

