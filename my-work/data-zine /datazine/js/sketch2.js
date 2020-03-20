let gravity = 0;
let movers = [];
let size = 30;
let attractor = [];
let slider = [];

let poseNet=[];
let poses = [];
// let num;//num of video
let video = [];

let seekP=[];
let points = [];
let hintimg;
let p=[];

let hintshow = true;

// let num = 4;
// Available parts are:
// 0   nose
// 1	leftEye
// 2	rightEye
// 3	leftEar
// 4	rightEar
// 5	leftShoulder
// 6	rightShoulder
// 7	leftElbow
// 8	rightElbow
// 9	leftWrist
// 10	rightWrist
// 11	leftHip
// 12	rightHip
// 13	leftKnee
// 14	rightKnee
// 15	leftAnkle
// 16	rightAnkle


function getQueryString(num) {
  var reg = new RegExp("(^|&)" + num + "=([^&]*)(&|$)", "i");
  var r = decodeURI(window.location.search).substr(1).match(reg);
  if(r != null) return (r[2]);
  return null;
}

function setup() {

  let num=getQueryString('num');
  console.log(num);

  hintimg = loadImage('asset/hint.png');
  background(0);
  createCanvas(windowWidth,windowHeight);
  frameRate(30);

  video[0] = createCapture(VIDEO);

  for (let i= 1;i< num;i++){
    video[i] = createVideo('asset/'+i+'.mov',vidLoad);
  }

  for (let i= 0;i< num;i++){

    video[i].size();
    video[i].hide();

    //for posenet
    poseNet[i] = ml5.poseNet(video[i], modelReady);
  }

  //already loop through
  poseNet.forEach((pn, i) => {
    pn.on('pose', (results) => {
      poses[i] = results;
    });
  });

  if(num){
    for (let i = 0; i < size; i++) {
      movers[i] = new Mover(windowWidth/2,windowHeight/2,random(8,24));
    }
  }

}

function modelReady() {
  console.log("Model Ready!");
}

function keyPressed(){
  if(key == 'w'){
    num++;
  }
  else if (key == 'z'){
    num--;
    console.log(num);
  }
  else if (key == 'd'){
    hintshow = false;
  }
}
//
// function audLoad(i,b){
//
//   if (audio[i].isPlaying() && b==false){
//     audio[i].stop();
//   }else if (b==true){
//     audio[i].play();
//     console.log('play');
//   }
//
// }

function vidLoad(){
  for (let i = 0; i< video.length;i++){
    video[i].loop();
  }
}

function draw() {

  let a = map(mouseX,0,windowWidth,0,255);

  //for display img
  let l = video.length;
  if (l==1){
    tint(255, a);
    image(video[0], 0, 0,windowWidth/2,windowHeight/2);

  }
  else if(l==2){

    tint(255, a);
    image(video[0], 0, 0,windowWidth/2,windowHeight/2);
    image(video[1], windowWidth/2,windowHeight/2, windowWidth/2,windowHeight/2);

  }
  else if(l==3){

    tint(255, a);
    image(video[0], 0, 0,windowWidth/2,windowHeight/2);
    image(video[1], windowWidth/2,windowHeight/2, windowWidth/2,windowHeight/2);
    image(video[2], 0,windowHeight/2, windowWidth/2,windowHeight/2);

  }
  else {
    tint(255, a);
    image(video[0], 0, 0,windowWidth/2,windowHeight/2);
    image(video[1], windowWidth/2,windowHeight/2, windowWidth/2,windowHeight/2);
    image(video[2], 0,windowHeight/2, windowWidth/2,windowHeight/2);
    image(video[3], windowWidth/2,0, windowWidth/2,windowHeight/2);
  }
  background(0,0,0,95);

  if (hintshow){
    image(hintimg,windowWidth/2-140,windowHeight/2-110);
  }

  //movers and force
  for (let i = 0; i < movers.length; i++) {
    let m = movers[i];
    for(let a = 0; a<movers.length;a++){

      if(i!=a){
        m.checkCollision(movers[a]);
      }
    }

    m.update();
    m.display();
    if(key == 'a'){
      m.showlines = true;
    }
    if(key == 's'){
      m.showlines = false;
    }
    console.log(movers[i].showlines);
    for (let j=0; j<points.length; j++) {
      if(points[j]!=undefined){
      m.moveTo(points[j]);
      // console.log(p);
      // stroke(200,0,255);
      // noFill();
      // ellipse(p[j].x, p[j].y, 10, 10);
      // console.log(points);
    }
  }
    // console.log(seekP);

    for(let i = 0;i<seekP.length;i++){
      if(seekP[i]!=undefined){
        m.applyBehaviors(movers,seekP[i]);
      }
    }

  }

  drawKeypoints(poses);
  drawSkeleton(poses);
}

