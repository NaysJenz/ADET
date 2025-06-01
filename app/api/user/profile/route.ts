// app/api/user/profile/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // In a real app, you would fetch this from your database
  // and include proper authentication
  const profile = {
    username: "johndoe",
    email: "john.doe@example.com",
    address: "123 Main St, Anytown, USA",
    bio: "Hello! I'm a software developer passionate about creating great user experiences.",
    avatar: "",
  };

  return NextResponse.json(profile);
}