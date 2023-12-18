import generate from "generate-password";

export const generatePassword = async (lenght) => {
    var password = generate.generate({
        length: lenght,
        numbers: true
    })
    return password;
}

export const generateCode = async (lenght) => {
    var code = generate.generate({
        length: lenght,
        numbers: true,
        lowercase: false,
        uppercase: false,
    })
    return code;
}