/* empty css                           */
import { A as AstroError, c as InvalidImageService, d as ExpectedImageOptions, E as ExpectedImage, e as createAstro, f as createComponent, g as ImageMissingAlt, r as renderTemplate, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, i as renderComponent, j as renderSlot, k as renderHead } from '../astro__sMq-JOL.mjs';
import 'kleur/colors';
import 'clsx';
import { i as isESMImportedImage, a as isLocalService, b as isRemoteImage, D as DEFAULT_HASH_PROPS } from '../astro/assets-service_2DKKmT7a.mjs';

async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await import(
      // @ts-expect-error
      '../astro/assets-service_2DKKmT7a.mjs'
    ).then(n => n.g).catch((e) => {
      const error = new AstroError(InvalidImageService);
      error.cause = e;
      throw error;
    });
    if (!globalThis.astroAsset)
      globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  if (typeof options.src === "undefined") {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        options.src,
        "undefined",
        JSON.stringify(options)
      )
    });
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: typeof options.src === "object" && "then" in options.src ? (await options.src).default ?? await options.src : options.src
  };
  const originalPath = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.fsPath : resolvedOptions.src;
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
    // @ts-expect-error - clone is a private, hidden prop
    resolvedOptions.src.clone ?? resolvedOptions.src
  ) : resolvedOptions.src;
  resolvedOptions.src = clonedSrc;
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig) : resolvedOptions;
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig) : [];
  let imageURL = await service.getURL(validatedOptions, imageConfig);
  let srcSets = await Promise.all(
    srcSetTransforms.map(async (srcSet) => ({
      transform: srcSet.transform,
      url: await service.getURL(srcSet.transform, imageConfig),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }))
  );
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    imageURL = globalThis.astroAsset.addStaticImage(validatedOptions, propsToHash, originalPath);
    srcSets = srcSetTransforms.map((srcSet) => ({
      transform: srcSet.transform,
      url: globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash, originalPath),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }));
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    src: imageURL,
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig) : {}
  };
}

const $$Astro$5 = createAstro();
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  const image = await getImage(props);
  const additionalAttributes = {};
  if (image.srcSet.values.length > 0) {
    additionalAttributes.srcset = image.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(additionalAttributes)}${spreadAttributes(image.attributes)}>`;
}, "/workspaces/blog-v2/node_modules/astro/components/Image.astro", void 0);

const $$Astro$4 = createAstro();
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Picture;
  const defaultFormats = ["webp"];
  const defaultFallbackFormat = "png";
  const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
  const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  const optimizedImages = await Promise.all(
    formats.map(
      async (format) => await getImage({ ...props, format, widths: props.widths, densities: props.densities })
    )
  );
  let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
  if (!fallbackFormat && isESMImportedImage(props.src) && specialFormatsFallback.includes(props.src.format)) {
    resultFallbackFormat = props.src.format;
  }
  const fallbackImage = await getImage({
    ...props,
    format: resultFallbackFormat,
    widths: props.widths,
    densities: props.densities
  });
  const imgAdditionalAttributes = {};
  const sourceAdditionaAttributes = {};
  if (props.sizes) {
    sourceAdditionaAttributes.sizes = props.sizes;
  }
  if (fallbackImage.srcSet.values.length > 0) {
    imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_, image]) => {
    const srcsetAttribute = props.densities || !props.densities && !props.widths ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
    return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute("image/" + image.options.format, "type")}${spreadAttributes(sourceAdditionaAttributes)}>`;
  })} <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(imgAdditionalAttributes)}${spreadAttributes(fallbackImage.attributes)}> </picture>`;
}, "/workspaces/blog-v2/node_modules/astro/components/Picture.astro", void 0);

const imageConfig = {"service":{"entrypoint":"astro/assets/services/sharp","config":{}},"domains":[],"remotePatterns":[]};
					new URL("file:///workspaces/blog-v2/.vercel/output/static/");
					const getImage = async (options) => await getImage$1(options, imageConfig);

const logo = new Proxy({"src":"/_astro/logo.Fs2UBN7I.png","width":220,"height":289,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/workspaces/blog-v2/src/images/logo.png";
							}
							
							return target[name];
						}
					});

const $$Astro$3 = createAstro();
const $$Navbar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Navbar;
  return renderTemplate`${maybeRenderHead()}<nav class="bg-black text-spblue2 rounded-br-xl sticky font-poppins"> <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"> <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse"> ${renderComponent($$result, "Image", $$Image, { "src": logo, "class": "h-14", "alt": "The Logo", "width": 45, "height": 55 })} <span class="self-center text-2xl font-ultralight whitespace-nowrap font-poppins">&nbsp;&nbsp;Blog
