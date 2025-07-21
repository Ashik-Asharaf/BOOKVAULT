import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./auth-slice"; // ✅ match the import name to usage

const store = configureStore({
  reducer: {
    auth: authreducer,
  },
});

export default store;
