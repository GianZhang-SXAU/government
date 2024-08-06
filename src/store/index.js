// 作者: 张建安
// 代码用途: 该代码用于管理用户登录信息，通过 Redux Toolkit 的状态管理，将用户信息存储在 Redux store 中，便于在整个应用中访问和管理。

import { createSlice, configureStore } from '@reduxjs/toolkit';

// 创建一个用于管理用户登录信息的 slice
const userSlice = createSlice({
    name: 'user', // slice 的名称
    initialState: { data: null, type: null }, // 初始状态，包含用户数据和用户类型（可能是普通用户或管理员）
    reducers: {
        // 设置用户信息的 reducer，接收 action 以更新 state 中的数据
        setUser: (state, action) => {
            state.data = action.payload.data; // 更新用户数据
            state.type = action.payload.type; // 更新用户类型
        },
        // 清除用户信息的 reducer，将 state 重置为初始状态
        clearUser: (state) => {
            state.data = null; // 清空用户数据
            state.type = null; // 清空用户类型
        },
    },
});

// 导出生成的 action，用于在组件中调用这些 actions 来更新 state
export const { setUser, clearUser } = userSlice.actions;

// 配置 Redux store，并将 userSlice 的 reducer 添加到 store 中
const store = configureStore({
    reducer: {
        user: userSlice.reducer, // 将 userSlice 的 reducer 添加到 store
    },
});

// 导出 store 以便在应用中使用
export default store;
