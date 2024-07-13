import React from "react";
import Image from "next/image";
import config from "@/config";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer
      style={{
        borderTop: "1px solid #272727",
        padding: "3rem",
        margin: "2rem",
        display: "flex",
        gap: "2rem",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
        <strong>Contact</strong>
        <div style={{ display: "flex", flexDirection: 'column', gap: "0.75rem" }}>
          <a style={{ fontSize: '14px', color: 'rgb(111, 111, 111)', textDecoration: 'none' }} href={"mailto:" + config.contactMail} target={"_blank"}>
            {"</A> Mail"}
          </a>
          <a style={{ fontSize: '14px', color: 'rgb(111, 111, 111)', textDecoration: 'none' }} href={"#"} target={"_blank"}>
            {"</A> Discord"}
          </a>
          <a style={{ fontSize: '14px', color: 'rgb(111, 111, 111)', textDecoration: 'none' }} href={"#"} target={"_blank"}>
            {"</A> Telegram"}
          </a>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'end'}}>
        <h3 style={{ fontSize: '12px' }}>@ 2024 {config.websiteTitle}</h3>
      </div>
    </footer>
  );
};

export default Footer;
