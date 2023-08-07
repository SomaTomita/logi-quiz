import "./Login.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function SignIn() {
  const {register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();
  const goToNewAccount = () => {
    navigate('/signupfor');
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3001/signin', data)
      if(response.data.status === 'SUCCESS') {
        navigate('/sections');
      } else {
        console.error('Login failed.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h1>Sign in Form</h1>
        <label htmlFor="email">
          email:
          <input id="email" type="email" {...register("email", { required: "E-mailアドレスは必須です。" })}/>
          <p>{ errors.email?.message }</p>
        </label>
        <label htmlFor="password">
          password:
          <input id="password" type="password" {...register("password", { required: "パスワードは必須です。" })}/>
          <p>{ errors.password?.message }</p>
        </label>

        <button type="submit">Submit</button>
        <button onClick={goToNewAccount}>Create New Account</button>
      </form>
    </div>
  );
}

export default SignIn;