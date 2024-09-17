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
        { label: 'FOV Radians', id: 'RangeFOV' },
        { label: 'Translation X', id: 'RangeTX' },
        { label: 'Translation Y', id: 'RangeTY' },
        { label: 'Translation Z', id: 'RangeTZ' },
        { label: 'Rotation X', id: 'RangeRX' },
        { label: 'Rotation Y', id: 'RangeRY' },
        { label: 'Rotation Z', id: 'RangeRZ' },
        { label: 'Scale', id: 'RangeS' },
        { label: 'LookAt Angle', id: 'RangeC' }
    ];

    controlsData.forEach(control => {
        const p = document.createElement('p');
        p.textContent = control.label;
        controls.appendChild(p);

        const input = document.createElement('input');
        input.type = 'range';
        input.min = '-400';
        input.max = '400';
        input.value = '0';
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