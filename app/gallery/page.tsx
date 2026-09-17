import type { Metadata } from "next";
import GalleryRoom from "@/components/GalleryRoom";

export const metadata: Metadata = {
  title: "Gallery · Myanmar Discovery",
  description:
    "A quiet heritage hall — Bagan temples, Yangon and Mandalay, images of faith, and craft — in the round.",
};

export default function GalleryPage() {
  return (
    <>
      <link rel="preconnect" href="https://media.sketchfab.com" />
      <link rel="preconnect" href="https://static.sketchfab.com" />
      <link rel="preconnect" href="https://sketchfab.com" />
      <GalleryRoom />
    </>
  );
}
