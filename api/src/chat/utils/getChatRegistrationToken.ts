
export function getRegistrationToken() {
    //TODO: validate if this is acceptable for multi-language app
    let charSet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let token = "";
    for (var i = 1; i <= 6; i++) {
        token += charSet[Math.floor(Math.random() * charSet.length)]
    }
    return token;
}