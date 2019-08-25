
const success = (string, data, code = 1) => {
  return {
    code,
    msg: string,
    data
  }
};

const error = (string, code = 0) => {
  return {
    code,
    msg: string,
  }
}

// 时间蹉
const timestampToTime = (timestamp) => {
  return new Date(parseInt(timestamp)).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

module.exports = {
  error,
  success,
  timestampToTime
}