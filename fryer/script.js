const imageUpload=document.getElementById("imageUpload"),fryLevel=document.getElementById("fryLevel"),fryButton=document.getElementById("fryButton"),friedImage=document.getElementById("friedImage"),downloadLink=document.getElementById("downloadLink"),result=document.getElementById("result"),fileInput=document.getElementById("imageUpload"),isSafari=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);if(isSafari){let e=document.getElementById("result");e.innerHTML="<h2>Safari is not fully supported yet.</h2> <p>Please use a desktop browser or try Chrome, Firefox, or Edge for the best experience.</p>",e.style.display="block"}const browseButton=document.querySelector(".btn-primary");function processImage(e,t){console.log("Entered processImage");let l=document.createElement("canvas"),o=l.getContext("2d"),r=new Image;r.onload=()=>{l.width=r.width,l.height=r.height,o.drawImage(r,0,0);let e=t.split("."),a=e.pop(),n=`${e.join(".")}_${fryLevel.value}.${a}`;setTimeout(()=>{friedImage.src=l.toDataURL("image/jpeg",.5),downloadLink.href=friedImage.src,downloadLink.download=n,result.style.display="block",console.log(friedImage.src)},200),applyFilters(o,l.width,l.height),updateProgressBar(100)},r.src=e}function applyFilters(e,t,l){console.log("Entered applyFilters");let o=e.getImageData(0,0,t,l),r=o.data,a={fried:10,overfried:20,burnt:145,"caught-on-fire":300}[fryLevel.value];for(let n=0;n<r.length;n+=4)for(let i=0;i<3;i++){r[n+i]=255/(1+Math.exp(-a*(r[n+i]/255-.5)));let d="burnt"===fryLevel.value?16:"caught-on-fire"===fryLevel.value?8:32;r[n+i]=Math.floor(r[n+i]/(256/d))*(256/d)}let f={fried:.97,overfried:.96,burnt:.95,"caught-on-fire":.94}[fryLevel.value];for(let $=0;$<r.length;$+=4)for(let s=0;s<3;s++)r[$+s]*=f;function g(e,t){let l=e.data,o=e.width,r=e.height,a="overfried"===t?175:340;for(let n=0;n<r;n++)for(let i=0;i<o;i++){let d=a*Math.sin(100*n),f=a*Math.sin(2*i*100),$=Math.floor(i+d),s=Math.floor(n+f);if($>=0&&$<o&&s>=0&&s<r){let g=(n*o+i)*4,u=(s*o+$)*4;for(let c=0;c<4;c++)l[g+c]=l[u+c]}}}e.putImageData(o,0,0)}function addNoise(e,t){let l=e.data;for(let o=0;o<l.length;o+=4)for(let r=0;r<3;r++){let a=(Math.random()-.5)*128*t;l[o+r]=Math.min(255,Math.max(0,l[o+r]+a))}ctx.putImageData(e,0,0)}function compressImage(e,t,l,o){for(let r=0;r<l;r+=o)for(let a=0;a<t;a+=o)compressBlock(e,t,a,r,o)}function compressBlock(e,t,l,o,r){let a=0,n=0,i=0,d=0;for(let f=0;f<r;f++)for(let $=0;$<r;$++){let s=(t*(o+f)+(l+$))*4;a+=e[s],n+=e[s+1],i+=e[s+2],d++}a=Math.floor(a/d),n=Math.floor(n/d),i=Math.floor(i/d);for(let g=0;g<r;g++)for(let u=0;u<r;u++){let c=(t*(o+g)+(l+u))*4;e[c]=a,e[c+1]=n,e[c+2]=i}if("burnt"===fryLevel.value||"caught-on-fire"===fryLevel.value){let m="caught-on-fire"===fryLevel.value?50:35;addNoise(imageData,m)}ctx.putImageData(imageData,0,0)}function addNoise(e,t){let l=e.data;for(let o=0;o<l.length;o+=4)for(let r=0;r<3;r++){let a=(Math.random()-.5)*128*t;l[o+r]=Math.min(255,Math.max(0,l[o+r]+a))}ctx.putImageData(e,0,0)}browseButton.addEventListener("click",()=>fileInput.click()),fryButton.addEventListener("click",()=>{console.log("Fry button clicked");let e=imageUpload.files[0];if(e){console.log("File selected");let t=new FileReader;t.onload=function(t){let l=t.target.result;o(),processImage(l,e.name)},t.readAsDataURL(e)}function l(e){let t=document.getElementById("loading-bar"),l=parseInt(t.style.width,10)||0;l+=e,l=Math.min(l,100),t.style.width=`${l}%`,100===l&&r()}function o(){document.getElementById("loading-container").style.display="block"}function r(){document.getElementById("loading-container").style.display="none"}});