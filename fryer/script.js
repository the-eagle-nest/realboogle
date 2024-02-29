const imageUpload = document.getElementById('imageUpload');
const fryLevel = document.getElementById('fryLevel');
const fryButton = document.getElementById('fryButton');
const friedImage = document.getElementById('friedImage');
const downloadLink = document.getElementById('downloadLink');
const result = document.getElementById('result');
const fileInput = document.getElementById('imageUpload');
const browseButton = document.querySelector('.btn-primary'); // Assuming your button has this class

browseButton.addEventListener('click', () => fileInput.click());


fryButton.addEventListener('click', () => {
    const file = imageUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            processImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

function processImage(imageData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        applyFilters(ctx, canvas.width, canvas.height);

        friedImage.src = canvas.toDataURL('image/jpeg', 0.5); // Adjust JPEG quality here
        downloadLink.href = friedImage.src;
        result.style.display = 'block';
    }
    img.src = imageData;
}



function applyFilters(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const fryIntensity = {
        fried: 12, 
        overfried: 20, 
        burnt: 30
    }; 
    const intensity = fryIntensity[fryLevel.value];

    // Contrast and Color Reduction
    for (let i = 0; i < data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            // Aggressive contrast boost
            data[i + j] = 255 / (1 + Math.exp(-intensity * (data[i + j] / 255 - 0.5)));

            // Color reduction (posterization-like)
            let posterizeLevels = fryLevel.value === 'burnt' ? 16 : 32; 
            data[i + j] = Math.floor(data[i + j] / (256 / posterizeLevels)) * (256 / posterizeLevels); 
        }
    }
    const brightnessFactor = {
        fried: 0.95,   // Slight dimming
        overfried: 0.8, // More dimming
        burnt: 0.65     // Significant dimming
    };  
    const factor = brightnessFactor[fryLevel.value];

    for (let i = 0; i < data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            data[i + j] *= factor;  // Multiply each color channel
        }
    }
    function applyDistortion(imageData, intensity) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
    
        const waveAmplitude = intensity === 'overfried' ? 10 : 20; // Higher amplitude for more distortion
        const waveFrequency = 1;
    
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
}

