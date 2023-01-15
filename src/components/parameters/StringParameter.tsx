import { Form, Input, Col, Row } from "antd";
import { useState } from "react";

const StringParameter = (props: {form: any, parameter: any}) => {
  const [value, setValue] = useState(props.parameter.default);

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <div style={{padding: 10, marginBottom: 10}}>
      <Row>
        <Col span={10}>
          <Form.Item 
            style={{ marginBottom:5 }} 
            label={props.parameter.label} 
            name={props.parameter.name}
          >
            <Input 
              value={value} 
              min={props.parameter.min} 
              max={props.parameter.max} 
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
    </div>
  );
}

export default StringParameter;