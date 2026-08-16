import RegisterForm from "../components/RegisterForm";

export default function Register() {

  return (
    <div className="flex justify-center items-center w-full min-h-screen p-4 gradient-bg1">
      <div className="card w-full max-w-xl">
        <h1>Create a new account</h1>
        <hr />
        <RegisterForm />
      </div>
    </div>
  );
}