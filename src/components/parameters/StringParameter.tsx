import { Form, Input, Col, Row, Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import React, { useState } from "react";

import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';


import { InboxOutlined } from '@ant-design/icons';
import { message } from 'antd';

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
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

const App3: React.FC = () => (
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




const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const App2: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
    
  ]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Upload
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple={true}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};






const StringParameter = (props: {form: any, parameter: any}) => {
  const [value, setValue] = useState(props.parameter.defaultValue);
  const [values, setValues] = useState(new Array(props.parameter.minLength || 1).fill(props.parameter.defaultValue));

  const isArray = Array.isArray(props.parameter.defaultValue);
  
  props.parameter.mediaUpload

  const handleAddInput = () => {
    setValues([...values, ""]);
  };

  const handleChange = (newValue: string[]) => {
    setValues(newValue);
    props.form.setFieldsValue({ [props.parameter.name]: newValue });
  };

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      {isArray ? (
        <>
          <Form.Item 
            style={{ marginBottom:5 }} 
            label={props.parameter.label} 
            name={props.parameter.name}
            rules={[{ 
              required: props.parameter.isRequired, 
              message: `${props.parameter.label} required`
            }]}
          >
            <>
              {values.map((value, index) => (
                <Row key={index}>
                  <Col span={10}>
                    <Input 
                      value={value} 
                      onChange={event => {
                        const newValues = [...values];
                        newValues[index] = event.target.value;
                        handleChange(newValues);
                      }}
                    />
                  </Col>
                  <Col span={2}>
                    {values.length > (props.parameter.minLength || 1) && (
                      <Button 
                        onClick={() => {
                          const newValues = [...values];
                          newValues.splice(index, 1);
                          handleChange(newValues);
                        }}
                      >
                        <MinusOutlined />
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}
              <Row>
                <Col>
                  <Button onClick={handleAddInput}>
                    <PlusOutlined />
                  </Button>
                </Col>
              </Row>
            </>
          </Form.Item>
          <Row>
            <Col>
              <span style={{color: "gray"}}>{props.parameter.description}</span>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <Col span={10}>
              <Form.Item 
                style={{ marginBottom:5 }} 
                label={props.parameter.label} 
                name={props.parameter.name}
                rules={[{ 
                  required: props.parameter.isRequired, 
                  message: `${props.parameter.label} required`
                }]}
              >
                <Input 
                  value={value} 
                  onChange={onChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <span style={{color: "gray"}}>{props.parameter.description}</span>
            </Col>
          </Row>
          <App2 />
          <App3 />
        </>
      )}
    </>
  );
}

export default StringParameter;