import type { Metadata } from 'next';
import LoginForm from "../components/LoginForm";

export const metadata: Metadata = {
  title: 'Login'
}

export default function Login() {
  return (
    <div className="flex justify-center items-center w-full min-h-screen p-4 gradient-bg1">
      <div className="card w-full max-w-xl">
        <h1>Sign in</h1>
        <hr />
        <LoginForm />
      </div>
    </div>
  );
}