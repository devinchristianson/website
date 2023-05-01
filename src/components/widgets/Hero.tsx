import { component$ } from "@builder.io/qwik";

// @ts-ignore
import srcsetAvif from "~/assets/images/profile_pic.jpg?w=400;900&avif&srcset";
// @ts-ignore
import srcsetWebp from "~/assets/images/profile_pic.jpg?w=400;900&webp&srcset";
// @ts-ignore
import { src as placeholder } from "~/assets/images/profile_pic.jpg?width=400&metadata";

export default component$(() => {
  return (
    <section
      class={`bg-gradient-to-b md:bg-gradient-to-r from-white via-purple-50 to-sky-100 dark:bg-none mt-[-72px]`}
    >
      <div class="max-w-6xl mx-auto px-4 sm:px-6 md:flex md:h-screen 2xl:h-auto pt-[72px]">
        <div class="md:flex block lg:py-16 md:py-12 md:text-left py-12 text-center w-full">
          <div class="pb-12 md:pb-0 md:py-0 mx-auto md:pr-16 flex items-center basis-3/5">
            <div>
              <h1 class="text-5xl md:text-[3.48rem] font-bold leading-tighter tracking-tighter mb-4 font-heading px-4 md:px-0">
                Cybersecurity nerd <br class="hidden lg:block" />{" "}
              </h1>
              <div class="max-w-3xl mx-auto">
                <p class="text-xl text-gray-600 mb-8 dark:text-slate-400">
                Enjoys playing defense, building custom tooling, <br/> and learning + applying new skills w/ modern tech
                </p>
                <div class="max-w-xs sm:max-w-md flex flex-nowrap flex-col sm:flex-row gap-4 m-auto md:m-0 justify-center md:justify-start">
                  <div class="flex w-full sm:w-auto">
                  <form action="https://www.w3docs.com/">
                    <button class="btn w-full bg-gray-50 dark:bg-transparent">
                      Learn more
                    </button>
                  </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="block md:flex items-center flex-1">
            <div class="relative m-auto max-w-4xl">
              <picture>
                <source srcSet={srcsetAvif} type="image/avif" />
                <source srcSet={srcsetWebp} type="image/webp" />
                <img
                  src={placeholder}
                  width={1000}
                  height={1250}
                  class="mx-auto w-full rounded-md md:h-full drop-shadow-2xl bg-gray-400 dark:bg-slate-700"
                  alt="Qwind Hero Image (Cool dog)"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
