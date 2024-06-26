import { useLoaderData } from "react-router-dom";
import SectionTitle from "../../../Component/SectionTitle/SectionTitle";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseAxiosPublic from "../../../Hooks/UseAxiosPublic";
import { FaUtensils } from "react-icons/fa";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateItem = () => {
  const { name, category, recipe, price, _id } = useLoaderData();
  const { register, handleSubmit } = useForm();
  // console.log(item);

  const axiosPublic = UseAxiosPublic();
  const axiosSecure = UseAxiosSecure();

  const onSubmit = async (data) => {
    console.log(data);
    //image upload imbb and get an url
    const imageFile = { image: data.image[0] };
    const res = await axiosPublic.post(image_hosting_api, imageFile, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    if (res.data.success) {
      // now send the menu item data to the server with the image

      const menuItem = {
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        recipe: data.recipe,
        image: res.data.data.display_url,
      };
      //
      const menuResponse = await axiosSecure.patch(`/menu/${_id}`, menuItem);
      console.log(menuResponse.data);
      if (menuResponse.data.modifiedCount > 0) {
        // show success popup
        //   reset()
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${data.name} updated to the menu`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
    console.log("with img url", res.data);
  };

  return (
    <div>
      <SectionTitle
        heading="Update an Item"
        subHeading="Refresh Info"
      ></SectionTitle>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full my-6">
            <div className="label">
              <span className="label-text">Recipe Name</span>
            </div>
            <input
              defaultValue={name}
              type="text"
              placeholder="Recipe Name"
              {...register("name", { required: true })}
              required
              className="input input-bordered w-full "
            />
          </div>

          <div className="flex gap-6">
            {/* category */}
            <div className="form-control w-full my-6">
              <div className="label">
                <span className="label-text">Category</span>
              </div>
              <select
                defaultValue={category}
                {...register("category", { required: true })}
                className="select select-bordered w-full "
              >
                <option disabled value="default">
                  select a category
                </option>
                <option value="salad">Salad</option>
                <option value="pizza">Pizza</option>
                <option value="soup">Soup</option>
                <option value="dessert">Dessert</option>
                <option value="drinks">Drinks</option>
              </select>
            </div>

            {/* price */}

            <div className="form-control w-full my-6">
              <div className="label">
                <span className="label-text">Price</span>
              </div>
              <input
                type="number"
                defaultValue={price}
                placeholder="Price"
                {...register("price", { required: true })}
                className="input input-bordered w-full "
              />
            </div>
          </div>

          {/* recipe details */}
          <div className="form-control">
            <div className="label">
              <span className="label-text">Recipe Details</span>
            </div>
            <textarea
              defaultValue={recipe}
              {...register("recipe", { required: true })}
              className="textarea textarea-bordered h-24"
              placeholder="Bio"
            ></textarea>
          </div>

          <div className="form-control w-full my-6">
            <input
              {...register("image", { required: true })}
              type="file"
              className="file-input w-full max-w-xs"
            />
          </div>

          <button className="btn bg-[#B58130] text-white">
            Update menu<FaUtensils></FaUtensils>{" "}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateItem;
