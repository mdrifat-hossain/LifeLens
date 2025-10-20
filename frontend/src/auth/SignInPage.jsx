import React, { useEffect } from 'react';
import { SignIn, SignedOut } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useApi } from "../utils/api";

// export default function SignInPage() {
//   const { isSignedIn } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isSignedIn) {
//       navigate("/dashboard", { replace: true });
//     }
//   }, [isSignedIn, navigate]);

//   return (
//     <div className="auth-container h-screen w-screen bg-[#111418]">
//       <SignedOut>
//         <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
//       </SignedOut>
//     </div>
//   );
// }

export default function SignInPage() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const { makeRequest } = useApi();

  useEffect(() => {
    const checkUserRole = async () => {
      if (isSignedIn && user) {
        try {
          const data = await makeRequest(`check-role?role=${user.publicMetadata.role}`);
          if (data.status === "success") {
            if (data.role.toLowerCase() === "admin") {
              navigate("/admin-dashboard", { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          } else {
            alert("User role not found or invalid");
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    checkUserRole();
  }, [isSignedIn, user, navigate]);

  return (
    <div className="auth-container h-screen w-screen bg-[#111418]">
      <SignedOut>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/check-role-redirect"
        />
      </SignedOut>
    </div>
  );
}
