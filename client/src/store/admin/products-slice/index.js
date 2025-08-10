import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    isLoading : false,
    productList : [],
   
}

const API_BASE_URL = 'http://localhost:5000/api/admin/products';

export const addNewProduct = createAsyncThunk('products/addNewProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_BASE_URL + '/add', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Add Product Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

export const fetchAllProducts = createAsyncThunk('products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL + '/get', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Fetch Products Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const editProduct = createAsyncThunk(
    '/products/editProduct',
                    async (id,formData)=>{
                            const response = await axios.put(`http://localhost:5000/api/admin/add-products/edit/${id}`,
                                formData,{
                               headers : {
                                    'Content-Type' : 'application/json'
                               }
                            })
                            return result?.data;
                        }
                    );
export const deleteProduct = createAsyncThunk('/products/deleteProduct',
            async (id)=>{
            const response = await axios.delete(`http://localhost:5000/api/admin/add-products/delete/${id}`         
            )}
            );

const AdminProductsSlice = createSlice({
    name : 'adminProductsSlice',
    initialState ,
    reducers : {},
    extraReducers : (builder)=>{
        builder.addCase(fetchAllProducts.pending,(state)=>{
            state.isLoading = true;
        }).addCase(fetchAllProducts.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.productList = action.payload.data;
        }).addCase(fetchAllProducts.rejected,(state,action)=>{
            state.isLoading = false;
            state.productList = [];
        })
    }
})
    

export default AdminProductsSlice.reducer