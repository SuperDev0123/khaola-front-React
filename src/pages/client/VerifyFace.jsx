import React, { useState, useRef, useEffect } from "react";
import { Spin, Typography, Button, List, Row, Col, Divider, message } from "antd";
import { ContainerOutlined, ScheduleOutlined, CarOutlined } from '@ant-design/icons';
import * as faceapi from 'face-api.js';
import { selectAuth } from "@/redux/auth/selectors";
import storePersist from "@/redux/storePersist";
import { useSelector } from "react-redux";
import { request } from "@/request";

const data = [
  "1. Displat entire face",
  '2. Avoid glare',
  '3. Show consent note fitly',
  '4. No photo from another image or device',
];

const VerifyFace = ({ ...props }) => {
  const { finish, setIsProgress, faceDescriptor } = props;
  const [isSuccess, setIsSuccess] = React.useState(0);
  const [remainTimes, setRemainTimes] = React.useState(3);
  const [loading, setLoading] = React.useState(true);
  const canvasRef = useRef(null);
  const screenshotRef = useRef(null);
  const playRef = useRef(null);
  let auth = useSelector(selectAuth);
  let isLoaded = {
    modal: false,
    stream: false,
  };

  const setLoaded = (type) => {
    isLoaded[type] = true;
    if (isLoaded.modal && isLoaded.stream) setLoading(false);
  }

  useEffect(() => {
    message.info('Loading')
    const facingMode = 'user';
    const constraints = {
      audio: false,
      video: {
        facingMode
      }
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      if (screenshotRef.current && playRef.current) {
        screenshotRef.current.srcObject = stream;
        playRef.current.srcObject = stream;
        setLoaded('stream');
      }
    });
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';

      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(setLoaded('modal'));
    }
    loadModels();
  }, []);

  const verifyFace = async () => {
    return new Promise(async (resolve, reject) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // const video = playRef.current;
      // ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
      const option = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 });
      const results = await faceapi
        .detectAllFaces(canvas, option)
        .withFaceLandmarks()
        .withFaceDescriptors()
      if (!results.length) {
        resolve({ isSuccess: false, messageText: 'Please photo your entire face' })
        return
      }
      const faceMatcher = new faceapi.FaceMatcher(results)
      const bestMatch = faceMatcher.findBestMatch(faceDescriptor)
      console.log(bestMatch)
      if (bestMatch.distance > 0.55) {
        console.log('remainTimes', remainTimes)
        if (remainTimes < 2) {
          let result = await request.get('/client/reject')
          console.log(result)
          
          auth.current.isRejected = true
          storePersist.set("auth", auth);
          window.location.href = '/'
        }
        else {
          resolve({ isSuccess: false, messageText: `Face verify failed, You can try ${remainTimes - 1} times more` })
        }
      }
      else {
        resolve({ isSuccess: true, messageText: 'Face verify success' });
      }
      setRemainTimes(remainTimes - 1);
    })
  }

  const Capture = async () => {
    // setTimeout(async () => {
    message.info('Verifying')
    setLoading(true);
    setIsProgress(true);
    playRef.current.pause();
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');
    const video = playRef.current;
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
    let { isSuccess, messageText } = await verifyFace();
    console.log(isSuccess, messageText)
    // VerifyFace();
    if (!isSuccess) message.error(messageText)
    if (isSuccess) {
      message.success(messageText)
      await finish();
    }
    setLoading(false)
    setIsProgress(false)
    setIsSuccess(isSuccess ? 1 : 2);
    // }, 3000)
  }
  const Retry = () => {
    setIsSuccess(0);
    playRef.current.play();
  }


  const onChange = (e) => {
    message.info('Verifying')
    setLoading(true);
    setIsProgress(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let imageFile = e.target.files[0]; //here we get the image file
    var reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = function (e) {
      var myImage = new Image(); // Creates image object
      myImage.src = e.target.result; // Assigns converted image to image object
      myImage.onload = async function (ev) {
        let rate = myImage.width / myImage.height;
        let canvasRate = canvas.width / canvas.height;
        let angle = 0;
        if (angle > 0) {
          ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
          ctx.rotate(90 * Math.PI / 180)
          ctx.translate(-canvas.height * 0.5, -canvas.width * 0.5);
          let { width, height } = calcResoul(canvas.height, canvas.width, rate)
          ctx.drawImage(myImage, 0, 0, width, height); // Draws the image on 
          ctx.restore();
        }
        else {
          let { width, height } = calcResoul(canvas.height, canvas.width, rate)
          ctx.drawImage(myImage, 0, 0, width, height); // Draws the image on 
        }
        let { isSuccess, messageText } = await verifyFace();
        if (!isSuccess) {
          if (angle > 0) {
            ctx.translate(canvas.height * 0.5, canvas.width * 0.5);
            ctx.rotate(180 * Math.PI / 180)
            ctx.translate(-canvas.height * 0.5, -canvas.width * 0.5);
            let { width, height } = calcResoul(canvas.height, canvas.width, rate)
            ctx.drawImage(myImage, 0, 0, width, height); // Draws the image on 
          }
          else {
            ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
            ctx.rotate(180 * Math.PI / 180)
            ctx.translate(-canvas.height * 0.5, -canvas.width * 0.5);
            let { width, height } = calcResoul(canvas.height, canvas.width, rate)
            ctx.drawImage(myImage, 0, 0, width, height); // Draws the image on 
          }
          ctx.restore();
          const result = await verifyFace();
          isSuccess = result.isSuccess;
          messageText = result.messageText;
        }
        if (!isSuccess) message.error(messageText)
        if (isSuccess) {
          message.success(messageText)
          await finish();
        }
        setLoading(false)
        setIsProgress(false)
        setIsSuccess(isSuccess ? 1 : 2);
      }
    }
  }

  const calcResoul = (width, height, imgRate) => {
    let canvasRate = width / height;
    if (canvasRate > imgRate) {
      return { width: height * imgRate, height: height }
    }
    else
      return { width: width, height: width / imgRate }
  }

  return (
    <Spin spinning={loading} delay={0}>
      <Typography style={{ padding: '30px 0', textAlign: 'center' }}>Take a photo of your entire face</Typography>
      <Row>
        <Col span={24} md={8}>
          <List
            size="small"
            style={{ height: '100%' }}
            header={<div className="text-center bold">Photo requirements <Divider /></div>}
            bordered
            dataSource={data}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </Col>
        <Col span={24} md={16}>
          <video playsInline autoPlay muted ref={playRef} width="100%" height="100%" />
          <video playsInline autoPlay muted width={1000} height={500} ref={screenshotRef} className="hidden" />
          <canvas ref={canvasRef} width={1000} height={500} style={{ position: 'fixed', left: 0, top: 0 }} className="hidden"></canvas>
        </Col>
      </Row>
      <Row style={{ padding: 10 }} align="end">
        {/* <Button style={{ paddingRight: 20 }}>tets</Button> */}

        {isSuccess > 0 ? (
          isSuccess == 1 ? '' :
            <Button type="danger" onClick={Retry}>Retry</Button>
        ) : (
          <>
            <input type="file" id="imageInput" accept="image/*" onChange={onChange} />
            <Button type="primary" onClick={Capture}>Capture</Button>
          </>
        )}
      </Row>
    </Spin>
  );
};

export default VerifyFace;
