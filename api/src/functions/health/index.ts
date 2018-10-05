// environment glue
module.exports = function (context: any, req: any): any {
    const timeStamp = new Date().toISOString();
    
    context.log('Azure Health Check function is running at -- ', timeStamp);  
    
    context.res = {
        status: 200,
        body: `Health Check ran at ${timeStamp}`,
    };

    context.done();
};