import { Form, Select, Row, Col, Switch } from "antd";
import { useState } from "react";


const OptionParameter = (props: {form: any, parameter: any}) => {
  const [value, setValue] = useState(props.parameter.defaultValue);

  const options = Object.keys(props.parameter.allowedValues).map((key) => {
    return {
      value: props.parameter.allowedValues[key],
      label: props.parameter.allowedValues[key]
    }
  });  

  const onChange = (newValue: number | null) => {
    if (newValue !== null) {
      setValue(newValue);
      props.form.setFieldsValue({[props.parameter.name]: newValue});
    }
  };

  const onSwitchChange = (newValue: boolean) => {
    setValue(newValue);
    props.form.setFieldsValue({[props.parameter.name]: newValue});
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <Form.Item 
            style={{marginBottom: 5}} 
            label={props.parameter.label} 
            name={props.parameter.name}
            initialValue={props.parameter.defaultValue}
            rules={[{ 
              required: props.parameter.isRequired, 
              message: `${props.parameter.label} required`
            }]}
          >      
            {typeof props.parameter.defaultValue === "boolean" ? (
              <Switch
                checked={value}
                onChange={onSwitchChange}
              />              
            ) : (
              <Select
                value={value}
                style={{ width: "40%" }}
                options={options}
                onChange={onChange}
              />                
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <span style={{color: "gray"}}>
          {props.parameter.description}
        </span>
      </Row>
    </>
  );
};

export default OptionParameter;