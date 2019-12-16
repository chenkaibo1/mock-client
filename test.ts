const { merge, assign } = require('lodash')
const obj1 = {
  a: 1,
  b: {
    c: 3,
    d: 4
  }
}
const obj2 = {
  b: { e: 5 },
  c: 4
}
// merge(obj1, obj2)
assign(obj1, obj2)
console.log(obj1)
