import React from "react";
import AdminLayout from "../../../hoc/adminLayout/adminLayout";
import AuthProfile from "./auth/auth";
import UserProfile from "./profile/profile";

const Profile = () => {
  return (
    <AdminLayout section="Profile">
      <AuthProfile />
      <UserProfile />
    </AdminLayout>
  );
};

export default Profile;
