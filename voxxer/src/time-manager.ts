class Time {
    // Static properties
    static before: number = 0;
    static now: number = 0;
    static deltaTime: number = Time.now - Time.before;
    static time: number = 0;

    // Static methods
    static CalculateTimeVariables(): void {
        // Update the current time in seconds
        Time.now = performance.now() * 0.001;
        
        // Calculate the time difference between now and before
        Time.deltaTime = Time.now - Time.before;
        
        // Accumulate the total elapsed time
        Time.time = Time.time + Time.deltaTime;
        
        // Update before time to the current time for the next cycle
        Time.before = Time.now;
    }

    // Instance method Example for static classes
    instanceMethod(): void {
        console.log(Time.CalculateTimeVariables()); // Accessing static property
        Time.CalculateTimeVariables(); // Calling static method
    }
}

export {
    Time
}