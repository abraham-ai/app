import { Form, Col, Row, Slider, InputNumber } from "antd";
import { useState } from "react";


const SliderParameter = (props: {form: any, parameter: any}) => {
  const [value, setValue] = useState(props.parameter.default);

  const onChange = (newValue: number) => {
    setValue(newValue);
    props.form.setFieldsValue({[props.parameter.name]: newValue});
  };

  return (
    <div style={{padding: 10, marginBottom: 10}}>
      <Row>
        <Col span={8}>
          <Form.Item 
            style={{ marginBottom: 5 }} 
            label={props.parameter.label} 
            name={props.parameter.name}
            initialValue={props.parameter.default} 
          >
            <Slider 
              value={value}
              min={props.parameter.min} 
              max={props.parameter.max} 
              onChange={(newValue: number) => setValue(newValue)}
            />
          </Form.Item>
        </Col>
        <Col>
          <InputNumber 
            value={value}
            min={props.parameter.min} 
            max={props.parameter.max} 
            onChange={onChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <span style={{color: "gray" }}>{props.parameter.description}</span>
        </Col>
      </Row>
    </div>
  );
};

export default SliderParameter;