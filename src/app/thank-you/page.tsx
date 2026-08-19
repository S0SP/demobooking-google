import ThankYouContent from "./ThankYouContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | UnboundYou",
  description: "Your demo tutoring session booking is confirmed.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return <ThankYouContent />;
}
