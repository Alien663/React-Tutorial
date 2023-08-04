# Redux

## Why needs redux?

當今天我們只將目光聚焦在一個專案時，那麼1~5章節的東西已經夠你使用了，要開發一個完整的專案不會有任何問題。

然而站在更高一層去思考，我要如何讓這次專案的開發加速下次開發呢?

當所有的Component之間資料交流都是透過Props做單向的交流，你會發現Component會變得越來越客製化，遇到一個頁面就直接寫一個Component，哪裡功能需要就直接複製程式碼改一下，每一個UI永遠都在為了特殊設計做調整。這就違反了React一開始設計的初衷了。

React設計初衷有一個很重要的概念就是`reuse`，透過累積常用的Compnent，讓未來開發越來越輕松，變成拉一拉Component就可以完成大半。然而今天Component寫出來，但是沒有辦法直接使用在別的地方，那這Component就是一個糟糕的Component，因為無助於加速其他專案開發。所以為了要達到Component reuse的目的，我們需要抽離Props，讓Component之間不用每次都要把資料往上回拋到Root，再一路傳下來，減少中間Component需要傳遞Props的需求，以達到[Pure Function](https://medium.com/frochu/%E7%B4%94%E7%B2%B9%E7%9A%84%E5%A5%BD-pure-function-%E7%9F%A5%E9%81%93-574d5c0d7819)的結果。

而要抽離Props，Redux就是一個使用在React的主流。

可以這樣思考:

假設一個家族有個價值千金的傳家寶，透過家族族長代代相傳。

有一天，家族發生劇變，需要變賣傳家寶換取金錢，卻發現早在好幾代以前就因為族長交接問題，導致沒有人知道傳家寶在哪裡。

這聽起來很蠢對吧?但是身為工程師永遠不要相信自己的記憶力，當Component Tree長得越來越複雜，哪天忘記傳遞Props會是很正常的事情。

最好的解法，當然是把傳家寶直接存在瑞士銀行的保險箱裡面，然後把密碼寫在一本記事本，哪天真的需要變賣傳家寶，在拿密碼去保險箱裡面拿出來就好。

把以上概念替換一下，傳家寶就是我們的data，族長就是Component，瑞士銀行就是Store，保險箱是Reducer。
Redux的概念，就是建立一個名為store的data center，讓你可以把data存放在reducer當中。
而Store可以直接跟任何一代的Component互動，既使今天data是從root Component要傳到第10代Component，也是透過`root --> sotre --> L10 Component`的路徑傳遞。

試想，如果不透過Redux，root的資料要如何傳遞到L10的Component?更別提今天可能是另一個L4Component藥用，L10需要從L9、L8...一路傳到root，然後在傳到L4下去。如果只是一兩個參數到還好，但隨著客製化越來越多，類似需求只會越來越多。不只如此，當你今天是多人合作開發，彼此動到的檔案越多，到時合併分支時會發瘋的。

[Why use Redux? (Official Website)](https://cn.redux.js.org/tutorials/essentials/part-1-overview-concepts/#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E4%BD%BF%E7%94%A8-redux)

## How to use Redux?

此份教學將圍繞Redux-toolkit展開，相較於redux-saga的舊方法，redux-toolkit使用起來簡易非常多，學起來難度降低不少。

關於Redux如何和Component之間的交流，可以看官網的GIF:

![how redux work](https://d33wubrfki0l68.cloudfront.net/01cc198232551a7e180f4e9e327b5ab22d9d14e7/b33f4/assets/images/reduxdataflowdiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)

如果再加上Call API的行為，其實也沒有很複雜，只是在Store那邊多了一小段
![Redux Call API Flow](https://cn.redux.js.org/assets/images/ReduxAsyncDataFlowDiagram-d97ff38a0f4da0f327163170ccc13e80.gif)

### Step 1 : Create Default Settings

首先，在專案中新增Store資料夾，並在裡面新增index.js
```javascript
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

const rootReducer = () =>({
})

const store = configureStore({
    reducer: rootReducer(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export default store
```

Store/index.js的目的在於，將所有Reducer集中管理(可以按照前面的舉例來思考，Store是銀行，Reducer是保險箱)，並建立Middleware，我們在這邊會使用一個logger，讓Console自動顯示Reducer的State變化(對於新手來說，這十分重要且方便)。

接著，打開index.js，引用Store。如果一個專案想要新增多個Store，可以直接用多層的Provider去包就可以了。
```javascript
import { Provider } from 'react-redux'
import store from './Store/index'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
```

### Step 2 : Add A New Reducer

接下來是Component之間要透過Store做資料交換的demo，要先建立資料的initialState(定義好格式)。

* Store/Sample.js
```javascript
import { createSlice } from "@reduxjs/toolkit";

const initialSampleState = {
    Counts: 0
}

const SampleSlice = createSlice({
    name: "Sample",
    initialState: initialSampleState,
    reducers: {
        increment: (state, action) => {
            state.Counts = action.payload
        }
    }
})

export const SampleActions = SampleSlice.actions
export default SampleSlice.reducer
```

* Store/index.js
```javascript
import Sample from "./Sample";

const rootReducer = () =>({
    Sample,
})
```

### Step 3 : Call Reducer

接著是Component要怎樣從Store取得資料

* Component/Sample.jsx
```javascript
import { useDispatch, useSelector } from "react-redux"
import { SampleThunk, increment } from '../Store/Sample'
import React, { useState } from "react"

const SampleComponent = () => {
    const dispatch = useDispatch()
    const Counts = useSelector((state) => state.Sample.Counts)

    return (
        <div>
            <div>Click {Counts} times</div>
            <button onClick={() => dispatch(increment(Counts+1))}>Sample Button</button>
        </div>
    )
}

export default SampleComponent
```

### Step 4 : Create Call API

第二個範例，透過Reducer控管Call API行為以及資料傳輸，這邊需要使用另一個概念 : Thunk，可以大致想為他是用來取代過去的Saga。

這個範例使用的是Redux官方提供的createAsyncThunk，當然也可以自己造一個，只是使用官方提供的會更方便而已。

需要注意的是，Thunk相關的State需要放在extraReducers中，並且createAsyncThunk自帶三種狀態需要定義裡面的行為 :
1. pending : 送出thunk之前，可以用來組Request Data
2. fulfilled : thunk成功，將資料傳回State
3. rejected : thunk失敗，可以用來做失敗提示

* FakeAPI.js
```javascript
const getSamples = (req) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({"body":[
                {
                    "TID": req.page * 6 + 1,
                    "TName": "Xenomorph",
                    "TDes": "I first show on plant:LV-426"
                },
                {
                    "TID": req.page * 6 + 2,
                    "TName": "Face hugger",
                    "TDes": "I will hold you up"
                },
                {
                    "TID": req.page * 6 + 3,
                    "TName": "Ormorph",
                    "TDes": "I'm just an egg"
                },
                {
                    "TID": req.page * 6 + 4,
                    "TName": "Drone",
                    "TDes": "I'm so poor"
                },
                {
                    "TID": req.page * 6 + 5,
                    "TName": "Queen",
                    "TDes": "I'm the king of the world"
                }]
            })
        }, 1000)
    })
}

export default getSamples
```

* Store/Sample.js
```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getSamples from '../Lib/fakeAPI'

export const SampleThunk = createAsyncThunk('SetSample', async (req)=> {
    const res = await getSamples(req)
    return res.body
})

const SampleSlice = createSlice({
    name: "Sample",
    initialState: initialSampleState,
    reducers: {
        increment: (state, action) => {
            state.Counts = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(SampleThunk.pending, (state, action) => {
                state.req = action.payload
            })
            .addCase(SampleThunk.fulfilled, (state, action) => {
                state.data = action.payload
            })
            .addCase(SampleThunk.rejected, (state, action) => {
                window.alert("Call API Fail")
            })
    }
})
```
Component中直接使用thunk即可，用法跟取一般的State並無差異，所以對於Component來說使用非常簡單。

* Component/Sample.js
```javascript
import { SampleThunk, increment } from '../Store/Sample'

const SampleComponent = () => {
    const dispatch = useDispatch()
    const data = useSelector((state) => state.Sample.data);
    const Counts = useSelector((state) => state.Sample.Counts)

    function clickButton (){
        dispatch(SampleThunk({page: Counts}))
        dispatch(increment(Counts+1))
    }

    return (
      <div>
        <div>Click {Counts} times</div>
          <button onClick={() => clickButton()}>Sample Button</button>
          <div>
          {
            data?
              <div>
                <table>
                  <thead>
                  <tr>
                    <td>TID</td>
                    <td>TName</td>
                    <td>TDes</td>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    data.map(item => {
                      return(
                        <tr key={item["TID"]}>
                          <td>{item["TID"]}</td>
                          <td>{item["TName"]}</td>
                          <td>{item["TDes"]}</td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </table>
              </div> : <div>no data yet</div>
          }
        </div>
      </div>
    )
}

export default SampleComponent
```


## Homework : Call API with Redux

將Ch2的作業，變成使用Call API來完成，使用fake API如下

```javascript
const req = {
  Page : 1,
  MaxRows : 20,
}
const fakeAPI = (req) => {
  let temp_data = []
  if(Math.ceil(100/req.MaxRows) >= req.Page){
    for(let i=0;i<req.MaxRows;i++){
      temp_data.push(i)
    }
  }

  return new Promise((resolve, reject) => {
    resolve({
      "Counts": 100,
      "data": temp_data
    })
  })
}

```