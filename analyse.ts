// import "source-map-support/register";

import Server from "./lib/saito/core/server";
import StorageCore from "./lib/saito/core/storage-core";
import { Saito } from "./apps/core";

import mods_config from "./config/modules.config";

async function initSaito() {
  const app = new Saito({
    mod_paths: mods_config.core,
  });

  app.server = new Server(app);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.storage = new StorageCore(app);

  app.BROWSER = 0;
  app.SPVMODE = 0;

  //
  // set basedir
  //
  global.__webdir = __dirname + "/lib/saito/web/";

  await app.initMin();

  const { protocol, host, port } = app.options.server;

  const localServer = `${protocol}://${host}:${port}`;

  console.log(`......analyse.......

    address: ${app.wallet.returnPublicKey()}
    balance: ${app.wallet.returnBalance()}
    local module server: ${localServer}

    ################################################################

  
  `);

  function shutdownSaito() {
    console.log("Shutting down Saito");
    app.server.close();
    app.network.close();
  }

  /////////////////////
  // Cntl-C to Close //
  /////////////////////
  process.on("SIGTERM", function () {
    shutdownSaito();
    console.log("Network Shutdown");
    process.exit(0);
  });
  process.on("SIGINT", function () {
    shutdownSaito();
    console.log("Network Shutdown");
    process.exit(0);
  });
}

initSaito().catch((e) => console.error(e));
