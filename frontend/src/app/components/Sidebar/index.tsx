"use client";

import React from "react";

interface SidebarProps {
  children?: React.ReactNode;
}

export default function Sidebar({
  children,
}: SidebarProps): React.ReactElement {
  return (
    <div className="flex min-h-screen pt-16">
      {/* Main content area */}
      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
}
