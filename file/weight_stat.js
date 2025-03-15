/**
 * 渲染图表
 */

/**
 * yyyy-MM-dd 日期线性插值
 * @param {[string, number][]} datas 
 * @returns {[string, number][]}
 */
function interpolate(datas) {
    // 1. 先按日期排序
    const sortedWeights = datas.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    // 2. 填充缺失的日期（线性插值）
    const filledWeights = [];
    for (let i = 0; i < sortedWeights.length - 1; i++) {
        filledWeights.push(sortedWeights[i]);
        let [date1, weight1] = sortedWeights[i];
        let [date2, weight2] = sortedWeights[i + 1];
        
        let currentDate = new Date(date1);
        let nextDate = new Date(date2);
        let daysDiff = Math.round((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        for (let j = 1; j < daysDiff; j++) {
            let interpolatedDate = new Date(currentDate);
            interpolatedDate.setDate(interpolatedDate.getDate() + j);
            let interpolatedWeight = weight1 + ((weight2 - weight1) * j / daysDiff);
            filledWeights.push([interpolatedDate.toISOString().split('T')[0], parseFloat(interpolatedWeight.toFixed(2))]);
        }
    }
    filledWeights.push(sortedWeights[sortedWeights.length - 1]);
    return filledWeights
}

/**
 * yyyy-MM-dd 日期七天滑动平均，会插值中间日期
 * @param {[string, number][]} datas 
 * @returns {[string, number][]}
 */
function calculateRollingAverage(datas) {
    // 1. 先按日期排序
    const sortedWeights = datas.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
    
    // 2. 填充缺失的日期（线性插值）
    const filledWeights = [];
    for (let i = 0; i < sortedWeights.length - 1; i++) {
        filledWeights.push(sortedWeights[i]);
        let [date1, weight1] = sortedWeights[i];
        let [date2, weight2] = sortedWeights[i + 1];
        
        let currentDate = new Date(date1);
        let nextDate = new Date(date2);
        let daysDiff = Math.round((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        for (let j = 1; j < daysDiff; j++) {
            let interpolatedDate = new Date(currentDate);
            interpolatedDate.setDate(interpolatedDate.getDate() + j);
            let interpolatedWeight = weight1 + ((weight2 - weight1) * j / daysDiff);
            filledWeights.push([interpolatedDate.toISOString().split('T')[0], parseFloat(interpolatedWeight.toFixed(2))]);
        }
    }
    filledWeights.push(sortedWeights[sortedWeights.length - 1]);
    
    // 3. 计算滑动平均值
    const result = [];
    for (let i = 0; i < filledWeights.length; i++) {
        // 取前 7 天的数据（包含当前天）
        const window = filledWeights.slice(Math.max(0, i - 6), i + 1);
        
        // 计算平均值
        const sum = window.reduce((acc, curr) => acc + curr[1], 0);
        const avg = sum / window.length;
        
        // 存入结果
        result.push([filledWeights[i][0], parseFloat(avg.toFixed(2))]);
    }
    
    return result;
}

