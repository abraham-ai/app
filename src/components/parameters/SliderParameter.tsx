import { Form, Col, Row, Slider, InputNumber } from "antd";
import { useState } from "react";


const SliderParameter = (props: {form: any, parameter: any}) => {
  const [value, setValue] = useState(props.parameter.defaultValue);

  const onChange = (newValue: number) => {
    setValue(newValue);
    props.form.setFieldsValue({[props.parameter.name]: newValue});
  };

  return (
    <>
      <Row>
        <Col span={8}>
          <Form.Item 
            style={{ marginBottom: 5 }} 
            label={props.parameter.label} 
            name={props.parameter.name}
            initialValue={props.parameter.defaultValue} 
          >
            <Slider 
              value={value}
              min={props.parameter.minimum} 
              max={props.parameter.maximum} 
              onChange={(newValue: number) => setValue(newValue)}
            />
          </Form.Item>
        </Col>
        <Col style={{marginLeft: 10}}>
          <InputNumber 
            value={value}
            min={props.parameter.minimum} 
            max={props.parameter.maximum} 
            onChange={onChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <span style={{color: "gray" }}>{props.parameter.description}</span>
        </Col>
      </Row>
    </>
  );
};

export default SliderParameter;