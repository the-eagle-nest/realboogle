const imageUpload = document.getElementById('imageUpload');
const fryLevel = document.getElementById('fryLevel');
const fryButton = document.getElementById('fryButton');
const friedImage = document.getElementById('friedImage');
const downloadLink = document.getElementById('downloadLink');
const result = document.getElementById('result');

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
    const data = imageData.data; // Easier to work with pixel data

    const fryIntensity = {
        fried: 0.4, 
        overfried: 0.8, 
        burnt: 1.2 
    }; 
    const intensity = fryIntensity[fryLevel.value];

    for (let i = 0; i < data.length; i += 4) { // Process R,G,B,A
        // Contrast boost - simple sigmoid-like curve
        for (let j = 0; j < 3; j++) {
            data[i + j] = 255 / (1 + Math.exp(-intensity * (data[i + j] / 255 - 0.5)));
        }
    }

    // Simulated JPEG compression for 'overfried' and 'burnt'
    if (fryLevel.value !== 'fried') {
        let blockSize = fryLevel.value === 'overfried' ? 16 : 8;
        compressImage(data, width, height, blockSize);
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

