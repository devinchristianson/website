import { component$ } from "@builder.io/qwik";
import { IconOpenNew } from "~/components/icons/IconOpenNew";

export default component$(() => {
    return (
        <section class="px-6 sm:px-6 mx-auto max-w-3xl">
            <header>
                <h1
                    class="flex gap-[.5em] content-center justify-center text-center text-4xl md:text-5xl font-bold leading-tighter tracking-tighter mb-4 md:mb-8 font-heading"
                >
                    Resume <a class="content-center" href="https://docs.google.com/document/d/1fA914RbVw8dSnu54MOgBmPQbXrFRIChvCPrRrYO7_o0/edit?usp=sharing" target="_blank"><IconOpenNew class="w-10 h-10" /></a>
                </h1>
            </header>
            <div class="mx-auto bg-white w-[820px] h-[1300px] rounded-xl">
                <iframe
                    class="h-full w-full"
                    src="https://docs.google.com/document/d/e/2PACX-1vTWrWQReMhk31hFIB2zojjnzg4ufAXucBI4z7Kj4BCHMIViv4gYm1K4volnURzdZzGel7GO1qcm0TxQ/pub?embedded=true"
                />
            </div>
        </section>
    );
});