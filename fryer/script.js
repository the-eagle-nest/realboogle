const imageUpload = document.getElementById('imageUpload');
const fryLevel = document.getElementById('fryLevel');
const fryButton = document.getElementById('fryButton');
const friedImage = document.getElementById('friedImage');
const downloadLink = document.getElementById('downloadLink');
const result = document.getElementById('result');
const fileInput = document.getElementById('imageUpload');
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari) {
    const result = document.getElementById('result'); 
    result.innerHTML = `<h2>Safari is not fully supported yet.</h2> <p>Please use a desktop browser or try Chrome, Firefox, or Edge for the best experience.</p>`;
    result.style.display = 'block'; // Show the message
}



function processImage(imageData, filename) { // Add filename as a parameter
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        applyFilters(ctx, canvas.width, canvas.height);

        // Construct the new download filename
        const nameParts = filename.split('.');
        const fileExt = nameParts.pop(); 
        const newFilename = `${nameParts.join('.')}_${fryLevel.value}.${fileExt}`;
        setTimeout(() => {
            friedImage.src = canvas.toDataURL('image/jpeg', 0.5); 
            downloadLink.href = friedImage.src;
            downloadLink.download = newFilename; // Construct the new download filename (check this closely!)
            result.style.display = 'block';
            console.log(friedImage.src); 
        }, 2000); // A 2-second delay 
    }
    img.src = imageData;   
    img.onload = () => {
        // ... other actions within 'onload' ... 
        updateProgress(10); // Update after image load
    } 
}


const browseButton = document.querySelector('.btn-primary'); // Assuming your button has this class

browseButton.addEventListener('click', () => fileInput.click());

fryButton.addEventListener('click', () => {
  const file = imageUpload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      processImage(e.target.result, file.name); // Pass in the filename
    };
    reader.readAsDataURL(file);
    const loadingContainer = document.getElementById('loading-container');
    loadingContainer.style.display = 'block'; 

    const loadingBar = document.getElementById('loading-bar');
    let progress = 0; 

    // Update progress within each major image processing step 
    function updateProgress(increment) {
        progress += increment;
        progress = Math.min(progress, 100); // Ensure progress never exceeds 100
        loadingBar.style.width = `${progress}%`;
        
        if (progress === 100) { 
            loadingContainer.style.display = 'none'; // Hide at completion
        }
    }
  }
});


function applyFilters(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
  
    const fryIntensity = {
      fried: 10, 
      overfried: 20, 
      burnt: 145,
      "caught-on-fire": 300 // Double the intensity of 'burnt'
    }; 
    const intensity = fryIntensity[fryLevel.value];
  
    // Contrast and Color Reduction
    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        // Aggressive contrast boost
        data[i + j] = 255 / (1 + Math.exp(-intensity * (data[i + j] / 255 - 0.5)));
  
        // Color reduction (posterization-like)
        let posterizeLevels = fryLevel.value === 'burnt' ? 16 : (fryLevel.value === 'caught-on-fire' ? 8 : 32); 
        data[i + j] = Math.floor(data[i + j] / (256 / posterizeLevels)) * (256 / posterizeLevels); 
      }
    updateProgress(20);
    }
  
    const brightnessFactor = {
      fried: 0.97, 
      overfried: 0.96,
      burnt: 0.95,  
      "caught-on-fire": 0.94 // Even darker
    }; 
    const factor = brightnessFactor[fryLevel.value];
  
    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        data[i + j] *= factor; 
      }
    }
  
    function applyDistortion(imageData, intensity) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
    
        const waveAmplitude = intensity === 'overfried' ? 175 : 340; // Higher amplitude for more distortion
        const waveFrequency = 100;
    
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const offsetX = waveAmplitude * Math.sin(y * waveFrequency); 
                const offsetY = waveAmplitude * Math.sin(2 * x * waveFrequency);
    
                // Calculate the distorted source pixel
                const sourceX = Math.floor(x + offsetX);
                const sourceY = Math.floor(y + offsetY);
    
                // Ensure the source pixel is within image bounds
                if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
                    const targetIndex = (y * width + x) * 4;
                    const sourceIndex = (sourceY * width + sourceX) * 4;
    
                    // Copy pixel data from the distorted source 
                    for (let i = 0; i < 4; i++) {
                        data[targetIndex + i] = data[sourceIndex + i];
                    }
                }
            }
        }
    updateProgress(30);
    }

    ctx.putImageData(imageData, 0, 0); 
}

function addNoise(imageData, intensity) {
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        for (let j = 0; j < 3; j++) { // For each color channel
            const noiseValue = (Math.random() - 0.5) * 128 * intensity; 
            data[i + j] = Math.min(255, Math.max(0, data[i + j] + noiseValue));  // Clamp to 0-255
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function compressImage(data, width, height, blockSize) {
    for (let y = 0; y < height; y += blockSize) {
        for (let x = 0; x < width; x += blockSize) {
            compressBlock(data, width, x, y, blockSize);
        }
    }
}

function compressBlock(data, width, x, y, blockSize) {
    let avgR = 0, avgG = 0, avgB = 0;
    let count = 0;

    for (let by = 0; by < blockSize; by++) {
        for (let bx = 0; bx < blockSize; bx++) {
            let index = (width * (y + by) + (x + bx)) * 4;
            avgR += data[index];
            avgG += data[index + 1];
            avgB += data[index + 2];
            count++;
        }
    }

    avgR = Math.floor(avgR / count);
    avgG = Math.floor(avgG / count);
    avgB = Math.floor(avgB / count);

    // Fill the block with average color
    for (let by = 0; by < blockSize; by++) {
        for (let bx = 0; bx < blockSize; bx++) {
            let index = (width * (y + by) + (x + bx)) * 4;
            data[index] = avgR;
            data[index + 1] = avgG;
            data[index + 2] = avgB;
        }
    }
    
if (fryLevel.value === 'burnt' || fryLevel.value === 'caught-on-fire') {
    const noiseIntensity = fryLevel.value === 'caught-on-fire' ? 50 : 35; // More noise for 'caught-on-fire'
    addNoise(imageData, noiseIntensity);
  }

  ctx.putImageData(imageData, 0, 0); 
}

function addNoise(imageData, intensity) {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) { // For each color channel
      const noiseValue = (Math.random() - 0.5) * 128 * intensity; 
      data[i + j] = Math.min(255, Math.max(0, data[i + j] + noiseValue));  
    }
  }
  updateProgress(20);
  ctx.putImageData(imageData, 0, 0);
}
