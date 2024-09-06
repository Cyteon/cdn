import React, { useState } from "react";

function Upload() {
  const [selectedFile, setSelectedFile] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file.name);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file.name);

      const fileInput = document.getElementById("file") as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput!.files = dataTransfer.files;
      fileInput!.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="flex">
      <input
        type="file"
        name="file"
        id="file"
        onChange={handleFileChange}
        hidden
      />
      <label
        htmlFor="file"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
        w-full p-8 my-2 bg-ctp-crust text-ctp-text rounded-md cursor-pointer border-dashed border-[1px] border-ctp-surface0
        hover:border-ctp-blue transition-all duration-700
        ${isDragging ? "border-ctp-blue" : ""}
        ${selectedFile ? "border-ctp-green" : ""}
        `}
      >
        Drop your file here or click to upload
        <p className="text-sm text-ctp-subtext0 mt-auto">
          {selectedFile || "No file selected"}
        </p>
      </label>
    </div>
  );
}

export default Upload;
