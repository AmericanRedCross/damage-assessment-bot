module.exports = async function (context:any, myTimer:any) {
    const timeStamp = new Date().toISOString();
    
    if(myTimer.isPastDue)
    {
        context.log('Azure Keep Alive function is running late!');
    }
    context.log('Azure Keep Alive function is running late!', timeStamp);   
};