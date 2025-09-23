import "react"
import { SignedIn, SignedOut, SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function AuthenticationPage() {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();

    useEffect(() => {
        if (isSignedIn) {
            // Redirect to dashboard if user is signed in
            navigate("/dashboard", { replace: true });
        }
    }, [isSignedIn, navigate]);
    return <div className="auth-container">
        <SignedOut>
            <SignIn routing="path" path="/sign-in" />
            <SignUp routing="path" path="/sign-up" />

        </SignedOut>
        <SignedIn>
            <div className="redirect-message">
                <p>You are already signed in.</p>
            </div>

        </SignedIn>
    </div>
}