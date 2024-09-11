function StartMessages(canvasId: string): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
        console.error(`Canvas with id '${canvasId}' not found`);
        return;
    }

    // Create a new text element (e.g., a paragraph)
    let message: string = "Hello WebGL! 🎨";
    const textElement = document.createElement('h1');
    textElement.textContent = message;

    // Insert the text element before the canvas
    document.body.insertBefore(textElement, canvas);


    message = 'github.com/j-2k/WebGL-Trial';
    const titleElement = document.createElement('h1');
    titleElement.textContent = message;
    //titleElement.href = 'https://github.com/j-2k/WebGL-Trial';
    //titleElement.target = '_blank';
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

function CreateControlsMenu(canvasId: string): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
        console.error(`Canvas with id '${canvasId}' not found`);
        return;
    }

    const controls = document.createElement('div');
    controls.id = 'controls';

    const controlsData = [
        { label: 'Translation', id: 'RangeT' },
        { label: 'Rotation', id: 'RangeR' },
        { label: 'Scale', id: 'RangeS' },
        { label: 'Color', id: 'RangeC' },
        { label: 'X', id: 'RangeX' }
    ];

    controlsData.forEach(control => {
        const p = document.createElement('p');
        p.textContent = control.label;
        controls.appendChild(p);

        const input = document.createElement('input');
        input.type = 'range';
        input.min = '1';
        input.max = '100';
        input.value = '50';
        input.className = 'slider';
        input.id = control.id;
        controls.appendChild(input);
    });

    document.body.insertBefore(controls, canvas);
}

export {
    StartMessages,
    CreateControlsMenu
}