</span></a> <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false"> <span class="sr-only">Open main menu</span> <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"></path> </svg> </button> <div class="hidden w-full md:block md:w-auto" id="navbar-default"> <ul class="flex flex-col p-4 md:p-0 mt-4 border font-light text-white rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 border-gray-700"> <li> <a href="/" class="block py-2 px-3 text-spblue2 rounded md:p-0 hover:text-sky-400" aria-current="page">Home</a> </li> <li> <a href="/articles" class="block py-2 px-3 text-spblue2 rounded md:p-0 hover:text-sky-400">All Articles</a> </li> <li> <a href="https://stockpile.so" class="block py-2 px-3 text-spblue1  rounded md:p-0 hover:text-sky-400">Main Site</a> </li> </ul> </div> </div> </nav> <!-- <nav class={\`fixed top-0 z-50 w-full flex justify-center \${scrolled
    ? " dark:bg-black/30 backdrop-blur-xl"
    : "bg-black/0"
    } z-30 transition-all\`}
  >
    <div class="w-[1280px] grid grid-cols-3 items-center h-16">
      <div class="relative md:hidden">
        <button
          class="inline-flex items-center px-4 py-2 focus:outline-none transition duration-1000"
          onClick={toggleDropdown}
        >
          {isOpen ? (
            <XCircleIcon class="w-6 h-6 md:hidden" />
          ) : (
            <Bars3Icon class="w-6 h-6 md:hidden" />
          )}
        </button>
        {isOpen && (
          <div class="absolute md:hidden w-40 mt-4 flex flex-col rounded-md shadow-lg bg-white dark:bg-black font-poppins text-sm">
            <a
              class="hover:bg-gradient-to-r font-poppins from-[#0090fe] to-[#00d8f4] p-2 rounded-md"
              href="/"
            >
              Home
            </a>
            <a
              class="hover:bg-gradient-to-r font-poppins from-[#0090fe] to-[#00d8f4] p-2 rounded-md"
              href="/recent"
            >
              Recent
            </a>
            <a
              class="hover:bg-gradient-to-r font-poppins from-[#0090fe] to-[#00d8f4] p-2 rounded-md"
              href="https://stockpile.so"
            >
              Main Site
            </a>
          </div>
        )}
      </div>
      <div class="md:flex space-x-4 hidden text-gray-900 justify-start dark:text-white font-poppins text-sm">
        {items}
      </div>

      <a href="/" class="block mx-auto">
        <Image
          priority
          src="/logo.svg"
          alt="Stockpile"
          width={30}
          height={30}
        />
      </a>

      <div class="flex space-x-4 justify-end items-center">
        <a href={"https://stockpile.so"}>
          <button
            class="px-2 md:flex space-x-2 items-center transition ease-in-out delay-110 hover:-translate-y-1 hover:scale-101 rounded-md bg-gradient-to-r from-[#0090fe] to-[#00d8f4] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white text-sm font-poppins text-white w-fit h-10 justify-center hidden"
          >
            <IconWindowMaximize stroke={1} size={24} />
            <span>Main Site</span>
          </button>
        </a>
      </div>
    </div>
  </nav> -->`;
}, "/workspaces/blog-v2/src/components/Navbar.astro", void 0);

const splogo = new Proxy({"src":"/_astro/splogo.novx2DYA.png","width":795,"height":145,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/workspaces/blog-v2/src/images/splogo.png";
							}
							
							return target[name];
						}
					});

