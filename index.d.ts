interface Window {
    app: any;
}

declare module "*.png" {
    const content: any;
    export default content;
}

declare module "*.obj" {
    const content: any;
    export default content;
}
