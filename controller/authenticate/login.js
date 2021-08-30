const login = pin => {
    return pin == process.env.PIN;
}

module.exports=login;