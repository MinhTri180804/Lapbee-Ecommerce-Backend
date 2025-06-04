type FormatTimeParams = {
  second: number;
};

export const formatTime = ({ second }: FormatTimeParams) => {
  const secondToMillisecond = second * 1000;
  const date = new Date(secondToMillisecond);
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh'
  });

  const formattedDate = formatter.format(date);
  return formattedDate;
};