const $$Astro$2 = createAstro();
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead()}<footer class="bg-black text-spblue2 rounded-tl-xl font-poppins"> <div class="container mx-auto mt-10 max-w-screen-xl px-8 pb-3"> <div class="flex flex-col md:flex-row justify-between px-6"> <div class="mt-10"> ${renderComponent($$result, "Image", $$Image, { "src": splogo, "alt": "Full Stockpile Logo", "height": 30, "width": 200, "class": "pb-6" })} <p class="text-white text-md">
Community dervied funding for the open internet.
</p> </div> <div class="mt-10"> <h3 class="text-xl font-semibold mb-6">General</h3> <ul class="text-white text-sm"> <li class="mb-5"> <a href="#">Home</a> </li> <li class="mb-5"> <a href="#">Explore</a> </li> <li class="mb-5"> <a href="#">Projects</a> </li> <li class="mb-5"> <a href="#">Grants</a> </li> </ul> </div> <div class="mt-10"> <h3 class="text-xl font-semibold mb-6">Support</h3> <ul class="text-white text-sm"> <li class="mb-5"> <a href="#">Documentation</a> </li> <li class="mb-5"> <a href="#">FAQ</a> </li> </ul> </div> <div class="mt-10"> <h3 class="text-xl font-semibold mb-6">Company</h3> <ul class="text-white text-sm"> <li class="mb-5"> <a href="#">About</a> </li> <li class="mb-5"> <a href="#">Blog</a> </li> <li class="mb-5"> <a href="#">Mission</a> </li> <li class="mb-5"> <a href="#">Partners</a> </li> </ul> </div> <div class="mt-10"> <h3 class="text-xl font-semibold mb-6">Legal</h3> <ul class="text-white text-sm"> <li class="mb-5"> <a href="#">Privacy</a> </li> <li class="mb-5"> <a href="#">Terms</a> </li> </ul> </div> </div> <hr class="w-100 h-1 mx-auto my-4 bg-gray-500 border-0 rounded md:my-10 "> <p class="pb-3 text-center text-gray-100">© 2024 Stockpile Labs, Inc. All rights reserved.</p> </div> </footer>`;
}, "/workspaces/blog-v2/src/components/Footer.astro", void 0);

const SITE_TITLE = "Stockpile Blog";
const SITE_DESCRIPTION = "Read updates, project highlights, guides, case studies, round reviews, and more from the Stockpile Team";
const HOMEPAGE_ARTICLE_LIMIT = 3;
const ARTICLES_PER_PAGE = 6;

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$MainLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const { title = " Updates from the Stockpile Team" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', '><script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.js" integrity="sha512-BJ/5sR2hFxQTKin/55JQCcMTObShDBAmVjL/3NR/MVcrhyOazJjAgvROem03+HYyGw16SVdSfoWCFGr9syxAKA==" crossorigin="anonymous" referrerpolicy="no-referrer"><\/script><title>', " | ", "</title>", '</head> <body class=""> ', ' <section class="container mx-auto max-w-screen-xl mt-10 px-8"> ', " </section> ", " </body></html>"])), addAttribute(SITE_DESCRIPTION, "content"), SITE_TITLE, title, renderHead(), renderComponent($$result, "Navbar", $$Navbar, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/workspaces/blog-v2/src/layouts/MainLayout.astro", void 0);

const error = new Proxy({"src":"/_astro/error-404.DseNikHR.png","width":512,"height":512,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/workspaces/blog-v2/src/images/error-404.png";
							}
							
							return target[name];
						}
					});

const $$Astro = createAstro();
const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$404;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "404" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col items-center justify-items-center gap-7 font-poppins"> ${renderComponent($$result2, "Image", $$Image, { "src": error, "alt": "404", "height": 250, "width": 250, "class": "mt-10 pb-3" })} <h1 class="text-5xl pb-3 text-bold text-center">Page Not Found</h1> <p class="text-2xl mb-10 pb-3 text-center">Sorry, we couldn't find the page you were looking for.</p> <a href="/" class="inline-block bg-spblue1 p-2 mb-6 hover:bg-spblue2 hover:text-white">Go Back Home</a> </div> ` })}`;
}, "/workspaces/blog-v2/src/pages/404.astro", void 0);

const $$file = "/workspaces/blog-v2/src/pages/404.astro";
const $$url = "/404";

const _404 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$MainLayout as $, ARTICLES_PER_PAGE as A, HOMEPAGE_ARTICLE_LIMIT as H, _404 as _, getConfiguredImageService as g, imageConfig as i };
