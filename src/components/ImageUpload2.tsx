import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import axios from 'axios';

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: '/api/media',
  customRequest: (options: any) => {
    console.log("customRequest")
    console.log(options);
    const data = new FormData()
    data.append('file', options.file)
    const config = {
      "headers": {
        "content-type": 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s'
      }
    }

    //options.onSuccess("hello", "world");

    axios.post(options.action, data, config).then((res: any) => {
      
      console.log("SUCCESS!")
      console.log(res.data);
      //options.onSuccess(res.data, options.file)

    }).catch((err: Error) => {
      console.log("ERROR!")
      console.log(err)
    })



    // axios.post(options.action, data, config).then((res: any) => {
    //   options.onSuccess(res.data, options.file)
    // }).catch((err: Error) => {
    //   console.log(err)
    // })
    
  },
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

export const ImageUpload2: React.FC = () => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
      band files
    </p>
  </Dragger>
);
