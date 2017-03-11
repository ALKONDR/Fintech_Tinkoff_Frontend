/* eslint-disable no-console */

// 2.1 task
function toBinary(number) {
  const tmp = Math.floor(number / 2);
  return parseInt((tmp === 0 ? '' : String(toBinary(tmp))) + String(number % 2), 10);
}

console.log(toBinary(9));
// 1001

// 2.2 task
/*
 Complexity:
  hashset.add() - O(1)
  hashset.contains() - O(1)
  hashset.remove() - O(1)
  array.forEach() - O(n)

  findIntersection() = O(O(n) * O(1) * 2) = O(n)
*/
const HashSet = require('hashset');

function findIntersection(array1, array2) {
  const hashset = new HashSet();
  const intersection = [];

  array1.forEach((element) => {
    hashset.add(element);
  });

  array2.forEach((element) => {
    if (hashset.contains(element)) {
      hashset.remove(element);
      intersection.push(element);
    }
  });

  return intersection;
}

console.log(findIntersection([1, 3, 5, 7, 9], [1, 2, 3, 4]));
// [ 1, 3 ]

// 2.3 task

const expandArray = array => array.reduce((final, current) => final.concat(current), []);

console.log(expandArray([[1, 2], [3, 4, 5], [6]]));
// [ 1, 2, 3, 4, 5, 6]

// 2.4 task

const user = {
  uname: 'Vasya',
  greet() {
    return `Hello, ${this.uname}`;
  },
};

const bind = (callee, context) => (() => callee.apply(context, arguments));

console.log(user.greet());
const greet = bind(user.greet, user);
console.log(greet());
// Hello, Vasya
// Hello, Vasya

// 2.5 task

const sum = (element = 0) =>
  ((second = 0) =>
    (second === 0 ? element + second : sum(element + second)));

console.log(sum(1)(2)());
// 3
console.log(sum(1)(2)(3)());
// 6
