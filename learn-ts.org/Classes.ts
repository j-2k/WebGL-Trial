class Animal {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    speak(): void {
        console.log(`${this.name} makes a noise.`);
    }
}

class Dog extends Animal {
    // Your code to override the speak method goes here
    speak(): void {
        console.log(`${this.name} bork!`);
    }
}
const myDog: Dog = new Dog("Rex");
myDog.speak();

//tsc classes.ts && node classes.js