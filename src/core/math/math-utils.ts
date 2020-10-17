

export default class MathUtils {

    public static getInterpValue2(v1:number, v2:number,  a:number, b:number) {
        return v1*a + v2*b
    }

    public static getInterpValue3(v1:number, v2:number, v3:number,  a:number, b:number, c:number) {
        return v1*a + v2*b + v3*c
    }

    public static getInterpValue4(v1:number, v2:number, v3:number, v4:number,  a:number, b:number, c:number, d:number) {
        return v1*a + v2*b + v3*c + v4*d
    }

    public static clamp(value:number, min:number, max:number) {
        if (value < min){
            return min
        }
        if (value > max){
            return max
        }
        return value
    }

    public static saturate(value:number){
        return MathUtils.clamp(value, 0, 1)
    }
}

