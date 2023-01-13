// import { Form, Input, Button } from "antd";
// import axios from "axios";
// import { AuthContext } from "contexts/AuthContext";
// import React, { useContext, useState } from "react";

// interface APIKeyFormInputs {
//   apiKey: string;
//   apiSecret: string;
// }

// const ApiKeyAuth = () => {
//   const [authenticating, setAuthenticating] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const { setSelectedAuthMode, availableAuthModes, setAvailableAuthModes } =
//     useContext(AuthContext);

//   const initialValues: APIKeyFormInputs = {
//     apiKey: "",
//     apiSecret: "",
//   };

//   const handleAuthenticate = async (values: APIKeyFormInputs) => {
//     setAuthenticating(true);
//     try {
//       await axios.post("/api/auth/key", values);
//       setMessage("Successfully authenticated");
//       setAvailableAuthModes({
//         ...availableAuthModes,
//         apiKey: true,
//       });
//       setSelectedAuthMode("apiKey");
//     } catch (error: any) {
//       setMessage("Error authenticating");
//     }
//     setAuthenticating(false);
//   };
//   return (
//     <Form
//       name="api-key"
//       initialValues={initialValues}
//       onFinish={handleAuthenticate}
//     >
//       <h1>Sign in with API Key</h1>
//       <Form.Item label="API Key" name="apiKey">
//         <Input />
//       </Form.Item>
//       <Form.Item label="API Secret" name="apiSecret">
//         <Input />
//       </Form.Item>
//       <Form.Item>
//         <Button
//           type="primary"
//           htmlType="submit"
//           loading={authenticating}
//           disabled={authenticating}
//         >
//           Authenticate Keypair
//         </Button>
//       </Form.Item>
//       {message && <p>{message}</p>}
//     </Form>
//   );
// };

// export default ApiKeyAuth;
