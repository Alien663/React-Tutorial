# Let's make a virtual DOM with basic javascript

### Step 1 : 建立環境
首先，我們先建立一個簡單的index.html，和一個main.js，以及之後會用到的資料夾 : VDOM
```html
<html>
  <head>
    <title>hello world</title>
  </head>
  <body>
    <div id="app">Hello World</div>
    <script src="src/main.js"></script>
  </body>
</html>
```

```javascript
let cat100 = `https://http.cat/100`
console.log("Hello World")
```

### Step 2 : CreateElement

接下來，Vritual DOM說到底只是一個特定的資料結構，為了要模仿前一章節所提到的DOM結構，我們開始解析index.html中，id為app的element (將作為Vritual DOM的Root)，並設計出一個node以畫出樹狀圖。

```javascript
const vApp = {
    TageName : "div",
    attrs: {
        id: "app"
    },
    children : ["Hellow World"]
}
```

不過這樣的行為可以想像得到，之後會有很多Element需要透過這種方式建立，因此我們可以把資料定義的部分拉出來成為另一個Function : `VDOM/createElement.js`
```javascript
const vApp = createElement("div", {
    attrs: {id:"app",},
    children: []
})
```

### Step 3 : Render Virtual DOM to Actual DOM (但沒有真的去替代喔)

接下來試試看把vApp變成實際的DOM，為此我們會需要另一個Function : render，來協助我們這件事，但在開始寫程式碼之前，可以先定義我們想要的形式在main.js中 :

```javascript
const vApp = createElement("div", {
    attrs: {id:"app",},
    children: []
})

const $app = render(vApp)
console.log($app)
```

* 建立`VDOM/render.js`
```javascript
const render = (vNode) => {
    const $el = document.createElement(vNode.TagName)
    for(const [k, v] of Object.entries(vNode.attrs)){
        $el.setAttribute(k, v)
    }
    for(const child of vNode.children){
        const $child = render(child)
        $el.appendChild($child)
    }
    return $el
}
export default render
```

來幫vApp加入一點東西進去，試試看render的程式碼有沒有Work
```javascript
const vApp = createElement("div", {
    attrs: {id:"app",},
    children: [
        createElement("img", {
            attrs: {
                src: "https://http.cat/100"
            }, 
            children: []
        })
    ]
})
```



### Step 4 : Mount vApp to Real DOM

一樣，我們先定義想要的方式
```javascript
const $app = render(vApp)
mount($app, document.getElementById("app"))
```

接著再來定義mount裡面實際要怎樣實現
```javascript
const mount = ($node, $target) => {
    $target.replaceWith($node)
    return $node
}
export default mount
```

這樣，我們的Virtual DOM就成功的render到DOM Tree囉~~


### Step 5 : Mount Data to DOM

目前的設計還有點問題，假設我要直接顯示資料呢?
你會發現程式會直接報錯誤給你
```javascript
const vApp = createElement("div", {
    attrs: {id:"app",},
    children: [
        String(0), // 因為目前的程式碼只有處理Element，但是沒有處理純資料的狀況
        createElement("img", {
            attrs: {
                src: "https://http.cat/100"
            }, 
            children: []
        })
    ]
})
```

所以，我們會需要在render function做一點調整，先判斷vNode是不是Element，才去render。
但是直接調整render有點浪費之前寫好的，所以我們改個名，在另外定義一個render做判斷。

* render.js
```javascript
const renderElement = ({ TagName, attrs, children }) => {
    const $el = document.createElement(TagName)
    for(const [k, v] of Object.entries(attrs)){
        $el.setAttribute(k, v)
    }
    for(const child of children){
        const $child = render(child)
        $el.appendChild($child)
    }
    return $el
}

