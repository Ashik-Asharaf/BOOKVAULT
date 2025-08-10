import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";


const initialState = {
    isLoading : false,
    productList : [],
   
}

export const addNewProduct = createAsyncThunk('/products/addnewproduct',
    async (formData)=>{
            const response = await axios.post('http://localhost:5000/api/admin/add-products/add',formData,{
               headers : {
                    'Content-Type' : 'application/json'
               }
            })
            return result?.data;
        }
    );

export const fetchAllProducts = createAsyncThunk('/products/fetchAllProducts',
            async (formData)=>{
                    const response = await axios.get('http://localhost:5000/api/admin/add-products/get',
                )}
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