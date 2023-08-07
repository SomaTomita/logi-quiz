import "./Login.css";
import { useForm } from "react-hook-form";
import axios from 'axios';

function SignUpFor() {
  const {register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });

  const onSubmit = data => {
    axios.post('http://localhost:3001/users', data)
      .then(response => {
        console.log(response);
      }).catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h1>Register New Account</h1>
        <label htmlFor="name">
          name:
          <input id="name" type="text" {...register("name", { required: "名前は必須です。" })} />
          <p>{ errors.name?.message }</p>
        </label>
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
      </form>
    </div>
  );
}

export default SignUpFor;
