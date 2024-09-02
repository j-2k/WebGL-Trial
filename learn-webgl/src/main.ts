import helloWorld from "./hello";
helloWorld();

//Placing title before canvas
// Select the canvas element
const canvas = document.getElementById('webglCanvas') as HTMLCanvasElement;

// Get the 2D context from the canvas
const context = canvas.getContext('2d');

if (context) {
    context.fillStyle = '#BF00FF';
    context.fillRect(0, 0, canvas.width, canvas.height);
} else {
    console.error('Canvas 2D context is not available.');
}

// Create a new text element (e.g., a paragraph)
let message: string = "Hello WebGL! 🎨";
const textElement = document.createElement('h1');
textElement.textContent = message;

// Insert the text element before the canvas
document.body.insertBefore(textElement, canvas);


message = 'Running main.ts...';
const titleElement = document.createElement('h1');
titleElement.textContent = message;
document.body.appendChild(titleElement);

const bodyMessages = [
    'This is mainly a learning project, I hope you enjoy it!'
];

bodyMessages.forEach(msg => {
    const paragraphElement = document.createElement('p');
    paragraphElement.textContent = msg;
    document.body.appendChild(paragraphElement);
});

