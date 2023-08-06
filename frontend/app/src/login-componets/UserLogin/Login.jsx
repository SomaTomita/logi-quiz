import "./Login.css";
import { useForm } from "react-hook-form";

function Login() {
  const {register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-container">
      <h1>Login Form</h1>
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

export default Login;
