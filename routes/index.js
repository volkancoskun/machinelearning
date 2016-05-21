/* GET home page. */

var fs  = require("fs");


exports.index = function(req, res){
  var data = fs.readFileSync('../bayescore/routes/data.js');
  var testdata = fs.readFileSync('../bayescore/routes/testdata.js');
  var count = 0;
  var tehtit = [];
  var satir;
  var zayiflik = [];
  var riskihtimali = [];
  var risketkisi = [];
  var riskduzeyi = [];

  //-------------------------------------------- TRAIN ----------------------------------------------
  data = data.toString().split('\n');
  testdata = testdata.toString().split('\n');
  for(var i = 0; i<data.length;i++){
    satir = data[i].split(',');
    tehtit.push(satir[0]);
    zayiflik.push(satir[1]);
    riskihtimali.push(satir[2]);
    risketkisi.push(satir[3]);
    riskduzeyi.push(satir[4].toString());
  }

function sumArray(array){
  var sum=0;
  for(var i=0;i<array.length;i++){
    sum= sum+ array[i];
  }
  return sum;
}


  var yes = 0;
  var no = 0;
  for(var i = 0; i<riskduzeyi.length;i++){
    if(riskduzeyi[i] == 'Y\r' || riskduzeyi[i] == 'Y' ){yes++;}
    if(riskduzeyi[i] == 'A\r'  ){no++;}
  }

  //priskduzeyi
  var priskduzeyi =[];
  priskduzeyi.push(parseFloat(yes/600).toFixed(4));
  priskduzeyi.push(parseFloat(no/600).toFixed(4));



  //ptehtit
  var ptehtit = [];
  for(var i=0; i<2; i++) {
    ptehtit[i] = [];
    for(var j=0; j<=10; j++) {
      ptehtit[i][j] = 0;
    }
  }

  for(var k=0; k<tehtit.length; k++) {
    if(riskduzeyi[k] == 'Y\r' || riskduzeyi[k] == 'Y' ){
      ptehtit[0][tehtit[k]]++;
    }else{
      ptehtit[1][tehtit[k]]++;
    }
  }


  var toplam1 = 0;
  var toplam2 = 0;
  toplam1 = sumArray(ptehtit[0]);
  toplam2 = sumArray(ptehtit[1]);

  for(var l=1; l<11; l++) {
    if(toplam1 !=0){
    ptehtit[0][l] = parseFloat(ptehtit[0][l]/toplam1).toFixed(4);
    }else{
      ptehtit[0][l] = 0;
    }
    if(toplam2 !=0){
      ptehtit[1][l] = parseFloat(ptehtit[1][l]/toplam2).toFixed(4);
    }else{
      ptehtit[1][l] = 0;
    }
  }


  var pzayiflik =[];
  for(var i=0; i<2; i++) {
    pzayiflik[i] = [];
    for(var j=0; j<=10; j++) {
      pzayiflik[i][j] = [];
      for(var k=0;k<=10;k++){
        pzayiflik[i][j][k] =0;
      }
    }
  }
  for(var z= 0; z<zayiflik.length;z++){
    if(riskduzeyi[z] == 'Y\r' || riskduzeyi[z] == 'Y' ){
      pzayiflik[0][tehtit[z]][zayiflik[z]]++;
    }else{
      pzayiflik[1][tehtit[z]][zayiflik[z]]++;
    }
  }


  for(var i=0; i<2; i++) {
    for(var j=0; j<=10; j++) {
      var toplam = sumArray(pzayiflik[i][j]);
      for(var k=0;k<=10;k++){
        if(toplam !=0){
        pzayiflik[i][j][k]= (pzayiflik[i][j][k]/toplam).toFixed(4);
        }
      }
    }
  }


  var prisketkisi =[];
  for(var i=0; i<2; i++) {
    prisketkisi[i] = [];
    for(var j=0; j<=10; j++) {
      prisketkisi[i][j] = [];
      for(var k=0;k<=5;k++){
        prisketkisi[i][j][k] =0;
      }
    }
  }
  for(var z= 0; z<risketkisi.length;z++){
    if(riskduzeyi[z] == 'Y\r' || riskduzeyi[z] == 'Y' ){
      prisketkisi[0][zayiflik[z]][risketkisi[z]]++;
    }else{
      prisketkisi[1][zayiflik[z]][risketkisi[z]]++;
    }
  }

  for(var i=0; i<2; i++) {
    for(var j=0; j<=10; j++) {
      var toplam = sumArray(prisketkisi[i][j]);
      for(var k=0;k<=5;k++){
        if(toplam !=0){
          prisketkisi[i][j][k]= (prisketkisi[i][j][k]/toplam).toFixed(4);
        }
      }
    }
  }

  var priskihtimali =[];
  for(var i=0; i<2; i++) {
    priskihtimali[i] = [];
    for(var j=0; j<=5; j++) {
      priskihtimali[i][j] = [];
      for(var k=0;k<=5;k++){
        priskihtimali[i][j][k] =0;
      }
    }
  }
  for(var z= 0; z< riskihtimali.length;z++){
    if(riskduzeyi[z] == 'Y\r' || riskduzeyi[z] == 'Y' ){
      priskihtimali[0][risketkisi[z]][riskihtimali[z]]++;
    }else{
      priskihtimali[1][risketkisi[z]][riskihtimali[z]]++;
    }
  }

  for(var i=0; i<2; i++) {
    for(var j=0; j<=5; j++) {
      var toplam = sumArray(priskihtimali[i][j]);
      for(var k=0;k<=5;k++){
        if(toplam !=0){
          priskihtimali[i][j][k]= (priskihtimali[i][j][k]/toplam).toFixed(4);
        }
      }
    }
  }

  var predictClass = [];
  var tp = 0;
  var fp = 0;
  var tn = 0;
  var fn = 0;


  //-------------------------- TEST------------------------------------
    tehtit = [];
    satir="";
    zayiflik = [];
    riskihtimali = [];
    risketkisi = [];
    riskduzeyi = [];

  var alldata = [];
  for(var i = 0; i<testdata.length;i++){
    satir = testdata[i].split(',');
    alldata.push(satir);
    tehtit.push(satir[0]);
    zayiflik.push(satir[1]);
    riskihtimali.push(satir[2]);
    risketkisi.push(satir[3]);
    riskduzeyi.push(satir[4].toString());
  }


  function mainBayes(){
    var prob = [];
    for(var i=0;i<tehtit.length;i++){
     var a = priskduzeyi[0]*ptehtit[0][tehtit[i]]*pzayiflik[0][tehtit[i]][zayiflik[i]]*prisketkisi[0][zayiflik[i]][risketkisi[i]]*priskihtimali[0][risketkisi[i]][riskihtimali[i]];
     var b = priskduzeyi[1]*ptehtit[1][tehtit[i]]*pzayiflik[1][tehtit[i]][zayiflik[i]]*prisketkisi[1][zayiflik[i]][risketkisi[i]]*priskihtimali[1][risketkisi[i]][riskihtimali[i]];
      if((a/(a+b)).toFixed(4)<0.5){
        prob.push((1-a/(a+b)).toFixed(4));
      }else {
        prob.push((a/(a+b)).toFixed(4));
      }
      if((a/(a+b)).toFixed(4)>0.5){
        predictClass.push("Y");
        if(riskduzeyi[i] == 'Y\r' || riskduzeyi[i] == 'Y'){
          tp++;
        }else{
          fp++;
        }
      }else{
        predictClass.push("A");
        if(riskduzeyi[i] == 'Y\r' || riskduzeyi[i] == 'Y'){
          fn++;
        }else{
          tn++;
        }
      }
    }
    return prob;
  }

  var probability = mainBayes();

  var tprate = tp/(tp+fn);
  var tnrate = tn/(fp+tn);

  ptehtit[0].shift();
  ptehtit[1].shift();
  pzayiflik[0].shift();
  pzayiflik[1].shift();
  prisketkisi[0].shift();
  prisketkisi[0].pop();
  prisketkisi[1].shift();
  prisketkisi[1].pop();
  console.log(priskihtimali);
  priskihtimali[0].shift();
  priskihtimali[1].shift();
  res.render('index', { title: 'Express', alldata:alldata,priskduzeyi:priskduzeyi,ptehtit:ptehtit,pzayiflik:pzayiflik,prisketkisi:prisketkisi,priskihtimali:priskihtimali,tp:tp,tn:tn,fn:fn,fp:fp,tprate:(tprate).toFixed(4),tnrate:(tnrate).toFixed(4),acc:((tp+tn)/(tp+fp+tn+fn)).toFixed(4),predictClass:predictClass,probability:probability});

};
