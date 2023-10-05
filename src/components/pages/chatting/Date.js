export function getDate(){
    let date = new Date();
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month >= 10 ? month : '0' + month
    let day = date.getDate()
    day = day >= 10 ? day : '0' + day
    let hour = date.getHours()
    hour = hour >= 10 ? hour : '0' + hour
    let min = date.getMinutes()
    min=min>=10?min:'0'+min
    let sec = date.getSeconds()
    sec = sec >= 10 ? sec : '0' + sec
    
    let now = year + month + day + hour + min + sec;
    console.log("now",now);
    return now;
}