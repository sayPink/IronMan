import day from 'dayjs'

export const dataFormat = (value, formats = 'YYYY-MM-DD HH:mm') => {
    return day(Number(value)).format(formats)
}