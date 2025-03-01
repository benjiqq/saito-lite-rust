module.exports = (app, mod) => {

  return `
    

<!DOCTYPE html>
<html lang="en" data-theme="light">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

  <link rel="stylesheet" href="/saito/lib/font-awesome-6/css/all.css" type="text/css" media="screen" />

  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="application-name" content="saito.io redsquare" />
  <meta name="apple-mobile-web-app-title" content="🟥 Saito Red Square" />
  <meta name="theme-color" content="#FFFFFF" />
  <meta name="msapplication-navbutton-color" content="#FFFFFF" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="msapplication-starturl" content="/index.html" />


  <meta name="twitter:card" content="${mod.social.twitter_card}" />
  <meta name="twitter:site" content="${mod.social.twitter_site}" />
  <meta name="twitter:creator" content="${mod.social.twitter_creator}" />
  <meta name="twitter:title" content="${mod.social.twitter_title}" />
  <meta name="twitter:url" content="${mod.social.twitter_url}" />
  <meta name="twitter:description" content="${mod.social.twitter_description}" />
  <meta name="twitter:image" content="${mod.social.twitter_image}" />

  <meta property="og:title" content="${mod.social.og_title}" />
  <meta property="og:url" content="${mod.social.og_url}" />
  <meta property="og:type" content="${mod.social.og_type}" />
  <meta property="og:description" content="${mod.social.og_description}" />
  <meta property="og:site_name" content="${mod.social.og_site_name}" />
  <meta property="og:image" content="${mod.social.og_image}" />
  <meta property="og:image:url" content="${mod.social.og_image_url}" />
  <meta property="og:image:secure_url" content="${mod.social.og_image_secure_url}" />

  <link rel="icon" sizes="192x192" href="/saito/img/touch/pwa-192x192.png" />
  <link rel="apple-touch-icon" sizes="192x192" href="/saito/img/touch/pwa-192x192.png" />
  <link rel="icon" sizes="512x512" href="/saito/img/touch/pwa-512x512.png" />
  <link rel="apple-touch-icon" sizes="512x512" href="/saito/img/touch/pwa-512x512.png" />

  <title>Saito RedSquare</title>
</head>

<body>


</body>
<script type="module" src="https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js"></script>
<script id="saito" type="text/javascript" src="/saito/saito.js"></script>

<style>
  body::before {
    content: "";
    position: absolute;
    height: 100vh;
    width: 100vw;
    background: #fff;
    z-index: 100000000000;
  }
  body::after {
    content: "";
    background-color: transparent;
    background-image: url("./images/saito-loader.svg");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    animation-duration: 2s;
    animation-name: homepulse;
    animation-iteration-count: infinite;
    position: absolute;
    top: 25%;
    left: 50%;
    width: 70px;
    height: 70px;
    z-index: 100000000001;
  }

  @keyframes homepulse {
  0% {
      transform: translate(-50%, -50%) scale(0.2);
      border-radius: 50%;
      background-size: 0px;
  }

  30% {
      transform: translate(-50%, -50%) scale(1);
      border-radius: 0;
      background-color: red;
      background-size: 0px;
  }

  50% {
      background-size: 50px;
      transform: translate(-50%, -50%) scale(1.1);
  }

  70% {
      transform: translate(-50%, -50%) scale(1);
      border-radius: 0;
      background-color: red;
      background-size: 50px;
  }

  100% {
      transform: translate(-50%, -50%) scale(0.5);
      border-radius: 50%;
      background-size: 0px;
  }
}

</style>


</html>

`;

}
