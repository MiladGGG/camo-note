class TextUtils {
    static isLetter(c : string) : boolean {
        return c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z';
    }

    static isNumber(c : string) : boolean {
        return c >= '0' && c <= '9';
    }
}

export default TextUtils;