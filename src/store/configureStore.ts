import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk, { ThunkMiddleware } from "redux-thunk";
import { expenseReducer } from "../reducers/expenses";
import { AppActions } from "../types/actions";

export const rootReducer = combineReducers({
  expenses: expenseReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>)
  )
);
