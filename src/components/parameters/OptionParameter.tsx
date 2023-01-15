import { Form, Select, Row } from "antd";
import { useState } from "react";

const OptionParameter = (props: {parameter: any}) => {
  const [inputValue, setInputValue] = useState(props.parameter.default);

  // const handleChange = (value: string) => {
  //   console.log(`selected ${value}`);
  // };
  
  return (
    <Form.Item label={props.parameter.label} name={props.parameter.name}>
      <Row>
        <Select
          defaultValue={inputValue}
          style={{ width: "25%" }}
          // onChange={handleChange}
          options={Object.keys(props.parameter.options).map((key) => {
            return {
              value: key,
              label: props.parameter.options[key]
            }
          })}
        />
        </Row>
      <Row>
        <p style={{color: "gray"}}>{props.parameter.description}</p>
      </Row>      
    </Form.Item>
  );
};

export default OptionParameter;