// Draw ellipses over the detected keypoints
function drawKeypoints(poses) {
  let x = [];
  let y = [];
  // let p = [];
//p p[0][o]pose.keypoint p01

  // console.log('drawKeypoints')
  for (let k = 0; k<poses.length;k++){

    if (poses[k] != undefined ) {
      // console.log(poses);
      for (let i = 0; i < poses[k].length; i++) {

        // p = poses[k][i].pose.keypoints;
        // let a = p[i].position.x
        // p[i].position.y
        // noStroke();
        //
        // fill(255, 0, 0);
        // ellipse(x[k], y[k], 10, 10);
        // console.log(p);
        for (let j=0; j< poses[k][i].pose.keypoints.length; j++) {

          let point = poses[k][i].pose.keypoints[j];
          let partname = point.part;
          let score = point.score;

          // console.log(point);
          // stroke(200,0,255);
          // noFill();
          // ellipse(x[k], y[k], 10, 10);

          let x0 = point.position.x;
          let y0 = point.position.y;
          // console.log(x0,y0);
          // console.log(k, poses[k]);

          if(k==0){
            x[0]=x0;
            y[0]=y0;
          }else if(k==1){
            x[1]=x0+windowWidth/2;
            y[1]=y0+windowHeight/2;
          }
          else if(k==2){
            x[2]=x0;
            y[2]=y0+windowHeight/2;
          }
          else if(k==3){
            x[3]=x0+windowWidth/2;
            y[3]=y0;
          }

          if (score > 0.1) {
            p[i] = points;
            // console.log(p[i]);

            // console.log(x);
          // console.log(points);
            // console.log(points[j]);
            // stroke(200,0,255);
            // noFill();
            // ellipse(x[k], y[k], 10, 10);
// for k i j do loopp[k][i][j] = createVector
//             points 1...j for one person

          } else {
            p[i] = 0;
            // points[j] = createVector(-1000,-1000); // move the point away
          }

          if (score > 0.1) {
            if (partname == "leftWrist" || partname == "rightWrist") {
              noStroke();

              fill(255, 0, 0);
              ellipse(x[k], y[k], 10, 10);

              seekP[k]=createVector(x[k], y[k]);
              points[k] = createVector(x[k],y[k]);

            }
            else if (partname == "leftEye" || partname == "rightEye"||partname == 'nose') {
              stroke(200);
              noFill();
              ellipse(x[k], y[k], 10, 10);
            }
          }
          // else{
          //   let offset = 200;
          //   seekP[k] = createVector(random(windowWidth/2-offset,windowWidth/2+offset),random(windowHeight/2-offset,windowHeight/2+offset));
          // }
        }
      }
    }
  }

}

function drawSkeleton(poses) {
  let x1=[];
  let x2=[];
  let y1=[];
  let y2=[];
  for (let k = 0; k<poses.length;k++){
    // console.log(poses);
    if (poses[k] != undefined ) {
      for (let i = 0; i < poses[k].length; i++) {
        for (let j=0; j< poses[k][i].skeleton.length; j++) {
          // console.log(poses[k][i].skeleton[j]);
          if (poses[k][i].skeleton[j][0].position != undefined & poses[k][i].skeleton[j][1].position != undefined){
            let p1 = poses[k][i].skeleton[j][0].position;
            let p2 = poses[k][i].skeleton[j][1].position;
            // console.log(p1,p2);


            let x0 = p1.x;
            let y0 = p1.y;
            let z0 = p2.x;
            let w0 = p2.y;

            if(k==0){
              push();
              translate(0,0);
            }else if(k==1){
              push();
              translate(windowWidth/2,windowHeight/2);

            }
            else if(k==2){
              push();
              translate(0,windowHeight/2);

            }
            else if(k==3){
              push();
              translate(windowWidth/2,0,);
            }
            colorMode(HSB);
            let c = color(k*70,(k+1)*20,60,0.8);
            stroke(c);

            strokeWeight(2);
            line(p1.x,p1.y,p2.x,p2.y);
            pop();

          }
        }
      }

    }
  }

}
