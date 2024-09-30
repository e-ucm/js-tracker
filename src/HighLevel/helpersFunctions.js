export function setAsUri(id, defaultValue="mygame") {
    if(isUri(id)) {
        return id;
    } else {
        return `${defaultValue}://${id}`;
    }
}

export function isUri(id) {
    const pattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/i;
    return pattern.test(id);
}

/* 
var customUri = "connectado://test";
if(isUri(customUri)) {
    console.log(`${customUri} is a valid URI`);
} else {
    console.log(`${customUri} is not a valid URI`);
}
console.log(setAsUri("id","connectado"));
console.log(setAsUri("https://test","connectado"));
console.log(setAsUri("id"));
*/