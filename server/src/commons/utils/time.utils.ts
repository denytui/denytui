import moment from 'moment';

export const formatTime = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm');
};

export const getTimeDiff = (time: string | Date): string => {
  let result = '';
  const diff = moment().diff(time, 'minutes');
  if (diff < 60) result = diff + 'minutes ago';
  else if (diff > 60 && diff < 24 * 60)
    result = Math.round(diff / 60) + 'h ago';
  else result = Math.round(diff / 60 / 24) + 'days ago';

  return result;
};
