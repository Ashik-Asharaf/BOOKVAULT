const { configureStore } = require("@reduxjs/toolkit");
import autreducer from './auth-slice';



const store = configureStore({
    reducer: {
        auth: authreducer,
    }
});

export default store;