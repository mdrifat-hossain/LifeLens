import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useApi } from "../../utils/api";

export default function RoleRedirect() {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { makeRequest } = useApi();

  useEffect(() => {
    const redirectByRole = async () => {
      if (isSignedIn && user) {
        try {
          const role = user.publicMetadata.role || "user";
          const data = await makeRequest(`check-role?role=${role}`);
          
          if (data.status === "success") {
            if (data.role.toLowerCase() === "admin") {
              navigate("/admin-dashboard", { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          } else {
            alert("User role not found or invalid");
            navigate("/", { replace: true });
          }
        } catch (err) {
          console.error(err);
          navigate("/", { replace: true });
        }
      }
    };

    redirectByRole();
  }, [isSignedIn, user, navigate]);

  return <div>Loading...</div>;
}
