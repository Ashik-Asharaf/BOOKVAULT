import CommonForm from "@/components/common/form";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { registerFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
//import { useNavigate } from "react-router-dom";

const initialState = {
    username: '',
    email: '',  
    password: ''
}

function AuthRegister() {

    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  function onSubmit(event){
    console.log('Form submitted!', event);
    event.preventDefault();
    console.log('Form data being sent:', formData);
    
    // Check if all required fields are filled
    if (!formData.username || !formData.email || !formData.password) {
      console.error('Missing required fields:', formData);
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Dispatching registerUser...');
    dispatch(registerUser(formData)).then((data)=>{
      console.log('Registration response:', data);
      if (data?.payload?.success) {
        console.log('Registration successful, navigating to login');
        navigate('/auth/login');
      } else {
        console.error('Registration failed:', data?.payload?.message);
        alert(data?.payload?.message || 'Registration failed');
      }
    }).catch((error) => {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    });
  }

  console.log(formData);

  return <div className="mx-auto w-full max-w-md space-y-6">
    <div className="text-center">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new account</h1>
      <p className="mt-2">Already have an account
        <Link className="font-medium ml-2 text-primary hover:underline" to='/auth/login'>  Login</Link>
      </p>
    </div>
    <CommonForm
    formControls={registerFormControls}
    buttonText={'Sign Up'}
    formData={formData }
    setFormData={setFormData}
    onSubmit={onSubmit}
    />
  </div>;
}

export default AuthRegister;
