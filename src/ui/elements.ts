export const body = <HTMLBodyElement> document.querySelector('body');

export const dynamicResizeContainer = <HTMLDivElement> document.getElementById('dynamic-resize-container');

export const canvasBack = <HTMLCanvasElement> document.getElementById('canvas-back');
export const ctxBack = canvasBack.getContext('2d');

export const canvasScaled = <HTMLCanvasElement> document.getElementById('canvas-scaled');
export const ctxScaled = canvasScaled.getContext('2d');

export const narrationContainer = document.getElementById('narration-container');
