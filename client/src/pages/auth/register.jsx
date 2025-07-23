import CommonForm from "@/components/common/form";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { registerFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { toast } from "sonner";
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
    event.preventDefault();
    
    // Check if all required fields are filled
    if (!formData.username ) {
      toast.error('Please fill in Username field');
      return;
    }
    if (!formData.email) {
      toast.error('Please fill in Email field');
      return;
    }
    if ( !formData.password) {
      toast.error('Please fill in Password field');
      return;
    }
    
    dispatch(registerUser(formData)).then((data)=>{
      console.log('Registration response:', data);
      if (data?.payload?.success) {
        toast.success('Registration successful!');
        navigate('/auth/login', { state: { email: formData.email } });
      } else {
        toast.error(data?.payload?.message || 'Registration failed');
      }
    }).catch((error) => {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
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
