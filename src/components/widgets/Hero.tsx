import { component$ } from "@builder.io/qwik";

import ProfilePic from "~/assets/images/profile_pic.jpg?jsx";

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
                Software Engineer, Security Enthusiuast, Tool builder <br class="hidden lg:block" />{" "}
              </h1>
              <div class="max-w-3xl mx-auto">
                <p class="text-xl text-gray-600 mb-8 dark:text-slate-400">
                I'm a voracious learner who enjoys exploring new concepts, going deep on unfamiliar concepts, and doing deep dives to find the root cause of incidents. I believe in an incremental software design process and 
                building easily maintainable systems. Join me on this journey of infrastructure building and discovery.
                </p>
                <div class="max-w-xs sm:max-w-md flex flex-nowrap flex-col sm:flex-row gap-4 m-auto md:m-0 justify-center md:justify-start">
                  <div class="flex w-full sm:w-auto">
                  {/*<form action="/resume">
                  <button class="btn w-full bg-gray-50 dark:bg-transparent">
                      Learn more
                  </button>
                  </form>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="block md:flex items-center flex-1">
            <div class="relative m-auto max-w-4xl">
              <ProfilePic/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
