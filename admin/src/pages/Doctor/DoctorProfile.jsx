import React, { useState, useEffect, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // fetch profile with loading
  const fetchProfile = async () => {
    try {
      setLoading(true);
      // assume getProfileData updates profileData in context
      await getProfileData();
    } catch (err) {
      console.error("Failed to fetch profile", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // update profile with loading
  const updateProfile = async () => {
    try {
      setLoading(true);
      const updateData = {
        address: profileData?.address,
        fees: profileData?.fees,
        available: profileData?.available,
        email: profileData?.email,
      };
      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message || "Profile updated");
        setIsEdit(false);
        await getProfileData();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Update failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dToken) {
      fetchProfile();
    } else {
      // no token -> no fetch, stop loader
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dToken]);

  // safe guards for profileData shape
  const safeProfile = profileData || {
    image: "",
    name: "",
    degree: "",
    speciality: "",
    experience: "",
    email: "",
    about: "",
    fees: "",
    address: { line1: "", line2: "" },
    available: false,
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <span className="w-12 h-12 my-1 rounded-full border-3 border-[#5f6FFF] border-t-transparent animate-spin"></span>
      </div>
    );
  }

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-[#5f6FFF]/80 w-full sm:max-w-64 rounded-lg"
              src={safeProfile.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white dark:bg-gray-900">
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700 dark:text-gray-200">
              {safeProfile.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-300">
              <p>
                {safeProfile.degree} - {safeProfile.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {safeProfile.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium mt-2">
                <span className="text-gray-800 dark:text-gray-500">Email:</span>
                <span className="text-gray-600 dark:text-zinc-200">
                  {isEdit ? (
                    <input
                      className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                      type="email"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      value={safeProfile.email}
                    />
                  ) : (
                    safeProfile.email
                  )}
                </span>
              </p>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 dark:text-neutral-200 mt-3">
                About:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[700px] mt-1">{safeProfile.about}</p>
            </div>

            <p className="text-gray-600 dark:text-zinc-300 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800 dark:text-gray-100">
                {currency}{" "}
                {isEdit ? (
                  <input
                    className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={safeProfile.fees}
                  />
                ) : (
                  safeProfile.fees
                )}
              </span>
            </p>

            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm dark:text-gray-400">
                {isEdit ? (
                  <>
                    <input
                      className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mb-1 block"
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                      value={safeProfile.address.line1}
                    />
                    <input
                      className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block"
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                      value={safeProfile.address.line2}
                    />
                  </>
                ) : (
                  <>
                    {safeProfile.address.line1}
                    <br />
                    {safeProfile.address.line2}
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-1 pt-2 items-center">
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={!!safeProfile.available}
                type="checkbox"
                id="ava"
              />
              <label htmlFor="ava" className="select-none">
                Available
              </label>
            </div>

            {isEdit ? (
              <div className="flex gap-2 mt-5">
                <button
                  onClick={updateProfile}
                  className="px-4 py-1 border border-[#5f6FFF] text-sm rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEdit(false);
                    // refetch to reset any unsaved changes
                    fetchProfile();
                  }}
                  className="px-4 py-1 border border-gray-300 text-sm rounded-full hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-[#5f6FFF] text-sm rounded-full mt-5 hover:bg-[#5f6FFF] hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
