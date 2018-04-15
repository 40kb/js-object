'use strict';

var cat = {
  name: 'Fluffy',
  color: 'White'
}

// 每一个property都有一个自己的property descriptor
// 可以通过Object.getOwenPropertyDescriptor()来获取
console.log(Object.getOwnPropertyDescriptor(cat, 'name'));

// 返回
Object {
  value: 'Fluffy',
  writable: true,
  enumerable: true,
  configurable: true
}

// 可以看到 'writable', 'enumerable', 'configurable'
// 默认的情况下会被设为true
// 'writable' -- 描述这个property的value是否可以被改变(会比较常用到)

// 可以通过Object.defineProperty()来改变这些property的descriptor的值

// 把 name property 改为 writable: false
Object.defineProperty(cat, 'name', {writable: false});

// 尝试去更改这个name的值
cat.name = 'Scratchy'; // 没有error, 你会觉得你已经赋值了，但是是没有成功的

// 注意如果你用'strict mode'的时候console会抛出error
// 如果你没用strict mode的话console是不会丢出error的!!
// (因为没有error不会引起你注意，很多时候debug起来会很难，建议你用strict mode)


// 注意当non-writable property的值是object的时候
var cat1 = {
  name : {first: 'Fluffy', last: 'LaBeouf'},
  color: 'White'
}

// 这个时候你依旧无法改变name的value
cat1.name = 'Scratchy' // error, 失败

// 但是你可以改变这个value object里面的property
cat.name.first = 'Scratchy' // 成功

console.log(cat.name);

// 其实把name理解为仅仅是作为一个pointer是很好理解的
// 当你设为readonly的时候(设为不可改变)，仅仅是限定了这个pointer为readonly(不可改变)

// 怎么去限制name property(不管它的值是object还是non-object)都不可改变?
// 可以用Object.freeze()来限制它为readonly
Object.freeze(cat.name);


// 在了解'enumerable'之前先看看
// 怎么去loop through every property in an object?(怎么遍历object的property)
// 用 'for...in'
for (var prop in cat) {
  console.log(prop); // name, color
}


// 'enumerable' -- 意思是是否可以遍历(loop through)到它
// true 意思是当你用for...in 去遍历这个object的property的时候能遍历它
// false 意思是当你用for...in 去遍历这个object的property的时候不能遍历它
Object.defineProperty(cat, 'name', {enumerable: false});

for (var prop in cat) {
  console.log(prop); // color, name不能遍历到
}

// 同样要注意的是当设置某个property，enumerable为false的时候
// 在用Object.keys()的时候, 这个property也是'找不到'
console.log(Object.keys(cat)); // { 0: color }, name找不到

// 同样，当设置某个property，enumerable为false的时候
// 会影响到JSON.stringify()的结果
console.log(JSON.stringify(cat)); // {"color":"White"}, name找不到

// 但是不会影响你去访问/改变它的值
console.log(cat.name); // {first: 'Fluffy', last: 'LaBeouf'}


// 'configurable' -- 意思是是否可以更改这个property的descriptor的值
// true 可以更改这些descriptor的值(default)
// false 不可以更改这些descriptor的值
// 同样的也可以用来保护这个property不能被删除
Object.defineProperty(cat, 'name', {configurable: false});


// 尽管你你再去更改configurable的值也是出错的
Object.defineProperty(cat, 'name', {configurable: true}); // error

// 不能更改
Object.defineProperty(cat, 'name', {writable: true}); // error

// 删除property
delete cat.name; // error


// 什么是getter和setter? (回头补充)

// 创建getter/setter需要通过Object.defineProperty()来完成
Object.defineProperty(cat, 'fullName', {
  // define a getter
  get: function() {
    return this.name.first + ' ' + this.name.last;
  },
  // define a setter
  set: function(value) {
    var nameParts = value.split(' ');
    this.name.first = nameParts[0];
    this.name.last = nameParts[1];
  }
})

// 现在可以通过fullName getter来获得cat的fullname
console.log(cat.fullName);

// 现在可以通过fullName setter来改变cat的fullname
cat.fullName = 'Muffin Top'

