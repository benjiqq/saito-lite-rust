const SaitoUserWithTimeTemplate = require('./../../../../lib/saito/new-ui/templates/saito-user-with-time.template');
const SaitoUser = require('./../../../../lib/saito/new-ui/templates/saito-user.template');

module.exports = (app, mod, invite) => {

console.log("WHAT IS OUR INVITE? " + JSON.stringify(invite));

    let html = `

       <div class="redsquare-item">

         ${SaitoUserWithTimeTemplate(app, invite.creator, "received recently", new Date().getTime())}

         <div class="redsquare-item-contents" id="redsquare-item-contents-${invite.invite_id}" data-id="${invite.invite_id}">
	   <div></div>
           <div class="redsquare-invite">

	     <div class="redsquare-invite-title">${invite.title}</div>
     `;
     if (invite.description) {
       html += `
         <div class="redsquare-invite-comment">${invite.description}</div>
       `;
     }
     html += `
             <div class="redsquare-invite-participants">

    `;
    let added = 0;
    for (let i = 0; i < invite.adds.length; i++) {
      let status = '<span class="saito-primary-color saito-primary">yet to accept</span>';
      if (invite.terms[i] === "on accept" && invite.sigs.length >= (i+1)) {
	if (invite.sigs[i] !== "") {
          status = '<span class="saito-primary-color saito-primary">accepted</span>';
        }
      }
      html += `   ${ SaitoUser(app, invite.adds[i], status) } `;
      added++;
    }
    while (added < invite.num) {
      html += `   ${ SaitoUser(app, "open slot", "anyone can join") } `;
      added++;
    }

    html += `
             </div>

             <div class="invites-invitation-controls" id="invites-invitation-controls-${invite.invite_id}">
               <div id="invites-invitation-join-${invite.invite_id}" class="invites-invitation-join saito-button-secondary small" data-id="${invite.invite_id}">join</div>
               <div id="invites-invitation-accept-${invite.invite_id}" class="invites-invitation-accept saito-button-secondary small" data-id="${invite.invite_id}">accept</div>
               <div id="invites-invitation-cancel-${invite.invite_id}" class="invites-invitation-cancel saito-button-secondary small" data-id="${invite.invite_id}>cancel</div>
             </div>

           </div>
         </div>
       </div>

    `;

    return html;

}

