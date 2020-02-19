// console.log('hello');
var bspace = document.getElementById('bspace');
var txt = document.getElementById("txt");

document.getElementById('btn').addEventListener('click', makeblob);
document.getElementById('sp-btn').addEventListener('click', surprise);

function remove(){
  let currentLength = bspace.childNodes.length;
   for (let i = 0; i < currentLength; i++) {
       bspace.childNodes[0].remove();
   }
}

function makeblob(){
  remove();
  num = txt.value;
  for (let i = 0; i < num; i++) {
  let blob = document.createElement("div");
  blob.setAttribute('class','blob');
  bspace.appendChild(blob);
}
}

function surprise(){
  remove();
  num = txt.value;

  for (let i = 0; i < num; i++) {
  let cblob = document.createElement("div");
  randint = Math.floor(Math.random()*18+10);
  randC = Math.floor(Math.random()*100);
  console.log(randint);
  cblob.className = 'cblob';
  cblob.style.width = randint + 'px';
  cblob.style.height = randint + 'px';
  cblob.style.margin = '5px';
  cblob.style.borderRadius = '5px';
  cblob.style.backgroundColor = 'hsl(0,100%,'+randC+'%)';
  bspace.appendChild(cblob);
  // console.log(cblob);
}
}
