"use client";
import { SubmitEvent } from "react";

type Props = {
  profile?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export default function ProfileForm({ profile }: Props) {
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/user/profile', {
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
      } else {
        alert('Profile updated successfully');
      }
    }
    catch (error) {
      console.log('Error during profile update:', error);
    }
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <h2>Profile</h2>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div className="input-field col-span-1 max-sm:col-span-2">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            defaultValue={profile?.firstName}
          />
        </div>
        <div className="input-field col-span-1 max-sm:col-span-2">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            defaultValue={profile?.lastName}
          />
        </div>
        <div className="input-field col-span-1 max-sm:col-span-2">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            defaultValue={profile?.dateOfBirth}
            onInput={(e) => e.currentTarget.setCustomValidity("")}
          />
        </div>
      </div>
      <h2 className="mt-4">Address</h2>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div className="input-field col-span-1 max-sm:col-span-2">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            name="street"
            id="street"
            defaultValue={profile?.street}
          />
        </div>
        <div className="input-field col-span-1 max-sm:col-span-2">
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            id="city"
            defaultValue={profile?.city}
          />
        </div>
        <div className="input-field col-span-1 max-sm:col-span-2">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            id="postalCode"
            defaultValue={profile?.postalCode}
          />
        </div>
        <div className="input-field col-span-1 max-sm:col-span-2">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            name="country"
            id="country"
            defaultValue={profile?.country}
          />
        </div>

        <button type="submit" className="col-span-2 mt-4">Save</button>
      </div>
    </form>
  );
}
