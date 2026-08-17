import type { Metadata } from 'next';
import { redirect } from "next/navigation";
import ProfileForm from "../components/ProfileForm";
import { getAuthPayload } from "../lib/session";
import { getUserProfile } from "../lib/user/getUserProfile";
import LogoutButton from '../components/LogoutButton';

export const metadata: Metadata = {
  title: 'Profile'
}

// Depends on the request's auth cookie, so it must never be statically
// prerendered at build time (when no cookie exists).
export const dynamic = 'force-dynamic';

export default async function Profile() {
  const auth = await getAuthPayload();
  if (!auth) {
    redirect("/login");
  }

  const profile = await getUserProfile(Number(auth.sub));
  if (!profile) {
    redirect("/login");
  }

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
      <div className="card w-full h-full">
        <div className="flex justify-between items-center">
          <h1>Hello {profile.firstName}</h1>
          <LogoutButton />
        </div>
        <hr />
        <ProfileForm profile={profileData} />
      </div>
    </div>
  );
}