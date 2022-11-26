function add(a, b) {
  return a + b;
}
/*
//모듈을 호출했을 때, add 키 값에는 (a,b){return a+b;} 익명함수가 할당
exports.add = function (a,b) {
    return a+b
}
exports.add = add;

// add 함수를 익명, 화살표 함수로 표현 => add 키 값에 (a,b){return a+b} 익명함수가 할당
const add = (a, b) => {
  return a + b;
};

exports.add = add;

//모듈을 호출했을 때, add 키 값에는 add 함수가 들어가는 방법 (위와 같음)
module.exports = {add : add}


// 모듈 자체에 add 함수를 할당
module.exports = add
*/

module.exports = add;
