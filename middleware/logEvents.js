//console.log('NodeJs_tut04');
//NPM modules
const {format} = require('date-fns');
const { v4: uuid } = require('uuid');

// Javascript core modules
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');


const logEvent = async (message, logName) => {
  const dateTime = `${format(new Date(), 'MM/dd/yyyy\t hh:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  //console.log(logItem);
  try {
    if(!fs.existsSync(path.join(__dirname, '..', 'logs')))
    {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    // append will create a new file if it does not already exist.
    await fsPromises.appendFile(path.join(__dirname,'..', 'logs', logName), logItem);
  } catch (error) { 
    //console.log(error);
  }
   //console.log('hello');//
};
const logger = (req, res, next) => {
  logEvent(`${req.method}\t${req.headers.referer}\t${req.url}`, 'reqlog.txt');
  console.log(`${req.method} ${req.path}`);
  next();
}


module.exports = {logger, logEvent};
 
// console.log(format(new Date(), 'MM/dd/yyyy\thh:mm'));

// var today = new Date();
// console.log(uuid());

// // custom function to add am or pm and to adjust 0 to 12 and 13 thru 23 to 1 to 11
// function formatAMPM(date) {
//   var hours = date.getHours();
//   var minutes = date.getMinutes();
//   var ampm = hours >= 12 ? 'pm' : 'am';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? '0'+minutes : minutes;
//   var strTime = hours + ':' + minutes + ' ' + ampm;
//   return strTime;
// }
  
//   console.log(formatAMPM(today));
  
  