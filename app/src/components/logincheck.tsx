"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import React from "react";

export const NavBarButtons = () => {
  const { user } = useUser();

  return (
    <div className="nav-bar__buttons">
      {!user && (
        <>
          <a className="btn btn-primary" href="/api/auth/signup">
            signup
          </a>
          <a className="btn btn-error" href="/api/auth/login">
            Login
          </a>
        </>
      )}
      {user && (
        <>
          <a className="btn btn-primary" href="/api/auth/logout">
            Logout
          </a>
        </>
      )}
    </div>
  );
};
