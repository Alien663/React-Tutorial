# SPA : Render only when changing

[React Offical Tutorial](https://zh-hant.legacy.reactjs.org/tutorial/tutorial.html)

## React Component
React是由Meta公司開源的前端框架，該框架專注於將狀態render到DOM結構，透過狀態前後改變，可以達成僅修改最小部分的DOM (DIFF演算法)，因此在前端框架中，效率可以排名第一。

現在React開始將程式碼設計風格固定為Functional Programing，已經不再繼續維護以前Object-Oriented Programming的寫法，在本教學中，除了Life Cycle的部分需要帶入以前OOP的程式碼來教學之外，也將會以FP為主。

在React中，需要區分兩個部分做學習

1. 頁面渲染
2. 資料流

### 頁面渲染

頁面渲染是指利用React語法糖，將資料直接秀在頁面上，這部分需要學會幾件事情:

1. 在前端顯示資料
2. 如何引入Class
3. 設定Style
4. 建立Component
5. HTML Element如何呼叫function
6. Component Tree

### 資料流

資料流指的是資料在不同Component之間傳遞的行為，如果你用的是Redux，那還包含Component與Store的傳遞，其中有幾項重要概念:

1. 單向資料流
2. Parent資料流向Child
3. Child更改Parent資料
4. 透過Store在不同Component之間傳遞資料
5. 透過Store呼叫API
6. 透過Store取得API的回傳資料


* React的基本Component
```javascript
import React, { useState } from 'react'
const MyComponent = (props) => {
    return(
        <div>Hello World</div>
    )
}
export default MyComponent
```

React的語法糖讓JS和Html的部分結合在一起，讓你在寫Component時自由度更高，直接將DOM結構定義為JS的變數，然後直接渲染在前端中。

* 語法糖
```javascript
import React, { useState } from 'react'
const MyComponent = (props) => {
    let kk = <div>Hellow World</div>
    return(
        <div>{kk}</div>
    )
}
export default MyComponent
```


## The Timer
### JQuery
```html
<div id="Timer"></div>
<script>
    let time = "KKKK"
    async function sleep (ms){
        return new Promise(r => setTimeout(r, ms))
    }
    
    (async() => {
        while(true){
            await sleep(1000)
            document.getElementById("Timer").innerHTML = Date()
        }
    })()
</script>
```

### React
```javascript
const MyTime = () => {
    const [time, setTime] = useState(Date())

    useEffect(() => {
        const interval = setInterval( ()=> {
            setTime(Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return(
        <div id="Timer">{time}</div>
    )
}
```

## Homework : Change Background Color

在Timer的div中建立三個html element

1. 一個div，id取名為demo_div
2. 一個input
3. 一個button

當button click時，將demo_div的背景變成input輸入的結果。
不限定方法，要用JQuery也可以。

* 期望的HTML結果(不一定要這樣，能夠達成功能即可)
```html
<div id="Timer">
    Time
    <input />
    <button></button>
</div>
```