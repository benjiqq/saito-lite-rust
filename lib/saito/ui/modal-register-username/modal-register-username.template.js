module.exports = ModalRegisterUsernameTemplate = () => {

  return `  
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
      <div class="welcome-modal-left">
        <div class="welcome-modal-header">Welcome to Saito</h1></div>
        <div class="welcome-modal-main">
          <p style="margin:1em 0">You currently have an Anonymous Account, which means when you play games, other players will know you by your public key. Do yourself and your friends a favor by picking a human readable username:</p>
          <div class="welcome-modal__input-container">
            <input class="username-registry-input welcome-modal__input" id="registry-input" type="text" placeholder="username">
            <span">@saito</span>
          </div>
        </div>
      <div class="register-modal-controls">
      <button class="welcome-modal__button" id="registry-modal-button">REGISTER USERNAME</button>  
      <div class="welcome-modal-info">
            <div class="tip">What is a Saito username? <i class="fas fa-info-circle"></i>
            <div class="tiptext">Saito usernames can be used to send and receive messages. Some applications require Saito usernames to help prevent robots/spam. It takes a minute to register an address (so it may not show up right away). You should get one!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  /*
  <input style="display: var(--saito-wu);" id="name" name="name" type="text"></input>
  <div class="welcome-modal-exit tutorial-skip">
        <p>
            Thanks, but...
        </p>
        <p>
            Maybe later.
        </p>
        <i class="fas fa-arrow-right"></i>
      </div>
  */
}
