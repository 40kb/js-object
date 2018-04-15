'use strict';

// 创建一个object
var cat = {name: 'Fluffy', color: 'White'}

console.log( cat.name );

// 创建object之后给这个object添加新的property
// 一种方式是用 . (这种方式比较方便)
cat.age = 3;
console.log(cat.age);

// 另外一种方式是用 []
cat['height'] = '30cm';
console.log( cat.height );
// 这种方式特别在你要创建的property/method是存在某个变量里面的时候非常有用
// 还有一种情况就是如果你想定义的property name不是合法的identifyer的话也要用 []
// 例如：cat['eye color']
//
// 这两种情况下用 . 是做不到的
var kind = 'abc'
cat[kind] = 'green abc'
console.log(cat.abc)


// 添加method到object里面，这个和添加property的方式是一模一样的
cat.speak = function() {
  console.log('Meeooow');
};
cat.speak();



// Javascript没有class，但是可以模拟class
// ES6只是提供了class的语法，但是还是没有class
function Cat() {
  this.name = 'Fluffy',
  this.color = 'White'
}

// what 'this' refer to?
// calling the Cat() without new keywork?

var cat1 = Cat(); //undefined
// 会返回undefined. 因为Cat()就是一个普通的函数
// 而这个函数没有返回任何东西，默认就会返回undefined
// 这个时候Cat()里面的this指向的是global object(window)
console.log(window.color) // White


var cat2 = new Cat();
// 当用new来呼叫这个函数的时候，new这个operator会创建一个新的empty object
// 这个function里面的this就指向了这个empty object，然后再执行function body
// 最后new就会返回，就把这个新创建的object
//
// 这里要注意的是，如果这个Cat() function body里面有return 东西的话，
// 这个时候new 就不会去创建一个empty object
console.log(cat2.color) //White


// 但是我们不单单就要white cat, 我们需要各种各样的cat。
// 可以把Cat()的color当作变量传进来，其它property也同样的道理
// 这样我们就可以得到各种各样的cat
function Cat2( name, color ) {
  this.name = name;
  this.color = color;
}

// 我要绿色的cat
var greenCat = new Cat2( 'g1', 'green');

// 我想要红色的cat
var redCat = new Cat2( 'g2', 'red');

// 这个时候像Cat2()这样的function，
// 在javascript里面就称作为(constructor function) - 构建函数
// construct something out


// 到目前为止我们知道创建一个object的话可以有两种方式
// object literals 和 constructor function by using new keyword
// 这两种方式都只是Object.create()的两种不同表现形式而已(syntax sugar)


// 这两种方式创建出来的object都可以用Object.create()来完成
var cat3 = Object.create(Object.prototype, {
  name: {
    value: 'Fluffy',
    enumerable: true,
    writable: true,
    configurable: true
  },
  color: {
    value: 'White',
    enumerable: true,
    writable: true,
    configurable: true
  }
});
// 事实上你用object literals 和constructor function 来创建object都时候，
// 都会触发这个Object.create()可以看到，用这两种方式来创建object，JS在底层会
// 帮你处理像 enumerable, writable, configurable这些特性



// 用ES6提供的'class'(另外一个用来创建object的 syntax sugar)的方式来创建object
// 语法看起来有点像constructor function，但是更像传统oop语言里的class的用法
class Cat {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }

  speak() {
    console.log('Meeooow');
  }
}

var cat4 = new Cat('Fluffy', 'White');
console.log(cat4)