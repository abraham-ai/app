import { Form, Input, Col, Row, Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const StringParameter = (props: {form: any, parameter: any}) => {
  const [value, setValue] = useState(props.parameter.defaultValue);
  const [values, setValues] = useState(new Array(props.parameter.minLength || 1).fill(props.parameter.defaultValue));

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

  const isArray = Array.isArray(props.parameter.defaultValue);

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
                  onChange={event => {setValue(event.target.value)}}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <span style={{color: "gray"}}>{props.parameter.description}</span>
          </Row>
        </>
      )}
    </>
  );
}

export default StringParameter;