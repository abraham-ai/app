import { Form, Row, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";

import { Modal, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';


const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  }
);

const UploadParameter = (props: {form: any, parameter: any}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [urls, setUrls] = useState<string[]>([]);

  const isArray = Array.isArray(props.parameter.default);
  const maxUploads = isArray ? (props.parameter.maxLength || 3) : 1;

  const handleChange = (info: any) => {
    if (info.file.status === 'error') {
      const fileList = [...info.fileList];
      fileList.pop();
      setFileList(fileList);
      console.log(info.file.response)
      const errorMessage = info.file.response?.error || 'Unknown error occurred';
      message.error(`${info.file.name} failed to upload because: ${errorMessage}.`);
      return;
    }
    setFileList(info.fileList);
    if (info.file.status === 'done') {  
      const newUrls = [...urls, info.file.response.fileUrl];
      props.form.setFieldsValue({ [props.parameter.name]: 
        isArray ? newUrls : newUrls[0] 
      });
      setUrls(newUrls);
      console.log(`Image uploaded successfully. URL: ${info.file.response.fileUrl}`); 
      message.success(
        <>
          Uploaded successfully{" "}
          <a href={info.file.response.fileUrl}>[link]</a>.
        </>
      );     
    }
    if (info.file.status === 'removed') {
      const removedUrl = info.file.response.fileUrl;
      const newUrls = urls.filter(url => url !== removedUrl);
      props.form.setFieldsValue({ [props.parameter.name]: 
        isArray ? newUrls : newUrls[0] 
      });
      setUrls(newUrls);
    }
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  }
  
  return (
    <>
      <Row>
        <Form.Item 
          style={{ marginBottom: 5 }} 
          label={props.parameter.label} 
          name={props.parameter.name}
          rules={[{ 
            required: props.parameter.isRequired, 
            message: `${props.parameter.label} required`
          }]}
        >
          <Upload
            name="file"
            action="/api/media"
            listType="picture-card"
            fileList={fileList}
            // multiple={isArray}
            onChange={handleChange}
            onPreview={handlePreview}
          >
            {fileList.length >= maxUploads ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Row>
      <Row>
        <span style={{color: "gray"}}>{props.parameter.description}</span>
      </Row>
      <Modal 
        open={previewOpen} 
        title={previewTitle} 
        footer={null} 
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};


export default UploadParameter;