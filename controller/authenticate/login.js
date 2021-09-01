const login = pin => {
    return [pin == process.env.PIN || pin == process.env.PIN2 || pin == process.env.PIN3, pin];
}



module.exports=login;