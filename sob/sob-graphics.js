
const sobGraphicsCanvasResize = (canvas, width, height) => {
    canvas.width = width;
    canvas.height = height;
};

const sobGraphicsCanvasUseImageBuffer = (canvas, callback = undefined) => {
    const canvasCtx = canvas.getContext("2d");
    const imageData = canvasCtx.createImageData(canvas.width, canvas.height);
    if (callback != undefined) {
        callback(imageData);
    }
    canvasCtx.putImageData(imageData, 0, 0);
};