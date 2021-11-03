
export function randomNumberInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function convertRange(value: number, from1: number, from2: number, to1: number, to2: number): number {
    return (value - from1)
        * (to2 - to1)
        / (from2 - from1)
        + to1;
}
