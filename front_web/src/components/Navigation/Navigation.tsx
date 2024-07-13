"use client";

import React, { useState, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ConnectWallet } from "@/components/WagmiWallet/ConnectWallet";
import config from "@/config";

type Props = {
};

enum Route {
  HOME = "Home",
  //ACCOUNT = "Account",
}

const routes = {
  [Route.HOME]: "/",
  /*[Route.ACCOUNT]: "/account",*/
};

const Navigation = (props: Props) => {
  const basePath = usePathname();

  return (
    <>
      <nav
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <h3>{config.websiteTitle}</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {Object.entries(routes).map(([name, path]) => (
            <Link href={path} key={path} style={{ padding: '0 15px', textDecoration: "none" }}>
              {basePath === path ? <strong>{name}</strong> : name}
            </Link>
          ))}
          <ConnectWallet
            /*onDisconnect={setDisconnected}*/
          />
        </div>
      </nav>
    </>
  );
};

export default Navigation;
