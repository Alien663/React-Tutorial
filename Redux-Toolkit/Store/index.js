import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import Sample from "./Sample";

const rootReducer = () =>({
    Sample,
})

const store = configureStore({
    reducer: rootReducer(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export default store