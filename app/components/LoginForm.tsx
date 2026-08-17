"use client";
import { SubmitEvent, useState } from "react";

export default function LoginForm() {
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInvalidCredentials(false);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();
      if (!response.ok) {
        if (json.error?.name === "ValidationError") {
          json.error.issues.forEach((issue: any) => {
            const input = form.elements.namedItem(issue.path[0]) as HTMLInputElement;
            if (input) {
              input.setCustomValidity(issue.message);
              input.reportValidity();
            }
          });
        } else {
          setInvalidCredentials(true);
        }
      } else {
        window.location.href = '/profile';
      }
    } catch (error) {
      console.log('Error during login:', error);
    }
  };

  return (
    <form className="grid grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
      <div className="input-field col-span-1 max-sm:col-span-2">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          data-api-error="EMAIL_INVALID"
          required
        />
        <span className="input-error">Please enter a valid email address</span>
      </div>
      <div className="input-field col-span-1 max-sm:col-span-2">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
        />
        <span className="input-error">Please enter your password</span>
      </div>
      <button className="col-span-2 mt-4">Log in</button>
      {invalidCredentials && <span className="col-span-2 text-center text-sm text-red-500 mt-1">Invalid email or password</span>}

      <a className="col-span-2 mt-4 text-center" href="/register">Don't have an account? Register here</a>
    </form>
  );
}