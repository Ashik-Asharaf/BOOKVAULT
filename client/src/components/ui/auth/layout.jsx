const { Outlet } = require("react-router-dom");



function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full">
            <div className="hidden lg:flex items-center j
             bg-black w-1/2 px-12">
                <div className="max-w-md space-y-6  text-primary-foreground">
                    <h1 className="text-4xl  front-extrabold tracking-tight">
                        Welcome To BookVault
                    </h1>
                </div>
            </div>
            <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                <Outlet/>
            </div>
        </div>
    )
}