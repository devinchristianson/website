import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import { IconLinkedIn } from "~/components/icons/IconLinkedIn";
import { IconGithub } from "~/components/icons/IconGithub";

export default component$(() => {


  const social = [
    { label: "LinkedIn", icon: IconLinkedIn, href: "https://www.linkedin.com/in/devin-christianson" },
    {
      label: "Github",
      icon: IconGithub,
      href: "https://github.com/devinchristianson/",
    },
  ];

  return (
    <footer class="border-t border-gray-200 dark:border-slate-800">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="md:flex md:items-center md:justify-between py-6 md:py-8">
          <ul class="flex mb-4 md:order-1 -ml-2 md:ml-4 md:mb-0">
            {social.map(({ label, href, icon: Icon }, index) => (
              <li key={`social-${index}`}>
                <Link
                  class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center"
                  aria-label={label}
                  title={label}
                  href={href}
                >
                  {Icon && <Icon />}
                </Link>
              </li>
            ))}
          </ul>

          <div class="text-sm text-gray-700 mr-4 dark:text-slate-400">
            <span class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 float-left rounded-sm bg-[url(https://qwind.pages.dev/favicon.svg)]"></span>
            Made using the{" "}
            <a
              class="text-secondary-700 hover:underline dark:text-gray-200"
              href="https://github.com/onwidget/qwind"
            >
              {" "}
              Qwind Template
            </a>{" "}
            · Icons by <a href="https://icons8.com/" class="text-secondary-700 hover:underline dark:text-gray-200">Icons8</a>
          </div>
        </div>
      </div>
    </footer>
  );
});
