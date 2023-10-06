import loader from "app/_components/loader/loader.module.css";

export default function Loader() {
    return (
        <section
            className="w-screen h-screen fixed inset-0 flex items-center justify-center h-screen w-screen bg-black/75">
            <span className={`${loader.loader} w-12 h-12 relative before:absolute after:absolute before:content-[''] after:content-[''] before:w-[48em] after:w-[48em before:h-[48em] after:h-[48em before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 before:text-[0.5px] after:text-[1px] before:rounded-full after:rounded-full before:bg-no-repeat after:bg-no-repeat before:animate-blast after:animate-bounce after:bg-white`}> </span>
        </section>
    );
};