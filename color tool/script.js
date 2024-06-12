document.addEventListener("DOMContentLoaded", function() {
    const imageInput = document.getElementById("imageInput");
    const sourceImage = document.getElementById("sourceImage");
    const colorPalette = document.getElementById("colorPalette");

    // Function to extract colors
    function extractColors(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            sourceImage.src = e.target.result;
            sourceImage.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = sourceImage.width;
                canvas.height = sourceImage.height;
                ctx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

                // Extract colors from the image data
                const colors = {};
                for (let i = 0; i < imageData.length; i += 4) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];
                    const a = imageData[i + 3];

                    // Ignore fully transparent pixels
                    if (a !== 0) {
                        const rgb = `${r},${g},${b}`;
                        if (!colors[rgb]) {
                            colors[rgb] = 0;
                        }
                        colors[rgb]++;
                    }
                }

                // Sort colors by frequency
                const sortedColors = Object.entries(colors).sort((a, b) => b[1] - a[1]);

                // Display the color palette
                colorPalette.innerHTML = sortedColors.map(color => {
                    return `<div class="colorBox" style="background-color: rgb(${color[0]});"></div>`;
                }).join('');
            };
        };

        reader.readAsDataURL(file);
    }

    // Event listener for image input change
    imageInput.addEventListener('change', extractColors);
});
