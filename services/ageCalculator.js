import moment from 'moment';

export const countAge = (inputData) => {

  let now = moment();
  let birthday = moment(inputData, "YYYY-MM-DD");

  let years = now.diff(birthday, "years");
  let months = now.diff(birthday, "months") % 12;

  return [years,months];

}