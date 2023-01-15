import { Form, Input, Col, Row } from "antd";
import { useState } from "react";


const StringParameter = (props: {parameter: any}) => {
  const [inputValue, setInputValue] = useState(props.parameter.default);

  // const onChange = (newValue: string) => {
  //   setInputValue(newValue.target.value);
  // };

  return (
    <Form.Item label={props.parameter.label} name={props.parameter.name}>
      <Row>
        {/* <Input value={inputValue} onChange={onChange} /> */}
      <Input value={inputValue} />
      </Row>
      {/* <Row>
        <Col span={12}>
          <p style={{color: "gray"}}>{props.parameter.description}</p>
        </Col>
      </Row> */}
    </Form.Item>
  );
};

export default StringParameter;