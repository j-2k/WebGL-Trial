function StartMessages(canvasId: string): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
        console.error(`Canvas with id '${canvasId}' not found`);
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
    return;
}

export {
    StartMessages,
}