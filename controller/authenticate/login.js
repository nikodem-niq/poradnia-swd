export const login = pin => {
    return [
        pin == process.env.PIN ||
        pin == process.env.PIN2 ||
        pin == process.env.PIN3 ||
        pin == process.env.PIN4 ||
        pin == process.env.PIN5 ||
        pin == process.env.PIN6 ||
        pin == process.env.PIN7 || 
        pin == process.env.PIN8 ||
        pin == process.env.PIN9
        ,pin
    ];
}