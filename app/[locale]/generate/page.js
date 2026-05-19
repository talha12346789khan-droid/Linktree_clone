"use client";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import LinkIconComponent from "@/component/LinkIcon";
import TemplatePicker from "@/component/TemplatePicker";
import { DEFAULT_TEMPLATE_ID } from "@/lib/templates";
import { normalizeLinks, emptyLink, linksForSave } from "@/lib/profileLinks";
import { getTemplateById } from "@/lib/templates";

const GenerateContent = () => {
  const t = useTranslations("generate");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [handle, setHandle] = useState(searchParams.get("handle"));
  const [links, setLinks] = useState([emptyLink()]);
  const [linkPicture, setLinkPicture] = useState("");
  const [description, setDescription] = useState("");
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [handleCheckCompleted, setHandleCheckCompleted] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/generate");
      setHandle(null);
      setLinks([emptyLink()]);
      setLinkPicture("");
      setDescription("");
      setTemplateId(DEFAULT_TEMPLATE_ID);
      setIsEditing(false);
      setHandleCheckCompleted(false);
    }
  }, [status, router]);

  const applyProfileData = (result) => {
    setLinks(
      normalizeLinks(result.links || []).length
        ? normalizeLinks(result.links)
        : [emptyLink()]
    );
    setLinkPicture(result.picture || "");
    setDescription(result.description || "");
    setTemplateId(result.templateId || DEFAULT_TEMPLATE_ID);
    setIsEditing(true);
  };

  useEffect(() => {
    const checkHandle = async () => {
      if (handle) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/edit?handle=${handle}`);
          const result = await response.json();
          if (result.success) {
            applyProfileData(result.result);
          }
        } catch (error) {
          console.error("Error fetching handle:", error);
        } finally {
          setIsLoading(false);
          setHandleCheckCompleted(true);
        }
      } else if (status === "authenticated") {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/user/handle`);
          const result = await response.json();
          if (result.success && result.result) {
            setHandle(result.result.handle);
            applyProfileData(result.result);
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
    setLinks([...links, emptyLink()]);
  };

  const updateLink = (index, field, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setLinks(updatedLinks);
  };

  const removeLink = (index) => {
    if (links.length <= 1) {
      setLinks([emptyLink()]);
      return;
    }
    setLinks(links.filter((_, i) => i !== index));
  };

  const moveLink = (index, direction) => {
    const next = index + direction;
    if (next < 0 || next >= links.length) return;
    const updated = [...links];
    [updated[index], updated[next]] = [updated[next], updated[index]];
    setLinks(updated);
  };

  const toggleLinkEnabled = (index) => {
    const updated = [...links];
    updated[index] = {
      ...updated[index],
      enabled: updated[index].enabled === false,
    };
    setLinks(updated);
  };

  const getPayloadLinks = () => linksForSave(links);

  const hasEnabledValidLink = () =>
    getPayloadLinks().some((l) => l.enabled && l.name && l.url);

  const submitAllLinks = async () => {
    if (!handle) {
      toast.error(t("fillHandle"));
      return;
    }
    if (!hasEnabledValidLink()) {
      toast.error(t("needEnabledLink"));
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        links: getPayloadLinks(),
        handle,
        picture: linkPicture,
        description,
        templateId,
      };
      if (isEditing) {
        const success = await editLinks(payload);
        if (success) toast.success(t("updated"));
      } else {
        const success = await addLinks(payload);
        if (success) {
          toast.success(t("created"));
          setIsEditing(true);
          try {
            const response = await fetch(`/api/edit?handle=${handle}`);
            const result = await response.json();
            if (result.success && result.result) {
              applyProfileData(result.result);
            }
          } catch (error) {
            console.error("Error refetching after creation:", error);
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

  const isFormValid = () => !!handle && hasEnabledValidLink();

  const addLinks = async (payload) => {
    try {
      const r = await fetch("/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await r.json();
      if (result.success) {
        toast.success(result.message);
        return true;
      }
      toast.error(result.message);
      return false;
    } catch (error) {
      console.error("Error adding links:", error);
      toast.error("Failed to add links. Please check your connection.");
      return false;
    }
  };

  const editLinks = async (payload) => {
    try {
      const r = await fetch("/api/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await r.json();
      if (result.success) {
        toast.success(result.message);
        return true;
      }
      toast.error(result.message);
      return false;
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
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete your handle "@${handle}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const r = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });
      const result = await r.json();
      if (result.success) {
        toast.success("Handle deleted successfully! Redirecting...");
        setTimeout(() => {
          setHandle("");
          setLinks([emptyLink()]);
          setLinkPicture("");
          setDescription("");
          setTemplateId(DEFAULT_TEMPLATE_ID);
          setIsEditing(false);
          router.push("/");
        }, 1500);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting handle:", error);
      toast.error("Failed to delete handle. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const previewTheme = getTemplateById(templateId);
  const previewLinks = getPayloadLinks().filter((l) => l.enabled && l.name && l.url);

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 p-4 md:p-6">
      <ToastContainer />

      {status === "loading" && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-white md:text-2xl">{tCommon("loading")}</p>
        </div>
      )}

      {status === "unauthenticated" && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-white md:text-2xl">{t("redirectLogin")}</p>
        </div>
      )}

      {status === "authenticated" && (
        <div className="my-4 md:my-10 max-w-2xl mx-auto">
          <div className="flex flex-col mt-50 md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8 bg-white rounded-lg p-4 shadow-lg">
            <div>
              <p className="text-gray-700 font-semibold text-sm md:text-base">{tNav("loggedInAs")}</p>
              <p className="text-purple-600 font-bold text-sm md:text-lg truncate">
                {session?.user?.email}
              </p>
              {isEditing && handle && (
                <p className="text-gray-600 text-xs md:text-sm mt-1">
                  {tNav("handle")} <span className="font-bold">@{handle}</span>
                </p>
              )}
            </div>
            <div className="flex gap-2 w-full md:w-auto flex-col md:flex-row">
              {isEditing && handle && (
                <button
                  onClick={() => window.open(`/${handle}`, "_blank")}
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
                >
                  {t("viewProfile")}
                </button>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition text-sm md:text-base"
              >
                {tCommon("signOut")}
              </button>
            </div>
          </div>

          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              {isEditing ? t("editTitle") : t("claimTitle")}
            </h1>
            <p className="text-purple-100 text-sm md:text-base">
              {isEditing ? t("editSubtitle") : t("claimSubtitle")}
            </p>
          </div>

          {isEditing && handle && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded text-sm">
              <p className="font-semibold">📌 {t("oneHandleNote")}</p>
              <p>{t("oneHandleDesc")}</p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 mb-8 text-center">
              <p className="text-gray-600 text-sm md:text-base">{t("loadingProfile")}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-2xl p-4 md:p-8 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              {t("profileSetup")}
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("chooseHandle")}
                {isEditing && (
                  <span className="text-gray-500 text-xs ms-2">{t("cannotChange")}</span>
                )}
              </label>
              <input
                onChange={(e) => setHandle(e.target.value)}
                disabled={isEditing}
                type="text"
                value={handle || ""}
                placeholder={t("handlePlaceholder")}
                className={`w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base ${
                  isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <TemplatePicker
              value={templateId}
              onChange={setTemplateId}
              disabled={isLoading}
            />

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("description")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
              />
              <p className="mt-1 text-xs text-gray-400">{description.length}/500</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("pictureUrl")}
              </label>
              <input
                value={linkPicture || ""}
                onChange={(e) => setLinkPicture(e.target.value)}
                type="text"
                placeholder={t("picturePlaceholder")}
                className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
              />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4 border-t pt-6">{t("yourLinks")}</h3>

            {links.map((link, index) => (
              <div
                key={index}
                className={`mb-6 rounded-xl border p-4 ${
                  link.enabled === false
                    ? "border-gray-200 bg-gray-50 opacity-75"
                    : "border-purple-100 bg-purple-50/30"
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-gray-700">{t("linkN", { n: index + 1 })}</span>
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => moveLink(index, -1)}
                      disabled={index === 0}
                      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold disabled:opacity-40"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveLink(index, 1)}
                      disabled={index === links.length - 1}
                      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold disabled:opacity-40"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleLinkEnabled(index)}
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        link.enabled !== false
                          ? "border-green-300 bg-green-50 text-green-800"
                          : "border-gray-300 bg-gray-200 text-gray-600"
                      }`}
                    >
                      {link.enabled !== false ? t("enabled") : t("disabled")}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700"
                    >
                      {tCommon("delete")}
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("linkName")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("linkNamePlaceholder")}
                    value={link.name}
                    onChange={(e) => updateLink(index, "name", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("linkUrl")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("linkUrlPlaceholder")}
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addNewLink}
              className="w-full md:w-fit bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-6 mb-6 rounded-lg hover:shadow-lg text-sm md:text-base"
            >
              {t("addLink")}
            </button>

            <button
              disabled={!isFormValid() || isLoading}
              onClick={submitAllLinks}
              className={`w-full font-bold py-2.5 md:py-3 rounded-lg transition mb-3 text-sm md:text-base ${
                isFormValid() && !isLoading
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
              }`}
            >
              {isLoading
                ? isEditing
                  ? t("updating")
                  : t("creating")
                : isEditing
                  ? t("updateBitlink")
                  : t("createBitlink")}
            </button>

            {isEditing && (
              <button
                disabled={isLoading}
                onClick={deleteHandle}
                className={`w-full font-bold py-3 rounded-lg transition ${
                  !isLoading
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed opacity-60"
                }`}
              >
                {isLoading ? t("deleting") : `🗑️ ${t("deleteHandle")}`}
              </button>
            )}
          </div>

          <div className={`rounded-lg shadow-2xl p-4 md:p-8 ${previewTheme.page}`}>
            <h2 className="text-xl font-bold text-white mb-4 text-center">{t("livePreview")}</h2>
            <div className={`mx-auto max-w-sm rounded-lg p-6 border ${previewTheme.card}`}>
              {linkPicture && (
                <img
                  src={linkPicture}
                  alt="Preview"
                  className={`mx-auto h-24 w-24 rounded-full border-4 object-cover ${previewTheme.avatarBorder}`}
                />
              )}
              <p className={`mt-3 text-center font-bold ${previewTheme.cardTitle}`}>
                @{handle || "yourhandle"}
              </p>
              {description && (
                <p className={`mt-2 text-center text-sm ${previewTheme.bio}`}>{description}</p>
              )}
              <div className="mt-4 space-y-2">
                {previewLinks.length > 0 ? (
                  previewLinks.map((link, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold ${previewTheme.button}`}
                    >
                      <LinkIconComponent linkName={link.name} />
                      <span>{link.name}</span>
                    </div>
                  ))
                ) : (
                  <p className={`text-center text-sm ${previewTheme.bio}`}>{t("addLinksAbove")}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function GenerateWrapper() {
  const tCommon = useTranslations("common");
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600">
          <p className="text-white">{tCommon("loading")}</p>
        </div>
      }
    >
      <GenerateContent />
    </Suspense>
  );
}

export default GenerateWrapper;
