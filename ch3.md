# Virtual DOM

前面的章節中，我們已經有幾次提過Virtual DOM。我們提到，變數需要Bind到Virtual DOM，頁面才會隨著變數一起更新，本章節將深入討論Virtual DOM的概念，從最基本的地方開始了解，React是如何渲染畫面的。

## What is DOM

在開始了解Virtual DOM之前，首先要了解我們一直講的DOM是甚麼東西。

DOM全名為Document Object Model，其作用是將原本的HTML文件中所有的標籤、文字和圖片等等都定義成物件，並形成一個數狀結構。這個架構是由W3C所定義出來，讓所有瀏覽器去遵從這個規則來顯示網頁。

既然是樹狀架構，就會有node。

在DOM中，每個element和文字，都是一個又一個的節點，主要分成以下四種:

1. Docment
2. Element
3. Text
4. Attribute

如果以下面範例來看，DOM Tree會畫成這樣
```html
<html>
  <head>
    <title>example</title>
  </head>
  <body>
    <h1 class="txt">Hello World</h1>
  </body>
</html>
```

```
• Document
│
└── html (Element) 
    │
    ├── head (Element)
    │   │   
    │   └── title (Element)
    │       │   
    │       └── example (Text)
    │   
    └── body (Element)
        │   
        └── h1 (Element)
            │
            ├── class (Attribute) 
            │   
            └── Hello World (Text)
```

DOM Tree至此就結束了，但要看到瀏覽器的結果，卻還有一段路要走，還需要結合CSS檔案的CSSOM Tree，產生出Render Tree，Reflow、Repaint結束才會是瀏覽器所呈現出的畫面。

至於要深究為何React的效率好，那建議可以看看下面的參考資料，先去了解Reflow、Repain對效能等的影響，你會發現Virtual DOM的概念在其中。
[03. [CSS] Reflow 及 Repaint 是什麼？](https://ithelp.ithome.com.tw/articles/10217427)

## How Virtual DOM Work

[[Day 04] 理解React Virtual DOM](https://ithelp.ithome.com.tw/articles/10234155)

1. 初次使用setState()方法的時候，React會先複製一份dom的物件(即為Virtual DOM)
2. 當React component的state改變時，會比對先前的Virtual DOM和當前的 Virtual DOM差異，稱之為diff運算
3. Virtual DOM先用自己的演算法(diff)算出實際需要更新的部分，比對兩者差異之後，再去更動真實的DOM，有效減少渲染的次數 ，提高效能

以往如果是手動操作，每操作一次就會更新一次dom，如果是透過react setState就會是將多個操作合併為一次的操作，避免頻繁更新頁面，因此開發者只要專注在資料邏輯上，畫面的更新機制全部交給React處理即可。

```javascript
let VirtualDOM = DOM
const patch = Diff(DOM, VirtualDOM)
$Root = patch($Root)
```

## Homework : Try to hand make a virtual DOM with native javascript

試著去思考，如果自己做一個假的Virtual DOM概念，要怎樣做?
此作業不一定要寫，下一個教學會有解答