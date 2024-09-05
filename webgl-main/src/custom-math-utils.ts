function RandomInt(minInclusive: number, maxInclusive: number) : number {
    return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
}

function RandomFloat(minInclusive: number, maxInclusive: number) : number {
    return Math.random() * (maxInclusive - minInclusive) + minInclusive;
}

export {
    RandomFloat,
    RandomInt
}