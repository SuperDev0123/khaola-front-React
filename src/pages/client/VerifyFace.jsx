import React, { useState, useRef, useEffect } from "react";
import { Spin, Typography, Button, List, Row, Col, Divider, message } from "antd";
import { ContainerOutlined, ScheduleOutlined, CarOutlined } from '@ant-design/icons';
import * as faceapi from 'face-api.js';

const data = [
  "1. Displat entire face",
  '2. Avoid glare',
  '3. Show consent note fitly',
  '4. No photo from another image or device',
];

const VerifyFace = ({ ...props }) => {
  const { setIsDone, setIsProgress, faceDescriptor } = props;
  const [isSuccess, setIsSuccess] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const canvasRef = useRef(null);
  const screenshotRef = useRef(null);
  const playRef = useRef(null);

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

  const VerifyFace = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = playRef.current;
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
    const option = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 });
    const results = await faceapi
      .detectAllFaces(canvas, option)
      .withFaceLandmarks()
      .withFaceDescriptors()
    if (!results.length) {
      message.error('Please photo your entire face.')
      setLoading(false)
      setIsProgress(false)
      setIsSuccess(2);
      return
    }
    const faceMatcher = new faceapi.FaceMatcher(results)
    const bestMatch = faceMatcher.findBestMatch(faceDescriptor)
    console.log(bestMatch)
    setLoading(false)
    setIsProgress(false)
    if (bestMatch.distance > 0.5) {
      message.error('Face verify failed')
      setIsSuccess(2);
      return
    }
    message.success('Face verify success')
    setIsSuccess(1);
    setIsDone(true);
  }

  const Capture = () => {
    // setTimeout(async () => {
      message.info('Verifying')
      setLoading(true);
      setIsProgress(true);
      playRef.current.pause();
      setTimeout(VerifyFace, 1000);
      // VerifyFace();
      return
    // }, 3000)
  }
  const Retry = () => {
    setIsSuccess(0);
    playRef.current.play();
  }
  return (
    <Spin spinning={loading} delay={0}>
      <Typography style={{ padding: '30px 0', textAlign: 'center' }}>Take a photo of your entire face</Typography>
      <Row>
        <Col span={24} md={8}>
          <List
            size="small"
            height="100%"
            header={<div className="text-center bold">Photo requirements <Divider /></div>}
            bordered
            dataSource={data}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </Col>
        <Col span={24} md={16}>
          <video playsInline autoPlay muted ref={playRef} width="100%" height="100%" />
          <video playsInline autoPlay muted width={1000} height={500} ref={screenshotRef} className="hidden" />
          <canvas ref={canvasRef} width={1000} height={500} style={{ position: 'fixed', left: 0 }} className="hidden"></canvas>
        </Col>
      </Row>
      <Row style={{ padding: 10 }} align="end">
        {/* <Button style={{ paddingRight: 20 }}>tets</Button> */}

        {isSuccess > 0 ? (
          isSuccess == 1 ? '' :
            <Button type="danger" onClick={Retry}>Retry</Button>
        ) :
          <Button type="primary" onClick={Capture}>Capture</Button>}
      </Row>
    </Spin>
  );
};

export default VerifyFace;
