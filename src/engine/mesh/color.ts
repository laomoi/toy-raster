export interface Color {
    r:number,
    g:number,
    b:number,
    a:number
}

export class ColorEnums {
    public static BLACK:Color = {r:0, g:0, b:0, a:255}
    public static WHITE:Color = {r:255, g:255, b:255, a:255}
    public static RED:Color =  {r:255, g:0, b:0, a:255}
    public static BLUE:Color =  {r:0, g:0, b:255, a:255}
    public static GREEN:Color =  {r:0, g:255, b:0, a:255}
    public static ORANGE:Color =  {r:255, g:255, b:0, a:255}

    public static clone(color:Color):Color{
        return {r:color.r, g:color.g, b:color.b, a:color.a}
    }
}
