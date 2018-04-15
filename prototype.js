// 来demo一下你为什么要prototype!
'use strict';

var arr = ['red', 'blue', 'green'];

// 假若你想取回array的最后一个值

// 最普通的做法是
var last = arr[arr.length - 1];
console.log(last);

// 你会想如果array能提供一个这样的property给你的话...多好
// 我就可以直接使用 var last = arr.last
//
// 但是javascript没有提供这样的last property
// 你也可以自己extend Array property(把这个last property加到array object 里面)
Object.defineProperty(arr, 'last', {
  get: function() {
    return this[this.length-1]
  }
});

var last = arr.last;
console.log(last);

// 但是这里有一个问题
// 当我新创建一个array的时候，这个新创建的array并没有last这个property
var arr2 = ['one', 'two', 'three']
console.log(arr2.last) // undefined


// 那我怎么做才可以让后来我创建的array都能使用这个last property?
// 你只需要把这个last property添加到Array.prototype里面就可以！
Object.defineProperty(Array.prototype, 'last', {
  get: function() {
      return this[this.length-1]
    }
});

// 现在arr2就可以使用这个last property
console.log(arr2.last); // three


// 那这个 Array 对象到底是什么
// 它是一个Function (constructor function)

/**
var arr = ['red', 'blue', 'green']

just shorthand for calling Array() constructor function with new keyword

var arr = new Array('red', 'blue', 'green');
**/


// 那Array.prototype又是什么?
// 'prototype' is an object exist in every function in javascript

// 随便创建一个function
var myFunc = function() {}

// 可以访问这个myFunc function的prototype
console.log(myFunc.prototype) // {}, empty object


// 但是object do not has prototype property!
// 随便创建一个新的object
var cat = { name: 'Fluffy' };

// 尝试去访问prototype
console.log(cat.prototype) // undefined

// 但是object has __proto__ property!
console.log(cat.__proto__) // object


// function's prototype 和 object'prototype 是不一样的!

// function's prototype:
// a function's prototype is the object 'instance' that will become the prototype for all objects created using this function as a constructor.
// (某个)函数的 prototype 是一个对象，当这个函数作为构造函数的时候，通过构造函数创建的实例的 prototype 属性都会指向它
// 例如：
// function Cat(name, age) {
//   this.name = name
//   this.age = age
// }
// 这个 Cat() 函数有一个 prototype 属性，当它作为构造函数的时候
// var cat = new Cat('KIKO', 5)
// 这个 cat 实例的 prototype 属性指向的是 构造出cat的构造函数的 prototype 属性


// object's prototype:
// an object's prototype is the object 'instance' from which the object is inherited
// (某个)对象的 prototype(__proto__) 是一个对象，它(这个对象的 __proto__)指向的是这个对象继承而来的那个对象


// prototype in not like class, prototype is an object{}
// so when a function is created -- myFunc(),
// JS will created a 'prototype object' attach to this function -- myFunc.prototype
// if this function is use as constructor function (function call with new keyword)
// 那么由constructor function创建出来的object, 这个object的__proto__ property 和这个constructor function的prototype property指向的是同一个object! 同一个memory address
//
// myFunc.prototype 和 instance.__proto__ 指向的是同一个object

function Cat(name, color) {
  this.name = name
  this.color = color
}
console.log(Cat.prototype) // Cat{}

// 用Cat()作为constructor function来创建一个object
var fluffy = new Cat('Fluffy', 'White');

console.log(fluffy.__proto__) // Cat{}

// 现在Cat.prototype 和 fluffy.__proto__ 都指向同一个Cat{} object
// 这两个prototype都是指向到同一个object, 同一个memory address
console.log( Cat.prototype === fluffy.__proto__ )

// 现在改变Cat.prototype会影响fluffy.__proto__
Cat.prototype.age = 3

// fluffy.__proto__ 也能访问到 age
console.log( fluffy.__proto__.age ) // 3


// 再用Cat()作为constructor function来创建一个object
var muffin = new Cat('Muffin', 'Brown');

console.log( muffin.__proto__ ) // Cat{}, 指向的同一个prototype object


// 所以改变一个function 的prototype object,
// 会影响到每一个由这个function 作为constructor function
// 创建出来的instance object的__proto__ object


// how this work behind the scene?
function Cat(name, color) {
  this.name = name;
  this.color = color;
}

var fluffy = new Cat('Fluffy', 'White');
var muffin = new Cat('Muffin', 'Brown');

// 改变 Cat.prototype object 会影响到所有的 instance.__proto__
Cat.prototype.age = 4;

console.log( fluffy.age ) // 4
console.log( muffin.age ) // 4

// 不去改变Cat.prototype property
// 把age property添加在fluffy object
fluffy.age = 5

// 这个时候fluffy依旧可以访问两个age value
console.log( fluffy.age ) // 5
console.log( fluffy.__proto__.age ) // 4

// 就是说JS 会先去问fluffy是否有自己的age property
// 如果有的话就用自己的
// 如果没有JS就会去询问fluffy.__proto__ 是否有这个age property
// 如果有就用，如果没有就会是undefined

Object.keys(fluffy) // {0: name, 1: color}

// JS提供了 obj.hasOwnProperty() 来检查自身是否有某个property
console.log( fluffy.hasOwnProperty('age') ) // true
console.log( fluffy.hasOwnProperty('height') ) // false


// method(function in an object) 的运作和property是一模一样的!
// 广义上来说method 其实也是另外一种property!


// 如果你把Cat.prototype指向别的object会怎样?

