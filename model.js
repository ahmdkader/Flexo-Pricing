export function calculate(w, edits={}, selected='auto') {
 const v=(s,a)=>edits[s+'.'+a]??w[s]?.[a]?.v??0;
 const j=r=>Number(v('JOB_INPUTS','B'+r)), m=r=>Number(v('MACHINE_COST','B'+r));
 const c=(a)=>Number(v('JOB_COSTING',a));
 const errors=[];
 for(const r of [6,7,9,10,14,22,24]) if(!(j(r)>0))errors.push('JOB_INPUTS.B'+r);
 if(j(35)<0||j(35)>=100)errors.push('JOB_INPUTS.B35');
 for(const r of [6,7,10,11,14,15,27])if(!(m(r)>0))errors.push('MACHINE_COST.B'+r);
 for(const r of [6,7,15])if(!Number.isInteger(j(r)))errors.push('JOB_INPUTS.B'+r);
 const across=Math.floor((j(22)-2*j(21))/(j(9)+j(11)));
 const options=Array.from({length:13},(_,i)=>{
  const teeth=Number(w.CYLINDER_SELECTOR['A'+(i+5)].v), repeat=teeth*3.175;
  const around=Math.floor(repeat/(j(10)+j(13))),gap=around>0?repeat/around-j(10):null;
  const compatible=around>=1&&gap+1e-9>=j(13);
  return {teeth,repeat,around,gap,compatible,score:compatible?gap*100+around*10+10:Infinity};
 });
 const best=options.filter(o=>o.compatible).sort((a,b)=>a.score-b.score)[0];
 const cylinder=selected==='auto'?best:options.find(o=>o.teeth===Number(selected)&&o.compatible);
 if(across<1)errors.push('width');if(!cylinder)errors.push('cylinder');
 const machine={};
 machine[30]=(m(4)-m(5))/(m(6)*m(7));machine[31]=(m(8)-m(9))/(m(10)*m(11));machine[32]=(m(12)-m(13))/(m(14)*m(15));
 machine[33]=machine[30]+machine[31]+machine[32];machine[34]=(m(19)+m(20)+m(21))*m(22);machine[35]=m(23)*m(24);machine[36]=m(25);machine[37]=m(37);machine[38]=[33,34,35,36,37].reduce((s,r)=>s+machine[r],0);machine[39]=machine[38]/(m(27)/100);
 if(errors.length)return {errors,options,best,cylinder,machine};
 const width=across*(j(9)+j(11))+2*j(21), b={},d={};
 b[4]=j(6);b[5]=across;b[6]=cylinder.around;b[7]=cylinder.gap;b[8]=across*cylinder.around;b[9]=cylinder.repeat;
 b[10]=b[4]/b[8]*b[9]/1000;b[11]=j(15)*j(23);b[12]=b[10]*j(25)/100;b[13]=b[10]+b[11]+b[12];b[14]=j(24);b[15]=Math.ceil(b[13]/b[14]);b[16]=width;b[17]=b[13]*width/1000;
 b[22]=b[13]/j(14);b[23]=c('B23');b[24]=(b[22]+b[23])/60;b[25]=b[13]/70/60;b[26]=c('B26');b[27]=b[24]+b[25]+b[26];
 b[31]=b[17]*j(30);b[32]=b[17]*j(33)*j(15);b[33]=b[27]*machine[39];b[34]=b[17]*j(31);b[35]=b[17]*j(32);b[36]=j(6)/j(7)*(j(9)+80)*Number(v('JOB_INPUTS','C27'))/1200;
 b[37]=35*j(6)/j(7)/5;b[38]=width*cylinder.repeat*j(15)*0.01;b[39]=j(34);
 d[4]=b[4]/2;d[5]=c('M5');d[6]=b[6];d[7]=c('M7');d[8]=d[5]*d[6];d[9]=b[9];d[10]=d[4]/d[8]*d[9]/1000;d[11]=b[11]*2;d[12]=c('M12');d[13]=d[10]+d[11]+d[12];d[14]=b[14];d[15]=Math.ceil(d[13]/d[14]);d[16]=width;d[17]=d[13]*width/1000;
 d[22]=d[13]/j(14);d[23]=c('M23');d[24]=(d[22]+d[23])/60;d[25]=d[13]/70/60;d[26]=c('M26');d[27]=d[24]+d[25]+d[26];d[31]=d[17]*j(30);d[32]=d[17]*j(33)*j(15);d[33]=d[27]*machine[39];d[34]=0;d[35]=0;d[36]=b[36];d[37]=c('M37');d[38]=0;d[39]=j(34);
 for(const a of [b,d]){a[40]=[31,32,33,34,35,36,37,38,39].reduce((s,r)=>s+a[r],0);a[41]=a[40]/a[4]*1000;a[42]=a[40]/a[4];a[43]=a[40]/(1-j(35)/100);a[44]=a[43]/a[4]*1000;a[45]=a[43]/a[4];a[46]=a[43]-a[40];}
 if(!(d[5]>0)||![...Object.values(b),...Object.values(d)].every(Number.isFinite))errors.push('double');
 return {errors,options,best,cylinder,machine,b,d,across,width};
}
