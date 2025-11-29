// src/secret/RequireSuperuser.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireSuperuser({ children }) {
  let isSuperuser = false;

  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser && storedUser.is_superuser) {
      isSuperuser = true;
    }
  } catch (e) {
    isSuperuser = false;
  }

  if (!isSuperuser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
