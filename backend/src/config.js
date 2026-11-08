// L17: Тохиргоог нэг газраас уншина. Нууц утгыг кодод бичихгүй, .env-ийг commit хийхгүй.
// process.env-ийн утга үргэлж ТЕКСТ байдаг тул тоо болгож шалгана.

function readPort(raw) {
  if (raw === undefined || raw === "") return 3000;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT буруу байна: "${raw}"`);
  }
  return port;
}

function loadConfig(env = process.env) {
  return {
    port: readPort(env.PORT),
    nodeEnv: env.NODE_ENV || "development",
  };
}

module.exports = { loadConfig, readPort };
