import { redirect } from "next/navigation";
import ProfileForm from "../components/ProfileForm";
import { getAuthPayload } from "../lib/session";
import { getUserProfile } from "../lib/user/getUserProfile";
import type { Metadata } from 'next';
import LogoutButton from '../components/LogoutButton';

export const metadata: Metadata = {
  title: 'Profile'
}

export default async function Profile() {
  const auth = await getAuthPayload();
  if (!auth) {
    redirect("/login");
  }

  const profile = await getUserProfile(Number(auth.sub));
  const profileData = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    dateOfBirth: profile.dateOfBirth,
    street: profile.street,
    city: profile.city,
    postalCode: profile.postalCode,
    country: profile.country,
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen p-4 gradient-bg1 relative">
      <div className="absolute inset-0 z-50 flex justify-end items-start p-4">
        <LogoutButton />
      </div>
      <div className="card w-full h-full">
        <h1>Hello {profile.firstName}</h1>
        <hr />
        <ProfileForm profile={profileData} />
      </div>
    </div>
  );
}