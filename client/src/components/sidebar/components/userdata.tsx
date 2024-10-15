import { LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "~/providers/authProvider";

const UserData = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const router = useRouter();
  return (
    <div className="mt-4 rounded-3xl bg-secondary px-6 py-2">
      {isLoggedIn ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserCircle size={36} />
            <div>
              <div className="font-semibold">{user?.name.toUpperCase()}</div>
              <div className="text-gray-400">{user?.email}</div>
            </div>
          </div>
          <div>
            <LogOut
              size={24}
              className="hover:text-primary-dark cursor-pointer text-gray-400"
              onClick={() => {
                console.log("Logout");
                logout();
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          {/* <div className="text-center text-gray-400">Not Logged In</div> */}
          <div>
            <button
              className="w-full rounded-3xl bg-primary py-2 text-black"
              onClick={() => {
                console.log("Login");
                router.push("/login");
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserData;
