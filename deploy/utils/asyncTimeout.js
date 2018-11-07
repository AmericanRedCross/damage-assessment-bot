module.exports = async function asyncTimeout(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}