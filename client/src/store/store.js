import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./auth-slice"; // ✅ match the import name to usage
import adminProductsSlice from "./admin/products-slice";

const store = configureStore({
  reducer: {
    auth: authreducer,
    adminProducts : adminProductsSlice,
  },
});

export default store;
