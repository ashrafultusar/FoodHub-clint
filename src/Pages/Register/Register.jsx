import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProviders/AuthProvider";
import UseAxiosPublic from "../../Hooks/UseAxiosPublic";
import Swal from "sweetalert2";
import SocialLogin from "../../Component/SocialLogin/SocialLogin";

const Register = () => {
  const axiosPublic = UseAxiosPublic();
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    createUser(data.email, data.password).then((result) => {
      const logUser = result.user;
      console.log(logUser);

      updateUserProfile(data.name, data.photoURL)
        .then(() => {
          //  create user entry in database
          const userInfo = {
            name: data.name,
            email: data.email,
          };
          axiosPublic.post("/users", userInfo).then((res) => {
            if (res.data.insertedId) {
              console.log(' added the database')
              // reset();
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "User created successfully.",
                showConfirmButton: false,
                timer: 1500,
              });
              navigate("/");
            }
          });
        })
        .catch((error) => console.log(error));
    });
  };

  return (
    <div>
      <Helmet>
        <title>FoodHub | Register</title>
      </Helmet>

      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center md:w-1/2 lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="card md:w-1/2 max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleSubmit(onSubmit)} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  {...register("name", { required: true })}
                  name="name"
                  className="input input-bordered"
                />
                {errors.name && (
                  <span className="text-red-600">This field is required</span>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Photo Url</span>
                </label>
                <input
                  type="text"
                  placeholder="Photo url"
                  {...register("photourl", { required: true })}
                  className="input input-bordered"
                />
                {errors.photourl && (
                  <span className="text-red-600">This field is required</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="email"
                  name="email"
                  className="input input-bordered"
                />
                {errors.name && (
                  <span className="text-red-600">This field is required</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  className="input input-bordered"
                  {...register("password", {
                    required: true,
                    minLength: 6,
                    maxLength: 20,
                    // pattern:
                    //   /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])$/
                  })}
                />
                {/* {errors.password?.type === "required" && (
                  <span className="text-red-600">password is required</span>
                )}
                {errors.password?.type === "minLength" && (
                  <span className="text-red-600">
                    password must be 6 character
                  </span>
                )}
                {errors.password?.type === "maxLength" && (
                  <span className="text-red-600">
                    password must be less then 20 character
                  </span>
                )}
                {errors.password?.type === "pattern" && (
                  <span className="text-red-600">
                    password must have one upper case, one lower case, one number and one special character
                  </span>
                )} */}

                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">
                    Forgot password?
                  </a>
                </label>
              </div>

              <input
                type="submit"
                className=" btn border-0 bg-[#D1A054B2]"
                value="Register"
              />

            
            </form>

            <div className="pb-6 mx-8">
              <SocialLogin></SocialLogin>
            </div>
            <p className="pb-6 text-center">
            <small>
                  Already have an account? Please
                  <Link
                    className="text-orange-500  font-bold uppercase"
                    to="/login"
                  >
                    Login
                  </Link>
                </small>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
