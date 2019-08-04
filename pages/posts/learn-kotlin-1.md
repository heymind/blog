---
title: Kotlin 1
layout: draft
category:
  - coding
tags:
  - kotlin
---

# Kotlin 1
## Table of Contents
## 基本语法
```kotlin
var n = 1         // 定义变量，类型自动推倒
val m = 2         // #TODO  定义不可变量
var k: Int        // 定义变量不含默认值需要显式声明变量类型(Int)
```
声明函数的格式，如果没有返回值可以省略返回值类型或者声明返回类型为 `Unit` 。
```kotlin
fun hello(m:Int):Int {
    return m + 1
    }
fun getSomething() = "abcd"     
```

## 数值类型
### 数值类型隐式转换 # TODO 是叫隐式转换么
```java
int m;
byte n = 120;
m = n;  //自动将byte类型转换为了int类型
```
```kotlin
var m:Int
val n:Byte = 10
m = n.toInt() //需要显式转换
```

### 数组
- `val a = arrayOf(1, 2, 'a')` 任意值组成的数组
- `arrayOfNulls<Int>(10)` 长度为 10 的 Int 型空数组
- `intArrayOf` `shortArrayOf` 定义指定类型的数组
- `Array(10, { i -> i })` Array 类构造器 # TODO

### 字符串模板
```kotlin
val s = "String"
val c = "The length of $s is ${s.length}"
```

## 包
Java 中包的名字和所在目录是有联系的，为了保持平台通用性，用 `.` 进行分割。Kotlin 中包名称和目录没有必然联系。

### import 别名
```kotlin
import a.b.someFunction as f
```

## 控制语句

### if 表达式

Kotlin 中 if 可以当作表达式使用。

```kotlin
val a = 1
val b = 2
val max = if (a > b ) a else b
```
 
### when
Kotlin 中用 when 代替了 switch ，区别在于第一个满足条件的分支执行完之后并不需要 break ，并且 when 和 if 一样可以当作表达式去使用。

```kotlin
// #TODO 需要一个例子 1,2 in 关键字  分支是任意表达式
``` 

## 类和接口
关键词 主构造器 第二构造器 init block 
- Kotlin 不支持静态方法和成员。
- Kotlin 函数支持默认值 -> 关于实现细节的讨论 p56
- Getter Setter p60
- Kotlin 默认 class 是 final 的，默认时 class 不许继承，需要显式使用 open 关键字允许继承 class 。此外，类方法默认也是不可重写的，如果需要在子类重写父类的方法需要再相应的父类方法前面添加 open 关键字，子类重写方法前面添加 override 关键字。
- 接口中的属性和方法都是 open 的。 Kotlin 允许接口方法包含默认的方法体。
- 

import { Layout } from '../../components/layouts/Article'

export default Layout