// 这个时候Cat.property.age = 4
// 然后你创建了两个instance
var fluffy = new Cat('Fluffy', 'White');
var muffin = new Cat('Muffin', 'Brown');

fluffy.age // 4
muffin.age // 4

// 这个时候你让Cat.prototype指向到别的object
// 在内存了创建一个新的object, new memory address
Cat.prototype = { age: 5 }

// 然后你再去创建instance
var tplffin = new Cat('tffin', 'green')

tplffin.age // 5
// 这个时候tplffin.age 是为5，因为你在创建这个instance之前就改变了Cat.prototype的指向

fluffy.age // 4
muffin.age // 4
// 这两个instance的age还是4，因为这两个instance的__proto__ property指向的object （原来Cat.property指向的object）还是在内存里没有被消失!!



// Multiple Inheritance
//
// function is an object, and object has __proto__ property
// so what Cat.__propt__ property point to?!

Cat.__proto__ // Object{}
fluffy.__proto__.__proto__ // Object{}

// In JS all object inheritance from Object{} object
// 然而 Object{} 没有property
Object.__proto__ // null
fluffy.__proto__.proto__.__proto__ // null

// 所以在JS里面所有的object都存在了这样的一条property chain!!
// 所有的prototype chain 的顶端(root)都是Object{} 这个object


// 怎么创建自己想要的prototype chain?
// Cat是属于Animal，怎么让Cat inheritance from Animal?
function Animal() {}

Animal.prototype.speak = function() {
  console.log('Grunt');
}

function Cat(name, color) {
  this.name = name;
  this.color = color;
}

// 让Cat.prototype指向到Animal.prototype
Cat.prototype = Object.create(Animal.prototype);

// 为这么这里用Object.create()
// 而没有用把Animal()作为constructor function 通过 new keyword
// 来让 Cat.prototype 指向到 Animal.prototype?

// 因为用Object.create() 不会去呼叫这个Animal() function，
// 只会去setup prototype chain
// 如果用 new 的话会执行这个Animal() function，
// 很多时候在你setup prototype chain并不需要马上的执行这个function，
// 直到你用Cat()作为constructor function来创建实例的时候(才需要去执行这个Animal() function)


// 假如，当我们实例化一个cat的时候如果需要在Cat() constructor function 去呼叫 Animal() constructor function的时候，怎么去做?
function Cat(name, color) {
  Animal.call(this);  // 需要在这里加一句
  this.name = name;
  this.color = color;
}

// 完整例子
function Animal(voice) {
  this.voice = voice || 'grunt';
}

Animal.prototype.speak = function() {
  console.log(this.voice);
}

function Cat(name, color) {
  Animal.call(this, 'Meow');
  this.name = name;
  this.color = color;
}

Cat.prototype = Object.create(Animal.prototype);

var fluffy = new Cat('Fluffy', 'White');

console.log( fluffy ); // 注意得到的是 Animal{}

// 但是 fluffy 是通过Cat()来创建的，Cat() 作为constructor

// 通过 instanceof 来检验一下fluffy是属于由谁创建来的实例
console.log( fluffy instanceof Cat ); // true
// 但是同时
console.log( fluffy instanceof Animal ); // true

// 得到的结果都是正确的
// 但是fluffy的constructor没有正确，应该是Cat() 而不是Animal()
// 怎么去处理这个问题? -- 可以指定这个谁是constructor
Cat.prototype.constructor = Cat;

// 再来检验一下
console.log(fluffy) // Cat{}，正确了

// 这个时候
// fluffy.__proto__是Cat()
// fluffy.__proto__.__proto__是Animal()

// 当你要创建自己的prototype chain的时候
// 注意以下三行代码
// Animal.call(this, 'Meow');
// Cat.prototype = Object.create(Animal.prototype);
// Cat.prototype.constructor = Cat;


// 相比起上面的constructor function的方式来创建自己的prototype chain
// 更喜欢用ES6提供的class syntax来创建自己prototype chain?
// 只是语法不一样而已，在底层JS做的工作和上面介绍的是一模一样的!
calss Animal {
  constructor(voice) {
    this.voice = voice || 'grunt'
  }

  speak() {
    console.log(this.voice)
  }
}

class Cat extends Animal {
  constructor(name, color) {
    super('Meow');
    this.name = name;
    this.color = color;
  }
}

var fluffy = new Cat('Fluffy', 'White');
console.log( fluffy )
console.log( fluffy.constructor )

// 但注意一点
// 默认的情况下class property是{enumerable: false}的!!
// 所以在你loop through的时候你看不到的
console.log(Object.keys(fluffy.__proto__.__proto__)) // Array{}, empty

// 但是当你去检查是否有某个property的时候是可以检查出来的
console.log(fluffy.__proto__.__proto__.hasOwnProperty('speak')) // true




// QA
function fun() {
  this.a = 0;
  this.b = function() {
    alert(this.a)
  }
}

fun.prototype = {
  b: function() {
    this.a = 20;
    alert(this.a)
  },

  c: function() {
    this.a = 30;
    alert(this.a)
  }
}

var my_fun = new fun();

// 经过 new operator 之后输出的结果
// my_fun = {
//   a: 0,
//   b: function () {
//     alert(this.a)
//   }
// }
// 你已经知道 `fun.prototype`, `my_fun.__proto__` 指向的是同一个 object, memory address

my_fun.b()
// try to find "my_fun" object, YES! exist

my_fun.c()
// try to find "my_fun" object, don't exist! then goto prototype find...
/*
c: function() {
  this.a = 30; // this 指向的是 callside -> my_fun -> 去改变 `my_fun.a = 0` TO `my_fun.a = 30`
  alert(this.a)
}
*/


