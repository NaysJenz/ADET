"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setBio(parsedUser.bio || "");
      setProfilePic(parsedUser.profilePic || null);
    } else {
      alert("You need to log in first.");
      router.push("/login");
    }
  }, []);

  const handleSave = () => {
    const updatedUser = { ...user, bio, profilePic };
    setUser(updatedUser);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = allUsers.map((u: any) =>
      u.email === updatedUser.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setEditing(false);
    alert("Profile updated!");
  };

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfilePic(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow space-y-6">
      <h1 className="text-2xl font-bold text-center">User Profile</h1>

      <div className="flex flex-col items-center">
        {profilePic ? (
          <Image
            src={profilePic}
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full bg-gray-300 flex items-center justify-center text-sm">
            No Picture
          </div>
        )}
        <Input type="file" accept="image/*" onChange={handlePicChange} className="mt-2" />
      </div>

      <div>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Address:</strong> {user.address}</p>
      </div>

      <div>
        <label className="font-semibold">Bio:</label>
        {editing ? (
          <textarea
            className="w-full p-2 border rounded mt-1"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        ) : (
          <p className="mt-1">{bio || "No bio yet."}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        {editing ? (
          <>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        )}
      </div>
    </div>
  );
}
