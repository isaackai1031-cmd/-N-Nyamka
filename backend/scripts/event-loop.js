// L17: Event loop-ийн дарааллыг ажиглах туршилт.
// Ажиллуулахаас ӨМНӨ гаралтын дарааллыг цаасан дээр таамаглаад, дараа нь харьцуул.

console.log("1. sync эхлэл");

setTimeout(() => console.log("5. setTimeout 0 (timer queue)"), 0);

setImmediate(() => console.log("6. setImmediate (check queue)"));

Promise.resolve().then(() => console.log("4. Promise.then (microtask)"));

process.nextTick(() => console.log("3. process.nextTick (microtask-аас ч өмнө)"));

console.log("2. sync төгсгөл");

// Хүнд sync ажил бусдыг хаадаг: доорх давталт дуустал дээрх callback-ууд хүлээнэ.
const start = Date.now();
while (Date.now() - start < 50) {
  // 50ms CPU эзэлнэ
}
console.log(`2б. 50ms blocking ажил дууслаа (callback-ууд одоо л ажиллана)`);
