import dayjs from 'dayjs';

const zeroTime = new Date('0001-01-01T00:00:00Z');
export const diffDate = (time) => {
  if (!time) {
    return '';
  }
  const timestamp = new Date(time).getTime();
  if (timestamp === zeroTime.getTime()) {
    return '';
  }
  const refTimestamp = Date.now();
  let diffTimestamp = refTimestamp - timestamp;
  if (diffTimestamp <= 0) {
    // 兼容小米手机出现1s以内的负值情况
    diffTimestamp = 0;
  }
  const diffSeconds = Math.floor(diffTimestamp / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffSeconds / 3600);
  const diffDays = Math.floor(diffSeconds / 86400);
  if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
    return '刚刚';
  }
  if (diffDays === 0 && diffHours === 0) {
    return `${diffMinutes}分钟前`;
  }
  if (diffDays === 0) {
    return `${diffHours}小时前`;
  }
  if (diffDays === 1) {
    return '昨天';
  }
  if (diffDays === 2) {
    return '前天';
  }
  const strDate = dayjs(time).format('YYYY-MM-DD');
  if (strDate === '1-01-01') {
    return '';
  }
  return strDate;
};

export const timeIsZero = (time) => {
  const date = new Date(time);
  const timestamp = new Date(time).getTime();
  return timestamp === zeroTime.getTime() || date.getFullYear() <= 1;
};

export function isLive(time) {
  const now = new Date().getTime();
  const times = new Date(time).getTime();
  console.log(now - times);
  return now - times < 60 * 60 * 24 * 1000;
}

export function subDate(start, end) {
  const startTimestamp = new Date(start).getTime();
  const endTimestamp = new Date(end).getTime();
  if (endTimestamp === zeroTime.getTime()) {
    return '';
  }
  let diffTimestamp = endTimestamp - startTimestamp;
  if (diffTimestamp <= 0) {
    // 兼容小米手机出现1s以内的负值情况
    diffTimestamp = 0;
  }
  const diffSeconds = Math.floor(diffTimestamp / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffSeconds / 3600);
  const diffDays = Math.floor(diffSeconds / 86400);

  if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
    return `${diffSeconds || 1}秒`;
  }
  if (diffDays === 0 && diffHours === 0) {
    return `${diffMinutes}分钟`;
  }
  if (diffDays === 0) {
    return `${diffHours}小时`;
  }
  return `${diffDays}天`;
}

export function formatTime(time) {
  if (!time || timeIsZero(time)) {
    return '';
  }
  const date = new Date(time);
  if (date.getTime() === zeroTime.getTime()) {
    return '';
  }
  const year = date.getFullYear();
  // 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  // 拼接
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  // return year + "-" + month + "-" + day;
}

export function formatSimpleTime(time) {
  const date = new Date(time);
  if (date.getTime() === zeroTime.getTime()) {
    return '';
  }
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${month}月${day}日  ${hours}时${minutes}分`;
}
export function dateFormat(time) {
  const date = new Date(time);
  if (date.getTime() === zeroTime.getTime()) {
    return '';
  }
  const year = date.getFullYear();
  // 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  // 拼接
  // return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  return `${year}-${month}-${day}`;
}

export const nowTimeScope = () => {
  const hours = new Date().getHours();
  if (hours >= 0 && hours < 6) {
    return '凌晨';
  }
  if (hours >= 6 && hours < 8) {
    return '早上';
  }
  if (hours >= 8 && hours < 11) {
    return '上午';
  }
  if (hours >= 11 && hours < 13) {
    return '中午';
  }
  if (hours >= 13 && hours < 16) {
    return '下午';
  }
  if (hours >= 16 && hours < 19) {
    return '傍晚';
  }
  if (hours >= 19 && hours < 22) {
    return '晚上';
  }
  if (hours >= 22 && hours < 24) {
    return '深夜';
  }
  return '您';
};

export function secondToHms(value) {
  let theTime = parseInt(value, 10); // 秒
  let middle = 0; // 分
  let hour = 0; // 小时
  if (theTime >= 60) {
    middle = parseInt(String(theTime / 60), 10);
    theTime = parseInt(String(theTime % 60), 10);
    if (middle >= 60) {
      hour = parseInt(String(middle / 60), 10);
      middle = parseInt(String(middle % 60), 10);
    }
  }
  let result = `${parseInt(String(theTime), 10)}秒`;
  if (middle > 0) {
    result = `${parseInt(String(middle), 10)}分${result}`;
  }
  if (hour > 0) {
    result = `${parseInt(String(hour), 10)}小时${result}`;
  }
  return result;
}
