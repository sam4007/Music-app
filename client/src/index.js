import React from 'react'
import { createRoot } from 'react-dom/client'
import { createStore, applyMiddleware, compose} from 'redux'
import { Provider } from 'react-redux'
import { thunk } from 'redux-thunk'
import App from './App'
import reducers from './reducers'
import { BrowserRouter } from 'react-router-dom'
import "./index.css";
import { ThemeProvider } from './ThemeContext'
const root = createRoot(document.getElementById('root'));
const store = createStore(reducers, compose(applyMiddleware(thunk)))

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <Provider store = {store}>
                    <App />
                </Provider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);