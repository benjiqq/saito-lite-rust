module.exports = (roomCode) => {
   return `
      <div class="stunx-invite-overlay saito-modal saito-modal-add-contact">
         <div class="saito-modal-title">Invite Friends to Video Chat</div>
         <div class="saito-modal-content">
           <div id="stunx-copy-vide-invite-code" class="saito-modal-option"><i class="fas fa-key"></i><div class="">Share Code</div></div>
           <div id="stunx-copy-video-invite-link" class="saito-modal-option"><i class="fas fa-link"></i><div>Share Link</div></div>
         </div>
      </div>
    `;
}

// ${window.location.host}/stunx?invite_code=${roomCode}