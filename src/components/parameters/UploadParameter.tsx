import { Form, Row, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useContext } from "react";

import { Modal, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

import AppContext from 'context/AppContext'
import axios from "axios";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";


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

  const { chain } = useNetwork();
  const { address } = useAccount();
  const { isSignedIn, setIsSignedIn } = useContext(AppContext);
  const { signMessageAsync } = useSignMessage();

  const isArray = Array.isArray(props.parameter.default);
  const maxUploads = isArray ? (props.parameter.maxLength || 3) : 1;

  const handleChange = (info: any) => {
    if (info.file.status === 'error') {
      const fileList = [...info.fileList];
      fileList.pop();
      setFileList(fileList);
      props.form.setFieldsValue({ [props.parameter.name]: 
        isArray ? urls : urls[0] 
      });
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

  const handleBeforeUpload = async (file: RcFile) => {
    if (!isSignedIn) {
      try {
        const nonce = await fetch('/api/nonce');
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in to Eden with Ethereum.',
          uri: window.location.origin,
          version: '1',
          chainId: chain?.id,
          nonce: await nonce.text(),
        });
        const preparedMessage = message.prepareMessage();
        const signature = await signMessageAsync({
          message: preparedMessage
        });
        const result = await axios.post("/api/login", {
          message: preparedMessage,
          signature: signature,
          address: address,
        });
        setIsSignedIn(true);
        return true;
      } catch (error: any) {
        message.error('You must be signed in to upload files.');
        return false;
      }
    }
    return true;
  };
  
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
            beforeUpload={handleBeforeUpload}
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