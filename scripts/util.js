function linspace(start, stop, num) {
    const arr = [];
    const step = (stop - start) / (num - 1); // Calculate step size
    for (let i = 0; i < num; i++) {
        arr.push(start + (step * i));
    }
    return arr;
}