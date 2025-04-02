/**
 * 日期工具函数集合
 * 功能：
 * - 格式化日期显示
 * - 检查日期是否过期
 * - 格式化时间显示
 * 
 * 函数说明：
 * 1. formatDate(dateStr)
 *    - 将日期字符串格式化为用户友好的显示格式
 *    - 参数：dateStr - 日期字符串
 *    - 返回：格式化后的日期字符串
 * 
 * 2. isPastDate(dateStr)
 *    - 检查日期字符串是否表示过去的日期
 *    - 参数：dateStr - 日期字符串
 *    - 返回：布尔值，true表示过去的日期
 * 
 * 3. formatTime(datetime)
 *    - 将日期时间字符串格式化为时间字符串
 *    - 参数：datetime - 日期时间字符串
 *    - 返回：格式化后的时间字符串
 */

/**
 * 格式化日期显示
 * @param {string} dateStr - 日期字符串
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // 如果是今天
  if (date.toDateString() === today.toDateString()) {
    return '今日'
  }
  // 如果是明天
  if (date.toDateString() === tomorrow.toDateString()) {
    return '明日'
  }

  // 其他日期
  return date.toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

/**
 * 检查日期是否过期
 * @param {string} dateStr - 日期字符串
 * @returns {boolean} 是否过期
 */
export const isPastDate = (dateStr) => {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

/**
 * 格式化时间显示
 * @param {string} datetime - 日期时间字符串
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (datetime) => {
  return new Date(datetime).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  })
} 