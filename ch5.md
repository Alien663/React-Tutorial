# Hook

Hook 是 React 16.8 中增加的新功能。它讓你不必寫 class 就能使用 state 以及其他 React 的功能。

自從React增加了Hook之後，更加確定他的設計風格要往Functional Programing靠攏，之後的調整也大多圍繞Hook展開，可以見得React官方已經打算逐漸捨棄OOP的設計方式。

實際上更多細節可以看React官網提供的[訊息](https://zh-hant.legacy.reactjs.org/docs/hooks-intro.html#motivation)

因此，如果要學好React，也需要去了解FP的設計風格，才能跟上官方的設計。


## useState

在教useState之前，我們先來看看沒有Hook前，React要怎樣定義State。

在這個時候，React的Component設計是偏向OOP的設計風格，所有的Component都是繼承自React.Component，在constructor中拿到上一層Component給的Props，並initial state的資料，

看似簡單對吧，但是每一次更新State的行為其實挺繁複的，因為所有State都被綁定在一起，每一次的更新都要把之前的State都一併寫入，無形間帶來很多繁複工作。而且在這版本的React有太多東西都要重複寫了 (constructor那些的)，再者，如果要把funciton丟進下一層Component去執行 (two-way binding)，還需要另外bind function，因此這時候的React雖然執行效率很高，但是基礎的Component寫起來有很繁複。

```javascript
class Counter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            counts: 0
        }
    }

    render(){
        return(
            <div>
                <div>Click Times : {counts}</div>
                <button onClick={() => this.setState({ counts: this.state.counts + 1})}>Plus One</button>
            </div>
        )
    }
}

export default Counter
```

接著，我們來看看加上Hook後的Function Component，可以明顯感覺到整體結構簡單很多，特別是宣告State的部分，而且如果要做到two-way binding只要直接把function傳入cihld component就好，不再需要另外bind了。

```javascript
const Counter = (props) => {
    const [counts, setCounter] = useState(0)

    return(
        <div>
            <div>Click Times : {counts}</div>
            <button onClick={() => setCount(counts+1)}>Plus One</button>
        </div>
    )
}

export default Counter
```

從上面useState的範例中，我們可以看到他的State宣告方式相當簡單: `const [StateName, setStateName] = useState("Initial Data")`

而且不限定是字串或是數字，你想要用object、array都是可以的。

## useEffect

### React Component Life Cycle
在講useEffect之前，必須先提到React Life Cycle。

什麼是Life Cycle?
Life Cycle就好像一個Component的一生，從他的建立、更新到被銷毀(Ch4中的$node.remove())，一個Component在不同的階段有各自不同的狀態函數可以呼叫。我們可以依據不同功能所需，在不同的階段對資料或是前端頁面進行UI/UX的調整。

![React Lify Cycle](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LJvN_m5gZ7w6zT_LrYXUJw.png)

而Life Cycle大致上來說可以分成三種狀態:

1. mounting
2. updating
3. unmounting

而這幾個狀態又可以細分成很多小狀態 : 

* mounting
1. constructor : 用來初始化的地方，還沒掛載到DOM的時候，假設沒有寫super() ，就調用this的話會報錯
2. static getDerivedStateFromProps : 當props、state改變就會觸發，在初始化的時候也會觸發一次
3. componentWillMount
4. render : 必須實作的，回傳JSX
5. componentDidMount : DOM已經掛載完成 ，在這個階段可以呼叫api來更新DOM ，適合做一些初始化的工作

* updating
1. componentWillReceiveProps
2. static getDerivedStateFromProps : 當props、state改變就會觸發，在初始化的時候也會觸發一次
3. shouldComponentUpdate : 讓你自己判斷是否要更新，如果回傳false這邊就不在往下執行render， 所以這邊可以做一些效能的優化
4. componentWillUpdate
5. render
6. getSnapshotBeforeUpdate : 在更新DOM和Refs之前會觸發
7. componentDidUpdate : 當props or state更新 ，就會觸發組件更新DOM，所以千萬不要在這個階段setState，會造成無限循環

* unmount
1. componentWillUnmount : component從DOM被移除 ，在這階段可以用來清除一些計時器

### Effect

前面提到了React的Component Life Cycle，然而在Function Component是沒有Life Cycle相關的函數可以呼叫的。假設我希望在Component每一次的更新作一些額外操作，這時候Hook的useEffect就派上用場了。我們常常會拿他來當作Life Cycle的替代品，例如mount階段時取得這頁面的Default data、或是update時去修改一些網頁的資料等等。

一樣以Counter做為案例，如果我們希望網頁的Title可以隨著Counts的次數作動，首先先看Class Component的範例:

```javascript
class Counter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            counts: 0
        }
    }

    componentDidMount() {
        document.title = `You clicked ${this.state.counts} times`;
    }

    componentDidUpdate() {
        document.title = `You clicked ${this.state.counts} times`;
    }

    render(){
        return(
            <div>
                <div>Click Times : {counts}</div>
                <button onClick={() => this.setState({ counts: this.state.counts + 1})}>Plus One</button>
            </div>
        )
    }
}

export default Counter
```

接著看看useEffect的範例
```javascript
const Counter = (props) => {
    const [counts, setCounter] = useState(0)

    useEffect(() => {
        document.title = `You clicked ${count} times`;
    });

    return(
        <div>
            <div>Click Times : {counts}</div>
            <button onClick={() => setCount(counts+1)}>Plus One</button>
        </div>
    )
}

export default Counter
```

useEffect 有什麼作用？ 透過使用這個 Hook，你告訴 React 你的 component 需要在 render 後做一些事情。React 將記住你傳遞的 function（我們將其稱為「effect」），並在執行 DOM 更新之後呼叫它。 在這個 effect 中，我們設定了網頁的標題，但我們也可以執行資料提取或呼叫其他命令式 API。

為什麼在 component 內部呼叫 useEffect？ 在 component 中放置 useEffect 讓我們可以直接從 effect 中存取 count state 變數（或任何 props）。我們不需要特殊的 API 來讀取它 — 它已經在 function 範圍內了。 Hook 擁抱 JavaScript closure，並避免在 JavaScript 已經提供解決方案的情況下引入 React 特定的 API。

每次 render 後都會執行 useEffect 嗎？ 是的！預設情況下，它在第一個 render 和隨後每一個更新之後執行。（我們稍後會談到如何自定義。）你可能會發現把 effect 想成發生在「render 之後」更為容易，而不是考慮「mount」和「更新」。 React 保證 DOM 在執行 effect 時已被更新。

我們宣告 count state 變數，然後告訴 React 我們需要使用一個 effect。我們將一個 function 傳入給 useEffect Hook。我們傳入的這個 function 就是我們的 effect。在 effect 內部，我們使用瀏覽器 API document.title 設定了網頁標題。我們可以讀取 effect 中最新的 count，因為它在我們 function 的範圍內。當 React render 我們的 component 時，它會記住我們使用的 effect，然後在更新 DOM 後執行我們的 effect。每次 render 都是這樣，包括第一次。

有經驗的 JavaScript 開發人員可能會注意到，傳遞給 useEffect 的 function 在每次 render 時都會有所不同。這是刻意的。實際上，這是讓我們可以從 effect 內部讀取 count 數值，且不必擔心數值過時的原因。每次重新 render 時，我們都會安排一個 different effect 來替代上一個。在某種程度上，這使 effect 的行為更像是 render 結果的一部分 — 每個 effect 都「屬於」特定的 render。

### Trigger useEffect
在某些情況下，每次 render 後清除或執行 effect 可能會導致效能問題。在 class component 中，我們可以通過在 componentDidUpdate 內部的 prevProps 或 prevState 撰寫一個額外的比對條件來解決此問題：

```javascript
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

這個要求很常見，所以已內建在 useEffect 的 Hook API 中。如果在重新 render 之間某些值沒有改變，你可以讓 React 忽略 effect。為此，請將 array 作為可選的第二個參數傳遞給 useEffect：

```javascript
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 僅在計數更改時才重新執行 effect
```

在上面的範例中，我們將 [count] 作為第二個參數傳遞。這是什麼意思？如果 count 是 5，然後我們的 component 重新 render，count 仍然等於 5，React 將比對前一個 render 的 [5] 和下一個 render 的 [5]。因為 array 中的每一項都相同（5 === 5），所以 React 將忽略這個 effect。那就是我們的最佳化。

當我們 render 時將 count 更新為 6，React 將比對前一個 render 的 array [5] 與下一個 render 的 array [6]。這次，React 將重新執行 effect，因為 5 !== 6。如果 array 中有多個項目，即使其中一項不同，React 也會重新執行 effect。


所以，如果我希望表單今天可以在Load頁面時，預先準備好下拉式選單的內容，那該怎麼寫?

其實很簡單，第二個參數為空array時(不是省略歐)，代表除了第一次以外，接下來每次re-render時，沒有任何東西的改變可以重新觸發useEffect，所以就等同於componentDidMount，取得下拉式選單資料的API就可以在這邊呼叫。

```javascript
useEffect(() => {
    /* This is componentDidMount */
}, []); 
```

而其他的Hook，建議可以到[官網文件](https://react.dev/reference/react)去學習，不過最常用的就是useState和useEffect了，其他的不一定得要看得很仔細(甚至連useEffect都不一定需要學)。


## Homework : Table and Paging Component

製作一個簡易的表單查詢，功能如下:

1. 有雙重的下拉式選單，第二個下拉式選單的內容要依據第一個動態生成
2. 第一個下拉式選單的資料透過useEffect取得
3. 查詢結果隨便秀沒關係，重點是Paging和下拉式選單
4. 下拉式選單的假資料請用以下`getL1Options`、`getL2Options`兩個function作為代替
5. 要結合之前的Paging Component，換頁時要重新呼叫一次，並console.log出查詢條件如範例(格式自己定義沒關係，但要足以讓後端做分頁):

```json
{
    "page": 0,
    "MaxRow": 10,
    "SearchCondition1": "",
    "SearchCondition2": "",
    "SearchCondition3": "",
    ......
}
```

```javascript
const getL1Options = () => {
    return new Promise((resolve, reject) => {
        resolve({
            "data":[
                {
                    "label": "dep1",
                    "value": 123
                },
                {
                    "label": "dep2",
                    "value": 124
                },
                {
                    "label": "dep3",
                    "value": 125
                },
                {
                    "label": "dep4",
                    "value": 126
                }
            ]
        })
    })
}

const getL2Options = () => {
    return new Promise((resolve, reject) => {
        resolve({
            "data": [
                {
                    "depID": 123,
                    "label": "A",
                    "value": 3
                },
                {
                    "depID": 123,
                    "label": "B",
                    "value": 4
                },
                {
                    "depID": 123,
                    "label": "C",
                    "value": 5
                },
                {
                    "depID": 124,
                    "label": "D",
                    "value": 6
                },
                {
                    "depID": 123,
                    "label": "E",
                    "value": 7
                },
                {
                    "depID": 125,
                    "label": "F",
                    "value": 8
                },
                {
                    "depID": 125,
                    "label": "G",
                    "value": 9
                },
                {
                    "depID": 125,
                    "label": "H",
                    "value": 10
                },
            ]
        })
    })
}
```