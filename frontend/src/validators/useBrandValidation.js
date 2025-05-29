import { useFlashFormStore } from "@/store/useFlashFormStore.js";

export function brandValidations() {
  const flashForm = useFlashFormStore();
  function correctBrandFormat(brand) {
    if (typeof brand.name !== "string" || brand.name === "") {
      return false;
    }
    if (brand.websiteUrl === "") brand.websiteUrl = null;
    if (brand.countryOfOrigin === "") brand.countryOfOrigin = null;
    return true;
  }
  function numberOfNameChar(brandName) {
    if (brandName.length > 30 || brandName < 1 || brandName === "") {
      flashForm.setMessage(
        "name",
        `Brand name must be 1-30 characters long.`,
        "m-1 p-1 px-2 bg-red-100 text-red-800 shadow itbms-message rounded-md",
      );
      return false;
    } else {
      flashForm.removeMessage("name");
      return true;
    }
  }
  function numberOfCountryOfOriginChar(countryOfOrigin) {
    if (countryOfOrigin === null) {
      flashForm.removeMessage("countryOfOrigin");
      return true;
    }
    if (countryOfOrigin.length > 80) {
      flashForm.setMessage(
        "countryOfOrigin",
        `Brand country of origin must be 1-80 characters long or not specified.`,
        "m-1 p-1 px-2 bg-red-100 text-red-800 shadow itbms-message rounded-md",
      );
      return false;
    } else {
      flashForm.removeMessage("countryOfOrigin");
      return true;
    }
  }
  function validWebsiteUrl(websiteUrl) {
    if (websiteUrl === "" || websiteUrl === null) {
      flashForm.removeMessage("websiteUrl");
      return true;
    }
    try {
      new URL(websiteUrl);
      flashForm.removeMessage("websiteUrl");
      return true;
    } catch {
      flashForm.setMessage(
        "websiteUrl",
        `Brand URL must be a valid URL or not specified.`,
        "m-1 p-1 px-2 bg-red-100 text-red-800 shadow itbms-message rounded-md",
      );
      return false;
    }
  }
  return {
    correctBrandFormat,
    numberOfNameChar,
    numberOfCountryOfOriginChar,
    validWebsiteUrl,
  };
}
