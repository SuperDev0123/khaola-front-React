import React, { useState, useRef, useEffect } from "react";
import { Spin, Typography, Button, List, Row, Col, Divider, message, Upload } from "antd";
import Tesseract from 'tesseract.js';
import { createScheduler, createWorker } from 'tesseract.js';
import * as faceapi from 'face-api.js';
import preprocessImage from '@/utils/preprocess';
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
const arabicMonths = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

const verifyNation = (lines) => {
  let firstName, lastName, birthDate;
  let isStart = false;
  lines.forEach((line, i) => {
    if (!birthDate) {
      let temp = line.text;
      let date = temp.match(/[0-9][0-9][0-9][0-9]/);
      if (date && date > 1900 && date < 2100) {
        console.log(date)
        let textArr = line.text.split(' ')
        textArr = textArr.filter(val => {
          return val && val.length
        })
        let index = textArr.indexOf(date[0])
        let month = -1;
        arabicMonths.forEach((val, i) => {
          if (textArr[index - 1] && (val.indexOf(textArr[index - 1]) >= 0 || textArr[index - 1].indexOf(val) >= 0)) {
            month = i + 1;
          }
        })
        if (month <= 0) return;
        birthDate = `${date[0]}-${month}-${textArr[index - 2]}`;
        if (!moment(birthDate)) return;
        lastName = (lines[i - 2] && lines[i - 2].text)
        firstName = (lines[i - 2] && lines[i - 3].text)
      }
    }
  })
  return checkResult(firstName, lastName, birthDate)
}

const verifyDriving = (lines) => {
  console.log("driving")
  let firstName, lastName, birthDate;
  let isStart = false;
  lines.forEach(line => {
    let temp = line.text;
    if (isStart && /[A-z][A-z]/g.test(temp)) {
      let name = extractName(temp)
      if (!name || !name.length) return;
      if (!firstName) {
        firstName = name;
        return
      }
      if (!lastName) {
        lastName = name
      }
    }
    let date = temp.match(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/);
    if (!birthDate && isStart && date) birthDate = date[0];
    if (/./g.test(temp) && /[0-9][0-9][0-9]/g.test(temp)) isStart = true;
  })
  return checkResult(firstName, lastName, birthDate)
}

const verifyPassport = (lines) => {
  let firstName, lastName, birthDate;
  lines.forEach((line, index) => {
    if (!birthDate) {
      let temp = line.text;
      let date = temp.match(/[0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]/);
      if (date) {
        birthDate = date[0];
        lastName = extractName(lines[index - 3].text)
        firstName = extractName(lines[index - 5].text)
      }
    }
  })
  return checkResult(firstName, lastName, birthDate)
}
const extractName = (temp) => {
  if (!temp) return '';
  let name = '';
  temp.split(' ').forEach(val => {
    if (!name.length && val && /[A-z][A-z]/g.test(val)) name = val;
  })
  return name;
}

const checkResult = (firstName, lastName, birthDate) => {
  if (firstName && lastName && birthDate) {
    return { firstName, lastName, birthDate, isSuccess: true };
  }
  else {
    return { isSuccess: false };
  }
}

const data = [
  "1. Don't fold the document",
  '2. Show entire document',
  '3. Avoid glare',
  '4. No paper-based documents',
  '4. No photocopy',
  '4. No image from device',
];

const Constants = {
  nation: {
    title: 'National Card',
    lang: 'ara',
    threshold: 480,
    verify: verifyNation
  },
  driving: {
    title: 'Driving License',
    lang: 'eng',
    threshold: 450,
    verify: verifyDriving
  },
  passport: {
    title: 'Passport',
    lang: 'eng',
    threshold: 600,
    verify: verifyPassport
  }
}

const VerifyDoc = ({ ...props }) => {
  const { docType, setUserInfo, setIsProgress, setFaceDescriptor } = props;
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(0);
  const docInfo = Constants[docType];
  const canvasRef = useRef(null);
  const profileRef = useRef(null);
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

  const verifyDoc = async (threshold) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(preprocessImage(profileRef.current, threshold), 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    Tesseract.recognize(
      dataUrl, docInfo.lang,
      {
        logger: m => console.log(m)
      }
    )
      .catch(err => {
        console.error(err);
        setLoading(false)
        setIsProgress(false)
      })
      .then(async result => {
        console.log(result.data.text)
        let verifyRes = docInfo.verify(result.data.lines)
        console.log(verifyRes)
        if (verifyRes.isSuccess) {
          const option = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 });
          const singleResult = await faceapi
            .detectSingleFace(profileRef.current, option)
            .withFaceLandmarks()
            .withFaceDescriptor()
          console.log(singleResult)
          setLoading(false)
          setIsProgress(false)
          if (singleResult) {
            message.success('Verify Success')
            setFaceDescriptor(singleResult.descriptor)
            setIsSuccess(1);
            setUserInfo(verifyRes, true)
          }
        }
        // threshold = threshold - 50;
        // if(threshold > 300){
        //   verifyDoc(threshold);
        // }
        else {
          message.error('Verify failed')
          setLoading(false)
          setIsProgress(false)
          setIsSuccess(2);
        }
      })
  }

  const Capture = () => {
    // setTimeout(() => {
    message.info('Verifying')
    setLoading(true);
    setIsProgress(true);
    playRef.current.pause();
    let canvas = profileRef.current;
    let ctx = canvas.getContext('2d');
    const video = playRef.current;
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
    // verifyDoc(1000);
    verifyDoc(docInfo.threshold);
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
    let canvas = profileRef.current;
    let ctx = canvas.getContext('2d');
    let imageFile = e.target.files[0]; //here we get the image file
    var reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = function (e) {
      var myImage = new Image(); // Creates image object
      myImage.src = e.target.result; // Assigns converted image to image object
      myImage.onload = function (ev) {
        ctx.drawImage(myImage, 0, 0); // Draws the image on canvas
        verifyDoc(docInfo.threshold);
      }
    }
  }


  return (
    <Spin spinning={loading} delay={0} >
      <Typography style={{ padding: '30px 0', textAlign: 'center' }}>Take a photo of the frontside</Typography>
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
          <canvas ref={canvasRef} width={1000} height={500} style={{ position: 'fixed', left: 0, top: 0 }} className="hidden"></canvas>
          <canvas ref={profileRef} width={1000} height={500} style={{ position: 'fixed', left: 0 }} className="hidden"></canvas>
        </Col>
      </Row>
      <Row style={{ padding: 10 }} align="end">
        {/* <Button style={{ paddingRight: 20 }}>tets</Button> */}

        {isSuccess > 0 ? (
          isSuccess == 1 ? '' :
            <Button type="danger" onClick={Retry}>Retry</Button>
        ) : (<>
          <Button type="primary" onClick={Capture} className="hidden">Capture</Button>
          <input type="file" id="imageInput" accept="image/*" onChange={onChange} />
        </>
        )}
      </Row>
    </Spin >
  );
};

export default VerifyDoc;
