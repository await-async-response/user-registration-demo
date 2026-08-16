"use client";

export default function RegisterForm() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    validatePasswords(form);

    try {
      const response = await fetch('/api/auth/register', {
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
        }
      }
      
    } catch (error) {
      console.log('Error during registration:', error);
    }
  };

  const validatePasswords = (form: HTMLFormElement) => {
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const confirmPassword = form.elements.namedItem(
      "confirmPassword"
    ) as HTMLInputElement;

    confirmPassword.setCustomValidity(
      password.value === confirmPassword.value
        ? ""
        : "Passwords do not match"
    );
  };

  return (
    <form className="grid grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
      <div className="input-field col-span-1 max-sm:col-span-2">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
        />
      </div>
      <div className="input-field col-span-1 max-sm:col-span-2">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
        />
      </div>
      <div className="input-field col-span-2">
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
      <div className="input-field col-span-2">
        <label htmlFor="password">Password (must be at least 8 characters with at least 1 number and 1 symbol)</label>
        <input
          type="password"
          name="password"
          id="password"
          pattern="(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}"
          data-api-error="PASSWORD_INVALID"
          required
        />
        <span className="input-error">Password must be at least 8 characters with at least 1 number and 1 symbol</span>
      </div>
      <div className="input-field col-span-2">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          data-api-error="PASSWORDS_DO_NOT_MATCH"
          required
          onInput={(e) => e.currentTarget.setCustomValidity("")}
        />
        <span className="input-error">Passwords do not match</span>
      </div>

      <button className="col-span-2 mt-4">Register</button>
    </form>
  );
}
