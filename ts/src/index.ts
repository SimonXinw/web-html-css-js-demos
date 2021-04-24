//ts里面的基本数据类型
//字符串类型
// let str:string = "hello!"
// let num:number = 18
// str = `我的年龄是${num}岁！`
// console.log(str)


//boolean类型  true or false
// let bool:boolean = true


//number类型  数值
// let num:number = 10
// num = .5


//数组类型的定义方式一
// let arr:number[] = [1,2,3]
// console.log(arr)


//数组类型的定义方式二  通过泛型的方式定义数组
// let arr:Array<number> = [1,2,3]
// console.log(arr)


//元祖类型
// let x:[number,string]
// x = [1,"2"]

// console.log(x[1].substr(1))
// console.log(x[0])


//枚举类型  enum Color{}
// enum Color{
//     RED,GREEN,BLUE
// }

// let c:Color = Color.BLUE  //2
// let names:string = Color[c] //Color[2]
// console.log(names)  

//any代表任意类型
// let notSure: any = 4
// notSure = "maybe a string instead" // OK 赋值了一个字符串
// notSure = false // OK 赋值了一个布尔值
// notSure.toString()

// let arr:any[] = [1,2,3,'4',true]



//void (number[] or Array<number>)    :void 描述函数的时候，就代表这个函数没有任何的返回值
// function abc():Array<number> {
//     return [1,2,3]
// }
// abc()



//类型推断
// let str = "hello"  //内部会根据等号右边的hello推断出左边的变量str是string类型的
// str = 10   //后续对于string类型的变量str进行赋值操作就会报错了



//这里定义了变量没有赋值  那么内部就是认为他是any类型
// let myFavoriteNumber 
// myFavoriteNumber = 'seven' 
// myFavoriteNumber = 7


// let someValue:any = "this is a string"
// let strLength: number = (someValue).length 


//联合类型
// let str:string | number | boolean | Array<number>
// str = [3,3432]


//访问联合类型的属性和方法 (只能放置两个类型同时支持的方法)
// function getLength(something: string | number): string {
//     return something.toString()
// }

// console.log(getLength("hello"))



//联合类型的类型推断
// let str:string|number
// str = "hello"
// console.log(str.length)
// str = 10
// console.log(str.length)  //此时str就会被类型推断为number类型，就不能够调用length属性了！



//null or undefined
//null和undefined是任何类型的子类型，就代表着在非严格模式下，就可以给任何类型赋值操作。
//null的话一般是给对象赋值null指针   
//一个变量声明了但是未赋值，那么这个变量就是undefined
// let x:number | undefined | null
// x = 1
// x = undefined 


//never  永远不  
//never类型表示的是那些永不存在的值的类型
//一般就是说函数内部抛出异常  or  函数内部有死循环一直返回不出来结果的时候，无休止的执行内部逻辑
function error():never{
    throw Error("errmessage...")
}


function whileFunc():never{
    while(true){

    }
}



let x:number
let y:never


x = (()=>{ throw new Error('exception')})()  //never类型是任何类型的子类型，所以呢never类型可以给任何类型赋值
  //报错了 没有任何类型是never的子类型，所以呢不能讲number类型赋值给never类型