import { Form, Select, Row, Col } from "antd";
import { useState } from "react";


const OptionParameter = (props: {form: any, parameter: any}) => {
  const [value, setValue] = useState(props.parameter.default);

  const options = Object.keys(props.parameter.options).map((key) => {
    return {
      value: props.parameter.options[key],
      label: props.parameter.options[key]
    }
  });  

  const onChange = (newValue: string) => {
    setValue(newValue);
    props.form.setFieldsValue({[props.parameter.name]: newValue});
  };

  return (
    <div style={{padding: 10, marginBottom: 10}}>
      <Row>
        <Col span={12}>
          <Form.Item 
            style={{marginBottom:5}} 
            label={props.parameter.label} 
            name={props.parameter.name}
            initialValue={props.parameter.default}
          >              
            <Select
              value={value}
              style={{ width: "40%" }}
              options={options}
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
};

export default OptionParameter;