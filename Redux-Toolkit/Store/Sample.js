import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getSamples from '../Lib/fakeAPI'

const initialSampleState = {
    Counts: 0
}

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

export const { increment } = SampleSlice.actions
export default SampleSlice.reducer