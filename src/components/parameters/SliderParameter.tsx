import { 
  Form, 
  InputNumber, 
  Col, 
  Row, 
  Slider
} from "antd";
import { useState } from "react";


const SliderParameter = (props: {parameter: any}) => {
  const [inputValue, setInputValue] = useState(props.parameter.default);

  const onChange = (newValue: number) => {
    setInputValue(newValue);
  };

  return (
    <Form.Item label={props.parameter.label} name={props.parameter.name}>
      <Row>
        <Col span={12}>
          <Slider
            min={props.parameter.min}
            max={props.parameter.max}
            onChange={onChange}
            // tooltip={{ open: true }} 
            value={typeof inputValue === 'number' ? inputValue : 0}
          />
        </Col>
        {/* <Col span={4}>
          <InputNumber
            min={props.parameter.min}
            max={props.parameter.max}
            style={{ margin: '0 16px' }}
            value={inputValue}
            onChange={onChange}
          />
        </Col> */}
      </Row>
      {/* <Row>
        <Col span={12}>
          <p style={{color: "gray"}}>{props.parameter.description}</p>
        </Col>
      </Row> */}
    </Form.Item>
  );
};


export default SliderParameter;