const { exec } = require('child_process');
//const forever = require('forever');

const restartController = (req,res,next) => {
    if(req.cookies["userData"]) {
        exec('', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
} else {
    res.sendStatus(403);
}};

module.exports = restartController;