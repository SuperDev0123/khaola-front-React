import React, { useState, useRef, useEffect } from "react";
import { Spin, Typography, Button, List, Row, Col, Divider, message, Upload } from "antd";
import * as faceapi from 'face-api.js';
import moment from "moment";
import axios from "axios";
import qs from 'qs';
import { UploadOutlined } from "@ant-design/icons";
const arabicMonths = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

const verifyNation = (lines) => {
  let firstName, lastName, birthDate;
  let isStart = false;
  lines.forEach((line, i) => {
    if (!birthDate) {
      let temp = line.LineText;
      let date = temp.match(/[0-9][0-9][0-9][0-9]/);
      if (date && date > 1900 && date < 2100) {
        console.log(date)
        let textArr = line.LineText.split(' ')
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
        lastName = (lines[i - 2] && lines[i - 2].Words && lines[i - 2].Words[1] && lines[i - 2].Words[1].WordText)
        firstName = (lines[i - 3] && lines[i - 3].Words && lines[i - 3].Words[1] && lines[i - 3].Words[1].WordText)
      }
    }
  })
  return checkResult(firstName, lastName, birthDate)
}

const verifyDriving = (lines) => {
  console.log("driving")
  let firstName, lastName, birthDate;
  let isStart = false;
  lines.forEach((line, index) => {
    console.log(line)
    if (!birthDate) {
      let temp = line.LineText;
      let date = temp.match(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/);
      if (date && isStart) {
        birthDate = date[0];
        if(index > 2){
          lastName = extractName(lines[index - 2].LineText)
          firstName = extractName(lines[index - 3].LineText)
        }
      }
      if (date) isStart = true;
    }
  })
  console.log(firstName, lastName, birthDate)
  return checkResult(firstName, lastName, birthDate)
}

const verifyPassport = (lines) => {
  let firstName, lastName, birthDate;
  lines.forEach((line, index) => {
    if (!birthDate) {
      let temp = line.LineText;
      let date = temp.match(/[0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]/);
      if (date) {
        birthDate = date[0];
        if(index > 2){
          lastName = extractName(lines[index - 2].LineText)
          firstName = extractName(lines[index - 3].LineText)
        }
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
  return name.replace(/[^A-z]/g, '').toUpperCase();
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
    engine: 1,
    verify: verifyNation
  },
  driving: {
    title: 'Driving License',
    lang: 'eng',
    engine: 2,
    verify: verifyDriving
  },
  passport: {
    title: 'Passport',
    lang: 'eng',
    engine: 2,
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
  const testRef = useRef(null);

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
        facingMode,
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
    return new Promise(async (resolve, reject) => {
      const canvas = profileRef.current;
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify({
          'apikey': "PR858KYMYHCX",
          'filetype': "PNG, JPG",
          'base64Image': canvas.toDataURL(),
          'isOverlayRequired': true,
          'language': docInfo.lang,
          'scale': false,
          'detectOrientation': true,
          'OCREngine': docInfo.engine,
        }),
        url: 'https://apipro2.ocr.space/parse/image'
      };
      axios(options).then(async (res) => {
        console.log(res)
        if (res.data.IsErroredOnProcessing || res.data.ParsedResults.length == 0) {
          resolve({ isSuccess: false, messageText: 'Verify failed' })
          return
        }
        console.log(res.data.ParsedResults[0].TextOverlay.Lines)
        let verifyRes = docInfo.verify(res.data.ParsedResults[0].TextOverlay.Lines)
        if (verifyRes.isSuccess) {
          const option = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 });
          const singleResult = await faceapi
            .detectSingleFace(profileRef.current, option)
            .withFaceLandmarks()
            .withFaceDescriptor()

          if (singleResult) {
            setFaceDescriptor(singleResult.descriptor)
            setUserInfo(verifyRes, true)
            resolve({ isSuccess: true, messageText: 'Verify Success' })
          }
        }
        else {
          resolve({ isSuccess: false, messageText: 'Verify failed' })
        }
      })
    });
  }

  const Capture = async () => {
    // setTimeout(() => {
    message.info('Verifying')
    setLoading(true);
    setIsProgress(true);
    playRef.current.pause();
    let canvas = profileRef.current;
    let ctx = canvas.getContext('2d');
    const video = playRef.current;
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
    let { isSuccess, messageText } = await verifyDoc(docInfo.threshold);
    if (isSuccess) message.success(messageText)
    if (!isSuccess) message.error(messageText)
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
    let canvas = profileRef.current;
    let ctx = canvas.getContext('2d');
    let imageFile = e.target.files[0]; //here we get the image file
    var reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = function (e) {
      var myImage = new Image(); // Creates image object
      myImage.src = e.target.result; // Assigns converted image to image object
      myImage.onload = async function (ev) {
        let angle = myImage.width < myImage.height ? 90 : 0;
        if (angle > 0) {
          ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
          ctx.rotate(90 * Math.PI / 180)
          ctx.translate(-canvas.height * 0.5, -canvas.width * 0.5);
          ctx.drawImage(myImage, 0, 0, canvas.height, canvas.width); // Draws the image on 
          ctx.restore();
        }
        else {
          ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height); // Draws the image on 
        }
        let { isSuccess, messageText } = await verifyDoc(docInfo.threshold);
        if (!isSuccess) {
          if (angle > 0) {
            ctx.translate(canvas.height * 0.5, canvas.width * 0.5);
            ctx.rotate(180 * Math.PI / 180)
            ctx.translate(-canvas.height * 0.5, -canvas.width * 0.5);
            ctx.drawImage(myImage, 0, 0, canvas.height, canvas.width); // Draws the image on 
          }
          else {
            ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
            ctx.rotate(180 * Math.PI / 180)
            ctx.translate(-canvas.height * 0.5, -canvas.width * 0.5);
            ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height); // Draws the image on 
          }
          ctx.restore();
          const result = await verifyDoc(docInfo.threshold);
          console.log(result)
          isSuccess = result.isSuccess;
          messageText = result.messageText;
        }
        if (isSuccess) message.success(messageText)
        if (!isSuccess) message.error(messageText)
        setLoading(false)
        setIsProgress(false)
        setIsSuccess(isSuccess ? 1 : 2);
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
          <canvas ref={profileRef} width={1000} height={500} style={{ position: 'fixed', left: 0, top: 0 }} className="hidden"></canvas>
        </Col>
      </Row>
      <Row style={{ padding: 10 }} align="end">
        {/* <Button style={{ paddingRight: 20 }}>tets</Button> */}

        {isSuccess > 0 ? (
          isSuccess == 1 ? '' :
            <Button type="danger" onClick={Retry}>Retry</Button>
        ) : (<>
          <input name="image" type="file" id="imageInput" accept="image/*" onChange={onChange} ref={testRef} />
          <Button type="primary" onClick={Capture}>Capture</Button>
        </>
        )}
      </Row>
    </Spin >
  );
};

export default VerifyDoc;
