# Variable

React由於其設計採用Virtual DOM的概念，因此今天Component是否會隨著資料異動，得要看有沒有做binding的行為，有bind的資料才可以隨著修改更動前端的頁面。

或者可以更簡單的理解成，React會隨著更新而異動前端頁面的，只有State。

咦?
不是說React還有一個Props嗎?怎麼會說只有State會隨著更新異動前端頁面呢?


## Local Variable

首先是Native Javascript的變數。
這樣的變數也可以透過語法糖顯示在前端 :
```javascript
let test = `I belive I can fly`
return (<div>{test}</div>)
```

但是更新時卻無法連帶更新前端頁面
```javascript
let counter = 0
let test = `I belive I can fly${counter}`
return (
    <div>{test}
        <button onclick={() => {console.log(counter++)}}>Click Me</button>
    </div>
)
```

為什麼React不自動將所有Local變數bind到Virtual DOM呢?

原因很簡單，因為這樣會天下大亂。
試想，當所有Local變數都被Bind到Virtual DOM，很多用來記錄使用者操作的變數都會因為這樣而被修改到，甚至是for loop的每一個loop都引發畫面的Rerender，這樣很容易會進入無窮Rerender的狀況中。

## Prop

Props指的是由Parent傳進來的資料，而Child本身是不能對其更改的，屬於唯獨資料。

Props的確有跟Vritual DOM做Binding，因此當Props資料更新時，Component的確也會更著更新他的頁面。

但要注意的是，Props的更新是由Parent單向傳給Child，因此更像是Parent去更新Child，而不是屬於Component自己的行為。

從以下範例來看，可以發現Child自己並沒有更新Props去改動頁面的能力，因此前面才會說`React會隨著更新而異動前端頁面的，只有State。`(實際上Props是有Bind Virtual DOM的)。

* Parent
```javascript
const Parent = (props) => {
    const [Name, setName] = useState("World")
    return(
        <div>
            <div>I'm Parent</div>
            <div><input id={"demo"} /></div>
            <div>
                <button onClick={() => {
                    setName(document.getElementById("demo").value)
                }}>Click Me</button>
            </div>
            <Child Name={Name}></Child>
        </div>
    )
}
```

* Child
```javascript
const Child = (props) => {
    const {Name} = props
    return(
        <div>Hello {Name}, I'm Child</div>
    )
}
```


## State

State是Component自己定義，Bind到Virtual DOM的變數。

當今天State的資料被改動，會觸發一次Life Cycle，檢查資料異動狀況，並以最小代價重新渲染頁面。

這一課只會使用Hook的State，並不會進階到使用Redux那一套。

* Counter
```javascript
const Sample =  (props) => {
    const [counter, setCounter] = useState(0)
    async function clickButton ()  {
        setCounter(counter + 1)
    }

    return(
        <div>
            <div>{ counter }</div><br />
            <button onClick={ () => clickButton() }>click me to call data</button>
            {
                data.length > 0 ?
                <div>{ 
                    data.map(item => {return(item["TID"])}) 
                }</div> : <div>no data yet</div>
            }
        </div>
    )
}
```




## Homework : Paging Component

請製作一個表格換頁功能的Component，需要包含以下功能

1. 下一頁
2. 上一頁
3. 第一頁
4. 最後一頁
5. 輸入頁數後換頁
6. 顯示 : "現在是第幾頁/總頁數"
7. 調整一頁有多少筆資料(5、10、20、50、100)

設計上盡可能思考如何與表格連動，建議自己繪製Component Tree會便於思考這部分。