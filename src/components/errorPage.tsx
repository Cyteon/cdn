import React from "react";

interface ErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  return (
    <body>
      <div className="flex justify-center h-screen bg-ctp-base">
        <h1 className="text-xl text-ctp-red my-auto">{message}</h1>
      </div>
    </body>
  );
};

export default ErrorPage;
