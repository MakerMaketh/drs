import SpinWheel from "./icons/spinWheel";

export default function SplashScreen() {
    return (
        <div>
            <div
                className="flex fixed inset-0 items-center justify-center bg-cover bg-center"
            >
                <SpinWheel className="h-16 w-16 animate-spin" />
            </div>
        </div>
    );
}
