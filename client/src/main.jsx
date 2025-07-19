import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './index.css'; // or './main.css' depending on your setup
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Provider store={store}>
    <App />
    </Provider>
    </BrowserRouter>,
    
);
