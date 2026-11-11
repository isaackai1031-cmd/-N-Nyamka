// Entry point: тохиргоог уншаад серверийг асаана.
// L17-д энд runtime-ийн мэдээлэл хэвлэдэг байсан. L18-аас Express сервер асаадаг болов.
const { loadConfig } = require("./config"); // Өөрийн module (./ харьцангуй зам)
const { createApp } = require("./app");

function main() {
  let config;
  try {
    config = loadConfig();
  } catch (err) {
    console.error("[config error]", err.message);
    process.exitCode = 1; // process.exit()-ээс зөөлөн: үлдсэн ажлыг дуусгаад гарна
    return;
  }

  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`Node ${process.version} | ${config.nodeEnv}`);
    console.log(`Сервер аслаа: http://localhost:${config.port}/api/v1/health`);
  });

  // Port завгүй (EADDRINUSE) гэх мэт асаах үеийн алдаа.
  server.on("error", (err) => {
    console.error("[server error]", err.message);
    process.exitCode = 1;
  });

  return server;
}

// Шууд ажиллуулсан үед л main() дуудна. require() хийсэн тестэд ажиллахгүй.
if (require.main === module) {
  main();
}

module.exports = { main };
