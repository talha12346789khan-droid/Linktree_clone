"use client";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import LinkIconComponent from "@/component/LinkIcon";

const GenerateContent = () => {
   const router = useRouter();
   const { data: session, status } = useSession();
   const searchParams = useSearchParams();
   const [handle, setHandle] = useState(searchParams.get("handle") );
   const [links, setLinks] = useState([{ name: "", url: "" }]);
   const [linkPicture, setLinkPicture] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [handleCheckCompleted, setHandleCheckCompleted] = useState(false);

   // Redirect to sign-in if not authenticated
   useEffect(() => {
     if (status === "unauthenticated") {
       router.push("/auth/signin?callbackUrl=/generate");
       // Reset state on logout
       setHandle(null);
       setLinks([{ name: "", url: "" }]);
       setLinkPicture("");
       setIsEditing(false);
       setHandleCheckCompleted(false);
     }
   }, [status, router]);

   // Fetch existing handle data if it exists
   useEffect(() => {
     const checkHandle = async () => {
       if (handle) {
         // If handle is provided via URL param, fetch it
         try {
           setIsLoading(true);
           const response = await fetch(`/api/edit?handle=${handle}`);
           const result = await response.json();
           if (result.success) {
             // Handle exists, load existing data
             setLinks(result.result.links || [{ name: "", url: "" }]);
             setLinkPicture(result.result.picture || "");
             setIsEditing(true);
           }
         } catch (error) {
           console.error("Error fetching handle:", error);
         } finally {
           setIsLoading(false);
           setHandleCheckCompleted(true);
         }
       } else if (status === "authenticated") {
         // If no handle param but user is authenticated, fetch their handle
         try {
           setIsLoading(true);
           const response = await fetch(`/api/user/handle`);
           const result = await response.json();
           if (result.success && result.result) {
             // User has an existing handle, load it
             setHandle(result.result.handle);
             setLinks(result.result.links || [{ name: "", url: "" }]);
             setLinkPicture(result.result.picture || "");
             setIsEditing(true);
           } else {
             // No existing handle, allow creating new one
             console.log("No existing handle found for user");
           }
         } catch (error) {
           console.error("Error fetching user handle:", error);
           toast.error("Failed to load your profile. Please try refreshing the page.");
         } finally {
           setIsLoading(false);
           setHandleCheckCompleted(true);
         }
       }
     };
     checkHandle();
   }, [handle, status]);

  const addNewLink = () => {
    setLinks([...links, { name: "", url: "" }]);
  };

  const updateLink = (index, field, value) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const submitAllLinks = async () => {
    if (!handle) {
      toast.error("Please fill in your handle");
      return;
    }
    
    // Prevent creating a new handle if already editing
    if (!isEditing && handleCheckCompleted) {
      // This is a safety check - if we've completed the check and are NOT editing,
      // and user tries to create, verify backend will catch it
      console.log("Creating new handle - backend will validate");
    }
    
    const validLinks = links.filter(link => link.name && link.url);
    if (validLinks.length === 0) {
      toast.error("Please add at least one link");
      return;
    }
    
    setIsLoading(true);
    try {
      if (isEditing) {
        const success = await editLinks(validLinks, handle, linkPicture);
        if (success) {
          toast.success("Profile updated successfully!");
        }
      } else {
        const success = await addLinks(validLinks, handle, linkPicture);
        if (success) {
          toast.success("Your bitlink created successfully!");
          setIsEditing(true);
          
          // Refetch the saved data from database
          try {
            const response = await fetch(`/api/edit?handle=${handle}`);
            const result = await response.json();
            if (result.success && result.result) {
              setLinks(result.result.links || [{ name: "", url: "" }]);
              setLinkPicture(result.result.picture || "");
            }
          } catch (error) {
            console.error("Error refetching after creation:", error);
            // Reset form to single empty link if refetch fails
            setLinks([{ name: "", url: "" }]);
            setLinkPicture("");
          }
        }
      }
    } catch (error) {
      console.error("Error submitting links:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (!handle) return false;
    return links.some(link => link.name && link.url);
  };


  const addLinks = async (linksArray, handle, picture) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        links: linksArray,
        handle: handle,
        picture: picture,
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const r = await fetch("/api/add", requestOptions)
      const result = await r.json()
      console.log("Add Links Response:", result);
      
      if(result.success){
          toast.success(result.message)
          return true;
      }
      else{
       toast.error(result.message)
       return false;
      }
    } catch (error) {
      console.error("Error adding links:", error);
      toast.error("Failed to add links. Please check your connection.");
      return false;
    }
  };

  const editLinks = async (linksArray, handle, picture) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        links: linksArray,
        handle: handle,
        picture: picture,
      });
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const r = await fetch("/api/edit", requestOptions)
      const result = await r.json()
      console.log("Edit Links Response:", result);
      
      if(result.success){
          toast.success(result.message)
          return true;
      }
      else{
       toast.error(result.message)
       return false;
      }
    } catch (error) {
      console.error("Error editing links:", error);
      toast.error("Failed to update links. Please check your connection.");
      return false;
    }
  };

  const deleteHandle = async () => {
    if (!handle) {
      toast.error("No handle to delete");
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete your handle "@${handle}"?\n\nThis action cannot be undone. Your profile and all links will be permanently deleted.`
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        handle: handle,
      });
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const r = await fetch("/api/delete", requestOptions)
      const result = await r.json()
      console.log("Delete Response:", result);
      
      if(result.success){
          toast.success("Handle deleted successfully! Redirecting...");
          setTimeout(() => {
            setHandle("");
            setLinks([{ name: "", url: "" }]);
            setLinkPicture("");
            setIsEditing(false);
            router.push("/");
          }, 1500);
      }
      else{
       toast.error(result.message)
      }
    } catch (error) {
      console.error("Error deleting handle:", error);
      toast.error("Failed to delete handle. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-4 md:p-6">
      <ToastContainer />
      
      {/* Loading state */}
      {status === "loading" && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-white md:text-2xl">Loading...</p>
        </div>
      )}

      {/* Authentication required state */}
      {status === "unauthenticated" && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-white md:text-2xl">Redirecting to login...</p>
        </div>
      )}

      {/* Main content - only show when authenticated */}
      {status === "authenticated" && (
      <div className="my-4 md:my-10 max-w-2xl mx-auto">
        {/* User Info Header */}
        <div className="flex flex-col mt-50 md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8 bg-white rounded-lg p-4 shadow-lg">
          <div>
            <p className="text-gray-700 font-semibold text-sm md:text-base">Logged in as:</p>
            <p className="text-purple-600 font-bold text-sm md:text-lg truncate">{session?.user?.email}</p>
            {isEditing && handle && (
              <p className="text-gray-600 text-xs md:text-sm mt-1">
                Handle: <span className="font-bold">@{handle}</span>
              </p>
            )}
          </div>
          <div className="flex gap-2  w-full md:w-auto flex-col md:flex-row">
            {isEditing && handle && (
              <button
                onClick={() => window.open(`/${handle}`, '_blank')}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
              >
                View Profile
              </button>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition text-sm md:text-base"
            >
              Sign Out
            </button>
          </div>
        </div>
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            {isEditing ? "Edit Your LinkTree" : "Claim Your LinkTree"}
          </h1>
          <p className="text-purple-100 text-sm md:text-base">
            {isEditing ? "Update your links and profile" : "Add your links and customize your profile"}
          </p>
        </div>

        {/* Info Message - One Handle Per User */}
        {isEditing && handle && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded text-sm">
            <p className="font-semibold">📌 One Handle Per Account</p>
            <p>You already have a handle. Each account can only have one handle. You can edit your existing handle and links below.</p>
          </div>
        )}

        {/* Warning if load failed */}
        {handleCheckCompleted && !isLoading && !isEditing && !handle && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded text-sm">
            <p className="font-semibold">⚠️ Unable to Load Profile</p>
            <p className="mb-3">We couldn't load your existing profile. If you have a handle, it should appear above after refreshing.</p>
            <button
              onClick={() => {
                setHandleCheckCompleted(false);
                window.location.reload();
              }}
              className="bg-yellow-600 text-white font-bold py-1 px-3 rounded hover:bg-yellow-700 transition text-xs"
            >
              🔄 Refresh Profile
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 mb-8 text-center">
            <p className="text-gray-600 text-sm md:text-base">Loading your profile...</p>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-2xl p-4 md:p-8 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            Add New Link
          </h2>

          {/* Choose Your Handle Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choose Your Handle
              {isEditing && <span className="text-gray-500 text-xs ml-2">(Cannot be changed)</span>}
            </label>
            <input
            onChange={e=>{setHandle(e.target.value)}}
              disabled={isEditing}
              type="text"
              value={handle || ""}
              placeholder="e.g., @johndoe"
              className={`w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base ${
                isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>

          {/* Dynamic Link Inputs */}
          {links.map((link, index) => (
            <div key={index}>
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link Name {index + 1}
                </label>
                <input
                  type="text"
                  placeholder="e.g., My Portfolio"
                  value={link.name}
                  onChange={e => updateLink(index, "name", e.target.value)}
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
                />
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link URL {index + 1}
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={link.url}
                  onChange={e => updateLink(index, "url", e.target.value)}
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
            </div>
          ))}
          <button onClick={addNewLink} className="w-full md:w-fit bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-4 md:px-6 mb-4 md:mb-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 text-sm md:text-base">
            + Add Link
          </button>

          {/* Link Picture Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Picture URL
            </label>
            <input
             value={linkPicture || ""}
              onChange={e => setLinkPicture(e.target.value)}
              type="text"
              placeholder="Enter image URL for your profile"
              className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
            />
          </div>

          {/* Add Link Button */}
            <button 
              disabled={!isFormValid() || isLoading}
              onClick={submitAllLinks} 
              className={`w-full font-bold py-2.5 md:py-3 rounded-lg transition duration-200 mb-3 text-sm md:text-base ${
                isFormValid() && !isLoading
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105 cursor-pointer"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
              }`}
            >
            {isLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update your bitlink" : "Add your bitlink")}
          </button>

          {/* Delete Button - Only show when editing */}
          {isEditing && (
            <button 
              disabled={isLoading}
              onClick={deleteHandle} 
              className={`w-full font-bold py-3 rounded-lg transition duration-200 ${
                !isLoading
                  ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg cursor-pointer"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
              }`}
            >
            {isLoading ? "Deleting..." : "🗑️ Delete my Handle"}
          </button>
          )}
        </div>

        {/* Links Preview Section */}
        <div className="bg-white rounded-lg shadow-2xl p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Your Links</h2>
          {links.filter(link => link.name && link.url).length > 0 ? (
            <div className="space-y-2 md:space-y-3">
              {links.filter(link => link.name && link.url).map((link, index) => {
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 md:p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 flex items-center gap-3 justify-center text-sm md:text-base"
                  >
                    <div className="flex-shrink-0">
                      <LinkIconComponent linkName={link.name} />
                    </div>
                    <span>{link.name}</span>
                  </a>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 text-sm md:text-base">
              No links added yet. Start by adding your first link above!
            </p>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

function GenerateWrapper() {
  return (
    <Suspense fallback={<div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600"><p className="text-white">Loading...</p></div>}>
      <GenerateContent />
    </Suspense>
  );
}

export default GenerateWrapper;
