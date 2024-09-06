import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "./provider";
import Script from "next/script";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="./node_modules/lodash/lodash.min.js" async />
        <script src="./node_modules/dropzone/dist/dropzone-min.js" async />
      </head>
      <Provider>
        <body className={inter.className}>{children}</body>
      </Provider>
    </html>
  );
}
/*
<head>
  <link
    href="https://rawcdn.githack.com/accord-chat/assets/ae8cfe1fe24ec0e5566ecf9b5963bf4750a982d5/code/prismjs/prism.css"
    rel="stylesheet"
  />

  <Script src="https://rawcdn.githack.com/accord-chat/assets/ae8cfe1fe24ec0e5566ecf9b5963bf4750a982d5/code/prismjs/prism.js" />
</head>
*/