const render = (vNode) => {
    if(typeof(vNode) === "string"){
        return document.createTextNode(vNode)
    }
    return renderElement(vNode)
}
```


這樣就差不多了，但希望可以驗證一下，render的東西跑得怎麼樣，我們為他加一個Counter，每秒遞增1。
為此，需要把原本寫死的東西設定成變數，提升一層讓他設定更活一點。

* main.js
```javascript
const createVApp = (count) =>  createElement("div", {
    attrs: {id:"app",},
    children: [
        String(count),
        createElement("img", {
            attrs: {
                src: "https://http.cat/100"
            }, 
            children: []
        })
    ]
})

let ccc = 0
const vApp = createVApp(ccc)
const $app = render(vApp)
let $rootElement = mount($app, document.getElementById("app"))
setInterval( () => {
    $rootElement = mount(render(createVApp(++ccc)), $rootElement)
}, 1000)
```

到此，我們順利完成了Virtual DOM資料修改到DOM結構的所有步驟。
但是你會發現一件厲害的事情，我們來為剛剛完成的頁面加上一個input，假設是要輸入EMail之類的。

* main.js
```javascript
const createVApp = (count) =>  createElement("div", {
    attrs: {id:"app",},
    children: [
        createElement("input", {
            attrs: {}, 
            children: []
        }),
        String(count),
        createElement("img", {
            attrs: {
                src: "https://http.cat/100"
            }, 
            children: []
        })
    ]
})
```

由於每秒都會用預設資料更新，所以你輸入EMail到送出的時間只有1秒鐘。
這顯然不合理，既然我只有Count有修改，那為什麼不要只修改Count就好，其他的不要動呢?

不要急，這是下一個步驟的事情

### Step 6 : DIFF

秉持之前的寫法，我們一樣先把main.js捏成我們想要的形狀。

我們希望diff算完Virtual DOM和DOM的差異之後，再去根據差異的部分去重新渲染就好，其他的地方不要動到。
因此，一定會需要Recursive去遍歷整顆樹，然後去比對每個位置的Node是否相同，決定是否要更新。

依據這樣的想法，讓diff回傳一棵樹，每一個node都是function，已經透過diff算完是否需要更新node自己，然後我們只要把DOM tree丟進去，每一個node會自動mapping，然後node自己更新自己。

* main.js
```javascript
let ccc = 0
let vApp = createVApp(ccc)
const $app = render(vApp)
let $rootElement = mount($app, document.getElementById("app"))
setInterval(() => {
    const vNewApp = createVApp(++ccc)
    const patch = diff(vApp, vNewApp)
    $rootElement = patch($rootElement)
    vApp = vNewApp
}, 1000)
console.log($rootElement)
```

Diff的設計架構，需要考慮幾個問題
1. 該位置有舊node，但是沒有新node
2. node非element，是純文字
3. node不同
4. node相同

* Diff.js
```javascript
const diff = (vOldNode, vNewNode) => { 
    if(vNewNode === undefined){
        
    }

    if(typeof(vOldNode) === "string" || typeof(vNewNode) === "string"){

    }

    if(vOldNode.TagName !== vNewNode.TagName){
        
    }

    const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs)
    const patchChildren = diffChildren(vOldNode.children, vNewNode.children)

    return $node => {}
}
```

接下來，要思考一下Diff回傳的funciton要長怎樣
```javascript
const diff = (vOldNode, vNewNode) => { 
    if(vNewNode === undefined){
        return $node => {
            $node.remove()
            return undefined // 新的Node該位置沒有東西，刪除後不做事情
        }
    }

    if(typeof(vOldNode) === "string" || typeof(vNewNode) === "string"){
        if(vOldNode === vNewNode){
            return $node => undefined // 兩個Text一樣，該node沒有要做事情
        }
        else{
            $node => {
                const $newNode = render(vNewNode) // 兩個Text不一樣，拿新Virtual DOM的結構去要實際DOM結構
                $node.replaceWith($newNode)
                return $newNode 
            }
        }
    }

    if(vOldNode.TagName !== vNewNode.TagName){
        return $node => {
            const $newNode = render(vNewNode) // 兩個Tag Name不一樣，拿新Virtual DOM的結構去要實際DOM結構
            $node.replaceWith($newNode)
            return $newNode
        }
    }

    const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs) // 寫起來比較複雜，拿function先卡位
    const patchChildren = diffChildren(vOldNode.children, vNewNode.children) // 寫起來比較複雜，拿function先卡位

    return $node => {
        patchAttrs($node) // 把Node丟進去Attr的Patch Function去計算出結果
        patchChildren($node) // 把Node丟進去Child的Patch Function去計算出結果
        return $node
    }
}
```

到這邊DIFF就已經寫完囉~~


### Step 7 : diffAttrs

接下來，一步步完成剛剛設計的Patch Attr相關程式。

一個Node的Attributes會是以Object的形式存在，根據以上我們完成的程式碼，我們知道目前需要調整的狀況是新舊Node都存在，但是Attribute要更新。由於Attributs更新不影響整個element的重新渲染，我們這邊簡單一點直接改就好。

```javascript
const diffAttrs = (vOldAttrs, vNewAttrs) => {
    const patches = []

    // set new attributs
    for(const [k, v] of Object.entries(vNewAttrs)){
        patches.push($node => {
            $node.setAttribute(k, v)
            return $node
        })
    }

    // remove old attributes
    for(const k in vOldAttrs){
        if(!(k in vNewAttrs)){
            patches.push($node => {
                $node.removeAttribute(k)
                return $node
            })
        }
    }

    // loop excute every patch
    return $node => {
        for(const patch of patches){
            patch($node)
        }
    }
}
```


### Step 8 : diffChildren

終於來到最後一個步驟，我們要做出Recursive整棵樹的diffChildren。

作法很簡單，由於每個Child實際上都是Virtual Node，所以善用我們前面宣告過的diff就可以了

```javascript
const diffChildren = (vOldChildren, vNewChildren) => {
    const patches = []

    for(const [oldChild, newChild] of zip(vOldChildren, vNewChildren)){
        childPatches.push(diff(oldChild, newChild))
    }

    return $parents => {
        for(const [patch, child] of zip(patches, $parents.childNodes)){
            patch(child)
        }
        return $parents
    }
}
```

但是實際上執行會出錯，因為舊的Node如果不存在，而新的Node被新增，其實會導致舊的Node無法被移除( undefined無法使用 $node.remove() )，因此要修改一下diffChildren的邏輯，改成:

1. 拿舊的Children跟新的Children做比較，跑diff
2. 如果新的Children比較多，則另外跑一個additoinal的patch

```javascript
const diffChildren = (vOldChildren, vNewChildren) => {
    const patches = []
    vOldChildren.forEach((child, i) => {
        patches.push(
            diff(child, vNewChildren[i])
        )
    })

    const additionalPatches = []
    for(const additionalChild of vNewChildren.slice(vOldChildren.length)){
        additionalPatches.push(
            $node => {
                $node.appendChild(
                    render(additionalChild)
                )
                return $node
            }
        )
    }

    return $parents => {
        for(const [patch, child] of zip(patches, $parents.childNodes)){
            patch(child)
        }
        for(const patch of additionalPatches){
            patch($parents)
        }
        return $parents
    }
}
```

### Step 9 : Test

修改一下vApp的內容，讓他可以自動增長一些element進去，測試看看我們的整個Virtual DOM有沒有寫成功。
```javascript
const createVApp = (count) => createElement("div", {
    attrs: {id:"app", datacount:count},
    children: [
        createElement("input"),
        String(count),
        ...Array.from({length: count}, () => 
            createElement("img", {
                attrs: {src: "https://http.cat/100"}, 
            })
        ),
    ]
})
```

## References

### Building a Simple Virtual DOM from Scratch - Jason Yu

[Youtube](https://www.youtube.com/watch?v=85gJMUEcnkc)

[Blog](https://dev.to/ycmjason/building-a-simple-virtual-dom-from-scratch-3d05)

[Github](https://github.com/ycmjason-talks/2018-11-21-manc-web-meetup-4)

## Homework : None

可以開始自己去實作一些簡單的Component，去使用一些UI套件等等，看看怎樣呼叫，去複製範例程式碼修改......