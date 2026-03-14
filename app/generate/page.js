"use client";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const Generate = () => {
   const searchParams = useSearchParams();
   const [handel, sethandel] = useState(searchParams.get("handel") );
   const [links, setLinks] = useState([{ name: "", url: "" }]);
  const [linkPicture, setLinkPicture] = useState("");

  const addNewLink = () => {
    setLinks([...links, { name: "", url: "" }]);
  };

  const updateLink = (index, field, value) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const submitAllLinks = async () => {
    if (!handel) {
      toast("Please fill in your handle");
      return;
    }
    const validLinks = links.filter(link => link.name && link.url);
    if (validLinks.length === 0) {
      toast("Please add at least one link");
      return;
    }
    await addLinks(validLinks, handel, linkPicture);
    setLinks([{ name: "", url: "" }]);
    setLinkPicture("");
  };

  const isFormValid = () => {
    if (!handel) return false;
    return links.some(link => link.name && link.url);
  };


  const addLinks = async (linksArray, handel, picture) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      links: linksArray,
      handel: handel,
      picture: picture,
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const r = await fetch("http://localhost:3000/api/add", requestOptions)
    const result = await r.json()
    if(result.success){
        toast.success(result.message)
        return true;
    }
    else{
     toast.error(result.message)
     return false;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-pink-600 p-6">
      <ToastContainer />
      <div className=" my-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="my-50 text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Claim Your LinkTree
          </h1>
          <p className="text-purple-200">
            Add your links and customize your profile
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Add New Link
          </h2>

          {/* Choose Your Handle Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choose Your Handle
            </label>
            <input
            onChange={e=>{sethandel(e.target.value)}}
              type="text"
              value={handel || ""}
              placeholder="e.g., @johndoe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Dynamic Link Inputs */}
          {links.map((link, index) => (
            <div key={index}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link Name {index + 1}
                </label>
                <input
                  type="text"
                  placeholder="e.g., My Portfolio"
                  value={link.name}
                  onChange={e => updateLink(index, "name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link URL {index + 1}
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={link.url}
                  onChange={e => updateLink(index, "url", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
          <button onClick={addNewLink} className="w-fit bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-2 mb-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200">
            Add Link
          </button>

          {/* Link Picture Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Link Picture
            </label>
            <input
             value={linkPicture || ""}
              onChange={e => setLinkPicture(e.target.value)}
              type="text"
              placeholder="Enter image URL for your link"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

          {/* Add Link Button */}
            <button 
              disabled={!isFormValid()}
              onClick={submitAllLinks} 
              className={`w-full font-bold py-3 rounded-lg transition duration-200 ${
                isFormValid()
                  ? "bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105 cursor-pointer"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
              }`}
            >
            Add your bitlink
          </button>
        </div>

        {/* Links Preview Section */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Links</h2>
          <p className="text-gray-500 text-center py-8">
            No links added yet. Start by adding your first link above!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Generate;
