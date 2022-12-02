import axios from 'axios'
import React, {useState, useCallback} from 'react';
import {Tabs} from 'antd';

const GATEWAY_URL = "https://gateway-test.abraham.ai"; //"https://app.dev.aws.abraham.fun"
const MINIO_URL = "https://minio.aws.abraham.fun";
const MINIO_BUCKET = "creations-stg";


function App() {
  // const [images, setImages] = useState([]);

  async function submitPrediction(config, resultId) {
    const apiKey = "LYq6brWEOKuhrhY72jPG7n5PR5jze1uQ"; // document.querySelector("input[name=apiKey]").value;
    const apiSecret = "dntM3aDAAefCCKlXsUMj2lCUG1nD5DOO"; // document.querySelector("input[name=apiSecret]").value;

    if (!apiKey || !apiSecret) {
      alert("Please enter your API key and secret in the first tab");
      return;
    }

    const authData = {"apiKey": apiKey, "apiSecret": apiSecret};        

    // get auth token
    let responseS = await axios.post(GATEWAY_URL+'/sign_in', authData);
    console.log(responseS)
    const authToken = responseS.data.authToken;

    const request = {
      "token": authToken,
      "application": "heartbeat", 
      "generator_name": "stable-diffusion", 
      "config": config,
      "metadata": null
    }
    console.log(request)
    // start prediction
    console.log(GATEWAY_URL+'/predictions')
    let responseR = await axios.post(GATEWAY_URL+'/request', request)
    console.log("got response")
    console.log(responseR)
    console.log(responseR.data)
    let prediction_id = responseR.data;
    console.log(`job submitted, task id ${prediction_id}`);
    document.querySelector("progressReal2Real")
    
    // update progress text span
    let progress = document.querySelector(`#progress${resultId}`);
    progress.innerHTML = `Generating ${prediction_id}...`;

    // poll every few seconds for update to the job
    var refreshIntervalId = setInterval(async function() {
      let response = await axios.post(GATEWAY_URL+'/fetch', {
        "taskIds": [prediction_id]
      });
      console.log(response.data)
      let {status, output} = response.data[0];
      if (status === 'complete') {
        let outputUrl = `${MINIO_URL}/${MINIO_BUCKET}/${output}`;
        document.querySelector(`#result${resultId}`).src = outputUrl;
        let progress = document.querySelector(`#progress${resultId}`);
        progress.innerHTML = `Done: <a href="${outputUrl}">${outputUrl}</a>`;
        console.log("done", outputUrl);
        clearInterval(refreshIntervalId);
      }
      else if (status === 'failed') {
        console.log("failed");
        clearInterval(refreshIntervalId);
      }    
      console.log("let's go!", refreshIntervalId)  
    }, 2000);
  }

  function checkDimensions(width, height) {
    if (width <= 0 || height <= 0) {
      alert('Width and height must be positive numbers');
      return false;
    }
    if (width * height > 1000000) {
      alert('Image size too large. Width x Height must be less than 1M');
      return false;
    }
    return true;
  }
  
  async function onClickMyCreations() {
    console.log("TBD")
  }

  async function onClickRemix() {
    // const initimgurl1 = document.querySelector("input[name=initimgurl1]").value;
    // const initimgurl2 = document.querySelector("input[name=initimgurl2]").value;

    // const width = parseInt(document.querySelector("input[name=rwidth]").value);
    // const height = parseInt(document.querySelector("input[name=rheight]").value);
    // const numframes = parseInt(document.querySelector("input[name=rnumframes]").value);

    // if (!checkDimensions(width, height)) {
    //   return;
    // }

    console.log("TBD");

    let config = {
      mode: "generate", 
      text_input: "remix",
      seed: 1e8 * Math.random(),
      sampler: "klms",
      scale: 10.0,
      steps: 60, 
      width: width,
      height: height
    }
    
    await submitPrediction(config, "Remix");
  }
  
  async function onClickGenerate() {
    const prompt = document.querySelector("input[name=prompt]").value;
    const width = parseInt(document.querySelector("input[name=gwidth]").value);
    const height = parseInt(document.querySelector("input[name=gheight]").value);

    if (prompt.length === 0) {
      alert('Prompt required');
      return;
    }

    if (!checkDimensions(width, height)) {
      return;
    }

    let config = {
      mode: "generate", 
      text_input: prompt,
      seed: 1e8 * Math.random(),
      sampler: "euler_ancestral",
      scale: 12.0,
      steps: 50, 
      width: width,
      height: height
    }
    
    await submitPrediction(config, "Generate");
  }

  async function onClickInterpolate() {
    const prompt1 = document.querySelector("input[name=prompt1]").value;
    const prompt2 = document.querySelector("input[name=prompt2]").value;

    const width = parseInt(document.querySelector("input[name=iwidth]").value);
    const height = parseInt(document.querySelector("input[name=iheight]").value);
    const numframes = parseInt(document.querySelector("input[name=inumframes]").value);

    if (!checkDimensions(width, height)) {
      return;
    }

    if (numframes <= 0 || numframes > 100) {
      alert('Number of frames must be between 1 and 100');
    }

    if (prompt1.length === 0 && prompt2.length === 0) {
      alert('Two prompts required');
      return;
    }

    let interpolation_texts = [
      prompt1, 
      prompt2
    ];

    let config = {
      mode: "interpolate", 
      stream: true, // this doesn't do anything yet
      stream_every: 1, // this doesn't do anything yet
      text_input: `${prompt1}_to_${prompt2}`,
      seed: 1e8 * Math.random(),
      sampler: "euler",
      scale: 10.0,
      steps: 25, 
      width: width,
      height: height,
      n_frames: numframes,
      loop: true,
      smooth: true,
      n_film: 1,
      scale_modulation: 0.2,
      fps: 12,
      interpolation_texts: interpolation_texts,
      interpolation_seeds: [...Array(interpolation_texts.length).keys()].map(() => 1e8 * Math.random())
    }
    
    await submitPrediction(config, "Interpolate");
  }

  async function onClickReal2Real() {

    const initimgurl1 = document.querySelector("input[name=initimgurl1]").value;
    const initimgurl2 = document.querySelector("input[name=initimgurl2]").value;

    const width = parseInt(document.querySelector("input[name=rwidth]").value);
    const height = parseInt(document.querySelector("input[name=rheight]").value);
    const numframes = parseInt(document.querySelector("input[name=rnumframes]").value);

    if (!checkDimensions(width, height)) {
      return;
    }

    if (numframes <= 0 || numframes > 100) {
      alert('Number of frames must be between 1 and 100');
    }

    let interpolation_init_images = [initimgurl1, initimgurl2];

    let config = {
      mode: "interpolate", 
      stream: true, // this doesn't do anything yet
      stream_every: 1, // this doesn't do anything yet
      text_input: "real2real",
      seed: 1e8 * Math.random(),
      sampler: "euler",
      scale: 10.0,
      steps: 25, 
      width: width,
      height: height,
      n_frames: numframes,
      loop: true,
      smooth: true,
      n_film: 1,
      scale_modulation: 0.2,
      fps: 12,
      interpolation_init_images_use_img2txt: true,
      interpolation_init_images: interpolation_init_images,
      interpolation_seeds: [...Array(interpolation_init_images.length).keys()].map(() => 1e8 * Math.random())
    }
    
    await submitPrediction(config, "Real2Real");
  }

  return (
    <div className="App">
      <Tabs defaultActiveKey="1">
        {/* <Tabs.TabPane tab="API Key" key="1">
          <div>
            <br/>&nbsp;<br/>
            API Key: <input type="text" style={{fontSize: "1.05em", width: "300px"}} name="apiKey" placeholder="API Key" required />
            <br/>&nbsp;<br/>
            API Secret: <input type="text" style={{fontSize: "1.05em", width: "300px"}} name="apiSecret" placeholder="API Secret" required />
            <br/>&nbsp;<br/>
            <button style={{fontSize: "1.1em", width: "200px"}} onClick={onClickMyCreations}>Get my data</button>
            <br/>&nbsp;<br/>
            <hr/>
          </div>
        </Tabs.TabPane> */}
        <Tabs.TabPane tab="Generate" key="2">
          <div>
            <br/>&nbsp;<br/>
            Prompt: <input type="text" style={{fontSize: "1.2em", width: "1080px"}} name="prompt" placeholder="Prompt" required />
            <br/>&nbsp;<br/>
            &nbsp;Width: <input type="text" style={{fontSize: "1.2em", width: "100px"}} name="gwidth" defaultValue="512" required />
            &nbsp;Height: <input type="text" style={{fontSize: "1.2em", width: "100px"}} name="gheight" defaultValue="512" required />
            <br/>&nbsp;<br/>
            <button style={{fontSize: "1.1em", width: "200px"}} onClick={onClickGenerate}>Generate</button>
            <div id="progressGenerate"></div>
            <br/>&nbsp;<br/>
            <img alt="" id="resultGenerate" />          
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Remix" key="3">
          <div>
            {/* <br/>&nbsp;<br/>
            <span style={{fontSize:"32px"}}>... or ...</span> */}
            <br/>&nbsp;<br/>
            Init Img URL: <input type="text" style={{fontSize: "1.2em", width: "1080px"}} name="rminitimgurl1" placeholder="" required />
            <br/>&nbsp;<br/>
            &nbsp;Width: <input type="text" style={{fontSize: "1.2em", width: "100px"}} name="rmwidth" defaultValue="512" required />
            &nbsp;Height: <input type="text" style={{fontSize: "1.2em", width: "100px"}} name="rmheight" defaultValue="512" required />
            <br/>&nbsp;<br/>
            <button style={{fontSize: "1.1em", width: "200px"}} onClick={onClickRemix}>Generate Remix</button>
            <div id="progressRemix"></div>
            <br/>&nbsp;<br/>
            <img alt="" id="resultRemix" />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Interpolate" key="4">
          <div>
            <br/>&nbsp;<br/>
            Prompt 1: <input type="text" style={{fontSize: "1.2em", width: "1080px"}} name="prompt1" placeholder="Prompt" required />
            <br/>&nbsp;<br/>
            Prompt 2: <input type="text" style={{fontSize: "1.2em", width: "1080px"}} name="prompt2" placeholder="Prompt" required />
            <br/>&nbsp;<br/>
            &nbsp;Width: <input type="text" style={{fontSize: "1.2em", width: "100px"}} name="iwidth" defaultValue="512" required />
            &nbsp;Height: <input type="text" style={{fontSize: "1.2em", width: "100px"}} name="iheight" defaultValue="512" required />
            &nbsp;Num Frames: <input type="text" style={{fontSize: "1.2em", width: "100px"}} name="inumframes" defaultValue="90" required />
            <br/>&nbsp;<br/>
            <button style={{fontSize: "1.1em", width: "200px"}} onClick={onClickInterpolate}>Interpolate</button>
            <br/>&nbsp;<br/>
            <div id="progressInterpolate"></div>
            <video id="resultInterpolate" controls autoplay loop />

          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Real2Real" key="5">
          <div>
            {/* <br/>&nbsp;<br/>
            <span style={{fontSize:"32px"}}>... or ...</span> */}
            <br/>&nbsp;<br/>
            Init Img URL 1: <input type="text" style={{fontSize: "1.2em", width: "1080px"}} name="initimgurl1" placeholder="" required />
            <br/>&nbsp;<br/>
            Init Img URL 2: <input type="text" style={{fontSize: "1.2em", width: "1080px"}} name="initimgurl2" placeholder="" required />
            <br/>&nbsp;<br/>
            &nbsp;Width: <input type="text" style={{fontSize: "1.2em", width: "100px"}} name="rwidth" defaultValue="512" required />
            &nbsp;Height: <input type="text" style={{fontSize: "1.2em", width: "100px"}} name="rheight" defaultValue="512" required />
            &nbsp;Num Frames: <input type="text" style={{fontSize: "1.2em", width: "100px"}} name="rnumframes" defaultValue="90" required />
            <br/>&nbsp;<br/>
            <button style={{fontSize: "1.1em", width: "200px"}} onClick={onClickReal2Real}>Generate Real2Real</button>
            <div id="progressReal2Real"></div>
            <br/>&nbsp;<br/>
            {/* <img alt="" id="resultReal2Real" /> */}
            <video id="resultReal2Real" controls autoPlay loop />            
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default App;
