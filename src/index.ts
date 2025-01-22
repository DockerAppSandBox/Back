import app from "./config/server";
import prisma from "./config/database";
import * as os from "os";

const port = process.env.PORT || 8000;

function getNetworkAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface && iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

let server = app.listen(port, () => {
  const address = getNetworkAddress();
  console.info(`🎆 Server is running at http://${address}:${port} 🎄`);
});

// Export pour les tests
export { app, server, prisma };
