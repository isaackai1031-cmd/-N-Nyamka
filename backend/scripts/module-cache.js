// L17: require() нь module-ийг НЭГ л удаа ажиллуулж, дараа нь cache-ээс өгдөг.
const path = require("node:path");

const a = require("../src/domain/stock");
const b = require("../src/domain/stock");
console.log("1. Хоёр require ижил объект уу:", a === b);

const resolved = require.resolve("../src/domain/stock");
console.log("2. Cache-д байгаа зам:", path.relative(process.cwd(), resolved));
console.log("3. Cache-д байна уу:", resolved in require.cache);

// Cache-ээс устгаад дахин require хийвэл шинэ объект үүснэ
delete require.cache[resolved];
const c = require("../src/domain/stock");
console.log("4. Cache цэвэрлэсний дараа ижил үү:", a === c);

// module.exports ба exports: exports = {...} гэж дахин оноовол export алга болно
console.log("5. module.exports-ийн түлхүүрүүд:", Object.keys(a).join(", "));
