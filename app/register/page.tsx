"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

// ✅ Zod Schema
const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
  phone: z.string().min(10).max(15),
  address: z.string().min(5),
});

export default function RegisterPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: "https://demotiles.maplibre.org/style.json", // or use MapTiler for better tiles
      center: [123.8753, 12.6726],
      zoom: 12,
    });

    const marker = new maplibregl.Marker();

    map.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      // Add marker to clicked location
      marker.setLngLat([lng, lat]).addTo(map);

      // Reverse geocoding using Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const place = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      form.setValue("address", place);
    });

    return () => map.remove();
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(values);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created! You can now log in.");
  }

  return (
    <main className="flex h-full min-h-screen justify-center items-center p-4">
      <Card className="mx-auto w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input readOnly {...field} placeholder="Click on the map to select" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🗺️ MAPLIBRE MAP */}
              <div ref={mapContainerRef} className="h-64 w-full border rounded-md mt-2"></div>

              <Button type="submit" className="w-full mt-4">Create an account</Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/" className="underline">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
