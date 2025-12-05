class TextUtils {
    static isLetter(c : string) : boolean {
        return c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z';
    }

    static isNumber(str : string) : boolean {
        for (let c of str){
            if (!(c >= '0' && c <= '9')){
                return false;
            }
        }
        return true;
    }
}

export default TextUtils;