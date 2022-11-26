/* add 함수를 { add: [Function: add] } 형태의 오브젝트로 받았을 때

const add = require("./math");
console.log(add) // { add: [Function: add] }
console.log(add.add(3,4)); //7 

// 깔끔하게 사용하기 위해, 객체 구조분해 할당으로 객체 안에 있는 add 함수를 받아 옴
const { add } = require("./math");
console.log(add(3, 4));

// 구조분해 할당할 때, add함수에 새로운 변수명으로 할당
const { add: addFunc } = require("./math");
console.log(addFunc(3, 4));
*/

// add 함수를 직접 모듈로 받아오는 경우 -> 바로 사용
const add = require("./math");
console.log(add(3, 4));
// Print: 7
