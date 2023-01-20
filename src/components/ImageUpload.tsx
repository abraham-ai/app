import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";

const { Dragger } = Upload;


const props: UploadProps = {
  name: "file",
  multiple: false,
  // action: "/api/media",
  listType: "picture",
  maxCount: 1,
  accept: "image/*",
  onChange(info) {
    const { status } = info.file;
    // console.log("onChange")
    // console.log("info", info, typeof(info.file), typeof(info));
    // console.log("status", status);
    // console.log(info.file.response);
    if (status !== "uploading") {
      // console.log(info.file, info.fileList);
    }
    if (status === "done") {
      console.log("Done")
      message.success(`${info.file.name} file uploaded successfully.`);
      console.log(info.file.name)
      console.log("---")
      console.log(info.file)
      console.log("---")
      
      // console.log("Done")
      // message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      // console.log("Error")
      // console.log(info.file.response)
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    // console.log("onDrop")
    // console.log(e);
    // console.log("Dropped files", e.dataTransfer.files);
  },
};

export const ImageUpload: React.FC = () => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
  </Dragger>
);
