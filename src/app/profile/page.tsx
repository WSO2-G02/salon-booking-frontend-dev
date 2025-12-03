import Nav from "@/components/Navbar";
import Footer from "@/components/Footer";

import ProfileHeader from "@/components/ProfileComponents/ProfileHeader";
import ProfileDetails from "@/components/ProfileComponents/ProfileDetails";
import ProfileDangerZone from "@/components/ProfileComponents/ProfileDangerZone";

export default function ProfilePage() {
  return (
    <>
      <Nav />

      {/* Main Profile Sections */}
      <ProfileHeader />
      <ProfileDetails />
      <ProfileDangerZone />

      <Footer />
    </>
  );
}
