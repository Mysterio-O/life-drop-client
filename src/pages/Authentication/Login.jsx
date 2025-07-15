import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { motion } from "motion/react";
import { useState } from "react";
import { setAccountToLocalStorage } from "../../hooks/getAccountsFromLocalStorage";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false)

  const [isClosed, setIsClosed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userCredentials = await loginUser(data.email, data.password);
      const user = userCredentials.user;
      const { displayName, photoURL } = user;

      const accountInfo = {
        email: user?.email, displayName, photoURL, provider: 'password'
      }
      setAccountToLocalStorage(accountInfo);

      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Logged In Successfully!',
        text: 'Redirecting to your LifeDrop dashboard...',
        timer: 1500,
        showConfirmButton: false,
        background: '#F9FAFB', // Light mode surface color
        customClass: {
          title: 'text-[#111827] dark:text-[#F8FAFC]',
          text: 'text-[#4B5563] dark:text-[#94A3B8]',
          popup: 'dark:bg-[#1E293B]' // Dark mode surface color
        }
      });
      navigate(`${from ? from : '/dashboard'}`);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Invalid email or password. Please try again.',
        confirmButtonColor: '#D32F2F', // Light mode error color
        customClass: {
          confirmButton: 'dark:bg-[#EF5350]' // Dark mode error color
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F172A] p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#111827] dark:text-[#F8FAFC]">
          Login to LifeDrop
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
            />
            {errors.email && (
              <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </motion.div>
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <input
              {...register("password", { required: "Password is required" })}
              type={`${isClosed ? 'text' : 'password'}`}
              placeholder="Password"
              className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350] relative"
            />
            <span
              onClick={() => setIsClosed(!isClosed)}
              className="absolute right-[31%] top-[59%]">
              {
                isClosed ? <FaEyeSlash size={30} />
                  : <FaEye size={30} />
              }


            </span>
            {errors.password && (
              <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </motion.div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full p-3 rounded-md bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors"
          >
            {
              !loading ? "Login" : <span className="loading loading-spinner loading-xl"></span>
            }
          </motion.button>
        </form>
        <p className="text-sm text-center mt-4 text-[#4B5563] dark:text-[#94A3B8]">
          Don’t have an account?{' '}
          <Link
            state={from}
            to="/register"
            className="text-[#D32F2F] dark:text-[#EF5350] hover:text-[#B71C1C] dark:hover:text-[#F44336]"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;